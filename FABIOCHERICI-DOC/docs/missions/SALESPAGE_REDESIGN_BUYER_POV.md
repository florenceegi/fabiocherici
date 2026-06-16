---
title: Ridisegno /softwarehouse dal punto di vista del COMPRATORE (PMI non tecnico)
doc_type: analysis
organ: fabiocherici.com
status: draft
date: '2026-06-16'
author: engineer-salespage (CRO + direct-response, buyer-POV)
scope:
  - app/[locale]/softwarehouse/page.tsx
  - messages/it.json (namespace softwarehouse)
source_of_truth: commercial-claims-public.md
note: >
  Documento di STRATEGIA e COPY. Non tocca codice di produzione.
  Implementazione → engineer-frontend. Decisioni di brand/posizionamento → CEO.
  Ogni claim portante è citato (fonte web o fatto SSOT) o marcato [MY_INFERENCE]/gap.
---

# Ridisegno /softwarehouse — il compratore è l'eroe

> Metodo: COMPRATORE → RICERCA → DIAGNOSI → RIDISEGNO.
> Lealtà unica: il compratore. La pagina non deve impressionare chi vende; deve far sì
> che un imprenditore con un problema, in pochi secondi, capisca **dove sono, chi è
> questo, cosa fa per ME, perché fidarmi, cosa faccio ora**.

---

## 1. Il compratore (ICP)

**Chi è** — Imprenditore/titolare di una PMI italiana, **non tecnico**. Gestisce
l'operatività quotidiana dividendosi tra "Excel, email, WhatsApp e 3-4 software
diversi" — caos che vive ogni giorno (fonte: scunio.com, linguaggio osservato).
Non compra "software": compra **la fine di un problema concreto** che gli costa tempo,
errori e soldi.

**Job-to-be-done (la sua testa, non la nostra):**
- "Voglio smettere di perdere ore a tenere insieme dati sparsi / a fare a mano cose
  ripetitive."
- "Voglio un sistema fatto sul MIO modo di lavorare, non adattarmi a un programma
  rigido comprato a scatola chiusa."
- "Voglio capire quanto mi costa e cosa ottengo, **prima** di impegnarmi."

**Paure reali (grounded su ricerca):**
1. **Buttare soldi** — paura n.1: spendere tanto senza sapere il prezzo vero, e
   scoprire dopo che il costo reale è 3-4x il preventivo (costi nascosti,
   personalizzazioni post-go-live, manutenzione). Fonti: garda informatica, scunio,
   lacapitaledesign.
2. **Execution risk** — "e se non lo finiscono / non funziona / è in ritardo?".
   La ricerca anglosassone lo conferma: per i servizi custom il rischio percepito è
   **execution risk + competenza tecnica + proprietà del risultato (IP)**, più della
   stabilità del fornitore (logiciel.io, svitla, righttail).
3. **Restare in ostaggio** — dipendere per sempre dal fornitore ("solo lui sa come
   funziona"). [MY_INFERENCE — premessa: è il rovescio del JTBD "non adattarmi a una
   scatola chiusa" + la frase SSOT "non dipendi da nessuno, nemmeno da me". Da validare
   con clienti reali.]
4. **Promesse troppo belle** — diffida istintiva verso chi "promette tutto in 2
   settimane": le claim di velocità sono per lui un campanello d'allarme, non un
   vantaggio (scunio). → implicazione diretta sul nostro claim "2x velocità": va
   **dimostrato**, non promesso.
5. **Parlare con un venditore e non con chi costruisce** — vuole "parlare con chi
   scrive il codice", qualcuno responsabile, non un commerciale (scunio).

**Cosa lo rassicura (grounded):**
- Chi **chiede prima di proporre** (discovery prima del preventivo) — segnale che
  qualcuno ascolta invece di vendere (scunio, garda).
- **Numeri chiari** e fasce di prezzo concrete, non preventivi vaghi (scunio).
- **Tempi realistici** + supporto/manutenzione inclusi e dichiarati (scunio).
- **Prova invece di promessa** — "evidence over assurance": per i servizi custom la
  valutazione passa da "prodotto" a "processo + talento dimostrato"; conta la capacità
  dimostrata, non le dichiarazioni del fornitore (logiciel.io, righttail).

**Le 5 domande che ha in testa nei primi 5 secondi sulla pagina** (grunt test esteso,
Miller/StoryBrand — monicaink, agencyboon, jareddees):
1. Dove sono / di chi è questa pagina?
2. Cosa offrite (lo capisco senza pensarci)?
3. Cosa ci guadagno IO?
4. Perché dovrei fidarmi di voi?
5. Cosa faccio ora?

Oggi la pagina **non risponde alla #1 e alla #4 sopra la piega**, e arriva alla #2/#3
con gergo. È qui che rimbalza.

---

## 2. Diagnosi della pagina attuale (dal lato del compratore, sezione per sezione)

Ordine attuale: Hero split (promessa + chat Padmin) → **Cantiere aperto** → Offerta →
Processo 5 fasi → LSO/Oracode Nexus → Demo → Prezzi → CTA.

### Hero (sopra la piega) — fallisce la #1 e la #4
- **Manca l'identità.** Label "SOFTWAREHOUSE" + H1 "Vedi il tuo software funzionare.
  Poi decidi." Non dice **chi è** (Fabio Cherici, sviluppatore, persona reale), né
  **per chi** (PMI), né **che problema risolve**. Il compratore atterra da un annuncio
  o da un link e non sa di chi è la pagina. Grunt test #1 (dove sono / di chi è)
  fallito (jareddees: la testata deve renderlo ovvio senza scroll).
- **La colonna destra dà il widget chat (Padmin) come azione primaria PRIMA** che il
  compratore sappia chi sei e cosa fai. Per un PMI diffidente, "parla con un'AI" prima
  di aver capito l'offerta è attrito, non aiuto. La ricerca dice: la chiarezza
  precede l'interazione; "if you confuse, you lose" (usertesting, digital.gov).
- **H1 buona ma orfana.** "Vedi prima, decidi dopo" è il vero asset (risk-reversal,
  la paura n.1 del compratore) ma senza ancorarlo a "chi/cosa/per chi" resta uno
  slogan sospeso.

### Sezione 2 "CANTIERE APERTO" — il problema n.2 del CEO, confermato
- **Gergo + ordine sbagliato.** "Cantiere aperto", "dati live dal tracker interno",
  "righe nette di codice", "ore tracciate" sono **metriche del fornitore**, non
  benefici del compratore. Un PMI non sa cosa farsene di "righe di codice". Peggio:
  è la **seconda cosa** che legge, prima ancora di aver capito l'offerta e prima di
  avere un motivo per volere quella prova. La prova arriva **prima della domanda** che
  dovrebbe sciogliere → spreco. La ricerca CRO è netta: la prova converte quando è
  collocata **vicino all'obiezione, nel momento in cui sorge** (unicornplatform,
  smart-team). Qui invece è messa a freddo.
- Termine da insider: "cantiere aperto" non significa nulla per chi non ti conosce
  (anti-gergo, regola dura).

### Sezione 3 "Offerta" — il problema n.3 del CEO, confermato
- H2: *"Tre linee, un solo principio: vedi prima, decidi dopo"* — **dà per scontato**
  cosa siano le "tre linee" e cosa significhi il principio. Nessuna frase-ponte che
  spieghi "ti aiuto in tre modi diversi a seconda di cosa ti serve". Il compratore
  deve dedurlo. Grunt test #2 (cosa offri) reso faticoso.
