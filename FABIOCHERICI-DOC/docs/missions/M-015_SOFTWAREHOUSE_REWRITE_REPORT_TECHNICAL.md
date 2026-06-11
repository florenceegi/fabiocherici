# M-015 — Report Tecnico: Rewrite pagina /softwarehouse

**Mission:** M-015
**Data:** 2026-06-11
**Commit:** _(compilato al commit)_ su `main`
**Trigger:** 3 (pagina riscritta, 58 chiavi i18n nuove ×7 lingue, 5 componenti nuovi, contratto endpoint esterno)

## Scope

Rewrite completo di `/softwarehouse` su narrativa approvata (HANDOFF M-015 + SSOT
`commercial-claims.md` v1.0.0): Atto 1 risk-reversal ("Vedi prima, decidi dopo"),
Atto 2 Oracode Nexus → LSO. 8 sezioni da blueprint, testo ~1/4 del precedente
(namespace 202→112 chiavi). Eliminati: pain table, evidence/Trustpilot, hero
biografico, formula ENTERPRISE×ORACODE, portfolio LOC-first.

## Catena esecutiva (dottrina: architetti PRIMA dei dev)

1. `engineer-frontend` → design doc `M-015_DESIGN_SOFTWAREHOUSE.md` (11 UNCERTAINTY FLAGS)
2. Supervisor → risoluzione flag alla fonte (curl endpoint live, asset check, decisioni conservative)
3. `dev-frontend` → build (tsc pulito, test mission GREEN)
4. `dev-testing-qa` → acceptance §G: PASS 17 criteri, 0 FAIL (`M-015_QA_REPORT.md`)
5. `os3-audit-specialist` → PASS, 0 critici, 0 warning, 4 INFO

## File modificati

| File | Modifica |
|---|---|
| `app/[locale]/softwarehouse/page.tsx` | Rewrite 585→349 righe, 8 sezioni, server component; metadata/schema/Offer invariati |
| `components/softwarehouse/*.tsx` | 5 componenti NUOVI: SoftwarehouseHero (unico Canvas), LiveSiteStats (283 r, widget cantiere), LsoTraits (CSS-only), AdvisorSlot (v1 statico), SectionCta |
| `app/globals.css` | +16 r: `@keyframes lso-breathe` SOLO sotto `prefers-reduced-motion: no-preference` |
| `messages/{it,en,de,es,fr,pt,zh}.json` | 58 chiavi nuove, 148 eliminate, 54 sopravvissute (process/pricing invariati); meta title/description aggiornati al claim SSOT |
| `scripts/generate-og-images.mjs` | +entry `softwarehouse` (og:image era 404 — preesistente M-008, fixato) |
| `tests/m-015/test_softwarehouse_rewrite.sh` | Test acceptance P0-13 (RED→GREEN), 7 gruppi assert |
| `.oracode/project.json` | Fix regressione M-FUC-021: `ssot_globs` relativi a `instance_root` (il prefisso doppiava → gate SSOT-FIRST sempre RED; waiver motivato registrato su M-015) |
| `/home/fabio/os3-matrix/bin/web_quality_gate.py` | +`"zuerst"` minuscolo in whitelist DE diacritics (falso positivo; "Zuerst" maiuscolo già presente) |

## Widget cantiere LIVE (vincolo CEO: zero placeholder)

- Endpoint `GET https://stat.florenceegi.com/api/public/site-stats` verificato live
  pre-build (shape conforme HANDOFF §4; hours float → `Intl.NumberFormat` max 1 dec).
- Una fetch per mount, ignore-stale cleanup, `AbortSignal.timeout(8000)`, type-guard
  difensivo (campo mancante/NaN → stato error, mai a schermo).
- Stati discriminati loading/error/success; SSR/no-JS = fallback testuale SENZA numeri
  + link GitHub (P0-FC-2); `min-height` riservata anti-CLS.
- Count-up GSAP via `import('gsap')` in useEffect (P0-FC-1), one-shot su
  IntersectionObserver, disattivato con reduced-motion.
- A11y: numeri animati `aria-hidden` + valore finale `sr-only`; `aria-live="polite"`
  SOLO su stato loading/error (SC 4.1.3).
- `hours_note` endpoint ("manual + commit-estimate") MAI mostrato raw → chiave
  i18n `live_hours_note` (P0-FC-4).

## Chat advisor (progressive, dipendenza M-EGI)

v1 SENZA chat: `AdvisorSlot` statico (screenshot `chat_ai.png` + caption SSOT §3 r9 +
CTA "la provi in chiamata"). Innesto futuro: env `NEXT_PUBLIC_ADVISOR_CHAT_ENDPOINT`
a build time + componente `AdvisorChat` specificato nel design doc §D (non implementato
— niente componenti vuoti). Mission EGI da aprire (M-EGI-xxx, coda HANDOFF §8).

## Gate

- **Test m-015:** GREEN
- **tsc --noEmit:** pulito
- **Web Quality Gate:** **PASS 277/277** (dopo 3 fix: titoli meta ≤65 char incl.
  suffisso, fr senza apostrofo — `&#x27;` conta 5 char —, zh description ≥50 char)
- **QA acceptance §G:** PASS 17 criteri (`M-015_QA_REPORT.md`)
- **Audit OS3:** PASS — 0 critici, 0 warning, 4 INFO (engine `M-015/audits/03-os3-audit-specialist.md`); INFO-1 (firma test) già applicato
- **Gate umano residuo:** giudizio CEO dal vivo (CR-1/CR-8) — composizione visiva, copy review (metafora "fascicolo del fabbricato" soggetta a veto, SSOT §5.1)

## Anomalia OG epp.png ×7 — SPIEGATA (era in coda pre-deploy)

Non è regressione del generatore: `meta.epp_title` è IDENTICO nelle 7 lingue
("EPP — Environment Protection Programs") → input uguale, PNG uguale (md5 unico,
size ora uniforme 20065 B). Localizzazione del titolo EPP = decisione copy CEO,
non bug. Deploy non bloccato.

## Note tecniche / debiti

- [DEBITO sitewide, NON M-015] sr-only ", opens in new tab" hardcoded inglese
  (13 pagine) → mission dedicata con chiave `common.opens_new_tab` (QA NB-1)
- [DEBITO sitewide, NON M-015] JSON-LD `dangerouslySetInnerHTML` senza escape `<`
  → serializzatore in `lib/seo.ts` (audit INFO-3, accorpabile a NB-1)
- [BACKLOG P3] feature-guard `AbortSignal.timeout` o error boundary sul widget
  (audit INFO-2, rischio residuale 2026)
- Verifiche runtime browser (CLS visivo, Lighthouse LCP<2s) non eseguibili in CLI
  → checklist pre-deploy / giudizio CEO dal vivo (QA NB-3)
- Componenti infographics orfani dopo rewrite (EvidenceBox, FormulaBlock,
  ComparisonTable, PortfolioGrid): NON cancellati (possono servire altrove) —
  [DEBITO] se grep globale conferma zero usi
- `MISSING_MESSAGE: nav.preferences (fr)`: preesistente, fuori scope (HANDOFF §7)
