---
title: M-015 — Design doc rewrite /softwarehouse
mission: M-015
doc_type: design
status: draft
date: '2026-06-11'
author: engineer-frontend (advisor) — Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
inputs:
  - FABIOCHERICI-DOC/docs/missions/HANDOFF_M-015_SOFTWAREHOUSE_REWRITE.md
  - FABIOCHERICI-DOC/docs/ssot/commercial-claims.md (v1.0.0)
  - app/[locale]/softwarehouse/page.tsx (stato attuale, M-008)
  - CLAUDE.md (P0-FC-1..6, cicatrici M-192)
---

# M-015 — Design doc: rewrite pagina /softwarehouse

> Documento di design per `dev-frontend`. Implementare ALLA LETTERA.
> Ogni testo in pagina viene da `commercial-claims.md` (P0-FC-6) o dal blueprint
> approvato in HANDOFF §2/§3. Le decisioni CEO (SSOT §8) NON si rinegoziano.
> Convenzioni: tutte le stringhe via `useTranslations('softwarehouse')` /
> `getTranslations('softwarehouse')`, 7 lingue dal primo commit (P0-FC-4).

---

## A. Architettura pagina — 8 sezioni

La pagina resta un **server component** (`app/[locale]/softwarehouse/page.tsx`)
come oggi: tutto il testo è nell'HTML statico esportato (SEO + P0-FC-2).
Le uniche client island sono: `Scene3DSwitch` (hero), `LiveSiteStats` (sez. 2),
`AdvisorSlot` (sez. 5, v1 statico — vedi §D).

Anchor ID di sezione (per CTA interne): `#cantiere`, `#offerta`, `#processo`,
`#lso`, `#demo`, `#prezzi`, `#contatto`.

Alternanza sfondi invariata rispetto al pattern M-008: `--bg` / `--bg-elevated`
a sezioni alterne (vedi §B per il ritmo).

`generateMetadata`, `buildPageSchema`, breadcrumb e Service schema con le 5
Offer (fasce invariate, `page.tsx:153-159`) si RIUSANO as-is. I valori di
`meta.softwarehouse_title/description` (it.json:613-614) potrebbero dover
riflettere il nuovo claim → UNCERTAINTY FLAG #4, decisione copy CEO.

### Sezione 1 — Hero: "Vedi il tuo software funzionare. Poi decidi."

| Voce | Specifica |
|---|---|
| Componente | Markup server nella page + `Scene3DSwitch` come background, stesso pattern di `components/home/HeroSection.tsx:18-19` (`section.relative.min-h-screen` + scene assoluta + contenuto `z-10`). Serve un wrapper client minimo (la home usa `HeroSection` client): creare `components/softwarehouse/SoftwarehouseHero.tsx` (`'use client'`) che contiene SOLO scena + markup hero, testo via `useTranslations`. **Unico Canvas della pagina** (P0-FC-5: max 1) — oggi la pagina ne ha ZERO (verificato: nessun `Scene3DSwitch`/`Canvas` in `app/`), quindi col hero 3D si arriva esattamente a 1. |
| Contenuto | Claim hero = blueprint HANDOFF §3 r1: "Vedi il tuo software funzionare. Poi decidi." (deriva da SSOT §1 atto 1: "Vedi prima, decidi dopo. Il cliente vede un MVP funzionante prima di firmare. Prezzi pubblici. Il rischio lo tiene il fornitore."). Sub: 1-2 frasi MAX dall'atto 1 (prezzi pubblici + rischio al fornitore). NIENTE biografia ("Magicsoft", "dal 1995", "ritorno consapevole" = vietato SSOT §4.5 — muoiono). |
| Chiavi i18n | NUOVE: `hero_label`, `hero_title`, `hero_sub`, `hero_cta_process` (ancora `#processo`), `hero_cta_contact` (ancora `#contatto`). NON riusare le vecchie `hero_*` con valori nuovi: chiavi nuove = traduzioni stantie impossibili (vedi §E). |
| Vincoli | Il testo hero è visibile di default; `.reveal` solo come enhancement (P0-FC-2, `globals.css:233-243`). 3D lazy `ssr:false` dentro `Scene3DSwitch` (P0-FC-3, già così). LCP element atteso = `h1` (testo): i blocchi di testo block-level sono candidati LCP (`sources/web-performance-core-vitals/web-dev-lcp-largest-contentful-paint.txt` §What elements are considered, r53: "Block-level elements containing text nodes or other inline-level text element children") — il 3D lazy non lo blocca. |

### Sezione 2 — Cantiere aperto LIVE (`#cantiere`)

| Voce | Specifica |
|---|---|
| Componente | NUOVO `components/softwarehouse/LiveSiteStats.tsx` (`'use client'`) — design completo in §C. Il wrapper di sezione (h2 + intro + link GitHub) resta markup server nella page: così titolo, narrativa e link GitHub sono nell'HTML statico anche senza JS (P0-FC-2). |
| Contenuto | Frame obbligatorio SSOT §3 r1: ore/attività PROTAGONISTE, righe nette SECONDARIE, "mai LOC-first". SSOT §3 r2: "Non credermi: guarda i commit" → link `https://github.com/florenceegi` (org già citata in `app/[locale]/layout.tsx:63`). SSOT §3 r3: il cantiere è "demo del deliverable: 'quando lavori con me ricevi questa trasparenza'". Mostrare `generated_at` e `last_activity` (HANDOFF §4: "ultima attività: oggi"). |
| Chiavi i18n | NUOVE: `live_label`, `live_title`, `live_intro`, `live_hours_label`, `live_hours_week_label`, `live_projects_label`, `live_projects_active_label`, `live_lines_label`, `live_updated_label`, `live_last_activity_label`, `live_loading`, `live_error`, `live_fallback`, `live_github_link` (~14). |

### Sezione 3 — 3 card offerta (`#offerta`)

