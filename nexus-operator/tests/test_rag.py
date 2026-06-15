# -*- coding: utf-8 -*-
"""
@package nexus-operator
@author  Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
@version 1.0.0 (Nexus Operator — fabiocherici.com)
@date    2026-06-15
@mission M-017
@purpose Test retrieval RAG: query SQL parametrizzata attesa (CWE-89),
         allow-list schema, mapping righe -> dict.
"""

from __future__ import annotations

import pytest

from app.rag import build_rag_query, retrieve, validate_schema
from tests.conftest import FakeCursor, FakeEmbedder


def test_validate_schema_accepts_valid() -> None:
    assert validate_schema("rag_nexus") == "rag_nexus"


@pytest.mark.parametrize("bad", ["rag nexus", "rag;drop", "1rag", "rag-nexus", "", "a" * 80])
def test_validate_schema_rejects_injection(bad: str) -> None:
    with pytest.raises(ValueError):
        validate_schema(bad)


def test_build_query_uses_pgvector_cosine_and_params() -> None:
    sql = build_rag_query("rag_nexus")
    # Stessa formula cosine di rag_query.py.
    assert "1 - (e.embedding <=> %s::vector) as similarity" in sql
    # JOIN embeddings -> chunks -> documents.
    assert "rag_nexus.embeddings e" in sql
    assert "rag_nexus.chunks c ON e.chunk_id = c.id" in sql
    assert "rag_nexus.documents d ON c.document_id = d.id" in sql
    # status published + soglia + ordine + limit parametrizzati.
    assert "d.status = 'published'" in sql
    assert "ORDER BY similarity DESC" in sql
    assert "LIMIT %s" in sql
    # Esattamente 4 placeholder: embedding, embedding, threshold, limit.
    assert sql.count("%s") == 4


def test_retrieve_executes_parametrized_query() -> None:
    cursor = FakeCursor()
    cursor.fetchall_rows = [(7, "Titolo", "testo del chunk", 0.812345)]
    embedder = FakeEmbedder()

    results = retrieve(
        cursor=cursor,
        embedder=embedder,
        schema="rag_nexus",
        query_text="come funziona la prima chiamata",
        threshold=0.35,
        limit=6,
    )

    # Una sola execute, parametrizzata (params separati dalla query).
    assert len(cursor.executed) == 1
    query, params = cursor.executed[0]
    assert "%s::vector" in query
    assert len(params) == 4
    # embedding ripetuto due volte (SELECT + WHERE), come rag_query.py.
    assert params[0] == params[1]
    assert params[2] == 0.35
    assert params[3] == 6

    assert results == [
        {"document_id": 7, "title": "Titolo", "text": "testo del chunk", "similarity": 0.8123}
    ]
