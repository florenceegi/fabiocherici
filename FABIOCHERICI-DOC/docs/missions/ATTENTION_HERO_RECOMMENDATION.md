---
title: Raccomandazione above-the-fold /softwarehouse — cattura 3s → interazione Padmin
doc_type: design-recommendation
organ: fabiocherici.com
status: proposal
date: '2026-06-16'
author: Engineer advisor (product/growth & CRO) — proposta, decide il CEO
scope:
- fabiocherici.com
- /softwarehouse
note: >
  Design doc, NON codice. Ogni copy proposto è ancorato all'SSOT
  commercial-claims-public.md o segnato [da validare CEO] se nuovo.
  Decisioni di prodotto → approva il CEO.
---

# Above-the-fold /softwarehouse — catturare i primi 3s e portare a Padmin

> Regola di metodo (advise): prima di toccare il layout, fissiamo i criteri
> (questo doc) e UNA metrica di successo (§5). Riscrivere l'hero "a sensazione"
> ripete la cicatrice del claim hero inventato (CLAUDE.md). Niente copy nuovo in
> produzione senza che il CEO validi i pezzi segnati [da validare CEO].

---

## 0. Quadro tecnico verificato (FATTO)

Letto nel codice — non ipotesi:

- **L'hero attuale è `min-h-screen`** (`SoftwarehouseHero.tsx` riga 22): occupa
  da solo TUTTO il primo viewport. Contiene: label "SOFTWAREHOUSE", H1 *"Vedi il
  tuo software funzionare. Poi decidi."*, sub *"Un MVP funzionante prima di
  firmare. Prezzi pubblici. Il rischio lo tiene il fornitore."*, due bottoni
  ("Vedi il processo" → #processo, "Parliamone" → #contatto), e un Canvas 3D di
  sfondo.
- **Padmin NON è above-the-fold.** La sezione `#padmin` (page.tsx righe 196-209)
  vive *sotto* l'hero a tutto schermo: per vederla l'utente deve scrollare. Il
  commento M-017 #3 dice "la chat va all'inizio", ma di fatto è il secondo blocco
  dopo un hero che riempie lo schermo.
- **La chat ha empty-state passivo.** `PadminChat.tsx` riga 157 mostra solo testo
  *"Fai una domanda su come lavoriamo…"* — NESSUN prompt-seed cliccabile.
  L'utente deve formulare da zero la domanda nel `textarea` (ChatInput).
- **Le CTA hero puntano via dalla chat**, non a Padmin: #processo e #contatto
  (email/WhatsApp). L'azione differenziante (parlare con Padmin) non è la CTA
  primaria above-the-fold.
- **Padmin legge immagini** (PadminChat righe 85-93: `image` nel body, ImageAttach)
  → l'idea CEO "le mandi lo screenshot del gestionale" è già supportata dal widget.
- **Fallback onesto senza env** (`AdvisorSlot.tsx`): senza endpoint la chat
  diventa copy + CTA "provala in chiamata". Qualsiasi redesign deve degradare
  bene anche in questo stato (P0-FC-2).

---

## 1. Diagnosi dei primi 3 secondi attuali

Riferimento metodo: heuristic evaluation alla Nielsen (`sources/nielsen-10-usability-heuristics.md`,
PRACTITIONER-ESSAY). Le soglie temporali (50ms, 3-6s, 84% attenzione above-the-fold)
vengono dalla ricerca web del supervisor [WEB_SUPERVISOR] — non da una fonte del
mio corpus letto; le uso come craft di riferimento, non come fatto verificato da me.

**Cosa vede l'utente nei primi 3 secondi (desktop e mobile):**

1. Un H1 forte e un sub onesti. Questo FUNZIONA: l'H1 *"Vedi il tuo software
   funzionare. Poi decidi."* è verbatim SSOT (claim risk-reversal) e comunica la
   grande idea in una frase. Tienilo.
2. Un Canvas 3D ambient di sfondo. Estetica coerente (grafite+bronzo) ma in
   competizione visiva con il testo (Nielsen #8 *Aesthetic and Minimalist*: "every
   extra unit of information competes with the relevant units and diminishes their
   relative visibility").
3. Due bottoni che portano L'OCCHIO E IL CLICK VIA dall'unica leva differenziante.
   La cosa che ci rende diversi — Padmin live — **non è visibile nei primi 3s**.

**Cosa disperde l'attenzione (le falle):**

- **F1 — La leva unica è sotto la piega.** Il differenziatore (interagire con
  Padmin) richiede uno scroll. Above-the-fold l'utente non sa nemmeno che esiste
  una chat. Stiamo "vincendo i primi 3s" con una sales-page classica e sprecando
  l'asset che la gente vuole: interagire.
- **F2 — Nessun message-match tra hero e azione.** L'H1 promette "vedi… poi
  decidi", ma l'azione offerta è "Vedi il processo" (un diagramma) o "Parliamone"
  (email). Manca il ponte verso il modo più veloce di *vedere*: chiedere a Padmin.
- **F3 — Doppia CTA pari-rango.** Due bottoni di peso simile = nessuna azione
  primaria chiara. La craft sales-page chiede UNA CTA primaria.
- **F4 — Empty-state chat passivo** (Nielsen #6 *Recognition rather than Recall*:
  "let people recognize information rather than forcing them to recall it").
  Anche chi scrolla fino a Padmin trova un campo vuoto e deve INVENTARE la domanda.
  Attrito alto proprio nel punto di conversione.
- **F5 — Hero a tutto schermo "spinge giù" tutto.** `min-h-screen` garantisce che
  niente di interattivo entri nel primo viewport. È una scelta che massimizza
  l'estetica e minimizza l'azione.

Scannabilità: buona sul testo (gerarchia tipografica chiara). Mobile: l'hero
centrato funziona, ma a tutto schermo spinge la chat ancora più lontana.

---

## 2. Struttura above-the-fold raccomandata

Principio: l'azione primaria above-the-fold NON è un bottone passivo, è **iniziare
a parlare con Padmin**. La chat (o un suo proxy interattivo) deve entrare nel primo
viewport accanto/sotto la headline, non dopo uno scroll.

### Opzione A — RACCOMANDATA: "hero conversazionale" (split headline + chat)

Above-the-fold in due colonne (desktop) / impilate (mobile-first):

- **Colonna sinistra (la promessa, scannabile in <3s):**
  - Label: `SOFTWAREHOUSE` (invariato).
  - **Headline (H1)**: *"Vedi il tuo software funzionare. Poi decidi."* —
    INVARIATA, verbatim SSOT.
  - **Subheadline**: *"Un MVP funzionante prima di firmare. Prezzi pubblici. Il
    rischio lo tiene il fornitore."* — INVARIATA, verbatim SSOT (hero_sub).
    [Variante da valutare: sostituire/aggiungere il gancio velocità *"Prima
    versione funzionante in 3-5 giorni."* — è SSOT verbatim (commercial-claims-public
    §Velocità). Da validare CEO se metterlo nel sub o come micro-trust-signal.]
  - **Un trust-signal compatto** (1 riga, non una sezione): es. *"Cantiere aperto,
    dati live · repository pubblici su GitHub"* — entrambi SSOT (§Cosa puoi
    verificare). Serve la "fiducia istantanea" della formula hero.

