---
title: M-015 QA Report — Verifica Acceptance Criteria §G (rewrite /softwarehouse)
doc_type: qa-report
mission: M-015
status: closed
date: '2026-06-11'
author: Padmin D. Curtis (AI Partner OS3.0 — dev-testing-qa) for Fabio Cherici
verdict: PASS
---

# M-015 — QA Report Acceptance Criteria §G

> Verifica indipendente dei criteri §G di `M-015_DESIGN_SOFTWAREHOUSE.md`
> contro sorgente (working tree), build statico `out/<locale>/softwarehouse.html`
> e SSOT `commercial-claims.md` §4. Solo lettura + esecuzione test; nessuna modifica.
> Baseline diff M-008 = `HEAD` (M-015 nel working tree, non ancora committata).

## 0. Test mission (ri-esecuzione)

| Check | Esito | Evidenza |
|---|---|---|
| `bash tests/m-015/test_softwarehouse_rewrite.sh` | **PASS** | Output: `GREEN: rewrite softwarehouse conforme — sezioni, componenti, i18n 7 lingue, claim compliance, P0-FC-1, widget live OK` |
| web-quality-gate | **PASS (riferito)** | 277/277 dichiarato dal task; non rieseguito in questa sessione QA |

## 1. Criteri §G — Per sezione

| Criterio | Esito | Evidenza |
|---|---|---|
| **S1** h1 = "Vedi il tuo software funzionare. Poi decidi."; no biografia; 1 Canvas; hero leggibile no-JS | **PASS** | h1 esatto in `out/it/softwarehouse.html` (estrazione heading). "Magicsoft"/"1995"/"ritorno consapevole" assenti dal namespace `softwarehouse` (7 lingue). `<canvas>` nel markup SSR = 0 (lazy via `Scene3DSwitch`, montato SOLO in `components/softwarehouse/SoftwarehouseHero.tsx:25` — unico riferimento in pagina). Testo hero (title/sub/CTA) presente nell'HTML statico |
| **S2** numeri reali da endpoint; ore protagoniste; righe in coda corpo minore; `generated_at`/`last_activity` visibili; no-JS → fallback senza numeri + GitHub; errore umano senza numeri; no CLS | **PASS** (statico+endpoint) / runtime visivo delegato | `curl https://stat.florenceegi.com/api/public/site-stats` → shape conforme all'interfaccia `SiteStats` (hours_total 2243.7, hours_last_7_days 179.4, projects 23, active 21, lines 2595750, generated_at, last_activity). Sorgente `LiveSiteStats.tsx`: riga 1 ore `size="lg"` (r219-236), righe nette riga 3 `size="sm"` dopo `border-t` (r264-273), `generated_at`/`last_activity` renderizzati (r256, r277). Fallback `live_fallback` e `live_error`: zero cifre in tutte e 7 le lingue. Anti-CLS by-design: `min-h-[26rem]...` (r204). Verifica visiva + Lighthouse CLS: NON eseguibile in questo ambiente → finding NB-3 |
| **S3** 3 card; beneficio prima di "LSO"; Sigillo claim esatto; card 3 senza prezzi/percentuali | **PASS** | `offer_1_desc`: "Vedi un MVP funzionante prima di firmare ... Quello che ricevi è un LSO" — beneficio precede il termine. `offer_2_desc`: "hash del front-end e l'impegno di vendita singola" + "Pianale collaudato, carrozzeria unica" (SSOT §3 r7, §4.8 — nessun claim più ampio). `offer_3_desc`: zero cifre/percentuali |
| **S4** FlowDiagram con `process_*` invariati (diff = solo intro) | **PASS** | Diff JSON HEAD↔working-tree ×7 lingue: removed `process_intro`, added `process_intro_v2`, changed = [] su tutti gli altri `process_*`. `components/infographics/FlowDiagram.tsx` non modificato (git status) |
| **S5** LSO inglese + traduzione it sotto; 3 trait SSOT §5; chiusura VERBATIM; no formule; respiro on/off reduced-motion; demo mostrata + CTA; no chat interattiva | **PASS** | `lso_name`/`lso_name_translation` renderizzati in sequenza (page.tsx:248-253). Trait nell'HTML it: "Si documenta da solo" / "Puoi parlargli" / "Sente quando qualcosa non torna" = SSOT §5. Chiusura verbatim "Risultato: non dipendi da nessuno. Nemmeno da me." presente nell'HTML (match esatto). Formule (`×`, `ORACODE =`): assenti. Respiro: `animation: lso-breathe` SOLO dentro `@media (prefers-reduced-motion: no-preference)` (globals.css:265-268). Demo = `AdvisorSlot` statico (screenshot + caption + CTA `#contatto`); nessun componente chat in v1 |
| **S6** solo IdealOro; link live funzionante; no Capasso; no LOC | **PASS** | Unica `PortfolioCard` (page.tsx:281-286). `curl -I https://preview.florenceegi.com` → HTTP 200. "Capasso"/"pinocapasso": assenti dal namespace. `demos_*`: nessuna occorrenza righe/LOC/numeri |
| **S7** 5 fasce IDENTICHE a M-008 | **PASS** | Diff JSON `pricing_*` HEAD↔working-tree = zero (removed/added/changed vuoti) in tutte e 7 le lingue. Le 5 fasce €2.000–€5.000 ... €30.000–€60.000 presenti nell'HTML it |
| **S8** claim "Prima chiamata: esci con un parere onesto"; bottoni email + WhatsApp | **PASS** | h2 esatto nell'HTML it. `mailto:fabio@florenceegi.com?subject=Softwarehouse` ×2 e `https://wa.me/393388350412` presenti in `out/it/softwarehouse.html` |
| **CTA intermedie** dopo S3, S5, S7 ancorate | **PASS** | `SectionCta` in page.tsx:215 (S3→`#contatto`), :266 (S5→`#demo`), :314 (S7→`#contatto`). Ancore target tutte presenti nell'HTML (id cantiere/offerta/processo/lso/demo/prezzi/contatto, 1 ciascuna) |

