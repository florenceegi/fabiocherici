---
title: SSOT Commerciale — claim citabili, vietati, narrativa softwarehouse
ssot_id: commercial-claims
slug: commercial-claims
organ: fabiocherici.com
doc_type: content-ssot
version: 1.4.0
status: current
date: '2026-06-11'
last_sync: '2026-06-20'
author: Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
scope:
- fabiocherici.com
- softwarehouse
priority: critical
visibility: internal
---

# SSOT Commerciale — fabiocherici.com/softwarehouse

> Fonte unica per OGNI claim commerciale del sito (P0-FC-6).
> Origine: decisioni CEO nel brainstorm del 2026-06-11 (sessione discovery con
> engineer-product ×2 + ricognizioni tecniche) + contenuti già in produzione
> (messages/it.json namespace `softwarehouse`, M-008).
> Regola: ciò che non è in questo documento NON va in pagina. Ciò che è
> "vietato" qui non va in pagina MAI, nemmeno riformulato.

---

## 1. Tesi della pagina (narrativa approvata)

**Atto 1 — Risk-reversal:** "Vedi prima, decidi dopo." Il cliente vede un MVP
funzionante prima di firmare. Prezzi pubblici. Il rischio lo tiene il fornitore.

**Atto 2 — Oracode Nexus, il protagonista:** il sistema operativo proprietario
di costruzione. NON si vende il sistema: si vende ciò che GENERA — un tipo di
software nuovo, il **LSO (Living Software Organism)** [in pagina: inglese con
traduzione sotto: "Organismo Software Vivente"]. Il cliente riceve un LSO.

