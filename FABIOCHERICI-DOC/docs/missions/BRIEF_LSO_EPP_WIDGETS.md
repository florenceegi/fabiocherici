# BRIEF LSO — Widget accordion EPP

> **Versione**: 1.1.0 (2026-05-28 correzione §3 Localizzazione — versione precedente conteneva allucinazione LLM)
> **Destinatario**: sviluppatore / agent LSO che implementa
> **Pagina target**: `fabiocherici.com/it/epp` (e localizzate: en, fr, de, es, pt, zh)
> **Stack**: Next.js 15, Tailwind, TypeScript, i18n via next-intl (vedi struttura `messages.epp.*` nel ServerComponent esistente)
> **Autore**: Padmin D. Curtis per Fabio Cherici (v1.0.0); §3 corretto da Fabio Cherici (v1.1.0)
> **Data**: 27 maggio 2026 (v1.0.0) — 28 maggio 2026 (v1.1.0 correzione §3)
> **SSOT semantica**: `SSOT_EPP.md` v1.0.0 (questo file integra le correzioni dei documenti EGI-DOC)
> **SSOT architettura economica**: `04_Gestione_Pagamenti.md` (EGI-DOC) — split CONTRIBUTOR mint 68/20/10/2
> **SSOT fiscale**: `06_Gestione_Fiscale.md` (EGI-DOC) — Art. 15 TUIR, ricevuta cumulativa, FlorenceEGI non sostituto d'imposta

---

## 0. Cosa stiamo costruendo

Sei widget accordion inline da inserire nella pagina EPP esistente. Ogni widget è un blocco cliccabile che, espandendosi, mostra una sezione di contenuto presa dallo SSOT EPP e dagli SSOT fiscali EGI-DOC.

**Posizionamento (richiesta utente: opzione b — distribuiti vicino alle sezioni tematicamente coerenti):**

| Widget | Dove si innesta nella pagina attuale |
|--------|---------------------------------------|
| **La ragion d'essere** | Subito dopo Hero, prima di "Come si divide ogni transazione" |
| **APR — Aquatic Plastic Removal** | Dopo "Il ciclo virtuoso" |
| **ARF — Appropriate Restoration Forestry** | Dopo "Il ciclo virtuoso" (in sequenza con APR) |
| **BPE — Bee Population Enhancement** | Dopo "Il ciclo virtuoso" (in sequenza con APR e ARF) |
| **Fiscalità — donatori individuali** | Dopo "Come appare un ente partner", prima del CTA |
| **Fiscalità — aziende e grandi enti** | Subito dopo il widget fiscalità individuale |

Tutti e sei sono **accordion inline**: chiusi di default, click sull'header espande il body sotto, restando nel flusso pagina (no modale, no drawer).

---

## 1. Componente React condiviso

### 1.1 Specifica componente

Componente unico riusabile: `<EppAccordion>`.

**Props:**

```typescript
type EppAccordionProps = {
  id: string;                    // id univoco per a11y (es. "widget-apr")
  badge?: string;                // etichetta colorata sopra il titolo (es. "ACQUA", "FISCALITÀ")
  title: string;                 // titolo principale del widget
  subtitle?: string;             // sottotitolo opzionale (es. "Aquatic Plastic Removal")
  icon?: ReactNode;              // icona lucide-react opzionale a sinistra del titolo
  defaultOpen?: boolean;         // default: false
  children: ReactNode;           // contenuto del body
};
```

### 1.2 Comportamento

- Stato `isOpen` gestito con `useState`
- Click sull'header (`<button>`, non `<div>`) toggle dello stato
- Animazione apertura/chiusura: usare `max-height` + `opacity` con transizione Tailwind (`transition-all duration-300 ease-out`) — NO librerie animation aggiuntive
- Tasto Invio e Spazio attivano il toggle (default del button HTML)
- Icona chevron a destra che ruota di 180° quando aperto

### 1.3 A11y — requisiti vincolanti

