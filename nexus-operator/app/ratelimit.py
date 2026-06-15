# -*- coding: utf-8 -*-
"""
@package nexus-operator
@author  Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
@version 1.1.0 (Nexus Operator — fabiocherici.com)
@date    2026-06-16
@mission M-017
@purpose Rate-limit guest per IP: 50 richieste/giorno (porta in Python
         FreeAiRateLimit::hasReachedLimit/incrementForIdentifier). Persistenza
         su tabella Postgres rag_nexus.operator_rate_limit(identifier, day, count)
         nello stesso DB. SQL SEMPRE parametrizzato (CWE-89).

         GDPR B2 (CEO-approvato): l'IP e' un dato personale e NON viene MAI
         persistito in chiaro. L'`identifier` salvato e' lo sha256 di
         (salt_giornaliero | giorno | tipo | valore-grezzo), dove il salt
         giornaliero deriva da un segreto (NEXUS_RATELIMIT_SALT) + la data UTC.
         Stesso IP nello stesso giorno -> stesso hash (il conteggio funziona);
         giorni diversi -> hash diversi (salt rotante) e l'IP non e' piu'
         ricostruibile dal record. Razionale: minimizzazione/pseudonimizzazione
         del dato persistito (OWASP Proactive Controls C9 "do not log/persist
         sensitive information") oltre alla retention con purge a 30 giorni.
"""

from __future__ import annotations

import hashlib
from datetime import date, timezone
from datetime import datetime as _datetime

from .ports import DbCursor

__all__ = [
    "DbCursor",
    "current_count",
    "has_reached_limit",
    "increment",
    "pseudonymize",
    "purge_old",
]

# Retention di default per i record rate-limit (GDPR: limitazione della
# conservazione). Il purge effettivo lo schedula il supervisor via cron.
DEFAULT_RETENTION_DAYS: int = 30


def _coerce_int(value: object) -> int:
    """Converte un valore di colonna DB (object dal Protocol) in int in modo
    tipato. psycopg2 ritorna int per colonne INTEGER; questo blinda mypy --strict
    senza Any."""
    if isinstance(value, int):
        return value
    return int(str(value))


def _today_utc() -> date:
    """Giorno corrente in UTC. Esplicito per evitare ambiguita' di timezone tra
    box e DB (il reset giornaliero deve essere deterministico)."""
    return _datetime.now(timezone.utc).date()


# Lo schema e' validato a monte (rag.validate_schema) e arriva da config server.
def _table(schema: str) -> str:
    return f"{schema}.operator_rate_limit"


def pseudonymize(kind: str, raw_value: str, salt_secret: str, day: date) -> str:
    """Pseudonimizza un identificatore (IP o session) per la persistenza del
    rate-limit (GDPR B2). Ritorna `<kind>:<sha256-hex>`, MAI il valore in chiaro.

    Il digest e' sha256(salt | day | kind | raw_value):
    - `salt_secret` e' un segreto da env (NEXUS_RATELIMIT_SALT): senza il salt
      l'hash non e' invertibile per forza bruta su uno spazio IPv4 piccolo;
    - `day` (data UTC) entra nel digest -> salt rotante giornaliero: stesso IP
      nello stesso giorno = stesso hash (il conteggio per giorno funziona),
      giorni diversi = hash diversi (l'IP non si correla nel tempo).

    Il prefisso `kind` (`ip`/`session`) resta in chiaro: e' una categoria, non un
    dato personale, e tiene separati i due spazi di chiavi (no collisione)."""
    # Separatore '|' non presente negli input (IP/uuid/data ISO) -> niente
    # ambiguita' di concatenazione tra i campi.
    material = f"{salt_secret}|{day.isoformat()}|{kind}|{raw_value}"
    digest = hashlib.sha256(material.encode("utf-8")).hexdigest()
    return f"{kind}:{digest}"


def current_count(cursor: DbCursor, schema: str, identifier: str) -> int:
    """Conteggio richieste odierne per l'identificatore. Query parametrizzata."""
    # B608: solo `_table(schema)` (schema validato allow-list a monte, non input
    # utente) interpolato; identifier/day parametrizzati (%s). CWE-89 coperto.
    sql = (
        f"SELECT count FROM {_table(schema)} "  # nosec B608
        "WHERE identifier = %s AND day = %s"
    )
    cursor.execute(sql, (identifier, _today_utc()))
    row = cursor.fetchone()
    if row is None:
        return 0
    return _coerce_int(row[0])


def has_reached_limit(
    cursor: DbCursor, schema: str, identifier: str, limit: int
) -> bool:
    """True se l'identificatore ha raggiunto/superato il limite giornaliero.
    Porta FreeAiRateLimit::hasReachedLimit."""
    return current_count(cursor, schema, identifier) >= limit


def increment(cursor: DbCursor, schema: str, identifier: str) -> int:
    """Incrementa atomicamente il contatore odierno (UPSERT
    ON CONFLICT ... DO UPDATE: pattern Postgres per increment-or-create senza
    race). Ritorna il nuovo valore. Porta
    FreeAiRateLimit::incrementForIdentifier."""
    # B608: solo `_table(schema)` (schema validato allow-list) interpolato;
    # identifier/day parametrizzati (%s). CWE-89 coperto.
    sql = (
        f"INSERT INTO {_table(schema)} (identifier, day, count) "  # nosec B608
        "VALUES (%s, %s, 1) "
        "ON CONFLICT (identifier, day) "
        "DO UPDATE SET count = "
        f"{_table(schema)}.count + 1 "
        "RETURNING count"
    )
    cursor.execute(sql, (identifier, _today_utc()))
    row = cursor.fetchone()
    if row is None:
        return 1
    return _coerce_int(row[0])


def purge_old(
    cursor: DbCursor,
    schema: str,
    retention_days: int = DEFAULT_RETENTION_DAYS,
) -> None:
    """Cancella i record piu' vecchi di `retention_days` giorni (GDPR:
    limitazione della conservazione). Funzione CHIAMABILE dal supervisor via
    cron giornaliero — qui NON si schedula nulla.

    `retention_days` e' parametrizzato (%s::integer), non interpolato (CWE-89);
    solo `_table(schema)` (schema validato allow-list a monte, non input utente)
    e' interpolato. In Postgres `CURRENT_DATE - <int>` e' una DATE: il confronto
    `day < CURRENT_DATE - %s::integer` seleziona i giorni oltre la finestra."""
    sql = (
        f"DELETE FROM {_table(schema)} "  # nosec B608
        "WHERE day < CURRENT_DATE - %s::integer"
    )
    cursor.execute(sql, (retention_days,))
