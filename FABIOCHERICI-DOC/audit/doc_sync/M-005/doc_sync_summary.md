# DOC-SYNC v2.2 — M-005 Summary

> Mission: `M-005` — EPP split chart label non-overlapping (CSS layout fix)
> Commit: `1f53de8`
> Instance: `fabiocherici.com` (LSO mono-organo)
> Executed: 2026-05-26
> Outcome: **success**

## Files della mission

| File | Tipo | LOC |
|---|---|---|
| `app/[locale]/epp/page.tsx` | modified | +2 / -2 |
| `tests/m-005/test_split_chart_svg_inline.sh` | created | +18 |

## Analisi semantica

Il diff modifica esclusivamente le classi Tailwind di posizionamento assoluto (`top-[X%] right-[Y%]`) su due `<span>` decorativi del donut chart EPP:

- **PIATTAFORMA label**: `top-[8%] right-[32%]` → `top-[2%] right-[38%]`
- **FRANGETTE label**: `top-[14%] right-[24%]` → `top-[2%] right-[18%]`

Scopo: stack orizzontale gap 20% right, eliminazione overlap quadrante TOP-RIGHT. Nessuna modifica a metadata, contenuto i18n, struttura semantica, contratti SEO, hreflang, canonical, design tokens, animazioni o scene 3D.

## SSOT impattati

### Direct (1)

| SSOT | Pattern matchato | Decisione | Giustificazione |
|---|---|---|---|
| `seo` (`docs/ssot/seo.md`) | `app/[locale]/**/page.tsx` | **no_change** | Lo SSOT descrive canonical URL builder, hreflang alternates e metadata config. Il diff e CSS puro su layout label decorative — non tocca `generateMetadata`, `alternates`, `canonical`, ne le locales. Contratto SEO immutato. |

### Lateral (0)

`rag_mode: skipped_no_schema` — instance fabiocherici.com non ha RAG_SCHEMA configurato (LSO mono-organo). Step 3 saltato per spec v2.2.0.

## RAG re-indexing

`skipped_no_schema` — nessun re-indexing necessario, nessun sanity check eseguito.

## Aggiornamento metadati SSOT_REGISTRY

| SSOT | last_verified | verified_in_mission | last_drift_score |
|---|---|---|---|
| `seo` | 2026-05-26 | M-005 | 0 |

Update legittimo per Step 5b: status `no_change` con giustificazione tracciabile + RAG skip per assenza schema (non per fallimento).

## Coverage check (P0-8 v2.1)

**Uncovered new files (informativo, non blocca):**

- `tests/m-005/test_split_chart_svg_inline.sh` — nessun SSOT del registry watcha `tests/**`. Segnalazione per triage copertura futura.

## Anti-pattern audit

| # | Anti-pattern | Compliance |
|---|---|---|
| AP-1 | Mai aggiornare solo metadati | PASS — metadati aggiornati DOPO verifica semantica reale |
| AP-2 | Mai procedere con rifiuti aperti | PASS — nessun rifiuto, decisione automatica |
| AP-3 | RAG sincrono | PASS — skip per assenza schema, non blocca |
| AP-4 | Sanity check bloccante | PASS — N/A (no RAG) |
| AP-5 | Idempotenza | PASS — hash registrato per riesecuzione |
| AP-9 | Lavoro solo su file mission | PASS — scansionati solo i 2 file del commit |

## Esito

**outcome: success** — 1 SSOT verificato (no_change con giustificazione), 0 modifiche applicate, 0 approvals richieste, 0 fallimenti. Mission M-005 puo chiudere.
