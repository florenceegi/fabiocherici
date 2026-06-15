# -*- coding: utf-8 -*-
"""
@package nexus-operator
@author  Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
@version 1.1.0 (Nexus Operator — fabiocherici.com)
@date    2026-06-16
@mission M-017
@purpose Entry point FastAPI dell'operatore Nexus. Espone POST /chat (SSE
         text/event-stream via StreamingResponse) e GET /health. Porta
         FreeAiChatController::chat (validazione input + risposta streaming +
         header text/event-stream + X-Accel-Buffering:no). Usa StreamingResponse
         di Starlette (non sse-starlette): il formato SSE e' prodotto da sse.py
         per mantenere il contratto byte-per-byte col widget free-ai-chat.js.
"""

from __future__ import annotations

import logging
from collections.abc import Iterator
from datetime import timezone
from datetime import datetime as _datetime

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse, StreamingResponse

from . import db, ratelimit
from .config import Config, load_config
from .llm import OpenAIClient
from .operator import run_chat
from .prompt import ChatMessage
from .showcase import HttpxFetcher, ShowcaseService
from .validation import ChatRequest

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("nexus.main")

app = FastAPI(title="Nexus Operator", version="1.0.0")


def _middleware_allow_lists() -> tuple[tuple[str, ...], tuple[str, ...]]:
    """Allow-list (cors_origins, allowed_hosts) per i middleware, lette dalla
    config se l'env e' montato. Se la config non e' caricabile (es. import del
    modulo in test/CI senza env), usa i default sicuri canonici: i middleware
    devono registrarsi all'import dell'app, prima che l'env sia garantito."""
    try:
        config = load_config()
        return config.cors_origins, config.allowed_hosts
    except ValueError:
        return (
            ("https://fabiocherici.com", "https://www.fabiocherici.com"),
            ("nexus.fabiocherici.com", "localhost", "127.0.0.1"),
        )


# A05 (Security Misconfiguration): l'allow-list CORS/host e' enforced NEL
# servizio, non delegata solo a nginx. CORS allow-list stretta (no "*"), metodi
# limitati a GET/POST; TrustedHost respinge Host header inattesi (anti
# host-header poisoning). Configurabili via NEXUS_CORS_ORIGINS / NEXUS_ALLOWED_HOSTS.
_cors_origins, _allowed_hosts = _middleware_allow_lists()
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=list(_allowed_hosts),
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=list(_cors_origins),
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Accept"],
    allow_credentials=False,
    max_age=600,
)


def get_config() -> Config:
    """Carica la config (cache process-level su app.state). Lazy per non far
    fallire l'import del modulo se l'env non e' ancora montato (es. in test)."""
    cached = getattr(app.state, "config", None)
    if cached is None:
        cached = load_config()
        app.state.config = cached
    return cached


def get_showcase_service() -> ShowcaseService:
    """Ritorna il ShowcaseService (singleton process-level su app.state). DEVE
    essere singleton perche' la cache TTL in-memory vive nell'istanza: una
    nuova istanza per richiesta azzererebbe la cache a ogni chiamata. Lazy:
    non costruito all'import del modulo (l'env potrebbe non essere montato)."""
    cached = getattr(app.state, "showcase_service", None)
    if cached is None:
        config = get_config()
        cached = ShowcaseService(
            upstream_url=config.showcase_upstream,
            fetcher=HttpxFetcher(),
        )
        app.state.showcase_service = cached
    return cached


def _client_identifier(request: Request, session_id: str, salt: str) -> str:
    """Costruisce la chiave rate-limit PSEUDONIMIZZATA (GDPR B2). Preferisce
    l'IP (guest per IP, come FreeAiChatService); fallback al session_id. In
    ENTRAMBI i casi il valore grezzo (IP o session) NON viene mai persistito in
    chiaro: e' passato a ratelimit.pseudonymize (sha256 + salt rotante
    giornaliero). Questa stringa non e' un IP e comunque NON viene loggata."""
    client = request.client
    ip = client.host if client is not None else None
    day = _datetime.now(timezone.utc).date()
    if ip:
        return ratelimit.pseudonymize("ip", ip, salt, day)
    return ratelimit.pseudonymize("session", session_id, salt, day)


@app.get("/health")
def health() -> JSONResponse:
    """Liveness + DB reachability. Non espone segreti; riporta solo flag di
    stato. status 'ok' solo se il DB risponde."""
    try:
        config = get_config()
    except ValueError:
        # Config incompleta: il servizio non e' configurato.
        return JSONResponse({"status": "error", "db": False, "config": False}, status_code=503)

    db_ok = db.health_check(config)
    status_code = 200 if db_ok else 503
    return JSONResponse(
        {"status": "ok" if db_ok else "degraded", "db": db_ok, "config": config.has_secrets},
        status_code=status_code,
    )


@app.get("/showcase")
def showcase() -> JSONResponse:
    """Proxy server-side della vetrina: il widget non puo' chiamare l'upstream
    cross-origin (CORS), quindi il backend interroga art.florenceegi.com e
    ripassa il subset di campi vetrina. Risposta sempre 200 con {"egis": [...]}:
    su fallimento upstream la lista e' vuota (graceful), gestito dal service.
    Cache TTL ~5 min vive nel singleton: niente fetch a ogni richiesta."""
    result = get_showcase_service().get_showcase()
    return JSONResponse(result)


@app.post("/chat")
async def chat(payload: ChatRequest, request: Request) -> StreamingResponse:
    """Endpoint chat SSE. Pydantic valida il body (lunghezze/tipi/role allow-list)
    PRIMA di entrare qui; un body invalido ritorna 422 automatico (FastAPI).
    Apre una connessione DB per richiesta, esegue la pipeline operator.run_chat
    come stream, chiude la connessione a fine stream. Logga SOLO lunghezze
    (FreeAiChatController: message_length), mai valori."""
    config = get_config()
    identifier = _client_identifier(request, payload.session_id, config.ratelimit_salt)

    logger.info(
        "Chat request: message_len=%d session_prefix=%s history_len=%d has_image=%s",
        len(payload.message),
        payload.session_id[:8],
        len(payload.conversation_history),
        payload.image is not None,
    )

    # Secondo gate coerente con la config attiva (oltre ai limiti Pydantic).
    if len(payload.message) > config.max_message_length:
        return StreamingResponse(
            iter(['event: error\ndata: {"message": "Messaggio troppo lungo.", "code": "MESSAGE_TOO_LONG"}\n\n']),
            media_type="text/event-stream",
        )

    history: list[ChatMessage] = [
        {"role": entry.role, "content": entry.content}
        for entry in payload.conversation_history
    ]

    llm = OpenAIClient(
        api_key=config.openai_api_key,
        chat_model=config.chat_model,
        embedding_model=config.embedding_model,
        max_output_tokens=config.max_output_tokens,
        stream_timeout_seconds=config.stream_timeout_seconds,
    )

    def event_stream() -> Iterator[str]:
        conn = db.connect(config)
        try:
            cursor = conn.cursor()
            yield from run_chat(
                config=config,
                cursor=cursor,
                embedder=llm,
                llm=llm,
                message=payload.message,
                session_id=payload.session_id,
                conversation_history=history,
                identifier=identifier,
                image=payload.image,
            )
        finally:
            conn.close()

    # Header come FreeAiChatController: text/event-stream, no-cache,
    # X-Accel-Buffering:no (disattiva il buffering nginx -> streaming reale).
    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )
