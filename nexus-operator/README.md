# Nexus Operator

Microservizio FastAPI dell'operatore AI **Nexus** di fabiocherici.com.
Derivato 1:1 dalla pipeline FlorenceEGI Free AI (SSE streaming + RAG pgvector),
con LLM **OpenAI diretto** (chat `gpt-4o-mini` streaming, embedding
`text-embedding-3-small`).

Guida le PMI nel discovery del loro progetto software. Risponde solo sul corpus
RAG (138 SSOT ecosistema + offerta fabiocherici); se non sa, lo dice e invita al
contatto. Ogni risposta chiude con una CTA verso la prima chiamata. Multilingua.

## Struttura

```
app/
  config.py      env loader + Config (value object immutabile)
  db.py          connessione psycopg2 + health_check
  rag.py         retrieval pgvector (SQL cosine = rag_query.py)
  llm.py         client OpenAI diretto (embed + chat streaming)
  prompt.py      system prompt operatore + build_messages
  ratelimit.py   rate-limit guest (tabella Postgres)
  sse.py         format_sse (contratto = formatSSE PHP)
  validation.py  Pydantic input models
  operator.py    pipeline (porta FreeAiChatService::chat)
  main.py        FastAPI: POST /chat (SSE), GET /health
tests/           pytest (fake OpenAI + fake DB, no rete)
sql/operator_rate_limit.sql  DDL tabella rate-limit
.env.example     template segreti (copiare in /etc/nexus/operator.env)
```

## Configurazione

Copia `.env.example` in `/etc/nexus/operator.env` (fuori repo, mai committato) e
compila DB_* + OPENAI_API_KEY. Override del path: `NEXUS_ENV_PATH`.

Applica la DDL rate-limit:

```bash
psql -d nexus_fabiocherici -f sql/operator_rate_limit.sql
```

## Avvio (sul box)

Il box ha `/opt/nexus/venv` con `openai` + `psycopg2-binary`. Aggiungi le altre:

```bash
/opt/nexus/venv/bin/pip install -r requirements.txt
/opt/nexus/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8001
```

`X-Accel-Buffering: no` disattiva il buffering nginx per lo streaming reale.

## Endpoints

- `POST /chat` — body `{message, session_id, conversation_history?}` → SSE
  `text/event-stream` con eventi `start` / `chunk` ({content}) / `complete`
  ({usage?}) / `error` ({message, code}). Stesso contratto del widget
  `free-ai-chat.js`.
- `GET /health` — `{status, db, config}`; 503 se DB irraggiungibile.

Rate-limit guest: 50 richieste/giorno per IP (`error` code
`RATE_LIMIT_EXCEEDED` oltre soglia).

## Test

```bash
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
python -m pytest
```

I test usano fake per OpenAI e DB: non chiamano OpenAI, non richiedono Postgres.
