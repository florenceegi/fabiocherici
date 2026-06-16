# -*- coding: utf-8 -*-
"""
@package nexus-operator
@author  Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
@version 1.1.0 (Nexus Operator — fabiocherici.com)
@date    2026-06-16
@mission M-017, M-020
@purpose Pipeline dell'operatore: porta in Python FreeAiChatService::chat come
         generator di stringhe SSE. Ordine: rate-limit -> RAG ->
         build messages -> evento start -> stream LLM (chunk) -> increment ->
         complete. error in caso di limite/eccezione. Isolato da FastAPI
         (main.py) per testabilita': accetta porte (cursor, embedder, llm) e
         yielda stringhe SSE gia' formattate.
         M-020: l'immagine ricevuta viene ESTRATTA (una vision call) e
         PERSISTITA per sessione (filememory); tutti i file di sessione vengono
         iniettati nel prompt come DOCUMENTI CONDIVISI, valutati insieme anche
         nei turni successivi senza re-invio dell'immagine.
"""

from __future__ import annotations

import logging
from collections.abc import Iterator

from . import filememory, ratelimit
from .config import Config
from .image import ImageValidationError, validate_image
from .llm import OpenAIClient
from .prompt import ChatMessage, SharedFile, build_messages
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
    valido, il suo CONTENUTO viene ESTRATTO con UNA vision call dedicata e
    PERSISTITO per la sessione (app.filememory). I file gia' condivisi nella
    sessione vengono poi RICARICATI e iniettati nel prompt come blocco DOCUMENTI
    CONDIVISI (DATO, non istruzioni): cosi' Padmin valuta TUTTI i file insieme
    anche nei turni successivi, senza re-invio dell'immagine (una sola vision
    call per immagine). Un rifiuto immagine emette un evento SSE `error` dedicato
    e ferma la pipeline."""

    # 0) Validazione immagine (se presente) PRIMA di consumare risorse (RAG/LLM).
    #    Mai loggare il contenuto: solo presente/mime/dimensione/lunghezza estratto.
    if image is not None:
        try:
            validated = validate_image(image)
        except ImageValidationError as exc:
            logger.info("Image rejected: code=%s", exc.code)
            yield format_sse("error", {"message": exc.message, "code": exc.code})
            return
        logger.info(
            "Image accepted: mime=%s bytes=%d", validated.mime, validated.byte_size
        )
        # Estrazione on-receipt (UNA vision call) + persistenza per sessione.
        # Best-effort: se estrazione/persistenza falliscono, la conversazione
        # prosegue senza memorizzare il file (non si blocca l'utente).
        try:
            extracted = filememory.extract_text(validated.data_url, llm)
            filememory.store_file(
                cursor,
                config.rag_schema,
                session_id,
                validated.mime,
                extracted,
            )
            logger.info(
                "Image extracted & stored: mime=%s extracted_len=%d",
                validated.mime,
                len(extracted),
            )
        except Exception:
            logger.warning("Image extraction/persist failed, continuing", exc_info=True)

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
            {
                "message": "Servizio momentaneamente non disponibile.",
                "code": "RATE_LIMIT_ERROR",
            },
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
        logger.warning(
            "RAG retrieval failed, continuing without context", exc_info=True
        )

    # 2b) Carica i file gia' condivisi nella sessione (incl. quello appena
    #     estratto, se presente) per iniettarli nel prompt come blocco DOCUMENTI
    #     CONDIVISI. Best-effort: un glitch DB non deve impedire la risposta.
    shared_files: list[SharedFile] = []
    try:
        stored = filememory.load_files(cursor, config.rag_schema, session_id)
        shared_files = [
            SharedFile(idx=f.idx, mime=f.mime, extracted_text=f.extracted_text)
            for f in stored
        ]
        if shared_files:
            logger.info("Session files injected: %d", len(shared_files))
    except Exception:
        logger.warning("Loading session files failed, continuing", exc_info=True)

    # 3) Build messages (system+RAG+DOCUMENTI CONDIVISI+history+user).
    messages = build_messages(
        user_message=message,
        conversation_history=conversation_history,
        rag_chunks=rag_chunks,
        max_history=config.max_history,
        shared_files=shared_files,
    )

    # 4) start (session info; nessun segreto).
    yield format_sse(
        "start",
        {
            "session_id": session_id,
            "rag_chunks": len(rag_chunks),
            "shared_files": len(shared_files),
        },
    )

    # 5) Stream LLM (chunk reali). L'immagine NON viene re-inviata: il suo
    #    contenuto e' gia' nel prompt come testo estratto (DOCUMENTI CONDIVISI),
    #    cosi' si paga UNA sola vision call per immagine (alla ricezione).
    usage_payload: dict[str, object] = {}
    try:
        for piece in llm.stream_chat(messages):
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
            {
                "message": "Si e' verificato un errore. Riprova tra poco.",
                "code": "LLM_FAILED",
            },
        )
        return

    # 6) Increment rate-limit DOPO una risposta riuscita (come PHP).
    try:
        ratelimit.increment(cursor, config.rag_schema, identifier)
    except Exception:
        logger.warning("Rate-limit increment failed", exc_info=True)

    # 7) complete.
    yield format_sse("complete", {"usage": usage_payload or None})
