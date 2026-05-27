# DOC-SYNC v2.2.0 — M-007

> Mission: Fix home mobile — gear button fuori viewport (overflow-x .home-circle)
> Commit: `fa186c1`
> Run: 2026-05-27T10:18:39Z
> Outcome: **success**

## Sintesi semantica

Modifica chirurgica CSS: aggiunta singola property `overflow-x: clip` al selettore esistente `.home-circle` in `app/globals.css` (+1 riga). Creato test red shell `tests/m-007/test_home_overflow_clip.sh` (+13 righe).

La modifica fixa un bug di layout mobile specifico della home page: `.circle-orbit` con `translateY(calc(var(--circle-r) * -3))` espandeva la width del documento oltre il viewport, facendo render off-screen il gear button `<header className="fixed top-0 left-0 right-0">`. `clip` (non `hidden`) per compatibilita futura con `position: sticky` su figli.

Nessuna variazione su: palette grafite+bronzo, temi (dark/light/ambient), 7 slot ambient, tokens (`--bg`, `--text-*`, `--accent`, `--border`, `--surface-glass`), color-scheme.

## SSOT impattati

| SSOT | Watcher matchato | Mode | Status | Note |
|------|------------------|------|--------|------|
| design-tokens | `app/globals.css` | no_change | no_change | Cambio layout `.home-circle`, fuori scope SSOT |

**1 SSOT impattato direct** (via watcher `app/globals.css` su `design-tokens`).
**0 SSOT impattati lateral** (RAG non configurato per istanza LSO mono-organo).

## Discriminazione

`design-tokens` SSOT descrive esclusivamente palette, temi, slot ambient e CSS custom properties. La rule `.home-circle` e' una regola di layout di pagina (containment), non un token di design. Cerca nel SSOT testo che descriva `.home-circle` o `overflow`: assente. Cambio comportamento solo su layout home, no impatto su design tokens. Decisione: **no_change**, con giustificazione tracciabile.

## Re-indexing RAG

Skipped — RAG vettoriale non configurato in FABIOCHERICI-DOC. Nessun SSOT con status `applied`.

## Metadati aggiornati

`SSOT_REGISTRY.json` documents[3] (`design-tokens`):
- `last_verified` -> `2026-05-27`
- `verified_in_mission` -> `M-007`
- `last_drift_score` -> `0`
- `last_verified_by` -> `doc_sync_v2`

## Coverage

Nessun file nuovo nei watchers (file creato: `tests/m-007/*.sh`, fuori scope codice prod). Nessuna lacuna copertura segnalata.

## Conclusione

Mission M-007 puo' chiudere. SSOT design-tokens semanticamente coerente con codice. Audit trail completo in `audit/doc_sync/M-007/`.
