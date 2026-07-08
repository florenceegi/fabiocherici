@CLAUDE_ORACODE_CORE.md

@/home/fabio/NATAN_LOC/CLAUDE_ECOSYSTEM_CORE.md

# fabiocherici.com — Sito Personale (Oracode OS3)

> Sito personale di Fabio Cherici — manifesto del paradigma Oracode.
> Il sito stesso è la prova che Oracode funziona. Se non rispetta Oracode, Oracode non è credibile.
> Stack: Next.js 15 App Router (static export → S3 + CloudFront)
> URL: fabiocherici.com | Path: /home/fabio/fabiocherici.com
> Branch: main

---

## Ruolo

```
NON è un organo FlorenceEGI. È un sito esterno costruito con Oracode al 100%.
Stesse regole, stessi hook, stessi standard. Zero compromessi.

Contenuti basati sugli SSOT Oracode — MAI inventati.
Il nome "Fabio Cherici" ha zero valore di mercato — il sito guida con VISIONE + LAVORO.
```

---

## Stack

```
Framework  → Next.js 15 App Router (output: export, static HTML)
React      → React 19
i18n       → next-intl v3 — 7 lingue: it en de es fr pt zh
Stile      → Tailwind CSS v4 + CSS custom properties (grafite #111 + bronzo #C8A96E)
Animazioni → GSAP 3 (dynamic import dentro useEffect, MAI top-level)
3D         → React Three Fiber + @react-three/drei (lazy, opzionale, ssr: false)
Font       → var(--font-display), var(--font-body)
Deploy     → S3 + CloudFront (static HTML)
```

---

## P0 Specifici fabiocherici.com

| # | Regola | Enforcement |
|---|--------|-------------|
| P0-FC-1 | **GSAP solo via dynamic import** | `import('gsap').then(...)` dentro useEffect. MAI `import gsap from 'gsap'` top-level. Crash SSR altrimenti. |
| P0-FC-2 | **Testo prima di tutto** | Pagina leggibile SENZA JS. `.reveal` non nasconde contenuto — usa CSS che mostra testo di default, GSAP lo anima se disponibile |
| P0-FC-3 | **3D opzionale** | Scene 3D lazy loaded con `next/dynamic ssr:false`. Sito funziona 100% senza 3D |
| P0-FC-4 | **Zero stringhe hardcoded** | Tutto via `useTranslations()`. Ogni stringa in tutte e 7 le lingue |
| P0-FC-5 | **Performance budget** | LCP < 2s, no layout shift, max 1 Canvas per pagina, IcosahedronGeometry max detail 5 |
| P0-FC-6 | **Contenuti da SSOT** | Testi del sito estratti da SSOT Oracode. MAI inventare claim, frasi, slogan |

---

## Trappole Note (cicatrici reali M-192)

```
[CICATRICE] GSAP top-level import → crash SSR "Cannot find module vendor-chunks/gsap.js"
            Fix: dynamic import('gsap') dentro useEffect

[CICATRICE] next/dynamic ssr:false in Provider tree → BAILOUT_TO_CLIENT_SIDE_RENDERING
            Fix: import diretto + GSAP lazy dentro useEffect

[CICATRICE] .reveal { opacity: 0 } senza observer → contenuto invisibile permanente
            Fix: CSS default mostra testo, GSAP aggiunge animazione come enhancement

[CICATRICE] .revealed class mai rimossa su preset change → animazioni identiche
            Fix: strip .revealed quando preset.id cambia, ri-osservare elementi

[CICATRICE] ScrollReveal riscritto 6 volte senza P0-8 → vibe coding
            Fix: P0-8 OBBLIGATORIO prima di toccare ScrollReveal

[CICATRICE] Claim hero inventato ("regge il tempo") → testo assurdo
            Fix: P0-FC-6 — contenuti da SSOT, non dalla testa dell'AI

[CICATRICE] IcosahedronGeometry detail=64 → milioni di vertici, lag
            Fix: P0-FC-5 — max detail 5
```

---

## File Critici

```
# Layout
app/[locale]/layout.tsx              — Per-locale layout (providers + nav + footer)
components/layout/Providers.tsx      — Client provider tree (theme + a11y + scene + animation)
components/layout/Navigation.tsx     — Navbar
components/layout/Footer.tsx         — Footer

# Animazione
components/ui/ScrollReveal.tsx       — Scroll reveal (GSAP dynamic import)
lib/animation.ts                     — PRESETS SSOT (6 preset)
lib/animation-context.tsx            — AnimationProvider context

# 3D
components/three/Scene3DSwitch.tsx   — Dynamic loader scene 3D
components/three/scenes/*.tsx        — 8 scene individuali

# Stato
lib/theme-context.tsx                — Theme provider (dark/light/ambient)
lib/a11y-context.tsx                 — Accessibility provider
lib/scene-context.tsx                — Scene 3D provider
lib/scene3d.ts                       — Scene IDs + localStorage

# i18n
messages/*.json                      — 7 file (it en de es fr pt zh)
lib/i18n/config.ts                   — Locales config
lib/i18n/routing.ts                  — next-intl routing

# Design
app/globals.css                      — CSS tokens (grafite + bronzo + ambient slots)
```

---

## Debiti Tecnici Noti

```
[DEBITO] Dead code: lib/hooks/useAnimation.ts, lib/hooks/useScene.ts — sostituiti da context
[DEBITO] Middleware next-intl incompatibile con output:export — funziona in dev, non in prod
[RISOLTO] ANIMATION_NAMES e SCENE_NAMES → migrati a i18n (7 lingue) in messages/*.json
[DEBITO] Astro residui: README menziona Astro, possibili file .astro
[DEBITO] Dipendenze morte: lenis, zod — mai usate
```

---

## Checklist Pre-Risposta

```
1. Ho TUTTE le info necessarie?           NO → CHIEDI (P0-1)
2. P0-8 fatto prima di scrivere?          NO → STOP
3. GSAP importato dentro useEffect?       NO → STOP (P0-FC-1)
4. Tutte le stringhe via useTranslations? NO → STOP (P0-FC-4)
5. Contenuto preso da SSOT?              NO → STOP (P0-FC-6)
6. Pagina leggibile senza JS?            NO → STOP (P0-FC-2)
7. Testato in browser?                    NO → non dichiarare completo
```