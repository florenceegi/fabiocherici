# -*- coding: utf-8 -*-
"""
@package nexus-operator
@author  Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
@version 1.0.0 (Nexus Operator — fabiocherici.com)
@date    2026-06-15
@mission M-017
@purpose Retrieval pgvector REALE. Riusa ESATTAMENTE la logica di query di
         os3-matrix/bin/rag_query.py::query_rag: embed della query con OpenAI
         text-embedding-3-small, poi cosine similarity via operatore pgvector
         `<=>` (`1 - (e.embedding <=> %s::vector) as similarity`), soglia + limit,
         JOIN embeddings->chunks->documents. SQL SEMPRE parametrizzato (CWE-89):
         lo schema (identificatore) NON e' un valore -> e' validato come
         identificatore sicuro, mai interpolato da input utente.
"""

from __future__ import annotations

import re

from .ports import DbCursor, EmbeddingClient

__all__ = ["DbCursor", "EmbeddingClient", "validate_schema", "build_rag_query", "retrieve"]

# Schema = identificatore SQL, non puo' essere parametrizzato (%s lega valori,
# non nomi di tabella). Lo validiamo con allow-list (OWASP C3: input validation
# allow-list) per impedire SQL injection via nome schema. Lo schema arriva da
# config server-side, MAI da input utente, ma la validazione e' difesa in
# profondita'.
_SCHEMA_RE = re.compile(r"^[A-Za-z_][A-Za-z0-9_]{0,62}$")


def validate_schema(schema: str) -> str:
    """Valida il nome schema come identificatore SQL sicuro. Solleva ValueError
    se non rispetta l'allow-list. Difesa contro SQL injection via identificatore
    (CWE-89), dato che lo schema non puo' essere legato come parametro %s."""
    if not _SCHEMA_RE.match(schema):
        raise ValueError("Nome schema non valido (allow-list violata)")
    return schema


def build_rag_query(schema: str) -> str:
    """Costruisce l'SQL di retrieval. IDENTICO a rag_query.py::query_rag:
    `1 - (e.embedding <=> %s::vector) as similarity`, JOIN embeddings->chunks->
    documents, WHERE status published AND similarity > soglia, ORDER BY DESC,
    LIMIT. Aggiunge c.text al SELECT perche' all'operatore serve il testo del
    chunk per il contesto LLM (rag_query.py CLI ritornava solo metadati doc).
    Lo schema e' gia' validato da validate_schema() prima dell'interpolazione."""
    safe_schema = validate_schema(schema)
    # B608: solo `safe_schema` (identificatore validato allow-list, mai input
    # utente) e' interpolato; tutti i VALORI sono parametrizzati (%s). CWE-89 coperto.
    sql = (
        "SELECT d.id, d.title, c.text, "
        "1 - (e.embedding <=> %s::vector) as similarity "
        f"FROM {safe_schema}.embeddings e "  # nosec B608
        f"JOIN {safe_schema}.chunks c ON e.chunk_id = c.id "
        f"JOIN {safe_schema}.documents d ON c.document_id = d.id "
        "WHERE d.status = 'published' "
        "AND 1 - (e.embedding <=> %s::vector) > %s "
        "ORDER BY similarity DESC "
        "LIMIT %s"
    )
    return sql


def retrieve(
    cursor: DbCursor,
    embedder: EmbeddingClient,
    schema: str,
    query_text: str,
    threshold: float,
    limit: int,
) -> list[dict[str, object]]:
    """Esegue il retrieval RAG. Step come rag_query.py: embed query -> esegui
    SQL parametrizzato con (embedding, embedding, threshold, limit) -> mappa
    righe in dict {document_id, title, text, similarity}. L'embedding e' passato
    come str() del vettore, ESATTAMENTE come rag_query.py (psycopg2 + cast
    ::vector lato SQL). Best-effort: se l'embed o la query falliscono, il chiamante
    decide; qui non inghiottiamo (UEM) -> propaghiamo l'eccezione."""
    embedding = embedder.embed(query_text)
    embedding_param = str(embedding)
    sql = build_rag_query(schema)
    cursor.execute(sql, (embedding_param, embedding_param, threshold, limit))
    rows = cursor.fetchall()

    results: list[dict[str, object]] = []
    for row in rows:
        doc_id, title, text, similarity = row
        results.append(
            {
                "document_id": doc_id,
                "title": title,
                "text": text,
                "similarity": round(float(similarity), 4),  # type: ignore[arg-type]  # similarity e' numerico dal DB
            }
        )
    return results
