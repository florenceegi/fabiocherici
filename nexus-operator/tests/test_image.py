# -*- coding: utf-8 -*-
"""
@package nexus-operator
@author  Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
@version 1.1.0 (Nexus Operator — fabiocherici.com)
@date    2026-06-15
@mission M-018
@purpose Test validazione immagine: data-URL valido (jpeg/png), forma non
         valida, MIME fuori allow-list, mismatch magic-bytes vs MIME dichiarato,
         base64 corrotto, oversize (gate anticipato sulla lunghezza base64 e
         gate reale sui byte decodificati), normalizzazione del data-URL.
"""

from __future__ import annotations

import base64
import io

import pytest
from PIL import Image

from app.image import (
    MAX_IMAGE_BYTES,
    MAX_IMAGE_PIXELS,
    MAX_IMAGE_SIDE,
    ImageValidationError,
    validate_image,
)

# Firme reali + payload minimo (il resto del file e' irrilevante per i magic bytes).
_JPEG_BYTES = b"\xff\xd8\xff\xe0" + b"\x00" * 16
_PNG_BYTES = b"\x89\x50\x4e\x47\x0d\x0a\x1a\x0a" + b"\x00" * 16


def _data_url(mime: str, raw: bytes) -> str:
    return f"data:{mime};base64,{base64.b64encode(raw).decode('ascii')}"


def _real_png(width: int, height: int) -> bytes:
    """Genera un PNG reale e decodificabile (per i test sulle dimensioni pixel)."""
    buf = io.BytesIO()
    Image.new("RGB", (width, height), (10, 20, 30)).save(buf, format="PNG")
    return buf.getvalue()


def _real_jpeg(width: int, height: int) -> bytes:
    buf = io.BytesIO()
    Image.new("RGB", (width, height), (10, 20, 30)).save(buf, format="JPEG")
    return buf.getvalue()


def test_valid_jpeg_accepted() -> None:
    raw = _real_jpeg(8, 8)
    result = validate_image(_data_url("image/jpeg", raw))
    assert result.mime == "image/jpeg"
    assert result.raw == raw
    assert result.byte_size == len(raw)


def test_valid_png_accepted() -> None:
    raw = _real_png(8, 8)
    result = validate_image(_data_url("image/png", raw))
    assert result.mime == "image/png"
    assert result.byte_size == len(raw)


def test_data_url_normalized_roundtrips() -> None:
    raw = _real_png(8, 8)
    result = validate_image(_data_url("image/png", raw))
    # Il data-URL normalizzato deve ridecodificare ai byte originali.
    again = validate_image(result.data_url)
    assert again.raw == raw


def test_uppercase_mime_accepted_and_lowered() -> None:
    result = validate_image(_data_url("IMAGE/JPEG", _real_jpeg(8, 8)))
    assert result.mime == "image/jpeg"


def test_empty_string_rejected() -> None:
    with pytest.raises(ImageValidationError) as exc:
        validate_image("")
    assert exc.value.code == "IMAGE_INVALID"


def test_not_data_url_rejected() -> None:
    with pytest.raises(ImageValidationError) as exc:
        validate_image("https://example.com/cat.png")
    assert exc.value.code == "IMAGE_INVALID"


def test_missing_base64_marker_rejected() -> None:
    raw_b64 = base64.b64encode(_PNG_BYTES).decode("ascii")
    with pytest.raises(ImageValidationError) as exc:
        validate_image(f"data:image/png,{raw_b64}")  # manca ;base64
    assert exc.value.code == "IMAGE_INVALID"


def test_disallowed_mime_rejected() -> None:
    with pytest.raises(ImageValidationError) as exc:
        validate_image(_data_url("image/gif", _PNG_BYTES))
    assert exc.value.code == "IMAGE_INVALID"