- Le 3 card contengono già **gergo non spiegato sopra**: "LSO", "EGI-Sigillo",
  "hash del front-end", "pianale collaudato, carrozzeria unica". Per un PMI non tecnico
  "hash del front-end" è rumore (anti-gergo). Il beneficio c'è ma è sepolto sotto i
  nomi proprietari — contro la stessa regola SSOT ("beneficio prima del nome").

### Sezione 5 "LA SPECIE NUOVA — Oracode Nexus → LSO" — gergo concentrato
- "La specie nuova", "Oracode Nexus, il sistema operativo proprietario di costruzione",
  "Living Software Organism", "8 organi online", "prova di nascita della specie". È la
  sezione più carica di linguaggio interno della pagina. Contiene benefici veri e
  forti ("non dipendi da nessuno, nemmeno da me" — risponde alla paura n.3 ostaggio),
  ma il compratore deve attraversare una metafora biologica e nomi proprietari per
  arrivarci. Rischio "mi stanno parlando sopra la testa / mi confondono di proposito"
  (usertesting). Il beneficio è di prim'ordine; la confezione è da insider.

### Processo, Demo, Prezzi — sezioni FORTI, sottoutilizzate
- **Processo 5 fasi** e **Prezzi pubblici a fasce** sono esattamente ciò che la ricerca
  dice rassicurare il compratore (processo formale + numeri chiari + discovery prima
  del preventivo + manutenzione dichiarata: logiciel.io, scunio, garda). Ma arrivano
  **tardi** e dopo che il compratore si è già confuso col gergo. Asset sprecati per
  collocazione.
- **Demo "IdealOro"** (sito live toccabile) è prova vera ("non screenshot: siti live")
  — ottima per "evidence over assurance" — ma è una sola, ed è una demo fittizia, non
  un cliente reale. Manca la prova sociale di un **pari** ("un imprenditore come me che
  ce l'ha fatta") che la ricerca indica come la più potente in B2B (mailerlite,
  oktopost).

### Diagnosi sintetica (in ordine di impatto sulla conversione)
1. **Sopra la piega non c'è identità né "per chi" né "perché fidarsi".** (massimo impatto)
2. **L'ordine delle sezioni non segue le obiezioni del compratore:** prima la prova-da-
   fornitore (cantiere), poi l'offerta non spiegata, poi il gergo (LSO), e solo tardi
   ciò che davvero rassicura (processo + prezzi). La prova è scollegata dalla domanda.
3. **Gergo diffuso** che fa rimbalzare o "talking down".
4. **Offerta data per scontata**, niente frase-ponte di chiarimento.
5. **Manca prova sociale di pari** (cliente reale PMI); c'è solo FlorenceEGI (progetto
   proprio) e una demo fittizia.

---

## 3. Ridisegno top-to-bottom (sequenza motivata dalle obiezioni, non da template)