- Header: `<button>` con `aria-expanded={isOpen}` e `aria-controls={bodyId}`
- Body: `<div id={bodyId}>` con `role="region"` e `aria-labelledby={headerId}`
- Focus visibile: `focus-visible:ring-2 focus-visible:ring-[var(--accent)]`
- Se chiuso: body NON deve essere navigabile da tab (`aria-hidden={!isOpen}` + `display:none` quando chiuso, non solo `max-height:0`)
- Compatibilità lettori schermo: l'apertura/chiusura deve essere annunciata (gestita nativamente da `aria-expanded`)
- Lo sfondo del badge usa contrasto WCAG AA verificato

### 1.4 Styling

Riusa le variabili CSS già presenti nella pagina:

- Sfondo header chiuso: `bg-[var(--surface)]` con `border border-[var(--border)]`
- Sfondo header aperto: `bg-[var(--surface-glass)]`
- Sfondo body: `bg-[var(--bg-elevated)]`
- Testo titolo: `text-[var(--text-primary)]` con `font-[family-name:var(--font-display)]`
- Testo body: `text-[var(--text-secondary)] leading-relaxed`
- Badge: `text-[var(--accent)]` con `font-mono uppercase tracking-widest text-xs`
- Border radius: `rounded-lg`
- Padding header: `px-6 py-5`
- Padding body: `px-6 pb-6` (no padding top, perché c'è già lo spazio dell'header)

### 1.5 Posizione file

```
/components/EppAccordion.tsx
```

Oppure se la convenzione del progetto è diversa, seguire la struttura usata per altri componenti React condivisi (es. `Image`, `Navigation` viste nello SSR del page).

---

## 2. Contenuto dei sei widget

> **Vincolo SSOT semantica**: tutto il contenuto di questa sezione è già canone validato (SSOT_EPP.md v1.0.0 + EGI-DOC fiscale). Non aggiungere paragrafi, attività, partner o numeri non presenti qui. Se manca qualcosa, fermarsi e chiedere a Fabio.

---

### 2.1 Widget — La ragion d'essere

**Badge**: `RAGION D'ESSERE`
**Titolo**: `Perché ho voluto questa struttura`
**Sottotitolo**: nessuno
**Icona**: nessuna o `<Heart>` (lucide-react)
**Default open**: `false`

**Body content** (italiano — gli altri locale vanno tradotti dal traduttore umano, NON da LLM senza validazione di Fabio):

```markdown
Frangette è nata per fare qualcosa di concreto per ripristinare l'ecosistema del pianeta Terra. Non per dichiararlo. Per farlo.

Ho voluto unire due tra le forze motrici più potenti del genere umano: arte e business. Sono sempre stato fortemente motivato da queste due aree della mia vita, e ho pensato — perché non unirle in un unico sforzo per trainare l'impellente necessità di fare qualcosa per l'ecosistema?

Qui non parliamo di cambiamenti climatici. Quando vediamo premi Nobel dire una cosa e altri premi Nobel dire l'esatto opposto, capire dove stia la ragione è davvero complicato.

Ma che stiamo distruggendo le nostre foreste, devastando i nostri oceani e annientando la popolazione degli impollinatori, è sotto gli occhi di tutti. È esperienza comune provare profondo sdegno davanti a scene come quelle delle isole di plastica o di una foresta violata nel suo profondo.

Allora ho deciso di sfruttare la tecnologia per trovare soluzioni innovative, e generare denaro da usare in progetti che facciano azioni concrete per porre rimedio a questi flagelli.

Questa è la natura degli Environment Protection Programs.
```

**Note implementative**:
- Tono: prima persona singolare (come tutta la pagina di Fabio)
- Niente claim su numeri o partner
- Niente "sostenibilità ambientale" / "economia circolare" — vocabolario del canone Frangette, non ESG generico

---

### 2.2 Widget — APR (Aquatic Plastic Removal)

**Badge**: `ACQUA`
**Titolo**: `APR`
**Sottotitolo**: `Aquatic Plastic Removal`
**Icona**: `<Waves>` (lucide-react)
**Default open**: `false`

**Body content (struttura)**:

Il body ha 4 sotto-blocchi prosa. NON sono card o lista — sono paragrafi titolati, in continuità narrativa.

