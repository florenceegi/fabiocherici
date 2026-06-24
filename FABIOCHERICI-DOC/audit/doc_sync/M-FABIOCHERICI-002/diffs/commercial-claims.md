diff --git a/FABIOCHERICI-DOC/docs/ssot/commercial-claims.md b/FABIOCHERICI-DOC/docs/ssot/commercial-claims.md
index 61d8dfb..858bace 100644
--- a/FABIOCHERICI-DOC/docs/ssot/commercial-claims.md
+++ b/FABIOCHERICI-DOC/docs/ssot/commercial-claims.md
@@ -4,10 +4,10 @@ ssot_id: commercial-claims
 slug: commercial-claims
 organ: fabiocherici.com
 doc_type: content-ssot
-version: 1.4.0
+version: 1.5.0
 status: current
 date: '2026-06-11'
-last_sync: '2026-06-20'
+last_sync: '2026-06-25'
 author: Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 scope:
 - fabiocherici.com
@@ -64,7 +64,7 @@ parole del cliente. Mai LSO/Oracode Nexus/SSOT/RAG come apertura.
 | Sito completo ~12,5h (Le Vespe v1) | EGI-STAT | SOLO uso interno/cantiere; MAI accanto a prezzi |
 | EGI-Sigillo certifica unicità: hash del front-end + impegno di vendita singola | conferma CEO 2026-06-11 | "te lo dimostro, non te lo prometto"; definizione esatta, mai claim più ampio |
 | Primo LSO in produzione: FlorenceEGI, 8 organi online | docs/paradigm/lso/00_LSO_LIVING_SOFTWARE_ORGANISM.md v4.0.0 | "prova di nascita della specie", non portfolio |
-| Mente interrogabile reale (chat AI advisor su RAG SSOT piattaforma) | [STATO M-017] COSTRUITA e LIVE — operatore AI "Padmin" (microservizio `nexus-operator/`, RAG **dedicato** fabiocherici su Postgres+pgvector, modello tre-RAG ADR M-FUC-031) embeddato in cima a /softwarehouse e su nexus.fabiocherici.com; corpus = proiezione pubblica `commercial-claims-public.md` + `discovery-questions.md` | embeddata in pagina: "falle una domanda" |
+| Mente interrogabile reale (chat AI advisor su RAG SSOT piattaforma) | [STATO M-017] COSTRUITA e LIVE — operatore AI "Padmin" (microservizio `nexus-operator/`, RAG **dedicato** fabiocherici su Postgres+pgvector, modello tre-RAG ADR M-FUC-031) embeddato in cima a /softwarehouse e su oracode.fabiocherici.com (rename M-FABIOCHERICI-002 — nexus.fabiocherici.com ora 301→oracode + serve API legacy); corpus = proiezione pubblica `commercial-claims-public.md` + `discovery-questions.md` | embeddata in pagina: "falle una domanda" |
 | Caso Capasso (sito-monumento, pinocapasso.com) | progetto reale | pubblicabile SOLO al deploy su pinocapasso.com (decisione CEO); raccontato problema→soluzione→risultato dal punto di vista della cliente |
 
 ## 4. Claim VIETATI in pagina (mai, nemmeno riformulati)
