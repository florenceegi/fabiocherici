# -*- coding: utf-8 -*-
"""
@package nexus-operator
@author  Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
@version 1.0.0 (Nexus Operator — fabiocherici.com)
@date    2026-06-15
@mission M-017
@purpose Connessione PostgreSQL via psycopg2. Stessa logica di connessione di
         rag_query.py::get_db_connection (host/dbname/user/password/port +
         connect_timeout). Isolato qui per non spargere psycopg2 nei moduli di
         dominio (DIP: rag/ratelimit dipendono dalla porta DbCursor, non da
         psycopg2). I segreti arrivano da Config, mai loggati.
"""

from __future__ import annotations

from typing import Any

import psycopg2

from .config import Config


def connect(config: Config) -> Any:  # psycopg2 connection (no stub tipizzato)
    """Apre una connessione psycopg2. connect_timeout=10 come rag_query.py per
    fallire in fretta se il DB e' irraggiungibile. Ritorna connection (autocommit
    attivo: ogni statement rate-limit/RAG e' indipendente, niente transazioni
    lunghe in un servizio di sola lettura + counter)."""
    conn = psycopg2.connect(
        host=config.db_host,
        dbname=config.db_database,
        user=config.db_username,
        password=config.db_password,
        port=config.db_port,
        connect_timeout=10,
    )
    conn.autocommit = True
    return conn


def health_check(config: Config) -> bool:
    """True se il DB risponde a `SELECT 1`. Usato da /health. Non solleva: in
    caso di errore ritorna False (l'endpoint riporta lo stato, non crasha)."""
    try:
        conn = connect(config)
        try:
            cur = conn.cursor()
            cur.execute("SELECT 1")
            cur.fetchone()
            return True
        finally:
            conn.close()
    except Exception:
        return False