Principio guida dell'ordine: **ogni sezione scioglie la prossima obiezione del
compratore, nell'ordine in cui gli nasce in testa**, e la prova è messa accanto alla
domanda che risolve (smart-team: "distributed trust converte meglio di un blocco unico
di social proof").

### Above-the-fold (la prima schermata fa il 90% del lavoro)

Deve rispondere, senza scroll, alle 5 domande. Struttura proposta (colonna sinistra
testo = LCP; widget Padmin **scende** sotto la promessa o diventa CTA secondaria, vedi
nota Padmin):

- **Eyebrow/label (identità + categoria):**
  `[da validare CEO]` → "FABIO CHERICI · SVILUPPO SOFTWARE SU MISURA PER PMI"
  *Perché:* risolve grunt test #1 (di chi è / cosa) e inquadra la categoria nel
  linguaggio del compratore ("software su misura per PMI", non "softwarehouse" che è
  più gergo nostro). Fonte: jareddees (testata deve dire chi/cosa senza scroll);
  Dunford (la categoria in cui ti inquadri determina come ti percepisce).

- **H1 (cosa offri + come ti migliora la vita + per chi):**
  `[da validare CEO]` → "Il software fatto sul tuo modo di lavorare — **lo vedi
  funzionare prima di firmare.**"
  *Perché:* unisce il beneficio ("fatto sul tuo modo di lavorare" = JTBD "non
  adattarmi a una scatola chiusa") al risk-reversal (la paura n.1). Tiene la forza
  dell'H1 attuale ma la àncora a "per chi / cosa". Fatto SSOT: "vedi prima, decidi
  dopo", "prima versione funzionante prima di firmare".

- **Sottotitolo (disambigua + risk-reversal completo):**
  `[da validare CEO]` → "Sviluppo gestionali e siti su misura per piccole e medie
  imprese. Una prima versione che provi con mano prima di impegnarti, prezzi pubblici,
  il rischio lo tengo io — non tu."
  *Perché:* disambigua "che tipo di software", mette i 3 rassicuratori chiave (prova
  prima / prezzi pubblici / rischio sul fornitore) sopra la piega. Fatti SSOT tutti
  presenti. "Provi con mano" è la traduzione SSOT-approvata di "MVP" (mai gergo).

- **CTA primaria (cosa faccio ora):** un solo bottone ovvio
  `[da validare CEO]` → "Raccontami il tuo problema → primo parere gratis"
  *Perché:* azione singola e a basso rischio, allineata a SSOT ("la prima chiamata
  serve a uscire con un parere onesto") e a "chi chiede prima di proporre" (scunio).
  Grunt test #3. Un solo CTA primario riduce attrito (la conversione si guadagna
  togliendo scelte).

- **1 riga di prova ACCANTO alla CTA (prima leva di fiducia):**
  `[da validare CEO]` → "Codice pubblico su GitHub · cantiere di lavoro visibile in
  diretta" — ma riformulato in beneficio (vedi sotto sezione prova).
  *Perché:* la ricerca dice di mettere un micro-segnale di riduzione del rischio
  **vicino alla CTA** (unicornplatform: "expectation setting near the CTA"). Risolve
  grunt test #4 a livello di assaggio.

**Nota Padmin (dove entra nel flusso):** il widget chat **non è l'azione primaria
sopra la piega**. Il compratore prima deve sapere chi/cosa/perché. Due opzioni per il
CEO:
- (A) Padmin diventa **CTA secondaria** sotto il bottone primario: "Oppure chiedi
  subito a Padmin, la responsabile tecnica" — per chi vuole interagire prima di
  scorrere.
- (B) Padmin scende a fine pagina / fluttua come bolla persistente, e sopra la piega
  resta solo promessa + 1 CTA.
*Raccomandazione [MY_INFERENCE]:* opzione (A) — Padmin è un asset di interazione, ma
come **scelta**, non come prima cosa imposta. Premessa: il compratore non tecnico è
diffidente verso "parla con un'AI" prima di capire l'offerta (usertesting + paura n.5
"voglio chi costruisce, non un venditore"). Da validare con dati/test.

### Sequenza sezioni proposta (sotto la piega)

**1. Il problema (esterno + interno) — NUOVA, prima cosa dopo l'hero**
Cosa comunica: "So cosa vivi: dati sparsi tra Excel, mail, WhatsApp e 3-4 programmi;
ore perse; paura di spendere male." Empatia + posta in gioco.
*Perché:* StoryBrand — la guida mostra prima **empatia** (capisco il tuo problema),
poi autorità. Il compratore compra la soluzione di un problema, non una feature. Il
problema interno (frustrazione, paura di sbagliare) è dove si decide l'acquisto.
Linguaggio osservato reale (scunio: "Excel, email, WhatsApp e 3-4 software diversi").
`[da validare CEO]` per il copy esatto; il problema-tipo va confermato (gap dati).

**2. Come funziona / "vedi prima, decidi dopo" spiegato — il cuore rassicurante**
Cosa comunica: il **processo** in versione breve e in linguaggio compratore: "Ci
sentiamo e mi racconti → ti dico subito la fascia di prezzo → costruisco una prima
versione che provi con mano → decidi se andare avanti. La caparra resta in custodia
finché non approvi: se ti fermi prima, quella prima versione è comunque tua."
*Perché:* è esattamente la combinazione che la ricerca indica come il più forte
rassicuratore (processo formale + discovery prima del preventivo + numeri prima +
rischio sul fornitore: logiciel.io, scunio, garda). Va **alzato** rispetto a oggi
(era 4°). Il processo 5 fasi dettagliato può restare come approfondimento sotto.

**3. Prezzi pubblici a fasce — subito dopo il "come funziona"**
Cosa comunica: le 5 fasce €2k–€60k, con tempi e manutenzione, dichiarate "prima del
primo appuntamento".
*Perché:* la paura n.1 è il costo; i "numeri chiari prima" rassicurano (scunio: "vuole
specificità, non quote vaghe"). Mettere il prezzo **presto** è controintuitivo per chi
vende ma è pro-compratore: toglie l'ansia e auto-qualifica. Fatto SSOT (tabella fasce).
Aggiungere accanto, contro la paura "costo reale 3-4x": una riga onesta sul TCO →
"manutenzione inclusa e dichiarata, nessun costo nascosto" (gap: vedi §5).
[MY_INFERENCE sulla collocazione anticipata — premessa: prezzo pubblico è già la
strategia SSOT; anticiparlo amplifica il vantaggio. Da A/B testare.]

**4. La prova — "non credermi, guarda" (cantiere + GitHub + demo) RIFORMULATA**
Cosa comunica: qui, e solo qui (dopo che il compratore ha un motivo per volerla),
arriva la prova, tradotta in beneficio: "Vuoi vedere se lavoro davvero così? Tutto è
verificabile: il codice è pubblico, e mentre lavoro al tuo progetto vedi in diretta
quante ore ci metto e a che punto sono — la stessa trasparenza che avrai tu."
*Perché:* "evidence over assurance" (logiciel.io, righttail); prova collocata **dopo**
la promessa che deve sostenere, non prima (smart-team, unicornplatform). Il "cantiere"
va riformulato da metrica-fornitore a **beneficio-compratore** ("vedi a che punto sono,
non resti al buio") — vedi tabella anti-gergo. "Righe di codice" va tolto o reso
opzionale: non è un beneficio per un PMI. **Qui aggancia anche la prova-leva (§8):**
"non solo questo progetto — guarda l'intero corpo di lavoro pubblico" (vedi §8.5).

**5. La demo toccabile — prova concreta**
Cosa comunica: "Non screenshot: un sito vero che apri e tocchi" (IdealOro).
*Perché:* prova di capacità dimostrata. Resta, ma andrebbe **accompagnata da un
cliente reale** appena disponibile (gap §5: la prova di un pari converte di più —
mailerlite, oktopost).

**6. "Cosa ricevi alla fine" (ex-LSO) — beneficio prima del nome**
Cosa comunica: i 3 tratti tradotti in beneficio puro, SENZA aprire con i nomi
proprietari: "Il software che ti consegno (1) tiene il suo manuale sempre aggiornato
da solo, (2) risponde alle tue domande in italiano, (3) ti avvisa quando qualcosa non
torna. Risultato: **non resti in ostaggio di nessuno, nemmeno mio.**" Solo DOPO,
piccolo: "Questa categoria di software la chiamo Living Software Organism."
*Perché:* risponde alla paura n.3 (restare ostaggio) che è forte; ma la regola SSOT
stessa impone "beneficio prima del nome". Il nome proprietario e "Oracode Nexus"
diventano una nota a margine per i curiosi, non la confezione obbligatoria. Anti-gergo.

**7. Chi sono io (autorità + perché fidarsi) — NUOVA o rafforzata**
Cosa comunica: una riga su chi è Fabio + "parli con chi scrive il codice, non con un
venditore" + FlorenceEGI come prova ("il primo sistema costruito così è online, 8
piattaforme").
*Perché:* paura n.5 (voglio chi costruisce); autorità della guida (StoryBrand).
"8 organi" va riformulato in "8 piattaforme online" (anti-gergo). FlorenceEGI è prova
di capacità, non portfolio di clienti — dichiararlo onestamente.

**8. CTA finale calda**
Resta: "Prima chiamata: esci con un parere onesto" + email/WhatsApp. Buona così
(allineata SSOT). Qui Padmin può ricomparire come alternativa: "Non sei pronto a
scrivermi? Chiedi a Padmin."

### Tabella: sezione → obiezione che scioglie
| # | Sezione | Domanda/paura del compratore che risolve |
|---|---------|------------------------------------------|
| Hero | Identità + promessa + 1 CTA | Dove sono / cosa fai / cosa ci guadagno / cosa faccio |
| 1 | Il problema | "Mi capiscono davvero?" (empatia) |
| 2 | Come funziona (vedi prima) | "E se butto i soldi / non funziona?" (rischio) |
| 3 | Prezzi pubblici | "Quanto mi costa DAVVERO?" (paura n.1) |
| 4 | La prova (cantiere/GitHub) | "Posso crederci?" (evidence over assurance) |
| 5 | Demo toccabile | "Funziona per uno come me?" |
| 6 | Cosa ricevi (ex-LSO) | "Resto in ostaggio?" (paura n.3) |
| 7 | Chi sono | "Con chi parlo, è competente?" (paura n.5) |
| 8 | CTA finale | "Cosa faccio ora, senza pressione?" |

---

## 4. Tabella anti-gergo (termine insider → versione lato-compratore)

| Termine insider (oggi) | Perché confonde | Riscrittura per il compratore |
|---|---|---|
| "Cantiere aperto" | metafora interna, non significa nulla a freddo | "Vedi il mio lavoro in diretta" / "lavoro a porte aperte" |
| "Dati live dal tracker interno" | gergo tecnico | "Vedi in diretta a che punto è il tuo progetto" |
| "Righe nette di codice" | metrica-fornitore, zero beneficio | togliere, o "quanto lavoro c'è dietro" (declassata) |
| "MVP" | acronimo tecnico inglese | "una prima versione che provi con mano" (già SSOT) |
| "LSO / Living Software Organism" | nome proprietario in apertura | beneficio prima: "un software che si aggiorna il manuale da solo, gli parli, ti avvisa se qualcosa non torna" — il nome dopo |
| "Oracode Nexus / sistema operativo di costruzione" | gergo interno | "il mio metodo di lavoro" / spostare a nota per curiosi |
| "EGI-Sigillo / hash del front-end" | tecnicismo | "un certificato che garantisce che quel sito è unico e venduto a te solo" |
| "Pianale collaudato, carrozzeria unica" | metafora non spiegata | "la base tecnica è solida e collaudata; l'aspetto e le funzioni sono solo tue" |
| "8 organi online" | gergo dell'ecosistema | "8 piattaforme già online e funzionanti" |
| "La specie nuova / prova di nascita della specie" | metafora biologica | "un nuovo tipo di software" / "la prova che funziona davvero" |
| "Softwarehouse" (label hero) | più gergo nostro che del compratore | "Software su misura per PMI" |

---

## 5. Gap di dati reali (da chiedere al CEO — NON inventati qui)

1. **Prova sociale di un cliente reale PMI** — oggi le prove sono FlorenceEGI
   (progetto proprio) e IdealOro (demo fittizia). Manca il pari ("un imprenditore come
   me che ce l'ha fatta"), che la ricerca indica come la leva di fiducia più forte in
   B2B. Serve: nome/settore di un cliente reale + una frase di risultato verificabile,
   o il permesso di citarlo. **Se non esiste ancora, dichiararlo internamente e non
   fabbricare testimonianze.**
2. **Il problema-tipo da mettere nella sezione "Il problema"** — qual è il dolore n.1
   ricorrente dei clienti reali di Fabio? (gestionale che manca, dati sparsi, sito
   vecchio?) Serve per scrivere l'empatia su un dolore VERO, non generico.
3. **Numeri sulla velocità verificabili** — SSOT dice "≈2x mercato / prima versione in
   3-5 giorni" ma avverte che il compratore diffida delle promesse di velocità. Serve
   **una prova** di quel 2x (es. "progetto X consegnato in 5 settimane invece di 10")
   da poter mostrare, altrimenti il claim resta una promessa rischiosa. → §7 fornisce
   ora la baseline esterna citabile per chiudere parte di questo gap.
4. **Risposta esplicita alla paura del TCO (costo reale 3-4x)** — il SSOT dichiara
   manutenzione e fasce, ma il compratore teme i costi nascosti. Serve una riga
   ufficiale: "cosa è incluso e cosa no", per poterla mettere accanto ai prezzi senza
   inventare.
5. **Decisione CEO sul ruolo di Padmin sopra la piega** (CTA secondaria vs persistente
   vs in fondo) — è scelta di brand/UX, la approva il CEO.
6. **Headline/sottotitolo/CTA proposti** sono `[da validare CEO]`: nuovo copy, non
   estratto verbatim dall'SSOT (anche se ogni fatto sottostante lo è).

---

## 6. Fonti citate e cosa misurare

### Fonti (URL)
Linguaggio e paure del compratore PMI (italiano, dato osservato):
- https://www.scunio.com/blog/software-gestionale-su-misura-costi-vantaggi/ — "Excel,
  email, WhatsApp e 3-4 software", "chiedono prima di proporre", "diffida di chi
  promette tutto in 2 settimane", "parli con chi scrive il codice".
- https://www.gardainformatica.it/blog/sviluppo-software/costo-software-personalizzato-roi-pmi — TCO, discovery come investimento a ROI più alto.
- https://lacapitaledesign.it/blog/quanto-costa-un-software-gestionale-personalizzato-su-misura-guida-ai-prezzi-e-ai-fattori-chiave-con-la-capitale — fasce di prezzo, fattori di costo.

Criteri/paure compratore servizi custom (principio):
- https://logiciel.io/blog/how-to-evaluate-a-custom-software-development-company — processo formale, evidence over assurance.
- https://www.righttail.co/blog/how-to-choose-custom-software-development-company-2025-evaluation-guide — execution risk, IP, capacità dimostrata.
- https://svitla.com/blog/custom-software-development-providers/ — process & talent assessment.

Grunt test / above-the-fold (principio, StoryBrand/Miller):
- https://www.monicaink.ie/blog/does-your-website-pass-the-grunt-test
- https://www.agencyboon.com/blog/does-your-website-pass-the-storybrand-grunt-test/
- https://jareddees.com/grunt-test/ — testata risponde a chi/cosa/azione senza scroll.

Prova/risk-reversal/obiezioni B2B (principio):
- https://unicornplatform.com/blog/b2b-landing-pages/ — prova vicino al momento di
  attrito; expectation setting vicino alla CTA.
- https://smart-team.io/en/high-trust-b2b-landing-pages/ — distributed trust converte
  meglio di un blocco unico.
- https://www.mailerlite.com/blog/social-proof-examples-for-landing-pages — prova del
  pari.
- https://www.oktopost.com/glossary/what-is-b2b-social-proof-strategy/ — B2B
  risk-averse, peer proof.

Anti-gergo (principio):
- https://www.usertesting.com/blog/jargon-customer-experience — gergo = "talking down"/
  confusione.
- https://digital.gov/guides/plain-language/principles/avoid-jargon — usa parole che
  il pubblico già conosce.
- https://www.convertmate.io/blog/stop-overusing-jargon-in-ecommerce-copywriting —
  gergo abbassa la conversione.

### Cosa misurare (per provare il miglioramento, non asserirlo)
- **Grunt test su 5 estranei** (imprenditori PMI non tecnici): dopo 5 secondi sopra la
  piega, sanno dire di chi è / cosa fa / cosa ci guadagnano / cosa fare? Baseline:
  pagina attuale fallisce #1 e #4. Target: 4/5 rispondono a tutte e 4.
- **Scroll depth & rimbalzo** sulla vecchia sezione "cantiere" (2°) vs nuova posizione
  (4°): la prova spostata dopo la promessa dovrebbe ridurre il rimbalzo precoce.
- **Tasso di click sulla CTA primaria** "primo parere gratis" vs interazioni Padmin
  imposto sopra la piega.
- **Qualità delle richieste** in ingresso (auto-qualifica dovuta al prezzo anticipato):
  meno richieste fuori fascia.

---

## 7. Prova di velocità — benchmark esterni + multiplo derivato

> Obiettivo del CEO: dimostrare la velocità con **evidenza esterna citabile** (il
> "denominatore" di mercato), NON con autodichiarazioni. Il numeratore (nostri tempi)
> è MISURATO dal git; il denominatore è la baseline tipica di settore, CITATA.
> Multiplo derivato = baseline_mercato / nostro_tempo_misurato.

### 7.1 Numeratore — nostri tempi MISURATI (dato git, verificabile)
| Deliverable | Nostro tempo misurato | Fonte (interna, verificabile) |
|---|---|---|
| Operatore AI "Padmin" — chatbot RAG in produzione (LLM + retrieval Postgres/pgvector + vision + deploy EC2/nginx/TLS/rate-limit/IP pseudonimizzato + widget integrato) | **1 giorno** (prima riga di codice e go-live pubblico lo stesso giorno) | git history operatore [SSOT_TRUST: riportato dal CEO, non riletto dal git in questa missione] |
| Sito fabiocherici.com — Next.js 15 static export, React 19, 7 lingue (next-intl), design system, animazioni, + operatore | **~33 giorni di calendario** (110 commit) | git history sito [SSOT_TRUST: idem] |

### 7.2 Denominatore — baseline di mercato CITATE

**A) Chatbot RAG in produzione.** Più fonti indipendenti concordano:
- ment.tech (breakdown a fasi settimanali): *"a basic RAG chatbot for a single use case
  can be built in **four to eight weeks**"*; mid-complexity *"three to five months"*;
  full enterprise con compliance/multi-canale *"five to nine months"*.
- xsoneconsultants.com: *"Intermediate AI Assistant / RAG Implementation: **1 to 3
  Months**"* per soluzioni production-ready connesse a knowledge base aziendali;
  raccomanda di pianificare *"a 3 to 4-month timeline from discovery to full launch"*.
- Sintesi risultati di ricerca (più fonti): proof-of-concept 2-3 settimane;
  **production-ready con UI, auth, analytics, deploy in cloud: 6-10 settimane**.
→ **Baseline conservativa adottata: 4-8 settimane** (= 28-56 giorni di calendario) per
  il caso più semplice; 1-3 mesi se si pesa la fascia "production-ready" delle fonti.

**B) Sito web custom multilingua (su misura, non template).**
- Sintesi ricerca (orbitmedia, lumin, social animal, ecc.): media **4-8 settimane**; un
  progetto full **6-10 settimane**; redesign complesso **10-30+ settimane**. Per 7 lingue
  le fonti indicano la fascia alta per via della complessità multilingua.
→ **Baseline adottata: 6-10 settimane** (= 42-70 giorni) come progetto custom completo;
  fascia alta plausibile per 7 lingue (fino a 10-30 sett.).

**C) Software gestionale su misura per PMI** (rilevante per /softwarehouse).
- ivemind.com (2026): Basic €5-8k → **4-8 settimane**; Medium €8-15k → **2-4 mesi**;
  Complex da €15k → **4-6 mesi**.
- spaceotechnologies / soltech / ortemtech (sintesi): app semplice 4-8 settimane;
  mid-complexity **3-5 mesi**; piattaforma completa **6-12 mesi**; costi $15k-$250k+.
→ **Baseline adottata: 6-12 settimane** per un gestionale "Basic→Medium" PMI.

**D) Benchmark di delivery (contesto, NON multiplo).** DORA 2024 State of DevOps:
solo il **9,4%** dei team raggiunge un lead time < 1 ora; il **43,5%** impiega
**più di una settimana** dal commit alla produzione; solo ~16% deploya on-demand.
→ Uso onesto: NON è una baseline di "tempo-progetto" comparabile col nostro caso; serve
  solo a dire che "online in giornata" colloca il fornitore nella fascia minoritaria del
  settore per cadenza di rilascio. Da citare come contesto, non come moltiplicatore.

