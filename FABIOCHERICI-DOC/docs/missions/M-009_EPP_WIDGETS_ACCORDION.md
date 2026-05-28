---
id: M-009
title: EPP page — 6 widget HTML5 details accordion inline (Ragion d'essere + APR/ARF/BPE programmi + fiscalità individuali/aziende)
tipo_missione: feature
organi_coinvolti: [fabiocherici.com]
priority: P1
trigger_matrix: 2
status: planning
date_open: 2026-05-28
date_close: null
found_by: CEO brief — BRIEF_LSO_EPP_WIDGETS.md (Padmin D. Curtis per Fabio Cherici, 27 mag 2026)
ssot_brief: docs/missions/BRIEF_LSO_EPP_WIDGETS.md v1.1.0
ssot_semantica: SSOT_EPP.md v1.0.0
ssot_tecniche: [EGI-DOC/04_Gestione_Pagamenti.md, EGI-DOC/06_Gestione_Fiscale.md]
estimated_hours: 9-13
target_audience: visitatori fabiocherici.com pagina EPP (Environment Protection Programs)
---

# M-009 — EPP page widget accordion inline

## Scope

Inserire 6 widget accordion espandibili nella pagina `/epp` esistente di `fabiocherici.com`:

| # | Widget | Posizione | Brief riferimento |
|---|---|---|---|
| 1 | **Ragion d'essere** | Dopo Hero, prima di "Come si divide ogni transazione" | brief §2.1 |
| 2 | **APR — Aquatic Plastic Removal** | Sezione "I tre programmi" (dopo "Il ciclo virtuoso") | brief §2.2 |
| 3 | **ARF — Appropriate Restoration Forestry** | Sezione "I tre programmi" | brief §2.3 |
| 4 | **BPE — Bee Population Enhancement** | Sezione "I tre programmi" | brief §2.4 |
| 5 | **Fiscalità — donatori individuali** | Sezione "Fiscalità" (dopo "Come appare un ente partner", prima del CTA) | brief §2.5 |
| 6 | **Fiscalità — aziende e grandi enti** | Sezione "Fiscalità" | brief §2.6 |

Ordine finale sezioni pagina: brief §4.1.

---

## Decisioni tecniche CEO (2026-05-28)

- **Pattern accordion**: HTML5 `<details>` + `<summary>` nativi
- **Tipo componente**: Server Component (no `'use client'`, no `useState`, no JS runtime per toggle)
- **Razionale stack**: coerenza con static export Next.js 15 → S3 + CloudFront (vedi `fabiocherici.com/CLAUDE.md`)
- **Animazione**: instant open (UX standard `<details>`), chevron 180° via CSS `group-open:rotate-180`
- **A11y**: nativa via `<summary>` (browser fornisce role button + aria-expanded + screen reader announce + esclusione tab order body chiuso)
- **Focus indicator manuale**: `focus-visible:ring-2 focus-visible:ring-[var(--accent)]`

---

## Deliverable Sprint 1

### D1 — Componente `components/EppAccordion.tsx`

- Server Component (no `'use client'`)
- Pattern HTML5 `<details>` + `<summary>` (vedi decisioni tecniche sopra)
- Props secondo brief §1.1 (`id`, `badge?`, `title`, `subtitle?`, `icon?`, `defaultOpen?`, `children`)
- Styling secondo brief §1.4 (variabili CSS `--surface`, `--surface-glass`, `--bg-elevated`, `--accent`, `--border`, font display, padding, border-radius)
- Posizione file secondo brief §1.5
- Chevron icon: `<ChevronDown>` da `lucide-react` con `transition-transform group-open:rotate-180`

**Stima**: 2h.

### D2 — Contenuti 6 widget

Importare contenuti via i18n keys (D3) dentro 6 invocazioni `<EppAccordion>` nella page.tsx.

Per ogni widget: badge + title + subtitle + icon + body conforme a brief §2.1-2.6.

Vincolo: testo IT identico al brief carattere per carattere (vedi vincoli editoriali sotto).

**Stima**: 1.5h.

### D3 — i18n keys `messages/it.json`

Aggiungere sezione `epp.widgets.*` strutturata secondo brief §3 (schema chiavi `ragione_essere` / `apr` / `arf` / `bpe` / `fiscalita_individuale` / `fiscalita_aziende` con `badge`, `title`, `subtitle`, sezioni body multiple, `status` per i 3 programmi).

Aggiungere anche keys sezione wrapper:
- `epp.widgets.programs_section_title`: "I TRE PROGRAMMI"
- `epp.widgets.programs_section_intro`: testo brief §4.2
- `epp.widgets.fiscal_section_title`: "FISCALITÀ"
- `epp.widgets.fiscal_section_intro`: testo brief §4.2

**Stima**: 1.5h.

### D4 — Traduzioni LLM 6 locale (en/fr/de/es/pt/zh)

In `messages/{en,fr,de,es,pt,zh}.json` generare traduzioni dei 6 widget `epp.widgets.*` rispettando i 4 vincoli stretti brief §3 v1.1.0:

1. **Partire dal testo IT validato §2**: trasposizione linguistica, non riscrittura. No riformulare, no "migliorare", no sintetizzare.
2. **Preservare intatti nomi tecnici e normativa**:
   - Sigle: `APR`, `ARF`, `BPE`, `Aquatic Plastic Removal`, `Appropriate Restoration Forestry`, `Bee Population Enhancement`
   - Entità: `Florence EGI`, `Frangette APS`, `FlorenceEGI S.R.L.`
   - Normativa: `Art. 15 TUIR`, `Art. 10 DPR 633/72`
   - Standard: `OIC`, `IAS/IFRS`
   - Piattaforma: `EGI`, `EPP`, `wallet EPP`, `Stripe Connect`, `creator`, `mint`
3. **Struttura paragrafica 1:1**: ogni paragrafo IT = un paragrafo nella lingua target. No accorpamenti, no riorganizzazione.
4. **Disclaimer normativo widget fiscali (individuale + aziende) in apertura per locale non-IT** — testo letterale brief §3:
   - EN: *"This section refers to Italian tax law."*
   - FR: *"Cette section se réfère à la législation fiscale italienne."*
   - DE: *"Dieser Abschnitt bezieht sich auf das italienische Steuerrecht."*
   - ES: *"Esta sección se refiere a la legislación fiscal italiana."*
   - PT: *"Esta secção refere-se à legislação fiscal italiana."*
   - ZH: *"本节内容适用于意大利税法。"*

Tradurre anche le 4 keys wrapper sezione (`programs_section_title`, `programs_section_intro`, `fiscal_section_title`, `fiscal_section_intro`) e `meta.epp_description` (vedi D7).

**Stima**: 2.5-3h (6 locale × 6 widget + wrapper + meta).

### D5 — Integrazione `app/[locale]/epp/page.tsx`

Modificare il file pagina per inserire:
- Widget Ragion d'essere standalone (sezione propria dopo Hero) — brief §4.2
- Sezione wrapper "I tre programmi" con 3 widget APR/ARF/BPE (codice template brief §4.2)
- Sezione wrapper "Fiscalità" con 2 widget individual/business (codice template brief §4.2)

Ordine finale 14 sezioni: brief §4.1.

**Stima**: 1h.

### D6 — Schema.org JSON-LD

Aggiungere al blocco JSON-LD esistente della pagina EPP:
- `FAQPage` schema per i 2 widget fiscali (brief §5 esempio JSON)
- `ItemList` schema per i 3 programmi APR/ARF/BPE

Eventuale helper `buildFaqSchema` in `lib/seo` se non esiste.

**Stima**: 1h.

### D7 — Fix `meta.epp_description` errato

In `messages/{tutti i 7 locale}.json` correggere `meta.epp_description`:
- Attuale errato: parla di "Eccellenza Professionale Permanente" (vedi brief §5 nota)
- Corretto IT: testo brief §5 ("Environment Protection Programs — il 20% di ogni transazione su Florence EGI va all'ambiente. Tre programmi: APR (acqua), ARF (terra), BPE (biodiversità). Non è marketing: è strutturale.")
- Traduzione 6 locale: applicare 4 vincoli brief §3 v1.1.0 (vedi D4) — sigle APR/ARF/BPE intatte, struttura 1:1, no riscrittura.

**Stima**: 0.5h.

### D8 — Test accettazione

Vedi brief §6 per checklist completa. Sintesi vincolante:

| Test | Soglia |
|---|---|
| axe DevTools sui widget | 0 errori a11y |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse SEO | ≥ 95 |
| Google Rich Results Test | FAQPage validato |
| Contrasto WCAG AA badge | verificato per ogni badge |
| Funzionale apertura/chiusura | 6/6 widget OK |
| Chevron rotazione 180° all'open | OK su tutti |
| Tab navigation | naturale browser default |
| Keyboard activation | Invio + Spazio default `<summary>` |
| Contenuto testo IT | IDENTICO al brief carattere per carattere |
| 7 locale struttura keys | tutti presenti |
| Sigle APR/ARF/BPE preservate nei 6 locale | grep verificato — zero traduzioni accidentali |
| Disclaimer normativo widget fiscali en/fr/de/es/pt/zh | testo letterale brief §3 presente in apertura |
| Struttura paragrafica 1:1 IT vs 6 locale | conteggio paragrafi identico per ogni widget |
| Normativa intatta (Art. 15 TUIR, Art. 10 DPR 633/72) nei 6 locale | grep verificato |

**Stima**: 2-2.5h (test base + verifiche §3 sui 6 locale).

---

## Totale stima Sprint 1: **9-13h**.

---

## Vincoli editoriali (OBBLIGATORI, dal brief §0-§2-§6)

### Vincolo SSOT semantica (REGOLA ZERO)

Il testo IT dei widget è **identico al brief carattere per carattere**. Se serve modificare anche solo una virgola rispetto al brief, fermarsi e chiedere a Fabio. Nessun "miglioramento" arbitrario.

### Vincoli specifici (dal brief, citare sezioni)

- **Ragion d'essere** (brief §2.1 note): tono prima persona singolare CEO. Niente "sostenibilità ambientale" / "economia circolare" / vocabolario ESG generico. Vocabolario canone Frangette.
- **APR/ARF/BPE programmi** (brief §2.2/§2.3/§2.4 sezioni "Cosa NON scrivere"):
  - NO numeri inventati (kg plastica, alberi, ettari, % riciclo, tonnellate CO₂)
  - NO partner specifici al presente (usare solo "selezione partner sul campo in corso")
  - APR: NO "spiagge / aree urbane" — solo bacini idrici
  - ARF: NO "patrimonio boschivo italiano" — non è limitato all'Italia
  - BPE: nome ufficiale "Bee Population Enhancement", NON "Protection & Education"
- **Fiscalità individuale** (brief §2.5 note): NO percentuali detrazione specifiche — dipende ente ricevente. URL dashboard donazioni: verificare prima del deploy.
- **Fiscalità aziende** (brief §2.6): cita Art. 22% IVA ordinaria + Art. 10 DPR 633/72 esenzioni opere d'arte. "Florence EGI NON è sostituto d'imposta" frase letterale obbligatoria in entrambi widget fiscalità.

### Localizzazione (Sprint 1) — brief §3 v1.1.0

**Tutti i 7 locale completi in Sprint 1**. Traduzioni LLM ammesse rispettando i 4 vincoli stretti brief §3 v1.1.0 (vedi D4):

1. Trasposizione linguistica del testo IT validato §2 — no riscrittura
2. Sigle/entità/normativa/standard/platform terms intatti
3. Struttura paragrafica 1:1
4. Disclaimer normativo letterale nei widget fiscali per 6 locale non-IT

Nessuno Sprint 2 traduzioni: i 7 locale escono insieme nel Sprint 1.

---

## Trigger Matrix 2 (comportamentale)

Non Tipo 3 architetturale perché:
- Nuovo componente Server `EppAccordion.tsx` è stateless (no client, no state, no nuova dipendenza)
- Nessuna nuova route, nessun nuovo endpoint
- i18n keys additive
- Schema JSON-LD additive
- Fix meta description = correzione stringa

DOC-SYNC obbligatorio (Trigger 2+).

Se durante esecuzione emerge necessità di nuova dipendenza/architettura → escalation a Trigger 3 + ri-pianificazione.

---

## Sprint roadmap

### Sprint 1 — questa mission

Lifecycle Mission Protocol:
- FASE 1: design SSOT (questo doc) — completata con M-009 open
- FASE 2: piano + approvazione CEO esplicita
- FASE 3: review opzionale Watchdog
- FASE 4: implementazione D1-D8 (~7-10h)
- FASE 5: review deliverable + CEO approval
- FASE 6: DOC-SYNC v2 + retrospective + mission report finale + commit + push

**Output Sprint 1**: 6 widget live in produzione su `/epp` per **tutti i 7 locale** (IT validato + 6 traduzioni LLM brief §3 v1.1.0), schema FAQPage attivo, meta description corretta in 7 lingue.

### Sprint 2 — non previsto

Le traduzioni sono incluse in Sprint 1 (brief §3 v1.1.0 corretto da CEO 2026-05-28).

---

## Punti aperti da chiarire (dal brief §7) — TODO non bloccanti

1. URL dashboard donazioni `https://art.florenceegi.com/account/donations` — verificare PRIMA del deploy
2. Bug `meta.epp_description` — incluso in D7
3. Schema FAQPage — incluso in D6 (conferma CEO in audit pre-deploy)
4. `defaultOpen` "Ragion d'essere" — proposta `false` per coerenza, CEO può chiedere `true`
5. Conferma URL/path dashboard donazioni in widget fiscalità individuale

---

## SSOT prodotti / impattati

**Nuovi:**
- `components/EppAccordion.tsx`
- `messages/it.json` → sezione `epp.widgets` aggiunta (IT validato §2)
- `messages/{en,fr,de,es,pt,zh}.json` → sezione `epp.widgets` traduzioni LLM brief §3 v1.1.0 (4 vincoli + disclaimer fiscale)

**Modificati:**
- `app/[locale]/epp/page.tsx` (integrazione widget + 2 sezioni wrapper)
- `messages/{tutti i 7 locale}.json` → `meta.epp_description` corretto
- `lib/seo` → eventuale helper `buildFaqSchema` se non esiste

**SSOT registry FABIOCHERICI-DOC:**
- Aggiornare entry pagina EPP se cambia significativamente struttura

---

## Note di chiusura

Questa mission è **istruzione operativa** per implementare il brief `BRIEF_LSO_EPP_WIDGETS.md`. Il brief resta SSOT semantica vincolante.

Vincolo finale REGOLA ZERO (Oracode): davanti a qualsiasi lacuna durante implementazione → fermarsi e chiedere a Fabio. NON chiedere a LLM di "riempire".

---

**Firma**: Padmin D. Curtis (AI Partner OS3.0) per Fabio Cherici — M-009 open 2026-05-28
