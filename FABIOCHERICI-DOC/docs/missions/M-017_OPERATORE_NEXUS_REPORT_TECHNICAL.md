# M-017 — Report Tecnico: Operatore AI Padmin (Nexus) + go-live

**Mission:** M-017
**Data:** 2026-06-16
**Commit:** `c2f65b5` su `main` (+ commit chiusura)
**Trigger:** 3 (nuovo organo runtime + RAG dedicato + widget + SSOT + infra pubblica)
**Status deploy:** GitHub Actions success — verificato live su https://fabiocherici.com/it/softwarehouse

## Scope

Costruzione end-to-end dell'operatore AI "Padmin" di fabiocherici.com: un RAG
DEDICATO (modello tre-RAG, ADR M-FUC-031) su infrastruttura propria, un servizio
conversazionale grounded, e il widget pubblico nel sito. Da zero a online.

## Architettura realizzata

```
Browser (fabiocherici.com/softwarehouse, S3+CloudFront)
   │  widget Padmin (NexusWidget, env NEXT_PUBLIC_ADVISOR_CHAT_ENDPOINT)
   ▼  HTTPS cross-origin (CORS allow-list)
nexus.fabiocherici.com  (EC2 t3.small dedicata, eu-north-1, i-0a16a9cfcf84714dc)
   │  nginx + TLS (Let's Encrypt) → uvicorn 127.0.0.1:8002 (utente nexus, non-root)
   ▼
FastAPI operatore  ─ /chat (SSE) ─ /showcase (proxy EGI) ─ /health
   ├─ RAG: Postgres 16 + pgvector, DB nexus_fabiocherici (isolato), schema rag_nexus
   │       137 SSOT pubblici + commercial-claims-public + discovery-questions
   ├─ LLM: OpenAI gpt-4o (chiave dedicata capped), embedding text-embedding-3-small
   └─ rate-limit guest 50/g per IP PSEUDONIMIZZATO (hash+salt rotante, purge 30gg)
```

## Componenti

| Componente | Cosa |
|---|---|
| **RAG dedicato** | EC2 + Postgres/pgvector isolato (mai RDS FlorenceEGI), 137 doc public via `export-ssot --audience public`, indicizzati con `rag_reindex.py` (4771 chunk/embedding) |
| **Operatore FastAPI** | `nexus-operator/app/`: main/operator/rag/llm/prompt/validation/image/ratelimit/showcase/config/sse — moduli <300 righe, 93 test, mypy strict |
| **System prompt Padmin** | identità (responsabile tecnica, co-builder), discovery guidata one-question, stima onesta in fascia, velocità COMPARATIVA (mercato vs noi ~metà), prima versione 3-5gg, processo (registrazioni→analisi, caparra-custodia), niente gergo "MVP", semini CTA, role-lock anti-injection |
| **Visione immagini** | gpt-4o multimodale; upload jpeg/png ≤5MB, validazione magic-bytes + cap pixel (decompression bomb); Padmin legge screenshot reali |
| **Vetrina opere** | proxy `/showcase` → `art.florenceegi.com/free-ai/hyper-egis` (server-side, cache 5min), opere reali cliccabili |
| **Widget** | `components/softwarehouse/nexus/` + `lib/nexus/`: NexusWidget, PadminChat, useNexusStream (SSE), ImageAttach, EgiShowcase, WisdomTicker — chat grande IN CIMA a /softwarehouse, i18n 7 lingue, a11y AA, grafite+bronzo |
| **SSOT** | `commercial-claims-public.md` (proiezione pubblica) + `discovery-questions.md` (sistema domande + mappa fasce, calibrata su dati EGI-STAT reali) |

## Difesa pre-go-live (CEO decisione ⑥) — security review + remediation

Review: `M-017_SECURITY_REVIEW_OPERATORE.md`. Codice solido (capability model R1-R8
regge: nessun tool/cred nel contesto LLM, output non eseguibile, SQL parametrizzato,
XSS chiuso, SSRF escluso). Remediation applicata:
- **B1** servizio a utente `nexus` non-root
- **B2** IP pseudonimizzato (sha256 + salt rotante giornaliero, mai IP in chiaro) +
  purge automatico 30gg (cron) + privacy policy aggiornata 7 lingue (GDPR, [rev. legale])
- **B3** uvicorn `--proxy-headers --forwarded-allow-ips=127.0.0.1` + nginx XFF
- cap `max_tokens` + timeout stream + budget history; CORS allow-list + TrustedHost
  nel servizio; cap pixel immagine; pin requirements
- **Red-team superato**: injection diretta, estrazione system prompt/segreti, role-hijack,
  e injection via testo-dentro-immagine → tutte respinte

## Infra pubblica
- DNS Route53 `nexus.fabiocherici.com` A → 13.48.48.33
- SG: 443+80 internet, 22 ristretto IP admin
- TLS Let's Encrypt (certbot --nginx, redirect)
- CSP apex CloudFront (lanciata dal CEO): `connect-src` + nexus + stat; `img-src` + media

## Gate
- backend: 93 pytest verdi · mypy --strict pulito · ruff/bandit puliti
- frontend: tsc pulito · 21 vitest verdi · build statico con/senza env OK
- web-quality-gate softwarehouse: **PASS** (272/277; 5 = WS-1 peso pagina 201-208KB, +widget, debito perf minore non bloccante)
- test mission `test_commercial_claims_public.sh`: GREEN
- verifica live esterna: chat + vetrina + CORS + CSP OK

## Debiti / note
- [DEBITO perf] peso pagina softwarehouse appena sopra 200KB (widget JS) — valutare lazy-load ulteriore
- [da validare] testo privacy policy 7 lingue → revisione avvocato (engineer-legal-it)
- [DEBITO] vetrina: `NEXT_PUBLIC_EGI_SHOWCASE_ENDPOINT` deriva da /showcase same-base; ok
- [follow-up] osservabilità/log retention conversazioni (oltre rate-limit) — D-5 estesa
- Store `rag_fabiocherici` nell'indice Nexus: passare planned→active per il "filo" rag-distribute (M-FUC-033)