- **Colonna destra (l'azione = Padmin), il vero hero:**
  - Il **widget Padmin visibile subito**, o — se per perf/3D non sta nel viewport —
    un **proxy interattivo**: il campo input di Padmin con placeholder vivo + 3-4
    **prompt-seed cliccabili** (vedi §3). Cliccare un seed apre/popola la chat e
    invia: l'utente è già "dentro" a Padmin in un click.
  - Micro-copy sopra il campo, beneficio-prima-del-nome (regola SSOT stile):
    *"Chiedi prima di leggere."* — è già in SSOT i18n (padmin_section_title).

- **L'occhio (eye-flow):** label → H1 (peso massimo) → sub → trust-signal →
  prompt-seed/campo Padmin. La gerarchia visiva guida dalla promessa all'azione
  nello stesso schermo. Una sola azione primaria: scrivere/cliccare un seed a
  Padmin. Le CTA email/WhatsApp scendono nella CTA finale (#contatto), invariate.

- **3D**: ridurlo a sfondo discreto o rimuoverlo above-the-fold per non competere
  con la chat (Nielsen #8). Resta opzionale (P0-FC-3). [da validare CEO: il 3D è
  identità del sito — decidere se sacrificarlo nel primo viewport.]

### Opzione B — minimale (meno rischio tecnico)

Tenere l'hero attuale ma:
1. togliere `min-h-screen` → l'hero si dimensiona al contenuto, così la parte alta
   della sezione Padmin "spunta" nel primo viewport (peek che invita a scrollare);
2. CTA primaria hero diventa **"Chiedi a Padmin"** (anchor #padmin con focus sul
   campo), CTA secondaria "Parliamone";
3. aggiungere i prompt-seed nell'empty-state della chat (§3).

Tradeoff A vs B: A è la mossa CRO forte (azione nel primo viewport, sfrutta la
leva unica) ma tocca layout/3D/perf. B è low-risk, recupera F1/F3/F4 parzialmente
lasciando Padmin a metà piega. **Raccomando A** se il CEO accetta di ridurre il 3D
above-the-fold; **B** come ripiego se il 3D è intoccabile.

### Cosa TAGLIARE o spostare sotto la piega

- Spostare sotto la piega: il diagramma processo, l'offerta 3-card, LSO, demo,
  prezzi — già sono sotto, restano. Nessuna di queste compete col primo viewport.
- Tagliare dall'above-the-fold: la **doppia CTA pari-rango** (F3) → una sola
  primaria (Padmin). Il 3D pieno (F5) → ridotto o rimosso nel primo viewport.

---

## 3. Il ponte 3s → primo messaggio a Padmin

Obiettivo: azzerare l'attrito tra "ho letto l'headline" e "sto scrivendo a Padmin".
Fondamento: Nielsen #6 *Recognition rather than Recall* — offrire opzioni
riconoscibili invece di farle ricordare/inventare.

**Prompt-seed cliccabili (3-4 chip sopra/dentro il campo).** Cliccando, popolano e
inviano il messaggio a Padmin (handleSend già esiste in PadminChat). Proposte
ancorate a SSOT/discovery (tutte [da validare CEO] come copy esatto):

1. *"Quanto costerebbe rifare il mio gestionale?"* — aggancia prezzi pubblici (SSOT
   §Prezzi) e l'idea CEO "chiedile quanto costa il tuo gestionale".
2. *"Mandami lo screenshot del mio software e dimmi che ne pensi"* — sfrutta che
   Padmin legge immagini (FATTO, ImageAttach). Differenziatore fortissimo.
3. *"In quanti giorni vedo una prima versione?"* — aggancia il claim 3-5 giorni
   (SSOT §Velocità).
4. *"Cos'è il rischio-zero di cui parli?"* — aggancia risk-reversal (SSOT).

Micro-copy invito sopra i chip: *"Non sai da dove iniziare? Prova:"* [da validare CEO].

Riduzione attrito addizionale:
- Il primo messaggio di Padmin (assistant) potrebbe essere precaricato con un
  saluto + invito, invece dell'empty-state testuale. [da validare CEO + verifica
  backend: oggi l'empty-state è statico, non c'è greeting server-side.]
- Focus automatico sul campo quando la chat entra in viewport (no autofocus al
  load → eviterebbe scroll-jump mobile e problemi a11y; usare IntersectionObserver).

---

## 4. Desktop vs mobile, performance, a11y

**Mobile-first (priorità):**
- Impilare: headline+sub+trust (compatti) → poi SUBITO i prompt-seed + campo
  Padmin, così l'azione entra nel primo viewport mobile. Su mobile l'hero a tutto
  schermo è il nemico #1 dell'azione: ridurre l'altezza.
- I chip seed devono essere tap-target ≥44px, wrappabili su più righe.

**Performance (P0-FC-5, LCP<2s, no CLS):**
- Il widget Padmin è `'use client'` con SSE. Above-the-fold rischia di pesare su
  LCP. Mitigazioni: l'LCP element resta l'H1 (testo, server-rendered); il widget
  monta dopo idle. Il **proxy interattivo** dell'Opzione A (campo + chip statici
  server-rendered, chat che si "attiva" al primo input/click) tiene l'LCP sul
  testo e attiva il JS solo all'intento. Raccomandato per perf.
