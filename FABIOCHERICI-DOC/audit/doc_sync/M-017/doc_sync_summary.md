# DOC-SYNC v2 — M-017 (Operatore AI Padmin / Nexus)

> Istanza: fabiocherici.com (LSO mono-organo, pattern nested)
> instance_root: /home/fabio/fabiocherici.com/FABIOCHERICI-DOC
> Modalita: **LSO ridotto** (nessun RAG_SCHEMA dichiarato → Step 3 e Step 5 RAG skippati; registry + audit completi)
> Esito: **success**

## Cosa ha fatto la mission

Lo slot chat predisposto in M-015 (`AdvisorSlot.tsx`) e' stato riempito da un
**operatore AI proprietario dedicato** ("Padmin"): microservizio `nexus-operator/`
(FastAPI, chat SSE, RAG **dedicato** pgvector, vision gpt-4o, /showcase proxy,
rate-limit pseudonimizzato), widget React (`components/softwarehouse/nexus/` +
`lib/nexus/`) montato **in cima a /softwarehouse**, go-live su
fabiocherici.com/softwarehouse e nexus.fabiocherici.com. Il sito ora tratta dati
personali quando l'utente usa l'operatore → privacy aggiornata.

## SSOT impattati e azioni

| SSOT | Impatto | Modo | Status |
|---|---|---|---|
| `commercial-claims` | direct_watcher | additive | applied |
| `i18n-messages` | pattern_match (messages/*.json) | additive | applied |
| `commercial-claims-public` | nuovo (creato da mission) | register | applied |
| `discovery-questions` | nuovo (creato da mission) | register | applied |

### commercial-claims.md (1.1.0 → 1.2.0)
- §3 claim "Mente interrogabile reale": da pattern-EGI a **operatore Padmin LIVE** (RAG dedicato, tre-RAG M-FUC-031).
- §7 "Chat AI advisor": aggiunto `[STATO M-017] REALIZZATA e LIVE` (lo `[STATO M-015] non realizzato` resta come storico, superato additivamente).
- §9 tabella: chat da "SLOT predisposto" a "LIVE (M-017)".
- Nuova **§10** stato di attuazione operatore AI + elenco 2 SSOT figli.
- Changelog riga M-017.

### i18n-messages.md (last_verified_mission M-015 → M-017)
- Namespace `nexus` aggiunto alla lista + nuova sezione cronologia (36 chiavi/locale, parita 7 lingue **verificata** it/en/de/es/fr/pt/zh).
- Cronologia `softwarehouse` estesa M-017 (4 chiavi: `padmin_section_*`, `lso_talk_above`).
- Nuova sotto-sezione `privacy` M-017: 6(1)(f) (legittimo interesse anti-abuso), OpenAI sub-processor (USA), retention 30gg, IP pseudonimizzato. Verificato 6(1)(f) presente in tutti i 7 locali.

### Nuovi SSOT registrati in SSOT_REGISTRY.json (1.0.0 → 1.1.0, 8 → 10 documenti)
- `commercial-claims-public` — proiezione pubblica claim citabili, `visibility:public`, cibo del RAG operatore. Watch: `nexus-operator/app/{prompt,rag,operator}.py`.
- `discovery-questions` — sistema domande discovery + mappa fasce (calibrata EGI-STAT). Watch: `nexus-operator/app/{prompt,operator}.py`.
- Esteso il watch di `commercial-claims` con `components/softwarehouse/nexus/*.tsx` + `nexus-operator/app/prompt.py`.

## Verifica esaustivita (anti-pattern: aggiornamenti parziali)
- `grep "1.1.0"` su commercial-claims → solo riga changelog storica (legittimo).
- `grep` stati storici → STATO M-015 conservato come riferimento, STATO M-017 lo supera. Corretto.
- `grep "no RAG" / "non raccoglie dati"` sugli SSOT → **nessun residuo** (il claim privacy vive solo nei messages, gia' aggiornato dalla mission).
- SSOT_REGISTRY.json → JSON valido, 10 documenti.

## Coverage check (informativo, non bloccante — regola 8)
File mission con CLAIM/PERSONA coperti da watch: `prompt.py`, `rag.py`, `operator.py`, `nexus/*.tsx`.
UNCOVERED (plumbing tecnico senza claim, nessun SSOT di contenuto richiesto):
`nexus-operator/app/main.py`, `lib/nexus/types.ts`, `lib/nexus/sse-parser.ts`.

## RAG
**Skippato** (Step 3 + Step 5): nessun `RAG_SCHEMA` nell'istanza (ne env `ORACODE_RAG_SCHEMA` ne CLAUDE.md).
NOTA: il RAG dell'operatore Padmin (corpus pubblico via rag-distribute) e' un sistema **separato** dal RAG documentale di doc-sync — non confusi. La distribuzione del corpus operatore (commercial-claims-public + discovery-questions, audience:public) e' responsabilita del pipeline export-ssot/rag-distribute della mission, non di questo doc-sync.