@@ -136,7 +136,9 @@ Chiusura approvata: "Risultato: non dipendi da nessuno. Nemmeno da me."
     a /softwarehouse** (correzione CEO M-017: "la chat va all'inizio, alla gente
     piace interagire") — non più dentro la sezione LSO. `AdvisorSlot.tsx`
     aggiornato a innesto v2 env-driven: con env attiva → widget Padmin live;
-    senza env → fallback statico onesto. Anche live su `nexus.fabiocherici.com`.
+    senza env → fallback statico onesto. Anche live su `oracode.fabiocherici.com`
+    (nome canonico dal rename M-FABIOCHERICI-002; `nexus.fabiocherici.com` fa 301
+    verso oracode e continua a servire le API legacy).
     Il vincolo SSOT resta rispettato: nel RAG dell'operatore entra SOLO la
     proiezione pubblica (`commercial-claims-public.md` §3+§5 + `discovery-questions.md`),
     MAI il documento integrale (§2/§4/§6 restano internal). Privacy aggiornata
@@ -167,7 +169,7 @@ da §3 con frame, linguaggio LSO da §5, 7 lingue.
 | Dipendenza §7 | Stato v1 |
 |---|---|
 | Stats cantiere LIVE | ATTIVO — `LiveSiteStats.tsx` su endpoint EGI-STAT live |
-| Chat AI advisor | **LIVE (M-017)** — operatore "Padmin" dedicato in cima a /softwarehouse + nexus.fabiocherici.com; non più solo slot |
+| Chat AI advisor | **LIVE (M-017)** — operatore "Padmin" dedicato in cima a /softwarehouse + oracode.fabiocherici.com (rename M-FABIOCHERICI-002; nexus.fabiocherici.com 301→oracode); non più solo slot |
 | Demo toccabili | IdealOro live; Capasso resta gated al deploy pinocapasso.com |
 
 ## 10. Stato di attuazione operatore AI (M-017 — 2026-06-13)
@@ -176,7 +178,8 @@ Lo slot chat di M-015 è stato riempito da un **operatore AI proprietario
 dedicato** ("Padmin"), con RAG dedicato fabiocherici (modello tre-RAG
 ADR M-FUC-031, Postgres+pgvector su EC2 isolata da EGI). Go-live confermato su
 `https://fabiocherici.com/softwarehouse` (widget in cima) e
-`https://nexus.fabiocherici.com`.
+`https://oracode.fabiocherici.com` (nome canonico dal rename M-FABIOCHERICI-002;
+`https://nexus.fabiocherici.com` resta attivo come 301→oracode + API legacy).
 
 | Componente M-017 | Stato |
 |---|---|
@@ -246,3 +249,4 @@ nessun prezzo o razionale interno toccato. Strato di compliance additivo.
 | 1.2.0 | 2026-06-13 | M-017 (DOC-SYNC) | Chat advisor §3/§7/§9 da slot-predisposto → operatore "Padmin" LIVE (RAG dedicato, microservizio nexus-operator, widget in cima a /softwarehouse + nexus.fabiocherici.com); nuova §10 stato operatore AI; 2 nuovi SSOT figli registrati (commercial-claims-public, discovery-questions); privacy IP-pseudonimizzato/OpenAI/6(1)(f) |
 | 1.3.0 | 2026-06-16 | M-018 (DOC-SYNC) | Nuova §11 stato attuazione attention-first: hero split (Padmin sopra la piega), prompt-seed, **3D rimosso da /softwarehouse**, una sola CTA primaria. Regola jargon §1 rafforzata: "MVP" de-gergoizzato nella copy cliente (56 stringhe i18n + commercial-claims-public v1.1.0) → "prima versione funzionante"; **termine interno MVP INVARIATO** in questo doc per decisione CEO. |
 | 1.4.0 | 2026-06-20 | M-FABIOCHERICI-001 (DOC-SYNC) | Nuova §12 trasparenza AI Art. 50(1) AI Act: banner disclosure canonico (kit AI-Act) sulla chat Padmin + pagina pubblica `/ai-transparency` (7 locale, SSG, namespace i18n `aiTransparency`). Layer additivo complementare al privacy/GDPR di M-017. Gap registrato: nessuno SSOT compliance-AI dedicato (non creato — REGOLA ZERO). (Nota: front-matter version riallineato da 1.2.0→1.4.0, drift pregresso col changelog 1.3.0.) |
+| 1.5.0 | 2026-06-25 | M-FABIOCHERICI-002 (DOC-SYNC) | Rename vetrina: endpoint pubblico dell'advisor Padmin da `nexus.fabiocherici.com` al nome canonico `oracode.fabiocherici.com` (cambio build-time `NEXT_PUBLIC_ADVISOR_CHAT_ENDPOINT` in `.env.production`). Aggiornate le 4 occorrenze di stato corrente (§3 r.67, §7, §9, §10); `nexus.fabiocherici.com` resta attivo come 301→oracode + API legacy. La riga changelog 1.2.0 (storico M-017) NON è stata riscritta — è record storico legittimo. |
