# -*- coding: utf-8 -*-
"""
@package nexus-operator
@author  Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
@version 1.0.0 (Nexus Operator — fabiocherici.com)
@date    2026-06-15
@mission M-017
@purpose Formattazione eventi Server-Sent Events. Porta 1:1
         FreeAiChatService::formatSSE: "event: {name}\\ndata: {json}\\n\\n".
         Lo STESSO formato e' atteso dal frontend (free-ai-chat.js handleStream:
         legge righe `event: ` e `data: `, fa JSON.parse del data e usa
         d.content sui chunk). Mantenere questo contratto e' obbligatorio per
         agganciare il widget.
"""

from __future__ import annotations

import json


def format_sse(event: str, data: dict[str, object]) -> str:
    """Serializza un evento SSE. ensure_ascii=False per non escapare i caratteri
    accentati / multilingua (il JS fa JSON.parse, gestisce UTF-8). Formato
    identico al PHP: header `event:`, payload `data:` JSON, doppio newline
    terminale che chiude l'evento (spec SSE / WHATWG)."""
    payload = json.dumps(data, ensure_ascii=False)
    return f"event: {event}\ndata: {payload}\n\n"
