-- @package nexus-operator
-- @author  Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
-- @version 1.0.0 (Nexus Operator — fabiocherici.com)
-- @date    2026-06-16
-- @mission M-020
-- @purpose DDL tabella della MEMORIA FILE per sessione dell'operatore Nexus.
--          Una riga per (session_id, idx): l'estratto testuale di un'immagine
--          condivisa nella conversazione, persistito una volta sola (dopo UNA
--          vision call alla ricezione) cosi' che Padmin valuti TUTTI i file
--          insieme anche nei turni successivi, senza re-invio dell'immagine.
--          PRIMARY KEY (session_id, idx): idx progressivo per sessione (ordine
--          di arrivo), assegnato da app/filememory.py::store_file (MAX(idx)+1).
--          Schema rag_nexus (stesso DB nexus_fabiocherici e stesso stampo di
--          sql/operator_rate_limit.sql: applicata con `psql -d nexus_fabiocherici
--          -f sql/operator_session_files.sql`, come da README).
--          GDPR (OWASP Proactive Controls C9): `extracted_text` puo' contenere
--          dati personali -> retention 30gg via app.filememory.purge_old,
--          schedulata dal supervisor; NESSUN log del contenuto (solo idx/mime/len).
--          Niente byte dell'immagine persistiti: dopo l'estrazione resta solo testo.

CREATE TABLE IF NOT EXISTS rag_nexus.operator_session_files (
    session_id     TEXT        NOT NULL,
    idx            INTEGER     NOT NULL,
    mime           TEXT        NOT NULL,
    extracted_text TEXT        NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (session_id, idx)
);

-- OWNER: sql/operator_rate_limit.sql NON imposta un OWNER esplicito (la tabella
-- eredita l'owner dell'utente che esegue il psql). Questo file segue lo STESSO
-- stampo (nessun ALTER ... OWNER TO), per non assumere un ruolo non referenziato
-- nel repo. Se il deploy reale usa un ruolo applicativo dedicato (es. rag_nexus_rw),
-- l'owner va impostato fuori da questo DDL come gia' avviene per il rate-limit.

-- Indice per pulizia periodica (retention/GDPR): l'estratto puo' contenere PII,
-- le righe oltre N giorni vanno cancellate.
CREATE INDEX IF NOT EXISTS idx_operator_session_files_created_at
    ON rag_nexus.operator_session_files (created_at);

-- Retention GDPR (M-020): righe oltre 30 giorni cancellate. Logica esposta come
-- funzione Python CHIAMABILE app.filememory.purge_old(cursor, schema, retention_days=30),
-- che il SUPERVISOR schedula via cron giornaliero (il cron NON e' nel servizio).
-- SQL equivalente eseguito dalla funzione (retention_days parametrizzato, %s):
--   DELETE FROM rag_nexus.operator_session_files
--   WHERE created_at < now() - 30::integer * interval '1 day';
