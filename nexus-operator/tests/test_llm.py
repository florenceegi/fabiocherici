# -*- coding: utf-8 -*-
"""
@package nexus-operator
@author  Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
@version 1.1.0 (Nexus Operator — fabiocherici.com)
@date    2026-06-15
@mission M-018
@purpose Test costruzione messaggi SDK multimodali (OpenAIClient._build_sdk_messages):
         senza immagine -> messaggi text-only invariati; con immagine ->
         l'ultimo user diventa content-parts (text + image_url); senza user
         finale l'immagine viene scartata. Nessuna chiamata OpenAI reale.
"""

from __future__ import annotations

from typing import Any, cast

import pytest

from app.llm import OpenAIClient, StreamTimeoutError
from app.prompt import ChatMessage

_IMG = "data:image/png;base64,AAAA"


def _msgs() -> list[ChatMessage]:
    return [
        {"role": "system", "content": "sys"},
        {"role": "user", "content": "guarda questo"},
    ]


def test_no_image_returns_text_only() -> None:
    out = OpenAIClient._build_sdk_messages(_msgs(), None)
    # Senza immagine: invariato, content resta stringa.
    assert out[-1]["content"] == "guarda questo"


def test_image_rewrites_last_user_to_content_parts() -> None:
    out = OpenAIClient._build_sdk_messages(_msgs(), _IMG)
    last = out[-1]
    assert last["role"] == "user"
    parts = cast("list[dict[str, object]]", last["content"])
    assert isinstance(parts, list)
    assert parts[0] == {"type": "text", "text": "guarda questo"}
    assert parts[1] == {"type": "image_url", "image_url": {"url": _IMG}}


def test_image_leaves_system_message_untouched() -> None:
    out = OpenAIClient._build_sdk_messages(_msgs(), _IMG)
    assert out[0]["role"] == "system"
    assert out[0]["content"] == "sys"


def test_image_targets_last_user_not_earlier() -> None:
    msgs: list[ChatMessage] = [
        {"role": "user", "content": "primo"},
        {"role": "assistant", "content": "risposta"},
        {"role": "user", "content": "secondo con foto"},
    ]
    out = OpenAIClient._build_sdk_messages(msgs, _IMG)
    # Solo l'ULTIMO user e' multimodale; il primo resta stringa.
    assert out[0]["content"] == "primo"
    parts = cast("list[dict[str, object]]", out[2]["content"])
    assert parts[0] == {"type": "text", "text": "secondo con foto"}


def test_image_dropped_when_no_user_message() -> None:
    msgs: list[ChatMessage] = [{"role": "system", "content": "sys"}]
    out = OpenAIClient._build_sdk_messages(msgs, _IMG)
    # Nessun user: immagine scartata, nessun content-part image_url emesso.
    assert all(isinstance(m["content"], str) for m in out)


# --- LLM04 cost/DoS: cap max_tokens + watchdog timeout sullo stream ---


class _FakeDelta:
    def __init__(self, content: str | None) -> None:
        self.content = content


class _FakeChoice:
    def __init__(self, content: str | None) -> None:
        self.delta = _FakeDelta(content)


class _FakeChunk:
    def __init__(self, content: str | None) -> None:
        self.choices = [_FakeChoice(content)]
        self.usage = None


class _StubClient(OpenAIClient):
    """Sottoclasse che intercetta il seam _create_stream: cattura i kwargs e
    ritorna chunk fissi, senza mai toccare la rete OpenAI."""

    def __init__(self, chunks: list[_FakeChunk], **kwargs: Any) -> None:
        super().__init__(
            api_key="sk-test",
            chat_model="gpt-4o",
            embedding_model="text-embedding-3-small",
            max_output_tokens=512,
            stream_timeout_seconds=60.0,
            **kwargs,
        )
        self._chunks = chunks
        self.captured: dict[str, Any] = {}

    def _create_stream(self, sdk_messages: Any) -> Any:
        # Replica i kwargs che il codice di produzione passerebbe all'SDK.
        self.captured = {"max_tokens": self._max_output_tokens}
        return self._chunks


def test_stream_passes_max_tokens_cap() -> None:
    client = _StubClient([_FakeChunk("ciao"), _FakeChunk(None)])
    list(client.stream_chat([{"role": "user", "content": "x"}]))
    # Il cap sull'output deve essere applicato (LLM04 cost cap).
    assert client.captured["max_tokens"] == 512


def test_stream_yields_content_then_done() -> None:
    client = _StubClient([_FakeChunk("a"), _FakeChunk("b"), _FakeChunk(None)])
    out = list(client.stream_chat([{"role": "user", "content": "x"}]))
    contents = [c.content for c in out if not c.done]
    assert contents == ["a", "b"]
    assert out[-1].done is True


# --- M-020: estrazione vision (extract_image_text) ---


class _FakeMessage:
    def __init__(self, content: str | None) -> None:
        self.content = content


class _FakeCompletionChoice:
    def __init__(self, content: str | None) -> None:
        self.message = _FakeMessage(content)


class _FakeCompletion:
    def __init__(self, content: str | None) -> None:
        self.choices = [_FakeCompletionChoice(content)]


class _FakeCompletions:
    def __init__(self, content: str | None) -> None:
        self._content = content
        self.captured: dict[str, Any] = {}

    def create(self, **kwargs: Any) -> _FakeCompletion:
        self.captured = kwargs
        return _FakeCompletion(self._content)


class _FakeChat:
    def __init__(self, completions: _FakeCompletions) -> None:
        self.completions = completions


class _FakeSDKClient:
    def __init__(self, completions: _FakeCompletions) -> None:
        self.chat = _FakeChat(completions)


def _client_with_fake_completions(
    content: str | None,
) -> tuple[OpenAIClient, _FakeCompletions]:
    client = OpenAIClient(
        api_key="sk-test",
        chat_model="gpt-4o",
        embedding_model="text-embedding-3-small",
    )
    completions = _FakeCompletions(content)
    # Inietta un SDK fake: nessuna rete. Accesso a un attributo privato giustificato
    # dal test (non c'e' seam pubblico per la create non-streaming).
    client._client = cast(Any, _FakeSDKClient(completions))  # noqa: SLF001
    return client, completions


def test_extract_image_text_returns_transcription_and_caps_tokens() -> None:
    client, completions = _client_with_fake_completions("RIGA1 | RIGA2 | 42")
    out = client.extract_image_text(_IMG)
    assert out == "RIGA1 | RIGA2 | 42"
    # Niente streaming + cap esplicito sui token (LLM04 cost cap).
    assert completions.captured["stream"] is False
    assert "max_tokens" in completions.captured
    # Il messaggio e' multimodale: una text part (prompt estrazione) + image_url.
    parts = completions.captured["messages"][0]["content"]
    assert parts[1] == {"type": "image_url", "image_url": {"url": _IMG}}


def test_extract_image_text_empty_content_returns_empty_string() -> None:
    client, _ = _client_with_fake_completions(None)
    assert client.extract_image_text(_IMG) == ""


def test_stream_timeout_raises() -> None:
    # Clock che oltrepassa il timeout dopo il primo chunk -> StreamTimeoutError.
    ticks = iter([0.0, 0.0, 999.0, 999.0, 999.0])

    def fake_clock() -> float:
        return next(ticks)

    client = _StubClient([_FakeChunk("a"), _FakeChunk("b")], time_source=fake_clock)
    with pytest.raises(StreamTimeoutError):
        list(client.stream_chat([{"role": "user", "content": "x"}]))
