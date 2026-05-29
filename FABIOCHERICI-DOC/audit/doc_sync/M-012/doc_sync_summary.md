# DOC-SYNC v2 Summary — M-012

**Mission**: Rename label porta home — `door_egi` "EGI" -> "Florence EGI" (7 locale)
**Date close**: 2026-05-29
**Trigger Matrix**: 2 (comportamentale substitutive)
**Outcome**: success
**Mode**: LSO ridotto (no RAG)

## Files modified (codebase)

7 file `messages/*.json` (it, en, de, es, fr, pt, zh) — 1 sostituzione per file:
- `home.door_egi`: `"EGI"` -> `"Florence EGI"`

## SSOT impacted

| SSOT | Mode | Status | Action |
|---|---|---|---|
| `i18n-messages` | substitutive | applied | Bump frontmatter (last_sync, last_verified_mission) + nuova CICATRICE M-012 |

- Direct: 1
- Lateral: 0 (RAG skipped)

## Modifiche SSOT i18n-messages.md

1. Frontmatter:
   - `last_sync`: 2026-05-28 -> 2026-05-29
   - `last_verified_mission`: M-011 -> M-012
2. Trappole note: aggiunta CICATRICE M-012 — pattern rename brand label (brand non tradotto, valore identico in 7 lingue, grep esaustivo prima del rename).

## SSOT_REGISTRY metadata

Indice 6 (i18n-messages) aggiornato:
- `last_verified`: 2026-05-29
- `verified_in_mission`: M-012
- `verification_mode`: registry_only
- `last_drift_score`: 0

## MISSION_REGISTRY

- Counter bumped: 11 -> 12
- M-012 entry created con status `closed`, `doc_sync_executed: true`, `doc_sync_outcome: success`

## Steps completed

- Step 1 — semantic analysis (trivial substitutive 1 key)
- Step 2 — direct SSOT discovery (1 match: i18n-messages)
- Step 3 — RAG lateral discovery SKIPPED (no RAG_SCHEMA)
- Step 4 — SSOT modifications applied (substitutive, no approval required: cambia solo brand label + metadata, no breaking change)
- Step 5 — RAG re-index SKIPPED (LSO ridotto)
- Step 5b — SSOT_REGISTRY metadata bumped
- Step 6 — audit trail written

## Verdict

GREEN. Mission M-012 chiusa cleanly. SSOT i18n-messages allineato col codice.
Pattern di rename brand label documentato per missioni future via CICATRICE M-012.

## Note

Brand "Florence EGI" e valore IDENTICO in tutte le 7 lingue — nessuna traduzione del brand.
Nessun nuovo file uncovered: tutti i 7 messages/*.json sono gia coperti da `i18n-messages` SSOT watch.