| Voce | Specifica |
|---|---|
| Componente | RIUSO `components/infographics/IconGrid.tsx` con `columns={3}` (`IconGrid.tsx:21,28-29` supporta 3 colonne; `description` è `ReactNode` → può contenere link interni, es. card 2 → demo, card 3 → contatto). Nessun componente nuovo (Semplicità Potenziante: la card 3-colonne esiste già). Icone SVG inline come il pattern `RECEIVE_ICONS` attuale (3 icone nuove, stesso stile stroke 1.5). |
| Contenuto | SSOT §2, una card per riga della tabella: **Card 1** "Software su misura" — beneficio PRIMA ("vedi l'MVP prima di firmare, processo 5 fasi"), poi il nome del deliverable (LSO) — regola jargon SSOT §1: "termine proprietario SOLO DOPO il beneficio spiegato in parole del cliente". Fasce pubbliche → rimando a `#prezzi`. **Card 2** "Siti web seri / esemplare unico" — beneficio: unicità certificata; claim Sigillo ESATTO da SSOT §3 r7: "hash del front-end + impegno di vendita singola", frame "te lo dimostro, non te lo prometto"; MAI claim di unicità più ampio (SSOT §4.8 — il telaio condiviso è un pregio dichiarato: "pianale collaudato, carrozzeria unica"); link demo → `#demo`. **Card 3** "Il tuo sito, già rifatto" — demo privata + contatto diretto; **NESSUN prezzo né percentuale** (il 70-80% è parametro INTERNO, SSOT §2 r3 + coerenza §4.3). |
| Chiavi i18n | NUOVE: `offer_label`, `offer_title`, `offer_1_title`, `offer_1_desc`, `offer_2_title`, `offer_2_desc`, `offer_3_title`, `offer_3_desc` (~8). |
| CTA intermedia 1 | Dopo questa sezione (HANDOFF §3: CTA dopo 3, 5, 7). Vedi pattern `SectionCta` sotto. Chiavi: `cta_mid_offer`. Target: `#contatto`. |

**Pattern CTA intermedia** — NUOVO micro-componente server
`components/softwarehouse/SectionCta.tsx`: props `{ text: string; href: string }`,
un solo link-bottone centrato stile pill (riusare le classi del bottone CTA
attuale, `page.tsx:566`), wrappato in `.reveal`. 3 istanze: `cta_mid_offer`,
`cta_mid_lso`, `cta_mid_pricing`.

### Sezione 4 — Processo 5 fasi (`#processo`)

| Voce | Specifica |
|---|---|
| Componente | RIUSO `components/infographics/FlowDiagram.tsx` IDENTICO a oggi (`page.tsx:190-199` per il mapping fasi/step — copiare as-is). |
| Contenuto | RIUSO INVARIATO `process_*` (HANDOFF §1: "SI RIUSA, è il miglior testo"; SSOT §3 r4: "sancito, non si rinegozia"; SSOT §8: "da SSOT esistente, vincolante"). Unica revisione: `process_intro` attuale (it.json:469) chiude con "risposta concreta alle ultime due righe della tabella sopra" — la pain table NON esiste più → serve NUOVA chiave `process_intro_v2` senza il riferimento alla tabella (contenuto: prima frase invariata "Il cliente non firma sulla parola: vede prima, decide dopo."). |
| Chiavi i18n | RIUSO: `process_label`, `process_phase_1..5_label`, `process_step_1..11`, `process_closing` (19 chiavi). NUOVA: `process_intro_v2` (1). |

### Sezione 5 — "La specie nuova": Oracode Nexus → LSO (`#lso`)

| Voce | Specifica |
|---|---|
| Componente | Markup server nella page + NUOVO `components/softwarehouse/LsoTraits.tsx` (server component, zero JS: il "respiro" è CSS-only — vedi §B) + `AdvisorSlot` (vedi §D). |
| Contenuto | Racconto = SSOT §1 atto 2: Oracode Nexus protagonista ("il sistema operativo proprietario di costruzione. NON si vende il sistema: si vende ciò che GENERA"), LSO = ciò che il cliente RICEVE. Regola jargon: il paragrafo apre col beneficio, il nome arriva dopo. Nome in pagina: **"Living Software Organism"** (inglese) + sotto, in corpo minore: **"Organismo Software Vivente"** (SSOT §1 + vincolo mission). NIENTE formule/equazioni — FormulaBlock VIETATO (SSOT §1: la formula "QUALITÀ ENTERPRISE × ORACODE = LSO" è ELIMINATA; SSOT §4.6). Prova: "Primo LSO in produzione: FlorenceEGI, 8 organi online" frame "prova di nascita della specie, non portfolio" (SSOT §3 r8). Le 3 proprietà = SSOT §5 VERBATIM (traduzioni cliente approvate): 1. "Si documenta da solo — ogni modifica riscrive il suo fascicolo; il manuale non è mai vecchio." [metafora "fascicolo del fabbricato che si aggiorna da solo" ammessa in copy v1, soggetta a veto CEO in review — SSOT §5.1]; 2. "Puoi parlargli — mente interrogabile: domande in italiano, risposte fondate sui suoi documenti reali, non a memoria."; 3. "Sente quando qualcosa non torna — percepisce il disallineamento tra ciò che dice e ciò che fa, e lo segnala." Chiusura VERBATIM in it: **"Risultato: non dipendi da nessuno. Nemmeno da me."** (SSOT §5; nelle altre 6 lingue tradurre mantenendo il senso). Chiude con demo chat mostrata + CTA "la provi in chiamata" (HANDOFF §5 — vedi §D). |
| Chiavi i18n | NUOVE: `lso_label`, `lso_title`, `lso_p1`, `lso_p2`, `lso_name` (NON tradurre: "Living Software Organism" identico in 7 file — è il nome proprio), `lso_name_translation`, `lso_proof`, `lso_trait_1_title`, `lso_trait_1_desc`, `lso_trait_2_title`, `lso_trait_2_desc`, `lso_trait_3_title`, `lso_trait_3_desc`, `lso_closing`, `lso_demo_caption`, `lso_demo_alt`, `lso_chat_cta` (~17). |
| CTA intermedia 2 | Dopo questa sezione: `cta_mid_lso` → `#contatto` (o `#demo`: scelta dev, coerente col flusso). |

### Sezione 6 — Demo toccabili (`#demo`)

