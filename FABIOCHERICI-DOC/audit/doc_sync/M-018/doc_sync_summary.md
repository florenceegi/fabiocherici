# DOC-SYNC v2 — M-018

> Mission: /softwarehouse attention-first (hero conversazionale Padmin sopra la piega + rimozione 3D + de-gergo "MVP")
> Commit deliverable: 475543e
> instance_root: /home/fabio/fabiocherici.com/FABIOCHERICI-DOC
> Modalità: **LSO ridotto** (RAG istanza assente → Step 3 discovery laterale + Step 5 re-indexing SKIP; verification_mode = registry_only)
> Esito: **success**

## Fatti propagati

1. **De-gergo "MVP" nella copy CLIENTE** (decisione CEO) → "prima versione funzionante".
   Applicato a 56 stringhe `softwarehouse.*` nei 7 file i18n + `commercial-claims-public.md`
   (già editato nel commit). **SSOT interno `commercial-claims.md` INVARIATO**: MVP resta il
   termine tecnico interno (regola jargon §1) — documentata la policy in nuova §11.
2. **3D NON è su /softwarehouse** (era solo homepage). Verificato che `scene3d-ids.md` NON
   afferma il contrario (documenta solo ID/scene, nessun riferimento di placement pagina) →
   nessun drift da correggere. Documentato in commercial-claims §11 + nota seo.
3. **Nuove chiavi i18n** `softwarehouse.hero_trust`, `nexus.seed_intro/seed_1/2/3` →
   cronologia aggiornata in `i18n-messages.md`.
4. **Hero attention-first** (Padmin sopra la piega, prompt-seed, una sola CTA primaria) →
   additivo in commercial-claims §11.

## SSOT processati

| SSOT | Modo | Esito | Note |
|---|---|---|---|
| `i18n-messages.md` | additive | applied | M-018 cronologia softwarehouse (de-gergo) + nexus (seed) |
| `seo.md` | additive | applied | nota M-018 (description de-gergo, OG non da rigenerare, 3D/hero no impatto seo.ts) |
| `commercial-claims.md` (internal) | additive | applied | nuova §11 + changelog 1.3.0; termine MVP interno INVARIATO |
| `commercial-claims-public.md` (public) | substitutive | applied | contenuto già de-gergoizzato nel commit; allineato front-matter v1.0.0→1.1.0 |

## SSOT verificati ma NON impattati

- `scene3d-ids` — fact #2 verificato negativo (nessuna affermazione di placement su /softwarehouse)
- `design-tokens`, `i18n-config`, `animation-presets`, `fonts` — nessun file watchato toccato
- `discovery-questions` — non toccato da M-018 (resta M-017 / 2026-06-13)

## Verifica esaustività (M-OS3-027)

- `grep "MVP"` su `commercial-claims-public.md` → **0 residui cliente** (CLEAN)
- `grep "MVP"` su `commercial-claims.md` → 3 mention interne legittime (Atto 1, tabella offerta,
  tabella claim) **intenzionalmente preservate** per decisione CEO + 3 nuove mention di
  documentazione M-018. Nessun residuo errato.

## Registry

`SSOT_REGISTRY.json`: indici 5 (seo), 6 (i18n-messages), 7 (commercial-claims), 8
(commercial-claims-public) aggiornati a `last_verified=2026-06-16`, `verified_in_mission=M-018`,
`verification_mode=registry_only`. `_meta.updated`=2026-06-16. JSON validato.

## RAG

SKIP — `rag_mode: skipped_no_schema`. Nessun RAG_SCHEMA dichiarato per l'istanza. Metadati
aggiornati con `verification_mode: registry_only` (consentito in modalità LSO ridotto).

## Note operative

- MISSION_REGISTRY.json **NON toccato** (come da istruzione chiamante).
- Pattern istanza NESTED (DOC sub-dir del progetto): SSOT in `FABIOCHERICI-DOC/docs/ssot/`,
  codice watchato in `../`.
