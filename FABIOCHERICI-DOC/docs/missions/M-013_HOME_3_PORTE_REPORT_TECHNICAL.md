# M-013 — Report Tecnico: Home provvisoria 3 porte

**Mission:** M-013
**Data:** 2026-06-11
**Commit:** `0c0c3cc` su `main`
**Status deploy:** GitHub Actions `Deploy fabiocherici.com: success` — verificato live
**Trigger:** 1 (riduzione visibile, zero contenuto nuovo, zero contract)

## Scope

Home page provvisoria orientata a monetizzazione: porte visibili ridotte da 6 a 3
(Softwarehouse, Florence EGI, EPP). Lato invisibile SEO **invariato al 100%**.
Le porte Oracode / Scrittore / AI-Nous torneranno dopo il rework Oracode Nexus.

## File modificati

| File | Modifica |
|---|---|
| `app/[locale]/page.tsx` | `DOORS` 6→3 (`softwarehouse` 0°, `egi` 120°, `epp` 240°); header `@version 3.0.0` |
| `app/globals.css` | Fix selettore hover: `data-door="creazioni"` → `"softwarehouse"` (residuo rinomina M-008 mai propagato) |
| `messages/{it,en,de,es,fr,pt,zh}.json` | Solo `home.nav_label`: "Sei porte" → label neutra ("Le porte del sito", "Site doors", …) — finding gate a11y |
| `.oracode/project.json` | Aggiunto `"web_root": "."` (gate web-quality auto-attivabile) |
| `tests/m-013/test_home_3_doors.sh` | Test acceptance P0-13 (RED→GREEN) |

## Invarianti SEO preservate (verificate su build + live)

- Blocco `sr-only` con `role="region"` + 9 link sezione (incluso `/oracode`) — crawler vedono tutto il sito
- Metadata title/description, `hreflang` ×8 (7 locale + x-default), `og:image`, JSON-LD schema
- SEC headers live: HSTS, CSP, `nosniff`, `X-Frame-Options: DENY` (HTTP/2 200 su it/en/zh)

## Gate

- **Test m-013:** GREEN (3 porte esatte, sr-only 9 sezioni, CSS hover, i18n 7 lingue)
- **Web Quality Gate deterministico:** 273/273 PASS (`audit/web-quality/index-M-013.json`)
- **Web Quality Gate agente:** WARN risolti pre-deploy (nav_label, web_root); SEC post-deploy verificati
- **Audit OS3:** PASS — 0 critici, 0 warning, 3 INFO (report engine `M-013/audits/03-os3-audit-specialist.md`)

## Note tecniche / debiti

- CSS hover per porte nascoste (`oracode`/`scrittore`/`ai-nous`) e chiavi i18n relative: **mantenuti deliberatamente** — torneranno post-rework Oracode Nexus
- `MISSING_MESSAGE: nav.preferences (fr)` in build: **preesistente** (54 occorrenze anche su main pre-M-013), fuori scope
- OG `epp.png` ×7 modificate nel worktree: fuori scope M-013, da disporre in commit dedicato
- Gate umano residuo: giudizio CEO dal vivo su composizione triangolo 3 porte (CR-1/CR-8)
