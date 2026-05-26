---
id: M-005
title: Fix EPP split chart — label PIATTAFORMA + FRANGETTE non-overlapping
tipo_missione: fix
organi_coinvolti: [fabiocherici.com]
priority: P2
trigger_matrix: 2
status: closed
date_open: 2026-05-26
date_close: 2026-05-26
found_by: CEO screenshot 2026-05-26 (donut chart EPP page label overlap)
---

# M-005 — Fix EPP split chart label overlap

## Problema

Donut chart sezione "Come si divide ogni transazione" su `/it/epp` mostrava label HTML assoluti PIATTAFORMA (10%) e FRANGETTE APS (2%) sovrapposti nel quadrante TOP-RIGHT del cerchio.

Coordinate adiacenti (delta 6% top + 8% right):
```
PIATTAFORMA: top-[8%]  right-[32%]
FRANGETTE:   top-[14%] right-[24%]
```

Visual: i due testi si compenetravano (vedi screenshot CEO).

## Soluzione

Riposizionamento label con stack orizzontale a top, gap 20% right:
```
PIATTAFORMA: top-[2%] right-[38%]
FRANGETTE:   top-[2%] right-[18%]
```

Stesso valore `top` (allineati), distanza orizzontale 20% (sufficiente per evitare overlap).

## File modificati

- `app/[locale]/epp/page.tsx` — 2 label coordinate (linee 110-117)
- `tests/m-005/test_split_chart_svg_inline.sh` — test red shell-based

## Test

Test RED → GREEN:
- RED: grep coordinate vecchie nel file restituisce match → fail
- GREEN: grep coordinate vecchie restituisce zero match → pass

## Esecuzione

Commit `1f53de8` pushato su main. Deploy GitHub Actions auto-trigger.

## Esito

CLOSED 2026-05-26. Deploy completato, sito aggiornato.
