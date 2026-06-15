# M-017 — Design Widget Pubblico "Padmin" (Nexus)

> Design doc (NON codice) — advisor frontend/UX. Progetta la "faccia" nel sito
> dell'operatore AI Padmin (responsabile tecnica dello studio), che gira come
> servizio SSE su host dedicato (futuro: nexus.fabiocherici.com).
> Stack: Next.js 15 App Router (output:export → S3/CloudFront), React 19,
> next-intl 7 lingue, grafite #111 + bronzo #C8A96E.
> Procedura: ORIENTA → GROUNDA → PROPONI. Tutte le scelte portanti citano la fonte letta.
> Autore advisor: engineer-frontend-ux · Data: 2026-06-15

---

## 0. Grounding — fonti lette

**Fonti di progetto (territorio del sito):**
- `EGI/resources/views/components/ai-sidebar.blade.php` — modello UX (header brand, chat stream sempre visibile, suggestion chips, input form, mobile accordion, FAB toggle, z-index sopra tutto).
- `EGI/resources/js/free-ai-chat.js` — **consumer SSE reale** da imitare nel ritmo: `state` con `remaining/limit/isStreaming`, fetch POST `Accept: text/event-stream`, parsing `event:`/`data:` riga per riga, typing indicator rimosso al primo chunk, autosize input (max 120px), Enter invia / Shift+Enter newline, contatore con badge verde/giallo/rosso, showcase carousel su `/free-ai/hyper-egis` con timer 5s + fade, swipe-to-close drawer mobile, `escapeHtml` + `renderMarkdown` manuale (no librerie).
- `fabiocherici.com/app/globals.css` — token grafite/bronzo (`--bg #111`, `--accent #C8A96E`, `--accent-hover`, `--accent-muted`, `--accent-glow`, `--surface-glass`, `--text-*`, `--border*`), tema dark/light/ambient (8 slot), `.reveal` progressive-enhancement (testo visibile di default), focus ring `:focus-visible 2px var(--accent)`, blocco `@media (prefers-reduced-motion: reduce)` già presente.
- `fabiocherici.com/components/softwarehouse/AdvisorSlot.tsx` — **slot già predisposto** (M-016): oggi rende copy onesto + CTA; commento di innesto v2 prevede `NEXT_PUBLIC_ADVISOR_CHAT_ENDPOINT` valutata a build-time → "setti env e rebuildi, zero refactor della pagina".
- `softwarehouse/page.tsx:262` — `<AdvisorSlot demoCaption ctaLabel />` montato dopo `lso_closing`, prima di `SectionCta href="#demo"`.
- `messages/it.json:423` — chiavi `lso_demo_caption`, `lso_chat_cta` già in 7 lingue.

**Fonti del corpus (norma/pratica/doc):**
- `sources/web-accessibility-wcag/w3c-aria-apg-dialog-modal-pattern.txt` — Dialog (Modal) Pattern APG [W3C-WAI, norma].
- `sources/web-accessibility-wcag/mdn-aria.txt §61` — Live regions [MDN, riferimento piattaforma].
- `sources/web-performance-core-vitals/web-dev-cls-cumulative-layout-shift.txt §37, §90-97` — cause CLS + transform vs layout props [web.dev, pratica/metrica].
- `sources/web-performance-core-vitals/web-dev-inp-interaction-to-next-paint.txt §36-38, §56-58` — feedback al next-paint, input delay da long task [web.dev].
- `sources/ux-interaction-design/nng-error-message-guidelines.txt §15, §37-41, §47` — error message design [NN/g, pratica UX].
- `sources/ux-interaction-design/nng-ten-usability-heuristics.txt §30-37` — Visibility of System Status [NN/g].
- `sources/frontend-state-data-forms/mdn-client-side-form-validation.txt §16-18, §36` — client = UX, server = trust, mai fidarsi del client [MDN].

---

## 1. Design / opzioni ordinate

### 1.1 Collocazione — RACCOMANDO (a) sezione embeddata in /softwarehouse, con upgrade futuro a (b)

Tre opzioni dal CEO:

| Opzione | Razionale | Fonte |
|---|---|---|
| **(a) Sezione embeddata in /softwarehouse — RACCOMANDATA** | È esattamente dove vive già `AdvisorSlot` (`page.tsx:262`) e per cui il sito è progettato (innesto via env, zero refactor). La chat è il *climax narrativo* della pagina LSO ("la mente interrogabile") — appare nel contesto che la spiega. Non è una modale: è contenuto. Coerente con P0-FC-2 (testo prima di tutto). | `AdvisorSlot.tsx` commento innesto v2; principio "prefer the platform / SSR-for-indexable-content" router SKILL.md |
| (b) Pagina dedicata full-page stile free-ai | Migliore per sessioni lunghe e per imitare 1:1 EGI free-ai (layout a colonne: sidebar conversazioni + chat + showcase). Da tenere come **fase 2** quando la chat è validata: `/softwarehouse/nexus` o `/nexus`. Richiede una route in più e duplica il chrome. | `free-ai-chat.js` layout a colonne |
| (c) Launcher fluttuante site-wide (FAB) | È il pattern `ai-sidebar.blade.php` (FAB bottom-right z-1010 → drawer). Massima accessibilità da ogni pagina, MA: (1) il widget diventa modale persistente → footgun A11Y (focus trap su ogni pagina), (2) carica JS chat ovunque → costo INP/bundle su pagine che non lo usano, (3) dissona con l'estetica sobria del sito (il cerchio home, la quiete grafite). Sconsigliato per il go-live. | costo JS → INP `web-dev-inp §58` |

**Raccomandazione:** parti con **(a)** — la sezione embeddata che il sito già aspetta. Il bottone "apri chat a tutto schermo" dentro la sezione può aprire **(b)** come progressive upgrade in fase 2. NON (c) al go-live: la decisione FAB site-wide la valuta il CEO separatamente.

### 1.2 Layout (gerarchia: CHAT > VETRINA > TICKER)

La gerarchia richiesta dal CEO è chiara: **chat protagonista**, vetrina = proof-of-work secondaria, ticker = atmosfera. Il layout la rende fisicamente.

**Desktop (≥1024px) — griglia 2 colonne dentro la sezione:**
```
┌─────────────────────────────────────────────────────────┐
│  [Header sezione: "Parla con Padmin" + sottotitolo]       │
├──────────────────────────────┬──────────────────────────┤
│  COLONNA CHAT (≈62%)          │  COLONNA PROVA (≈38%)     │
│  ┌────────────────────────┐   │  ┌──────────────────┐    │
│  │ Padmin · responsabile  │   │  │ VETRINA EGI      │    │
│  │ tecnica  [avatar "P"]  │   │  │ (carosello prova)│    │
│  ├────────────────────────┤   │  │ img + titolo +   │    │
│  │ chat log (aria-live)   │   │  │ "apri su EGI →"  │    │
│  │  bolle U / AI          │   │  └──────────────────┘    │
│  │  typing indicator      │   │  ┌──────────────────┐    │
│  ├────────────────────────┤   │  │ TICKER pillole   │    │
│  │ [📎] input autosize [↑]│   │  │ Oracode/LSO →    │    │
│  │ contatore 50/g         │   │  └──────────────────┘    │
│  └────────────────────────┘   │                          │
└──────────────────────────────┴──────────────────────────┘
```
Griglia CSS: `grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr)` — grid per lo scheletro 2D, flexbox dentro ogni colonna (combinazione raccomandata da SKILL.md cross-cutting). La colonna chat ha `min-width:0` per non far traboccare le bolle.

**Mobile (<768px) — stack verticale, drawer per la vetrina:**
- Ordine: header → **chat a piena larghezza** (protagonista) → ticker compatto sotto l'input → vetrina collassata in un **drawer/accordion** ("Guarda l'ecosistema vivo →") che si apre da un bottone. Stesso principio dell'accordion mobile di `ai-sidebar.blade.php` (`#ai-msg-body.mobile-open max-height`). Niente swipe-only: il bottone è la via primaria (lo swipe-to-close di `free-ai-chat.js` è enhancement, non l'unico accesso).
- Niente FAB: la sezione è inline, scrollabile, leggibile.

