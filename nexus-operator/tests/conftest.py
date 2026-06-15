# -*- coding: utf-8 -*-
"""
@package nexus-operator
@author  Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
@version 1.0.0 (Nexus Operator — fabiocherici.com)
@date    2026-06-15
@mission M-017
@purpose Fixtures/fake condivisi. I test NON chiamano OpenAI ne' richiedono un
         Postgres vivo: tutto via fake (porte EmbeddingClient/DbCursor).
"""

from __future__ import annotations

from typing import Any

from app.config import Config


class FakeEmbedder:
    """Embedder fake: ritorna sempre lo stesso vettore. Soddisfa EmbeddingClient."""

    def __init__(self, dim: int = 3) -> None:
        self._vec = [0.1] * dim

    def embed(self, text: str) -> list[float]:
        return list(self._vec)


class FakeCursor:
    """Cursore DB fake: registra le execute (query, params) e restituisce righe
    programmate. Soddisfa le porte DbCursor di rag.py e ratelimit.py."""

    def __init__(self) -> None:
        self.executed: list[tuple[str, tuple[Any, ...]]] = []
        self.fetchall_rows: list[tuple[Any, ...]] = []
        self.fetchone_row: tuple[Any, ...] | None = None

    def execute(self, query: str, params: tuple[Any, ...]) -> object:
        self.executed.append((query, params))
        return None

    def fetchall(self) -> list[tuple[Any, ...]]:
        return self.fetchall_rows

    def fetchone(self) -> tuple[Any, ...] | None:
        return self.fetchone_row


def make_config(**overrides: Any) -> Config:
    """Config di test con valori fittizi (nessun segreto reale)."""
    base = dict(
        db_host="localhost",
        db_port=5432,
        db_database="nexus_fabiocherici",
        db_username="tester",
        db_password="x",
        openai_api_key="sk-test",
        rag_schema="rag_nexus",
        chat_model="gpt-4o-mini",
        embedding_model="text-embedding-3-small",
        rag_threshold=0.35,
        rag_limit=6,
        guest_daily_limit=50,
        max_message_length=2000,
        max_history=20,
        showcase_upstream="https://art.florenceegi.com/free-ai/hyper-egis",
        ratelimit_salt="test-salt",
        max_output_tokens=1024,
        stream_timeout_seconds=60.0,
        max_history_total_chars=24000,
        cors_origins=("https://fabiocherici.com",),
        allowed_hosts=("localhost", "127.0.0.1"),
    )
    base.update(overrides)
    return Config(**base)  # type: ignore[arg-type]
