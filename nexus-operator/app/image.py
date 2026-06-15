# -*- coding: utf-8 -*-
"""
@package nexus-operator
@author  Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
@version 1.2.0 (Nexus Operator — fabiocherici.com)
@date    2026-06-16
@mission M-017
@purpose Validazione rigorosa di un'immagine ricevuta come data-URL base64 sul
         confine pubblico /chat (OWASP Input Validation: allow-list dei tipi +
         "do not just trust the header from the upload" -> verifica i magic
         bytes reali, non solo il MIME dichiarato). Allow-list: image/jpeg,
         image/png. Limite 5MB sui byte DECODIFICATI, con gate ANTICIPATO sulla
         lunghezza base64 (stima dei byte) per non decodificare payload enormi
         (difesa DoS memoria). NON persiste nulla su disco: l'immagine resta in
         memoria, normalizzata e passata all'LLM, poi scartata. Non logga MAI il
         contenuto: il chiamante logga solo presente/mime/dimensione.
"""

from __future__ import annotations

import base64
import binascii
import io
import re
from dataclasses import dataclass

from PIL import Image, UnidentifiedImageError

# Allow-list dei MIME accettati (OWASP: definisci esattamente cosa E' autorizzato,
# tutto il resto e' negato). Mappa MIME dichiarato -> firma magic-bytes attesa.
_MAGIC_BYTES: dict[str, bytes] = {
    "image/jpeg": b"\xff\xd8\xff",  # JPEG SOI + marker
    "image/png": b"\x89\x50\x4e\x47\x0d\x0a\x1a\x0a",  # PNG 8-byte signature
}

# Tetto sui byte DECODIFICATI dell'immagine.
MAX_IMAGE_BYTES: int = 5 * 1024 * 1024  # 5 MB

# Tetti sulle DIMENSIONI in pixel (M-017 punto 4: decompression bomb). I magic
# bytes confermano "e' un PNG/JPEG valido all'header" ma NON limitano i pixel: un
# file piccolo a tinta unita decomprime a centinaia di megapixel -> costo/latenza
# (vision tokenizza per tile). Rifiutiamo oltre l'area o il lato massimo.
MAX_IMAGE_PIXELS: int = 25_000_000  # 25 megapixel
MAX_IMAGE_SIDE: int = 10_000  # px per lato

# Guard di Pillow contro le decompression bomb: oltre questa soglia Pillow stesso
# solleva durante la decodifica (difesa in profondita' oltre al check esplicito).
# Margine sopra MAX_IMAGE_PIXELS per distinguere il nostro rifiuto controllato
# dal guard di libreria.
Image.MAX_IMAGE_PIXELS = MAX_IMAGE_PIXELS * 2