### 7.3 Multiplo derivato (mostro il calcolo)

| Deliverable | Baseline mercato (citata) | Nostro tempo (git) | Multiplo derivato | Calcolo |
|---|---|---|---|---|
| **Chatbot RAG in produzione** | 4-8 settimane = 28-56 gg (ment.tech, xsone) | 1 giorno | **~28x-56x** | 28÷1 … 56÷1. Se si pesa la fascia production-ready (1-3 mesi ≈ 30-90 gg): ~30x-90x |
| **Sito custom multilingua 7 lingue** | 6-10 settimane = 42-70 gg (orbitmedia ecc.) | ~33 gg (sito completo, operatore incluso) | **~1,3x-2,1x** | 42÷33 … 70÷33. Nella fascia alta multilingua (10-30 sett. = 70-210 gg): ~2x-6x |
| **Gestionale PMI su misura** | 6-12 settimane = 42-84 gg (ivemind, spaceo) | — (nessun progetto-cliente misurato) | **NON CALCOLABILE** | manca un numeratore reale per un gestionale-cliente; vedi gap |

**Lettura onesta del calcolo:**
- Il **multiplo forte e difendibile è sul chatbot RAG (~30x-50x)**: lì il confronto è
  più pulito perché il deliverable nostro (RAG + retrieval + vision + deploy hardened +
  widget) è almeno pari, spesso superiore, allo scope della baseline "basic single-use-
  case" delle fonti. È un confronto **conservativo a nostro sfavore** sulla baseline (ho
  usato 4-8 settimane, il minimo citato), quindi il multiplo reale è probabilmente
  maggiore, non minore.
