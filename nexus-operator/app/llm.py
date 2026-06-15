# -*- coding: utf-8 -*-
"""
@package nexus-operator
@author  Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
@version 1.1.0 (Nexus Operator — fabiocherici.com)
@date    2026-06-16
@mission M-017
@purpose Client OpenAI DIRETTO (non OpenRouter, vincolo CEO). Due responsabilita'
         servite dalla stessa API key: (1) embedding query con
         text-embedding-3-small (identico a rag_query.py:
         client.embeddings.create(input=..., model=...).data[0].embedding);
         (2) chat in STREAMING reale dei token con gpt-4o-mini
         (client.chat.completions.create(..., stream=True), iterando
         chunk.choices[0].delta.content — OpenAI Python SDK 2.x streaming).
         L'embedder espone l'interfaccia EmbeddingClient (Protocol) usata da rag.py.
"""

from __future__ import annotations

import time
from collections.abc import Callable, Iterator
from dataclasses import dataclass
from typing import Any, cast

from openai import OpenAI
from openai.types.chat import (
    ChatCompletionContentPartImageParam,
    ChatCompletionContentPartParam,
    ChatCompletionContentPartTextParam,
    ChatCompletionMessageParam,
    ChatCompletionUserMessageParam,
)

from .prompt import ChatMessage


class StreamTimeoutError(Exception):
    """Lo stream LLM ha superato la durata massima consentita (LLM04 watchdog).
    Sollevata dentro stream_chat; il chiamante (operator.run_chat) la cattura
    come gli altri errori di streaming ed emette un evento SSE `error`."""


@dataclass(frozen=True)
class ChatUsage:
    """Conteggio token di una risposta. Value object immutabile."""

    input_tokens: int | None
    output_tokens: int | None


@dataclass(frozen=True)
class StreamChunk:
    """Un evento dello stream LLM: o un pezzo di testo (`content`), oppure il
    segnale finale (`done=True`) con eventuale usage. Discriminato da `done`."""

    content: str
    done: bool
    usage: ChatUsage | None


class OpenAIClient:
    """Wrapper sottile sull'SDK OpenAI. Incapsula la creazione del client cosi'
    che la API key non circoli oltre questo modulo (no leak nel contesto LLM,
    no log del valore — vincolo sicurezza CEO)."""

    def __init__(
        self,
        api_key: str,
        chat_model: str,
        embedding_model: str,
        timeout: float = 30.0,
        max_output_tokens: int = 1024,
        stream_timeout_seconds: float = 60.0,
        time_source: Callable[[], float] = time.monotonic,
    ) -> None:
        self._client = OpenAI(api_key=api_key, timeout=timeout)
        self._chat_model = chat_model
        self._embedding_model = embedding_model
        # LLM04 cost/DoS: cap rigido sui token di output (taglia il costo per
        # richiesta peggiore) + durata massima dello stream (watchdog).
        self._max_output_tokens = max_output_tokens
        self._stream_timeout_seconds = stream_timeout_seconds
        # Sorgente di tempo iniettabile (DIP): monotonic in prod, fake nei test.
        self._now = time_source

    def embed(self, text: str) -> list[float]:
        """Embedding di una stringa. Stessa chiamata di rag_query.py
        (embeddings.create -> .data[0].embedding)."""
        response = self._client.embeddings.create(
            input=text, model=self._embedding_model
        )
        return list(response.data[0].embedding)

    @staticmethod
    def _build_sdk_messages(
        messages: list[ChatMessage], image_data_url: str | None
    ) -> list[ChatCompletionMessageParam]:
        """Adatta i ChatMessage (TypedDict role/content, subset valido di
        ChatCompletionMessageParam) al formato SDK. Senza immagine: cast diretto.
        Con immagine: l'ULTIMO messaggio user diventa multimodale (text part +
        image_url part), gli altri restano invariati. Se non c'e' un user finale
        (caso anomalo) l'immagine viene scartata: mai inviata fuori contesto."""
        if image_data_url is None:
            return cast("list[ChatCompletionMessageParam]", messages)

        sdk: list[ChatCompletionMessageParam] = cast(
            "list[ChatCompletionMessageParam]", list(messages)
        )
        last_user_idx: int | None = None
        for idx in range(len(messages) - 1, -1, -1):
            if messages[idx]["role"] == "user":
                last_user_idx = idx
                break
        if last_user_idx is None:
            return sdk

        text_part: ChatCompletionContentPartTextParam = {
            "type": "text",
            "text": messages[last_user_idx]["content"],
        }
        image_part: ChatCompletionContentPartImageParam = {
            "type": "image_url",
            "image_url": {"url": image_data_url},
        }
        parts: list[ChatCompletionContentPartParam] = [text_part, image_part]
        multimodal: ChatCompletionUserMessageParam = {
            "role": "user",
            "content": parts,
        }
        sdk[last_user_idx] = multimodal
        return sdk

    def _create_stream(
        self, sdk_messages: list[ChatCompletionMessageParam]
    ) -> Any:
        """Seam sottile sulla chiamata SDK streaming (unico punto di contatto con
        la rete OpenAI). Isolarlo permette di sostituirlo nei test senza toccare
        un attributo read-only dell'SDK, e tiene `max_tokens` (LLM04 cost cap)
        in un solo posto."""
        return self._client.chat.completions.create(
            model=self._chat_model,
            messages=sdk_messages,
            stream=True,
            stream_options={"include_usage": True},
            # LLM04: cap esplicito sull'output. Senza, una singola richiesta puo'
            # generare risposte arbitrariamente lunghe -> costo non limitato.
            max_tokens=self._max_output_tokens,
        )

    def stream_chat(
        self, messages: list[ChatMessage], image_data_url: str | None = None
    ) -> Iterator[StreamChunk]:
        """Streama la risposta del modello chat token per token. Usa
        stream=True + stream_options.include_usage per ottenere lo usage
        nell'ultimo chunk (OpenAI Chat Completions streaming). Yields
        StreamChunk(content=...) per ogni delta non vuoto, poi un terminale
        StreamChunk(done=True).

        Se `image_data_url` e' presente (data-URL gia' VALIDATO a monte da
        app.image.validate_image), l'ultimo messaggio user viene riscritto in
        formato multimodale: una content-part `text` + una content-part
        `image_url` (OpenAI Vision). L'immagine e' DATO, non istruzione: il
        role-lock del system prompt resta l'autorita'."""
        sdk_messages = self._build_sdk_messages(messages, image_data_url)
        stream: Any = self._create_stream(sdk_messages)

        deadline = self._now() + self._stream_timeout_seconds
        usage: ChatUsage | None = None
        for chunk in stream:
            # Watchdog durata: oltre il deadline si interrompe lo stream con
            # errore (LLM04). Il chiamante lo traduce in evento SSE `error`.
            if self._now() > deadline:
                raise StreamTimeoutError("LLM stream exceeded max duration")
            chunk_usage = getattr(chunk, "usage", None)
            if chunk_usage is not None:
                usage = ChatUsage(
                    input_tokens=getattr(chunk_usage, "prompt_tokens", None),
                    output_tokens=getattr(chunk_usage, "completion_tokens", None),
                )
            if not chunk.choices:
                continue
            delta = chunk.choices[0].delta
            content = getattr(delta, "content", None)
            if content:
                yield StreamChunk(content=content, done=False, usage=None)

        yield StreamChunk(content="", done=True, usage=usage)
