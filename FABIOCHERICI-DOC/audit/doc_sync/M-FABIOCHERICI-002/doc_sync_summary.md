# DOC-SYNC v2 — M-FABIOCHERICI-002

> Organo: fabiocherici · instance_root reale: `/home/fabio/fabiocherici.com/FABIOCHERICI-DOC`
> Data: 2026-06-25 · Esito: **success** · RAG: skipped (LSO ridotto, nessun RAG_SCHEMA)

## Cosa ha fatto la mission

Rename della vetrina: l'endpoint pubblico della chat-advisor "Padmin" della pagina
`/[locale]/softwarehouse` è passato da `nexus.fabiocherici.com` al nome canonico
`oracode.fabiocherici.com` (variabile build-time `NEXT_PUBLIC_ADVISOR_CHAT_ENDPOINT`
in `.env.production`, una sola riga, commit `734d994`). Cambio build-time (Next static
export), deploy CI completato e verificato live. `nexus.fabiocherici.com` resta attivo:
fa 301 verso oracode e continua a servire le API legacy.

Classificazione Trigger Matrix: **tipo 5 (Naming)** — rinomina di un'entità di dominio
(il sottodominio pubblico dell'advisor) documentata come **fatto** negli SSOT.

## Step 2 — impatto diretto deterministico

**0 SSOT diretti.** `.env.production` non è watchato da alcun SSOT del registry
(i watch coprono `lib/*`, `app/*`, `components/*`, `messages/*`, `nexus-operator/*`).

## Step 3 — discovery laterale

RAG non configurato per questa istanza → modalità ridotta: discovery via grep
deterministico dei concetti (`nexus.fabiocherici.com` / `oracode.fabiocherici.com` /
endpoint advisor) sul contenuto degli SSOT. **2 SSOT lateralmente impattati**, entrambi
con `nexus.fabiocherici.com` come fatto pubblico corrente:

- `commercial-claims.md` (content-ssot, internal, critical)
- `i18n-messages.md` (content-ssot, critical)

## Step 4 — modifiche applicate (entrambe SUBSTITUTIVE)

### commercial-claims.md (1.4.0 → 1.5.0)
4 occorrenze di **stato corrente** aggiornate a `oracode.fabiocherici.com`, con nota
che `nexus` ora 301→oracode + API legacy:
- §3 r.67 (tabella claim "mente interrogabile reale")
- §7 (dipendenze tecniche, STATO M-017)
- §9 (tabella stato attuazione M-015)
- §10 (go-live operatore AI M-017)

Più: front-matter `version` 1.4.0→1.5.0, `last_sync` 2026-06-20→2026-06-25, nuova riga
changelog 1.5.0.

**Preservata** (M-OS3-027 — record storico legittimo): la riga changelog **1.2.0 (M-017)**
che cita `nexus.fabiocherici.com` — è la cronaca di quando l'advisor andò live su quel nome.
Verifica `grep` finale eseguita: tutti i residui `nexus.fabiocherici.com` sono o
contestuali-corretti (301→oracode) o storici legittimi.

### i18n-messages.md
1 occorrenza (aside del namespace `nexus`, r.67) aggiornata a `oracode.fabiocherici.com`
(ex nexus, 301→oracode). Front-matter `last_sync` 2026-06-16→2026-06-25,
`last_verified_mission` M-018→M-FABIOCHERICI-002. Il doc non ha campo `version`/changelog:
non introdotto (REGOLA ZERO — non si inventa struttura).

Nota: i **file di messaggi i18n** (`messages/*.json`) NON sono stati toccati dalla mission
e non citano il dominio (nessuna stringa cliente espone l'URL), quindi nessuna modifica
i18n a contenuto/parità lingue.

## Step 5 — RAG

**Skipped** — nessun `RAG_SCHEMA` configurato per fabiocherici e `rag-distribute` non
presente nel path engine. Modalità LSO ridotto: registry + audit, no re-indexing.
Nota: l'SSOT pubblico/RAG-feed `commercial-claims-public.md` NON è stato toccato da questa
mission (la proiezione pubblica non cita l'endpoint), quindi nessun re-index pubblico
sarebbe comunque stato necessario.

## Step 5b — metadati registry

`commercial-claims` e `i18n-messages`: `last_verified=2026-06-25`, `verified_in_mission=M-FABIOCHERICI-002`,
`last_drift_score=0`, `verification_mode=registry_only`. `_meta.updated` bumpato a 2026-06-25.

## Coverage (Rule 8)

Nessun file nuovo creato dalla mission (solo `.env.production` modificato). `.env.production`
non è coperto da watch SSOT: corretto — è file di config build-time secret-adjacent, non
materia da watcher documentale. Nessun gap di copertura azionabile.

## Outcome

success — 2 SSOT aggiornati (substitutive), 0 no_change, 0 rewrite-flagged, 0 approvazioni
richieste (aggiornamento fattuale di un nome-dominio verso il canonico verificato live).