### 1.3 Come si presenta Padmin (professionale, non "fidanzata")

- **Avatar:** monogramma "P" in un cerchio bronzo (`var(--accent-glow)` bg, `var(--accent)` lettera) — esattamente il pattern di `free-ai-chat.js` (`fai-msg__avatar` = "F"). NESSUN volto, nessun corpo, nessuna foto. L'avatar è una sigla tipografica nel font display.
- **Nome + ruolo:** "Padmin — responsabile tecnica dello studio" (chiave i18n). La presentazione è funzionale: dichiara *cosa fa* (risponde fondata sui documenti del progetto), non *chi è* in senso affettivo.
- **Voce:** tono tecnico-asciutto già definito dai contenuti (`lso_demo_caption`: "scambio reale con la mente interrogabile"). Le *risposte* di Padmin sono multilingua lato LLM; qui parliamo solo del chrome.
- **Disclosure onestà (Oracode):** una riga sotto l'header — "Padmin è un'AI. Le risposte sono fondate sui documenti del progetto." — visibile, non nascosta. Questo è anche match-real-world (Heuristic #2) e protegge dal claim inventato (P0-FC-6).

---

## 2. Feature — design di dettaglio

### 2.1 Chat con Padmin (streaming SSE)

**Contratto SSE da rispettare** (dal CEO): `POST /chat` JSON `{message, session_id, conversation_history[], image?}`; eventi `start {session_id, rag_chunks}` · `chunk {content}` · `complete {usage}` · `error {message, code}`. Nota: il contratto eventi differisce da `free-ai-chat.js` (che usa `conversation_id`/`memory_saved`/`done`) — **imitare il RITMO di parsing, non i nomi degli eventi**. Il consumer React deve mappare i 4 eventi del nuovo contratto.

