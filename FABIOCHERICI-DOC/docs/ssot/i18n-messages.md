---
ssot_id: i18n-messages
title: i18n Messages — Stringhe localizzate 7 lingue
organ: fabiocherici.com
source: messages/*.json
last_sync: 2026-06-25
last_verified_mission: M-FABIOCHERICI-002
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
`ainous`, `aiTransparency` (M-FABIOCHERICI-001 — pagina /ai-transparency + kit AI-Act), `contatti`, `creazioni`, `ecosistema`, `egi`, `epp` (incluso sub-namespace `epp.widgets` — M-009, esteso con `epp.widgets.fiscalita_epp` in M-011),
`footer`, `home`, `meta`, `nav`, `navbar_quotes`, `nexus` (M-017 — widget operatore AI Padmin),
`not_found`, `numeri`, `oracode`, `preferences`, `privacy`, `prove`, `softwarehouse`,
`under_construction`.

### Namespace `softwarehouse` (cronologia)

- **M-008**: namespace originario (pagina softwarehouse v1).
- **M-015**: rewrite completo della pagina → namespace ristrutturato: 202→112
  chiavi flat (it.json: 56 nuove — gruppi `live_*` widget cantiere live,
  `lso_*` sezione Oracode Nexus→LSO, `demos_*`, `cta_*` — e 146 eliminate
  con le sezioni rimosse). Le chiavi `pricing_*` e `process_*` (SSOT
  commerciale, M-008) restano la fonte vincolante per prezzi/processo.
  Aggiornate anche `meta.softwarehouse_title` ("Softwarehouse — Vedi prima,
  decidi dopo") e `meta.softwarehouse_description` nei 7 locali (≤160 chars
  verificato: max 145, DE). Parità strutturale 7 lingue mantenuta.
- **M-017**: namespace `softwarehouse` esteso con le 4 chiavi del richiamo al
  widget operatore AI: `padmin_section_label`, `padmin_section_title`,
  `padmin_section_intro`, `lso_talk_above` (richiamo "Parla con Padmin qui
  sopra ↑" dalla sezione LSO verso il widget spostato in cima). 7 lingue.
- **M-018**: hero attention-first + **de-gergo "MVP" nella copy CLIENTE**.
  Sostituzione di "MVP" → "prima versione funzionante" su **56 stringhe**
  `softwarehouse.*` nei 7 file (es. `hero_sub`, `offer_1_desc`, `process_step_5`,
  `process_step_6` ("Fino a 3 MVP" → "Fino a 3 cicli"), `process_closing`,
  `process_phase_3_label` ("VALIDAZIONE MVP" → "VALIDAZIONE PRIMA VERSIONE"),
  `pricing_label_deposit` ("Caparra MVP" → "Caparra prima versione"),
  `meta.softwarehouse_description`). Decisione CEO: l'acronimo inglese non è
  comprensibile alle PMI; il termine tecnico **non si usa mai col cliente**. Lo
  SSOT INTERNO `commercial-claims.md` resta INVARIATO (MVP = termine interno).
  Nuova chiave `softwarehouse.hero_trust` ("Cantiere live · GitHub pubblico").
  Parità strutturale 7 lingue mantenuta.

### Namespace `nexus` (M-017)

Introdotto in M-017 — tutte le stringhe del **widget operatore AI "Padmin"**
(chat in cima a /softwarehouse + oracode.fabiocherici.com — rename M-FABIOCHERICI-002, ex nexus.fabiocherici.com che ora 301→oracode): nome/ruolo/disclosure
AI, label avatar, log conversazione, input/send/typing/status, contatore e
messaggio rate-limit, errori generici, allega/rimuovi immagine + errori immagine
(tipo/dimensione/lettura), vetrina opere `showcase_*` (titolo, by, aria, empty +
CTA FlorenceEGI), ticker `wisdom_*` (label + 7 massime dal paradigma Oracode).
**36 chiavi/locale, parità strutturale 7 lingue verificata** (it en de es fr pt zh).
Consumato da `components/softwarehouse/nexus/*` via `useTranslations('nexus')`.

- **M-018**: namespace `nexus` esteso con i **prompt-seed** del hero
  attention-first (3-4 prompt cliccabili che avviano Padmin nel primo viewport):
  `seed_intro` ("Non sai da dove iniziare? Prova:"), `seed_1`, `seed_2`, `seed_3`.
  Consumati via prop `seeds` di `PadminChat`/`NexusWidget`/`AdvisorSlot`. 7 lingue.

### Namespace `privacy` (M-017 — trattamento dati operatore AI)

M-017 ha esteso 5 chiavi `privacy.*` perché il sito ora **tratta dati personali**
quando l'utente usa l'operatore AI (prima la privacy dichiarava "non raccoglie
dati"): `data_collected_body` (IP pseudonimizzato via hash non reversibile +
elaborazione messaggio/immagine), `legal_basis_body` (aggiunto legittimo
interesse **Art. 6(1)(f) GDPR** per l'anti-abuso, accanto al consenso 6(1)(a)
del form), `storage_body` (identificativo pseudonimizzato conservato max 30
giorni poi cancellato), `third_party_body` (**OpenAI, USA** sub-processor per la
sola generazione della risposta — contenuti non usati per training). Modifica
**sostitutiva nel testo** ma additiva nel significato (il claim "non raccoglie
dati su server propri" resta vero per il sito statico; l'operatore è un servizio
separato dichiarato). 7 lingue, 6(1)(f) presente in tutti i locali.

### Namespace `aiTransparency` (M-FABIOCHERICI-001 — pagina trasparenza AI-Act)

Introdotto in M-FABIOCHERICI-001 per la nuova pagina pubblica `/ai-transparency`
(`app/[locale]/ai-transparency/page.tsx`) richiesta dalla propagazione del **kit
AI-Act** (banner di disclosure Art. 50(1) AI Act sulla chat Padmin + pagina di
trasparenza dedicata). 10 chiavi/locale: `title`, `intro` (preserva il claim
"risposte fondate sui documenti del progetto" — coerente con `commercial-claims`
§5.2), `modelsHeading`, `modelsBody`, `advisoryHeading`, `advisoryBody`,
`reportHeading`, `reportBody`, `contactHeading`, `contactBody`. **7 lingue, parità
strutturale verificata** (it en de es fr pt zh; zh presente).

Nota kit AI-Act: il **testo del banner** non vive in `messages/*.json` ma nel kit
canonico `components/ai-act/ai-disclosure-i18n.ts` (copia verbatim md5-identica da
M-DIM-003, canonico 6 lingue — `zh` cade in fallback `en`). `PadminChat.tsx` ora
monta `<AiDisclosureBanner variant="inline" locale={useLocale()}
transparencyUrl="/{locale}/ai-transparency">` al posto della disclosure ad-hoc
(Strategia Delta — la vecchia stringa disclosure del namespace `nexus` resta nei
messages ma non è più montata dal banner). Strato additivo rispetto al namespace
`privacy` di M-017 (GDPR): qui = **trasparenza AI Art. 50(1)**, lì = trattamento dati.

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
