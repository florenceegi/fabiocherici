---
title: "/softwarehouse — DESIGN BLUEPRINT (contenitore + esperienza di conversione, voce FlorenceEGI S.R.L.)"
doc_type: design_blueprint
organ: fabiocherici.com
status: draft_for_ceo_approval
date: '2026-06-16'
author: engineer-frontend-web-ux (design advisor — frontend/UX by-design Oracode)
scope:
  - app/[locale]/softwarehouse/page.tsx (RIDISEGNO layout/gerarchia/sequenza)
  - components/softwarehouse/* (riuso/ripensamento Hero, Padmin/Nexus, LiveSiteStats, vetrina, pillole)
  - app/globals.css (token: NESSUN nuovo token brand — riuso grafite/bronzo esistenti)
inputs_read_verbatim:
  - SALESPAGE_FINAL_FLORENCEEGI.md v2 (copy 45/50 — sequenza 8 sezioni, above-the-fold, 7 obiezioni)
  - SALESPAGE_REDESIGN_BUYER_POV.md (ICP, 5 paure, 5 domande in 5s)
  - SALESPAGE_EVAL_INDIPENDENTE.md (verdetto v1 33/50 + ri-misura v2 45/50, red-team)
  - app/[locale]/softwarehouse/page.tsx + SoftwarehouseHero/AdvisorSlot/NexusWidget/PadminChat/EgiShowcase/WisdomTicker/LiveSiteStats (componenti reali)
  - app/globals.css (token brand)
note: >
  Documento di DESIGN. Non tocca codice di produzione (React/Tailwind = dev-frontend),
  non riscrive copy verbatim (= SALESPAGE_FINAL v2). Definisce il CONTENITORE e
  l'ESPERIENZA che ospita e potenzia quel copy. Ogni scelta di design portante è
  citata: corpus letto direttamente `sources/<skill>/<file>` (NORMA W3C / PRATICA
  web.dev / UX NN/g, peso pieno) oppure fonte CRO riportata dai doc-copy (StoryBrand/
  Dunford/smart-team/instapage/unicornplatform — peso secondario, marcata [via doc-copy]).
  Confine collaborazione: build/test/CWV-in-pipeline → engineer-construction;
  XSS/CSP/sanitizzazione output Padmin/vetrina → engineer-security; discovery/metriche
  prodotto → engineer-product. Decisioni costituzionali (sequenza, peso Padmin,
  livello WCAG, budget CWV) → CEO.
---

# /softwarehouse — Design Blueprint

> **Mandato:** il copy (SALESPAGE_FINAL v2) è già pronto e misurato 45/50. Il mio
> compito è il **contenitore e l'esperienza** che lo rende massimamente efficace.
> Design, UI/UX e contenuti sono UN INSIEME: ogni scelta di layout/gerarchia/motion
> serve a far sì che il copy converta.
>
> **I 3 problemi del CEO da risolvere a livello VISIVO** (non solo testuale):
> 1. "Atterro e non capisco dove sono" → identità + categoria + prova devono colpire
>    l'occhio in <5s, prima della lettura.
> 2. "Gergo" → la gerarchia visiva deve subordinare i nomi proprietari al beneficio
>    (il beneficio è grande/in alto, il nome è piccolo/dopo).
> 3. "Offerta non spiegata" → ogni sezione è una risposta visivamente autosufficiente
>    a UNA domanda; lo scan deve dire "cosa c'è qui" senza leggere il corpo.
>
> **Tensione-chiave da sciogliere (preferenza CEO):** Padmin deve avere **peso reale
> sopra la piega** ("alla gente piace interagire") MA non deve schiacciare "chi siamo /
> cosa facciamo / perché fidarmi". Il blueprint la risolve con un **above-the-fold a due
> stadi** (vedi §1).

---

## 0. Principi di design che governano tutto il blueprint (grounded)

| # | Principio | Fonte (peso) | Come si applica |
|---|---|---|---|
| D1 | **Estetica minimalista: ogni unità di informazione compete con le altre e ne diminuisce la visibilità relativa** | `sources/ux-interaction-design/nng-ten-usability-heuristics.txt` §8 (NN/g, UX — peso pieno): *"Every extra unit of information in an interface competes with the relevant units of information and diminishes their relative visibility"* | Una CTA primaria sola sopra la piega; il bronzo riservato SOLO all'azione; niente badge/metriche-fornitore (LOC, ore) in vista. |
| D2 | **Recognition over recall** | nng §6 (peso pieno): *"Interfaces that promote recognition reduce the amount of cognitive effort"* | I prompt-seed di Padmin (già `<button>` in PadminChat) e gli esempi auto-qualifica prezzo rendono l'azione riconoscibile, non da inventare. |
| D3 | **Visibility of system status** | nng §1 (peso pieno) | Widget cantiere mostra stato loading/error/success onesto; Padmin mostra typing/streaming; vetrina mostra stato vuoto dignitoso. Già implementato — il design lo preserva. |
| D4 | **Match con il mondo reale (linguaggio del compratore)** | nng §2 (peso pieno) | Le etichette di sezione (eyebrow) usano parole del PMI, non gergo; coordinato con la tabella anti-gergo del copy. |
| D5 | **LCP = blocco di testo server-rendered ≤2.5s** (target Oracode <2s) | `sources/web-performance-core-vitals/web-dev-lcp-largest-contentful-paint.txt` §41-42 (web.dev, PRATICA — peso pieno): *"a good LCP value is 2.5 seconds or less"* + §69 (l'LCP può essere un `<h1>`/`<p>` prima che carichi un'immagine) | L'H1 è l'elemento LCP (testo, P0-FC-2). Niente immagine pesante come LCP sopra la piega. |
| D6 | **CLS: riservare spazio a tutto ciò che idrata/arriva async** | `sources/web-performance-core-vitals/web-dev-cls-cumulative-layout-shift.txt` §37 (web.dev — peso pieno): layout shift causati da *"images or videos with unknown dimensions, fonts... or third-party ads or widgets that dynamically resize themselves"* | Widget Padmin, cantiere e vetrina occupano altezza riservata (min-height) PRIMA dell'idratazione. Già fatto in LiveSiteStats (min-h) e EgiShowcase (aspect-ratio). |
| D7 | **INP: l'interazione deve dipingere il frame successivo presto** | `sources/web-performance-core-vitals/web-dev-inp-interaction-to-next-paint.txt` §38,58 (web.dev — peso pieno): input delay da *"long tasks on the main thread"*; feedback immediato evita "page not responding" | Padmin già dà feedback immediato (bolla utente + typing prima della rete, PadminChat r.76). Motion solo compositor-friendly (opacity/transform). |
| D8 | **Grunt test: in ~5s chi/cosa/come-mi-migliora/cosa-fare** | StoryBrand/jareddees [via doc-copy SALESPAGE_FINAL §0.1] | Governa l'above-the-fold (§1). |
| D9 | **Prova vicino all'obiezione che scioglie; named/specific > generic** | smart-team / instapage / unicornplatform [via doc-copy SALESPAGE_FINAL §9] | La prova-viva (marketplace) sta accanto al claim che sostiene; la striscia-prova è specifica (dal 1995 / 8 piattaforme / 3-5 giorni), non un trust-bar vago. |

> **Nota epistemica (REGOLA ZERO):** D1-D7 poggiano su fonti del corpus lette
> direttamente (norma/pratica/UX). D8-D9 poggiano su fonti CRO che NON ho potuto
> rileggere (WebSearch/WebFetch non disponibili in questa run): le tratto come riportate
> verbatim dai doc-copy già approvati, peso secondario, marcate [via doc-copy]. Vedi
> UNCERTAINTY FLAGS.

---

## 1. ABOVE-THE-FOLD — il ridisegno (risolve la tensione "Padmin vs chiarezza")

### 1.1 La scelta strutturale: above-the-fold a DUE STADI nello stesso viewport

Il problema attuale (diagnosticato nel BUYER_POV §2-Hero): lo split a 2 colonne mette la
chat come azione primaria PRIMA che il compratore sappia chi sei → fallisce grunt test #1
e #4. Ma il CEO vuole Padmin con peso reale sopra la piega.

**Soluzione:** non scegliere fra "identità" e "Padmin" — **darli entrambi, in due fasce
verticali dentro la prima schermata**, con una gerarchia che l'occhio percorre dall'alto
in basso (la lettura occidentale scende; la fascia identità intercetta lo sguardo per
prima → grunt test risolto; la chat è subito sotto, ampia, viva → interazione data).

```
┌──────────────────────────────────────────────────────────────────────┐
│  [nav esistente]                                                       │
│                                                                        │
│  ── STADIO 1 — IDENTITÀ + PROMESSA (fascia alta, full-width) ──        │
│                                                                        │
│  FLORENCEEGI · SOFTWARE SU MISURA PER PMI · DAL 1995      ← eyebrow     │
│                                                            bronzo, mono │
│                                                            uppercase    │
│  Il gestionale fatto sul tuo modo di lavorare —          ← H1 (LCP)    │
│  la prima versione la provi in 3-5 giorni, prima         display, 200  │
│  di firmare.                                             grande, chiaro │
│                                                                        │
│  Siamo FlorenceEGI: costruiamo software su misura per    ← sub, body   │
│  PMI. Provi una prima versione PRIMA di impegnarti.      secondary     │
│  Prezzi pubblici, il rischio lo teniamo noi.                           │
│                                                                        │
│  ┌────────────────────────────┐   oppure ↓ chiedi subito a Padmin     │
│  │ Raccontaci il tuo problema │   (anchor-scroll allo Stadio 2)        │
│  │ → primo parere gratuito    │   ← CTA secondaria testuale, no-bronzo │
│  └────────────────────────────┘                                       │
│   ↑ CTA PRIMARIA, pill bronzo pieno, una sola                          │
│                                                                        │
│  dal 1995  ·  8 piattaforme online che apri ora  ·  3-5 giorni        │
│   ↑ STRISCIA-PROVA: 3 fatti specifici, separatori bronzo, no-box      │
│                                                                        │
│ ─────────────────────────────────────────────────────────────────── │
│                                                                        │
│  ── STADIO 2 — PADMIN + PROVA VIVA (peso reale, ancora nel 1° scroll) ─│
│                                                                        │
│  CHIEDI ALLA RESPONSABILE TECNICA          ← eyebrow Stadio 2          │
│  ┌─────────────────────────────────┬──────────────────────────────┐  │
│  │  [P] Padmin · responsabile tec. │  VETRINA OPERE VIVE          │  │
│  │  ─────────────────────────────  │  ┌────┐ crossfade auto 4s     │  │
│  │  Risponde solo sui documenti    │  │ img│ opera cliccabile      │  │
│  │  reali. Se non sa, te lo dice   │  └────┘ → art.florenceegi.com │  │
│  │  e ti passa a una persona.      │                              │  │
│  │  ┌───────────────────────────┐  │  PILLOLE CHE SCORRONO        │  │
│  │  │ log chat (alto)           │  │  "..." crossfade             │  │
│  │  └───────────────────────────┘  │                              │  │
│  │  [seed] [seed] [seed]           │                              │  │
│  │  [ scrivi qui...        ▷ ]     │                              │  │
│  └─────────────────────────────────┴──────────────────────────────┘  │
│   ↑ chat DOMINANTE (≈60% larghezza desktop), vetrina+pillole a fianco │
└──────────────────────────────────────────────────────────────────────┘
```

**Perché questo risolve la tensione (e i 3 problemi CEO):**
- **Problema 1 "non capisco dove sono":** lo Stadio 1 è la PRIMA cosa che l'occhio
  incontra e risponde a chi/cosa/per-chi/perché/cosa-fare senza scroll (grunt test, D8
  [via doc-copy]). L'identità precede l'interazione — corregge il difetto della v attuale
  (BUYER_POV §2: "atterra e non sa di chi è la pagina").
- **Preferenza CEO "Padmin con peso reale":** lo Stadio 2 è ancora dentro il primo
  scroll (immediatamente sotto la piega vera o nella parte bassa di un viewport
  desktop alto), la chat è **ampia e dominante** (≈60% larghezza, già com'è in
  NexusWidget/PadminChat che usano min-h 32-34rem), affiancata dalla vetrina viva +
  pillole — esattamente la "ricchezza viva" del widget FREAI ammirato. Padmin NON è un
  widgettino: è metà schermata.
- **D1 (minimalismo):** una sola CTA bronzo nello Stadio 1; la "via Padmin" è un link
  testuale di second'ordine (no-bronzo) che fa anchor-scroll allo Stadio 2 → due azioni
  ma una sola gerarchia primaria (nessuna competizione di pari peso, nng §8).

### 1.2 Trattamento visivo dell'hero — cosa è testo, cosa è prova visiva

- **LCP = l'H1 testuale** (server-rendered, P0-FC-2). NON un'immagine: così l'LCP è
  istantaneo e indipendente dalla rete (D5, web.dev/lcp §69 — un `<h1>` è un candidato
  LCP valido prima di qualsiasi immagine). Questo è anche il motivo per cui la "prova
  visiva" forte (marketplace) sta nello **Stadio 2**, non come hero-image dello Stadio 1:
  un'immagine hero pesante diventerebbe l'LCP e lo rallenterebbe.
- **La prova visiva above-the-fold = la VETRINA opere vive** (EgiShowcase, già esistente),
  collocata nello Stadio 2 accanto a Padmin. È prova "named/specific" (D9 [via doc-copy]):
  opere reali cliccabili che aprono art.florenceegi.com, non un trust-bar generico. È
  "guarda le cose vive" tangibile a colpo d'occhio (richiesta CEO sulla prova).
- **La striscia-prova** (dal 1995 / 8 piattaforme / 3-5 giorni) è **3 fatti separati da
  punto-medio bronzo**, NON dentro box/badge (D1: i box aggiungono unità visive che
  competono). Testo, allineato sotto la CTA, leggibile senza JS.

### 1.3 Padmin: peso, posizione, stati, e perché NON è "intima"

- **Tono visivo "responsabile tecnica", non fidanzata:** avatar = monogramma "P" sobrio
  su `--accent-glow` (già in PadminChat r.139-145), NON un volto/illustrazione amichevole;
  font display per il nome, `--text-muted` per il ruolo "responsabile tecnica". Palette
  grafite/bronzo professionale, zero colori "caldi-affettivi". Il disclosure ("è un'AI,
  risponde sui documenti reali, se non sa ti passa a una persona") è SEMPRE visibile sopra
  il log (PadminChat r.153) — onestà visiva = autorità tecnica, non simulazione di
  relazione.
- **Stato aperto (desktop):** la chat è inline, sempre aperta nello Stadio 2 (nessun
  click per aprirla → meno attrito, D2). Area log alta (min-h 22rem, max 60vh — già così).
- **Stato mobile:** vedi §5.3 (Padmin diventa un pannello a piena larghezza con pattern
  dialog/modal opzionale per il "focus full-screen").

---

## 2. SISTEMA VISIVO (token brand riusati — ZERO nuovi token)

> Tutti i valori esistono già in `app/globals.css`. Il blueprint NON introduce nuovi
> token: usa quelli del design system grafite+bronzo. Questo è Semplicità Potenziante
> (nessuna over-abstraction) + coerenza con gli altri organi.

### 2.1 Colore — il bronzo è il colore della CONVERSIONE

| Ruolo | Token | Uso disciplinato |
|---|---|---|
| Sfondo base | `--bg` (#111 dark) | sezioni dispari |
| Sfondo elevato | `--bg-elevated` (#1a1a1a) | sezioni pari (ritmo a fasce alternate, §3) |
| Card | `--bg-card` (#1f1f1f) | tabella prezzi, card prova, widget |
| **Accento/CTA** | `--accent` (#C8A96E bronzo) | **SOLO**: CTA primaria (fill), link, eyebrow, numeri-protagonisti, separatori striscia-prova. MAI per testo di corpo lungo. |
| Accento hover | `--accent-hover` (#D4BA82) | hover CTA/link |
| Glow | `--accent-glow` / `--accent-muted` | avatar Padmin, respiro card LSO (già usato) |

**Regola di conversione (D1):** il bronzo è scarso e intenzionale. L'occhio impara
"bronzo = azione/fatto-chiave". Se il bronzo è ovunque, la CTA non spicca più. La CTA
primaria è l'unico **fill** bronzo pieno della pagina; le CTA secondarie/mid-page sono
**outline** bronzo (già il pattern in page.tsx r.343-352 + SectionCta).

### 2.2 Contrasto — verifica WCAG (NORMA, non opinione)

`sources/web-accessibility-wcag/w3c-wcag22.txt` §261-267 (SC 1.4.3 AA, peso pieno):
testo normale ≥ **4.5:1**, testo large ≥ **3:1**; §354 (SC 1.4.11, peso pieno): UI/grafica
≥ **3:1**.

| Coppia | Contesto | Verifica |
|---|---|---|
| `--text-primary` #f0ebe3 su `--bg` #111 | corpo dark | ~14:1 — PASS AA/AAA |
| `--text-secondary` #a8a29e su `--bg` #111 | sub/corpo secondario | ~7:1 — PASS AA |
| `--text-muted` #8a847d su `--bg` #111 | eyebrow/note | ~4.6:1 — PASS AA per testo normale; per testo <18px è al limite → **usare muted solo per uppercase tracking-wide ≥ small, mai per paragrafi lunghi** |
| **`--accent` #C8A96E su `--bg` #111** | link/eyebrow bronzo su scuro | ~6.8:1 — PASS AA |
| **`--bg` #111 su `--accent` #C8A96E** | testo CTA primaria (grafite su bronzo) | ~6.8:1 — PASS AA (è la combinazione inversa, già usata in page.tsx r.339 `text-[var(--bg)]` su `bg-[var(--accent)]`) |
| `--accent` #C8A96E come bordo CTA outline su #111 | non-text contrast | ~6.8:1 — PASS SC 1.4.11 (≥3:1) |

> **[DA VERIFICARE — handoff a engineer-construction]:** i ratio sopra sono calcolati a
> mano sui token e vanno confermati con uno strumento (axe/Lighthouse) in pipeline,
> specie `--text-muted` su `--bg` (al confine 4.5:1). Il tema **light** (`--accent`
> #7D6340 su #faf8f5 ~ 4.6:1) e gli ambient vanno ricontrollati uno per uno: alcuni
> ambient (es. ambient-evening `--accent` #b0a0c0 su #0f0f14) possono scendere sotto
> soglia per il bronzo-accent → segnalato come rischio, non risolto qui. [MY_INFERENCE]
> sui valori esatti: contrasto stimato, non misurato in questa run.

### 2.3 Tipografia, scala, ritmo verticale

- **Display** `var(--font-display)`, peso `font-light`/200, per H1/H2 e numeri-protagonisti
  (coerente con tutto il sito: page.tsx usa già `font-light tracking-tight`). Voce
  "luxury/sobria", non aggressiva da venditore.
- **Body** `var(--font-body)`, `leading-relaxed`, `text-secondary` per il corpo.
- **Mono** uppercase `tracking-widest` per gli **eyebrow** di sezione (già il pattern
  `labelClass` in page.tsx r.58-59): l'eyebrow è la firma visiva che dice "che sezione è
  questa" → fa lo scan (risolve problema 3 CEO: ogni sezione è etichettata).
- **Scala H1:** `text-4xl → 5xl → 6xl` (già in SoftwarehouseHero r.46). H2 sezione
  `text-3xl → 4xl` (titleClass r.61-62). Gerarchia chiara: H1 una sola sulla pagina.
- **Ritmo verticale:** sezioni `py-24`/`py-32` (già in page.tsx). Spazio generoso =
  D1 minimalismo (l'aria fa risaltare il contenuto essenziale).

### 2.4 Motion — disciplina P0-FC-1 + reduced-motion (NORMA)

- **Scroll-reveal** (ScrollReveal + GSAP dynamic import, P0-FC-1): enhancement, mai
  nasconde contenuto senza JS (P0-FC-2). Già corretto in globals.css §236-243.
- **Count-up cantiere:** GSAP dynamic import in useEffect, una tantum in viewport,
  disattivato con reduced-motion (LiveSiteStats r.156-201 — corretto).
- **Crossfade vetrina + pillole:** CSS opacity (compositor-friendly, D7), auto-rotazione
  in pausa su hover/focus-within, NESSUNA auto-rotazione sotto `prefers-reduced-motion`
  (EgiShowcase r.120-144 + globals.css §695-748 — corretto, rispetta WCAG 2.2 SC 2.2.2
  Pause/Stop/Hide).
- **Tutte le animazioni** su `opacity`/`transform` → zero layout shift (D6). Nessun
  motion che sposta testo. `prefers-reduced-motion` già gestito globalmente
  (globals.css §245, §695).

---

## 3. GERARCHIA & SCANSIONABILITÀ della sequenza (8 sezioni del copy)

> La sequenza è quella di SALESPAGE_FINAL v2 §3 (decisa dal CRO, ordine motivato dalle
> obiezioni). Il mio compito: come ogni sezione **appare** e cosa **cattura l'occhio**.
> Pattern trasversale: ogni sezione = **eyebrow (mono, dice cosa-è) + H2 (display, la
> promessa) + corpo scannabile + un elemento-prova/CTA**. Sfondi a fasce alternate
> `--bg`/`--bg-elevated` per separare visivamente le risposte alle obiezioni (D3:
> il cambio di sfondo segnala "nuovo argomento").

| # | Sezione (copy) | Trattamento visivo | Elemento che cattura l'occhio | Principio |
|---|---|---|---|---|
| Hero | Identità + Padmin + prova | §1 (due stadi) | H1 + striscia-prova + vetrina viva | D8/D9 |
| 1 | Il problema (empatia) | testo centrato stretto (max-w-3xl), nessun visual che distragga dall'empatia | la frase-dolore ("Excel, email, WhatsApp e 3-4 programmi") in `--text-primary` | D4 (linguaggio reale) |
| 2 | Come funziona + box "Cosa firmi" | 4 passi numerati (numeri bronzo display grandi) + **box "Cosa firmi davvero" evidenziato** (`--bg-card`, bordo `--accent-muted`) | il box risk-reversal: il meccanismo VISIBILE è ciò che converte | D9 [via doc-copy smart-team: "risk proof is a conversion topic"] |
| 3 | Quanto ci metti (velocità) | **confronto visivo mercato→noi**: due barre/colonne affiancate, "settimane" vs "3-5 giorni", il nostro tempo in bronzo grande | il numero **3-5 giorni** in display bronzo, dominante | D1 (un numero protagonista) |
| 4 | Prezzi (tabella mercato vs noi) | tabella responsive (vedi §4.1) | colonna **"Con noi"** evidenziata bronzo; riga-cappello in `--text-muted` italic | D9 |
| 5 | La prova (cose vive) | griglia di 3 blocchi A/B/C + **richiamo alla vetrina sopra** + CTA "verifica in privato" | i prodotti vivi linkati (art.florenceegi.com, Padmin) | D9 |
| 6 | Cosa ricevi (beneficio→nome) | 3 tratti in card (LsoTraits, respiro CSS già esistente) + **nome "LSO" relegato a nota piccola DOPO** | i 3 benefici grandi; il nome proprietario è `--text-muted` piccolo | **risolve problema 2 CEO (gergo) VISIVAMENTE: beneficio = grande/alto, nome = piccolo/dopo** |
| 7 | Chi è FlorenceEGI | testo + "dal 1995" + "parli con chi scrive il codice" | "DAL 1995" come fatto-autorità | D9 |
| 8 | CTA finale calda | centrato, 2 bottoni (mail bronzo-fill + WhatsApp outline) + coda Padmin | la CTA mail (unico secondo fill bronzo della pagina, in chiusura) | D1 |

**Problema 3 CEO (offerta non spiegata) risolto VISIVAMENTE:** l'eyebrow mono di ogni
sezione ("IL PROBLEMA", "COME LAVORIAMO", "QUANTO CI METTI", "INVESTIMENTO", "LA PROVA",
"COSA TI RESTA IN MANO", "CHI SIAMO") permette lo **scan verticale**: scorrendo, il
compratore legge la "tabella dei contenuti" della pagina senza leggere i corpi → capisce
l'offerta dalla struttura (D2 recognition + nng §8 minimalismo). È l'opposto della v
attuale dove "cantiere aperto" non diceva nulla a freddo (BUYER_POV §2).

---

## 4. SPEC COMPONENTI & INTERAZIONE

### 4.1 Tabella prezzi (Sez. 4) — il pattern responsive a doppia colonna tempo

Sfida: 6 colonne (Fascia, Prezzo, Tempo mercato, **Con noi**, Manutenzione, Caparra) NON
stanno su mobile in tabella. Pattern:

- **Desktop (≥ md):** `<table>` semantica vera (header `<th scope="col">`, `<caption>`
  sr-only), colonna **"Con noi"** con sfondo `--accent-glow` e valore bronzo per farla
  emergere (è la leva). Riga-cappello sopra la tabella in `--text-muted` italic.
- **Mobile (< md):** la tabella **collassa in card per fascia** (una card = una fascia,
  ogni cella diventa "label: valore"). NON scroll orizzontale di una tabella larga
  (web.dev/responsive: il contenuto si riflow, non si scrolla via). Mantenere markup
  tabellare semantico e cambiare solo presentazione via CSS, oppure due rappresentazioni
  con `aria-hidden` coordinato — **handoff a dev-frontend**, è scelta di implementazione.
- **Caparra (N1 del verdetto):** le % 30/20/10 sono [DA VALIDARE CEO] (non SSOT). Design:
  se restano, vanno in colonna come le altre; se il CEO non le conferma, la colonna si
  rimuove senza rompere il layout (la card mobile semplicemente non ha quella riga).
  **Decisione contenuto, non design** — segnalo solo che il layout regge entrambi i casi.

### 4.2 Padmin (riuso NexusWidget/PadminChat/AdvisorSlot — già esistenti e corretti)

- **Riuso as-is** il widget (NexusWidget = chat dominante + ticker pillole + vetrina).
  È già: feedback immediato INP (D7), CLS-safe (min-h), reduced-motion, fallback statico
  onesto senza endpoint (AdvisorSlot r.57-88, P0-FC-2). Il design NON lo riscrive.
- **Cambio di COLLOCAZIONE** rispetto a oggi: oggi il widget è l'intero hero (split). Nel
  blueprint diventa lo **Stadio 2** dell'above-the-fold (sotto l'identità), e l'ancora
  `#padmin` resta lì (i link "parla con Padmin" delle altre sezioni continuano a
  funzionare).
- **Vetrina (EgiShowcase) + pillole (WisdomTicker):** restano affiancate alla chat
  (NexusWidget r.66-70). La vetrina è la "prova viva" tangibile sopra la piega (richiesta
  CEO). Stato vuoto/errore già dignitoso (EgiShowcase r.226-240: link onesto a
  florenceegi.com, nessun crash).
- **[Confine engineer-security]:** la chat rende markdown-subset (nexus-prose) e la
  vetrina rende `<img>` da `image_url` + link a `share_url` provenienti da un endpoint
  esterno. Output dinamico da fonte remota → **rischio XSS/injection**: la
  sanitizzazione del markdown di Padmin e la validazione di image_url/share_url (no
  `javascript:`, no HTML grezzo) sono di `engineer-security`. EgiShowcase già fa
  validazione di shape difensiva (r.49-65) ma NON sanitizza il contenuto delle stringhe
  → segnalo, non risolvo.

### 4.3 Widget cantiere (LiveSiteStats) — collocazione e ruolo

- Oggi è la sezione #2 (subito dopo hero) — il BUYER_POV §2 la critica come prova-da-
  fornitore messa troppo presto e con gergo ("righe nette di codice"). **Il copy v2 NON
  ha più una sezione "cantiere" dedicata** (la sequenza v2 è: problema → come funziona →
  velocità → prezzi → prova → cosa ricevi → chi siamo → CTA). Quindi:
  - **Opzione design A (consigliata):** il widget cantiere si **fonde nella Sez. 5 "La
    prova"** come elemento verificabile ("guarda i numeri vivi"), NON come sezione a sé.
    Lì la sua prova ha un motivo (D9: prova accanto all'obiezione "posso crederci?").
  - **Opzione B:** rimuoverlo dalla pagina di vendita (resta la prova "vetrina + git
    pubblico"). Il copy v2 anti-gergo declassa "righe nette di codice" (§5 tabella
    anti-gergo: "TOGLIERE dalla pagina"). Se resta, **nascondere la riga LOC** e tenere
    solo ore/progetti (LiveSiteStats già mette LOC come riga secondaria r.264-272 → si
    può non renderla).
  - **Decisione CEO + coordinamento col copy:** è una scelta di contenuto/posizionamento.
    Design-wise entrambe reggono; raccomando A (riuso del componente, prova nel punto
    giusto).

### 4.4 Stati (loading / vuoto / errore) — già coperti, il design li preserva

| Componente | Loading | Vuoto | Errore |
|---|---|---|---|
| Padmin chat | typing/streaming (D7) | empty-state con seed cliccabili (D2) | messaggio errore in chiaro, rate-limit (nng §9 error guidelines: plain language) |
| Vetrina | (fetch silenziosa) | link onesto a florenceegi.com | idem, nessun crash |
| Cantiere | messaggio "loading" aria-live | — | fallback testuale SENZA numeri (P0-FC-2) |

Tutti già implementati correttamente. Il design **non li tocca**, li eredita.

---

## 5. RESPONSIVE & MOBILE-FIRST (il PMI atterra qui)

> `sources/css-design-systems/web-dev-learn-responsive-design.txt` (web.dev — peso pieno):
> il contenuto deve **riflowire**, non scrollare via. Mobile-first = ordine di lettura
> verticale come SSOT della gerarchia.

### 5.1 Ordine dei blocchi su mobile (single-column)

Lo split desktop a 2 colonne collassa in **una colonna**. L'ordine verticale mobile =
l'ordine di priorità del messaggio:

```
[eyebrow identità] → [H1] → [sub] → [CTA primaria full-width] →
[striscia-prova, wrappata su 1-2 righe] → [link "chiedi a Padmin"] →
─── Stadio 2 ───
[Padmin chat full-width, ALTA] → [vetrina opere, scroll-snap orizzontale] →
[pillole] → ... resto sequenze sezioni
```

- La **CTA primaria è full-width** su mobile (target ampio, tap facile).
- La **vetrina** su mobile NON ruota in crossfade impilato: diventa **striscia
  scroll-snap orizzontale** (EgiShowcase già fa esattamente questo quando non ruota,
  r.166-167) → il pollice scorre le opere.

### 5.2 Tabella prezzi mobile → card (vedi §4.1).

### 5.3 Padmin su mobile — opzione dialog/modal a piena attenzione (NORMA APG)

Su mobile la chat inline è alta e spinge giù il resto. Due pattern, decisione CEO/dev:
- **A (inline, consigliato per semplicità):** chat inline full-width nello Stadio 2,
  altezza contenuta (max-h 60vh, già in PadminChat r.162) con scroll interno. Semplice,
  nessun trap di focus da gestire.
- **B (bolla → dialog full-screen):** una bolla "Chiedi a Padmin" persistente; al tap
  apre un **dialog modale full-screen**. SE si sceglie B, è OBBLIGATORIO il pattern APG
  dialog (`sources/web-accessibility-wcag/w3c-aria-apg-dialog-modal-pattern.txt`, NORMA —
  peso pieno):
  - focus trap: Tab/Shift+Tab restano dentro il dialog (§10-11);
  - `Escape` chiude (§29);
  - alla chiusura il **focus torna al trigger** (la bolla) (§42);
  - focus iniziale su elemento interno appropriato (§31-38);
  - bottone di chiusura visibile (§51); `aria-modal`/`role="dialog"`.
  - Inoltre WCAG 2.2 SC 2.4.11 Focus Not Obscured (AA, w3c-wcag22 §609-615): il campo
    input non deve restare coperto dalla tastiera virtuale.
  **Raccomandazione [MY_INFERENCE]:** opzione A — meno superficie d'errore a11y,
  coerente con Semplicità Potenziante; B solo se il CEO vuole la bolla persistente in
  stile messenger. Da validare CEO.

### 5.4 Target size (NORMA WCAG 2.2 SC 2.5.8 AA)

`w3c-wcag22 §709-714` (peso pieno): target pointer ≥ **24×24 CSS px** (o spacing
equivalente). I prompt-seed di Padmin sono già `min-h-11` (44px, PadminChat r.179) —
oltre il minimo. **Tutte le CTA, link di sezione, celle-tabella cliccabili, frecce
vetrina devono rispettare ≥24px** (raccomandato 44px per il pollice mobile). Handoff
a dev-frontend: verificare i link inline `linkClass` (page.tsx r.55) che, essendo
inline-in-sentence, ricadono nell'eccezione "Inline" del criterio (§719) — ok.

---

## 6. ACCESSIBILITÀ WCAG 2.2 AA + CORE WEB VITALS (requisiti, non ripensamenti)

### 6.1 A11Y — checklist di design (target Oracode WCAG 2.1 AA; corpus = 2.2)

| Requisito | Criterio (fonte corpus, NORMA) | Stato nel design |
|---|---|---|
| Semantic HTML + landmarks | W3C-WAI fundamentals | `<section aria-labelledby>` per ogni sezione (già in page.tsx), una sola `<h1>`, gerarchia H2 |
| Contrasto testo ≥4.5:1 / large ≥3:1 | SC 1.4.3 (w3c-wcag22 §261-267) | §2.2 — PASS dark; light/ambient + muted [DA VERIFICARE in pipeline] |
| Contrasto UI/bordi ≥3:1 | SC 1.4.11 (§354) | bordo CTA outline bronzo ~6.8:1 PASS |
| Focus visibile | `:focus-visible` 2px accent (globals.css §272-275) | PASS |
| Focus order logico | SC 2.4.3 (§559) | ordine DOM = ordine visivo; Padmin nello Stadio 2 dopo l'identità |
| Focus non coperto | SC 2.4.11 AA (§609-615, NUOVO 2.2) | input Padmin non coperto da tastiera (vedi §5.3) — **criterio 2.2: possibile requisito = decisione CEO bump 2.2** |
| Target size ≥24px | SC 2.5.8 AA (§709-714, NUOVO 2.2) | seed 44px PASS; resto da verificare — **criterio 2.2** |
| Animazione disattivabile | SC 2.2.2 / `prefers-reduced-motion` | già gestito globalmente |
| Live regions corrette | SC 4.1.3 | cantiere/Padmin aria-live solo su stato, non spam (già corretto) |
| Lingua | SC 3.1.1 | next-intl, `lang` per locale |

> **Bump WCAG 2.2 = decisione CEO.** Il target Oracode è 2.1 AA; il corpus è 2.2. I due
> criteri 2.2 nuovi rilevanti per questa pagina (Focus Not Obscured 2.4.11, Target Size
> 2.5.8) sono **buona pratica già quasi soddisfatta** dal design: raccomando di adottarli
> ma è il CEO a decidere se elevare formalmente il target a 2.2.

### 6.2 CWV — budget di design (target P0-FC-5 LCP<2s, no CLS)

| Metrica | Soglia | Scelta di design che la garantisce | Fonte |
|---|---|---|---|
| **LCP** | <2s (Oracode) / <2.5s (web.dev) | LCP = H1 testuale server-rendered, niente hero-image pesante; font con fallback (no FOIT che ritarda il render del testo, web.dev/lcp §70) | web-dev-lcp §41-42, §69-70 (peso pieno) |
| **CLS** | ~0 | min-height riservata a Padmin/cantiere; `aspect-ratio` + width/height su `<img>` vetrina; animazioni solo opacity/transform | web-dev-cls §37 (peso pieno) |
| **INP** | <200ms | feedback immediato Padmin (bolla+typing prima della rete); count-up GSAP solo dopo in-view e una tantum; niente long task sul main thread al primo input | web-dev-inp §38,58 (peso pieno) |

> **[Confine engineer-construction]:** la MISURA reale di LCP/INP/CLS (Lighthouse/CrUX),
> il font-loading strategy (preload/`font-display`), il code-splitting del bundle Padmin
> e il Web-Quality-Gate in pipeline sono suoi. Io definisco il budget e le scelte di
> design che lo rispettano; lui lo costruisce/misura/consegna.

### 6.3 SEO — contenuto pubblico indicizzabile

- La pagina è **server-rendered statica** (Next static export) → tutto il copy è
  nell'HTML (P0-FC-2). SSR-equivalente per indicizzazione: corretto by-design.
- Meta/OG/Twitter + JSON-LD Service/WebPage già presenti (page.tsx r.29-121). Il
  ridisegno **non rimuove** lo schema; va aggiornata `priceRange` se cambia il provider
  da "Person Fabio Cherici" a "FlorenceEGI S.R.L." (coerenza voce-house del copy v2:
  vende la società, non la persona) → **handoff a dev-frontend + coerenza copy**.
- **[Confine engineer-security]:** lo `<script type="application/ld+json"
  dangerouslySetInnerHTML>` (page.tsx r.182-187) inietta JSON-LD — i valori sono interni
  controllati, ma se mai derivassero da i18n con input non fidato, è superficie XSS →
  segnalo.

---

## 7. CTA & FLUSSO DI CONVERSIONE (il percorso dell'occhio fino all'azione)

### 7.1 Gerarchia delle CTA (D1: una primaria per momento)

| Posizione | CTA | Trattamento | Ruolo |
|---|---|---|---|
| Stadio 1 hero | "Raccontaci il tuo problema → primo parere gratuito" | **fill bronzo, pill** | primaria, azione a basso rischio |
| Stadio 1 hero | "oppure chiedi a Padmin" | **link testuale** (anchor → Stadio 2) | secondaria, per chi vuole interagire |
| Sez. 2/4/5 (mid) | "Raccontaci cosa ti serve" | **outline bronzo** (SectionCta) | ripetizione a fine-obiezione (lo slancio dopo che la paura è sciolta) |
| Sez. 8 finale | "Scrivici una mail" + "WhatsApp" | mail **fill bronzo**, WhatsApp **outline** | conversione calda |
| Coda Sez. 8 | "chiedi a Padmin" | link | rete di sicurezza per i tiepidi |

### 7.2 Ripetizione e sticky

- **Ripetizione a fine-obiezione** (mid-CTA dopo Sez. 2, 4, 5): ogni volta che una paura
  è sciolta, l'azione è a portata di click (non costringere a risalire). Pattern già
  presente (SectionCta in page.tsx).
- **Sticky CTA: NO sopra la piega, valutare una barra CTA sticky su mobile in fondo allo
  scroll lungo.** [MY_INFERENCE / decisione CEO]: una mini-barra sticky mobile "Parere
  gratuito" può aiutare la conversione su pagina lunga, MA aggiunge un'unità visiva
  persistente (tensione con D1) e va resa dismissibile + non coprire focus (SC 2.4.11).
  Raccomando di **A/B testarla**, non darla per scontata. Non è un requisito.

### 7.3 Il percorso dell'occhio (sintesi)

`eyebrow identità` (so dove sono) → `H1 + 3-5 giorni` (so cosa offrono e il beneficio) →
`CTA bronzo` (so cosa fare) → `striscia-prova` (primo perché-fidarmi) → scroll →
`Padmin + vetrina viva` (interazione + prova tangibile) → sequenza obiezioni, ognuna con
mid-CTA → `CTA finale calda`. Il bronzo guida l'occhio di tappa in tappa (D1).

---

## 8. NOTA DI INTEGRAZIONE — come design e copy lavorano insieme, sezione per sezione

| Sezione copy | Cosa fa il COPY | Cosa fa il DESIGN per potenziarlo |
|---|---|---|
| Hero | dice chi/cosa/velocità/risk-reversal + CTA | due-stadi: identità in alto (grunt test), Padmin+vetrina con peso sotto (interazione+prova); bronzo isola la CTA |
| 1 Problema | empatia ("Excel, email, WhatsApp...") | colonna stretta centrata, nessun visual che distrae → l'emozione resta sul testo |
| 2 Come funziona | 4 passi + box "Cosa firmi" | numeri bronzo grandi (sequenza chiara) + box evidenziato (il meccanismo è VISIBILE, non solo detto) |
| 3 Velocità | comparativa mercato→noi | confronto visivo a barre/colonne, "3-5 giorni" in bronzo dominante → la leva si VEDE |
| 4 Prezzi | tabella mercato vs noi + auto-qualifica | colonna "Con noi" evidenziata bronzo; mobile → card per fascia (riflow, non scroll) |
| 5 Prova | "guarda le cose vive" + verifica privata | i prodotti vivi sono linkati + la vetrina viva richiamata; cantiere fuso qui (prova nel punto giusto) |
| 6 Cosa ricevi | beneficio PRIMA del nome LSO | **gerarchia visiva: beneficio grande/alto, nome "LSO" piccolo/muted/dopo** → il gergo è subordinato (problema 2 CEO) |
| 7 Chi siamo | dal 1995 + chi scrive il codice | "DAL 1995" come fatto-autorità in evidenza, voce-house sobria |
| 8 CTA finale | parere onesto + mail/WhatsApp | secondo (e ultimo) fill bronzo della pagina, chiusura calda |

**Il messaggio è il copy; il contenitore è il design; insieme:** l'identità arriva prima
della lettura (visivo), la velocità si vede prima di leggerla (numero bronzo), il gergo è
visivamente subordinato al beneficio, e la prova è tangibile a colpo d'occhio (vetrina
viva sopra la piega). I 3 problemi del CEO sono risolti dalla GERARCHIA VISIVA, non solo
dalle parole.

---

## 9. CONFINI DI COLLABORAZIONE

- **engineer-construction:** implementazione React/Tailwind, font-loading strategy,
  code-splitting del bundle Padmin, misura reale LCP/INP/CLS (Lighthouse/CrUX),
  Web-Quality-Gate in pipeline, verifica contrasto automatica (axe). Il pattern
  tabella-responsive (table↔card) è implementazione sua.
- **engineer-security:** sanitizzazione del markdown di Padmin (nexus-prose), validazione
  contenuto di `image_url`/`share_url` della vetrina (no `javascript:`/HTML grezzo),
  Content-Security-Policy (la diagnosi CSP del commit b6bf5c3 è in scope suo), il
  `dangerouslySetInnerHTML` del JSON-LD.
- **engineer-product:** validazione ICP/dolore-tipo reale (gap dichiarato dal copy §6.5),
  scelta delle metriche di conversione, decisione A/B su sticky-CTA mobile e su Padmin
  inline vs dialog.
- **engineer-salespage (autore copy):** il copy verbatim, i numeri da ancorare al git, le
  % caparra. Coordinamento sul destino del widget cantiere (§4.3) e sulla coerenza
  voce-house nel JSON-LD (§6.3).

---

## 10. DECISIONI DA CONFERMARE AL CEO

1. **Above-the-fold a due stadi** (identità sopra, Padmin+vetrina sotto nel 1° scroll) vs
   split attuale — è la scelta strutturale che risolve la tensione "Padmin vs chiarezza".
2. **Destino del widget cantiere** (§4.3): fuso nella Sez. 5 prova (consigliato) vs
   rimosso vs riga LOC nascosta.
3. **Padmin mobile** (§5.3): inline (consigliato) vs bolla→dialog full-screen (richiede
   pattern APG completo).
4. **Bump WCAG 2.1 AA → 2.2 AA** (§6.1): adottare formalmente i criteri 2.2
   (Focus Not Obscured, Target Size) — già quasi soddisfatti.
5. **Sticky-CTA mobile** (§7.2): sì/no/A-B-test.
6. **Coerenza voce-house nel JSON-LD** (§6.3): provider = FlorenceEGI S.R.L. vs Person.
7. **Budget CWV ufficiale** (§6.2): confermare LCP<2s come soglia di gate.

---

## 11. PROSSIMO PASSO (la verifica che sblocca di più)

**Validare con il CEO la struttura above-the-fold a due stadi (§1) + il destino del
widget cantiere (§4.3).** Sono le due decisioni da cui dipende l'intero layout: tutto il
resto (sistema visivo, responsive, a11y, CWV) è già grounded e riusa componenti corretti
esistenti. Subito dopo: passare a engineer-construction la verifica contrasto
light/ambient in pipeline (l'unico rischio a11y aperto non risolvibile a mano qui).

---

## UNCERTAINTY FLAGS

- [PARTIAL_READ] **WebSearch/WebFetch NON disponibili in questa run** (solo Read/Grep/Glob/
  Write). Le best-practice CRO sull'above-the-fold/sales-page (StoryBrand grunt-test,
  Dunford positioning, smart-team risk-reversal, instapage named/specific, unicornplatform
  expectation-setting) NON sono state ri-fetchate: le tratto come **riportate verbatim dai
  doc-copy già approvati** (SALESPAGE_FINAL §0/§9, BUYER_POV §6), marcate [via doc-copy],
  peso secondario. Il grounding a peso pieno (norma/pratica/UX: WCAG 2.2, web.dev CWV,
  NN/g) è dal corpus `frontend-web-ux` letto direttamente in questa run.
- [MY_INFERENCE] I ratio di contrasto in §2.2 sono **calcolati/stimati a mano** sui token
  hex, NON misurati con strumento. `--text-muted` su `--bg` (~4.6:1) è al confine 4.5:1;
  i temi light e gli 8 ambient NON sono stati tutti verificati → rischio reale su alcuni
  ambient col bronzo-accent. Verifica strumentale = engineer-construction in pipeline.
- [MY_INFERENCE] Raccomandazioni "Padmin inline vs dialog" (§5.3) e "sticky-CTA mobile"
  (§7.2): scelte di UX motivate dai principi citati, da validare con A/B test reale
  (compito engineer-product), non misure.
- [SSOT_TRUST] La sequenza delle 8 sezioni, il copy e i fatti (3-5 giorni, 8 piattaforme,
  fasce prezzo, % caparra) derivano da SALESPAGE_FINAL v2 e dai suoi SSOT
  (commercial-claims-public.md) — NON ri-verificati contro l'SSOT in questa run di design.
  Le % caparra 30/20/10 sono marcate [DA VALIDARE CEO] dal verdetto (N1): il mio layout
  regge sia col sia senza colonna caparra.
- [NOT_FOUND≠NOT_EXIST] Il copy v2 NON ha una sezione "cantiere" dedicata; il componente
  LiveSiteStats esiste ed è corretto. La sua collocazione (§4.3) è una decisione aperta,
  non un dato mancante.
- [COUNT_BY_EYE] Componenti riusati verificati per lettura diretta dei file
  (SoftwarehouseHero, AdvisorSlot, NexusWidget, PadminChat, EgiShowcase, WisdomTicker,
  LiveSiteStats); non ho letto ChatInput/ChatMessage/ImageAttach/useNexusStream nel
  dettaglio (non portanti per il layout).
- Confine ribadito: questo è DESIGN. Implementazione React/Tailwind = engineer-construction;
  copy verbatim = engineer-salespage; sicurezza output Padmin/vetrina/CSP = engineer-security.
