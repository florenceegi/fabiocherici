# -*- coding: utf-8 -*-
"""
@package nexus-operator
@author  Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
@version 1.0.0 (Nexus Operator — fabiocherici.com)
@date    2026-06-15
@mission M-017
@purpose Test validazione input: rifiuta message troppo lungo / mancante / vuoto,
         history oltre 20, role non in allow-list.
"""

from __future__ import annotations

import pytest
from pydantic import ValidationError

from app.validation import ChatRequest


def test_valid_request() -> None:
    req = ChatRequest(message="ciao", session_id="abc123")
    assert req.message == "ciao"
    assert req.conversation_history == []


def test_message_too_long_rejected() -> None:
    with pytest.raises(ValidationError):
        ChatRequest(message="x" * 2001, session_id="abc")


def test_message_missing_rejected() -> None:
    with pytest.raises(ValidationError):
        ChatRequest(session_id="abc")  # type: ignore[call-arg]


def test_message_blank_rejected() -> None:
    with pytest.raises(ValidationError):
        ChatRequest(message="   ", session_id="abc")


def test_session_id_too_long_rejected() -> None:
    with pytest.raises(ValidationError):
        ChatRequest(message="ciao", session_id="s" * 101)


def test_history_over_20_rejected() -> None:
    history = [{"role": "user", "content": f"m{i}"} for i in range(21)]
    with pytest.raises(ValidationError):
        ChatRequest(message="ciao", session_id="abc", conversation_history=history)  # type: ignore[arg-type]


def test_history_invalid_role_rejected() -> None:
    with pytest.raises(ValidationError):
        ChatRequest(
            message="ciao",
            session_id="abc",
            conversation_history=[{"role": "hacker", "content": "x"}],  # type: ignore[list-item]
        )


def test_image_defaults_to_none() -> None:
    req = ChatRequest(message="ciao", session_id="abc")
    assert req.image is None


def test_image_accepts_data_url_string() -> None:
    # Forma libera al confine Pydantic: la semantica e' validata in pipeline.
    req = ChatRequest(message="guarda", session_id="abc", image="data:image/png;base64,AAAA")
    assert req.image == "data:image/png;base64,AAAA"


def test_image_too_long_rejected_at_boundary() -> None:
    # Tetto grezzo DoS: una stringa enorme e' rifiutata gia' da Pydantic.
    with pytest.raises(ValidationError):
        ChatRequest(message="ciao", session_id="abc", image="x" * (10 * 1024 * 1024))


def test_history_total_chars_within_budget_accepted() -> None:
    # 20 messaggi da 1000 char = 20000 < 24000: entro il budget.
    history = [{"role": "user", "content": "y" * 1000} for _ in range(20)]
    req = ChatRequest(
        message="ciao", session_id="abc", conversation_history=history  # type: ignore[arg-type]
    )
    assert len(req.conversation_history) == 20


def test_history_total_chars_over_budget_rejected() -> None:
    # Ogni entry e' < 8000 (passa il gate per-entry), ma la SOMMA supera 24000:
    # cap sul totale (LLM04 cost cap input).
    history = [{"role": "user", "content": "z" * 5000} for _ in range(6)]  # 30000
    with pytest.raises(ValidationError):
        ChatRequest(
            message="ciao", session_id="abc", conversation_history=history  # type: ignore[arg-type]
        )
