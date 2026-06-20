# M-FABIOCHERICI-001 — Report Tecnico

> Kit AI-Act — banner disclosure Art. 50(1) sulla chat Padmin + /ai-transparency
> fabiocherici.com (Next/next-intl) · 2026-06-20 · Padmin D. Curtis for Fabio Cherici

## Scope
Propagazione del kit AI-Act (programma per-organo, decisione CEO) sul sito del CEO, che ha il chatbot
"Padmin" (Art. 50(1) AI Act: l'utente va informato di interagire con un'IA). Secondo target dopo DIMOSTRALO.

## Implementazione
- **Copia verbatim del canonico** (da M-DIM-003): `components/ai-act/` — i 3 file core (AiDisclosureBanner.tsx,
  .module.css, ai-disclosure-i18n.ts) sono **md5-identici** al canonico (regola README: le copie non si
  editano a mano). Test 13 verdi nel contesto fabiocherici.
- **Wiring PadminChat**: sostituita la disclosure ad-hoc `<p>{t('disclosure')}</p>` con
  `<AiDisclosureBanner locale={useLocale()} variant="inline" transparencyUrl={`/${locale}/ai-transparency`} />`
  prima del primo input (Art. 50(5)). Strategia Delta: il banner standard fa ciò che faceva il `<p>` + link +
  look coerente. Il claim distintivo "risposte fondate sui documenti del progetto" è preservato sulla pagina.
- **Pagina** `app/[locale]/ai-transparency/page.tsx`: Next/next-intl SSG, generateMetadata + setRequestLocale,
  landmark + JSON-LD (buildPageSchema), indicizzabile. Namespace `aiTransparency` nei **7** message file.
- **zh**: il banner canonico è 6 lingue → per zh fallback en (gap dichiarato). La pagina /ai-transparency ha
  invece testo zh nativo completo.
- **sitemap**: aggiunta /ai-transparency (7 locale + x-default) a public/sitemap.xml.

## Test + Gate
- Vitest 26 verdi (13 banner + 13 suite nexus, incl. 3 PadminChat con mock useLocale aggiunto). tsc 0 errori.
- web-quality-gate: **PASS** (273/273 deterministico, post-fix di 2 BLOCK: meta description ≤160 su it/es/fr/pt
  e inclusione in sitemap). Report: `FABIOCHERICI-DOC/audit/web-quality/ai-transparency.json`.
- Audit OS3: PASS_WITH_DEBT — unico debito P2 (evidenza gate) chiuso committando il report artifact.

## Consegna
Commit 97c31f3, branch main, pushato. Deploy = pipeline del sito (CloudFront/static export).

## Note
Friction tooling (ricorrente): l'agente web-quality-gate produce il report con `gate`=nome invece del verdetto
e senza array `checks` → il hook di enforcement crasha. Risolto rieseguendo il gate con lo schema esatto del
hook (verdetto determinato dal gate, non forzato). Debito di prodotto: allineare lo schema del report.

## Prossimi (programma kit)
EGI-SIGILLO (Vite) + EGI-HUB (React): stessa copia canonica. Tipo-documento legale `ai_act` per-organo.
Estendere canonico a zh = decisione ecosistema (oggi fabiocherici è l'unico 7-lingue).
