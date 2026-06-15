-- @package nexus-operator
-- @author  Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
-- @version 1.1.0 (Nexus Operator — fabiocherici.com)
-- @date    2026-06-16
-- @mission M-017
-- @purpose DDL tabella rate-limit guest dell'operatore Nexus. Una riga per
--          (identifier, day): conteggio richieste giornaliere. UNIQUE su
--          (identifier, day) abilita l'UPSERT atomico (ON CONFLICT DO UPDATE)
--          usato da app/ratelimit.py::increment. Schema rag_nexus (stesso DB
--          nexus_fabiocherici delle viste documents/chunks/embeddings).
--          GDPR B2 (M-017): `identifier` contiene lo sha256 pseudonimo dell'IP
--          (salt rotante giornaliero), MAI l'IP in chiaro; retention 30gg via
--          app.ratelimit.purge_old, schedulata dal supervisor.

CREATE TABLE IF NOT EXISTS rag_nexus.operator_rate_limit (
    identifier  TEXT        NOT NULL,
    day         DATE        NOT NULL,
    count       INTEGER     NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (identifier, day)
);

-- Indice per pulizia periodica delle righe vecchie (retention/GDPR):
-- l'IP e' un dato personale, le righe oltre N giorni vanno cancellate.
CREATE INDEX IF NOT EXISTS idx_operator_rate_limit_day
    ON rag_nexus.operator_rate_limit (day);

-- Retention GDPR (M-017): righe oltre 30 giorni cancellate. Logica esposta come
-- funzione Python CHIAMABILE app.ratelimit.purge_old(cursor, schema, retention_days=30),
-- che il SUPERVISOR schedula via cron giornaliero (il cron NON e' nel servizio).
-- SQL equivalente eseguito dalla funzione (retention_days parametrizzato, %s):
--   DELETE FROM rag_nexus.operator_rate_limit WHERE day < CURRENT_DATE - 30::integer;
