# DOC-SYNC v2.2 — Mission M-013 (Home provvisoria 3 porte)

> Eseguito: 2026-06-11 | instance_root: /home/fabio/fabiocherici.com/FABIOCHERICI-DOC
> Commit mission: 0c0c3cc | Modalità: LSO ridotto (rag_mode: skipped_no_schema)

## Cosa ha fatto la mission

Home ridotta da 6 a 3 porte visibili (softwarehouse 0°, egi 120°, epp 240°) — home
provvisoria orientata alla monetizzazione. Porte oracode/scrittore/ai-nous rimosse dal
visibile (torneranno post-rework Oracode Nexus). Blocco SEO sr-only INTATTO con tutti
i 9 link sezione. Fix selettore hover CSS residuo rinomina M-008 (creazioni→softwarehouse).
`home.nav_label` neutralizzata ("Sei porte" → "Le porte del sito") su 7 locale (finding a11y).
`web_root: "."` nel descrittore. Test acceptance `tests/m-013/`.

## SSOT impattati e azioni

| SSOT | Impatto | Modo | Azione |
|---|---|---|---|
| `i18n-messages` | direct (messages/*.json ×7) | **additive** | CICATRICE M-013: label count-specifiche da evitare; chiavi `door_*`/`seo_section_*` delle porte nascoste da NON rimuovere (consumate dal blocco sr-only) |
| `design-tokens` | direct (app/globals.css) | **additive** | CICATRICE M-013: selettori `:has([data-door=...])` da aggiornare in blocco a ogni rename porta (residuo M-008 scoperto in M-013) |
| `seo` | pattern (app/[locale]/page.tsx) | **additive** | DECISIONE M-013: blocco sr-only 9 link deliberato e intatto — anti-drift contro rimozione come dead code. Grounding: page.tsx righe 55-72 |

Non impattati: animation-presets, scene3d-ids, i18n-config, fonts.
Front-matter aggiornato (last_sync 2026-06-11, last_verified_mission M-013) su tutti e tre.

## Discriminazione

Nessuna patch sostitutiva: nessuno dei tre doc descriveva la home a 6 porte o i valori
modificati — tutto contenuto nuovo (cicatrici/decisioni). Zero approvazioni richieste.

## Discovery laterale

RAG skip (nessuno schema). Fallback grep manuale su tutto FABIOCHERICI-DOC per
`sei porte|six doors|6 porte|circle of 6`: nessun doc stale (uniche occorrenze: i report
M-013 stessi, legittimi). REPO_MAP.json: nessun riferimento a porte.

## Esaustività (M-OS3-027)

Grep residui sui 3 doc patchati: 1 residuo `"Sei porte"` in i18n-messages.md:65 —
**legittimo** (citazione storica del valore pre-fix dentro la cicatrice M-013 stessa).

## Coverage check (informativo)

File nuovi non coperti da watch: `tests/m-013/test_home_3_doors.sh` (i test non sono
watchati da alcun SSOT — coerente con le mission precedenti, nessuna azione richiesta).
`.oracode/project.json` (modificato, non watchato — config infrastrutturale, non SSOT).

## Registry

SSOT_REGISTRY.json: metadati `last_verified/verified_in_mission/last_drift_score/
verification_mode=registry_only` aggiornati per i 3 SSOT processati (Step 5b post-skip RAG).

## Esito

**SUCCESS** — 3 additive applied, 0 substitutive, 0 rewrite flagged, 0 approvazioni pendenti.
