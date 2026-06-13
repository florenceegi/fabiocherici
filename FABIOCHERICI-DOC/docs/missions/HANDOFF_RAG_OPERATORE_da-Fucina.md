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

## 0-bis. ⚠️ LE COSE SONO CAMBIATE — questo SUPERA il tuo M-015 (leggi PRIMA di tutto)

Hai chiesto: *"il chat/RAG/endpoint è roba EGI non fabiocherici? La M-017 che ho aperto per il pool è
nel posto sbagliato?"* — citando "l'handoff §5/§8". **Chiarimento doppio:**

1. **Errore di attribuzione.** Quella frase ("route EGI `fabiocherici/advisor/chat`, riusa
   `SigilloAdvisorController`/`RagSearchService`, proiezione SSOT, aprire mission M-EGI-xxx") **NON è in
   questo handoff** — è nel TUO `M-015_DESIGN_SOFTWAREHOUSE.md §5` (2026-06-11). Questo handoff dice
   l'opposto. Non confonderli.

2. **Decisione CEO (2026-06-13): il piano M-015 è SUPERATO.** Ci si basa sulle decisioni prese in
   sessione Fucina questa notte, NON sul disegno vecchio di fabiocherici. Cosa cambia, in concreto:

   | Aspetto | M-015 (vecchio, SUPERATO) | ORA (decisione CEO, governa) |
   |---|---|---|
   | RAG dell'advisor/operatore | riusa il RAG di EGI (`RagSearchService` su RDS FlorenceEGI) | **RAG DEDICATO di fabiocherici**, DB separato — **MAI sul RDS FlorenceEGI** |
   | Backend chat | route EGI, mission `M-EGI-xxx` | **runtime di fabiocherici** (dove → decisione D-1, tua) |
   | Chi possiede il pezzo | EGI (fabiocherici = solo widget frontend) | **fabiocherici possiede operatore + RAG**; EGI non c'entra |
   | La tua M-017 (pool) | "andrebbe spostata in M-EGI-xxx" | **resta in fabiocherici** — è il posto giusto col nuovo modello |

   **Perché è cambiato:** il CEO ha deciso che l'operatore di fabiocherici non è più un widget-advisor che
   riusa EGI, ma un **operatore AI evolutissimo** che guida le PMI nel discovery dei progetti (in prospettiva:
   inizializzare un project da qui) — knowledge vastissimo, e soprattutto **isolamento per costruzione**: un
   RAG pubblico che gira sul RDS dei clienti FlorenceEGI è il rischio di contaminazione che il CEO ha vietato
   esplicitamente ("le AI fanno casini, l'errore deve morire all'autenticazione"). Tre edifici separati, non
   uno condiviso.

   **Conseguenza operativa:** NON aprire/spostare il pool come `M-EGI-xxx`. NON riusare `SigilloAdvisorController`
   né il RAG di EGI. Il pool, l'ingest, l'endpoint e il RAG vivono in **fabiocherici** (con D-1 da decidere). Usa
   lo stampo collaudato (vedi §2-§4 sotto), non l'infrastruttura EGI.

---

## 0-ter. ✅ UPSTREAM PRONTO + D-1 DECISA (aggiornamento 2026-06-13 — leggi prima di partire)

Il CEO ha chiesto di verificare che "a monte" (registry/export del corpus) fosse a posto prima che tu
costruissi. **Fatto (M-FUC-036).** Stato:

1. **Il tuo organismo è ora censito** nel sistema Nexus (FABIOCHERICI-DOC = 9° registry). Prima non c'era:
   i tuoi SSOT non sarebbero mai entrati in nessun corpus. Corretto + corretto il bug del check che non
   vedeva i registry annidati come il tuo.
2. **Corpus pubblico pronto e verificato**: `export-ssot --audience public` → **137 file, 0 segreti**
   (gitleaks bloccante). È il corpus base del tuo RAG (paradigma Oracode + FlorenceEGI divulgativo).
3. **D-1 DECISA dal CEO: opzione (b) — macchina dedicata.** L'operatore e il suo Postgres vivono su una
   macchina propria (EC2 piccola / Lightsail), NON sulla EC2 dei siti FlorenceEGI. Isolamento fisico totale
   per il pezzo più esposto. → puoi procedere col provisioning.

### ⚠️ Un pezzo di CONTENUTO che è TUO (non plumbing, non lo fa Fucina)

I tuoi 8 SSOT (`commercial-claims`, `seo`, `design-tokens`, `fonts`, i18n, scene3d, animation) sono stati
classificati **`internal`** — sono config-build del sito + il `commercial-claims` che ha `visibility:internal`
e contiene i **claim VIETATI** (cosa NON dire). Quindi **NON entrano** nel corpus pubblico così come sono, ed
è giusto: l'operatore non deve avere la lista dei claim vietati né i font del sito.

MA l'operatore, per parlare dell'offerta software-house alle PMI, ha bisogno dei **claim CITABILI**. Serve
quindi un **nuovo SSOT "proiezione pubblica dei claim"** — solo i claim citabili (commercial-claims §3/§5),
zero vietati — marcato `public`. Lo prevedeva già il tuo M-015 §5. **Questo lo crei TU** (è contenuto tuo,
non infrastruttura). Quando esiste e lo classifichi public, entra automaticamente nel corpus pubblico via
il filo (`rag-distribute`).

### Sequenza operativa per te (ora sbloccata)

1. Crea l'SSOT `commercial-claims-public.md` (proiezione pubblica: solo claim citabili) → classificalo `public`
   (lo aggiungo io a `ssot-sensitivity.json` quando mi dici che è pronto, o lo fai tu via la stessa pipeline).
2. Provisioning **macchina dedicata** (D-1=b) + Postgres dedicato + ruolo least-privilege (stampo:
   `os3-matrix/sql/rag_nexus_schema.sql`).
3. `export-ssot --audience public` → backfill nel tuo DB via `rag_reindex.py` (137 + la tua proiezione claim).
4. Passa il tuo store `rag_fabiocherici` da `planned` ad `active` nell'indice (con env_ref, mai credenziali).
5. Difesa operatore PRIMA del go-live (decisione CEO ⑥): OWASP LLM Top-10 + red-team; zero tool di
   rete/DB oltre il RAG, zero credenziali nel contesto (anti-prompt-injection).

**La M-017 che avevi aperto resta in fabiocherici** — vedi §0-bis. Non spostarla in EGI.

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
