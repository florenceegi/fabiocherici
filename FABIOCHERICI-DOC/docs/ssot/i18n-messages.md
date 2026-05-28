---
ssot_id: i18n-messages
title: i18n Messages — Stringhe localizzate 7 lingue
organ: fabiocherici.com
source: messages/*.json
last_sync: 2026-05-28
last_verified_mission: M-010
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

## Namespace principali

Top-level keys per pagina/area (ordine alfabetico):
`ainous`, `contatti`, `creazioni`, `ecosistema`, `egi`, `epp` (incluso sub-namespace `epp.widgets` — M-009),
`footer`, `home`, `meta`, `nav`, `navbar_quotes`, `not_found`, `numeri`, `oracode`,
`preferences`, `privacy`, `prove`, `softwarehouse`, `under_construction`.

## Consumer

- Tutti i component via `useTranslations()` (client) o `getTranslations()` (server)
- Configurato in `lib/i18n/request.ts`

## Trappole note

- P0-FC-4: ogni nuova stringa → tutte e 7 le lingue
- Diacritics DE: sweep applicato (commit e22d5ec) — verifica nuove chiavi
- Quality gate i18n: 11/11 PASS al momento del bootstrap
- Aggiungere/rinominare chiave → migration coerente in tutti i 7 file
- [CICATRICE M-009] meta.epp_title, meta.epp_description, meta.seo_section_epp erano `null` da bootstrap → fix obbligatorio quando si attiva una pagina con metadata generate. Verificare meta.{page}_title|description non null prima di pubblicare pagina nuova.
- [CICATRICE M-009] Sub-namespace gerarchici (es. `epp.widgets.*`) richiedono parita strutturale, non solo chiave: tutte le 7 lingue devono avere lo stesso albero figli con stesso numero di leaf.
- [CICATRICE M-010] Convenzione naming chiavi: evitare termini che possono triggerare regex linguistici del quality gate. La key `epp.widgets.{apr,arf,bpe}.status_value` matchava pattern DE I-2 `\b\w*ue\w*\b` su `va[lue]` interno, perche la key letterale finisce nel next-intl payload HTML. Rinominata in `status_text` (M-010). Preferire suffissi neutri: `_text`, `_label`, `_body`. Evitare suffissi che contengono digrammi linguistici sensibili (`value` → `ue`, `werk` → DE, ecc.).
- [CICATRICE M-010] Quando si rinomina una key i18n: (1) aggiornare TUTTI i 7 file `messages/*.json` atomicamente, (2) aggiornare TUTTE le callsite `tw(...)` / `t(...)` nel codice (grep esaustivo P0-8 FASE 3), (3) ri-eseguire test funzionali, (4) ri-eseguire quality gate prima della chiusura mission.
