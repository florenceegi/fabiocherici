# HANDOFF — Architettura RAG dell'operatore fabiocherici.com (deciso in sessione Fucina)

> **@author** Padmin D. Curtis (Supervisor-CTO, AI Partner OS3.0) for Fabio Cherici (CEO)
> **@version** 1.0.0 · **@date** 2026-06-13
> **@purpose** Riallineare QUESTA session (fabiocherici.com) alle decisioni architetturali sui tre-RAG
> prese nella sessione Fucina la notte 2026-06-12/13. Qui sei rimasto a uno stato di conoscenza
> precedente: stavi avviando il RAG dell'operatore e avevi chiesto di unificare il corpus SSOT.
> Quel lavoro è stato ripreso e portato a sistema in Fucina. Leggi prima di proseguire sul RAG.

---

## 0. Perché ricevi questo handoff

Avevi aperto la questione "mi serve tutto il corpus SSOT in un punto per preparare il RAG di
fabiocherici.com". Da lì, in sessione Fucina, è nato un disegno architetturale completo (3 RAG,
classificazione di sensibilità, distribuzione automatica) che TU non conosci perché è stato deciso
altrove. Questo documento ti riallinea. **Le decisioni sotto sono FIRMATE dal CEO** — non ri-litigarle,
eseguile o costruisci sopra.

---

## 1. Il modello a TRE RAG (ADR firmato — M-FUC-031)

L'ecosistema ha tre RAG DB **fisicamente separati** (isolamento per costruzione, non per disciplina —
il CEO: "le AI fanno casini, l'errore deve morire all'autenticazione, non alla buona condotta"):

| RAG | Per chi | Stato | Contenuto |
|---|---|---|---|
| **FlorenceEGI** (RDS AWS, master EGI-DOC) | NATAN, tenant | esiste, **intoccato** | business FlorenceEGI |
| **Oracode Nexus** (Postgres locale dedicato) | agenti interni | **COSTRUITO** (M-FUC-032) | tutto, anche reserved |
| **fabiocherici.com** (nuovo, pubblico) | visitatori/PMI via il TUO operatore | **DA COSTRUIRE — è il tuo pezzo** | SOLO documenti `public` |

ADR completo: `/home/fabio/Fucina/docs/missions/m-fuc-031/ADR-tre-rag.md` (ACCEPTED).
Modello di sicurezza: `/home/fabio/Fucina/docs/missions/m-fuc-031/SECURITY_MODEL-tre-rag.md`.

---

## 2. Cosa è GIÀ pronto per te (non rifarlo)