- CLS: PadminChat è già progettato no-CLS (scroll ancorato in fondo, commento
  righe 54-58). Riservare l'altezza del widget/proxy per evitare shift al mount.
- 3D: se ridotto, meno carico GPU above-the-fold (coerente P0-FC-5).

**A11y:**
- Chip seed = veri `<button>` con label esplicita, non div cliccabili.
- Mantenere l'empty-state testuale come fallback se i chip non montano (P0-FC-2).
- No autofocus aggressivo (vedi §3).
- Fallback senza env (AdvisorSlot): i chip diventano link a #contatto o testo —
  la pagina resta funzionante e onesta.

---

## 5. Acceptance / metriche

Riferimento: AARRR, *Activation* (`sources/mcclure-pirate-metrics-aarrr.txt`,
PRACTITIONER-ESSAY) — distingue acquisition (arrivano) da activation (compiono la
prima azione di valore). Qui la **prima azione di valore = primo messaggio a
Padmin**, NON lo scroll.

North-star locale proposto: **% di visitatori /softwarehouse che inviano ≥1
messaggio a Padmin** (activation rate). È la metrica che incarna "la gente vuole
interagire" e non è vanity (non conta i bounce né i meri scroll).

Metriche di supporto:
- **5-second test** (craft): mostrare l'above-the-fold 5s, poi chiedere "cosa fa
  questo studio? cosa puoi farci ORA?". Target: la maggioranza nomina (a) vedere
  il software prima di pagare e (b) che si può chiedere/scrivere a Padmin.
