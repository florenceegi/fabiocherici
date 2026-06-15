# -*- coding: utf-8 -*-
"""
@package nexus-operator
@author  Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
@version 1.0.0 (Nexus Operator — fabiocherici.com)
@date    2026-06-15
@mission M-017
@purpose Test pipeline end-to-end con fake (no OpenAI, no Postgres vivo):
         sequenza eventi start/chunk/complete; rate-limit blocca con evento error
         code RATE_LIMIT_EXCEEDED; errore LLM emette evento error.
"""

from __future__ import annotations

import base64
import io
import json
from collections.abc import Iterator

from PIL import Image

from app.llm import ChatUsage, StreamChunk
from app.operator import run_chat
from app.prompt import ChatMessage
from tests.conftest import FakeCursor, make_config


class FakeLLM:
    """Fake LLM: embed + stream_chat. Programmabile con pezzi di testo o errore.
    Registra l'eventuale image_data_url ricevuto, per verificare il passaggio."""

    def __init__(self, pieces: list[str] | None = None, raise_on_stream: bool = False) -> None:
        self._pieces = pieces if pieces is not None else ["Ciao", " come stai?"]
        self._raise = raise_on_stream
        self.received_image: str | None = None
        self.received_image_calls: int = 0

    def embed(self, text: str) -> list[float]:
        return [0.1, 0.1, 0.1]

    def stream_chat(
        self, messages: list[ChatMessage], image_data_url: str | None = None
    ) -> Iterator[StreamChunk]:
        self.received_image = image_data_url
        self.received_image_calls += 1
        if self._raise:
            raise RuntimeError("llm boom")
        for p in self._pieces:
            yield StreamChunk(content=p, done=False, usage=None)
        yield StreamChunk(content="", done=True, usage=ChatUsage(10, 5))


