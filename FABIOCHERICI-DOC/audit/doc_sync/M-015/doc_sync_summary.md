# DOC-SYNC v2.2 — Summary M-015

> Mission: M-015 — Rewrite pagina /softwarehouse
> Istanza: /home/fabio/fabiocherici.com/FABIOCHERICI-DOC (pattern NESTED)
> Eseguito: 2026-06-11T22:03Z → 2026-06-11T22:30Z (UTC)
> Modalità: LSO ridotto (RAG_SCHEMA non configurato — RAG non presente)

## SSOT impattati (4 diretti, 0 laterali)

| SSOT | Modo | Esito | Contenuto |
|---|---|---|---|
| commercial-claims (v1.0.0→**1.1.0**) | substitutive (pre-approvato dal chiamante) | applied | §3 fonte claim "Cantiere LIVE": endpoint EGI-STAT da costruire → **COSTRUITO** (`stat.florenceegi.com/api/public/site-stats`, consumato da `LiveSiteStats.tsx`); §7 note [STATO M-015]: stats **realizzate**, chat advisor **slot-only in v1** (decisione NON riscritta); nuova §9 stato attuazione + changelog |
| seo | substitutive (fact-refresh verificato) | applied | OG count 84(12×7) → **91(13×7)** verificato con `ls`; trappola [SPIEGATO M-015] anomalia `epp.png` ×7 identici = `meta.epp_title` identico nei 7 locali, **non-bug**; nota metadata softwarehouse (≤160 chars verificato, max 145 DE) |
| i18n-messages | additive | applied | Cronologia namespace `softwarehouse`: 202→112 chiavi flat, 56 nuove/146 eliminate (verificato via diff strutturale; brief diceva 58/148 = includeva le 2 meta.* modificate) |
| design-tokens | additive | applied | Trappola [M-015]: `@keyframes lso-breathe` + `.lso-trait`, consumo `--accent-glow` (definito in tutti i temi), gating reduced-motion, vincolo su rename token |

## No-change giustificati

- animation-presets, scene3d-ids, i18n-config, fonts: nessun file watchato toccato.
- Doc mission M-015_* NON registrati in SSOT_REGISTRY: record storici, non SSOT
  (coerenza istanza: nessun doc mission precedente registrato).

## Registry

- Metadati aggiornati (last_verified 2026-06-12, verified_in_mission M-015,
  verification_mode registry_only) per i 4 SSOT.
- **Coverage fix**: aggiunto watch `components/softwarehouse/*.tsx` a
  commercial-claims (i 5 componenti nuovi incarnano claim §3/§7 — erano scoperti).

## File scoperti residui (informativo, non bloccante)

- `tests/m-015/test_softwarehouse_rewrite.sh` — test di mission, convenzione: non watchato.
- `scripts/generate-og-images.mjs` — coperto narrativamente in seo.md, nessun watch formale.
- `.oracode/project.json` — config engine, fuori scope SSOT registry.

## RAG

Skipped — RAG non presente nell'istanza (nessun RAG_SCHEMA). Metadati registry
aggiornati con `verification_mode: registry_only` come da protocollo v2.2.
