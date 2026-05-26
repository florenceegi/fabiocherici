---
ssot_id: animation-presets
title: Animation Presets — 6 preset GSAP
organ: fabiocherici.com
source: lib/animation.ts
last_sync: 2026-05-26
---

# Animation Presets SSOT

## Cosa descrive

Sistema di 6 preset animazione GSAP per fabiocherici.com:
- `minimal` — soft fade
- `cinematic` — slow grand
- `energetic` — bouncy fast
- `editorial` — magazine-style
- `fluid` — smooth flowing
- `none` — disabilita animazioni

Ogni preset definisce: hero, scrollReveal, pageTransition, hoverScale, easing, speed.

## File sorgente

- `lib/animation.ts` — definizione PRESETS, types, helpers localStorage

## Consumer

- `lib/animation-context.tsx` — React Context provider
- `components/ui/ScrollReveal.tsx` — usa scrollReveal preset
- `components/layout/PreferencesPanel.tsx` — UI selector

## Trappole note

- Modificare PRESETS senza re-osservare elementi `.reveal` = animazioni stale (vedi P0-FC CICATRICE in CLAUDE.md)
- Aggiungere nuovo preset → aggiornare `AnimationId` type + ANIMATION_NAMES i18n in `messages/*.json`
