---
title: SSOT Commerciale — claim citabili, vietati, narrativa softwarehouse
ssot_id: commercial-claims
slug: commercial-claims
organ: fabiocherici.com
doc_type: content-ssot
version: 1.1.0
status: current
date: '2026-06-11'
last_sync: '2026-06-12'
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
| Mente interrogabile reale (chat AI advisor su RAG SSOT piattaforma) | pattern SigilloAdvisorService (EGI) | embeddata in pagina: "falle una domanda" |
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
| Chat AI advisor | SLOT predisposto (`AdvisorSlot.tsx`), chat NON attiva — dipendenza EGI non pronta |
| Demo toccabili | IdealOro live; Capasso resta gated al deploy pinocapasso.com |

## Changelog

| Versione | Data | Mission | Cambiamento |
|---|---|---|---|
| 1.0.0 | 2026-06-11 | M-014 | Creazione SSOT commerciale |
| 1.1.0 | 2026-06-12 | M-015 (DOC-SYNC) | Stato endpoint EGI-STAT §3 (costruito), note di stato §7 (stats attive, chat slot-only), sezione 9 stato attuazione |
