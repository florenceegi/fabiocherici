---
ssot_id: i18n-config
title: i18n Config — 7 lingue + locale metadata
organ: fabiocherici.com
source: lib/i18n/config.ts
last_sync: 2026-05-26
---

# i18n Config SSOT

## Cosa descrive

Configurazione next-intl per fabiocherici.com:
- `locales`: `['it', 'en', 'fr', 'de', 'es', 'pt', 'zh']` (P0-9 + zh)
- `defaultLocale`: `'it'`
- `fallbackLocale`: `'en'`
- `localeNames`: nomi nativi delle lingue

## File sorgente

- `lib/i18n/config.ts` — locales, default, names

## File correlati

- `lib/i18n/routing.ts` — next-intl routing (prefix always)
- `lib/i18n/request.ts` — Server Component i18n setup
- `messages/{locale}.json` — stringhe per ogni lingua

## Trappole note

- Aggiungere lingua → aggiornare locales + creare `messages/{locale}.json` + tradurre TUTTE le chiavi
- Middleware next-intl incompatibile con `output:export` (vedi debito noto in CLAUDE.md)
- P0-FC-4: zero stringhe hardcoded, tutto via `useTranslations()`
