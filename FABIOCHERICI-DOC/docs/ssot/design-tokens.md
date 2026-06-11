---
ssot_id: design-tokens
title: Design Tokens — Palette grafite+bronzo + temi
organ: fabiocherici.com
source: app/globals.css
last_sync: 2026-06-11
last_verified_mission: M-013
---

# Design Tokens SSOT

## Cosa descrive

CSS custom properties per fabiocherici.com:
- **Palette base**: grafite `#111` + bronzo `#C8A96E`
- **Temi**: `dark` (default), `light`, `ambient` (7 slot luminosità)
- **Tokens**: `--bg`, `--bg-elevated`, `--bg-card`, `--text-primary`, `--accent`, `--border`, `--surface-glass` (+ varianti)

Tema attivo via `[data-theme="..."]` sul `<html>`.

## File sorgente

- `app/globals.css` — definizione tokens + override per tema

## Consumer

- `lib/theme-context.tsx` — Theme provider, gestisce switch tema
- Tutti i component Tailwind (via `var(--token)`)

## Trappole note

- Cambiare tokens → verifica tutti i tema (dark/light/ambient × 7 slot = 9 combinazioni)
- Slot `ambient` calcolato auto in `theme-context.tsx` da slot 0-6
- `color-scheme` deve match il tema (`dark` o `light`)
- [CICATRICE M-013] `globals.css` contiene selettori `:has()` per id porta della home (`[data-door="..."]` / `[data-desc="..."]`): quando si rinomina un id porta, vanno aggiornati TUTTI i selettori corrispondenti. La rinomina `creazioni` → `softwarehouse` (M-008) aveva lasciato un selettore hover stale (`.circle-stage:has([data-door="creazioni"]...)`) — la descrizione della porta softwarehouse non appariva on-hover. Scoperto e corretto solo in M-013. Procedura su rename porta: `grep -n "creazioni\|<vecchio-id>" app/globals.css` esaustivo prima di chiudere la mission di rename (P0-8 FASE 3).
