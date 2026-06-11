# HANDOFF — M-015: Rewrite pagina /softwarehouse

> Per la sessione che eseguirà M-015. Stato: mission APERTA (draft, FASE 0).
> Scritto: 2026-06-11, fine maratona discovery+infra (M-013/014/266/267/LEVESPE-020).
> CEO ha già approvato tutto l'impianto in brainstorm — le decisioni sono SSOT, non riaprirle.

## 1. FONTE NORMATIVA (leggere PRIMA di tutto — P0-8)

| Doc | Ruolo |
|---|---|
| `FABIOCHERICI-DOC/docs/ssot/commercial-claims.md` | **SSOT commerciale (M-014)** — tesi, 3 linee offerta, claim citabili/vietati, linguaggio LSO, decisioni CEO §8. OGNI parola della pagina viene da qui (P0-FC-6) |
| `messages/it.json` namespace `softwarehouse` | Contenuti attuali: `process_*` (5 fasi — SI RIUSA, è il miglior testo) e `pricing_*` (fasce — INVARIATE) |
| `/home/fabio/oracode/docs/paradigm/lso/00_LSO_LIVING_SOFTWARE_ORGANISM.md` | Definizione canonica LSO (per la traduzione cliente già fatta nell'SSOT §5) |
| CLAUDE.md progetto | P0-FC-1..6 (GSAP dynamic, testo senza JS, 3D opzionale, i18n 7 lingue, perf, contenuti da SSOT) |

## 2. NARRATIVA APPROVATA (non rinegoziare)

- **Atto 1 — Risk-reversal**: "Vedi prima, decidi dopo". Processo 5 fasi protagonista.
- **Atto 2 — Oracode Nexus PROTAGONISTA** → genera un tipo di software nuovo:
  **LSO (Living Software Organism)** in inglese + traduzione ita sotto. LSO = ciò
  che il cliente RICEVE. NIENTE formule/equazioni (vietate). Beneficio PRIMA del
  nome proprietario, sempre.
- Chiusura sezione LSO approvata: "Risultato: non dipendi da nessuno. Nemmeno da me."
- ELIMINARE: recensioni Trustpilot/pain-testimonial, hero biografico, formula
  ENTERPRISE×ORACODE, portfolio 20 progetti in LOC.

## 3. BLUEPRINT VISIVO (approvato — ispirazione ritmo Trend Micro business)

| # | Sezione | Dispositivo |
|---|---|---|
| 1 | Hero: "Vedi il tuo software funzionare. Poi decidi." | claim + CTA, 3D ambient |
| 2 | **Cantiere aperto LIVE** | counter animati da endpoint (vedi §4), link GitHub |
| 3 | 3 card offerta | su misura / sito serio-esemplare unico (Sigillo) / "il tuo sito, già rifatto" |
| 4 | Processo 5 fasi | FlowDiagram animato (componente M-008 esiste) |
| 5 | **"La specie nuova"** Oracode Nexus→LSO | racconto §2 + 3 proprietà che "respirano" + **chat advisor embeddata** (vedi §5) |
| 6 | Demo toccabili | IdealOro live; Capasso SOLO quando su pinocapasso.com |
| 7 | Prezzi | PricingTiers esistente, fasce INVARIATE |
| 8 | CTA calda | "Prima chiamata: esci con un parere onesto" |

CTA intermedie dopo 3, 5, 7. Testo ~1/4 dell'attuale. Componenti M-008
riusabili: ComparisonTable, FormulaBlock(no), IconGrid, FlowDiagram,
PricingTiers, PortfolioCard/Grid.

## 4. DIPENDENZA PRONTA ✅ — Widget cantiere

Endpoint LIVE: `GET https://stat.florenceegi.com/api/public/site-stats`
(CORS già aperto per https://fabiocherici.com, cache 60s, rate-limit 10r/m).
Shape: `hours_total, hours_last_7_days, hours_note, projects_total,
projects_active_30d, last_activity, lines_net_total, generated_at`.
Regole SSOT: ore/attività protagoniste, righe SECONDARIE mai LOC-first,
mostrare `generated_at`/last_activity ("ultima attività: oggi").
P0-FC-2: la sezione degrada con dignità senza JS (non sparisce la pagina).
Vincolo CEO: dati live, NESSUN placeholder.

## 5. DIPENDENZA DA COSTRUIRE — Chat advisor (mission EGI parallela)

Pattern PRONTO in EGI: `SigilloAdvisorController` + `SigilloAdvisorService`
(`/home/fabio/EGI/app/...`) — guest+auth, throttle 20/min, AnthropicService +
RagSearchService su SSOT piattaforma, ZERO fatti hardcoded. Frontend pattern:
`/home/fabio/EGI/resources/js/free-ai-chat.js` (vanilla, SSE, limite guest 50/g)
+ estetica `/home/fabio/EGI/resources/views/components/ai-sidebar.blade.php`
da adattare a grafite+bronzo. Serve: route `fabiocherici/advisor/chat` + CORS
+ **proiezione PUBBLICA** dell'SSOT commerciale nel RAG (MAI §2/§4/§6 — vincolo
audit M-014). Aprire mission nel repo EGI (ID prefisso M-EGI-xxx).
Se la chat non è pronta al momento del build: la sezione 5 chiude con demo
mostrata + CTA "la provi in chiamata" e la chat si innesta dopo (progressive).

## 6. ORDINE ESECUZIONE RACCOMANDATO (dottrina: architetti PRIMA dei dev)

1. `engineer-frontend` (advisor): sistema scroll/animazione/ritmo sul blueprint
   §3 + design widget cantiere + integrazione estetica chat. Output: design doc.
2. `dev-frontend`: build su design + SSOT. Strings nuove in TUTTE le 7 lingue
   (it en de es fr pt zh — P0-FC-4).
3. `dev-testing-qa`/test: acceptance per sezioni, i18n completeness, no-JS.
4. Gates: web-quality-gate (273 check + agente) PRIMA del push; giudizio CEO
   dal vivo (CR-1/CR-8) resta gate umano.
5. Chiusura: FASE 6 CANONICA 8 step — report pair, files_modified, **bin/mission
   finalize**, DOC-SYNC, close, commit+push, **/calc-stat + push-stats**, LOG.
   (Il CEO ha già ripreso il Supervisor per averla alterata. Non ripetere.)

## 7. TRAPPOLE NOTE

- GSAP SOLO dynamic import in useEffect (P0-FC-1, cicatrice M-192)
- `.reveal` non deve nascondere testo di default (P0-FC-2)
- Build statico: `out/<locale>.html` (non out/<locale>/index.html)
- Hook web-quality-gate-guard blocca commit di pagine senza report fresco:
  `python3 /home/fabio/os3-matrix/bin/web_quality_gate.py --dir out/ --page
  softwarehouse --locales it,en,de,es,fr,pt,zh --messages messages/`
- Push su main = deploy automatico GitHub Actions (S3+CloudFront)
- prebuild rigenera og/*.png — ANOMALIA APERTA: epp.png identiche su 7 locale
  (md5 uguale, regressione localizzazione OG) — da verificare PRIMA del deploy
- 301: se si toccano URL, redirect (pattern M-008)
- MISSING_MESSAGE nav.preferences (fr): preesistente, NON di questa mission

## 8. CODA COLLEGATA (fuori M-015)

- M-EGI advisor endpoint (vedi §5)
- Anomalia OG epp.png ×7 (micro, pre-deploy)
- Cron locale `push-stats.sh` (refresh cantiere automatico)
- R1 EGI-STAT: fix errori generici già in repo, sale al prossimo deploy CEO
- Badge "demo — disponibile per la tua attività" + noindex su IDEALORO-PREVIEW
- Protocollo demo redesign (SSOT §6): Le Vespe già gateata; parlare con titolare