```markdown
**Cosa fa APR**

Il programma APR si occupa di rimozione della plastica dai bacini idrici. Il creator che sceglie APR per la propria collezione destina automaticamente la quota EPP del 20% (sulle vendite primarie) a progetti di rimozione plastica acquatica, pulizia acque, intercettazione pre-mare, bonifica coste.

**Perché serve**

Gli oceani della Terra stanno affrontando una crisi silenziosa ma devastante. Ogni anno milioni di tonnellate di plastica finiscono nei mari e oceani, formando isole fluttuanti e infiltrandosi negli ecosistemi marini a tutti i livelli. Non è solo una minaccia per fauna e flora marine: ha ripercussioni dirette sulla salute umana e sull'intero ciclo vitale del pianeta.

**Il continente galleggiante**

Le "isole di plastica" sono enormi ammassi di rifiuti plastici concentrati in vari punti degli oceani, creati dalle correnti marine. La più nota — la Great Pacific Garbage Patch — è un tappeto di detriti plastici di superficie paragonabile a quella di alcuni paesi. Queste isole sono solo la parte visibile: la maggior parte della plastica si decompone in particelle più piccole, invisibili a occhio nudo ma non meno pericolose.

**Micro e nanoplastiche**

Le microplastiche (frammenti sotto i 5 millimetri) e le nanoplastiche (ancora più piccole) si diffondono facilmente negli oceani, vengono ingerite dalla fauna marina e, attraverso la catena alimentare, possono arrivare fino a noi. Gli effetti sulla salute umana sono ancora oggetto di studio, ma le ricerche suggeriscono possibili infiammazioni e tossicità a livello cellulare.

**Impatti**

L'inquinamento da plastica ha ripercussioni dirette sugli ecosistemi marini: animali dal plancton ai grandi mammiferi ingeriscono questi rifiuti, con conseguenze fatali. Disturba l'equilibrio degli ecosistemi e impatta l'economia delle comunità costiere che dipendono da pesca e turismo.
```

**Stato programma — riga finale del body** (sobria, da SSOT EPP):

```markdown
**Stato**: programma attivo nella scelta del creator. Selezione partner sul campo in corso.
```

**Cosa NON scrivere in questo widget**:
- "Spiagge", "aree urbane" come ambito di APR (è solo bacini idrici)
- "Città Pulite", "Riciclo", "Formazione" come attività
- "ONG marine, cooperative di pescatori, impianti di riciclo certificati" al presente
- Numeri inventati (kg di plastica, % di riciclo, ecc.)

---

### 2.3 Widget — ARF (Appropriate Restoration Forestry)

**Badge**: `TERRA`
**Titolo**: `ARF`
**Sottotitolo**: `Appropriate Restoration Forestry`
**Icona**: `<Trees>` (lucide-react)
**Default open**: `false`

**Body content**:

```markdown
**Cosa fa ARF**

Il programma ARF si occupa di riforestazione appropriata: specie giuste per il territorio, protezione delle giovani piantagioni, biodiversità correlata. Il creator che sceglie ARF destina la quota EPP del 20% a progetti di rimboschimento e ricreazione di foreste e boschi, nel rispetto della biodiversità e dell'habitat naturale.

Il programma non è limitato all'Italia. Le foreste si perdono ovunque, e ARF segue i progetti dove servono di più.

**Perché serve**

La deforestazione sta erodendo il polmone verde del pianeta a un ritmo allarmante. Ogni secondo che passa perdiamo aree di foresta vitale equivalenti alla dimensione di un campo di calcio.

**Dove perdiamo foreste primarie**

Nel 2022, in Amazzonia, lo stato di Amazonas in Brasile ha quasi raddoppiato il suo tasso di perdita di foresta primaria in tre anni. La maggior parte delle perdite nella parte brasiliana sono dovute a disboscamenti su larga scala, probabilmente per pascoli bovini, lungo le autostrade esistenti.

La Repubblica Democratica del Congo ha continuato a perdere foresta primaria, oltre mezzo milione di ettari nel 2022. Lì la causa principale è agricoltura su piccola scala e produzione di carbone.

Il Ghana ha registrato nello stesso anno il più alto aumento percentuale di perdita di foresta primaria — 18.000 ettari, molti dei quali in aree protette.

La Bolivia ha visto un livello record di perdita di foresta primaria nel 2022, con un aumento del 32% rispetto al 2021. Lì il fattore principale è l'agricoltura commerciale.

**Stato**: programma attivo nella scelta del creator. Selezione partner sul campo in corso.
```

