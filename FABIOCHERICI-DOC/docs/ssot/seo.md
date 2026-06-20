---
ssot_id: seo
title: SEO — Canonical URL + hreflang alternates + Schema.org helpers
organ: fabiocherici.com
source: lib/seo.ts
last_sync: 2026-06-16
last_verified_mission: M-018
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
- `app/[locale]/ai-transparency/page.tsx` — pagina pubblica trasparenza AI-Act (M-FABIOCHERICI-001): Next/next-intl 7 locale, SSG + JSON-LD, in `public/sitemap.xml` con alternates hreflang per i 7 locale + x-default
- `app/[locale]/layout.tsx` — metadata root locale
- `app/[locale]/epp/page.tsx` — utilizza FaqSchema (2 widget fiscalita lato donatore — M-009) + ItemListSchema (3 programmi APR/ARF/BPE — M-009). M-011 ha aggiunto sezione 14 "Fiscalita lato EPP" con 2 widget EppAccordion (noprofit + azienda) ma SENZA estensione FaqSchema/ItemListSchema (scelta di design: contenuto narrativo legale/fiscale, non FAQ Q&A — il rendering inline e sufficiente per SEO, no markup strutturato aggiuntivo richiesto)

## File correlati

- `lib/i18n/config.ts` — locales source per hreflang
- Pagine generano JSON-LD inline via `<script type="application/ld+json">`

## Trappole note

- Cambiare locales → rigenera hreflang in TUTTE le pagine
- Canonical deve essere absolute URL `https://fabiocherici.com/{locale}/...`
- OG images: 91 immagini (13 pagine × 7 locali) in `public/og/` — M-015 ha aggiunto `softwarehouse` a `scripts/generate-og-images.mjs` (prima: 84 = 12×7, commit 95edd2e). Aggiungere pagina con metadata → aggiungere entry in `PAGES` dello script e rigenerare
- `buildFaqSchema`: il testo answer deve essere plain text (Schema.org Answer.text), niente HTML
- `buildItemListSchema`: position parte da 1, name+description sempre obbligatori, url opzionale
- [CICATRICE M-010] Meta description: rispettare soglia SEO Google **≤160 chars** per ogni locale. Il quality gate `web_quality_gate.py` (criterio S-3) blocca commit con meta description >160 chars. Quando il brief contiene testo destinato sia a sezione interna sia a meta tag, **distinguere le due versioni** (interno full vs meta ≤160 chars) — non riusare letteralmente. Verifica in fase di scrittura `meta.{page}_description` per tutti i 7 locale prima di chiudere mission che attiva pagina nuova.
- [CICATRICE M-010] Quality gate hook `web-quality-gate-guard.sh` va **rigenerato e verificato PRIMA** di FASE 6 advance → auditing/closed, non dopo. Aggiungere passaggio esplicito al protocollo mission per fabiocherici.com.
- [CICATRICE M-011] Quando si aggiunge contenuto narrativo a una pagina gia attiva (es. nuova sezione widget) e il contenuto NON e FAQ-shape (Q&A esplicita): NON forzare `buildFaqSchema` — il payload semantico HTML del nextintl render e sufficiente per i crawler. `FaqSchema` va riservato a domanda/risposta strutturate (vedi widget fiscalita_individuali/aziende M-009). Estensione narrativa lato EPP (M-011: noprofit + azienda) ha intentionally skipped FaqSchema/ItemListSchema — registrazione esplicita per evitare drift futuri.
- [SPIEGATO M-015] PNG OG identici tra i 7 locali per la stessa pagina NON sono un bug: accade quando `meta.{page}_title` ha lo stesso valore in tutte le 7 lingue (caso `epp.png` ×7 — titolo identico nei 7 locali → lo script rasterizza lo stesso testo). Anomalia osservata in M-015 alla rigenerazione OG e spiegata: nessuna azione richiesta. Diventa un bug SOLO se i titoli nei locale differiscono e i PNG restano identici.
- [M-015] Rewrite `/softwarehouse`: `meta.softwarehouse_title` → "Softwarehouse — Vedi prima, decidi dopo" e `meta.softwarehouse_description` aggiornati nei 7 locali (≤160 chars, cicatrice M-010 rispettata); OG `softwarehouse.png` generata per i 7 locali.
- [M-018] De-gergo `meta.softwarehouse_description` nei 7 locali: "un MVP funzionante" → "una prima versione funzionante" (decisione CEO, copy cliente). Soglia ≤160 chars ancora rispettata (la frase si allunga di pochi caratteri). `meta.softwarehouse_title` invariato → **NON serve rigenerare OG** (lo script rasterizza il titolo, non la description). Hero `/softwarehouse` ristrutturato attention-first (Padmin sopra la piega) e **3D rimosso** dalla pagina: cambia il rendering client (LCP = H1 server-rendered, no Canvas above-the-fold) ma metadata/hreflang/canonical/JSON-LD invariati — nessun impatto sui builder di `lib/seo.ts`.
- [M-FABIOCHERICI-001] Nuova rotta pubblica indicizzabile `/ai-transparency` (7 locale) dalla propagazione del **kit AI-Act**: pagina trasparenza Art. 50(1) AI Act, SSG + JSON-LD inline, aggiunta a `public/sitemap.xml` con blocco alternates hreflang completo (7 locale + x-default → it). La pagina usa il namespace i18n `aiTransparency` (vedi `i18n-messages.md`). **Verificare** se va aggiunta a `PAGES` di `scripts/generate-og-images.mjs` (oggi OG = 13 pagine × 7 = 91): la pagina è stata pubblicata SENZA OG dedicata (banner/pagina di compliance, non pagina marketing) — se in futuro le serve una OG card, aggiungere l'entry e rigenerare. Metadata/canonical/hreflang gestiti dai builder esistenti di `lib/seo.ts`, nessuna modifica ai builder.
- [DECISIONE M-013] Home provvisoria a 3 porte visibili (softwarehouse, egi, epp — `DOORS` in `app/[locale]/page.tsx` @version 3.0.0): il blocco SEO `sr-only` resta INTATTO con tutti i 9 link sezione (`seo_section_*`: softwarehouse, oracode, scrittore, ainous, egi, epp, numeri, ecosistema, contatti) per i crawler. Metadata, hreflang e JSON-LD invariati. NON rimuovere i link sr-only delle porte non visibili (oracode/scrittore/ai-nous) pensando che siano dead code: sono deliberati — preservano l'indicizzazione delle sezioni durante la home provvisoria; le porte torneranno visibili post-rework Oracode Nexus. Test di guardia: `tests/m-013/test_home_3_doors.sh`.
