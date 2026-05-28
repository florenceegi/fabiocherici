---
ssot_id: seo
title: SEO — Canonical URL + hreflang alternates + Schema.org helpers
organ: fabiocherici.com
source: lib/seo.ts
last_sync: 2026-05-28
last_verified_mission: M-011
---

# SEO SSOT

## Cosa descrive

Helper SEO per fabiocherici.com:
- Canonical URL builder per ogni pagina
- hreflang alternates per 7 locali
- Metadata config base
- OG image URL builder per pagina/locale
- Schema.org JSON-LD builders (WebPage, BreadcrumbList, FAQPage, ItemList)

## File sorgente

- `lib/seo.ts` — funzioni canonical + alternates + schema builders

## Funzioni esportate

| Funzione | Scopo |
|---|---|
| `buildAlternates(locale, path)` | Canonical URL + hreflang languages map (7 locales + x-default) |
| `buildOgImage(locale, page)` | URL OG image normalizzato `/og/{locale}/{page}.png` (1200x630) |
| `buildPageSchema(opts: PageSchemaOptions)` | Array schema.org: WebPage (+ tipo custom) + BreadcrumbList opzionale |
| `buildFaqSchema(items: FaqItem[])` | Schema FAQPage con Q&A array (M-009) |
| `buildItemListSchema(name, entries)` | Schema ItemList con position+name+description+url opzionale (M-009) |

## Tipi esportati

- `PageSchemaOptions` — opzioni base per `buildPageSchema`
- `FaqItem` — `{ question, answer }` (M-009)
- `ItemListEntry` — `{ name, description, url? }` (M-009)

## Consumer

- Tutte le `app/[locale]/**/page.tsx` (metadata export + JSON-LD inline)
- `app/[locale]/layout.tsx` — metadata root locale
- `app/[locale]/epp/page.tsx` — utilizza FaqSchema (2 widget fiscalita lato donatore — M-009) + ItemListSchema (3 programmi APR/ARF/BPE — M-009). M-011 ha aggiunto sezione 14 "Fiscalita lato EPP" con 2 widget EppAccordion (noprofit + azienda) ma SENZA estensione FaqSchema/ItemListSchema (scelta di design: contenuto narrativo legale/fiscale, non FAQ Q&A — il rendering inline e sufficiente per SEO, no markup strutturato aggiuntivo richiesto)

## File correlati

- `lib/i18n/config.ts` — locales source per hreflang
- Pagine generano JSON-LD inline via `<script type="application/ld+json">`

## Trappole note

- Cambiare locales → rigenera hreflang in TUTTE le pagine
- Canonical deve essere absolute URL `https://fabiocherici.com/{locale}/...`
- OG images: 84 immagini (12 pagine × 7 locali) in `public/og/` (vedi commit 95edd2e)
- `buildFaqSchema`: il testo answer deve essere plain text (Schema.org Answer.text), niente HTML
- `buildItemListSchema`: position parte da 1, name+description sempre obbligatori, url opzionale
- [CICATRICE M-010] Meta description: rispettare soglia SEO Google **≤160 chars** per ogni locale. Il quality gate `web_quality_gate.py` (criterio S-3) blocca commit con meta description >160 chars. Quando il brief contiene testo destinato sia a sezione interna sia a meta tag, **distinguere le due versioni** (interno full vs meta ≤160 chars) — non riusare letteralmente. Verifica in fase di scrittura `meta.{page}_description` per tutti i 7 locale prima di chiudere mission che attiva pagina nuova.
- [CICATRICE M-010] Quality gate hook `web-quality-gate-guard.sh` va **rigenerato e verificato PRIMA** di FASE 6 advance → auditing/closed, non dopo. Aggiungere passaggio esplicito al protocollo mission per fabiocherici.com.
- [CICATRICE M-011] Quando si aggiunge contenuto narrativo a una pagina gia attiva (es. nuova sezione widget) e il contenuto NON e FAQ-shape (Q&A esplicita): NON forzare `buildFaqSchema` — il payload semantico HTML del nextintl render e sufficiente per i crawler. `FaqSchema` va riservato a domanda/risposta strutturate (vedi widget fiscalita_individuali/aziende M-009). Estensione narrativa lato EPP (M-011: noprofit + azienda) ha intentionally skipped FaqSchema/ItemListSchema — registrazione esplicita per evitare drift futuri.
