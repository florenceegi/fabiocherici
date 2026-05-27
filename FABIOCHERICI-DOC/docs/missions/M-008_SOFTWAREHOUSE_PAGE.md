---
id: M-008
title: Softwarehouse page — rinomina Creazioni + 9 sezioni + 7 componenti CSS + i18n 7 lingue + 301 redirect
tipo_missione: feature
organi_coinvolti: [fabiocherici.com]
priority: P1
trigger_matrix: 3
status: planning
date_open: 2026-05-27
date_close: null
found_by: CEO brief
target_audience: PMI italiana (3 profili A/B/C)
---

# M-008 — Softwarehouse page

## Scope

Sostituzione `/creazioni` con `/softwarehouse` come pagina commerciale dedicata.
9 sezioni + 7 componenti CSS riusabili + i18n 7 lingue + 301 redirect via CloudFront Function.

## Deliverable (Sprint 1)

### D1-D8 — Componenti CSS riusabili in `components/infographics/`

| Componente | Scope | Note |
|---|---|---|
| `ComparisonTable.tsx` | 2 colonne X/✓ alternate | 6+ righe |
| `FormulaBlock.tsx` | Composizione tipografica formula | "QUALITÀ × ORACODE = LSO" |
| `IconGrid.tsx` | Grid SVG icone + titolo + desc | 7 elementi Sezione 4 |
| `FlowDiagram.tsx` | Flowchart gerarchico 2 livelli | 5 fasi × N sotto-step |
| `PricingTiers.tsx` | N card pricing | 5 tier (€2-5/5-8/8-15/15-30/30-60k) |
| `PortfolioCard.tsx` | Card singola progetto | Nome + LOC + ore + badge audit |
| `PortfolioGrid.tsx` | Grid con sub-grids labeled | 3 sottogriglie A/B/C |

Tutti:
- Props localizzabili via i18n
- CSS variables design system esistente
- WCAG AA (aria, semantic, contrast)
- Responsive 380px / 768px / 1280px
- Zero immagini raster

## Vincoli editoriali (brief §4)

- Tono asciutto-fattuale, mai vendita
- Postura TU al centro (no "io consegno", sì "tu ricevi")
- Numeri verificabili vs PLATFORM_NUMBERS.md v2.2.0
- IdealOro nomenclatura obbligatoria (no GialloOro)

## Sprint roadmap

| Sprint | Deliverable | Stima |
|---|---|---|
| 1 | D0 + D1-D8 componenti | 6h30-10h30 |
| 2 | D9-D11 i18n 7 lingue testi | 5h-8h |
| 3 | D12-D16 page + nav + SEO + sitemap | 5h-8h |
| 4 | D17-D19+D28 migrazione + CloudFront + OG + GialloOro sweep | 3h30-5h30 |
| 5 | D21-D25 test + audit + Council pre-deploy | 3h-6h |
| 6 | D26-D27 deploy + FASE 6 close | 1h-2h |
| **Totale** | | **28h-53h** |

## Esito

PLANNING — CEO ha approvato piano FASE 3. Procedo Sprint 1.
