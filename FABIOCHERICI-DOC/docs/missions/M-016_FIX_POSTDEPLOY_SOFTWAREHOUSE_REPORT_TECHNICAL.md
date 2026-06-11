# M-016 — Report Tecnico: Fix post-deploy /softwarehouse (dati live + screenshot advisor)

**Mission:** M-016 | **Data:** 2026-06-12 | **Trigger:** 1 (remediation defect su output M-015)

## Due defect rilevati dal CEO dopo il deploy M-015

### 1. Dati live cantiere assenti nel browser — causa: CSP apex `connect-src 'self'`
La CloudFront Function `fabiocherici-security-headers` (apex) emette
`content-security-policy: ... connect-src 'self' ...`. Il browser BLOCCA il
fetch cross-origin del widget `LiveSiteStats` verso `https://stat.florenceegi.com`
→ `.catch()` → stato `error` → fallback testuale senza numeri. `curl` funziona
perché NON applica la CSP (per questo da terminale i dati c'erano). Endpoint +
CORS lato server sono corretti (verificato: `access-control-allow-origin:
https://fabiocherici.com`, HTTP 200).

**Fix (infra, da eseguire dal CEO — il classifier blocca la modifica CloudFront da agent):**
```bash
aws cloudfront describe-function --profile fabiocherici-deploy --name fabiocherici-security-headers --query ETag --output text
# usa l'ETag DEV restituito in --if-match:
aws cloudfront update-function --profile fabiocherici-deploy --name fabiocherici-security-headers \
  --if-match <ETAG> --function-config Comment="apex + connect-src stat",Runtime=cloudfront-js-2.0 \
  --function-code fileb:///tmp/fc-sec-headers-new.js --query ETag --output text
# poi publish con l'ETag restituito da update:
aws cloudfront publish-function --profile fabiocherici-deploy --name fabiocherici-security-headers --if-match <ETAG_UPDATE>
```
Function pronta in `/tmp/fc-sec-headers-new.js`: unica modifica
`connect-src 'self'` → `connect-src 'self' https://stat.florenceegi.com`.
Quando la chat reale sarà innestata, aggiungere anche l'host dell'API EGI.

### 2. Screenshot statico al posto della chat — RIMOSSO
`AdvisorSlot.tsx` v1 mostrava `chat_ai.png`. Vincolo CEO: togliere lo screenshot.
v2.0.0: lo slot rende solo copy onesto (`lso_demo_caption`) + CTA
(`lso_chat_cta`). Rimossa la prop `demoAlt` + chiave i18n orfana `lso_demo_alt`
dai 7 file. Il mount point per la chat reale resta (env build-time, design M-015 §D).

## File modificati
| File | Modifica |
|---|---|
| `components/softwarehouse/AdvisorSlot.tsx` | v2.0.0: rimosso `next/image` + screenshot; solo copy + CTA |
| `app/[locale]/softwarehouse/page.tsx` | rimossa prop `demoAlt` da `<AdvisorSlot>` |
| `messages/{7}.json` | rimossa chiave orfana `softwarehouse.lso_demo_alt` |
| `tests/m-016/test_advisor_no_screenshot.sh` | test P0-13 (RED→GREEN) |
| `/tmp/fc-sec-headers-new.js` | function CSP pronta (apply infra a carico CEO) |

## Gate
Test m-016 GREEN · test m-015 GREEN (non-regressione) · tsc pulito · web-quality 277/277 PASS.

## Coda
La **chat AI reale** resta da costruire: route EGI `fabiocherici/advisor/chat`
(pattern `SigilloAdvisorController`/`SigilloAdvisorService`, guest throttle 20/min,
RAG su **proiezione pubblica** dell'SSOT commerciale — MAI §2/§4/§6, vincolo audit
M-014) + componente frontend `AdvisorChat` + CSP per l'host API EGI + deploy.
Mission dedicata `M-EGI-ADVISOR-FABIOCHERICI` (triage queue).