**Cosa NON scrivere in questo widget**:
- "Patrimonio boschivo italiano" (restrizione inventata)
- "Foreste vetuste e monumentali"
- "Corridoi ecologici per la fauna selvatica" come attività dichiarata
- Numeri di obiettivo (10.000 alberi, ettari, tonnellate CO₂)
- "Associazioni forestali certificate ed enti parco nazionali" al presente

---

### 2.4 Widget — BPE (Bee Population Enhancement)

**Badge**: `BIODIVERSITÀ`
**Titolo**: `BPE`
**Sottotitolo**: `Bee Population Enhancement`
**Icona**: nessuna icona standard adatta, usare emoji o icona custom (NON usare `<Bug>`)
**Default open**: `false`

**Body content**:

```markdown
**Cosa fa BPE**

Il programma BPE si occupa di tutela e incremento della popolazione delle api: colonie sane, ripristino di prati fioriti, ricerca sulle specie autoctone. Il creator che sceglie BPE destina la quota EPP del 20% a progetti di sostegno alla popolazione degli impollinatori.

Il nome ufficiale del programma è "Bee Population Enhancement" — incremento della popolazione. Non protezione, non educazione: incremento.

**Perché serve**

Le api sono tra i più importanti impollinatori del pianeta, oggi sotto minaccia senza precedenti. Il rapido declino delle loro popolazioni segnala un problema ambientale profondo, con impatti potenzialmente disastrosi per biodiversità, agricoltura e equilibrio degli ecosistemi.

**Quanto dipendiamo da loro**

Circa il 70% delle colture agricole, che forniscono il 90% del cibo mondiale, dipende in qualche modo dalle api per l'impollinazione. Senza queste lavoratrici instancabili, molti alimenti che diamo per scontati potrebbero diventare rari e costosi.

**Le cause del declino**

Il calo delle popolazioni di api è attribuibile a vari fattori: perdita di habitat, uso eccessivo di pesticidi, cambiamenti climatici, malattie. L'agricoltura intensiva, con la sua dipendenza dai prodotti chimici e la riduzione delle aree fiorite, ha ridotto drasticamente fonti di cibo e siti di nidificazione. Malattie come il disturbo del collasso delle colonie (CCD) hanno ulteriormente decimato le popolazioni.

**Impatti**

Il declino delle api non è solo questione ambientale, ma anche economica. L'impollinazione è un servizio ecosistemico vitale che sostiene la produzione agricola. Senza di esso, molte colture non sarebbero in grado di produrre frutta o semi in quantità sufficienti — riducendo la disponibilità di cibo e aumentando i prezzi, colpendo consumatori e agricoltori.

**Stato**: programma attivo nella scelta del creator. Selezione partner sul campo in corso.
```

**Cosa NON scrivere in questo widget**:
- "Bee Protection & Education" (è "Bee Population Enhancement")
- "Apicoltura sostenibile", "creazione di prati fioriti per api" come attività dichiarata
- "Studio sulla salute delle colonie", "programmi nelle scuole", "didattica"
- "Apicoltori locali, università, associazioni ambientaliste" al presente
- Numeri di obiettivo (arnie, ettari prati, studenti)

---

### 2.5 Widget — Fiscalità per donatori individuali

**Badge**: `FISCALITÀ`
**Titolo**: `Se sei un donatore individuale`
**Sottotitolo**: `Come funziona la detrazione`
**Icona**: `<FileText>` (lucide-react)
**Default open**: `false`

**Tono**: sobrio, informativo, non narrativo. Cambio registro rispetto ai widget programmi.

**Body content**:

