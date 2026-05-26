---
id: M-001
title: Bootstrap SSOT Registry — Registrazione SSOT esistenti
organ: fabiocherici.com
priority: P1
status: closed
date_open: 2026-05-26
date_close: 2026-05-26
resumed_at: 2026-05-26
unblocked_by: ORACODE-DOC M-ORACODE-001 (closed 2026-05-26)
doc_sync_executed: true
doc_sync_outcome: success
doc_sync_ssots_verified: 7
doc_sync_rag_mode: skipped_no_schema
found_by: /project bootstrap — installazione Oracode livello 3
notes_resume: |
  Riprende dopo chiusura M-ORACODE-001. Sblocchi disponibili:
    (a) doc-sync-v2 v2.2 universale (instance_root parametrico)
    (b) rag_reindex.py + rag_query.py disponibili in /home/fabio/os3-matrix/bin/
    (c) rag-schema-template.sql disponibile per quando deciso RAG backend

  Per (c) RAG backend su stack static export Next.js: rimandato a mission
  separata futura M-FABIOCHERICI-002 (out of scope M-001). Per ora questa
  istanza opera in modalità "LSO ridotto" (§2.6 LSO_NOMENCLATURE_v2) —
  infrastruttura completa, RAG offline finché runtime disponibile.
---

# M-001 — Bootstrap SSOT Registry

## Problema

Progetto fabiocherici.com sviluppato senza tracking SSOT (livello 1 disciplina implicita).
Codice contiene 7 file annotati `@purpose` che fungono da Single Source of Truth ma non sono registrati nel Sistema Nervoso Documentale LSO.

Senza registry: modifiche a questi file non triggerano controllo DOC-SYNC. Drift silenzioso possibile.

## Soluzione

1. Identificare SSOT esistenti via grep `@purpose|Single source of truth` in `lib/` + `app/globals.css` + `messages/`
2. Creare stub SSOT docs in `FABIOCHERICI-DOC/docs/ssot/` per ogni SSOT
3. Popolare `SSOT_REGISTRY.json` con 7 entries
4. Verifica: ogni source file mappa a esattamente 1 SSOT doc

## SSOT registrati

| ssot_id | source file | doc path |
|---|---|---|
| animation-presets | `lib/animation.ts` | `docs/ssot/animation-presets.md` |
| scene3d-ids | `lib/scene3d.ts` | `docs/ssot/scene3d-ids.md` |
| i18n-config | `lib/i18n/config.ts` | `docs/ssot/i18n-config.md` |
| design-tokens | `app/globals.css` | `docs/ssot/design-tokens.md` |
| fonts | `lib/fonts.ts` | `docs/ssot/fonts.md` |
| seo | `lib/seo.ts` | `docs/ssot/seo.md` |
| i18n-messages | `messages/*.json` | `docs/ssot/i18n-messages.md` |

## File modificati

- `FABIOCHERICI-DOC/docs/missions/M-001_SSOT_BOOTSTRAP.md` (questo file)
- `FABIOCHERICI-DOC/docs/missions/MISSION_REGISTRY.json` (counter=1, entry M-001)
- `FABIOCHERICI-DOC/docs/lso/SSOT_REGISTRY.json` (7 entries)
- `FABIOCHERICI-DOC/docs/ssot/*.md` (7 stub doc creati)

## Esito

**CLOSED** 2026-05-26.

Sequenza completa:
1. **2026-05-26 open** — Mission aperta in stato `planning`, 7 SSOT identificati nel codebase
2. **2026-05-26 executing** — 7 stub SSOT doc creati + registry compilato + commit `cfb0885`
3. **2026-05-26 suspended** — Bloccata da gap framework Oracode (M-ORACODE-001 prerequisito)
4. **2026-05-26 in_progress** — Riapertura dopo chiusura M-ORACODE-001 (sblocchi doc-sync-v2 v2.2 + tooling generico)
5. **2026-05-26 closed** — DOC-SYNC v2 eseguito su istanza nested pattern (FINDING-MOA-4)

### DOC-SYNC v2 FASE 6 outcome

- **outcome**: success
- **rag_mode**: skipped_no_schema (LSO ridotto — RAG runtime non disponibile su stack static export)
- **ssots_impacted_direct**: 7 (tutti i SSOT registrati, modalità `additive` per bootstrap)
- **ssots_modified_additive**: 7 status=applied
- **rag_chunks_reindexed**: 0
- **audit_path**: `audit/doc_sync/M-001/`
- **steps_completed**: 1, 2, 4, 5b, 6 (Step 3 + 5 skip per modalità LSO ridotto)

### Metadata SSOT verificati

7 documents in `docs/lso/SSOT_REGISTRY.json` aggiornati con:
- `last_verified`: 2026-05-26
- `last_verified_by`: doc_sync_v2
- `verified_in_mission`: M-001
- `last_drift_score`: 0
- `verification_mode`: registry_only

### Finding registrato

**FINDING-MOA-4**: doc-sync-v2 v2.2 convenzione `instance_root` assume pattern `<INSTANCE>/CLAUDE.md` + `<INSTANCE>/docs/`. fabiocherici.com usa pattern **nested**: `<PROJECT>/CLAUDE.md` (root sito) + `<PROJECT>/FABIOCHERICI-DOC/docs/`. Workaround: creato `FABIOCHERICI-DOC/CLAUDE.md` placeholder che `@reference` il root. Da formalizzare in mission separata (`M-ORACODE-004` proposta).

### Mission successive proposte

- **M-FABIOCHERICI-002** — RAG backend per stack static export Next.js (Lambda + DB esterno / Vercel functions / WebLLM + pgvector). Abilita Step 3 + Step 5 di doc-sync-v2 per istanza.
- **M-ORACODE-004** (in ORACODE-DOC) — Formalizzare pattern istanza nested in convenzione `instance_root` doc-sync-v2.