- Sul **sito multilingua il multiplo è modesto e va dichiarato tale (~1,3x-2x)**: i ~33
  giorni includono ANCHE l'operatore Padmin, quindi non è un confronto a parità di scope;
  gonfiare qui sarebbe disonesto. Onestamente: "in linea o un po' sotto i tempi di
  un'agenzia per un sito custom 7 lingue — pur avendo costruito in più l'operatore AI".
- Sul **gestionale PMI NON ho un numeratore reale**: il git noto contiene il sito +
  l'operatore, non un gestionale consegnato a un cliente. Riportare un multiplo qui
  sarebbe inventato → lasciato come gap (collegato a §5.3).

### 7.4 Limiti di comparabilità (onestà — NON gonfiare)
- **Scope non identico.** Le baseline di settore includono spesso discovery formale,
  più stakeholder, QA estesa, compliance enterprise, cicli di approvazione cliente. Il
  nostro "1 giorno" è un fornitore singolo, full-stack, senza attriti di coordinamento.
  Parte del divario è **organizzativo** (un solo decisore = zero overhead), non solo
  "bravura tecnica". Va detto, altrimenti il claim è fragile.
- **"Production" ha definizioni diverse.** Il nostro Padmin è online, hardened e con
  vision; alcune baseline "4-8 settimane" includono fine-tuning di modelli e integrazioni
  legacy che noi non abbiamo fatto. Il confronto regge per un RAG production-ready
  standard; non per ogni "enterprise RAG" possibile.
- **Calendario vs effort.** I "33 giorni" del sito sono giorni di calendario (110
  commit), non necessariamente 33 giornate-uomo piene; anche le baseline d'agenzia sono
  calendario. Confronto calendario-vs-calendario = coerente, ma non è "ore-uomo".
- **Promesse di velocità = campanello d'allarme per il PMI** (vedi §1, paura n.4:
  scunio). Il multiplo va presentato come **fatto verificabile col git**, mai come slogan.

### 7.5 Come formulare la prova di velocità sulla pagina (senza autodichiarazioni, senza LOC)
Principio: **il PMI non crede alla velocità promessa; crede alla velocità che può
verificare.** Quindi la pagina non dice "sono 30x più veloce" — fa due cose:
1. **Mostra il fatto nostro, verificabile** (non LOC, che il PMI diffida): *"L'assistente
   AI che ti risponde in questa pagina l'ho progettato e messo online in un giorno. Il
   codice è pubblico: la prima riga e la versione live portano la stessa data."* — la
   prova è il git pubblico, non una dichiarazione.
2. **Affianca il riferimento di settore CITATO, non l'autoelogio**: *"Per un assistente
   come questo le agenzie indicano di norma 1-3 mesi"* — con nota/link alla fonte
   (ment.tech / xsoneconsultants). Il compratore fa **da solo** la divisione e arriva al
   "molto più veloce" senza che glielo gridiamo. Rispetta "evidence over assurance" (§1)
   e disinnesca la diffidenza verso le promesse di velocità (paura n.4).
3. **Tono onesto sul sito**: NON rivendicare un multiplo grosso sul sito multilingua
   (è ~1,3-2x); lì usare un'altra leva ("in più ho costruito l'operatore AI"), non la
   velocità. Concentrare il claim di velocità dove regge: il chatbot RAG.
4. **Niente "righe di codice", niente "ore tracciate" come prova di velocità** (già
   declassate in §4 anti-gergo): per il PMI sono metriche-fornitore. La prova di velocità
   è "data di inizio vs data online" + "tempo di mercato citato", entrambe verificabili.

