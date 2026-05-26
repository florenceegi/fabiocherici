---
ssot_id: scene3d-ids
title: 3D Scene IDs — 9 scene Three.js
organ: fabiocherici.com
source: lib/scene3d.ts
last_sync: 2026-05-26
---

# 3D Scene IDs SSOT

## Cosa descrive

9 SceneId per il sistema 3D di fabiocherici.com:
`aurora | morph-sphere | crystal | noise-terrain | smoke | ribbon-flow | wave-grid | particle-sphere | none`

LocalStorage-only (static export S3+CloudFront, no cookie/SSR state).

## File sorgente

- `lib/scene3d.ts` — type SceneId, helpers localStorage

## Consumer

- `lib/scene-context.tsx` — Context provider
- `components/three/Scene3DSwitch.tsx` — dynamic loader
- `components/three/scenes/*.tsx` — implementazioni singole scene

## Trappole note

- Aggiungere scena → estendere SceneId + creare component scene + aggiornare SCENE_NAMES i18n
- P0-FC-3: scene 3D opzionali, sito deve funzionare con `none`
- P0-FC-5: IcosahedronGeometry detail max 5 (no lag)
