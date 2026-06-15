# -*- coding: utf-8 -*-
"""
@package nexus-operator
@author  Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
@version 1.0.0 (Nexus Operator — fabiocherici.com)
@date    2026-06-16
@mission M-017
@purpose Test del layer FastAPI: CORS allow-list e TrustedHost enforced NEL
         servizio (A05), e pseudonimizzazione dell'identificatore rate-limit
         (GDPR B2) — l'IP/session grezzo non compare mai nella chiave.
"""

from __future__ import annotations

from datetime import date

from app import main, ratelimit


def test_client_identifier_pseudonymizes_session() -> None:
    # Senza request.client (TestClient/loopback) -> fallback session, comunque
    # pseudonimizzato: il session_id grezzo non compare nella chiave.
    class _FakeReq:
        client = None

    out = main._client_identifier(_FakeReq(), "sess-raw-123", "salt")  # type: ignore[arg-type]
    assert "sess-raw-123" not in out
    assert out.startswith("session:")


def test_client_identifier_matches_pseudonymize_for_session() -> None:
    class _FakeReq:
        client = None

    out = main._client_identifier(_FakeReq(), "abc", "salt")  # type: ignore[arg-type]
    # Coerente con la funzione di dominio per lo stesso giorno UTC.
    from datetime import datetime, timezone

    today = datetime.now(timezone.utc).date()
    assert out == ratelimit.pseudonymize("session", "abc", "salt", today)


def test_middleware_allow_lists_have_safe_defaults() -> None:
    # Senza env montato (no /etc/nexus/operator.env in test), i default sicuri.
    cors, hosts = main._middleware_allow_lists()
    assert "https://fabiocherici.com" in cors
    assert "*" not in cors  # allow-list stretta, mai wildcard
    assert "nexus.fabiocherici.com" in hosts


def test_cors_and_trustedhost_middleware_registered() -> None:
    # I middleware A05 devono essere registrati sull'app (nel servizio, non solo
    # delegati a nginx).
    rendered = repr(main.app.user_middleware)
    assert "CORSMiddleware" in rendered
    assert "TrustedHostMiddleware" in rendered


def test_pseudonymize_day_rotation_in_identifier() -> None:
    # Stesso input, due giorni diversi -> identificatori diversi (salt rotante).
    d1 = ratelimit.pseudonymize("ip", "1.2.3.4", "salt", date(2026, 1, 1))
    d2 = ratelimit.pseudonymize("ip", "1.2.3.4", "salt", date(2026, 1, 2))
    assert d1 != d2