---

## 8. Prova-leva: output one-person vs equivalente-team di mercato

> **Tesi approvata dal CEO (da dimostrare, non da discutere):** una persona sola, nello
> stesso arco temporale e **in parallelo**, ha prodotto e manda avanti un corpo di lavoro
> che il mercato copre solo con un **team** su **oltre un anno**. Il moltiplicatore non
> vive nel singolo deliverable (quello è la §7), ma nell'**ampiezza simultanea**: tanti
> progetti vivi contemporaneamente, ciascuno pubblico, datato e contabile nel git.
>
> Differenza con la §7: la §7 confronta UN deliverable contro la sua baseline di mercato
> (velocità puntuale). La §8 confronta l'**intero portfolio** contro l'organizzazione che
> il mercato impiegherebbe per produrlo e mantenerlo (leva di scala). Sono due prove
> diverse e complementari.

### 8.1 Il numeratore aggregato — il corpo di lavoro one-person (dato git, verificabile)

Fonte: ledger EGI-STAT (ore stima-da-commit per progetto). **Tutte le ore sono
commit-estimate = un PAVIMENTO**: misurano l'effort desumibile dai commit, non un
cronometro; le ore reali sono ≥. [SSOT_TRUST: cifre fornite dal CEO dal ledger EGI-STAT,
non ri-calcolate dal git in questa missione.]

| Indicatore aggregato | Valore | Natura |
|---|---|---|
| Repo/progetti totali | **23** | conteggio git |
| Progetti attivi negli ultimi 30 gg | **21** | → lavoro **simultaneo**, non sequenziale |
| Ore-lavoro totali (commit-estimate) | **≈ 2.311 h** | PAVIMENTO (reale ≥) |
| Arco temporale | **dic 2024 → giu 2026 ≈ 18 mesi** | date di commit sovrapposte = prova del parallelismo |

Composizione (estratto, ore commit-estimate): EGI 984,0h · EGI-DOC 292,5h · NATAN_LOC
270,7h · EGI-HUB 141,8h · EGI-HUB-HOME-REACT 93,0h · EGI-Credential 88,5h · os3-matrix
69,7h · Fucina 44,7h · oracode 44,7h · fabiocherici 39,8h · EGI-SIGILLO 39,4h ·
CREATOR-STAGING 39,0h · EGI-STAT 38,5h · Pinocapasso 35,2h · EGI-INFO 31,8h · LA-BOTTEGA
26,2h · le-vespe-cafe 13,0h · DeepDebug 10,5h · FORTINO 3,0h · altri minori.

**La prova del parallelismo è nelle date che si sovrappongono**: non è "un progetto, poi
il successivo". Nello stesso periodo convivono un marketplace (EGI), il suo hub, il
sistema di credenziali (EGI-Credential), il Sigillo, le statistiche (EGI-STAT), più
siti-cliente (fabiocherici, pinocapasso, le-vespe, la-bottega) e i **meta-strumenti che
fabbricano software** (Fucina, DeepDebug, os3-matrix, Oracode Nexus). Questa **ampiezza
contemporanea** è ciò che, nel mercato, richiede un'organizzazione, non una persona.

### 8.2 Il denominatore — cosa serve al mercato per la stessa ampiezza (CITATO)

**B1) Dimensione tipica del team per un portfolio multi-prodotto.** Le fonti convergono:
- *deazy / onix / clockwise / itrexgroup / makeitsimple* (sintesi): progetto piccolo
  **3-5 persone**; progetto medio (3-9 mesi) **4-8 persone** (3-5 dev + 1-2 QA + 1 PM/PO
  + 1 designer); progetto grande/complesso (9+ mesi) **8-20+ persone**, organizzate in
  più team da 5-9. Un **ecosistema multi-prodotto** (più piattaforme che si parlano +
  più siti + strumenti interni) ricade nella fascia "large/complesso": **≥ 8 persone**,
  spesso suddivise per prodotto.
- *makeitsimple*: "the sweet spot is usually **5-10 people**".
→ **Baseline conservativa adottata: un team di 5-8 persone** per produrre e mantenere
  un'ampiezza equivalente (prendo la fascia BASSA del "large/complesso" e la sovrappongo
  allo "sweet spot", per restare a nostro sfavore).

**B2) Costo-azienda di uno sviluppatore in Italia (per monetizzare il team).**
- RAL media sviluppatore Italia 2025-26: **≈ €31.400-37.700** (Glassdoor, Indeed,
  bsness); senior €45-60k+.
- Moltiplicatore **RAL → costo-azienda reale: ×1,4-1,6** (contributi INPS ~31%, TFR
  6,91%, INAIL, IRAP): es. RAL €30k → costo-azienda **€42-48k/anno** (centrobustepaga,
  coverflex, danea).
- Riscontro indipendente: una software house con **5 sviluppatori** ha costi fissi
  **€150-250k/anno** = **€30-50k per sviluppatore** (softwarebusinessplan / bsness).
→ **Baseline costo-azienda adottata: €40-50k per persona/anno** (figura mista
  dev/QA/PM/designer; conservativa rispetto ai senior).

### 8.3 Equivalente-team derivato — DUE letture, entrambe col calcolo mostrato

Non spaccio un "Nx" secco: l'aggregato non è un confronto testa-a-testa pulito. Mostro
due derivazioni grounded e dichiaro i limiti.

**Lettura A — pavimento da ore (conservativa, SOTTOSTIMA la leva).**
Converto le ore aggregate in equivalente-persona a tempo pieno.
- FTE coding netto/anno ≈ **1.400-1.600 h** (giornate-uomo al netto di
  meeting/overhead). [MY_INFERENCE su questa cifra: assunzione standard di settore, non
  un dato citato puntualmente.]
- 2.311 h ÷ 1.500 h ≈ **1,5 FTE-anni** di puro effort-al-codice.
- Su un arco di 18 mesi (= 1,5 anni) → ≈ **1 FTE costante** a saturazione piena.

*Lettura onesta:* questo NON è il moltiplicatore. Dice solo che il **volume di codice**
prodotto equivale a ~1,5 anni-uomo di scrittura. Sottostima la leva perché **ignora il
parallelismo e il coordinamento**: nel mercato, 21 progetti vivi insieme NON si fanno con
1 persona-equivalente — richiedono più teste perché nessun individuo regge in parallelo
marketplace + credenziali + 4 siti-cliente + strumenti, e perché il mercato aggiunge PM,
QA, designer, riunioni. **Il pavimento-ore è il limite inferiore, non la prova.**

**Lettura B — equivalente-team da ampiezza (la prova vera della tesi).**
Il mercato non guarda "quante ore di codice", guarda "quante teste servono per **tenere
in piedi quel portfolio** in quel tempo". Per un ecosistema multi-prodotto di questa
ampiezza la baseline citata è **5-8 persone** (B1).
- **Equivalente-team: 5-8 persone** che lavorano per l'arco osservato (**≈ 18 mesi**).
- **Costo-mercato equivalente** (B2, €40-50k/persona/anno):
  - minimo: 5 persone × €40k × 1,5 anni = **€300.000**
  - massimo: 8 persone × €50k × 1,5 anni = **€600.000**
  → **costo-mercato ≈ €300k-600k** per produrre/mantenere un'ampiezza equivalente.
- **Tutto questo da 1 persona.**