def _real_png_data_url(width: int = 8, height: int = 8) -> str:
    """PNG reale e decodificabile (il check pixel di image.py richiede un'immagine
    valida, non solo i magic bytes)."""
    buf = io.BytesIO()
    Image.new("RGB", (width, height), (10, 20, 30)).save(buf, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode("ascii")


_PNG_DATA_URL = _real_png_data_url()


def _events(raw: list[str]) -> list[tuple[str, dict[str, object]]]:
    parsed: list[tuple[str, dict[str, object]]] = []
    for block in raw:
        lines = block.strip().split("\n")
        event = lines[0].split("event: ", 1)[1]
        data = json.loads(lines[1].split("data: ", 1)[1])
        parsed.append((event, data))
    return parsed


def test_happy_path_emits_start_chunks_complete() -> None:
    cursor = FakeCursor()
    cursor.fetchone_row = (0,)  # rate-limit: nessun conteggio
    cursor.fetchall_rows = [(1, "Doc", "contesto", 0.9)]  # RAG ritorna 1 chunk
    fake = FakeLLM(pieces=["Vedi prima", ", decidi dopo."])

    out = list(
        run_chat(
            config=make_config(),
            cursor=cursor,
            embedder=fake,
            llm=fake,  # type: ignore[arg-type]
            message="come funziona?",
            session_id="sess-1",
            conversation_history=[],
            identifier="ip:1.2.3.4",
        )
    )
    events = _events(out)
    names = [e[0] for e in events]
    assert names[0] == "start"
    assert "chunk" in names
    assert names[-1] == "complete"
    # start riporta numero chunk RAG.
    assert events[0][1]["rag_chunks"] == 1
    # i chunk trasportano il testo dei token.
    chunk_contents = [e[1]["content"] for e in events if e[0] == "chunk"]
    assert chunk_contents == ["Vedi prima", ", decidi dopo."]
    # complete riporta usage.
    assert events[-1][1]["usage"] == {"input_tokens": 10, "output_tokens": 5}


def test_rate_limit_blocks_with_error_event() -> None:
    cursor = FakeCursor()
    cursor.fetchone_row = (50,)  # limite raggiunto
    fake = FakeLLM()

    out = list(
        run_chat(
            config=make_config(guest_daily_limit=50),
            cursor=cursor,
            embedder=fake,
            llm=fake,  # type: ignore[arg-type]
            message="ciao",
            session_id="sess-1",
            conversation_history=[],
            identifier="ip:1.2.3.4",
        )
    )
    events = _events(out)
    assert len(events) == 1
    assert events[0][0] == "error"
    assert events[0][1]["code"] == "RATE_LIMIT_EXCEEDED"


def test_llm_failure_emits_error_event() -> None:
    cursor = FakeCursor()
    cursor.fetchone_row = (0,)
    cursor.fetchall_rows = []
    fake = FakeLLM(raise_on_stream=True)

    out = list(
        run_chat(
            config=make_config(),
            cursor=cursor,
            embedder=fake,
            llm=fake,  # type: ignore[arg-type]
            message="ciao",
            session_id="sess-1",
            conversation_history=[],
            identifier="ip:1.2.3.4",
        )
    )
    events = _events(out)
    names = [e[0] for e in events]
    assert "start" in names
    assert names[-1] == "error"
    assert events[-1][1]["code"] == "LLM_FAILED"


def test_no_image_passes_none_to_llm() -> None:
    cursor = FakeCursor()
    cursor.fetchone_row = (0,)
    cursor.fetchall_rows = []
    fake = FakeLLM(pieces=["ok"])
    list(
        run_chat(
            config=make_config(),
            cursor=cursor,
            embedder=fake,
            llm=fake,  # type: ignore[arg-type]
            message="ciao",
            session_id="sess-1",
            conversation_history=[],
            identifier="ip:1.2.3.4",
        )
    )
    assert fake.received_image is None


def test_valid_image_normalized_and_passed_to_llm() -> None:
    cursor = FakeCursor()
    cursor.fetchone_row = (0,)
    cursor.fetchall_rows = []
    fake = FakeLLM(pieces=["ok"])
    out = list(
        run_chat(
            config=make_config(),
            cursor=cursor,
            embedder=fake,
            llm=fake,  # type: ignore[arg-type]
            message="cosa vedi?",
            session_id="sess-1",
            conversation_history=[],
            identifier="ip:1.2.3.4",
            image=_PNG_DATA_URL,
        )
    )
    events = _events(out)
    names = [e[0] for e in events]
    # Flusso normale: nessun errore immagine, pipeline completa.
    assert names[0] == "start"
    assert names[-1] == "complete"
    # L'LLM riceve un data-URL png normalizzato.
    assert fake.received_image is not None
    assert fake.received_image.startswith("data:image/png;base64,")


def test_invalid_image_emits_error_and_skips_llm() -> None:
    cursor = FakeCursor()
    cursor.fetchone_row = (0,)
    fake = FakeLLM(pieces=["ok"])
    out = list(
        run_chat(
            config=make_config(),
            cursor=cursor,
            embedder=fake,
            llm=fake,  # type: ignore[arg-type]
            message="guarda",
            session_id="sess-1",
            conversation_history=[],
            identifier="ip:1.2.3.4",
            image="data:image/jpeg;base64,"  # mime jpeg ma byte png -> mismatch
            + base64.b64encode(b"\x89\x50\x4e\x47\x0d\x0a\x1a\x0a").decode("ascii"),
        )
    )
    events = _events(out)
    assert len(events) == 1
    assert events[0][0] == "error"
    assert events[0][1]["code"] == "IMAGE_INVALID"
    # L'LLM non deve essere mai chiamato su immagine invalida.
    assert fake.received_image_calls == 0


def test_oversize_image_emits_too_large_error() -> None:
    cursor = FakeCursor()
    cursor.fetchone_row = (0,)
    fake = FakeLLM(pieces=["ok"])
    huge = "data:image/png;base64," + ("A" * (5 * 1024 * 1024 * 2))
    out = list(
        run_chat(
            config=make_config(),
            cursor=cursor,
            embedder=fake,
            llm=fake,  # type: ignore[arg-type]
            message="guarda",
            session_id="sess-1",
            conversation_history=[],
            identifier="ip:1.2.3.4",
            image=huge,
        )
    )
    events = _events(out)
    assert events[0][0] == "error"
    assert events[0][1]["code"] == "IMAGE_TOO_LARGE"
    assert fake.received_image_calls == 0
