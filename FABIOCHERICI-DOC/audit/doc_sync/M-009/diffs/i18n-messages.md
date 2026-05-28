# Diff narrativo — SSOT `i18n-messages`

**Mode**: additive
**Mission**: M-009
**File**: `FABIOCHERICI-DOC/docs/ssot/i18n-messages.md`
**Hash before**: `79d0a1bb0df8338725ba167788900181439dba67e764cd1a6cbdd8a4e3eeec8a`
**Status**: applied

## Cosa cambia

Aggiornamento puramente additivo. Semantica esistente regge: la doc descrive struttura/file/policy generale, non singoli namespace. M-009 aggiunge `epp.widgets.*` (10 chiavi top-level x 7 lingue) e corregge 3 chiavi meta che erano `null` da bootstrap.

### Front matter
- `last_sync`: 2026-05-26 → 2026-05-28

### Nuova sezione "Namespace principali"
Catalogo top-level keys: ainous, contatti, creazioni, ecosistema, egi, epp (incluso sub-namespace `epp.widgets` introdotto da M-009), footer, home, meta, nav, navbar_quotes, not_found, numeri, oracode, preferences, privacy, prove, softwarehouse, under_construction.

### Sezione "Trappole note" — 2 nuove cicatrici M-009
1. **meta null discoveries**: `meta.epp_title`, `meta.epp_description`, `meta.seo_section_epp` erano `null` da bootstrap. Fix obbligatorio quando una pagina con `generateMetadata` viene attivata. Cataloga il pattern per le pagine future.
2. **Parita strutturale sub-namespace gerarchici**: per nested namespace come `epp.widgets.{programma}.{campo}`, la parita non e' solo top-key — e' albero figli completo. Tutte le 7 lingue devono presentare lo stesso albero con stesso numero di leaf.

## Nessuna semantica esistente alterata

- Lista file sorgente invariata
- Descrizione "chiavi atomiche, gerarchiche per pagina/component" invariata
- P0-FC-4 invariato (anzi rinforzato dalla nuova trappola parita sub-namespace)
- Quality gate i18n 11/11 PASS resta valido