*Come si esprime onestamente:* NON "sono 6 volte più produttivo" (gonfiato e non
verificabile testa-a-testa). MA: **"l'output di una software house di 5-8 persone per
oltre un anno — un equivalente di mercato di €300.000-600.000 — prodotto e mantenuto da
una persona sola, e ogni riga è pubblica e datata nel git."** Il multiplo (≈5x-8x come
equivalente-team) cade dal rapporto teste-mercato ÷ 1, non da un numero inventato.

**Sintesi del calcolo (mostrato):**
| | Mercato (citato) | One-person (git) | Derivazione |
|---|---|---|---|
| Teste per il portfolio | 5-8 persone | 1 | equivalente-team **5x-8x** |
| Tempo | ≈ 18 mesi | ≈ 18 mesi | stesso arco (parallelo, non più lento) |
| Costo-azienda equivalente | €300k-600k | — | (5-8 × €40-50k × 1,5 anni) |
| Volume codice (pavimento-ore) | — | ≈1,5 FTE-anni | 2.311h ÷ 1.500h (limite inferiore) |

### 8.4 Limiti di comparabilità (onestà obbligatoria — NON gonfiare)
- **Ampiezza-aggregata, non progetto testa-a-testa.** Confronto il *portfolio* contro
  l'*organizzazione che lo produrrebbe*, non il progetto X contro il progetto X. È una
  prova di **scala/leva**, non di velocità puntuale (quella è la §7).
- **Ore = commit-estimate = pavimento.** Le 2.311h sono desunte dai commit, non
  cronometrate; il reale è ≥. Non gonfio: uso il pavimento e lo dichiaro.
- **Scope non identico.** Un team di mercato include discovery formale, QA dedicata, PM,
  designer, cicli di approvazione. Parte del vantaggio one-person è **organizzativo**
  (zero overhead di coordinamento, un solo decisore), non solo "bravura". Va detto.
- **La leva metodologica fa parte della prova, ed è la variabile.** Oracode Nexus /
  i meta-strumenti (Fucina, os3-matrix) sono ciò che rende possibile l'ampiezza: il
  moltiplicatore non è "una persona magica", è "una persona + un metodo che fabbrica
  software". Questo è onesto e anzi rafforza il claim (è spiegabile/replicabile), ma va
  detto così, non come superpotere individuale.
