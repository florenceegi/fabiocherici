---
ssot_id: i18n-messages
title: i18n Messages — Stringhe localizzate 7 lingue
organ: fabiocherici.com
source: messages/*.json
last_sync: 2026-06-11
last_verified_mission: M-013
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
`ainous`, `contatti`, `creazioni`, `ecosistema`, `egi`, `epp` (incluso sub-namespace `epp.widgets` — M-009, esteso con `epp.widgets.fiscalita_epp` in M-011),
`footer`, `home`, `meta`, `nav`, `navbar_quotes`, `not_found`, `numeri`, `oracode`,
`preferences`, `privacy`, `prove`, `softwarehouse`, `under_construction`.

### Sub-namespace `epp.widgets` (cronologia)

- **M-009**: introdotto `epp.widgets` con 6 sezioni accordion: `ragion_essere`, `apr`, `arf`, `bpe`, `fiscalita_individuali`, `fiscalita_aziende`.
- **M-011**: esteso con `epp.widgets.fiscalita_epp` (sezione 14 della pagina EPP) — 2 widget lato EPP:
  - `fiscalita_epp.noprofit` — piccolo ente no profit (ETS/ONLUS, D.Lgs. 117/2017)
  - `fiscalita_epp.azienda` — grande ente/azienda/gruppo strutturato (OIC, IAS/IFRS, D.Lgs. 231/2007)
  - Chiavi sezione: `section_badge`, `section_title`, `section_subtitle`, `section_intro`, `section_outro`
  - Chiavi per widget: `badge`, `title`, `subtitle`, `how_title`, `how_items` (array), `example_title`, `example_body`, `sources_title`, `sources_body`
  - Widget `azienda` ha in piu: `principle_title`, `principle_body`
  - Parita strutturale: 7 lingue, 25 chiavi/locale, alberi identici (verifica strutturale superata).

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
- [CICATRICE POSITIVA M-011] Convenzione naming applicata correttamente al primo colpo nel nuovo sub-namespace `epp.widgets.fiscalita_epp`: suffissi neutri `_title`, `_body`, `_items`, `_text` — nessun digramma linguistico sensibile (no `_value`/`_werk`/ecc.). Pattern riusato da M-009 + lezione M-010 internalizzata. Zero retry quality gate richiesti su nomi chiave.
- [CICATRICE M-011] Quando si aggiunge un nuovo widget al sub-namespace `epp.widgets.*`: (1) definire schema chiavi PRIMA della scrittura it.json (sezione + widget), (2) replicare struttura identica nelle altre 6 lingue (parita strutturale obbligatoria — vedi CICATRICE M-009), (3) usare array per liste enumerate (`how_items: [...]`) consumate via `tw.raw(...)` lato React, (4) aggiungere icone necessarie a `components/ui/EppIcons.tsx` mantenendo @version semver + lista @mission aggiornata.
- [CICATRICE M-012] Rename label porta home: `home.door_egi` da `"EGI"` → `"Florence EGI"` su tutti i 7 locale (1 sostituzione x file, trigger 2 substitutive). Valore IDENTICO in tutte le 7 lingue (brand non tradotto). Pattern per rename brand label: (1) grep esaustivo della key per identificare tutte le occorrenze (deve essere 1 sola per file: la definizione), (2) sed/Edit atomico su tutti i 7 file con stesso valore, (3) verifica callsite di `door_egi` in componenti Home (non richiede modifica codice — solo payload i18n cambia). Brand names non traducibili: stesso valore in tutte le lingue, evitare localizzazione "creativa".
- [CICATRICE M-013] Label count-specifiche nelle stringhe UI: `home.nav_label` era `"Sei porte"` (e equivalenti nei 7 locale) — quando M-013 ha ridotto le porte visibili da 6 a 3 (home provvisoria: softwarehouse, egi, epp), l'aria-label è diventata incoerente con la UI (finding del gate a11y). Fix: label neutra `"Le porte del sito"` / `"Site doors"` su tutti i 7 locale. Lezione: nelle stringhe i18n evitare di codificare il NUMERO di elementi renderizzati da un array dati (`DOORS` in `app/[locale]/page.tsx`) — se il dato cambia, la stringa mente. Preferire label che descrivono il ruolo, non il conteggio. Le porte oracode/scrittore/ai-nous restano nei messages (chiavi `door_*` e `seo_section_*` intatte): sono ancora consumate dal blocco SEO sr-only e torneranno visibili post-rework Oracode Nexus — NON rimuovere le chiavi.
