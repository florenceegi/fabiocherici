# -*- coding: utf-8 -*-
"""
@package nexus-operator
@author  Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
@version 1.0.0 (Nexus Operator — fabiocherici.com)
@date    2026-06-15
@mission M-017
@purpose Test rate-limit: blocca oltre soglia, query parametrizzata, UPSERT,
         pseudonimizzazione IP (hash + salt rotante giornaliero, GDPR B2) e
         purge a 30 giorni.
"""

from __future__ import annotations

import re
from datetime import date

from app import ratelimit
from tests.conftest import FakeCursor


def test_current_count_zero_when_no_row() -> None:
    cursor = FakeCursor()
    cursor.fetchone_row = None
    assert ratelimit.current_count(cursor, "rag_nexus", "ip:1.2.3.4") == 0


def test_has_reached_limit_blocks_at_threshold() -> None:
    cursor = FakeCursor()
    cursor.fetchone_row = (50,)
    assert ratelimit.has_reached_limit(cursor, "rag_nexus", "ip:1.2.3.4", 50) is True


def test_has_reached_limit_allows_below_threshold() -> None:
    cursor = FakeCursor()
    cursor.fetchone_row = (49,)
    assert ratelimit.has_reached_limit(cursor, "rag_nexus", "ip:1.2.3.4", 50) is False


def test_count_query_is_parametrized() -> None:
    cursor = FakeCursor()
    cursor.fetchone_row = (3,)
    ratelimit.current_count(cursor, "rag_nexus", "ip:9.9.9.9")
    query, params = cursor.executed[0]
    assert "WHERE identifier = %s AND day = %s" in query
    assert params[0] == "ip:9.9.9.9"


def test_increment_uses_upsert_and_returns_new_count() -> None:
    cursor = FakeCursor()
    cursor.fetchone_row = (1,)
    new_count = ratelimit.increment(cursor, "rag_nexus", "ip:1.2.3.4")
    query, params = cursor.executed[0]
    assert "ON CONFLICT (identifier, day)" in query
    assert "DO UPDATE SET count" in query
    assert "RETURNING count" in query
    assert params[0] == "ip:1.2.3.4"
    assert new_count == 1


# --- Pseudonimizzazione IP (GDPR B2: hash + salt rotante giornaliero) ---

_DAY = date(2026, 6, 16)
_NEXT_DAY = date(2026, 6, 17)
_SALT = "super-secret-salt"


def test_pseudonymize_never_contains_raw_ip() -> None:
    out = ratelimit.pseudonymize("ip", "1.2.3.4", _SALT, _DAY)
    # L'IP in chiaro NON deve comparire nell'identificatore persistito.
    assert "1.2.3.4" not in out


def test_pseudonymize_has_prefix_and_hex_digest() -> None:
    out = ratelimit.pseudonymize("ip", "1.2.3.4", _SALT, _DAY)
    assert out.startswith("ip:")
    digest = out.split(":", 1)[1]
    # sha256 hex = 64 caratteri esadecimali.
    assert re.fullmatch(r"[0-9a-f]{64}", digest) is not None


def test_pseudonymize_stable_same_ip_same_day() -> None:
    a = ratelimit.pseudonymize("ip", "1.2.3.4", _SALT, _DAY)
    b = ratelimit.pseudonymize("ip", "1.2.3.4", _SALT, _DAY)
    # Stesso IP, stesso giorno -> stesso hash: il rate-limit funziona.
    assert a == b


def test_pseudonymize_rotates_across_days() -> None:
    today = ratelimit.pseudonymize("ip", "1.2.3.4", _SALT, _DAY)
    tomorrow = ratelimit.pseudonymize("ip", "1.2.3.4", _SALT, _NEXT_DAY)
    # Giorni diversi -> hash diversi (salt rotante giornaliero).
    assert today != tomorrow


def test_pseudonymize_distinct_ips_distinct_hash() -> None:
    a = ratelimit.pseudonymize("ip", "1.2.3.4", _SALT, _DAY)
    b = ratelimit.pseudonymize("ip", "9.9.9.9", _SALT, _DAY)
    assert a != b


def test_pseudonymize_distinct_salts_distinct_hash() -> None:
    a = ratelimit.pseudonymize("ip", "1.2.3.4", _SALT, _DAY)
    b = ratelimit.pseudonymize("ip", "1.2.3.4", "other-salt", _DAY)
    # Salt diverso -> hash diverso (un salt debole/cambiato non collide).
    assert a != b


def test_pseudonymize_session_fallback_same_shape() -> None:
    out = ratelimit.pseudonymize("session", "abc123", _SALT, _DAY)
    assert out.startswith("session:")
    assert "abc123" not in out
    digest = out.split(":", 1)[1]
    assert re.fullmatch(r"[0-9a-f]{64}", digest) is not None


def test_purge_old_uses_parametrized_interval() -> None:
    cursor = FakeCursor()
    ratelimit.purge_old(cursor, "rag_nexus", retention_days=30)
    query, params = cursor.executed[0]
    assert "DELETE FROM rag_nexus.operator_rate_limit" in query
    assert "WHERE day <" in query
    # Retention parametrizzata (%s), non interpolata: CWE-89.
    assert params[0] == 30


def test_purge_old_default_retention_30_days() -> None:
    cursor = FakeCursor()
    ratelimit.purge_old(cursor, "rag_nexus")
    _query, params = cursor.executed[0]
    assert params[0] == 30
