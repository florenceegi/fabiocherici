# Diff narrativo — SSOT `seo`

**Mode**: additive
**Mission**: M-009
**File**: `FABIOCHERICI-DOC/docs/ssot/seo.md`
**Hash before**: `27bd88c90b5cbc33a60ecf62b16354239776beea56ab2d1fe47ea85d5dfd1445`
**Status**: applied

## Cosa cambia

L'aggiornamento e' puramente additivo. Le funzioni e i tipi gia' descritti restano invariati. Si aggiungono:

### Front matter
- `title`: esteso da "Canonical URL + hreflang alternates" a "Canonical URL + hreflang alternates + Schema.org helpers"
- `last_sync`: 2026-05-26 → 2026-05-28

### Sezione "Cosa descrive"
- Aggiunto bullet OG image URL builder
- Aggiunto bullet Schema.org JSON-LD builders (WebPage, BreadcrumbList, FAQPage, ItemList)

### Nuova sezione "Funzioni esportate"
Tabella con 5 funzioni:
- 3 pre-esistenti documentate retroattivamente: `buildAlternates`, `buildOgImage`, `buildPageSchema`
- 2 nuove da M-009: `buildFaqSchema`, `buildItemListSchema`

### Nuova sezione "Tipi esportati"
- `PageSchemaOptions` (pre-esistente, ora dichiarato)
- `FaqItem` (M-009)
- `ItemListEntry` (M-009)

### Sezione "Consumer"
- Aggiunto riferimento ad `app/[locale]/epp/page.tsx` con uso specifico FaqSchema + ItemListSchema (tracciabilita M-009)

### Sezione "Trappole note"
- Aggiunte due trappole specifiche M-009:
  - `buildFaqSchema`: answer plain text only (no HTML)
  - `buildItemListSchema`: position 1-based, name+description obbligatori, url opzionale

## Nessuna firma esistente alterata

Le funzioni `buildOgImage`, `buildAlternates`, `buildPageSchema` restano invariate nel sorgente.
Nessun comportamento documentato e' stato modificato.