| Voce | Specifica |
|---|---|
| Componente | RIUSO `components/infographics/PortfolioCard.tsx` SENZA `loc` né `hours` (props opzionali, `PortfolioCard.tsx:18-20` — il blocco `dl` LOC/ore non viene reso se assenti, `PortfolioCard.tsx:49`). Una sola card in v1: IdealOro. NO `PortfolioGrid` (1 elemento). |
| Contenuto | IdealOro live (`https://art...`? NO — usare l'URL live già censito: `https://preview.florenceegi.com`, `page.tsx:63`) con descrizione SENZA LOC (la attuale `portfolio_market_7_desc` "Sito oreficeria. 1.426 LOC." muore). Capacità citabile SSOT §3 r5: "Rebrand sito verticale in <48h (fatto: GialloOro→IdealOro <2h)" — frame: "come capacità, MAI ore accanto a prezzi". ATTENZIONE: questa sezione precede immediatamente i prezzi → raccomando di NON mettere il dato orario qui e limitarsi a "rebrand completo in meno di 48 ore" come capacità nella descrizione, oppure ometterlo — UNCERTAINTY FLAG #5, conferma CEO. **Capasso NON in pagina** (SSOT §3 r10: pubblicabile SOLO al deploy su pinocapasso.com). Predisposizione: la sezione è una lista — aggiungere Capasso = aggiungere una card, zero refactor. |
| Chiavi i18n | NUOVE: `demos_label`, `demos_title`, `demos_intro`, `demos_idealoro_name`, `demos_idealoro_desc`, `demos_live_label` (~6). |

### Sezione 7 — Prezzi (`#prezzi`)

| Voce | Specifica |
|---|---|
| Componente | RIUSO `components/infographics/PricingTiers.tsx` IDENTICO (`page.tsx:182-188, 536-544` — copiare as-is). |
| Contenuto | Fasce INVARIATE (SSOT §8 "Prezzi: invariati, solo fasce attuali"; SSOT §2 r1). Nessuna ora di lavoro in questa sezione (SSOT §4.2). |
| Chiavi i18n | RIUSO INVARIATO: `pricing_label`, `pricing_intro`, `pricing_aria`, `pricing_label_timeline/maintenance/deposit`, `pricing_tier_1..5_{name,price,timeline,maintenance,deposit}`, `pricing_uncertain_link` (28 chiavi). |
| CTA intermedia 3 | Dopo la sezione: `cta_mid_pricing` → `#contatto`. (`pricing_uncertain_link` resta in aggiunta, com'è oggi, `page.tsx:545-549`.) |

### Sezione 8 — CTA calda (`#contatto`)

| Voce | Specifica |
|---|---|
| Componente | RIUSO struttura CTA attuale (`page.tsx:553-582`): label + paragrafo + 2 bottoni email/WhatsApp. |
| Contenuto | Claim = blueprint HANDOFF §3 r8: "Prima chiamata: esci con un parere onesto". Tono coerente con l'attuale `cta_paragraph` (nessuna pressione) ma riscritto attorno al claim approvato. |
| Chiavi i18n | NUOVE: `cta_final_label`, `cta_final_title`, `cta_final_paragraph` (3). RIUSO: `cta_email`, `cta_whatsapp`, `cta_email_aria`, `cta_whatsapp_aria` (4). |

### Bilancio testo (target ~1/4)

Attuale: ~200 chiavi, molte multi-paragrafo (hero 3 paragrafi, pain ~30 chiavi,
evidence ~28, portfolio ~50). Nuovo: **~55 chiavi nuove** (brevi: card, label,
trait) + **~52 riusate** (process/pricing/cta) ≈ 107 chiavi, con prosa solo in
hero/lso/cta. Il corpo testo cala a circa un quarto. Conteggio esatto chiavi a
carico del dev al build ([COUNT_BY_EYE] sulla stima).

---

## B. Sistema scroll / animazione / ritmo

### Ritmo "Trend Micro business" (alternanza densità + respiri)

Il ritmo si ottiene con TRE leve già esistenti, nessun componente nuovo:

1. **Alternanza sfondi** — `--bg` / `--bg-elevated` a sezioni alterne (pattern
   M-008 già in pagina). Sequenza: 1 bg (hero, full-viewport) → 2 elevated
   (cantiere, denso) → 3 bg (card) → 4 elevated (processo, denso) → 5 bg (LSO,
   respiro largo) → 6 elevated (demo) → 7 bg (prezzi, denso) → 8 elevated (CTA).
2. **Alternanza larghezze** = densità: sezioni narrative strette
   (`max-w-3xl`: hero testo, LSO, CTA) vs sezioni dense larghe (`max-w-5xl`/
   `max-w-7xl`: cantiere, card, processo, prezzi). È lo stesso vocabolario
   della pagina attuale (`page.tsx:212,240,396,513,529`).
3. **Respiri verticali**: `py-24` standard, `py-32` per le due sezioni
   "respiro" (5 LSO e 8 CTA). Le CTA intermedie (`SectionCta`) sono il
   separatore di battuta dopo 3, 5, 7.

### ScrollReveal — riuso, zero modifiche

`components/ui/ScrollReveal.tsx` NON SI TOCCA (cicatrice M-192: "riscritto 6
volte senza P0-8"). Il dev usa SOLO la classe `.reveal` sugli elementi da
animare, come oggi. Garanzie già nel sistema:

- GSAP è caricato via `import('gsap').then(...)` dentro `useEffect`
  (`ScrollReveal.tsx:24-27`) — P0-FC-1 rispettato by-design.
- Senza JS il testo è visibile: il CSS nasconde SOLO sotto `.reveal-ready`,
  aggiunta da JS (`globals.css:233-243`) — P0-FC-2 rispettato by-design.
- `prefers-reduced-motion`: gli elementi sono mostrati senza animazione
  (`globals.css:245-254` + `useReducedMotion` in `ScrollReveal.tsx:20,48`).

Disciplina d'uso per il dev: `.reveal` su heading, paragrafi e blocchi
componente (come oggi), NON su contenitori che includono il widget live (il
widget gestisce i propri stati — un fade del contenitore va bene, ma il reveal
non deve mai ritardare la riserva di spazio, vedi CLS in §C).

### Le 3 proprietà LSO che "respirano" — CSS-only, niente GSAP

Decisione: il loop subtle è **CSS `@keyframes`**, non GSAP. Razionale
(ordine = opzione raccomandata prima):

1. **CSS keyframes su `opacity`/`box-shadow(--accent-glow)`/`transform: scale`
   micro (1 → 1.012)** — zero JS sul main thread (protegge INP), funziona
   anche senza JS, si disattiva con una media query. Le proprietà animate
   sono compositor-friendly: "Instead of changing the height and width
   properties, use transform: scale(). To move elements around ... use
   transform: translate() instead" (`sources/web-performance-core-vitals/
   web-dev-cls-cumulative-layout-shift.txt` §CSS transform property,
   r94-97) → il respiro NON genera layout shift.
2. (Scartata) GSAP loop `repeat: -1` — aggiunge lavoro JS continuo e
   richiederebbe gating manuale su reduced-motion e visibilità tab.
   Sacrificio dell'opzione 1: easing meno "organico" di GSAP — accettabile
   per un'animazione subtile (acknowledge-the-sacrifice).

Specifica per `LsoTraits.tsx` + `globals.css`:

```
/* globals.css — sezione LSO traits */
@keyframes lso-breathe {
  0%, 100% { box-shadow: 0 0 0 0 var(--accent-glow); opacity: 1; }
  50%      { box-shadow: 0 0 24px 4px var(--accent-glow); opacity: 0.96; }
}
.lso-trait { /* card statica di default = fallback statico */ }
@media (prefers-reduced-motion: no-preference) {
  .lso-trait { animation: lso-breathe 6s ease-in-out infinite; }
  .lso-trait:nth-child(2) { animation-delay: 2s; }
  .lso-trait:nth-child(3) { animation-delay: 4s; }
}
```

- **Fallback statico**: di default le card sono statiche; l'animazione esiste
  SOLO dentro `@media (prefers-reduced-motion: no-preference)` → con
  reduced-motion attivo o in qualsiasi condizione degradata le card sono
  ferme e perfettamente leggibili. Norma di riferimento: WCAG 2.2 SC 2.3.3
  Animation from Interactions (AAA): "Motion animation triggered by
  interaction can be disabled" (`sources/web-accessibility-wcag/
  w3c-wcag22.txt` r540-544) — qui l'animazione non è da interazione ed è
  decorativa, ma il rispetto di `prefers-reduced-motion` è la pratica
  corretta e già convenzione del sito (`globals.css:245`).
- Delay sfalsati (0/2/4s) = le tre proprietà respirano in sequenza, non in
  sincrono: effetto "organismo".
- Markup: `<ul>` di 3 `<li class="lso-trait reveal">`, h3 + paragrafo,
  bordi/sfondi con i token esistenti (`--border`, `--bg-card`).

---

## C. Widget cantiere LIVE — `LiveSiteStats`

### Contratto dati

`GET https://stat.florenceegi.com/api/public/site-stats` — CORS aperto per
https://fabiocherici.com, cache server 60s, rate-limit 10 req/min (HANDOFF §4).
Shape (HANDOFF §4): `hours_total, hours_last_7_days, hours_note,
projects_total, projects_active_30d, last_activity, lines_net_total,
generated_at`.

Comportamento di rete: **UNA fetch per mount, nessun polling, nessun refetch
on focus** (rate-limit 10r/m + cache 60s rendono il polling inutile e rischioso).

### Architettura componente

```
components/softwarehouse/LiveSiteStats.tsx  ('use client')

Props: { labels: {...tutte le stringhe i18n necessarie}, locale: string }
       — le stringhe arrivano via props dal server component (pattern già
         usato dagli infographics) oppure via useTranslations: scelta dev,
         ma NESSUNA stringa hardcoded (P0-FC-4).

Stato (UNA sola fonte di verità, niente flag booleani paralleli):
  type StatsState =
    | { status: 'loading' }
    | { status: 'error' }
    | { status: 'success'; data: SiteStats }
```

Fetch dentro `useEffect` **con cleanup ignore-stale** — pattern React
documentato: "🔴 Avoid: Fetching without cleanup logic … To fix the race
condition, you need to add a cleanup function to ignore stale responses"
(`sources/frontend-architecture-rendering/react-you-might-not-need-an-effect.txt`
r476-510). Implementazione: flag `let ignore = false` nel body dell'effect,
`return () => { ignore = true }`; su risposta non-ok o eccezione →
`{ status: 'error' }`. Timeout fetch consigliato: `AbortSignal.timeout(8000)`.

Validazione difensiva della shape: se i campi numerici attesi mancano o non
sono numeri → trattare come `error` (mai rendere `undefined`/`NaN`). La
sanitizzazione/trust del payload esterno è confine `engineer-security` — qui
basta: i valori si rendono SOLO come testo via React (mai `innerHTML`).

### Layout e gerarchia (regole SSOT §3 r1)

Riga 1 (protagonista, font display grande): **ore totali tracciate** +
**ore ultimi 7 giorni** (+ `hours_note` in corpo piccolo accanto alle ore).
Riga 2: **progetti totali** + **attivi ultimi 30 giorni** + **ultima
attività** (`last_activity`, formattata per locale).
Riga 3 (SECONDARIA, font piccolo, MAI prima): **righe nette**
(`lines_net_total`) — etichetta esplicita "righe nette di codice", mai
posizione di apertura (vietato LOC-first, SSOT §4.1).
Footer del widget: "aggiornato: {generated_at}" formattato per locale —
trasparenza del dato = euristica NN/g #1: "The design should always keep
users informed about what is going on, through appropriate feedback within
a reasonable amount of time" (`sources/ux-interaction-design/
nng-ten-usability-heuristics.txt` r30-32).

Formattazione numeri: `Intl.NumberFormat(locale)`; date:
`Intl.DateTimeFormat(locale)`. Niente formattazioni hardcoded per lingua.

### Stati (loading / error / success) e degrado senza JS

Il principio: **l'HTML server-renderizzato del componente è il fallback
statico sensato**, identico per no-JS e per stato iniziale.

- **SSR/no-JS (stato iniziale)**: il componente rende il paragrafo
  `live_fallback` ("il cantiere è aperto; i numeri live sono pubblici" —
  copy dal frame SSOT §3 r3) — NESSUN numero, NESSUN placeholder numerico
  finto (vincolo CEO, HANDOFF §4 + SSOT §7). Il link GitHub è FUORI dal
  componente (markup server della sezione), quindi resta sempre. Senza JS la
  sezione è: titolo + intro + fallback + link GitHub = degrado dignitoso
  (P0-FC-2).
- **loading (post-mount, pre-risposta)**: stesso fallback + indicatore
  testuale `live_loading` ("recupero i dati live…"). Niente spinner-only,
  niente skeleton con cifre.
- **error**: fallback + messaggio `live_error` con tono NN/g: linguaggio
  umano, niente codici, niente colpa all'utente, consiglio costruttivo
  (es. it: "I dati live non sono raggiungibili in questo momento. I commit
  restano verificabili su GitHub.") — "Use human-readable language …
  Offer constructive advice … don't blame the user"
  (`sources/ux-interaction-design/nng-error-message-guidelines.txt`
  r37-41). Il messaggio di errore vive in un elemento con
  `aria-live="polite"` (vedi sotto). Niente retry automatico; eventuale
  bottone "riprova" è ammesso (1 retry manuale, rispetta il rate-limit).
- **success**: la griglia stats sostituisce il fallback.

**Anti-CLS — spazio riservato**: il contenitore del widget ha una
`min-height` fissa (misurata dal dev sul layout finale, breakpoint mobile e
desktop) tale che fallback, loading, error e griglia success stiano TUTTI
dentro la stessa altezza riservata → lo swap non sposta il layout
sottostante. Fonte: "it's best to create some space right away and show a
loading indicator to avoid an unpleasant layout shift when the request
completes" (`sources/web-performance-core-vitals/
web-dev-cls-cumulative-layout-shift.txt` §Expected versus unexpected layout
shifts, r88).

### Counter animati (GSAP count-up)

- GSAP SOLO via `import('gsap').then(...)` dentro `useEffect`, mai top-level
  (P0-FC-1, cicatrice M-192). Trigger: quando `status === 'success'` E il
  widget entra in viewport (IntersectionObserver locale, threshold 0.3) —
  count-up da 0 al valore reale, durata ~1.2s, `ease: 'power1.out'`,
  `snap: 1` sul valore intero. UNA volta sola (no replay).
- **Reduced motion**: con `useReducedMotion()` (hook esistente,
  `lib/hooks/useReducedMotion`) → NESSUN count-up, valore finale immediato.
- Il count-up anima SEMPRE verso il valore reale dell'endpoint — mai numeri
  inventati come punto di partenza visibile "plausibile" (il from è 0).

### Accessibilità del counter — aria-live: NO sui numeri, SÌ sull'errore

Decisione richiesta esplicitamente: **niente `aria-live` sui counter**.
Motivazione: i valori arrivano al primo load della sezione (contenuto di
pagina, non esito di un'azione utente) e il count-up muta il textContent
decine di volte al secondo → una live region annuncerebbe rumore continuo
allo screen reader. Il riferimento normativo per le live region è SC 4.1.3
Status Messages (AA): "status messages can be programmatically determined
through role or properties such that they can be presented to the user by
assistive technologies without receiving focus"
(`sources/web-accessibility-wcag/w3c-wcag22.txt` r924-928) — si applica ai
MESSAGGI DI STATO (qui: il messaggio di errore/caricamento, che infatti va
in `aria-live="polite"`), non al contenuto principale che si popola al load.

Implementazione per ogni stat:

```
<div role="group" aria-label="{label}: {valore finale formattato}">
  <span aria-hidden="true">{numero animato da GSAP}</span>
  <span class="sr-only">{valore finale formattato}</span>
  <span>{label}</span>
</div>
```

— lo screen reader legge subito il valore finale stabile; il numero che
"gira" è solo visivo. Il blocco loading/error è UN solo elemento con
`aria-live="polite"` montato dall'inizio (le live region devono esistere nel
DOM prima del cambiamento; MDN: "Live regions provide suggestions to screen
readers about how to handle changes to the contents of a page" —
`sources/web-accessibility-wcag/mdn-aria.txt` r61-62; il dettaglio
polite/assertive oltre questa frase non è nel corpus → [PARTIAL_READ],
vedi flags).

---

## D. Sezione chat advisor — progressive (v1 SENZA chat)

### v1 (questa mission)

La sezione 5 chiude con **demo mostrata + CTA "la provi in chiamata"**
(HANDOFF §5: "Se la chat non è pronta al momento del build: la sezione 5
chiude con demo mostrata + CTA 'la provi in chiamata' e la chat si innesta
dopo (progressive)").

- **Demo mostrata**: proposta = riuso dell'asset esistente
  `/img/softwarehouse/chat_ai.png` (oggi in `page.tsx:425-436`) con NUOVE
  chiavi `lso_demo_alt` / `lso_demo_caption` — caption riscritta sul claim
  SSOT §3 r9: "Mente interrogabile reale (chat AI advisor su RAG SSOT
  piattaforma)" / "falle una domanda" (qui declinato: "presto potrai farle
  una domanda qui; intanto la provi in chiamata"). `next/image` con
  width/height espliciti (anti-CLS). → UNCERTAINTY FLAG #2: "demo mostrata"
  interpretata come screenshot reale; alternativa è un mock statico nuovo —
  conferma CEO.
- **CTA**: `lso_chat_cta` → `#contatto`.

### Predisposizione all'innesto (slot + feature flag)

NUOVO `components/softwarehouse/AdvisorSlot.tsx` (server component):

```
const endpoint = process.env.NEXT_PUBLIC_ADVISOR_CHAT_ENDPOINT;
return endpoint
  ? <AdvisorChat endpoint={endpoint} locale={locale} />
  : <AdvisorDemoStatic ... />;   // v1: screenshot + caption + CTA
```

Static export ⇒ la env è valutata a BUILD time: l'innesto della chat è
"setti la env e rebuildi", zero refactor della pagina. In v1 la env NON è
definita e `AdvisorChat` NON ESISTE ancora (non scrivere componenti vuoti).

### Interfaccia futura `AdvisorChat` (SPECIFICA, non implementare in M-015)

| Aspetto | Specifica |
|---|---|
| File | `components/softwarehouse/AdvisorChat.tsx` (`'use client'`) |
| Props | `{ endpoint: string; locale: string }` — tutto il resto via i18n |
| Endpoint | route EGI `fabiocherici/advisor/chat` (HANDOFF §5). Host completo NON ancora definito → UNCERTAINTY FLAG #1. `POST` JSON `{ message, conversation_id?, locale }`, risposta SSE (`Accept: text/event-stream`), throttle server 20/min guest, CORS per fabiocherici.com (mission EGI parallela, prefisso M-EGI-xxx) |
| Pattern UX di riferimento | `/home/fabio/EGI/resources/js/free-ai-chat.js`: textarea autosize (max ~120px), Enter invia / Shift+Enter a capo, send disabilitato a input vuoto o in streaming, typing indicator, streaming SSE riga-per-riga `event:`/`data:` con accumulo `content`, gestione 429 dedicata (messaggio rate-limit, non errore generico), contatore messaggi rimanenti guest, errore di rete → messaggio in chat (free-ai-chat.js r72-117, 119-150). Il porting è React nativo: stato `messages[]` + `status: 'idle'|'streaming'|'error'|'rate_limited'`, NESSUN vanilla IIFE |
| Estetica | grafite + bronzo con i token esistenti: contenitore `--bg-card`/`--border`, bolla utente `--accent-muted` con testo `--text-primary`, bolla AI `--bg-elevated`, accenti `--accent`. NIENTE stili inline dal pattern Blade (ai-sidebar usa z-index/transizioni proprie — solo riferimento di struttura) |
| A11y futura | log messaggi in regione `aria-live="polite"` (le risposte SONO status change da azione utente — SC 4.1.3, `w3c-wcag22.txt` r924-928); label sull'input; focus resta nell'input dopo invio; errori con guidelines NN/g (come §C) |
| RAG | nel RAG pubblico entra SOLO la proiezione pubblica dell'SSOT commerciale (claim §3 + frame + linguaggio §5) — MAI §2/§4/§6 (vincolo audit M-014, SSOT §7). Confine: contenuto del RAG = mission EGI, non frontend |
| i18n | le chiavi chat (`advisor_*`) si definiscono ALL'INNESTO, non ora: niente chiavi orfane in 7 lingue per un componente che non esiste |

---

## E. Eliminazioni

Verifica fatta: le chiavi `pain_*`, `evidence_*`, `how_*`, `receive_*`,
`diff_*`, `portfolio_*` sono usate SOLO in `app/[locale]/softwarehouse/
page.tsx` (grep su `**/*.tsx`, 1 solo file match). Nessun rischio su altre
pagine.

**Raccomandazione: PULIZIA TOTALE** — rimuovere le chiavi morte da TUTTI e 7
i file `messages/*.json`. Chiavi orfane = debito i18n che inquina i diff e i
controlli di completezza del gate.

### Chiavi che MUOIONO (namespace `softwarehouse`, riferimenti it.json)

| Blocco | Chiavi | Motivo |
|---|---|---|
| Hero biografico | `hero_title` ("Magicsoft"), `hero_subtitle_1` ("dal 1995"), `hero_subtitle_2` ("ritorno consapevole"), `hero_p1..p3` (it.json:324-329). Anche `hero_label` muore: il blocco hero usa chiavi tutte nuove | Vietato SSOT §4.5; HANDOFF §2 ELIMINARE |
| Pain | `pain_label`, `pain_p1`, `pain_p2`, `pain_data_intro`, `pain_data_{teamsystem,dylog,sistemi,fattureincloud}_{label,summary}`, `pain_table_head_*` (2), `pain_row_1..6_{promise,reality}` (12), `pain_closing` (it.json:330-384) | Vietato SSOT §4.4 (pain-testimonial/Trustpilot); HANDOFF §2 |
| Evidence | tutte le `evidence_*` (28 chiavi, it.json:342-369) | Vietato SSOT §4.4 |
| Formula | `how_label`, `how_p1`, `how_p2`, `how_formula_term_1..3`, `how_op_1..2`, `how_term_1..3_explanation` (11, it.json:385-395) | Formula ELIMINATA, SSOT §1 + §4.6 |
| Receive | `receive_label`, `receive_intro`, `receive_lever_1..7_{title,desc}` (14), `receive_link_numbers` (it.json:396-412) | Sezione non nel blueprint; `receive_lever_5` contiene "40-50% più veloce" = vietato SSOT §4.3 |
| Differenziatore | `diff_label`, `diff_p1..p3`, `diff_screenshot_alt`, `diff_screenshot_caption` (it.json:413-418) | Sezione assorbita dalla 5 (LSO trait 2 "puoi parlargli"); screenshot riusato con chiavi nuove `lso_demo_*` |
| Portfolio | `portfolio_*` TUTTE (~50 chiavi, it.json:419-467) | Vietato portfolio LOC-first (HANDOFF §2); sostituito da sezione demo (chiavi `demos_*`) |
| CTA vecchia | `cta_label`, `cta_paragraph` (it.json:519-520) | Sostituite da `cta_final_*` sul claim approvato |
| Process intro | `process_intro` (it.json:469) | Riferisce la pain table eliminata → sostituita da `process_intro_v2` |

Totale eliminato: ~145 chiavi × 7 file.

### Chiavi che SOPRAVVIVONO invariate

`process_label`, `process_phase_1..5_label`, `process_step_1..11`,
`process_closing` (19) · `pricing_*` complete (28, incl.
`pricing_uncertain_link`) · `cta_email`, `cta_whatsapp`, `cta_email_aria`,
`cta_whatsapp_aria` (4).

### Effetti collaterali da gestire

- **Componenti orfani**: dopo il rewrite `EvidenceBox.tsx`, `FormulaBlock.tsx`,
  `ComparisonTable.tsx`, `PortfolioGrid.tsx` non hanno più usi in questa
  pagina. NON cancellarli in M-015 (possono servire ad altre pagine/missioni;
  FormulaBlock è vietato solo IN QUESTA pagina) — registrare come [DEBITO]
  "componenti infographics senza usi attivi" se il grep d'uso globale del dev
  conferma zero usi altrove.
- **`/img/softwarehouse/chat_ai.png`**: riusato in sezione 5 (vedi §D, flag #2).
- **`meta.softwarehouse_title/description`** (it.json:613-614): chiavi
  invariate, VALORI da rivedere sul nuovo claim → flag #4 (decisione copy CEO).
  L'OG image `og/<locale>/softwarehouse.png` si rigenera col prebuild
  (attenzione all'anomalia aperta OG epp.png ×7 — HANDOFF §7, fuori M-015 ma
  da verificare prima del deploy).
- **Schema.org**: il blocco Service con le 5 Offer resta invariato (fasce
  invariate). Rimuovere nulla.
- **301**: gli URL non cambiano (stessa route `/softwarehouse`) → nessun
  redirect necessario (HANDOFF §7 pattern M-008 non attivato).

---

## F. Accessibilità + performance

### Heading hierarchy

- UN solo `h1`: claim hero (sezione 1).
- `h2` per ciascuna delle sezioni 2-8 (label di sezione — oggi le label sono
  già `h2`, `page.tsx:241,365,...`); ogni `h2` descrive il topic della
  sezione — SC 2.4.6 Headings and Labels (AA): "Headings and labels describe
  topic or purpose" (`sources/web-accessibility-wcag/w3c-wcag22.txt`
  r575-579).
- `h3` dentro i componenti (FlowDiagram fase: `FlowDiagram.tsx:42`;
  PricingTiers nome fascia: `PricingTiers.tsx:54`; IconGrid titolo card:
  `IconGrid.tsx:57`; PortfolioCard nome: `PortfolioCard.tsx:43`; LsoTraits
  titolo trait). Nessun salto di livello.

### ARIA / focus / tastiera

- Counter live: pattern `aria-hidden` + `sr-only` + gruppo etichettato, error
  in `aria-live="polite"` — dettagli e motivazione in §C.
- Tutti i componenti riusati sono già semantici (FlowDiagram `<ol>` annidato,
  PricingTiers/IconGrid `<ul>` con `aria-label`, PortfolioCard `<article>`).
- Link esterni (GitHub, IdealOro live, WhatsApp): mantenere il pattern
  `<span class="sr-only">, opens in new tab</span>` già in uso
  (`page.tsx:272,578`).
- Focus: nessuna modale in pagina (la chat v2 avrà la propria disciplina,
  §D). `:focus-visible` globale già definito (`globals.css:257-260`).
- `main#main-content` esiste (`app/[locale]/layout.tsx:80`); la presenza del
  link skip-to-main nella Navigation NON è stata verificata in questa
  analisi → flag #7 (verifica dev/gate, [NOT_FOUND≠NOT_EXIST]).

### Contrasto (grafite #111 + bronzo #C8A96E)

- Norma: SC 1.4.3 Contrast (Minimum), AA: "contrast ratio of at least 4.5:1
  … Large-scale text … at least 3:1" (`sources/web-accessibility-wcag/
  w3c-wcag22.txt` r261-267).
- `--accent` #C8A96E su `--bg` #111111: ratio calcolato con la formula WCAG
  ≈ **8.4:1** → passa AA anche per testo normale. Calcolo mio, da
  CONFERMARE con tool nel web-quality-gate ([MY_INFERENCE] sul valore
  esatto, la formula è deterministica).
- I token `--text-secondary` / `--text-muted` su `--bg`/`--bg-elevated` NON
  sono stati verificati in questa analisi (valori non letti): il gate li
  copre, ma il dev non deve introdurre NUOVE combinazioni token non già in
  produzione (il rewrite usa solo combinazioni esistenti → rischio nullo se
  la regola è rispettata).
- Vale anche per i 7 temi ambient (gli `--accent` cambiano per tema,
  `globals.css:57-177`): stessa regola — solo combinazioni già in uso.

### Motion

- `prefers-reduced-motion`: copertura completa — ScrollReveal (hook +
  `globals.css:245-254`), count-up (valore immediato, §C), respiro LSO
  (animazione solo sotto `no-preference`, §B). Riferimento SC 2.3.3 (AAA)
  citato in §B.

### Performance (budget P0-FC-5: LCP < 2s, no layout shift, max 1 Canvas)

Soglie di riferimento web.dev per contesto: "LCP should occur within 2.5
seconds … INP of 200 milliseconds or less … CLS of 0.1 or less", valutate
al 75° percentile (`sources/web-performance-core-vitals/
web-dev-web-vitals.txt` r42-46). **Il budget di progetto è PIÙ severo: LCP
< 2s** (P0-FC-5) — vale quello.

- **LCP**: pagina statica (output: export) → HTML completo dal CDN; LCP
  element = `h1` testo (eligibile per LCP: `web-dev-lcp…txt` r53, vedi §A
  sez. 1); nessuna immagine hero; 3D lazy `ssr:false` fuori dal percorso
  critico; font già con `var(--font-*)` di progetto. Niente nuove richieste
  bloccanti introdotte dal design.
- **CLS ≈ 0**: widget stats con `min-height` riservata (§C, fonte
  `web-dev-cls…txt` r88); screenshot chat con width/height via `next/image`;
  respiro LSO solo `transform`/`opacity`/`box-shadow` (fonte r94-97);
  `.reveal` anima solo opacity/transform via GSAP (preset esistenti,
  `lib/animation.ts:21-76`), mai proprietà di layout.
- **INP**: zero handler pesanti; GSAP caricato lazy; count-up una tantum;
  respiro in CSS (no main thread). La fetch stats è async e non blocca input.
- **Max 1 Canvas**: solo hero (oggi 0 → domani 1, verificato §A).
- **Peso JS**: il rewrite RIMUOVE EvidenceBox/ComparisonTable/FormulaBlock/
  PortfolioGrid dal bundle pagina e aggiunge LiveSiteStats (+
  Scene3DSwitch lazy). Bilancio atteso: neutro o migliorativo.

---

## G. Acceptance criteria (per dev-testing-qa)

### Per sezione

- [ ] S1: h1 = claim "Vedi il tuo software funzionare. Poi decidi." (it);
      nessun riferimento biografico (Magicsoft / 1995 / ritorno consapevole);
      1 solo Canvas in pagina; pagina renderizzata senza JS mostra tutto il
      testo hero.
- [ ] S2: con JS e rete OK → numeri reali dall'endpoint (confrontare con
      response curl), ore in posizione protagonista, righe nette in coda e
      in corpo minore, `generated_at`/`last_activity` visibili; senza JS →
      testo fallback + link GitHub, NESSUN numero; endpoint bloccato (devtools
      offline) → messaggio errore umano + GitHub link, nessun numero finto;
      nessun layout shift al passaggio loading→success (verifica visiva +
      Lighthouse CLS).
- [ ] S3: 3 card; card 1 nomina il beneficio PRIMA di "LSO"; card 2 claim
      Sigillo esatto (hash front-end + vendita singola), nessun claim di
      unicità più ampio; card 3 SENZA prezzi/percentuali/sconti.
- [ ] S4: FlowDiagram con i process_* invariati (diff con M-008 = solo intro).
- [ ] S5: "Living Software Organism" in inglese con traduzione italiana
      sotto; 3 trait dal §5 SSOT; chiusura it VERBATIM "Risultato: non
      dipendi da nessuno. Nemmeno da me."; NESSUNA formula/equazione;
      animazione respiro attiva, e DISATTIVATA con
      `prefers-reduced-motion: reduce` (emulazione devtools); demo chat
      mostrata + CTA "la provi in chiamata"; NESSUNA chat interattiva in v1.
- [ ] S6: solo IdealOro, con link live funzionante; NESSUNA card Capasso;
      nessuna LOC visibile.
- [ ] S7: 5 fasce IDENTICHE a M-008 (diff JSON = zero su pricing_*).
- [ ] S8: claim "Prima chiamata: esci con un parere onesto"; bottoni
      email + WhatsApp funzionanti.
- [ ] CTA intermedie presenti dopo S3, S5, S7 e ancorate correttamente.

### Trasversali

- [ ] **i18n completeness**: ogni chiave nuova presente in TUTTI e 7 i file
      (it en de es fr pt zh); zero `MISSING_MESSAGE` nuovi in build (il
      `nav.preferences` fr è preesistente, NON di questa mission — HANDOFF §7);
      zero stringhe hardcoded nel TSX (grep di stringhe letterali nel JSX).
- [ ] **Chiavi morte**: `pain_*`, `evidence_*`, `how_*`, `receive_*`,
      `diff_*`, `portfolio_*`, vecchie `hero_*`, `cta_label`, `cta_paragraph`,
      `process_intro` assenti da tutti e 7 i file messages.
- [ ] **Claim compliance (SSOT §4)**: in NESSUNA lingua compaiono: LOC come
      apertura/protagonista; ore accanto ai prezzi; "50% sotto le agenzie" /
      "40-50% più veloce" / "Ultra Enterprise"; recensioni/pain di terzi o
      link Trustpilot; biografia in hero; formule con termini proprietari;
      prezzi fuori dalle fasce (incluso €10k); claim Sigillo più ampi di
      hash+vendita singola; percentuale redesign (70-80%).
- [ ] **No-JS**: `out/it.html` (build statico, NON `out/it/index.html` —
      HANDOFF §7) aperto con JS disabilitato: tutte le 8 sezioni leggibili.
- [ ] **GSAP**: nessun `import gsap from 'gsap'` top-level nei file nuovi
      (grep).
- [ ] **A11y**: heading order h1→h2→h3 senza salti; error widget annunciato
      (aria-live polite); counter con valore finale leggibile da screen
      reader; contrasto verificato dal gate.
- [ ] **Gate**: `python3 /home/fabio/os3-matrix/bin/web_quality_gate.py
      --dir out/ --page softwarehouse --locales it,en,de,es,fr,pt,zh
      --messages messages/` verde PRIMA del commit (hook bloccante).
- [ ] **Perf**: Lighthouse locale su `out/it.html`: LCP < 2s (target
      progetto), CLS < 0.1, nessun long task da count-up.

### Confini di collaborazione (non in questo doc)

- Build/test/CI, esecuzione gate in pipeline, deploy S3+CloudFront →
  `engineer-construction` / pipeline esistente (push su main = deploy,
  HANDOFF §7).
- Trust del payload stats (header CORS/CSP, validazione difensiva oltre il
  type-check), futura chat (input utente, SSE) → `engineer-security` alla
  mission M-EGI.
- Metriche di conversione delle CTA, validazione del flusso commerciale →
  `engineer-product` (la narrativa è già SSOT, non si riapre).

---

## Decisioni da confermare al CEO

1. Riuso screenshot `chat_ai.png` come "demo mostrata" in S5 (flag #2).
2. Aggiornamento valori `meta.softwarehouse_title/description` al nuovo
   claim (flag #4) — tocca anche OG.
3. Capacità "<48h rebrand" in S6 sì/no, vista l'adiacenza alla sezione
   prezzi (flag #5).
4. Copy micro-funzionale (label bottoni/CTA): conferma che NON è claim e il
   dev può scriverlo, purché senza contenuto commerciale nuovo (flag #3).
5. (Già in coda HANDOFF §8, non M-015): anomalia OG ×7 prima del deploy.

---

## UNCERTAINTY FLAGS

1. **[NOT_FOUND≠NOT_EXIST] Host endpoint chat futuro** — HANDOFF §5 dà la
   route `fabiocherici/advisor/chat` ma non l'host completo (egi.florenceegi
   .com? altro). La env `NEXT_PUBLIC_ADVISOR_CHAT_ENDPOINT` rimanda la
   decisione alla mission M-EGI: nessun valore inventato qui.
2. **[MY_INFERENCE] "Demo mostrata" in S5** — interpretata come riuso dello
   screenshot reale `/img/softwarehouse/chat_ai.png` con caption nuova
   conforme SSOT §3 r9. Alternativa: mock statico nuovo. Conferma CEO.
3. **[MY_INFERENCE] Confine claim vs micro-copy** — P0-FC-6 dice "contenuti
   da SSOT"; le label funzionali (testo bottoni, "vedi live", label loading)
   non sono claim e non esistono verbatim nell'SSOT. Assunzione: il dev può
   scriverle purché prive di contenuto commerciale. Da confermare.
4. **[NOT_FOUND≠NOT_EXIST] meta title/description** — i valori attuali
   (it.json:613-614) citano "qualità enterprise a costo accessibile":
   coerente con SSOT §1 ma non aggiornato al nuovo claim hero. Decisione
   copy non presa qui.
5. **[MY_INFERENCE] "<48h rebrand" in S6** — frame SSOT §3 r5 vieta ore
   ACCANTO ai prezzi; S6 precede immediatamente S7 prezzi. Proposta
   prudente: omettere il dato orario in S6. Decisione CEO.
6. **[MY_INFERENCE] Contrast ratio 8.4:1** — calcolato a mano con la formula
   WCAG su #C8A96E/#111111; SC 1.4.3 letto dalla fonte, il numero va
   confermato col tool del gate. `--text-secondary`/`--text-muted` non
   verificati ([PARTIAL_READ] di globals.css: letti token bg/accent e
   sezioni reveal/focus, non i token testo).
7. **[NOT_FOUND≠NOT_EXIST] Skip-to-main link** — `main#main-content` esiste
   (layout.tsx:80) ma non ho letto Navigation.tsx per verificare lo skip
   link. Verifica dev/gate.
8. **[PARTIAL_READ] Live regions** — il corpus copre le live region con una
   sintesi (mdn-aria.txt r61-62) e SC 4.1.3 (w3c-wcag22.txt r924-928); il
   dettaglio polite vs assertive applicato qui segue la skill/pratica APG,
   non un testo di fonte profonda in libreria.
9. **[NOT_FOUND≠NOT_EXIST] `hours_note` semantics** — la shape lo elenca ma
   contenuto/lingua non sono specificati. Se è testo libero dall'endpoint
   (presumibilmente it/en), mostrarlo raw viola potenzialmente P0-FC-4.
   Da chiarire con EGI-STAT: se non localizzabile, NON mostrarlo e usare
   una chiave i18n propria.
10. **[COUNT_BY_EYE] Conteggi chiavi** — stime (~55 nuove, ~145 eliminate)
    fatte leggendo il namespace; il conteggio esatto emerge al build.
11. **[SSOT_TRUST] Shape e garanzie endpoint stats** — CORS/cache/rate-limit
    e shape presi dall'HANDOFF §4 ("dipendenza PRONTA"); non ho chiamato
    l'endpoint. Il dev verifichi con un curl reale prima del build.
