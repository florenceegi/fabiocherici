# -*- coding: utf-8 -*-
"""
@package nexus-operator
@author  Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
@version 1.0.0 (Nexus Operator — fabiocherici.com)
@date    2026-06-15
@mission M-017
@purpose Proxy server-side della vetrina (showcase): il widget frontend non puo'
         chiamare art.florenceegi.com cross-origin dal browser (CORS), quindi il
         backend Nexus interroga l'upstream e ne ripassa il subset di campi che
         servono alla vetrina (title/image_url/share_url/creator_name). Cache
         in-memory con TTL (~5 min) per non martellare l'upstream. Graceful: ogni
         fallimento (timeout/non-200/JSON invalido/shape inattesa) degrada a
         {"egis": []} -> la vetrina mostra stato vuoto, mai un errore al widget.
         Isolato da FastAPI per testabilita': dipende dalle porte Fetcher e Clock
         (DIP, PEP 544), entrambe iniettabili con fake nei test (zero rete).
"""

from __future__ import annotations

import logging
from collections.abc import Callable
from time import monotonic
from typing import Protocol, cast

import httpx

logger = logging.getLogger("nexus.showcase")

# Whitelist dei campi vetrina che ripassiamo al widget. `id` e qualsiasi altro
# campo upstream vengono scartati (allow-list, OWASP Proactive Controls C3:
# minimizziamo la superficie passata al frontend).
_SHOWCASE_FIELDS: tuple[str, ...] = ("title", "image_url", "share_url", "creator_name")

# Clock per misurare il TTL: time.monotonic (non time.time) perche' e' un orologio
# monotono dedicato a misurare intervalli, immune ai salti di wall-clock
# (docs.python.org/3 §time.monotonic). Iniettabile per test deterministici.
Clock = Callable[[], float]


class ShowcaseUpstreamError(RuntimeError):
    """Errore di dominio: l'upstream non ha prodotto un payload utilizzabile
    (timeout, status non-200, JSON non parsabile). Catturato dal service e
    tradotto in {"egis": []}. Non trasporta segreti, solo un messaggio diagnostico."""


class Fetcher(Protocol):
    """Porta HTTP (DIP/ISP): il service dipende da questa astrazione, non da
    httpx direttamente. Permette di iniettare un fake nei test (nessuna rete) e
    di sostituire il client senza toccare la logica di cache/mapping."""

    def fetch_json(self, url: str, *, timeout: float) -> dict[str, object]:
        """GET `url` con Accept: application/json. Ritorna il body decodificato
        come dict, oppure solleva ShowcaseUpstreamError su qualsiasi anomalia
        (status non-200, timeout, body non-JSON o non-oggetto)."""
        ...


class HttpxFetcher:
    """Implementazione di Fetcher su httpx (la dipendenza HTTP gia' presente nel
    venv). `transport` iniettabile permette httpx.MockTransport nei test senza
    rete reale. Mappa ogni anomalia in ShowcaseUpstreamError, senza loggare il
    body (potrebbe non contenere segreti, ma il fetcher non e' il punto in cui
    decidiamo cosa loggare: lo fa il service, con un messaggio neutro)."""

    def __init__(self, *, transport: httpx.BaseTransport | None = None) -> None:
        self._transport = transport

    def fetch_json(self, url: str, *, timeout: float) -> dict[str, object]:
        headers = {"Accept": "application/json"}
        try:
            with httpx.Client(transport=self._transport, timeout=timeout) as client:
                response = client.get(url, headers=headers)
        except httpx.HTTPError as exc:
            # Timeout, DNS, connessione rifiutata, ecc. str(exc) di httpx non
            # contiene segreti applicativi; il chiamante decide il livello di log.
            raise ShowcaseUpstreamError(f"http error: {type(exc).__name__}") from exc

        if response.status_code != 200:
            raise ShowcaseUpstreamError(f"non-200 status: {response.status_code}")

        try:
            body = response.json()
        except ValueError as exc:
            raise ShowcaseUpstreamError("invalid json body") from exc

        if not isinstance(body, dict):
            raise ShowcaseUpstreamError("json root is not an object")
        return cast("dict[str, object]", body)


def _normalize_egis(payload: dict[str, object]) -> list[dict[str, str]]:
    """Estrae e ripulisce la lista di egis dal payload upstream. Tiene SOLO i
    campi vetrina (allow-list _SHOWCASE_FIELDS) e SOLO le entry ben formate (dict
    con almeno `title` e `image_url` valorizzati come stringa). Le entry malformate
    vengono scartate silenziosamente: una singola opera storta non deve svuotare
    tutta la vetrina. Tutti i valori sono normalizzati a str (str() difensivo)."""
    raw = payload.get("egis")
    if not isinstance(raw, list):
        return []

    cleaned: list[dict[str, str]] = []
    for entry in raw:
        if not isinstance(entry, dict):
            continue
        title = entry.get("title")
        image_url = entry.get("image_url")
        # title e image_url sono i campi minimi per renderizzare una card.
        if not isinstance(title, str) or not title:
            continue
        if not isinstance(image_url, str) or not image_url:
            continue
        cleaned.append(
            {
                field: str(entry[field])
                for field in _SHOWCASE_FIELDS
                if isinstance(entry.get(field), (str, int, float))
            }
        )
    return cleaned


class ShowcaseService:
    """Orchestratore del proxy vetrina con cache TTL in-memory.

    Mantiene un singolo snapshot in cache (la vetrina e' globale, non per-utente)
    con il timestamp monotono di scadenza. Entro il TTL ritorna la copia cached
    senza toccare l'upstream; oltre il TTL (o a cache vuota) rifa' il fetch.
    SOLO i risultati riusciti vengono cached: un upstream fallito ritorna
    {"egis": []} ma NON viene memorizzato, cosi' la richiesta successiva ritenta
    (evita di congelare la vetrina vuota per 5 minuti dopo un glitch transitorio).
    """

    def __init__(
        self,
        *,
        upstream_url: str,
        fetcher: Fetcher,
        clock: Clock = monotonic,
        ttl_seconds: float = 300.0,
        timeout_seconds: float = 8.0,
    ) -> None:
        self._upstream_url = upstream_url
        self._fetcher = fetcher
        self._clock = clock
        self._ttl = ttl_seconds
        self._timeout = timeout_seconds
        self._cached_egis: list[dict[str, str]] | None = None
        self._expires_at: float = 0.0

    def get_showcase(self) -> dict[str, list[dict[str, str]]]:
        """Ritorna {"egis": [...]} per il widget. Mai solleva: ogni errore upstream
        e' tradotto in lista vuota. Usa la cache se ancora valida."""
        now = self._clock()
        if self._cached_egis is not None and now < self._expires_at:
            return {"egis": list(self._cached_egis)}

        try:
            payload = self._fetcher.fetch_json(self._upstream_url, timeout=self._timeout)
        except ShowcaseUpstreamError as exc:
            # Graceful degradation: vetrina vuota, mai un 5xx al widget.
            # Logghiamo un messaggio neutro (no URL completo con eventuali query,
            # no body): solo il tipo di fallimento. ULM/OWASP C9.
            logger.warning("Showcase upstream unavailable: %s", exc)
            return {"egis": []}

        egis = _normalize_egis(payload)
        self._cached_egis = egis
        self._expires_at = now + self._ttl
        logger.info("Showcase refreshed: %d egis", len(egis))
        return {"egis": list(egis)}