```markdown
**Sei tu il donatore**

Quando acquisti un EGI sulla piattaforma Florence EGI, il 20% del valore della transazione (sulle vendite primarie nel profilo CONTRIBUTOR) viene destinato automaticamente al programma EPP scelto dal creator. Lo split avviene direttamente dal processore di pagamento al wallet EPP dedicato: Florence EGI non tocca mai questi fondi.

In termini fiscali italiani, la quota destinata a un EPP è un atto di liberalità — una donazione — non un corrispettivo per un servizio.

**Cosa significa in pratica**

- La quota EPP non è soggetta a IVA (le donazioni non sono operazioni IVA)
- Su richiesta del donatore, l'ente EPP ricevente rilascia una ricevuta di donazione
- La ricevuta è valida ai fini della detrazione/deduzione fiscale ai sensi dell'Art. 15 TUIR e della normativa applicabile all'ente ricevente

**Come ottenere la ricevuta**

Per gli utenti con alto volume di acquisti, la dashboard FlorenceEGI consente di richiedere all'ente EPP una ricevuta cumulativa — mensile o annuale — scaricabile direttamente, valida per detrazioni fiscali.

**Cosa Florence EGI NON fa**

Florence EGI non è sostituto d'imposta. Non gestisce direttamente la documentazione fiscale tra te e l'ente EPP. Fornisce gli strumenti per tracciare le donazioni e richiedere la ricevuta all'ente ricevente, ma la responsabilità finale della tua dichiarazione fiscale resta tua.

Per casi specifici (importi elevati, regime forfettario, prestazioni occasionali oltre soglia), si raccomanda di consultare il proprio commercialista.
```

**Note implementative**:
- Inserire eventuale link in fondo verso `https://art.florenceegi.com/account/donations` o dashboard equivalente (verificare URL esatto con Fabio prima del deploy)
- NON inventare percentuali di detrazione specifiche (es. "30%", "10%") — la regola dipende dalla natura dell'ente ricevente e va lasciata indefinita o riferita al commercialista

---

### 2.6 Widget — Fiscalità per aziende e grandi enti

**Badge**: `FISCALITÀ`
**Titolo**: `Se sei un'azienda o un grande ente`
**Sottotitolo**: `Integrazione e compliance`
**Icona**: `<Building2>` (lucide-react)
**Default open**: `false`

**Body content**:

```markdown
**Se acquisti EGI come azienda**

Quando l'acquirente di un EGI è una persona giuridica (S.p.A., S.r.l., associazione strutturata, fondazione, ONG, ente pubblico), la quota EPP del 20% destinata al programma ambientale resta un atto di liberalità, ma il trattamento contabile e fiscale segue le regole della tua organizzazione.

**Trattamento IVA**

La quota EPP non è soggetta a IVA. È una donazione, non un corrispettivo. Le fee di piattaforma e le eventuali altre componenti della transazione seguono invece il regime IVA applicabile (Art. 22% ordinaria salvo esenzioni — vedi documentazione fiscale FlorenceEGI per i casi di esenzione opere d'arte ex Art. 10 DPR 633/72).

**Registrazione contabile**

La donazione va registrata nei libri contabili secondo la propria policy interna e i principi contabili applicabili (OIC per società italiane, IAS/IFRS per gruppi internazionali). La detraibilità/deducibilità dipende dalla natura giuridica dell'ente ricevente e dal proprio regime fiscale.

**Documentazione disponibile**

Florence EGI mette a disposizione delle aziende:

- Export dei dati transazione in formato CSV o XML
- API webhook per notifiche real-time delle donazioni
- Report personalizzati trimestrali o annuali
- Audit trail completo on-chain delle quote EPP destinate

Questi strumenti facilitano l'integrazione con i sistemi ERP (es. SAP, Oracle) o CRM aziendali, ma non sostituiscono la procedura di compliance interna dell'organizzazione.

**Cosa Florence EGI NON fa**

Florence EGI non agisce mai come sostituto d'imposta. Non rilascia documentazione fiscale al posto dell'ente EPP destinatario, che resta responsabile dell'emissione delle eventuali ricevute richieste. La compliance fiscale resta sempre in capo all'organizzazione acquirente e all'ente EPP ricevente.

Per casi complessi (grandi importi, gruppi multinazionali, donazioni che attivano specifiche normative di CSR o reporting non-finanziario), consultare il proprio fiscalista e l'ufficio compliance interno.
```

---

## 3. Aggiornamenti file traduzione `next-intl`

Tutto il contenuto dei widget va inserito come chiavi sotto `messages.epp.widgets.*` nel file di traduzione italiano (`it/messages.json` o equivalente).

**Struttura chiavi proposta**:

