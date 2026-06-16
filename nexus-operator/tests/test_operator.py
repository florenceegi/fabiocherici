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
    """Fake LLM: embed + stream_chat + extract_image_text. Programmabile con pezzi
    di testo o errore. Registra le vision call (extract) e i messaggi passati a
    stream_chat, per verificare estrazione e iniezione. Soddisfa VisionExtractor.

    M-020: l'immagine NON e' piu' passata a stream_chat (il contenuto viaggia come
    testo estratto nel prompt) -> stream_chat espone solo `messages`."""

    def __init__(
        self,
        pieces: list[str] | None = None,
        raise_on_stream: bool = False,
        extracted: str = "ESTRATTO: tabella turni 25 persone",
    ) -> None:
        self._pieces = pieces if pieces is not None else ["Ciao", " come stai?"]
        self._raise = raise_on_stream
        self._extracted = extracted
        self.extract_calls: list[str] = []
        self.stream_calls: int = 0
        self.last_messages: list[ChatMessage] | None = None

    def embed(self, text: str) -> list[float]:
        return [0.1, 0.1, 0.1]

    def extract_image_text(self, image_data_url: str) -> str:
        self.extract_calls.append(image_data_url)
        return self._extracted

    def stream_chat(self, messages: list[ChatMessage]) -> Iterator[StreamChunk]:
        self.stream_calls += 1
        self.last_messages = messages
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


class MemoryCursor:
    """Cursore in-memory STATEFUL per i test del flusso completo M-020: instrada
    su `fetchone`/`fetchall` in base alla SQL ricevuta (rate-limit count,
    MAX(idx), INSERT file, SELECT file ordinati). Niente Postgres reale.
    Soddisfa la porta DbCursor. `files` e' la tabella operator_session_files
    in memoria come tuple (session_id, idx, mime, extracted_text)."""

    def __init__(self, rate_count: int = 0) -> None:
        self.rate_count = rate_count
        self.files: list[tuple[str, int, str, str]] = []
        self._last: tuple[str, tuple[object, ...]] | None = None

    def execute(self, query: str, params: tuple[object, ...]) -> object:
        self._last = (query, params)
        # INSERT file: (session_id, idx, mime, extracted_text).
        if "INSERT INTO" in query and "operator_session_files" in query:
            sid, idx, mime, text = params
            self.files.append((str(sid), int(str(idx)), str(mime), str(text)))
        return None

    def fetchone(self) -> tuple[object, ...] | None:
        assert self._last is not None
        query, params = self._last
        if "MAX(idx)" in query:
            sid = str(params[0])
            idxs = [f[1] for f in self.files if f[0] == sid]
            return (max(idxs) if idxs else None,)
        if "operator_rate_limit" in query and "RETURNING" in query:
            self.rate_count += 1
            return (self.rate_count,)
        if "SELECT count FROM" in query:
            return (self.rate_count,)
        return None

    def fetchall(self) -> list[tuple[object, ...]]:
        assert self._last is not None
        query, params = self._last
        if "operator_session_files" in query and "SELECT idx" in query:
            sid = str(params[0])
            rows = sorted((f for f in self.files if f[0] == sid), key=lambda r: r[1])
            return [(r[1], r[2], r[3]) for r in rows]
        # RAG retrieval: nessun chunk nei test del flusso file.
        return []


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


def test_no_image_no_extraction_no_shared_files() -> None:
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
            message="ciao",
            session_id="sess-1",
            conversation_history=[],
            identifier="ip:1.2.3.4",
        )
    )
    # Nessuna immagine -> nessuna vision call; nessun file in sessione.
    assert fake.extract_calls == []
    events = _events(out)
    assert events[0][1]["shared_files"] == 0


def test_valid_image_extracted_persisted_not_resent_to_llm() -> None:
    """M-020: l'immagine valida viene ESTRATTA (una vision call) e PERSISTITA;
    il suo contenuto entra nel prompt come testo (DOCUMENTI CONDIVISI), NON come
    immagine re-inviata allo stream chat (una sola vision call per immagine)."""
    cursor = MemoryCursor(rate_count=0)
    fake = FakeLLM(pieces=["ok"], extracted="COLONNE: data, autista, mezzo")
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
    assert names[0] == "start"
    assert names[-1] == "complete"
    # UNA sola vision call (estrazione), sul data-URL normalizzato.
    assert len(fake.extract_calls) == 1
    assert fake.extract_calls[0].startswith("data:image/png;base64,")
    # start riporta 1 file di sessione iniettato.
    assert events[0][1]["shared_files"] == 1
    # Il file e' stato persistito (idx 1) col testo estratto.
    assert cursor.files == [("sess-1", 1, "image/png", "COLONNE: data, autista, mezzo")]
    # Il prompt di sistema contiene il blocco DOCUMENTI CONDIVISI + l'estratto.
    assert fake.last_messages is not None
    system = fake.last_messages[0]["content"]
    assert "DOCUMENTS THE USER HAS SHARED" in system
    assert "COLONNE: data, autista, mezzo" in system


def test_second_turn_without_image_still_sees_previous_file() -> None:
    """Turno 2 SENZA immagine ma con un file gia' in sessione: il contenuto del
    file precedente e' nel prompt, senza re-invio (memoria di sessione reale)."""
    cursor = MemoryCursor(rate_count=0)
    # Pre-popola la sessione con un file gia' estratto al turno 1.
    cursor.files.append(("sess-1", 1, "image/png", "ESTRATTO PRECEDENTE foglio Excel"))
    fake = FakeLLM(pieces=["ok"])
    out = list(
        run_chat(
            config=make_config(),
            cursor=cursor,
            embedder=fake,
            llm=fake,  # type: ignore[arg-type]
            message="analizza i file che ti ho mandato",
            session_id="sess-1",
            conversation_history=[],
            identifier="ip:1.2.3.4",
        )
    )
    events = _events(out)
    # Nessuna nuova estrazione (nessuna immagine in questo turno).
    assert fake.extract_calls == []
    assert events[0][1]["shared_files"] == 1
    assert fake.last_messages is not None
    system = fake.last_messages[0]["content"]
    assert "ESTRATTO PRECEDENTE foglio Excel" in system


def test_two_files_evaluated_together() -> None:
    """Due file nella stessa sessione: entrambi compaiono nel prompt, ordinati."""
    cursor = MemoryCursor(rate_count=0)
    cursor.files.append(("sess-1", 1, "image/png", "FILE UNO contenuto"))
    cursor.files.append(("sess-1", 2, "image/jpeg", "FILE DUE contenuto"))
    fake = FakeLLM(pieces=["ok"])
    list(
        run_chat(
            config=make_config(),
            cursor=cursor,
            embedder=fake,
            llm=fake,  # type: ignore[arg-type]
            message="confronta i due",
            session_id="sess-1",
            conversation_history=[],
            identifier="ip:1.2.3.4",
        )
    )
    assert fake.last_messages is not None
    system = fake.last_messages[0]["content"]
    assert "FILE 1 (image/png)" in system
    assert "FILE 2 (image/jpeg)" in system
    assert system.index("FILE UNO") < system.index("FILE DUE")


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
    # Su immagine invalida: nessuna estrazione, nessuno stream LLM.
    assert fake.extract_calls == []
    assert fake.stream_calls == 0


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
    assert fake.extract_calls == []
    assert fake.stream_calls == 0
