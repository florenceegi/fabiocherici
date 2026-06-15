diff --git a/FABIOCHERICI-DOC/docs/ssot/commercial-claims.md b/FABIOCHERICI-DOC/docs/ssot/commercial-claims.md
index c2c6b7e..470d93d 100644
--- a/FABIOCHERICI-DOC/docs/ssot/commercial-claims.md
+++ b/FABIOCHERICI-DOC/docs/ssot/commercial-claims.md
@@ -4,10 +4,10 @@ ssot_id: commercial-claims
 slug: commercial-claims
 organ: fabiocherici.com
 doc_type: content-ssot
-version: 1.1.0
+version: 1.2.0
 status: current
 date: '2026-06-11'
-last_sync: '2026-06-12'
+last_sync: '2026-06-13'
 author: Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 scope:
 - fabiocherici.com
@@ -64,7 +64,7 @@ parole del cliente. Mai LSO/Oracode Nexus/SSOT/RAG come apertura.
 | Sito completo ~12,5h (Le Vespe v1) | EGI-STAT | SOLO uso interno/cantiere; MAI accanto a prezzi |
 | EGI-Sigillo certifica unicità: hash del front-end + impegno di vendita singola | conferma CEO 2026-06-11 | "te lo dimostro, non te lo prometto"; definizione esatta, mai claim più ampio |
 | Primo LSO in produzione: FlorenceEGI, 8 organi online | docs/paradigm/lso/00_LSO_LIVING_SOFTWARE_ORGANISM.md v4.0.0 | "prova di nascita della specie", non portfolio |
-| Mente interrogabile reale (chat AI advisor su RAG SSOT piattaforma) | pattern SigilloAdvisorService (EGI) | embeddata in pagina: "falle una domanda" |
+| Mente interrogabile reale (chat AI advisor su RAG SSOT piattaforma) | [STATO M-017] COSTRUITA e LIVE — operatore AI "Padmin" (microservizio `nexus-operator/`, RAG **dedicato** fabiocherici su Postgres+pgvector, modello tre-RAG ADR M-FUC-031) embeddato in cima a /softwarehouse e su nexus.fabiocherici.com; corpus = proiezione pubblica `commercial-claims-public.md` + `discovery-questions.md` | embeddata in pagina: "falle una domanda" |
 | Caso Capasso (sito-monumento, pinocapasso.com) | progetto reale | pubblicabile SOLO al deploy su pinocapasso.com (decisione CEO); raccontato problema→soluzione→risultato dal punto di vista della cliente |
 
 ## 4. Claim VIETATI in pagina (mai, nemmeno riformulati)
@@ -128,6 +128,20 @@ Chiusura approvata: "Risultato: non dipendi da nessuno. Nemmeno da me."
     (`components/softwarehouse/AdvisorSlot.tsx`): la chat si attiverà nello
     slot senza rework di pagina quando l'endpoint EGI sarà disponibile. La
     decisione di questo punto resta valida e NON è rinegoziata.
+  - [STATO M-017] **REALIZZATA e LIVE.** Lo slot è stato riempito da un
+    **operatore AI proprietario dedicato** ("Padmin"), NON dal pattern EGI:
+    microservizio `nexus-operator/` (FastAPI, chat SSE, RAG pgvector dedicato,
+    vision gpt-4o, proxy /showcase, rate-limit pseudonimizzato). Il widget
+    (`components/softwarehouse/nexus/` + `lib/nexus/`) è stato montato **in cima
+    a /softwarehouse** (correzione CEO M-017: "la chat va all'inizio, alla gente
+    piace interagire") — non più dentro la sezione LSO. `AdvisorSlot.tsx`
+    aggiornato a innesto v2 env-driven: con env attiva → widget Padmin live;
+    senza env → fallback statico onesto. Anche live su `nexus.fabiocherici.com`.
+    Il vincolo SSOT resta rispettato: nel RAG dell'operatore entra SOLO la
+    proiezione pubblica (`commercial-claims-public.md` §3+§5 + `discovery-questions.md`),
+    MAI il documento integrale (§2/§4/§6 restano internal). Privacy aggiornata
+    di conseguenza (vedi i18n privacy: IP pseudonimizzato, OpenAI sub-processor,
+    base giuridica 6(1)(f)).
 - Demo toccabili: IdealOro live; Capasso al deploy su pinocapasso.com.
 
 ## 8. Registro decisioni CEO (2026-06-11)
@@ -153,12 +167,33 @@ da §3 con frame, linguaggio LSO da §5, 7 lingue.
 | Dipendenza §7 | Stato v1 |
 |---|---|
 | Stats cantiere LIVE | ATTIVO — `LiveSiteStats.tsx` su endpoint EGI-STAT live |
-| Chat AI advisor | SLOT predisposto (`AdvisorSlot.tsx`), chat NON attiva — dipendenza EGI non pronta |
+| Chat AI advisor | **LIVE (M-017)** — operatore "Padmin" dedicato in cima a /softwarehouse + nexus.fabiocherici.com; non più solo slot |
 | Demo toccabili | IdealOro live; Capasso resta gated al deploy pinocapasso.com |
 
+## 10. Stato di attuazione operatore AI (M-017 — 2026-06-13)
+
+Lo slot chat di M-015 è stato riempito da un **operatore AI proprietario
+dedicato** ("Padmin"), con RAG dedicato fabiocherici (modello tre-RAG
+ADR M-FUC-031, Postgres+pgvector su EC2 isolata da EGI). Go-live confermato su
+`https://fabiocherici.com/softwarehouse` (widget in cima) e
+`https://nexus.fabiocherici.com`.
+
+| Componente M-017 | Stato |
+|---|---|
+| `nexus-operator/` (FastAPI: chat SSE, RAG, vision, /showcase, rate-limit) | LIVE |
+| Widget `components/softwarehouse/nexus/` + `lib/nexus/` | LIVE, in cima a /softwarehouse |
+| `AdvisorSlot.tsx` innesto v2 (env-driven: widget vs fallback statico) | Attivo |
+| Corpus operatore | proiezione pubblica (`commercial-claims-public.md` + `discovery-questions.md`) — MAI doc integrale |
+| Privacy | aggiornata: IP pseudonimizzato, OpenAI sub-processor, base 6(1)(f) — 7 lingue |
+
+Nuovi SSOT introdotti da M-017 (registrati in SSOT_REGISTRY):
+- `commercial-claims-public.md` — proiezione pubblica dei claim citabili (§3+§5 di questo doc), `visibility: public`, cibo del RAG operatore.
+- `discovery-questions.md` — sistema domande di discovery + mappa fasce (calibrata su EGI-STAT), istruisce l'operatore in modalità discovery.
+
 ## Changelog
 
 | Versione | Data | Mission | Cambiamento |
 |---|---|---|---|
 | 1.0.0 | 2026-06-11 | M-014 | Creazione SSOT commerciale |
 | 1.1.0 | 2026-06-12 | M-015 (DOC-SYNC) | Stato endpoint EGI-STAT §3 (costruito), note di stato §7 (stats attive, chat slot-only), sezione 9 stato attuazione |
+| 1.2.0 | 2026-06-13 | M-017 (DOC-SYNC) | Chat advisor §3/§7/§9 da slot-predisposto → operatore "Padmin" LIVE (RAG dedicato, microservizio nexus-operator, widget in cima a /softwarehouse + nexus.fabiocherici.com); nuova §10 stato operatore AI; 2 nuovi SSOT figli registrati (commercial-claims-public, discovery-questions); privacy IP-pseudonimizzato/OpenAI/6(1)(f) |