- **Time-to-first-message**: secondi dal load al primo invio a Padmin (più basso
  = ponte migliore).
- **Click-rate sui prompt-seed**: quanti partono da un chip vs digitano da zero
  (misura se i seed riducono attrito — F4).
- **Scroll-depth** come diagnostica: se l'activation sale ma lo scroll-depth oltre
  l'hero scende, va bene (l'azione avviene prima dello scroll = obiettivo).

Tradeoff metrico (cosa incentiva): ottimizzare l'activation-Padmin potrebbe
gonfiare messaggi "di prova" a basso intento. Mitigare guardando in coppia con la
qualità (es. % conversazioni che chiedono prezzo/screenshot — alto intento) per non
inseguire una vanity metric travestita.

[Vincolo tecnico FATTO: static export S3+CloudFront → niente analytics server-side
nativo. La strumentazione richiede un analytics client-side o eventi verso il
backend Nexus. Da decidere come misuriamo — vedi §6.]

---

## 6. Decisioni da confermare al CEO

1. **Opzione A vs B** (hero conversazionale split vs hero attuale alleggerito).
2. **Sorte del 3D above-the-fold** (ridurlo/rimuoverlo nel primo viewport sì/no) —
   tocca l'identità del sito, è decisione del CEO.
3. **Copy nuovo** segnato [da validare CEO]: i 4 prompt-seed, il micro-invito,
   l'eventuale gancio velocità "3-5 giorni" nel sub. Verbatim SSOT dove possibile;
   ogni variazione la approva il CEO (P0-FC-6).
4. **Greeting precaricato di Padmin** sì/no (richiede anche verifica backend Nexus).
5. **Come misurare** l'activation su static export (analytics client-side vs eventi
   al backend Nexus) — sblocca tutto §5.

---

## 7. Prossimo passo (la verifica che sblocca di più)

Decidere **Opzione A vs B** e la **sorte del 3D above-the-fold**. È il bivio da cui
dipende tutto il resto (layout, perf, quali copy servono). Senza questo, ogni
proposta di copy o metrica resta sospesa.

---

## Fonti citate

- `sources/nielsen-10-usability-heuristics.md` §8 *Aesthetic and Minimalist Design*
  / §6 *Recognition rather than Recall* — PRACTITIONER-ESSAY (NN/g, non
  peer-reviewed). Quote: "every extra unit of information in an interface competes
  with the relevant units… and diminishes their relative visibility"; "Let people
  recognize information in the interface, rather than forcing them to remember it".
- `sources/mcclure-pirate-metrics-aarrr.txt` §Activation — PRACTITIONER-ESSAY
  (Dave McClure). Base per distinguere acquisition da activation (prima azione di
  valore = messaggio a Padmin).
- SSOT contenuti (verbatim): `FABIOCHERICI-DOC/docs/ssot/commercial-claims-public.md`
  §"Chi è Fabio Cherici" (risk-reversal, "vedi prima, decidi dopo"), §"Velocità"
  (3-5 giorni, ~2x mercato), §"Prezzi pubblici", §"Cosa puoi verificare" (GitHub +
  cantiere live), §"Come deve comportarsi l'operatore" (beneficio prima del nome,
  chiudi con CTA).
- i18n verificato: `messages/it.json` hero_title (324), hero_sub (379),
  padmin_section_title (435), empty_prompt (1035).

---

## UNCERTAINTY FLAGS

- [SSOT_TRUST] L'intera craft "above-the-fold" (NN/g, AARRR) è practitioner-essay,
  non peer-reviewed. È euristica/opinione di settore, non legge dimostrata.
- [WEB_SUPERVISOR] Le soglie quantitative (50ms prima impressione, 3-6s decisione,
  84% attenzione above-the-fold, +50% conv. da design pulito, 2-5x) vengono dalla
  ricerca web del supervisor, NON da una fonte del mio corpus letto. Da trattare
  come riferimento di craft, non come fatto da me verificato.
- [NOT_FOUND≠NOT_EXIST] Le 8 skill granulari product-analysis NON sono presenti sul
  filesystem (solo il SKILL.md router esiste; nessun SOURCE_MAP.md per granulare).
  Ho fatto grounding direttamente sulle fonti del corpus. Una skill
  competitive-teardown/product-metrics dedicata non era leggibile.
- [MY_INFERENCE] Eye-flow, peso CTA, e l'impatto LCP del widget above-the-fold sono
  inferenze di design dal codice letto, non misurati. Vanno validati col 5-second
  test e con LCP reale post-implementazione.
- [PARTIAL_READ] Di mcclure-pirate-metrics ho letto le prime ~60 righe (acquisition
  + inizio activation), sufficienti per il claim usato; non l'intero documento.