# base64 espande ~4/3: 4 char per ogni 3 byte. Tetto sulla LUNGHEZZA della
# stringa base64 oltre cui rifiutiamo PRIMA di decodificare (DoS guard). Con un
# margine generoso evita falsi positivi su payload appena sotto il limite.
_MAX_B64_LEN: int = (MAX_IMAGE_BYTES // 3 + 1) * 4 + 4

# data-URL: "data:<mime>;base64,<payload>". Catturiamo mime e payload separati.
# Allow-list del solo schema base64 (no charset/altri parametri).
_DATA_URL_RE = re.compile(r"^data:([a-z]+/[a-z0-9.+-]+);base64,(.+)$", re.IGNORECASE)


class ImageValidationError(Exception):
    """Immagine rifiutata dalla validazione. `code` e' stabile per l'evento SSE
    (IMAGE_INVALID / IMAGE_TOO_LARGE); `message` e' breve e i18n-neutro."""

    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code
        self.message = message


@dataclass(frozen=True)
class ValidatedImage:
    """Immagine validata, pronta per l'LLM. Value object immutabile (PEP 557):
    `mime` nell'allow-list, `raw` i byte decodificati gia' entro il limite,
    `byte_size` la dimensione reale. `data_url` e' il data-URL NORMALIZZATO
    (mime canonico + payload base64 ripulito) da passare al content-part OpenAI."""

    mime: str
    raw: bytes
    byte_size: int
    data_url: str


def _estimate_decoded_size(b64_len: int, payload: str) -> int:
    """Stima i byte decodificati dalla lunghezza base64 senza decodificare:
    n_byte = 3 * (len/4) - padding. Usata solo per il gate anticipato; la
    dimensione REALE viene poi misurata sui byte decodificati."""
    padding = payload.count("=", max(0, len(payload) - 2))
    return (b64_len // 4) * 3 - padding


def _check_pixel_dimensions(raw: bytes) -> None:
    """Decodifica SOLO l'header per leggere le dimensioni e rifiuta le immagini
    troppo grandi in pixel (decompression bomb / pixel-flood). Usa Pillow:
    `Image.open` e' lazy (non carica i pixel), `.size` legge width/height
    dall'header, `.verify()` valida l'integrita' senza materializzare il raster.

    Solleva ImageValidationError(IMAGE_TOO_LARGE) oltre i limiti pixel,
    IMAGE_INVALID se i byte non sono un'immagine decodificabile/integra. Non
    rilancia mai un'eccezione Pillow grezza al chiamante (robustezza)."""
    try:
        with Image.open(io.BytesIO(raw)) as img:
            width, height = img.size
            if (
                width <= 0
                or height <= 0
                or width > MAX_IMAGE_SIDE
                or height > MAX_IMAGE_SIDE
                or width * height > MAX_IMAGE_PIXELS
            ):
                raise ImageValidationError(
                    "IMAGE_TOO_LARGE", "Immagine troppo grande (dimensioni)."
                )
            # verify() controlla l'integrita' del file (chiude l'oggetto): va
            # fatto su un Image.open separato, dopo aver letto size.
        with Image.open(io.BytesIO(raw)) as img_verify:
            img_verify.verify()
    except Image.DecompressionBombError as exc:
        # Guard di libreria scattato: trattalo come oversize controllato.
        raise ImageValidationError(
            "IMAGE_TOO_LARGE", "Immagine troppo grande (dimensioni)."
        ) from exc
    except (UnidentifiedImageError, OSError, ValueError) as exc:
        raise ImageValidationError(
            "IMAGE_INVALID", "Immagine non decodificabile."
        ) from exc


def validate_image(data_url: str) -> ValidatedImage:
    """Valida un'immagine data-URL base64. Ordine dei controlli pensato per
    fallire PRESTO e a basso costo (difesa DoS): forma data-URL -> MIME in
    allow-list -> gate anticipato sulla lunghezza base64 -> decodifica ->
    dimensione reale -> magic bytes reali coerenti col MIME dichiarato.

    Solleva ImageValidationError con code IMAGE_INVALID o IMAGE_TOO_LARGE. Non
    logga e non scrive nulla."""
    if not isinstance(data_url, str) or not data_url:
        raise ImageValidationError("IMAGE_INVALID", "Immagine non valida.")

    # Gate lunghezza grezza PRIMA del regex/decodifica (stringa abnorme -> DoS).
    if len(data_url) > _MAX_B64_LEN + 64:
        raise ImageValidationError("IMAGE_TOO_LARGE", "Immagine troppo grande.")

    match = _DATA_URL_RE.match(data_url)
    if match is None:
        raise ImageValidationError("IMAGE_INVALID", "Formato immagine non valido.")

    declared_mime = match.group(1).lower()
    payload = match.group(2)

    if declared_mime not in _MAGIC_BYTES:
        raise ImageValidationError("IMAGE_INVALID", "Tipo immagine non supportato.")

    # Gate anticipato: rifiuta payload base64 troppo lunghi prima di decodificare.
    if _estimate_decoded_size(len(payload), payload) > MAX_IMAGE_BYTES:
        raise ImageValidationError("IMAGE_TOO_LARGE", "Immagine troppo grande.")

    try:
        # validate=True: rifiuta caratteri fuori dall'alfabeto base64 (no garbage).
        raw = base64.b64decode(payload, validate=True)
    except (binascii.Error, ValueError) as exc:
        raise ImageValidationError(
            "IMAGE_INVALID", "Immagine non decodificabile."
        ) from exc

    byte_size = len(raw)
    if byte_size == 0:
        raise ImageValidationError("IMAGE_INVALID", "Immagine vuota.")
    if byte_size > MAX_IMAGE_BYTES:
        raise ImageValidationError("IMAGE_TOO_LARGE", "Immagine troppo grande.")

    # Verifica i MAGIC BYTES reali, non il MIME dichiarato (OWASP: "do not just
    # trust the header from the upload"). Devono combaciare col MIME dichiarato.
    signature = _MAGIC_BYTES[declared_mime]
    if not raw.startswith(signature):
        raise ImageValidationError(
            "IMAGE_INVALID", "Contenuto immagine non coerente col tipo."
        )

    # Decompression bomb / pixel-flood: leggi le dimensioni dall'header e rifiuta
    # oltre i limiti pixel. Verifica anche l'integrita' del file (verify()).
    _check_pixel_dimensions(raw)

    # data-URL normalizzato: payload base64 canonico (re-encode dai byte reali).
    normalized_payload = base64.b64encode(raw).decode("ascii")
    normalized_url = f"data:{declared_mime};base64,{normalized_payload}"

    return ValidatedImage(
        mime=declared_mime,
        raw=raw,
        byte_size=byte_size,
        data_url=normalized_url,
    )
