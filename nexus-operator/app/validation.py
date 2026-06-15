# -*- coding: utf-8 -*-
"""
@package nexus-operator
@author  Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
@version 1.1.0 (Nexus Operator — fabiocherici.com)
@date    2026-06-16
@mission M-017
@purpose Validazione input ai confini con Pydantic (OWASP Proactive Controls C3:
         validate input allow-list). Porta le regole di
         FreeAiChatController::validate: message required|string|max:2000,
         session_id required|string|max:100, conversation_history array|max:20.
         Limiti effettivi presi da Config a runtime via factory.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field, field_validator, model_validator

# Tetto GREZZO sulla lunghezza della stringa data-URL al confine Pydantic: solo
# guardia DoS economica (rifiuta payload abnormi prima della pipeline). La
# validazione SEMANTICA (forma data-URL, MIME allow-list, magic bytes, byte reali)
# vive in app/image.py ed e' invocata nella pipeline, dove un rifiuto diventa un
# evento SSE `error` dedicato (non un 422). base64 ~4/3 di 5MB + margine.
_MAX_IMAGE_DATAURL_LEN: int = (5 * 1024 * 1024) // 3 * 4 + 1024

# LLM04 cost cap: tetto sulla SOMMA dei caratteri della conversation_history.
# Il limite per-entry (8000) e il count (20) non bastano: 20*8000 = 160k char di
# input -> costo token significativo con gpt-4o. Allineato al default di Config
# (NEXUS_MAX_HISTORY_TOTAL_CHARS=24000). main.py applica anche il gate per-config.
_MAX_HISTORY_TOTAL_CHARS: int = 24000


class HistoryEntry(BaseModel):
    """Una entry della history. role vincolato (allow-list), content limitato."""

    role: Literal["user", "assistant", "system"]
    content: str = Field(min_length=1, max_length=8000)


class ChatRequest(BaseModel):
    """Body di POST /chat. I max sono i default della spec; main.py applica i
    limiti di Config (max_message_length, max_history) come secondo gate
    coerente con la configurazione attiva."""

    message: str = Field(min_length=1, max_length=2000)
    session_id: str = Field(min_length=1, max_length=100)
    conversation_history: list[HistoryEntry] = Field(default_factory=list, max_length=20)
    # Immagine OPZIONALE: data-URL base64 (image/jpeg|png). Qui solo tetto grezzo
    # di lunghezza (DoS guard); validazione semantica in pipeline -> SSE error.
    image: str | None = Field(default=None, max_length=_MAX_IMAGE_DATAURL_LEN)

    @field_validator("message", "session_id")
    @classmethod
    def _not_blank(cls, value: str) -> str:
        """Rifiuta stringhe di soli spazi (max:... non basta: ' ' passerebbe).
        Allow-list minima: deve contenere caratteri non-spazio."""
        if not value.strip():
            raise ValueError("Campo vuoto o solo spazi")
        return value

    @model_validator(mode="after")
    def _history_total_within_budget(self) -> "ChatRequest":
        """Cap sulla SOMMA dei caratteri della history (LLM04 cost cap input):
        i limiti per-entry e per-count non frenano un input totale enorme."""
        total = sum(len(entry.content) for entry in self.conversation_history)
        if total > _MAX_HISTORY_TOTAL_CHARS:
            raise ValueError(
                "Conversazione troppo lunga: riduci la cronologia inviata."
            )
        return self
