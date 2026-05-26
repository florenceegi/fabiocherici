---
ssot_id: seo
title: SEO — Canonical URL + hreflang alternates
organ: fabiocherici.com
source: lib/seo.ts
last_sync: 2026-05-26
---

# SEO SSOT

## Cosa descrive

Helper SEO per fabiocherici.com:
- Canonical URL builder per ogni pagina
- hreflang alternates per 7 locali
- Metadata config base

## File sorgente

- `lib/seo.ts` — funzioni canonical + alternates

## Consumer

- Tutte le `app/[locale]/**/page.tsx` (metadata export)
- `app/[locale]/layout.tsx` — metadata root locale

## File correlati

- `lib/i18n/config.ts` — locales source per hreflang
- Schema.org JSON-LD via `lib/schema.ts` (se esiste)

## Trappole note

- Cambiare locales → rigenera hreflang in TUTTE le pagine
- Canonical deve essere absolute URL `https://fabiocherici.com/{locale}/...`
- OG images: 84 immagini (12 pagine × 7 locali) in `public/og/` (vedi commit 95edd2e)
