# -*- coding: utf-8 -*-
"""
@package nexus-operator
@author  Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
@version 1.0.0 (Nexus Operator — fabiocherici.com)
@date    2026-06-16
@mission M-020
@purpose Test della memoria permanente file (estrazione vision + persistenza per
         sessione + caricamento ordinato + purge). Tutto via fake: niente OpenAI,
         niente Postgres vivo. Verifica: store assegna idx incrementale per
         sessione, load ordina per idx, l'estratto viene cappato in lunghezza, e
         il purge cancella oltre la retention con SQL parametrizzato.
"""

from __future__ import annotations

from app import filememory
from app.filememory import MAX_EXTRACTED_CHARS, SessionFile
from tests.conftest import FakeCursor


class FakeVisionExtractor:
    """VisionExtractor fake: ritorna un estratto programmato e registra le
    chiamate, per verificare che l'estrazione avvenga (UNA vision call)."""

    def __init__(self, text: str = "RIGA1 | RIGA2") -> None:
        self._text = text
        self.calls: list[str] = []

    def extract_image_text(self, image_data_url: str) -> str:
        self.calls.append(image_data_url)
        return self._text


def test_extract_calls_vision_once_and_returns_text() -> None:
    extractor = FakeVisionExtractor(text="Fattura n.42  Totale 100")
    out = filememory.extract_text("data:image/png;base64,AAAA", extractor)
    assert out == "Fattura n.42  Totale 100"
    assert len(extractor.calls) == 1


def test_extract_caps_length() -> None:
    extractor = FakeVisionExtractor(text="x" * (MAX_EXTRACTED_CHARS + 5000))
    out = filememory.extract_text("data:image/png;base64,AAAA", extractor)
    assert len(out) == MAX_EXTRACTED_CHARS


def test_store_assigns_incremental_idx() -> None:
    cursor = FakeCursor()
    cursor.fetchone_row = (None,)  # MAX(idx) NULL -> primo file -> idx 1
    idx1 = filememory.store_file(
        cursor, "rag_nexus", "sess-1", "image/png", "estratto A"
    )
    assert idx1 == 1
    cursor.fetchone_row = (1,)  # MAX(idx) ora 1 -> prossimo idx 2
    idx2 = filememory.store_file(
        cursor, "rag_nexus", "sess-1", "image/jpeg", "estratto B"
    )
    assert idx2 == 2
    # L'INSERT persiste solo testo estratto + idx/mime, mai i byte dell'immagine.
    inserts = [(q, p) for q, p in cursor.executed if "INSERT" in q]
    assert len(inserts) == 2
    # Tutti i valori sono parametrizzati (%s), nessun valore interpolato.
    last_insert_params = inserts[-1][1]
    assert "sess-1" in last_insert_params
    assert "estratto B" in last_insert_params


def test_store_caps_text_before_persist() -> None:
    cursor = FakeCursor()
    cursor.fetchone_row = (None,)
    filememory.store_file(
        cursor, "rag_nexus", "sess-1", "image/png", "y" * (MAX_EXTRACTED_CHARS + 100)
    )
    _, params = next((q, p) for q, p in cursor.executed if "INSERT" in q)
    persisted_text = next(p for p in params if isinstance(p, str) and p.startswith("y"))
    assert len(persisted_text) == MAX_EXTRACTED_CHARS


def test_load_files_orders_by_idx() -> None:
    cursor = FakeCursor()
    # Il DB ritorna gia' ORDER BY idx; verifichiamo il mapping in SessionFile.
    cursor.fetchall_rows = [
        (1, "image/png", "primo"),
        (2, "image/jpeg", "secondo"),
    ]
    files = filememory.load_files(cursor, "rag_nexus", "sess-1")
    assert [f.idx for f in files] == [1, 2]
    assert files[0] == SessionFile(idx=1, mime="image/png", extracted_text="primo")
    assert files[1].extracted_text == "secondo"
    # La SELECT ordina per idx.
    select_sql = next(q for q, _ in cursor.executed if "SELECT" in q)
    assert "ORDER BY idx" in select_sql


def test_load_files_empty_session_returns_empty() -> None:
    cursor = FakeCursor()
    cursor.fetchall_rows = []
    assert filememory.load_files(cursor, "rag_nexus", "sess-x") == []


def test_purge_old_uses_parametrized_retention() -> None:
    cursor = FakeCursor()
    filememory.purge_old(cursor, "rag_nexus", retention_days=30)
    delete_sql, params = next((q, p) for q, p in cursor.executed if "DELETE" in q)
    assert "operator_session_files" in delete_sql
    assert "%s" in delete_sql  # retention parametrizzato (CWE-89)
    assert 30 in params
