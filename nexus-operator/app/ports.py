# -*- coding: utf-8 -*-
"""
@package nexus-operator
@author  Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
@version 1.1.0 (Nexus Operator — fabiocherici.com)
@date    2026-06-16
@mission M-017, M-020
@purpose Porte (Protocol, PEP 544 — ISP/DIP) condivise dai moduli di dominio.
         Un unico DbCursor evita Protocol divergenti tra rag.py e ratelimit.py
         (mypy --strict: invarianza dei Protocol). Subset di psycopg2 cursor:
         execute/fetchall/fetchone. Permette di iniettare un fake nei test.
         M-020: aggiunta la porta VisionExtractor (estrazione contenuto immagine)
         per disaccoppiare filememory/operator dall'SDK OpenAI (DIP).
"""

from __future__ import annotations

from typing import Protocol


class DbCursor(Protocol):
    """Cursore DB minimale usato dai moduli di dominio (rag, ratelimit)."""

    def execute(self, query: str, params: tuple[object, ...]) -> object: ...

    def fetchall(self) -> list[tuple[object, ...]]: ...

    def fetchone(self) -> tuple[object, ...] | None: ...


class EmbeddingClient(Protocol):
    """Client di embedding (DIP): rag.py dipende da questa porta, non dall'SDK."""

    def embed(self, text: str) -> list[float]: ...


class VisionExtractor(Protocol):
    """Porta per l'estrazione del contenuto di un'immagine (PEP 544 structural
    subtyping — ISP/DIP). filememory.py dipende da questa astrazione, non
    dall'SDK OpenAI: nei test si inietta un fake senza toccare la rete.
    `image_data_url` e' un data-URL gia' VALIDATO a monte (app.image)."""

    def extract_image_text(self, image_data_url: str) -> str: ...