1. **Il corpus pubblico è classificato e pronto.** 218 documenti SSOT dell'intero ecosistema sono stati
   classificati `public`/`internal`/`reserved` (M-FUC-030, firma CEO). **137 sono `public`** — è ESATTAMENTE
   ciò che il tuo operatore può dare in pasto ai visitatori senza rischi. Regola CEO: "gli SSOT sono il cibo
   degli helper; pubblico tutto tranne la superficie d'attacco" (infra AWS, deploy, credenziali, investor deck).
   - Classificazione: `/home/fabio/os3-matrix/contracts/ssot-sensitivity.json` (v2.1.0 APPROVED).
   - **Comando per generare il TUO corpus**: `/home/fabio/os3-matrix/bin/export-ssot --audience public --dest <tua-dir>`
     → produce 137 file, **0 segreti** (scansione gitleaks bloccante integrata — decisione CEO: per il pubblico
     lo scanner NON è opzionale, se manca o trova un segreto l'export NON parte).

2. **Lo schema DB e gli strumenti esistono già** (collaudati su Oracode Nexus, M-FUC-032):
   - DDL di riferimento: `/home/fabio/os3-matrix/sql/rag_nexus_schema.sql` (3 tabelle documents/chunks/embeddings,
     pgvector, indice HNSW cosine). Stesso stampo per il tuo DB.
   - Indicizzatore: `/home/fabio/os3-matrix/bin/rag_reindex.py` (v2.3.1, slug canonico `INSTANCE__ORGAN__file`,
     `--env-path` per le credenziali fuori-repo, `--schema`).
   - Costo embedding di 218 doc: ~$0,03 (text-embedding-3-small). Il tuo (137) ancora meno.

3. **Il "filo" automatico esiste** (M-FUC-033): `/home/fabio/os3-matrix/bin/rag-distribute` distribuisce gli SSOT
   aggiornati ai RAG abbonati a ogni chiusura di mission. Quando il tuo RAG sarà attivo e censito, riceverà
   gli aggiornamenti `public` da solo — col gate gitleaks FAIL-hard verso il pubblico già cablato.

---

## 3. Cosa devi DECIDERE tu (la D-1, è bloccante)

**D-1 — Dove gira l'operatore AI e dove vive il suo DB.** L'ADR è fermo qui perché solo TU (su questo sito)
sai cosa stai costruendo. Oggi fabiocherici.com è servito come **SPA statica** (verificato: nginx statico,
nessun backend vivo). Il tuo operatore AI ha bisogno di un processo backend che riceve la domanda → interroga
il RAG → chiama il modello → risponde. Quel processo e il suo Postgres devono stare da qualche parte.

Opzioni (vincolo CEO: **MAI** sul RDS FlorenceEGI — terzo edificio separato):
- **(a) Sulla EC2 privata esistente** (`i-0940cdb7b955d1632`, quella dei siti FlorenceEGI, amministrata
  direttamente dal CEO — NON Laravel Forge, l'utente `forge` è solo un nome ereditato): l'operatore come servizio
  in più (come `drop-tiles` che già ci gira), col suo Postgres dedicato. Zero infra nuova; edificio fisico
  condiviso, isolamento via DB+credenziali separate.
- **(b) Macchina dedicata** (EC2 piccola / Lightsail): isolamento fisico totale per il pezzo più esposto;
  un'amministrazione in più.

**Inclinazione del Supervisor**: (b) — l'operatore pubblico è la superficie più esposta dell'ecosistema
(chiunque può interrogarlo), un edificio separato limita il raggio di un'eventuale compromissione. Ma decidi tu
in base a cosa stai costruendo di là.

---

## 4. Cosa devi COSTRUIRE (A4, dopo D-1)

Sequenza, riusando lo stampo Nexus:
1. Provisioning DB dedicato + ruolo least-privilege (CONNECT solo sul suo DB) + credenziali in file fuori-repo
   (mai nel codice — regola M-FUC-024). Schema da `rag_nexus_schema.sql`.
2. Backfill: `export-ssot --audience public` → `rag_reindex.py` sul tuo DB. 137 documenti.
3. Censire il tuo store nell'indice Nexus (`/home/fabio/os3-matrix/contracts/ssot-registry-index.json`,
   blocco `rag.stores[]`, oggi `rag_fabiocherici` è `planned`): passarlo ad `active` con engine/host/env_ref
   (nome profilo, MAI credenziali). Da quel momento il "filo" lo alimenta da solo.
4. **Difesa dell'operatore** (decisione CEO ⑥, PRIMA del go-live pubblico): acquisire OWASP LLM Top 10 nel
   corpus e passare un red-team. Raccomandazioni del security model (SECURITY_MODEL-tre-rag §R1-R8): l'operatore
   NON deve avere tool di rete/DB oltre il suo RAG, NÉ credenziali nel suo contesto (anti-prompt-injection /
   anti-confused-deputy). Il corpus pubblico è public by-design — la difesa non è la segretezza del corpus, è
   impedire che l'operatore diventi un proxy verso altri sistemi.

**Aperta anche D-5** (sicurezza, GDPR): retention dei log delle conversazioni dell'operatore (potenziale dato
personale, Trigger 4) — da decidere prima del go-live.

---

## 5. Riferimenti (tutti in /home/fabio)

- ADR + security model: `Fucina/docs/missions/m-fuc-031/`
- Classificazione + export: `os3-matrix/contracts/ssot-sensitivity.json`, `os3-matrix/bin/export-ssot`
- Stampo DB + tool: `os3-matrix/sql/rag_nexus_schema.sql`, `os3-matrix/bin/rag_reindex.py`, `os3-matrix/bin/rag-distribute`
- Indice (rubrica RAG): `os3-matrix/contracts/ssot-registry-index.json` (il tuo store = `rag_fabiocherici`, planned)
- Checklist generale: `Fucina/docs/missions/CHECKLIST_LAVORI_APERTI.md` (TRACK A: A4 è il tuo, bloccato su D-1)

**Prima azione consigliata**: decidi D-1 (runtime), poi genera il tuo corpus con
`export-ssot --audience public` e parti dal punto 4. Tutto il resto è già collaudato.
