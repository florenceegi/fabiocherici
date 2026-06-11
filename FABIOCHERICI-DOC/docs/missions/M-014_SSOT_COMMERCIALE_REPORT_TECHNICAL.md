# M-014 — Report Tecnico: SSOT Commerciale

**Mission:** M-014 | **Data:** 2026-06-11 | **Trigger:** 1 | **Tipo:** doc-only

## Scope

Creazione dell'SSOT commerciale `commercial-claims` — prerequisito P0-FC-6 per
il rewrite della pagina /softwarehouse. Chiude il gap rilevato in discovery:
non esisteva fonte unica per i claim commerciali del sito.

## Artefatti

| File | Contenuto |
|---|---|
| `FABIOCHERICI-DOC/docs/ssot/commercial-claims.md` v1.0.0 | Tesi pagina (risk-reversal + Oracode Nexus protagonista→LSO deliverable), 3 linee offerta, claim citabili con fonte/frame, claim vietati, linguaggio LSO cliente, protocollo demo, dipendenze tecniche, registro decisioni CEO |
| `FABIOCHERICI-DOC/docs/lso/SSOT_REGISTRY.json` | Entry `commercial-claims` (content-ssot, critical, on_commit, verification_mode registry_only; watches: softwarehouse/page.tsx + messages/it.json) |
| `tests/m-014/test_ssot_commerciale.sh` | Acceptance: doc presente + sezioni obbligatorie + decisioni vincolanti + registrazione registry — GREEN |

## Fonte delle decisioni

Brainstorm CEO 2026-06-11 (sessione discovery: engineer-product ×2, ricognizione
ai_sidebar/advisor su EGI, analisi pattern Trend Micro) + contenuti in produzione
(messages/it.json `process_*`/`pricing_*`, M-008) + SSOT canonico LSO v4.0.0.

## Audit

PASS — 0 critici, 2 WARNING + 2 INFO **assorbiti in mission**: frontmatter
allineato a schema istanza (ssot_id/organ/last_sync), §7 precisato (nel RAG
pubblico solo proiezione pubblica del SSOT, mai §2/§4/§6), 70-80% marcato
parametro interno non pubblicabile, registry con verification_mode.

## Sblocca

- M-015 (rewrite pagina softwarehouse: design engineer-frontend su questo SSOT)
- M-EGI (advisor endpoint fabiocherici + CORS)
- M-EGI-STAT (endpoint stats live cantiere)
