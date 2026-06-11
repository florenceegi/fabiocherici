# WEB QUALITY GATE REPORT — /softwarehouse (M-015)

Progetto:   fabiocherici.com   Framework: Next.js 15 (static export)
web_root:   /home/fabio/fabiocherici.com (".")   Locales: it,en,de,es,fr,pt,zh
Pagine analizzate: out/{it,en,de,es,fr,pt,zh}/softwarehouse.html (7)
SSOT:       WEB_PAGE_QUALITY_GATE.md v1.3.0 (letto da {{paradigm_root}}/standards/)
SSOT claim: commercial-claims v1.1.0 (P0-FC-6)
Gate deterministico: RIESEGUITO — 277/277 PASS, exit 0
  (JSON: audit/web-quality/WQG_softwarehouse_M-015_deterministic.json)

## VERDETTO: ⚠️ WARN (re-verdetto 2026-06-12 — BLOCK rimosso, vedi §RE-VERDETTO)

~~🔴 BLOCK~~ — Il criterio mandatory Asse 1 (I-8 / P0-2 / P0-FC-4) FAIL del run
precedente è stato FIXATO e ri-verificato su sorgente + build (7 locale).
Restano: 3 WARN in queue (fuori scope M-015, non ri-valutati su istruzione
mission) + gate umano Asse 2 (giudizio CEO dal vivo, SSOT §5).

---

## RE-VERDETTO 2026-06-12 (post-fix I-8)

**Fix verificato — il critico I-8 è RISOLTO.**

Verifica sorgente:
- `app/[locale]/softwarehouse/page.tsx:88` → `const tf = await getTranslations('footer')`;
  righe 204 e 344: `<span className="sr-only"> ({tf('opens_new_tab')})</span>` — OK.
- `app/[locale]/softwarehouse/page.tsx:287` → passa `opensNewTabLabel={tf('opens_new_tab')}`
  a PortfolioCard — OK.
- `components/infographics/PortfolioCard.tsx:28,39,82` → nuova prop opzionale
  `opensNewTabLabel`, non-breaking. Diff minimale (5 righe), nessun'altra modifica.

Verifica build (it + de + zh a campione, grep su tutte e 7):
- `", opens in new tab"` hardcoded: **0 occorrenze in tutte e 7 le locale**
  (era 6 per file).
- Indicatore sr-only localizzato: 25 occorrenze per locale (era 19) — i 3 span
  fixati ora usano la chiave (×2 con duplicato payload RSC: 19+6=25, coerente).
- TUTTI i 12 anchor `target="_blank"` (incl. i 3 del finding: GitHub cantiere,
  WhatsApp CTA, IdealOro live → preview.florenceegi.com) hanno l'indicatore
  sr-only nella lingua corretta, verificato sul DOM di it/de/zh.

Gate deterministico: **RIESEGUITO DA QUESTO AGENTE** sulla build fresca
(il JSON precedente era anteriore al rebuild) → **277/277 PASS, exit 0**,
JSON rigenerato.

Nessuna regressione: diff del fix limitato ai 3 punti dichiarati; conteggio
anchor invariato (12); nessun caller di PortfolioCard oltre a
softwarehouse/page.tsx (che passa la prop).

Nota residua (→ accorpare a WARN-3 in queue): il fallback EN
`', opens in new tab'` resta in `PortfolioCard.tsx:82` come ramo else — oggi
dead-path (unico caller passa la prop), ma latente se un futuro caller la
omette. Da bonificare con la pulizia I-8 site-wide.

WARN-1/2/3 del run precedente: **non ri-valutati** (istruzione mission M-015),
restano in queue. Gate umano Asse 2: invariato, giudizio CEO dal vivo richiesto
prima di dichiarare "distinzione PASS" (SSOT §5).

---

### 🔴 CRITICI (BLOCK) — Asse 1 mandatory

**I-8 — Testo hardcoded inglese ", opens in new tab" esposto agli screen reader
in tutte e 7 le locale.**

3 occorrenze DOM per locale (×7 = 21 esposizioni; le altre 3 per file sono
duplicati nel payload RSC):