**Gerarchia narrativa (decisione CEO):** Oracode Nexus prevalente; LSO è il
risultato/deliverable. Niente formule o equazioni (la formula "QUALITÀ
ENTERPRISE × ORACODE = LSO" è ELIMINATA).

**Regola jargon:** termine proprietario SOLO DOPO il beneficio spiegato in
parole del cliente. Mai LSO/Oracode Nexus/SSOT/RAG come apertura.

## 2. Le 3 linee d'offerta (in pagina: 3 card)

| # | Linea | Prezzo | Note |
|---|---|---|---|
| 1 | Software su misura (LSO) | Fasce pubbliche ATTUALI (messages/it.json `pricing_*`) — INVARIATE | MVP prima della firma, processo 5 fasi |
| 2 | Siti web "seri" / esemplare unico | Nessun prezzo nuovo pubblicato (il €10k era un esempio, NON è claim) | Unicità certificata EGI-Sigillo; demo live |
| 3 | Redesign a scala — "il tuo sito, già rifatto" | 70-80% del prezzo di mercato (decisione CEO su parere esperto; NON 50%). **Parametro INTERNO di pricing per outreach — NON è claim da pubblicare in pagina** (coerenza con Vietato #3) | Demo privata + outreach diretto; protocollo demo §6 |

## 3. Claim CITABILI (con fonte e frame obbligatorio)

| Claim | Fonte | Frame obbligatorio |
|---|---|---|
| ~2,2M righe nette / ~2.233 ore tracciate / ~24 progetti | EGI-STAT (tracker interno) | SOLO dentro "cantiere aperto"; ore/attività protagoniste, righe SECONDARIE; mai LOC-first |
| Verificabile su GitHub (repo pubblici) | github.com (org) | "Non credermi: guarda i commit" |
| Cantiere aperto con dati LIVE | endpoint EGI-STAT `https://stat.florenceegi.com/api/public/site-stats` — COSTRUITO e consumato in pagina (M-015, `components/softwarehouse/LiveSiteStats.tsx`, verificato live; vincolo CEO rispettato: live dal giorno 1, NESSUN placeholder) | demo del deliverable: "quando lavori con me ricevi questa trasparenza" |
| Processo 5 fasi: MVP prima della firma, caparra-custodia, fino a 3 MVP | SSOT esistente: messages/it.json `process_*` (M-008) — sancito, non si rinegozia | promosso a protagonista atto 1 |
| Rebrand sito verticale in <48h (fatto: GialloOro→IdealOro <2h) | repo IDEALORO-PREVIEW | come capacità, MAI ore accanto a prezzi |
| Sito completo ~12,5h (Le Vespe v1) | EGI-STAT | SOLO uso interno/cantiere; MAI accanto a prezzi |
| EGI-Sigillo certifica unicità: hash del front-end + impegno di vendita singola | conferma CEO 2026-06-11 | "te lo dimostro, non te lo prometto"; definizione esatta, mai claim più ampio |
| Primo LSO in produzione: FlorenceEGI, 8 organi online | docs/paradigm/lso/00_LSO_LIVING_SOFTWARE_ORGANISM.md v4.0.0 | "prova di nascita della specie", non portfolio |
| Mente interrogabile reale (chat AI advisor su RAG SSOT piattaforma) | [STATO M-017] COSTRUITA e LIVE — operatore AI "Padmin" (microservizio `nexus-operator/`, RAG **dedicato** fabiocherici su Postgres+pgvector, modello tre-RAG ADR M-FUC-031) embeddato in cima a /softwarehouse e su nexus.fabiocherici.com; corpus = proiezione pubblica `commercial-claims-public.md` + `discovery-questions.md` | embeddata in pagina: "falle una domanda" |
| Caso Capasso (sito-monumento, pinocapasso.com) | progetto reale | pubblicabile SOLO al deploy su pinocapasso.com (decisione CEO); raccontato problema→soluzione→risultato dal punto di vista della cliente |

## 4. Claim VIETATI in pagina (mai, nemmeno riformulati)

1. **LOC come protagonista** (vanity; "1.000 righe/ora" semina il dubbio AI se
   arriva prima della spiegazione del metodo).
2. **Ore di lavoro accanto ai prezzi** (ancoraggio: 12h vs prezzo di mercato).
3. **"50% sotto le agenzie" / "40-50% più veloce" / "Ultra Enterprise"** senza
   evidenza citabile terza. Riformulazione ammessa: "prezzo pubblico — confronta tu".
4. **Pain-testimonial di terzi / recensioni Trustpilot / link in uscita verso
   recensioni negative** (lezione M-008: il negativo si attacca alla categoria).
5. **Hero biografico** ("dal 1995", "ritorno consapevole") come apertura.
6. **Equazioni/formule** con termini proprietari.
7. **Prezzi nuovi non presenti nelle fasce attuali** (incluso il €10k).
8. **Claim di unicità più ampi di ciò che il Sigillo attesta** (telaio è
   condiviso ed è un PREGIO dichiarato: "pianale collaudato, carrozzeria unica").

## 5. Linguaggio LSO per il cliente (traduzioni approvate dal SSOT canonico)

Fonte tecnica: 00_LSO_LIVING_SOFTWARE_ORGANISM.md (auto-documentazione, mente
interrogabile, sistema nervoso). Traduzione cliente:

1. **Si documenta da solo** — ogni modifica riscrive il suo fascicolo; il
   manuale non è mai vecchio. [metafora candidata: "fascicolo del fabbricato
   che si aggiorna da solo" — in copy v1, soggetta a veto CEO in review]
2. **Puoi parlargli** — mente interrogabile: domande in italiano, risposte
   fondate sui suoi documenti reali, non a memoria.
3. **Sente quando qualcosa non torna** — percepisce il disallineamento tra ciò
   che dice e ciò che fa, e lo segnala.

Chiusura approvata: "Risultato: non dipendi da nessuno. Nemmeno da me."

## 6. Protocollo demo (redesign a scala) — vincolante

1. Demo costruita con contenuti del titolare → MAI pubblica: gate credenziali
   (caso Le Vespe: basic auth attiva, M-LEVESPE-020) finché manca il consenso.
2. La demo si mostra PRIMA al titolare.
3. Senza consenso: il telaio resta nostro, i contenuti si sostituiscono
   integralmente (storia/foto sono del titolare).
4. Demo a brand fittizio (IdealOro): badge "sito dimostrativo — disponibile
   per la tua attività" + noindex + form → lead B2B. [da implementare]

## 7. Dipendenze tecniche della pagina (vincoli CEO)

- **Stats cantiere LIVE dal giorno 1** — endpoint da EGI-STAT, fetch
  client-side; P0-FC-2: la pagina resta sensata senza JS (la sezione degrada,
  non sparisce). NESSUN placeholder statico.
  - [STATO M-015] **Realizzato.** `components/softwarehouse/LiveSiteStats.tsx`
    consuma `https://stat.florenceegi.com/api/public/site-stats` (verificato
    live); degrado senza JS conforme P0-FC-2.
- **Chat AI advisor embeddata in v1** — pattern SigilloAdvisorService su EGI:
  endpoint guest throttle 20/min + CORS fabiocherici.com; frontend pattern
  free-ai-chat.js (vanilla, SSE) con estetica ai-sidebar adattata
  grafite+bronzo; stringhe 7 lingue (P0-FC-4). Nel RAG pubblico della chat
  entra SOLO una **proiezione pubblica** di questo SSOT (claim citabili §3 +
  frame + linguaggio §5) — MAI il documento integrale: §2 (pricing interno),
  §4 (razionali), §6 (protocollo) restano internal.
  - [STATO M-015] **Non realizzato in v1.** La v1 è andata online SENZA chat
    funzionante: la dipendenza lato EGI (endpoint guest) non era pronta. In
    pagina è predisposto uno slot progressive
    (`components/softwarehouse/AdvisorSlot.tsx`): la chat si attiverà nello
    slot senza rework di pagina quando l'endpoint EGI sarà disponibile. La
    decisione di questo punto resta valida e NON è rinegoziata.
  - [STATO M-017] **REALIZZATA e LIVE.** Lo slot è stato riempito da un
    **operatore AI proprietario dedicato** ("Padmin"), NON dal pattern EGI:
    microservizio `nexus-operator/` (FastAPI, chat SSE, RAG pgvector dedicato,
    vision gpt-4o, proxy /showcase, rate-limit pseudonimizzato). Il widget
    (`components/softwarehouse/nexus/` + `lib/nexus/`) è stato montato **in cima
    a /softwarehouse** (correzione CEO M-017: "la chat va all'inizio, alla gente
    piace interagire") — non più dentro la sezione LSO. `AdvisorSlot.tsx`
    aggiornato a innesto v2 env-driven: con env attiva → widget Padmin live;
    senza env → fallback statico onesto. Anche live su `nexus.fabiocherici.com`.
    Il vincolo SSOT resta rispettato: nel RAG dell'operatore entra SOLO la
    proiezione pubblica (`commercial-claims-public.md` §3+§5 + `discovery-questions.md`),
    MAI il documento integrale (§2/§4/§6 restano internal). Privacy aggiornata
    di conseguenza (vedi i18n privacy: IP pseudonimizzato, OpenAI sub-processor,
    base giuridica 6(1)(f)).
- Demo toccabili: IdealOro live; Capasso al deploy su pinocapasso.com.

## 8. Registro decisioni CEO (2026-06-11)

| Decisione | Esito |
|---|---|
| Prezzi | invariati, solo fasce attuali |
| Redesign pricing | 70-80% mercato |
| Processo 5 fasi | da SSOT esistente, vincolante |
| Sigillo | hash front-end + vendita singola |
| Nome | Living Software Organism + traduzione ita sotto; Oracode Nexus protagonista |
| Stats | live, nessun placeholder |
| Siti seri | terza card in pagina softwarehouse |
| Capasso | in portfolio al deploy pinocapasso.com |
| Testimonianze dolore | ELIMINATE |

## 9. Stato di attuazione in pagina (M-015 — 2026-06-12)

Rewrite `/softwarehouse` (M-015): 8 sezioni, narrativa §1 attuata (atto 1
risk-reversal, atto 2 Oracode Nexus → LSO), 3 card offerta da §2, claim solo
da §3 con frame, linguaggio LSO da §5, 7 lingue.

| Dipendenza §7 | Stato v1 |
|---|---|
| Stats cantiere LIVE | ATTIVO — `LiveSiteStats.tsx` su endpoint EGI-STAT live |
| Chat AI advisor | **LIVE (M-017)** — operatore "Padmin" dedicato in cima a /softwarehouse + nexus.fabiocherici.com; non più solo slot |
| Demo toccabili | IdealOro live; Capasso resta gated al deploy pinocapasso.com |

## 10. Stato di attuazione operatore AI (M-017 — 2026-06-13)

Lo slot chat di M-015 è stato riempito da un **operatore AI proprietario
dedicato** ("Padmin"), con RAG dedicato fabiocherici (modello tre-RAG
ADR M-FUC-031, Postgres+pgvector su EC2 isolata da EGI). Go-live confermato su
`https://fabiocherici.com/softwarehouse` (widget in cima) e
`https://nexus.fabiocherici.com`.

| Componente M-017 | Stato |
|---|---|
| `nexus-operator/` (FastAPI: chat SSE, RAG, vision, /showcase, rate-limit) | LIVE |
| Widget `components/softwarehouse/nexus/` + `lib/nexus/` | LIVE, in cima a /softwarehouse |
| `AdvisorSlot.tsx` innesto v2 (env-driven: widget vs fallback statico) | Attivo |
| Corpus operatore | proiezione pubblica (`commercial-claims-public.md` + `discovery-questions.md`) — MAI doc integrale |
| Privacy | aggiornata: IP pseudonimizzato, OpenAI sub-processor, base 6(1)(f) — 7 lingue |

Nuovi SSOT introdotti da M-017 (registrati in SSOT_REGISTRY):
- `commercial-claims-public.md` — proiezione pubblica dei claim citabili (§3+§5 di questo doc), `visibility: public`, cibo del RAG operatore.
- `discovery-questions.md` — sistema domande di discovery + mappa fasce (calibrata su EGI-STAT), istruisce l'operatore in modalità discovery.

## 11. Stato di attuazione attention-first (M-018 — 2026-06-16)

Rework di `/softwarehouse` per mettere l'**attenzione prima di tutto**: l'azione
n.1 non è un bottone, è **interagire con Padmin**.

| Decisione M-018 | Esito |
|---|---|
| Hero split sopra la piega | promessa (claim §3 da SSOT) a sx + **widget Padmin** a dx nel primo viewport (`SoftwarehouseHero.tsx` riscritto split) |
| Prompt-seed | 3-4 prompt cliccabili che avviano Padmin (i18n `nexus.seed_*`), prop `seeds` su `PadminChat`/`NexusWidget`/`AdvisorSlot` |
| **3D rimosso da /softwarehouse** | era inteso solo per la homepage; nessun `Scene3DSwitch` né Canvas above-the-fold; LCP = H1 testo server-rendered, no CLS |
| CTA | **una sola CTA primaria** (Padmin); email/WhatsApp degradati a sola CTA finale |
| De-gergo MVP nella copy CLIENTE | "MVP" → "prima versione funzionante" su 56 stringhe i18n `softwarehouse.*` + `commercial-claims-public.md`. **Questo SSOT interno resta INVARIATO**: "MVP" è il termine **interno/tecnico** (regola jargon §1 + nota claim §3 r.4); il termine non si usa mai col cliente. |
| Nuova chiave trust | `softwarehouse.hero_trust` ("Cantiere live · GitHub pubblico") |

Nota terminologica (decisione CEO M-018): la **regola jargon** del §1 viene
rafforzata e applicata alla copy esistente — l'acronimo inglese di "minimum
viable product" non è comprensibile alle PMI. La proiezione pubblica
(`commercial-claims-public.md` v1.1.0) e tutte le stringhe cliente usano "prima
versione funzionante"; questo documento e i suoi razionali interni continuano a
usare "MVP" come nome tecnico del concetto.

## 12. Trasparenza AI Art. 50(1) AI Act (M-FABIOCHERICI-001 — 2026-06-20)

Propagazione del **kit AI-Act** sull'operatore Padmin: la chat ora dichiara
esplicitamente all'utente di interagire con un'intelligenza artificiale (obbligo
di trasparenza Art. 50(1) Regolamento UE 2024/1689 — AI Act), tramite un **banner
di disclosure** canonico, e una **pagina pubblica di trasparenza** `/ai-transparency`.

| Elemento | Stato |
|---|---|
| Banner disclosure Art. 50(1) sulla chat Padmin | LIVE — `components/ai-act/AiDisclosureBanner.tsx` (kit canonico da M-DIM-003, verbatim), montato in `PadminChat.tsx` `variant="inline"` con link alla pagina trasparenza; **sostituisce** la disclosure ad-hoc precedente (Strategia Delta) |
| Pagina pubblica `/ai-transparency` | LIVE — `app/[locale]/ai-transparency/page.tsx`, 7 locale, SSG + JSON-LD, in sitemap; namespace i18n `aiTransparency` |
| Claim preservato | la pagina ribadisce che le risposte di Padmin sono **"fondate sui documenti del progetto"** (coerente con §5.2 e con il frame del claim §3 "mente interrogabile") e possono contenere errori (no over-claim) |

Relazione con il layer **privacy/GDPR** (§10, M-017): complementare, non
sostitutivo. M-017 ha coperto il **trattamento dati** (IP pseudonimizzato, OpenAI
sub-processor, base giuridica 6(1)(f)); M-FABIOCHERICI-001 copre la **trasparenza
AI** (l'utente sa di parlare con un'AI). Nessun claim commerciale §3/§4 modificato;
nessun prezzo o razionale interno toccato. Strato di compliance additivo.

> Gap registrato (DOC-SYNC M-FABIOCHERICI-001): **non esiste** in FABIOCHERICI-DOC
> uno SSOT dedicato alla compliance AI / al kit AI-Act dell'organo. Il layer è oggi
> tracciato qui (§12) + in `i18n-messages.md` (namespace `aiTransparency`) +
> `seo.md` (rotta). Se il kit AI-Act si estenderà (es. logging trasparenza, marcatura
> contenuti generati Art. 50(2), GPAI), valutare uno SSOT `ai-act-compliance.md`
> dedicato. NON creato in questa mission (REGOLA ZERO — non si inventa uno SSOT).

## Changelog

| Versione | Data | Mission | Cambiamento |
|---|---|---|---|
| 1.0.0 | 2026-06-11 | M-014 | Creazione SSOT commerciale |
| 1.1.0 | 2026-06-12 | M-015 (DOC-SYNC) | Stato endpoint EGI-STAT §3 (costruito), note di stato §7 (stats attive, chat slot-only), sezione 9 stato attuazione |
| 1.2.0 | 2026-06-13 | M-017 (DOC-SYNC) | Chat advisor §3/§7/§9 da slot-predisposto → operatore "Padmin" LIVE (RAG dedicato, microservizio nexus-operator, widget in cima a /softwarehouse + nexus.fabiocherici.com); nuova §10 stato operatore AI; 2 nuovi SSOT figli registrati (commercial-claims-public, discovery-questions); privacy IP-pseudonimizzato/OpenAI/6(1)(f) |
| 1.3.0 | 2026-06-16 | M-018 (DOC-SYNC) | Nuova §11 stato attuazione attention-first: hero split (Padmin sopra la piega), prompt-seed, **3D rimosso da /softwarehouse**, una sola CTA primaria. Regola jargon §1 rafforzata: "MVP" de-gergoizzato nella copy cliente (56 stringhe i18n + commercial-claims-public v1.1.0) → "prima versione funzionante"; **termine interno MVP INVARIATO** in questo doc per decisione CEO. |
| 1.4.0 | 2026-06-20 | M-FABIOCHERICI-001 (DOC-SYNC) | Nuova §12 trasparenza AI Art. 50(1) AI Act: banner disclosure canonico (kit AI-Act) sulla chat Padmin + pagina pubblica `/ai-transparency` (7 locale, SSG, namespace i18n `aiTransparency`). Layer additivo complementare al privacy/GDPR di M-017. Gap registrato: nessuno SSOT compliance-AI dedicato (non creato — REGOLA ZERO). (Nota: front-matter version riallineato da 1.2.0→1.4.0, drift pregresso col changelog 1.3.0.) |