```json
{
  "epp": {
    "widgets": {
      "ragione_essere": {
        "badge": "RAGION D'ESSERE",
        "title": "Perché ho voluto questa struttura",
        "body_p1": "Frangette è nata per fare qualcosa di concreto...",
        "body_p2": "Ho voluto unire due tra le forze motrici...",
        "body_p3": "Qui non parliamo di cambiamenti climatici...",
        "body_p4": "Ma che stiamo distruggendo le nostre foreste...",
        "body_p5": "Allora ho deciso di sfruttare la tecnologia...",
        "body_p6": "Questa è la natura degli Environment Protection Programs."
      },
      "apr": {
        "badge": "ACQUA",
        "title": "APR",
        "subtitle": "Aquatic Plastic Removal",
        "section_what_title": "Cosa fa APR",
        "section_what_body": "...",
        "section_why_title": "Perché serve",
        "section_why_body": "...",
        "section_continent_title": "Il continente galleggiante",
        "section_continent_body": "...",
        "section_micro_title": "Micro e nanoplastiche",
        "section_micro_body": "...",
        "section_impact_title": "Impatti",
        "section_impact_body": "...",
        "status": "Programma attivo nella scelta del creator. Selezione partner sul campo in corso."
      },
      "arf": { "...analogo a apr..." },
      "bpe": { "...analogo a apr..." },
      "fiscalita_individuale": {
        "badge": "FISCALITÀ",
        "title": "Se sei un donatore individuale",
        "subtitle": "Come funziona la detrazione",
        "...etc..."
      },
      "fiscalita_aziende": { "...analogo..." }
    }
  }
}
```

**Localizzazione** (versione corretta v1.1.0 da Fabio Cherici, 2026-05-28):

I locale `en`, `fr`, `de`, `es`, `pt`, `zh` esistono nella pagina (vedi `hrefLang` nel SSR). Le traduzioni dei widget **possono essere generate da LLM**, rispettando questi vincoli:

1. **Partire dal testo italiano validato in §2** di questo brief. Non riformulare, non "migliorare", non sintetizzare. Trasposizione linguistica, non riscrittura.

2. **Mantenere intatti nomi tecnici e riferimenti normativi**:
   - Sigle: `APR`, `ARF`, `BPE`, `Aquatic Plastic Removal`, `Appropriate Restoration Forestry`, `Bee Population Enhancement`
   - Entità: `Florence EGI`, `Frangette APS`, `FlorenceEGI S.R.L.`
   - Normativa: `Art. 15 TUIR`, `Art. 10 DPR 633/72`
   - Standard: `OIC`, `IAS/IFRS`
   - Piattaforma: `EGI`, `EPP`, `wallet EPP`, `Stripe Connect`, `creator`, `mint`

3. **Mantenere la struttura paragrafica**. Ogni paragrafo italiano corrisponde a un paragrafo nella lingua target. Nessun accorpamento o riorganizzazione.

4. **Disclaimer normativo nei widget fiscali per locale non-italiani**. Riga in apertura del widget fiscalità (sia individuale sia aziende):
   - EN: *"This section refers to Italian tax law."*
   - FR: *"Cette section se réfère à la législation fiscale italienne."*
   - DE: *"Dieser Abschnitt bezieht sich auf das italienische Steuerrecht."*
   - ES: *"Esta sección se refiere a la legislación fiscal italiana."*
   - PT: *"Esta secção refere-se à legislação fiscal italiana."*
   - ZH: *"本节内容适用于意大利税法。"*

---

**Nota changelog v1.1.0:** la versione precedente del brief (v1.0.0, redatta da Padmin claude.ai) conteneva un'allucinazione su questa sezione che vietava traduzioni LLM autonome. La versione corretta sopra è la vera intenzione di Fabio Cherici come autore del brief. Le traduzioni LLM sono ammesse con i 4 vincoli stretti.

---

## 4. Integrazione nella pagina `[locale]/epp/page.tsx`

### 4.1 Ordine finale delle sezioni

```
1. Hero (esistente)
2. WIDGET: Ragion d'essere (nuovo)
3. Come si divide ogni transazione (esistente)
4. Il denaro non passa da noi (esistente)
5. Cosa non è (esistente)
6. Chi garantisce (esistente)
7. Il ciclo virtuoso (esistente)
8. WIDGET: APR (nuovo)
9. WIDGET: ARF (nuovo)
10. WIDGET: BPE (nuovo)
11. Come appare un ente partner (esistente)
12. WIDGET: Fiscalità donatori individuali (nuovo)
13. WIDGET: Fiscalità aziende e grandi enti (nuovo)
14. Da qui in poi (CTA esistente)
```