- **Range, non punto.** 5x-8x e €300k-600k sono il range della baseline citata applicato
  a 1, non la misura di un singolo confronto. [MY_INFERENCE sull'aritmetica del range.]

### 8.5 Copy della sezione-prova per la pagina `[da validare CEO]`
Principio (come §7.5): **il PMI non crede alla leva dichiarata; crede alla leva che può
verificare**, e diffida di chi "promette troppo" (§1, paura n.4). Quindi la pagina NON
grida "valgo come 8 persone": mostra il fatto verificabile + il riferimento di mercato
citato, e lascia che la divisione la faccia il compratore. Tradotta in beneficio per il
PMI: *"per questo il tuo progetto lo consegno prima e ti costa meno"*.

> **Eyebrow** `[da validare CEO]`: "PERCHÉ UNA PERSONA SOLA TI BASTA"
>
> **Titolo** `[da validare CEO]`: "Da solo, ma con la potenza di un team — e puoi
> verificarlo tu stesso."
>
> **Corpo** `[da validare CEO]`:
> "In diciotto mesi ho costruito e tengo in vita **23 progetti** allo stesso tempo: un
> mercato online completo, i suoi strumenti, e i siti di altre imprese come la tua. Non
> uno dopo l'altro — **tutti insieme**.
>
> Per portare avanti tutto questo, un'agenzia mette in campo **un team di cinque-otto
> persone per più di un anno** — un costo di mercato tra i **300.000 e i 600.000 euro**
> [con link alle fonti: dimensioni team + costo-azienda sviluppatore Italia]. Io lo
> faccio da solo, con un metodo che mi moltiplica.
>
> **Per te significa una cosa semplice: il tuo lavoro lo consegno prima e ti costa meno.**
>
> E non devi fidarti sulla parola: **ogni riga di codice è pubblica, con la sua data.**
> Quello che leggi qui puoi verificarlo tu stesso — riga per riga, giorno per giorno."

Note di tono (grounded su §1):
- "puoi verificarlo tu stesso" / "non devi fidarti sulla parola" → disinnesca la paura
  n.4 ("promette troppo") trasformando la leva da vanto a **fatto verificabile**
  (evidence over assurance: logiciel.io, righttail).
- "consegno prima e ti costa meno" → traduce la leva in **beneficio per il compratore**,
  non in metrica-fornitore. NIENTE LOC, niente "ore tracciate" (§4 anti-gergo).
- "un metodo che mi moltiplica" → riferimento onesto alla leva metodologica senza gergo
  ("Oracode Nexus" resta nota per curiosi, §3 sezione 6).
- I numeri €300k-600k e "5-8 persone" sono **citati da fonti esterne**, non
  auto-dichiarati: è il mercato a dire quanto serve, non noi.
- Collocazione consigliata: dentro o subito accanto alla sezione "La prova" (§3, sez. 4),
  perché è la stessa logica ("non credermi, guarda il git") ma scalata al portfolio.

### 8.6 Gap di dati reali per chiudere la §8 (da CEO/SSOT — NON inventati qui)
1. **Ri-verifica git delle ore aggregate e del conteggio repo** prima della
   pubblicazione: le 2.311h / 23 repo / 21 attivi sono dal ledger EGI-STAT riportato,
   non ri-calcolate in questa missione. Se vanno in pagina, ancorarle a un export
   datato/firmato (lo stesso principio "verificabile" che vendiamo).
2. **Quali dei 23 repo sono PUBBLICI e linkabili.** Il claim "ogni riga è pubblica"
   regge solo per i repo effettivamente pubblici. Se alcuni sono privati, riformulare in
   "i progetti pubblici sono N, verificabili qui [link]". Da confermare.
3. **Decisione CEO sul framing del multiplo**: usare "equivalente di una software house
   di 5-8 persone / €300-600k" (lettura B, raccomandata) e NON un "Nx" secco. Conferma.
4. **Costo-azienda dev**: se il CEO ha un dato più preciso per il profilo reale (es. RAL
   senior + P.IVA), aggiornare la forchetta €40-50k; la mia è conservativa da fonti
   generaliste.

### 8.7 Fonti §8 (URL — dato osservato vs principio)
Dimensione team / portfolio (principio, sintesi multi-fonte):
- https://www.deazy.com/knowledge-hub/software-development-team-roles-and-responsibilities — ruoli e composizione team.
- https://onix-systems.com/blog/software-development-team-size-and-roles — dimensione ideale e ruoli.
- https://clockwise.software/blog/software-development-team-structure/ — struttura team 2025.
- https://itrexgroup.com/blog/software-development-team-structure/ — fattori e fasce di dimensione.
- https://www.makeitsimple.co.uk/blog/software-development-team-structure — "sweet spot 5-10 people"; fasce small/medium/large.

Costo-azienda sviluppatore Italia (dato osservato):
- https://www.glassdoor.it/Stipendi/sviluppatore-software-stipendio-SRCH_KO0,21.htm — RAL media ~€31.450.
- https://it.indeed.com/career/sviluppatore-software/salaries — RAL media ~€31.634.
- https://www.bsness.com/quanto-guadagna-unimpresa/quanto-guadagna-sviluppo-software/ — fasce RAL junior/mid/senior; software house 5 dev = €150-250k costi fissi.
- https://centrobustepaga.it/calcolo-costo-azienda.php — moltiplicatore RAL→costo-azienda ×1,4-1,6.
- https://www.coverflex.com/it/blog/come-calcolare-il-costo-di-un-dipendente-per-azienda — composizione costo-azienda (INPS, TFR, INAIL, IRAP).
- https://www.danea.it/blog/costo-aziendale-dipendente/ — voci di costo aziendale dipendente.

---

## UNCERTAINTY FLAGS
- [MY_INFERENCE] Paura "restare in ostaggio" (n.3): dedotta dal JTBD + frase SSOT, non
  da intervista cliente. Da validare.
- [MY_INFERENCE] Collocazione anticipata dei prezzi e ruolo di Padmin come CTA
  secondaria: scelte di copy/UX motivate da principi citati, da confermare con A/B test.
- [SSOT_TRUST] Tutti i fatti di prodotto (fasce, processo, velocità, Sigillo, LSO,
  FlorenceEGI) provengono da commercial-claims-public.md; non verificati contro
  l'SSOT interno commercial-claims.md (non letto in questa analisi) né contro dati live.
- [SSOT_TRUST] §7: i nostri tempi-numeratore ("1 giorno" Padmin, "~33 giorni / 110
  commit" sito) sono stati FORNITI dal CEO come dato git; NON ri-verificati con
  `git log` in questa missione. Se il claim va in pagina, ri-misurarli dal git reale
  (prima commit operatore vs timestamp go-live; first/last commit sito).
- [SSOT_TRUST] §8: il numeratore aggregato (2.311h commit-estimate, 23 repo, 21 attivi,
  ripartizione ore per progetto, arco dic 2024→giu 2026) è FORNITO dal CEO dal ledger
  EGI-STAT; NON ri-calcolato dal git in questa missione. Le ore sono dichiarate dal CEO
  come commit-estimate = PAVIMENTO (reale ≥). Da ri-ancorare a export datato prima della
  pubblicazione.
- [MY_INFERENCE] §7.3: le baseline di mercato sono espresse dalle fonti come RANGE; il
  multiplo derivato eredita quel range. I valori "30x-90x", "1,3x-6x" sono aritmetica sul
  range citato, NON misure di un singolo progetto comparabile testa-a-testa.
- [MY_INFERENCE] §8.3: l'equivalente-team "5x-8x" e il costo-mercato "€300k-600k" sono
  aritmetica sul range delle baseline citate (5-8 persone × €40-50k × 1,5 anni) applicata
  a 1 persona, NON la misura di un confronto testa-a-testa con una software house reale
  comparabile. È una stima di SCALA/AMPIEZZA, non di velocità puntuale.
- [MY_INFERENCE] §8.3 Lettura A: "1.400-1.600 h FTE coding/anno" è un'assunzione standard
  di settore (giornate-uomo al netto di overhead), non una cifra citata da fonte
  puntuale. Usata solo come limite inferiore conservativo, non come prova.
- [MY_INFERENCE] §8.2: classificare l'ecosistema EGI come "large/complesso → 5-8 persone"
  è un giudizio mio sulla natura del portfolio (multi-prodotto), motivato dalle fonti ma
  non verificato da una stima di scoping indipendente del portfolio reale.
- [NOT_FOUND≠NOT_EXIST] Nessun numeratore reale per un "gestionale PMI consegnato a
  cliente" nel git noto → multiplo gestionale lasciato non calcolabile, non inesistente.
- [NOT_FOUND≠NOT_EXIST] Nessuna prova sociale di cliente reale PMI trovata negli SSOT
  letti; potrebbe esistere altrove — segnalata come gap, non come inesistente.
- [NOT_FOUND≠NOT_EXIST] §8.6: quali dei 23 repo siano effettivamente pubblici NON è
  stato verificato in questa missione; il claim "ogni riga è pubblica" va confermato repo
  per repo prima della pubblicazione.
- [PARTIAL_READ] Letto namespace `softwarehouse` di it.json e page.tsx; non letti gli
  altri 6 file lingua né i componenti AdvisorSlot/LiveSiteStats nel dettaglio.
- [PARTIAL_READ] §7: orbitmedia non leggibile (HTTP 403); baseline sito multilingua presa
  dalla sintesi-ricerca aggregata (più fonti) anziché da una singola fonte primaria letta
  per intero. RAG, sito e gestionale ancorati a fonti rilette via WebFetch.
- [PARTIAL_READ] §8: dimensione-team da sintesi-ricerca aggregata (deazy/onix/clockwise/
  itrexgroup/makeitsimple) via snippet, non tutte rilette per intero via WebFetch;
  costo-azienda dev verificato via WebFetch (bsness) + snippet di ricerca su moltiplicatore
  RAL (centrobustepaga/coverflex/danea).
- Headline/sottotitolo/CTA/copy §8 proposti = nuovo copy `[da validare CEO]`, non verbatim
  SSOT.

---

## 9. Risoluzione VERIFICABILITÀ (verificata 2026-06-16, approvata CEO)

La prova-leva (§8) si regge su "verifica tu stesso". Verificato **cosa è realmente
pubblico** (non autodichiarato): org GitHub `florenceegi` = **6 repo pubblici, 18 privati**;
prodotti live testati via HTTP/DNS.

### Cosa la pagina PUÒ dire "vai e guarda" (pubblico, confermato HTTP 200)
- **florenceegi.com** · **art.florenceegi.com** (marketplace, opere reali, cliccabili) ·
  **fabiocherici.com** · **Padmin** (nexus.fabiocherici.com — l'assistente in pagina).
- **Repo pubblici** navigabili: `fabiocherici`, `oracode` (+ EGI-INFO, EGI-HUB-HOME-REACT,
  creator-staging, IDEALORO-PREVIEW).
- **Numeri-lavoro aggregati**: API pubblica `/api/public/site-stats` (widget cantiere).

### Cosa NON è pubblico → strada di verifica PRIVATA (decisione CEO)
- **18 repo proprietari** (EGI, EGI-HUB, EGI-Credential, EGI-STAT, Fucina, DeepDebug,
  os3-matrix, NATAN_LOC…) e la **dashboard stat completa** (sotto auth) **NON** sono navigabili.
- **Regola onesta approvata dal CEO:** in pagina si fanno le **affermazioni veritiere**
  (ampiezza, 23 progetti, equivalente-team 5-8 / €300-600k) e si **offre la verifica in
  privato** — *"il pubblico lo apri ora; il resto, se vuoi controllare, te lo mostro in una
  sessione privata"*. La proprietarietà diventa **offerta di credibilità + gancio CTA**, mai
  un claim falso "tutto pubblico".

### Cosa la pagina NON può citare (non confermato)
- **pinocapasso.com**: DNS non risolve dal check → escluso finché il CEO non indica il
  dominio reale/online.
- **levespe.com**: DNS risolve ma HTTP non serve (000) → non confermato vivo, escluso.

> Regola operativa per engineer-frontend: ogni claim verificabile in pagina punta SOLO a
> URL pubblici confermati sopra; per il privato usare il pattern "verifica in privato"
> (CTA), MAI link a risorse non pubbliche. Niente pinocapasso/levespe finché non riconfermati.