## 2. Criteri §G — Trasversali

| Criterio | Esito | Evidenza |
|---|---|---|
| **i18n completeness** (7 lingue, 0 MISSING_MESSAGE, no hardcoded) | **PASS** (con finding NB-1) | 112 chiavi `softwarehouse` in ognuno dei 7 file. `MISSING_MESSAGE` = 0 in tutti i 7 HTML built. Spot-check: h1 == `hero_title` localizzato e `lso_closing` localizzata presente in ognuna delle 7 lingue; zero leak di testo italiano nelle 6 non-it. Eccezione: sr-only `", opens in new tab"` hardcoded (NB-1, pattern preesistente sitewide) |
| **Chiavi morte** (`pain_* evidence_* how_* receive_* diff_* portfolio_*`, `cta_label`, `cta_paragraph`, `process_intro`) | **PASS** | Scan programmatico ×7 lingue: zero occorrenze |
| **Claim compliance (SSOT §4)** | **PASS** | Scan JSON namespace + testo visibile HTML ×7: Trustpilot, "Ultra Enterprise", Magicsoft, 50%, 40-50, 70-80, 1995, €10.000/€10k → tutti assenti. LOC non in apertura: `live_intro` apre con "Ore di lavoro e attività"; righe nette = riga 3 `size="sm"`. Zero cifre orarie in `pricing_*` e `demos_*` (regex h/ore/hours/Stunden/horas/heures/小时 ×7 lingue: none) |
| **No-JS** (markup statico completo) | **PASS** | In `out/it/softwarehouse.html` (testo visibile, script esclusi): h1 + 7 h2 di sezione (S2-S8), `live_fallback` senza numeri, link GitHub `https://github.com/florenceegi`, 3 trait LSO + chiusura verbatim, `lso_demo_caption`, 5 fasce prezzo, CTA finale. Numeri cantiere (2243 / 2.595.750 / 23 / 21 / 179 standalone): ASSENTI dal testo visibile — arrivano solo live (conferma incrociata col curl). Nota NB-2 sul payload messages |
| **GSAP** (no top-level nei file nuovi) | **PASS** | `grep "from 'gsap'"` su `components/softwarehouse/` = 0. Unico uso: `import('gsap')` dentro useEffect (`LiveSiteStats.tsx:172`) — conforme P0-FC-1 |
| **A11y** | **PASS** | Heading order documento: h1→h2→h3 senza salti (estrazione completa, nessun h4+, nessun salto h1→h3). `aria-live="polite"` = 1 sola occorrenza, sul solo messaggio di stato (`LiveSiteStats.tsx:206`), MAI sui counter. Counter: valore finale sr-only (`LiveSiteStats.tsx:118`) + numero animato `aria-hidden` (r115). Skip link `href="#main-content"` presente. Immagini: chat_ai.png con alt descrittivo; 2 sigillo-logo footer decorative con `alt="" aria-hidden="true"` + testo adiacente (pattern corretto, preesistente) |
| **Gate** | **PASS (riferito)** | 277/277 dichiarato; hook bloccante pre-commit |
| **Perf** (Lighthouse LCP/CLS) | **NON ESEGUITO** (runtime) | Non eseguibile in questo ambiente CLI. Mitigazioni by-design verificate: min-height riservata anti-CLS, count-up GSAP una tantum in viewport, 0 canvas SSR. Delegato a verifica browser / pipeline (engineer-construction) — non bloccante per questo QA statico |

## 3. Finding non-blocking

| # | Finding | Dettaglio | Raccomandazione |
|---|---|---|---|
| NB-1 | sr-only `", opens in new tab"` hardcoded in inglese | `app/[locale]/softwarehouse/page.tsx:203,342` — deviazione letterale P0-FC-4, ma è convenzione preesistente sitewide (creazioni, epp, egi, i-numeri, PortfolioCard, EvidenceBox) | Mission dedicata: chiave i18n `common.opens_new_tab` ×7 lingue, sostituzione sitewide |
| NB-2 | Payload next-intl completo serializzato in pagina | Il "179" trovato nell'HTML è `numeri.organ_creator_files` (namespace della pagina i-numeri, preesistente) dentro il bundle messages embedded — NON un numero cantiere hardcoded nel markup softwarehouse | Eventuale ottimizzazione: messages per-namespace (riduce peso pagina). Fuori scope M-015 |
| NB-3 | Verifiche runtime §G non eseguibili in CLI | S2 layout-shift visivo, Lighthouse CLS/LCP, emulazione devtools reduced-motion/offline | Checklist browser pre-deploy (CLAUDE.md checklist #7 "Testato in browser") |
| NB-4 | `@keyframes lso-breathe` definito fuori dalla media query | globals.css:260-263 fuori, ma l'`animation` è applicata SOLO dentro `no-preference` (r265-268): keyframes senza `animation` è inerte → funzionalmente conforme al criterio | Nessuna azione necessaria |

## 4. Verdetto

**PASS** — 17 criteri §G: 15 PASS verificati direttamente, 1 PASS riferito (gate 277/277),
1 non eseguito perché runtime (Perf Lighthouse, delegato, non bloccante). Zero FAIL bloccanti.

Endpoint stats live e conforme; i numeri vietati come hardcoded esistono SOLO nella
response live — prova che il vincolo CEO "live dal giorno 1, nessun placeholder" è rispettato.

*QA eseguito da dev-testing-qa (Oracode OS3) — solo verifica, nessuna modifica al codice.*