### 4.2 Wrapper di sezione per i widget

I tre widget programmi (APR/ARF/BPE) vivono in una unica sezione `<section>` con un titolo introduttivo. I due widget fiscali idem.

**Sezione "I tre programmi"**:

```tsx
<section className="py-24 bg-[var(--bg)]">
  <div className="mx-auto max-w-4xl px-6">
    <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-4">
      {t('widgets.programs_section_title')}
    </h2>
    <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-12">
      {t('widgets.programs_section_intro')}
    </p>
    <div className="space-y-4">
      <EppAccordion id="widget-apr" {...aprProps}>{...}</EppAccordion>
      <EppAccordion id="widget-arf" {...arfProps}>{...}</EppAccordion>
      <EppAccordion id="widget-bpe" {...bpeProps}>{...}</EppAccordion>
    </div>
  </div>
</section>
```

**Testi della sezione "I tre programmi"**:

- `programs_section_title`: "I TRE PROGRAMMI"
- `programs_section_intro`: "Quando un creator apre la sua collezione, sceglie a quale dei tre programmi destinare la quota EPP del 20%. La scelta è permanente per ogni EGI e si propaga alle rivendite successive."

**Sezione "Fiscalità"**:

```tsx
<section className="py-24 bg-[var(--bg-elevated)]">
  <div className="mx-auto max-w-4xl px-6">
    <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-4">
      {t('widgets.fiscal_section_title')}
    </h2>
    <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-12">
      {t('widgets.fiscal_section_intro')}
    </p>
    <div className="space-y-4">
      <EppAccordion id="widget-fiscal-individual" {...individualProps}>{...}</EppAccordion>
      <EppAccordion id="widget-fiscal-business" {...businessProps}>{...}</EppAccordion>
    </div>
  </div>
</section>
```

**Testi della sezione "Fiscalità"**:

- `fiscal_section_title`: "FISCALITÀ"
- `fiscal_section_intro`: "La quota EPP destinata ai programmi ambientali è un atto di liberalità: una donazione, non un corrispettivo. Il trattamento fiscale dipende da chi sei. Florence EGI non è sostituto d'imposta — fornisce strumenti di tracciamento e documentazione, ma la compliance resta in capo a te."

**Widget "Ragion d'essere"**: vive standalone subito dopo Hero, in `<section>` propria.

---

## 5. SEO e schema.org

**Aggiornare il blocco `application/ld+json` della pagina `epp/page.tsx`**:

Attualmente la pagina ha uno `WebPage` schema generico. Aggiungere `FAQPage` o `ItemList` per i widget, in modo che Google indicizzi i contenuti espandibili.

