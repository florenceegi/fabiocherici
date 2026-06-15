# -*- coding: utf-8 -*-
"""
@package nexus-operator
@author  Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
@version 1.0.0 (Nexus Operator — fabiocherici.com)
@date    2026-06-15
@mission M-017
@purpose Test formattazione SSE: contratto identico a formatSSE PHP e atteso da
         free-ai-chat.js (event:/data:/doppio newline, content nei chunk).
"""

from __future__ import annotations

import json

from app.sse import format_sse


def test_format_sse_structure() -> None:
    out = format_sse("chunk", {"content": "ciao"})
    assert out.startswith("event: chunk\n")
    assert "data: " in out
    assert out.endswith("\n\n")


def test_format_sse_data_is_valid_json_with_content() -> None:
    out = format_sse("chunk", {"content": "Vedi prima, decidi dopo"})
    data_line = [ln for ln in out.split("\n") if ln.startswith("data: ")][0]
    payload = json.loads(data_line[len("data: ") :])
    # Il JS legge d.content sui chunk.
    assert payload["content"] == "Vedi prima, decidi dopo"


def test_format_sse_preserves_unicode() -> None:
    out = format_sse("chunk", {"content": "perché città"})
    # ensure_ascii=False: accenti non escapati.
    assert "perché città" in out


def test_format_sse_error_event() -> None:
    out = format_sse("error", {"message": "limite", "code": "RATE_LIMIT_EXCEEDED"})
    assert "event: error\n" in out
    payload = json.loads(out.split("data: ", 1)[1].strip())
    assert payload["code"] == "RATE_LIMIT_EXCEEDED"