UX (grounded sul ritmo di `free-ai-chat.js` + INP):
- **Feedback immediato al next-paint** — appena l'utente invia: bolla utente appesa subito, input svuotato, send disabilitato, typing indicator mostrato *prima* della risposta di rete. INP misura "il tempo che blocca il prossimo paint", e l'intento è dare feedback iniziale immediato che "qualcosa sta succedendo" — `web-dev-inp §37-38`. Il typing indicator È quel feedback.
- **Streaming** — su evento `chunk` appendere `content` al testo della bolla AI e renderizzare markdown. La bolla AI cresce *in fondo*, ancorata: lo scroll segue il fondo (`scrollToBottom`), il contenuto **sopra non si sposta** → no CLS. (Caso "lista che cresce e spinge il contenuto" = anti-pattern CLS, `web-dev-cls §77-78`; qui evitato perché lo stream è l'ultimo elemento.)
- **Long task / main thread** — il parsing SSE + render markdown ad ogni chunk può accumulare lavoro sul main thread e alzare INP (input delay da long task, `web-dev-inp §58`). Mitigazione di design: throttle del re-render markdown (es. ogni N chunk o via `requestAnimationFrame`), non re-parsare l'intero testo ad ogni singolo carattere. Da dimensionare con engineer-construction in fase di build.
- **Input:** textarea autosize (max ~120px come free-ai), Enter invia / Shift+Enter newline, send disabilitato se vuoto o `isStreaming` o `remaining<=0`.
- **Contatore guest 50/g:** badge numerico (verde >50%, giallo >20%, rosso) + testo "/50 messaggi rimanenti" (i18n). Rate-limit È server-side (HTTP 429 → messaggio "limite raggiunto"); il contatore client è solo *visibilità di stato* (Heuristic #1 `nng-heuristics §31`), NON sicurezza.
- **Errori:** evento `error {message, code}` e fetch fallita → bolla errore che NON incolpa l'utente, descrive cosa fare ("Si è verificato un problema. Riprova."), e **preserva l'input** se possibile (`nng-error-message §41, §47`). Mai mostrare `code` raw all'utente (jargon — `§37`); il code va a ULM, non in faccia. Vedi §4 UEM.

### 2.2 Upload immagini (jpeg/png — MAI pdf)

- **Pulsante allega** (📎 bronzo) accanto all'input → apre file picker `accept="image/jpeg,image/png"`.
- **Validazione client (UX, NON sicurezza):** tipo MIME ∈ {jpeg,png}, dimensione max (proporre 5 MB — **da confermare CEO/backend**), una immagine per messaggio. La validazione client "cattura subito l'errore senza round-trip al server" ed è un'iniziale checked di UX — `mdn-client-side-validation §16-17`. MA: **mai fidarsi del client** — il backend DEVE ri-validare tipo/dimensione/contenuto, la richiesta di rete è alterabile (`§18, §36`). → engineer-security (§6).
- **Anteprima thumbnail:** `<img>` con `width`/`height` espliciti (o aspect-ratio fisso) per riservare lo spazio → no CLS quando la thumbnail carica (`web-dev-cls §37`: immagini con dimensioni ignote = causa CLS). Bottone "rimuovi" sulla thumbnail.
- **Stato:** mentre l'immagine è allegata, chip visibile sopra l'input ("screenshot.png ✕"). Errore di validazione → messaggio inline costruttivo ("Solo JPG o PNG, max 5 MB" — non "file invalido", `nng-error §41`).
- **Invio:** l'immagine va nel campo `image?` del payload `/chat` (base64 o multipart — **da confermare con backend**; il contratto dice `image?` ma non il formato → REGOLA ZERO, vedi UNCERTAINTY).

### 2.3 Vetrina EGI come PROVA (proof-of-work, secondaria)

- **Inquadramento:** header della vetrina = "L'ecosistema vivo che abbiamo costruito" (i18n) — NON "opere in vendita". Carosello immagine + titolo + creator, click → sito EGI live (`target="_blank" rel="noopener noreferrer"`, come `free-ai-chat.js`).
- **Dati:** endpoint EGI cross-origin, pattern `/free-ai/hyper-egis` (ritorna `{egis:[{image_url,title,creator_name,share_url}]}`). **Dipendenza dati = CORS.** Due opzioni:
  1. **CORS diretto** dal browser all'endpoint EGI (richiede header CORS lato EGI per il dominio fabiocherici.com) — più semplice, ma espone l'endpoint e dipende da config EGI.
  2. **Proxy via operatore Nexus** (l'host Padmin espone es. `/showcase` che fa da proxy a EGI) — un solo origin da gestire in CORS, l'endpoint EGI resta privato. **RACCOMANDATO** perché Nexus è già un origin di cui controlliamo i CORS al go-live, e accentra la superficie pubblica.
- **Animazione carosello:** fade ogni 5s (come free-ai) MA con `transform`/`opacity` (compositor-friendly, no layout shift — `web-dev-cls §94-97`) e **fermo sotto `prefers-reduced-motion: reduce`** (mostra una sola slide statica, come fa già `globals.css` per `.navbar-quotes`).
- **Immagini:** `width`/`height` o aspect-ratio fissi → no CLS (`web-dev-cls §37`). `loading` eager solo per la prima slide visibile, lazy per le altre.
- **Degrado:** se l'endpoint fallisce/CORS non pronto → la vetrina si nasconde silenziosamente (come `free-ai-chat.js` `el.showcase.style.display='none'`). La chat resta. Errore loggato a ULM, non mostrato.

### 2.4 Ticker "pillole di saggezza" Oracode/LSO

- **Sorgente — RACCOMANDO set curato in i18n**, NON endpoint. Motivo: (1) sono frasi VERE dal paradigma Oracode/LSO da SSOT (P0-FC-6), curate e stabili, non user-generated; (2) devono essere in 7 lingue (P0-FC-4) → naturale come array di chiavi i18n; (3) zero dipendenza di rete, zero CORS, zero superficie pubblica in più; (4) il sito ha già il pattern `.navbar-quotes` con array di quote in CSS/i18n. Le pillole vengono dagli SSOT Oracode — il CEO/scrittore le cura, non l'AI le inventa.
- **Animazione:** scroll/crossfade CSS-only riusando il pattern `quote-crossfade` già in `globals.css §577`. **Obbligatorio** rispetto `prefers-reduced-motion`: già gestito in `globals.css §673-678` (`.navbar-quotes span { animation:none }` + primo visibile). Se ticker scorrevole orizzontale → `transform: translateX` animato (compositor, no layout shift — `web-dev-cls §97`), e sotto reduced-motion diventa lista statica/prima frase. Marquee mai con JS che muove `left` (causa CLS/INP).
- **A11Y:** il ticker è decorativo/atmosferico → `aria-hidden="true"` sul carosello animato OPPURE, se le pillole hanno valore informativo, un `role="region"` con `aria-label` e le frasi leggibili (ma NON aria-live: non sono aggiornamenti, lo spam allo screen reader sarebbe rumore — `mdn-aria §61-62`).

---

## 3. Componenti React da creare (proposta)

Tutti client component (`'use client'`), montati dentro/al posto di `AdvisorSlot` quando `NEXT_PUBLIC_ADVISOR_CHAT_ENDPOINT` è definita (innesto v2 già previsto in `AdvisorSlot.tsx`). Stringhe TUTTE via `useTranslations()` (P0-FC-4).

| Componente | Responsabilità | Note |
|---|---|---|
| `NexusWidget.tsx` | Contenitore della sezione: griglia 2-col desktop / stack mobile, orchestrazione layout chat+vetrina+ticker | Riceve `endpoint`, `locale` |
| `PadminChat.tsx` | Stato chat (messages, isStreaming, remaining), invio, consumer SSE, render bolle, contatore | `useState` per stato locale; deriva `canSend` da stato (no stato ridondante) |
| `useNexusStream.ts` (hook) | Parsing SSE dei 4 eventi `start/chunk/complete/error`, cleanup su unmount | Isola la logica di rete; throttle render markdown |
| `ChatMessage.tsx` | Bolla singola (user/ai/error) + avatar "P" + copy button | markdown sanitizzato → vedi §6 security |
| `ChatInput.tsx` | Textarea autosize + Enter/Shift+Enter + allega + send | |
| `ImageAttach.tsx` | File picker, validazione client tipo/size, thumbnail con width/height, chip rimuovi | validazione = UX, server ri-valida |
| `EgiShowcase.tsx` | Carosello prova, fetch (proxy Nexus), fade transform, reduced-motion safe, hide-on-error | `role="region"` aria-label |
| `WisdomTicker.tsx` | Pillole da i18n, crossfade CSS, reduced-motion safe | `aria-hidden` se decorativo |

**Semplicità Potenziante:** nessuna libreria nuova pesante. Markdown renderizzato a mano come free-ai (no `react-markdown` se basta il subset) OPPURE — se serve robustezza/sicurezza — una lib di sanitizzazione: **decisione da engineer-security** (§6), non aggiungere di default. Niente state manager esterno: lo stato chat è locale al widget, derivato non duplicato (router SKILL "derive-don't-duplicate").

---

## 4. Frontend/UX by-design (mappa ai pilastri)

- **A11Y (WCAG 2.1 AA target Oracode; corpus 2.2):**
  - **Chat log = live region.** Il log della chat è contenuto che si aggiorna dinamicamente → live region `aria-live="polite"` (annuncia senza interrompere) sul container del log, così lo screen reader annuncia le risposte di Padmin. Live regions "suggeriscono allo screen reader come gestire i cambiamenti del contenuto" — `mdn-aria §61-62`. NON `assertive` (interromperebbe). Lo streaming chunk-by-chunk va annunciato a risposta completa, non per carattere (altrimenti spam) — annuncia su `complete`.
  - **Se in fase 2 la chat diventa full-screen/modale (opzione b/c):** applicare il **Dialog (Modal) Pattern APG** — `role="dialog"` + `aria-modal="true"` + `aria-labelledby` sul titolo; focus iniziale dentro il dialog; **focus trap** (Tab/Shift+Tab non escono); **Escape chiude**; al chiudere **focus torna al trigger** — `w3c-aria-apg-dialog-modal §11, §21, §29, §42, §51-56`. Il drawer mobile della vetrina, se modale, idem. (Nella sezione embeddata (a) NON serve dialog: è contenuto inline.)
  - Contrasto: testo `--text-primary #f0ebe3` su `--bg #111` ≈ ratio alto (ok ≥4.5:1); **attenzione al bronzo `--accent #C8A96E` su scuro per il TESTO** — va verificato ≥4.5:1 (bronzo come testo piccolo è borderline); per UI/bordi serve ≥3:1. Usare bronzo per accenti/bordi/icone, testo corrente in `--text-primary`. → da verificare in fase build.
  - Tastiera completa: invio, allega, rimuovi thumbnail, link vetrina, navigazione carosello — tutto raggiungibile da tastiera; focus ring già globale (`globals.css §272`).
  - Alt: thumbnail upload alt = nome file; immagini vetrina alt = "titolo — creator" (come free-ai `§330`).
  - **Nota bump 2.2 = decisione CEO:** target-size 24px (SC 2.5.8) sui bottoni piccoli (copy, rimuovi, frecce carosello) e focus-not-obscured (SC 2.4.11) se compaiono sticky/overlay — criteri NUOVI in 2.2. Il sito ha già `globals.css` orientato a buona A11Y; allinearsi a 2.2 su questi due è facile ma è **decisione CEO** (il target Oracode è 2.1 AA).

- **SEO:** la sezione è in /softwarehouse, pagina pubblica indicizzabile. La chat è interattiva (CSR client component, niente da indicizzare nel log) MA **il chrome statico** (header "Parla con Padmin", disclosure, copy della vetrina, fallback) deve restare nell'HTML server-rendered → P0-FC-2 garantisce già "leggibile senza JS". NON nascondere il contenuto indicizzabile dietro JS. CWV entro budget (sotto).

- **Web-Quality-Gate:** la sezione deve passare il gate (A11Y/SEO/CWV) prima del push — coerente con quanto sopra. Il funzionamento del gate in pipeline → engineer-construction (§6).

- **i18n (P0-2/P0-9):** ZERO stringhe hardcoded (P0-FC-4). Tutte in 7 lingue dal primo commit (lista in §sintesi). Le pillole ticker = chiavi i18n. Le risposte LLM sono multilingua lato backend (passare `locale`).

- **Semplicità Potenziante:** stato locale derivato non duplicato; nessuna lib pesante non motivata; markdown subset come free-ai; carosello/ticker CSS-only riusando pattern esistenti (`quote-crossfade`, `.reveal`).

- **UEM / ULM:** errori chat/upload/vetrina → gestore centralizzato (UEM), MAI try/catch isolati che muoiono in console. All'utente messaggio i18n costruttivo (NN/g `§37-41`); il dettaglio tecnico (`code`, stack) → ULM, **GDPR-aware: mai PII nei log** (il testo utente e l'immagine possono contenere dati personali → NON loggarli).

- **P0-FC specifici:** P0-FC-1 (se GSAP per micro-animazioni → solo dynamic import in useEffect — ma per ticker/carosello CSS basta, evitiamo GSAP); P0-FC-2 (degrado senza JS, §5); P0-FC-5 (LCP<2s, no layout shift — rispettato da dimensioni media + transform).

---

## 5. Degrado senza JS (P0-FC-2)

Chi non ha JS NON deve vedere un buco. Server-rendered fallback (è ciò che fa oggi `AdvisorSlot`):
- **Header + disclosure** "Parla con Padmin, responsabile tecnica" — testo statico, sempre presente.
- **Copy onesto** (oggi `lso_demo_caption`) + **CTA "Provala in chiamata"** (`lso_chat_cta`, link `#contatto`) — il fallback attuale resta come degradazione.
- **Vetrina:** o lista statica di link (se SSG con dati al build), o nascosta — la sezione non collassa.
- **Ticker:** prima pillola statica visibile (come `.navbar-quotes span:first-child { opacity:1 }` sotto reduced-motion).
La chat interattiva è un *enhancement* sopra questo fallback. `<noscript>` opzionale che esplicita "la chat richiede JavaScript; scrivici a [contatto]".

---

## 6. Confini di collaborazione

- **engineer-security (PRIORITARIO — superficie pubblica):**
  - **XSS nel render markdown** delle risposte AI: `free-ai-chat.js` usa `innerHTML` con markdown manuale — in React `dangerouslySetInnerHTML` è il footgun equivalente. Le risposte di Padmin sono testo da un LLM (non fidato) → sanitizzazione obbligatoria. Scelta lib sanitizzazione / approccio = security.
  - **Upload immagini:** validazione SERVER (tipo/dimensione/contenuto reale, non solo MIME dichiarato), limiti, anti-abuse. La validazione client è solo UX (`mdn-client-side-validation §18`).
  - **CSP** per la nuova superficie (connect-src verso nexus.fabiocherici.com, img-src verso CDN EGI), CORS al go-live.
  - Rate-limit 50/g, anti-spam, dimensione payload.
- **engineer-construction:** build/test del widget, bundle splitting (chat caricata solo dove serve), wiring CWV nel Web-Quality-Gate in pipeline, throttle render SSE in pratica, env `NEXT_PUBLIC_ADVISOR_CHAT_ENDPOINT` e tunnel dev → box.
- **engineer-product:** validazione del flusso (la chat converte? la vetrina come proof funziona?), metriche di prodotto, copy onesto vs persuasivo. La discovery del valore è sua.

---

## 7. Decisioni da confermare al CEO

1. **Collocazione:** confermo (a) sezione embeddata in /softwarehouse per il go-live, (b) full-page come fase 2, NO (c) FAB site-wide al go-live? (decisione architetturale).
2. **Sorgente vetrina:** proxy via Nexus (raccomandato) vs CORS diretto a EGI? (tocca CORS/superficie pubblica).
3. **Sorgente ticker:** set curato in i18n da SSOT Oracode (raccomandato) — chi cura le frasi e in quali 7 lingue? (P0-FC-6: da SSOT, non inventate).
4. **Formato immagine** nel payload `/chat` (`image?`): base64 inline o multipart? Limite dimensione (proposta 5 MB)? (contratto da chiarire col backend).
5. **Bump WCAG 2.2** sui criteri nuovi (target-size 24px, focus-not-obscured) o restiamo a 2.1 AA? (decisione livello A11Y = CEO).
6. **Presentazione Padmin:** monogramma "P" + "responsabile tecnica" + disclosure "è un'AI" — confermi tono/nome? (contenuto da SSOT, P0-FC-6).

---

## 8. Prossimo passo

**Sbloccante n.1:** confermare il **contratto immagine** (#4) e il **proxy vetrina** (#2) con il backend/Nexus, perché definiscono la superficie pubblica che engineer-security deve poi blindare e da cui dipende metà dei componenti (`ImageAttach`, `EgiShowcase`). Senza questi due la chat di base (`PadminChat` + SSE testo) è comunque progettabile e implementabile subito — è il MVP del widget.

---

## UNCERTAINTY FLAGS

- [MY_INFERENCE] Le proporzioni layout (62/38, max 5 MB, throttle "ogni N chunk") sono proposte di design, non vincoli letti da fonte — da tarare con engineer-construction/CEO.
- [NOT_FOUND≠NOT_EXIST] Non ho trovato una view `EGI/resources/views/free-ai/` (citata dal CEO come "se presente") né l'ho cercata esaustivamente; ho basato il ritmo UX su `free-ai-chat.js` + `ai-sidebar.blade.php`, che bastano. Se la view free-ai esiste può aggiungere dettagli di layout full-page (fase 2).
- [SSOT_TRUST] Il contratto SSE (`start/chunk/complete/error`) e il payload (`image?`) provengono dal brief CEO, non li ho verificati sull'host Nexus (non accessibile da qui) — REGOLA ZERO: il formato di `image?` resta da confermare (#4, #8).
- [PARTIAL_READ] Ho letto le fonti corpus per grep mirato (CLS/INP/error/aria/validation) e i file di progetto chiave; non ho riletto integralmente le 28 fonti del corpus né tutti i 7 messages/*.json (verificato solo it.json per le chiavi esistenti).
- [MY_INFERENCE] Il contrasto bronzo `#C8A96E` su `#111` come TESTO è segnalato come "da verificare ≥4.5:1" — non ho eseguito il calcolo del ratio (serve tool/build); l'ho marcato come check, non come fatto.