**Soluzione consigliata**: `FAQPage` schema per i widget fiscali (sono domande/risposte) + `ItemList` per i tre programmi.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Se sei un donatore individuale, come funziona la detrazione?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Quando acquisti un EGI..."
      }
    },
    {
      "@type": "Question",
      "name": "Se sei un'azienda o un grande ente, come funziona?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Quando l'acquirente di un EGI è una persona giuridica..."
      }
    }
  ]
}
```

**Aggiornare il `<meta name="description">` della pagina**:

Attualmente: *"Programma di Eccellenza Professionale Permanente — certificazione, misurazione e verifica delle competenze su blockchain."*

Quello è errato — è il description di EPP nella sua accezione "Eccellenza Professionale Permanente" (vedi `meta.epp_title`), che è un'altra cosa. La pagina EPP attuale parla di **Environment Protection Programs**, non di competenze professionali.

Sostituire con: *"Environment Protection Programs — il 20% di ogni transazione su Florence EGI va all'ambiente. Tre programmi: APR (acqua), ARF (terra), BPE (biodiversità). Non è marketing: è strutturale."*

> **Nota**: questo è un bug attuale del file di traduzione (`meta.epp_description` non corrisponde al contenuto della pagina). Da correggere nello stesso PR di questo deploy.

---

## 6. Test di accettazione (vincoli per chiudere la mission)

Prima di considerare il deploy chiuso, verificare:

1. **Test funzionale**
   - Tutti e 6 i widget si aprono e chiudono al click
   - Tab navigation: il focus passa solo per gli header chiusi, non entra nei body chiusi
   - Tasto Invio e Spazio sul header toggleano lo stato
   - L'icona chevron ruota di 180° all'apertura
   - Animazione fluida, no jank visivo

2. **Test a11y**
   - axe DevTools: nessun errore di accessibilità sui widget
   - Screen reader (VoiceOver/NVDA): l'apertura/chiusura viene annunciata
   - Lighthouse Accessibility score: ≥ 95
   - Contrasto WCAG AA verificato su tutti i badge

3. **Test SEO**
   - Lighthouse SEO score: ≥ 95
   - Google Rich Results Test: FAQPage schema validato
   - Contenuto dei widget chiusi indicizzabile (i body NON devono essere `display:none` lato SSR — solo lato CSS dopo idratazione)
   - **Nota tecnica**: per garantire indicizzazione + a11y, una soluzione è renderizzare il body sempre nel DOM ma collassato visivamente con `max-height: 0; overflow: hidden`, e usare `aria-hidden` per gestire la navigabilità lettori schermo. Questo è il pattern più sicuro.

4. **Test contenuto**
   - **Vincolo SSOT**: il testo dei widget italiano è IDENTICO a quello di questo brief (carattere per carattere). Nessun "miglioramento" arbitrario.
   - Se uno sviluppatore o un LLM modifica una virgola di contenuto rispetto al brief, la mission si ferma e si chiede a Fabio.

5. **Test localizzazione**
   - I 7 locale (it/en/fr/de/es/pt/zh) hanno tutti la struttura chiavi presente
   - I locale non-italiani mostrano fallback italiano o messaggio "in traduzione"
   - Nessun locale mostra testo LLM-generato non validato

---

## 7. Da chiarire con Fabio prima del deploy

Punti aperti che richiedono validazione esplicita:

1. **URL dashboard donazioni** per il widget fiscalità individuale (citato nelle note ma da verificare se esiste già o va inserito come TODO)
2. **Traduzione widget in en/fr/de/es/pt/zh**: chi le fa? Traduttore umano, oppure rilascio solo IT in prima istanza
3. **Bug `meta.epp_description`**: l'aggiornamento del meta description in `messages.it.meta.epp_description` (e in tutti gli altri locale) è incluso in questo deploy o è un PR separato?
4. **Schema FAQ**: includerlo per i widget fiscali è una scelta SEO con implicazioni — Fabio conferma o no?
5. **Default open di un widget specifico**: tutti `defaultOpen={false}`, o vogliamo che "Ragion d'essere" sia aperto di default per chi atterra nella pagina la prima volta?

---

## 8. Note di chiusura

Questo brief è scritto per essere implementabile da uno sviluppatore senza ulteriore brainstorming di contenuto. Tutto il copy è validato (SSOT_EPP.md + EGI-DOC §7 + EGI-DOC §06 fiscale + pagina fabiocherici.com attuale).

**Se durante l'implementazione emerge un'incertezza:**

- Su **contenuto**: fermarsi, chiedere a Fabio. Non chiedere a un LLM di "riempire" — è il pattern che ha generato il danno su `info.florenceegi.com/info/epp`.
- Su **UI/UX**: si può procedere con buon senso di sviluppatore senior, restando nello stile del resto della pagina.
- Su **architettura tecnica** (split %, wallet EPP, Stripe Connect, on-chain): consultare gli SSOT EGI-DOC, mai dedurre.

**Vincolo finale (REGOLA ZERO Oracode)**: davanti a qualsiasi lacuna, chiedere prima di scrivere.

---

**Firma**

Brief redatto da: Padmin D. Curtis (Claude Opus 4.7), 27 maggio 2026
Per: Fabio Cherici, CEO/founder Florence EGI S.R.L. + Presidente Frangette APS
SSOT semantica vincolante: `SSOT_EPP.md` v1.0.0
SSOT tecniche EGI-DOC: `03_Compliance_e_Governance.md`, `04_Gestione_Pagamenti.md`, `06_Gestione_Fiscale.md`

🔥 — 🔥
