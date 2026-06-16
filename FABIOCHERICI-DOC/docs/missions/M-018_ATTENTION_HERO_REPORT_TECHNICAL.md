# M-018 — Report Tecnico: /softwarehouse attention-first

**Mission:** M-018 | **Data:** 2026-06-16 | **Commit:** `475543e` su main | **Trigger:** 2
**Status:** deployato e verificato live (chat sopra la piega, 0 MVP, no 3D)

## Scope
Migliorare la cattura d'attenzione nei primi 3 secondi e portare all'interazione con Padmin.
Design: `ATTENTION_HERO_RECOMMENDATION.md` (engineer-product, Opzione A, CEO-approvato).
Web-research craft sales-page: above-the-fold, hero formula, 3-6s, pulito>affollato.

## Cosa è cambiato
- **Hero split** (`SoftwarehouseHero.tsx` ora server component): promessa (claim SSOT "Vedi il
  tuo software funzionare. Poi decidi." + sub + trust) a sx, **widget Padmin a dx nel primo
  viewport** = azione primaria. 3 prompt-seed cliccabili che inviano subito a Padmin
  (`PadminChat` esteso con prop `seeds`, click→send).
- **3D rimosso** da softwarehouse (era inteso solo per la homepage — `Scene3DSwitch` tolto da
  hero+page). Beneficio LCP/GPU.
- **De-gergo "MVP"** → "prima versione funzionante" nella copy cliente: `messages/*.json`
  namespace softwarehouse (56 stringhe ×7 lingue, 0 "MVP" residuo) + `commercial-claims-public.md`.
  SSOT interno `commercial-claims.md` invariato. Padmin (prompt) già senza MVP.
- Una sola CTA primaria (Padmin); email/WhatsApp solo nella CTA finale.

## Gate
- tsc pulito · 26 vitest verdi (3 nuovi: prompt-seed) · test mission m-018 GREEN
- web-quality-gate softwarehouse: PASS · build con/senza env OK · LCP=H1 testo, no CLS, no Canvas
- live verificato: nexus-chat-input above-the-fold, 0 "MVP"

## Debiti/note
- [da validare CEO] traduzioni seed + de-gergo 7 lingue (non madrelingua); meta.softwarehouse_description de-gergata (copy SEO)
- [da misurare] eye-flow/LCP reale/contrasto chip — 5-second test in browser
- metriche activation (% che scrive a Padmin) su static export → analytics client/eventi backend (aperto)
