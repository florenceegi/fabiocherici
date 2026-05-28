# DOC-SYNC Diff — seo.md (M-010)

## SSOT
`FABIOCHERICI-DOC/docs/ssot/seo.md`

## Mode
`additive` (applied)

## Justification
Mission M-010 ha forzato l'accorciamento di `meta.epp_description` in 6/7 locale per rispettare
soglia SEO Google ≤160 chars (era 186-207 in IT/EN/DE/ES/FR/PT).

La doc esistente non documentava il vincolo ≤160 chars ne il check del quality gate S-3.
Aggiunte 2 CICATRICI M-010 in "Trappole note":

1. Soglia meta description ≤160 chars + check S-3 in `web_quality_gate.py` (cross-project os3-matrix)
2. Workflow obbligatorio: quality gate hook va rigenerato e verificato PRIMA di FASE 6 close

Aggiunto anche `last_verified_mission: M-010` nel frontmatter.

## Tipo modifica
ADDITIVE (lessons learned aggiunte, nessuna sezione esistente rimossa o modificata semanticamente).

Nota: `lib/seo.ts` non e stato toccato in M-010 — il fix e stato sui dati i18n e sul whitelist
DE in `web_quality_gate.py` (cross-project). Il match watcher su `app/[locale]/**/page.tsx` e
scattato per le 3 occorrenze rinominate in `epp/page.tsx`, ma la natura del cambio resta i18n
+ SEO meta lunghezza.

## Hash file
- Pre-edit:  `2477338e2d4ab5cb491d73ad500cb33cc3525d145f41ed34296593bc63f9063c`
- Post-edit: (ricalcolato in Step 5b)
