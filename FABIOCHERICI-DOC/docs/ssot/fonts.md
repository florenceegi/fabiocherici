---
ssot_id: fonts
title: Fonts — Display + Body config centralizzato
organ: fabiocherici.com
source: lib/fonts.ts
last_sync: 2026-05-26
---

# Fonts SSOT

## Cosa descrive

Config font centralizzata, condivisa tra root layout e per-locale layouts.
Espone CSS variables `--font-display` + `--font-body` consumate in `app/globals.css`.

## File sorgente

- `lib/fonts.ts` — definizione font (next/font/google)

## Consumer

- `app/layout.tsx` — applica classi font al root html/body
- `app/[locale]/layout.tsx` — wrap locale tree con stesse classi
- CSS via `var(--font-display)` / `var(--font-body)`

## Trappole note

- Cambiare font → preload latency, verifica LCP <2s (P0-FC-5)
- Font Google: build time fetch, no runtime CDN call
- Tipografica deve match palette luxury (no fonts comici)
