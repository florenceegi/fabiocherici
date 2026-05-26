---
ssot_id: i18n-messages
title: i18n Messages — Stringhe localizzate 7 lingue
organ: fabiocherici.com
source: messages/*.json
last_sync: 2026-05-26
---

# i18n Messages SSOT

## Cosa descrive

Tutte le stringhe UI di fabiocherici.com in 7 lingue.
File per locale: `it.json`, `en.json`, `de.json`, `es.json`, `fr.json`, `pt.json`, `zh.json`.

Chiavi atomiche, gerarchiche per pagina/component.

## File sorgente

- `messages/it.json` — italiano (default)
- `messages/en.json` — inglese (fallback)
- `messages/de.json` — tedesco
- `messages/es.json` — spagnolo
- `messages/fr.json` — francese
- `messages/pt.json` — portoghese
- `messages/zh.json` — cinese

## Consumer

- Tutti i component via `useTranslations()` (client) o `getTranslations()` (server)
- Configurato in `lib/i18n/request.ts`

## Trappole note

- P0-FC-4: ogni nuova stringa → tutte e 7 le lingue
- Diacritics DE: sweep applicato (commit e22d5ec) — verifica nuove chiavi
- Quality gate i18n: 11/11 PASS al momento del bootstrap
- Aggiungere/rinominare chiave → migration coerente in tutti i 7 file