| Sorgente | Link | Note |
|---|---|---|
| `app/[locale]/softwarehouse/page.tsx:203` | GitHub (cantiere) | accessible name misto IT+EN per SR |
| `app/[locale]/softwarehouse/page.tsx:342` | WhatsApp CTA | mascherato da `aria-label` localizzato, ma il codice viola comunque I-8 |
| `components/infographics/PortfolioCard.tsx:79` | IdealOro "vedi live" | componente condiviso (anche creazioni, i-numeri) |

Evidenza: in `out/it/softwarehouse.html` convivono 19× "si apre in una nuova
scheda" (chiave `footer.opens_new_tab`, corretta) e 6× ", opens in new tab"
(hardcoded). Stesso pattern in de/fr/zh (verificato).

**Fix esatto:** sostituire i 3 span con `{t('opens_new_tab')}` dal namespace
`footer` (chiave già tradotta in 7 lingue, messages/*.json:34) o promuovere la
chiave a namespace condiviso. Rebuild + re-run gate.

Nota: lo script certifica A-11 per *presenza* dell'indicatore, non per lingua —
per questo i 277/277 PASS non lo catturano. Occorrenze gemelle fuori scope
M-015: `creazioni/page.tsx` (6), `i-numeri/page.tsx` (3), `EvidenceBox.tsx` —
da bonificare in queue (vedi WARN-3).

### ⚠️ IMPORTANTI (WARN)

**WARN-1 — F-9 (integrità segnali di fiducia), site-wide pre-esistente.**
Footer: badge "WCAG AA", "GDPR", "Zero tracking" sono `<span>` statici con
pallino verde, senza link a prova. "SSL A+" e "Security A+" linkano
correttamente SSLLabs/securityheaders. F-9 è mandatory ma il footer è
componente site-wide introdotto prima di M-015 (commit 895959c) → per §5
eccezione site-wide: WARN + entry MISSION_QUEUE. Fix suggerito: WCAG AA →
WAVE report; GDPR/Zero tracking → pagina /privacy; oppure rimozione badge.

**WARN-2 — Coerenza copy cross-page: narrativa softwarehouse VECCHIA nei
namespace home/seo.** `home.desc_softwarehouse` ("Qualità enterprise a costo
accessibile…") e `home.seo_section_softwarehouse` ("…portfolio di 20 progetti
misurati") descrivono la pagina con la narrativa pre-M-015 e con il frame
"enterprise a basso costo" che commercial-claims §4.3 vieta senza evidenza
terza (riformulazione ammessa: "prezzo pubblico — confronta tu"). Renderizzate
sulla HOME (`app/[locale]/page.tsx:64` + door card), non su /softwarehouse —
ma spedite nel payload RSC di ogni pagina. Fuori scope DOM M-015 → WARN +
queue: allineare le door card home alla narrativa "vedi prima, decidi dopo".

**WARN-3 — Bonifica site-wide I-8.** Le altre occorrenze hardcoded di
", opens in new tab" (creazioni, i-numeri, EvidenceBox) vanno in queue.

### 🎨 ASSE DISTINZIONE (giudizio CEO — §8 passo 4)

Verificato staticamente (PASS statico):
- CR-4 ritmo: 8 sezioni con alternanza `bg-elevated`/`bg` regolare.
- CR-5 chiusura attiva: "Prima chiamata: esci con un parere onesto" + CTA
  mail/WhatsApp. Nessun muro statico.
- CR-6 sistema: PortfolioCard, LiveSiteStats, AdvisorSlot, ScrollReveal
  componenti riusati, non one-off.
- MO-5/PE-3: `prefers-reduced-motion` in globals.css (3 blocchi) + gestito in
  LiveSiteStats (count-up disattivato); GSAP via `import()` in useEffect.
- PE-1/MO-7: contenuto integrale server-rendered; fallback cantiere senza
  numeri (vincolo CEO "no placeholder" rispettato).

NON misurabile staticamente — rimandato al CEO dal vivo (desktop + mobile):
- CR-1 anti-mediano: il momento memorabile (hero 3D ambient + count-up
  cantiere live) va giudicato a schermo, non da markup.
- CR-8 identità riflessa, MO-2/3 resa reveal/parallax, qualità del count-up.
La mission non chiude "distinzione PASS" senza questo giudizio.

### 📝 INFO

- Frame claim SSOT rispettati IN PAGINA: zero hit per Trustpilot (testimonial
  M-008-bis rimossi), 50%, 70-80%, €10k, "Ultra Enterprise", formula, Capasso,
  ore-accanto-a-prezzi, LOC-first. LiveSiteStats: ore protagoniste (riga 1),
  righe nette secondarie sotto separatore (riga 3) — conforme frame §3.
- Linguaggio LSO §5 fedele (3 benefici + "Living Software Organism" con
  traduzione italiana sotto + chiusura "non dipendi da nessuno. Nemmeno da me").
- Chat advisor: copy onesto ("Presto potrai farle una domanda qui — intanto la
  provi in chiamata") — coerente con AdvisorSlot non attivo (§7).
- Senza JS resta visibile "Recupero i dati live…" (stato loading server-rendered)
  accanto al fallback: P0-FC-2 sostanzialmente rispettato, micro-incoerenza.
- Title zh duplica verbatim l'h1 (incluso "。" finale) — pattern diverso dalle
  altre 6 locale (tagline corta). Cosmetico.
- WS-1: 183.5KB su soglia 200KB (raccomandato) — il bundle messages integrale
  nel payload RSC è il driver; margine ridotto per crescite future.
- Citazioni biografiche pre-hero = ticker navbar `aria-hidden="true"`
  site-wide, decorativo: NON viola il divieto "hero biografico" (§4.5).

## Azioni richieste prima della chiusura mission

1. ~~**(BLOCK)** Sostituire i 3 sr-only hardcoded~~ → **FATTO e VERIFICATO**
   (re-verdetto 2026-06-12: sorgente + build 7 locale + gate deterministico
   rieseguito 277/277).
2. (WARN) Aprire entry MISSION_QUEUE: F-9 badge footer, copy home door
   softwarehouse stale, bonifica I-8 site-wide (incl. fallback EN residuo
   in PortfolioCard.tsx:82).
3. (Asse 2) Giudizio CEO dal vivo su CR-1/CR-8/motion prima di dichiarare
   "distinzione PASS".

## UNCERTAINTY FLAGS

- `[SSOT_TRUST]` Conformità prezzi/fasce: confrontate con commercial-claims §2
  che rimanda a messages `pricing_*` "INVARIATE" — non ho verificato le fasce
  contro una fonte esterna al repo.
- `[NOT_FOUND≠NOT_EXIST]` Claim vietati: grep pattern mirati (anche
  riformulazioni evidenti) su 7 locale — una riformulazione semanticamente
  equivalente ma lessicalmente diversa potrebbe sfuggire al pattern; il
  testo visibile IT è stato letto integralmente, le altre locale per heading
  + scan pattern (`[PARTIAL_READ]` su corpo es/pt).
- `[MY_INFERENCE]` Che il footer badge sia fuori scope M-015 è inferito dal
  commit 895959c precedente alla mission; non ho il diff esatto di M-015.
- Conteggi verificati con grep/wc: 6 "opens in new tab" per locale, 19 chiavi
  localizzate, 277/277 PASS da JSON report, 183.5KB da gate. Nessuna stima.

### UNCERTAINTY FLAGS — re-verdetto 2026-06-12

- Conteggi re-verdetto verificati con grep/wc/python su DOM reale: 0 hardcoded
  ×7 locale, 25 chiavi localizzate ×3 locale campione, 12 anchor target=_blank
  con sr-only YES ×3 locale, 277 PASS dal JSON rigenerato. Nessuna stima.
- `[PARTIAL_READ]` Verifica DOM anchor-per-anchor fatta su it/de/zh; per
  en/es/fr/pt verificato solo zero-hardcoded via grep (stesso build process,
  rischio residuo trascurabile).
- `[MY_INFERENCE]` "Nessuna regressione" è basato su diff git del fix (5 righe
  PortfolioCard + righe page.tsx) + gate deterministico 277/277 + conteggi
  invarianti — non su test visivo in browser (che resta nel gate umano Asse 2).
