---
id: M-001
title: Bootstrap SSOT Registry — Registrazione SSOT esistenti
organ: fabiocherici.com
priority: P1
status: suspended
date_open: 2026-05-26
date_close: null
suspended_at: 2026-05-26
suspend_reason: |
  Blocked by ORACODE-DOC M-ORACODE-001 — Audit Oracode v2 chiusura accoppiamenti FlorenceEGI.
  Riprende dopo:
    (a) doc-sync-v2 agent generico (path SSOT_REGISTRY parametrico)
    (b) rag_reindex.py + rag_query.py reinstallati genericizzati in os3-matrix/bin
    (c) RAG backend deciso per stack static export (mission separata)
found_by: /project bootstrap — installazione Oracode livello 3
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

OPEN — close dopo conferma utente che registry rispecchia stato reale codebase.
