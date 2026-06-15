# -*- coding: utf-8 -*-
"""
@package nexus-operator
@author  Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
@version 1.0.0 (Nexus Operator — fabiocherici.com)
@date    2026-06-15
@mission M-017
@purpose Pipeline dell'operatore: porta in Python FreeAiChatService::chat come
         generator di stringhe SSE. Ordine identico: rate-limit -> RAG ->
         build messages -> evento start -> stream LLM (chunk) -> increment ->
         complete. error in caso di limite/eccezione. Isolato da FastAPI
         (main.py) per testabilita': accetta porte (cursor, embedder, llm) e
         yielda stringhe SSE gia' formattate.
"""

from __future__ import annotations

import logging
from collections.abc import Iterator

from . import ratelimit
from .config import Config
from .image import ImageValidationError, validate_image
from .llm import OpenAIClient
from .prompt import ChatMessage, build_messages
from .rag import DbCursor, EmbeddingClient, retrieve
from .sse import format_sse

logger = logging.getLogger("nexus.operator")


def run_chat(
    *,
    config: Config,
    cursor: DbCursor,
    embedder: EmbeddingClient,
    llm: OpenAIClient,
    message: str,
    session_id: str,
    conversation_history: list[ChatMessage],
    identifier: str,
    image: str | None = None,
) -> Iterator[str]:
    """Esegue la pipeline e yielda eventi SSE gia' formattati. `identifier` e' la
    chiave rate-limit (es. 'ip:1.2.3.4'); costruita dal chiamante, mai loggata in
    chiaro. `cursor` deve supportare sia il retrieval RAG sia il rate-limit
    (stesso DB nexus_fabiocherici). `image`, se presente, e' un data-URL base64
    grezzo: viene VALIDATO qui (allow-list mime + magic bytes + dimensione) e, se
    valido, passato all'LLM come content-part immagine; un rifiuto emette un
    evento SSE `error` dedicato e ferma la pipeline."""

    # 0) Validazione immagine (se presente) PRIMA di consumare risorse (RAG/LLM).
    #    Mai loggare il contenuto: solo presente/mime/dimensione.
    image_data_url: str | None = None
    if image is not None:
        try:
            validated = validate_image(image)
        except ImageValidationError as exc:
            logger.info("Image rejected: code=%s", exc.code)
            yield format_sse("error", {"message": exc.message, "code": exc.code})
            return
        image_data_url = validated.data_url
        logger.info(
            "Image accepted: mime=%s bytes=%d", validated.mime, validated.byte_size
        )

    # 1) Rate-limit (come FreeAiChatService::chat: check PRIMA di tutto).
    try:
        if ratelimit.has_reached_limit(
            cursor, config.rag_schema, identifier, config.guest_daily_limit
        ):
            yield format_sse(
                "error",
                {
                    "message": "Hai raggiunto il limite giornaliero di richieste. "
                    "Scrivimi di nuovo domani, oppure prenota una prima chiamata.",
                    "code": "RATE_LIMIT_EXCEEDED",
                },
            )
            return
    except Exception:
        # Fail-open sul solo rate-limit causerebbe abuso; fail-closed e' piu' sicuro
        # ma blocca utenti legittimi su glitch DB. Scelta: log + error esplicito.
        logger.exception("Rate-limit check failed")
        yield format_sse(
            "error",
            {"message": "Servizio momentaneamente non disponibile.", "code": "RATE_LIMIT_ERROR"},
        )
        return

    # 2) RAG retrieval (best-effort: se fallisce, si continua senza contesto,
    #    come FreeAiChatService::searchRagKnowledge che cattura e prosegue).
    rag_chunks: list[dict[str, object]] = []
    try:
        rag_chunks = retrieve(
            cursor=cursor,
            embedder=embedder,
            schema=config.rag_schema,
            query_text=message,
            threshold=config.rag_threshold,
            limit=config.rag_limit,
        )
        logger.info("RAG context injected: %d chunks", len(rag_chunks))
    except Exception:
        logger.warning("RAG retrieval failed, continuing without context", exc_info=True)

    # 3) Build messages (system+RAG+history+user).
    messages = build_messages(
        user_message=message,
        conversation_history=conversation_history,
        rag_chunks=rag_chunks,
        max_history=config.max_history,
    )

    # 4) start (session info; nessun segreto).
    yield format_sse(
        "start",
        {"session_id": session_id, "rag_chunks": len(rag_chunks)},
    )

    # 5) Stream LLM (chunk reali).
    usage_payload: dict[str, object] = {}
    try:
        for piece in llm.stream_chat(messages, image_data_url=image_data_url):
            if piece.done:
                if piece.usage is not None:
                    usage_payload = {
                        "input_tokens": piece.usage.input_tokens,
                        "output_tokens": piece.usage.output_tokens,
                    }
                break
            yield format_sse("chunk", {"content": piece.content})
    except Exception:
        logger.exception("LLM streaming failed")
        yield format_sse(
            "error",
            {"message": "Si e' verificato un errore. Riprova tra poco.", "code": "LLM_FAILED"},
        )
        return

    # 6) Increment rate-limit DOPO una risposta riuscita (come PHP).
    try:
        ratelimit.increment(cursor, config.rag_schema, identifier)
    except Exception:
        logger.warning("Rate-limit increment failed", exc_info=True)

    # 7) complete.
    yield format_sse("complete", {"usage": usage_payload or None})