def test_svg_mime_rejected() -> None:
    # SVG = vettore di XSS/script: deve essere fuori allow-list.
    payload = base64.b64encode(b"<svg></svg>").decode("ascii")
    with pytest.raises(ImageValidationError) as exc:
        validate_image(f"data:image/svg+xml;base64,{payload}")
    assert exc.value.code == "IMAGE_INVALID"


def test_magic_bytes_mismatch_rejected() -> None:
    # MIME dichiarato jpeg ma byte reali PNG -> rifiuto (non fidarsi del header).
    with pytest.raises(ImageValidationError) as exc:
        validate_image(_data_url("image/jpeg", _PNG_BYTES))
    assert exc.value.code == "IMAGE_INVALID"


def test_png_declared_with_jpeg_bytes_rejected() -> None:
    with pytest.raises(ImageValidationError) as exc:
        validate_image(_data_url("image/png", _JPEG_BYTES))
    assert exc.value.code == "IMAGE_INVALID"


def test_corrupt_base64_rejected() -> None:
    with pytest.raises(ImageValidationError) as exc:
        validate_image("data:image/png;base64,@@@not-base64@@@")
    assert exc.value.code == "IMAGE_INVALID"


def test_empty_payload_rejected() -> None:
    with pytest.raises(ImageValidationError) as exc:
        validate_image("data:image/png;base64,")
    assert exc.value.code == "IMAGE_INVALID"


def test_oversize_decoded_rejected() -> None:
    # Immagine valida (magic bytes png) ma oltre 5MB decodificati.
    big = _PNG_BYTES + b"\x00" * (MAX_IMAGE_BYTES + 1)
    with pytest.raises(ImageValidationError) as exc:
        validate_image(_data_url("image/png", big))
    assert exc.value.code == "IMAGE_TOO_LARGE"


def test_oversize_early_gate_does_not_decode() -> None:
    # Stringa base64 enorme: deve essere rifiutata per lunghezza, code TOO_LARGE.
    huge = "data:image/png;base64," + ("A" * (MAX_IMAGE_BYTES * 2))
    with pytest.raises(ImageValidationError) as exc:
        validate_image(huge)
    assert exc.value.code == "IMAGE_TOO_LARGE"


# --- Decompression bomb / pixel-flood (M-017 punto 4) ---


def test_small_image_within_pixel_budget_accepted() -> None:
    # Immagine reale e piccola: dentro i limiti pixel -> accettata.
    result = validate_image(_data_url("image/png", _real_png(64, 64)))
    assert result.byte_size > 0


def test_image_exceeding_pixel_area_rejected() -> None:
    # Area > MAX_IMAGE_PIXELS ma byte piccoli (PNG comprimibile a tinta unita):
    # decompression bomb. Deve essere rifiutata come IMAGE_TOO_LARGE.
    side = int((MAX_IMAGE_PIXELS) ** 0.5) + 200  # area oltre il budget
    raw = _real_png(side, side)
    assert len(raw) < MAX_IMAGE_BYTES  # i byte passano il gate da 5MB
    with pytest.raises(ImageValidationError) as exc:
        validate_image(_data_url("image/png", raw))
    assert exc.value.code == "IMAGE_TOO_LARGE"


def test_image_exceeding_side_rejected() -> None:
    # Lato > MAX_IMAGE_SIDE anche se l'area complessiva fosse modesta.
    raw = _real_png(MAX_IMAGE_SIDE + 50, 4)
    with pytest.raises(ImageValidationError) as exc:
        validate_image(_data_url("image/png", raw))
    assert exc.value.code == "IMAGE_TOO_LARGE"


def test_truncated_image_bytes_rejected_as_invalid() -> None:
    # Magic bytes corretti ma contenuto non e' un'immagine decodificabile:
    # Pillow verify() fallisce -> IMAGE_INVALID (non un crash).
    with pytest.raises(ImageValidationError) as exc:
        validate_image(_data_url("image/png", _PNG_BYTES))
    assert exc.value.code == "IMAGE_INVALID"
