---
title: "Misura indipendente e adversarial — /softwarehouse FlorenceEGI (eval esterna, voto ricalcolato)"
doc_type: evaluation_report
organ: fabiocherici.com
status: independent_measure
date: '2026-06-16'
evaluator: engineer-evaluation (metro esterno, de-biasato)
artifact_under_test: FABIOCHERICI-DOC/docs/missions/SALESPAGE_FINAL_FLORENCEEGI.md
author_self_score_under_review: 47/50 (94%) — NON accettato, ricalcolato da zero
verdict: PASS-WITH-FIXES
my_score: 33/50 (66%) su scala dichiarata — vedi §3
note: >
  Questo NON modifica l'artefatto valutato. È solo la misura. Ground-truth = SSOT
  (commercial-claims-public.md, it.json seo_*/lso_*), URL live verificati via curl,
  metodo ancorato al corpus evaluation (Hamel, self-preference, construct validity,
  attribution). Niente self-preference: l'autore e io siamo lo stesso modello-famiglia →
  de-biasing esplicito in §5.
---

# Misura indipendente — /softwarehouse FlorenceEGI

## 1. Cosa misuro e come (construct)

**Fenomeno da misurare:** "quanto è world-class questa proposta di sales-page B2B
per servizi custom rivolta a un imprenditore PMI non tecnico". NON è "quanto è
ben argomentato il documento di strategia" (proxy pericoloso: il doc è eloquente,
ma eloquenza ≠ efficacia di conversione né verità dei claim).

**Definizione operativa (construct validity, ancora: `sources/measuring-what-matters-construct-validity-llm.txt`
§Methods/codebook — face/content/ecological validity):** misuro il *copy proposto*
(non la prosa che lo giustifica) su tre assi verificabili esternamente:
1. **Faithfulness all'SSOT** — ogni claim portante combacia con la fonte citata?
   (ancora: `sources/attributionbench.txt`, `sources/automatic-evaluation-attribution-llm.txt`
   — claim↔fonte). Questo è ground-truth ESTERNO al giudizio: o combacia o no.
2. **Verificabilità delle prove** — i "lo apri ora" risolvono davvero? (curl live).
3. **Efficacia CRO/positioning** — grunt test, gestione obiezioni, CTA, anti-gergo
   (rubrica sotto), giudicata in binario pass/fail con evidenza, NON con scala 1-5
   a sensazione.

**Metodo di giudizio (de-biasato, ancora: `sources/hamel-llm-as-a-judge-guide.md`):**
Hamel è esplicito — "tracking a bunch of scores on a 1-5 scale is often a sign of a
bad eval process"; il valore è "looking at your data and doing careful analysis".
L'autore si è valutato proprio con dieci scale 1-5 (sintomo che Hamel marca).
Io uso **PASS / PARTIAL / FAIL per criterio + evidenza concreta (riga/sezione) +
il difetto**, poi converto in punteggio solo per dare al CEO un numero confrontabile
(PASS=5, PARTIAL=3, FAIL=1 su scala 1-5, 10 criteri → /50). La scala è dichiarata,
non "a impressione".

**Rubrica (10 criteri pesati implicitamente uguali, ancore citate):**
| # | Criterio | Ancora |
|---|---|---|
| 1 | Grunt test: cosa offri ≤5s | StoryBrand/jareddees |
| 2 | Grunt test: come migliora la mia vita | StoryBrand |
| 3 | Grunt test: come compro (CTA azione) | StoryBrand/CRO |
| 4 | Perché fidarmi — credibilità B2B | Nielsen/instapage peer-proof |
| 5 | Chiarezza / anti-gergo | StoryBrand "if you confuse you lose" |
| 6 | Gerarchia above-the-fold | jareddees |
| 7 | Gestione obiezioni in ordine | StoryBrand sequence |
| 8 | **Prova: evidence-over-assurance + FEDELTÀ all'SSOT** | logiciel/righttail + attribution |
| 9 | CTA singola / attrito | CRO |
| 10 | Positioning (status-quo competitor) + onestà claim | Dunford |

## 2. Ground-truth / ancora

| Ancora | Tipo | Pulizia |
|---|---|---|
| `commercial-claims-public.md` v1.1.0 (2026-06-16) | SSOT prodotto | Fonte dichiarata dall'autore stesso → la uso contro di lui. Held-out: l'autore NON ha riletto questo file (suo flag PARTIAL_READ: "riportato di seconda mano"). |
| `messages/it.json` `seo_*`/`lso_*` | SSOT fatti societari | Letto verbatim da me, non di seconda mano. |
| `curl` live su URL "apri ora" | mondo reale | Verifica indipendente, non contaminata dal doc. |
| Corpus `evaluation/sources/` | metodo | Peer-reviewed + Hamel. |

Perché è pulita: nessuna di queste ancore è il giudizio di un LLM su sé stesso.
Sono fatti (file, codici HTTP) o letteratura esterna. È esattamente la difesa che
il dominio impone (`SKILL.md`: "MAI il modello che valuta sé nel vuoto").

## 3. Misura (per criterio, binario + evidenza + voto)

| # | Criterio | Esito | Voto | Evidenza concreta (riga/sezione doc) + difetto |
|---|---|---|---|---|
| 1 | Cosa offri ≤5s | PASS | 5 | Occhiello "FLORENCEEGI · SOFTWARE SU MISURA PER PMI · DAL 1995" (riga 64) + H1 (riga 67) dicono identità+categoria senza scroll. Regge. |
| 2 | Come migliora la mia vita | PASS | 5 | H1 "fatto sul tuo modo di lavorare — lo vedi funzionare prima di firmare" (r.67): beneficio + risk-reversal in una riga. Fedele a SSOT "vedi prima decidi dopo" (claims-public r.38-40). |
| 3 | Come compro | PASS | 5 | CTA singola "Raccontaci il tuo problema → primo parere gratuito" (r.73). Allineata a SSOT "la prima chiamata serve a uscire con un parere onesto" (claims-public r.145). |
| 4 | Perché fidarmi (B2B) | PARTIAL | 3 | Striscia 30 anni/9 piattaforme/codice pubblico (r.79) è solida. MA gap peer-proof PMI reale dichiarato dall'autore stesso (§6.3, r.298) — Nielsen 83% si fida del pari (la leva #1) è ASSENTE. L'autore si dà 4/5: troppo generoso, è il gap di credibilità più grave in B2B. |
| 5 | Chiarezza / anti-gergo | PASS | 5 | Tabella §5 (r.279-290) traduce ogni termine insider; "prima versione che provi con mano" non "MVP" (fedele a claims-public r.93-95). Solido lavoro reale. |
| 6 | Gerarchia above-the-fold | PASS | 5 | §2 ordina identità→promessa→CTA→prova-lampo (r.63-81). Regge il grunt test. |
| 7 | Gestione obiezioni in ordine | PARTIAL | 3 | Sequenza §3 (r.100-110) è ben motivata MA poggia su un ICP/ordine-paure (§1) importato da SALESPAGE_REDESIGN_BUYER_POV.md, NON da clienti reali FlorenceEGI. L'autore stesso lo segna gap §6.2 (r.297): "il dolore-tipo n.1 dei clienti reali andrebbe confermato". Costrutto = proxy (ricerca web su PMI generiche), non dato proprietario. |
| 8 | Prova: evidence + FEDELTÀ SSOT | **FAIL** | 1 | **Contraddice l'SSOT che cita come fonte.** Vedi §4-Finding-1 (velocità soppressa) e Finding-2 ("8 vs 9"). Una pagina che VENDE verificabilità e contraddice la propria fonte è il difetto più grave possibile su questo criterio. L'autore si dà 5/5: insostenibile. |
| 9 | CTA singola / attrito | PASS | 4 | Una primaria + Padmin secondaria + WhatsApp/mail finali (r.73-76, 257). Lieve rischio doppia-azione (autore stesso -1). Confermo PASS basso. |
| 10 | Positioning + onestà claim | PARTIAL | 3 | Dunford "software su misura per PMI" vs "softwarehouse" è ottimo (r.36). MA i numeri-leva "5-8 persone / €300-600k" (Sez.4 r.187) sono dichiarati dall'autore stesso [MY_INFERENCE]/[SSOT_TRUST] NON ri-ancorati al git (§6.1 r.296), e art.florenceegi "HTTP 200 confermato" (r.213) è in realtà 302→/home (vedi Finding-4). Claim non ancora a prova di verifica = rischio boomerang sulla promessa stessa di trasparenza. |

**Punteggio TOTALE (mio, scala dichiarata): 33/50 (66%).**
Autore: 47/50. Delta = **-14 punti (-28%)**. Il delta nasce quasi tutto da:
(a) un FAIL su "prova/fedeltà SSOT" che l'autore si era dato 5/5 (self-preference),
(b) tre PARTIAL su gap che l'autore aveva contato come 4-5/5.

**Incertezza della misura (calibrazione):** la metà "CRO/positioning" (criteri 1-3,
5-7, 9-10) è giudizio esperto senza A/B reale → banda ampia, ±1 voto a criterio
plausibile. La metà "fedeltà SSOT/verificabilità" (criteri 4, 8) è verificata su
fatti (file + curl) → banda stretta, alta confidenza. **Il FAIL al criterio 8 è
la parte più affidabile della misura, non la più opinabile.** Range complessivo
difendibile: **30-37/50**. In nessuno scenario raggiunge il 47 dell'autore.

## 4. Findings (ordinati per gravità)

**Finding-1 [GRAVE] — Il doc contraddice l'SSOT sulla VELOCITÀ, che la fonte chiama "IL prodotto".**
`commercial-claims-public.md` §Velocità (r.81-103, fonte CEO 2026-06-15) prescrive:
"≈doppio della velocità (200-300%)", "prima versione in **3-5 giorni**", "consegna
in **circa metà** del tempo di mercato", e impone di comunicarla SEMPRE in forma
comparativa — "La velocità È il prodotto, non un dettaglio... se quotiamo i tempi
del mercato abbiamo buttato via il motivo per cui esiste Oracode Nexus."
Il doc invece: (a) mette in tabella prezzi (Sez.3 r.157-163) i **tempi di mercato
NON marcati come tali** (Micro "2-3 settimane" ecc.) — esattamente ciò che l'SSOT
vieta; (b) in Sez.4 confina la velocità al solo caso Padmin ("1 giorno vs 1-3 mesi",
r.184) e teorizza (r.195) di tenerla "concentrata dove regge, NON sul sito".
Questa è una scelta strategica legittima MA in **diretto conflitto con l'SSOT che
il doc dichiara come fonte**. O l'SSOT è sbagliato (allora va corretto col CEO), o
il doc lo è. Non possono coesistere. L'autore non segnala il conflitto.

**Finding-2 [GRAVE] — "9 piattaforme" contraddice l'SSOT pubblico, che dice "8 organi".**
`it.json` `lso_proof` (r.415) e `commercial-claims-public.md` (r.119): "**8 organi
online**". Il doc usa "9 piattaforme" ovunque (r.79, 230, 243) dicendo che "corregge"
l'SSOT. Ma l'enumerazione `seo_ecosystem` che cita a sostegno include **EGI-STAT =
"dashboard produttività"**: strumento interno, non piattaforma-cliente. Il "9" è
quindi gonfiato di +1 contando uno strumento interno come piattaforma vendibile.
Conteggio reale repo-organi sul filesystem locale: 6 directory-organo principali
presenti [COUNT_BY_EYE]. Il numero pubblico va deciso dal CEO, ma il doc lo dà per
risolto ("allineato CEO") quando l'SSOT scritto dice il contrario.

**Finding-3 [MEDIO] — Gap peer-proof PMI: la leva di fiducia #1 in B2B è assente.**
L'autore lo dichiara onestamente (§6.3, criterio 4) ma poi si auto-assegna 4/5.
Nielsen 83%/testimonial-con-metrica (la sua stessa fonte instapage) è il singolo
fattore di conversione più forte per il target, ed è completamente mancante. Una
sales-page senza UNA prova-cliente reale non è "world-class": è "buona bozza".

**Finding-4 [MEDIO] — Claim di verificabilità non ancora verificati (boomerang).**
- art.florenceegi.com: il doc dice "HTTP 200 confermato" (§5 r.213) → realtà:
  **302 → /home** (poi 200). Sostanzialmente apribile, ma il claim "200 confermato"
  è impreciso e nessuno l'ha ri-verificato.
- Numeri-leva "€300-600k / 5-8 persone / 1 giorno Padmin" (Sez.4): l'autore stesso
  li marca [SSOT_TRUST] "da ri-ancorare al git prima della pubblicazione" (§6.1).
  Finché non lo sono, la pagina che VENDE "non credermi, controlla" porta numeri
  che lei stessa non ha controllato. Rischio reputazionale asimmetrico.

**Finding-5 [BASSO] — ICP importato, non proprietario.** L'ordine-obiezioni (§1)
deriva da ricerca su PMI generiche (scunio/garda), non da clienti reali FlorenceEGI.
Costrutto = proxy. Va validato sul dolore-tipo reale (gap §6.2 dell'autore).

## 5. Benchmark comparativo (above-the-fold vs pagine eccellenti)

[MY_INFERENCE — non ho WebSearch/WebFetch tra i tool concessi in questa run; il
confronto è da mia conoscenza di pagine note, non da fetch live. Trattare come
giudizio esperto, non come misura verificata.]
- **Linear / Vercel / Stripe** (SaaS best-in-class): above-the-fold = una promessa
  netta + UN proof-point concreto e specifico (logo-cliente o numero verificabile)
  visibile senza scroll. La proposta FlorenceEGI **regge sul testo** (H1+sottotitolo
  sono di livello), ma **perde sul proof-point above-the-fold**: la "striscia 30 anni/
  9 piattaforme/codice pubblico" (r.79) è un trust-bar generico, non il named/specific
  che la sua stessa fonte (instapage) dichiara superiore. Le pagine top mettono UN
  fatto incontestabile sopra la piega; qui c'è un'aggregazione di affermazioni.
- **Custom-dev agencies serie** (es. thoughtbot/Basecamp-style): vincono con UN caso
  cliente nominato above-or-near-fold. Qui manca (Finding-3).
**Verdetto comparativo:** la proposta è nella fascia alta del copywriting ma NON
raggiunge il livello delle pagine di riferimento finché il proof above-the-fold
resta generico e privo di peer-proof.

## 6. Red-team del compratore (PMI scettico che atterra)

Simulo il titolare PMI non tecnico, diffidente, poco tempo. Obiezioni NON risolte:
1. **"30 anni... ma chi avete fatto felice di recente?"** — zero clienti nominati.
   Magicsoft 1995 è storia; oggi le prove sono progetti PROPRI (florenceegi, art).
   Il PMI pensa: "bravi coi loro siti, ma con me?" → **rimbalza qui** (Finding-3).
2. **"Codice pubblico / GitHub": e a me che frega?** — il PMI non tecnico non apre
   GitHub. La prova-codice è for-peers, non for-buyer. La pagina la usa come pilastro
   di fiducia verso un pubblico che non sa leggerla.
3. **"Prima versione prima di firmare... e quanto ci metto a vederla?"** — qui il
   doc HA la risposta forte nell'SSOT (3-5 giorni) ma **la nasconde** (Finding-1).
   Il PMI resta col dubbio sui tempi proprio dove poteva essere conquistato.
4. **"€2.000-60.000: io in che fascia sto?"** — la pagina rimanda a "scrivici" (r.166)
   senza UN esempio concreto ("una gestione ordini per un negozio = fascia Mini").
   Auto-qualifica incompleta → frizione.
5. **"Padmin AI risponde sui documenti reali": e se mi dice una cazzata?"** — il PMI
   diffida dell'AI prima di fidarsi dell'offerta (paura n.5, citata dall'autore). Ok
   declassarla a secondaria, ma resta un punto di sospetto non disinnescato in pagina.
6. **"Metodo Oracode / LSO / Living Software Organism": suona fumoso.** — l'anti-gergo
   è buono ma "un nuovo tipo di software che si documenta da solo" rischia comunque
   il "promette troppo" per chi non ha riferimenti. Serve un esempio terra-terra.
7. **"Il rischio lo tenete voi": davvero? cosa firmo?"** — risk-reversal forte a parole;
   manca la frase che lo rende legalmente credibile (cosa succede se mi sfilo? la
   caparra com'è custodita?). Promessa grande senza meccanismo visibile = sospetto.

## 7. Verdetto + fix prioritizzati

**VERDETTO: PASS-WITH-FIXES. Punteggio mio: 33/50 (66%), range difendibile 30-37.
NON è "ultra-eccellente". È una bozza strategica forte con due difetti gravi di
fedeltà-alla-fonte e un buco di credibilità (peer-proof) che, per uno standard
world-class, sono bloccanti.** Il 47/50 dell'autore non è difendibile: sovrastima
per self-preference su esattamente i criteri dove c'è un FAIL verificabile.

**Fix prioritizzati (per arrivare a ultra-eccellente):**
1. **[BLOCCANTE] Risolvere il conflitto VELOCITÀ doc↔SSOT** (Finding-1). Decisione
   CEO: la velocità (3-5 giorni / metà tempo) è "il prodotto" e va sopra la piega in
   forma comparativa, oppure l'SSOT va cambiato. Oggi il doc la butta via.
2. **[BLOCCANTE] Procurare/decidere il peer-proof PMI reale** (Finding-3) o, se non
   esiste, riposizionare onestamente la fiducia (NON fabbricare). Senza, non è top-tier.
3. **[BLOCCANTE] Fissare il numero ufficiale piattaforme** (8 vs 9, Finding-2) e
   allinearlo a TUTTO l'SSOT, non solo dichiararlo risolto.
4. **[ALTO] Ri-ancorare i numeri-prova al git datato PRIMA di scrivere "controlla tu"**
   (Finding-4) + correggere il claim "HTTP 200" su art (è 302→200).
5. **[ALTO] Un proof-point named/specific above-the-fold** che sostituisca il trust-bar
   generico (benchmark §5).
6. **[MEDIO] Esempio concreto di fascia-prezzo** per auto-qualifica (red-team #4).
7. **[MEDIO] Validare l'ICP sul dolore-cliente reale** (Finding-5), non su PMI generiche.
8. **[MEDIO] Rendere visibile il meccanismo del risk-reversal** (caparra in custodia,
   cosa firmo) — red-team #7.

## 8. Validità & bias della MIA misura (autocritica obbligatoria)

- **Self-preference (il rischio #1):** autore e io siamo stesso modello-famiglia.
  De-biasing applicato: giudizio binario per criterio ancorato a fatti esterni (file
  SSOT + curl), NON a preferenza; ho cercato attivamente di FALSIFICARE i 5/5
  dell'autore, non di confermarli. Il FAIL al criterio 8 nasce da una contraddizione
  documentale verificabile, non da gusto. (ancora: `sources/beyond-surface-self-preference`).
- **Costrutto parzialmente debole:** metà rubrica (CRO/positioning) è giudizio esperto
  senza A/B reale → è proxy, non misura di conversione. Dichiarato. L'unica misura
  forte è fedeltà-SSOT + verificabilità (fatti). Il numero 33/50 è quindi half-hard,
  half-expert: usarlo come ordine di grandezza, non come cifra al punto.
- **Campione = 1 artefatto, 1 giudice.** Nessun inter-rater (κ). Idealmente servirebbe
  il giudizio del CEO (domain expert, à la Hamel Step 1) come gold + un grunt-test su
  5 PMI reali (l'autore stesso lo propone §8). La mia misura è un primo metro esterno,
  non l'ultimo.
- **No WebSearch/WebFetch in questa run:** il benchmark comparativo (§5) e le fonti CRO
  esterne citate dal doc NON sono state ri-fetchate → fidate sul doc per quelle, marcate.

## 9. Fonti citate (metodo)
- `sources/hamel-llm-as-a-judge-guide.md` — binary pass/fail > scale 1-5; "looking at
  your data"; precision/recall; domain expert come gold.
- `sources/beyond-surface-self-preference-llm-judgments.txt` §abstract/intro — bias di
  auto-preferenza; usare gold judgments per isolarlo.
- `sources/measuring-what-matters-construct-validity-llm.txt` §Methods/codebook —
  face/content/ecological validity; misurare il fenomeno, non il proxy.
- `sources/attributionbench.txt` + `sources/automatic-evaluation-attribution-llm.txt` —
  claim↔fonte come verifica di faithfulness.
- `evaluation/SKILL.md` — ground-truth esterno obbligatorio; mai self-eval nel vuoto.

## UNCERTAINTY FLAGS
- [SSOT_TRUST] commercial-claims-public.md e it.json li tratto come verità di
  riferimento; non ho letto l'SSOT interno commercial-claims.md (visibility:internal),
  da cui la versione pubblica è derivata — un'eventuale clausola lì potrebbe ri-contestualizzare Finding-1/2.
- [COUNT_BY_EYE] "6 directory-organo locali" e l'enumerazione 8-vs-9 contati a mano su
  ls/grep, non da un export-ledger firmato.
- [NOT_FOUND≠NOT_EXIST] Nessuna prova-cliente PMI reale trovata nelle ancore lette;
  potrebbe esistere altrove (CRM, SSOT interno) → trattata come gap, non come inesistente.
- [MY_INFERENCE] §5 benchmark comparativo: da mia conoscenza di pagine note, NON da
  fetch live (no WebSearch/WebFetch concessi). Giudizio esperto, non misura.
- [MY_INFERENCE] Conversione PASS/PARTIAL/FAIL→voto (5/3/1) e quindi il 33/50 è una
  scala mia dichiarata, half-hard/half-expert; usare come ordine di grandezza.
- [PARTIAL_READ] Letti: artefatto intero, commercial-claims-public.md intero, it.json
  (seo_*/lso_*/estratti softwarehouse), page.tsx (header), corpus evaluation (Hamel +
  estratti self-preference/construct). NON letti verbatim: SALESPAGE_REDESIGN_BUYER_POV.md,
  componenti React, gli altri 6 file-lingua, commercial-claims.md interno.

---

# Ri-misura v2 (misura indipendente, adversarial, da zero — 2026-06-16)

> Artefatto: `SALESPAGE_FINAL_FLORENCEEGI.md` **v2** (version: 2, supersedes v1).
> Metodo identico alla misura precedente (PASS/PARTIAL/FAIL per criterio ancorato a
> fatti esterni → conversione dichiarata 5/3/1, /50). Non ho creduto al "Changelog v2"
> sulla parola: ho verificato il copy reale sezione per sezione contro l'SSOT con grep,
> e ho ri-eseguito il `curl` live. Ground-truth invariato: `commercial-claims-public.md`
> v1.1.0 + it.json + curl. Ri-letto verbatim per questa run.

## R1. Verifica dei 3 BLOCCANTI (i fatti, non il changelog)

**B1 — VELOCITÀ (era FAIL). → CHIUSO.**
Verificato nel copy reale, non nel changelog:
- Sopra la piega: H1 (r.110) "la prima versione la provi in **3-5 giorni**, prima di
  firmare"; riga-velocità (r.113) "una software house qualsiasi ti fa aspettare
  settimane... noi in **3-5 giorni**... a circa **il doppio della velocità del
  mercato**" → comparativa (mercato→noi), SSOT r.85/r.90/r.102. Striscia-prova (r.125)
  ripete "prima versione in 3-5 giorni".
- Sezione 3 dedicata (r.194-214): forma comparativa modellata VERBATIM sull'esempio
  SSOT r.96-98 ("8-10 settimane, noi 4-5"). Confronto diretto: doc r.203 = SSOT r.96-98
  → **combacia**. Anti-gergo MVP rispettato (r.211 ↔ SSOT r.93-95).
- Tabella prezzi (Sez.4, r.226-235): ha **colonna doppia "Tempo di mercato | Con noi"**
  + riga-cappello OBBLIGATORIA (r.234) che dichiara esplicitamente "i tempi nella colonna
  'di mercato'... non sono i nostri" → esattamente ciò che SSOT r.83-84 impone e che la
  v1 violava. Il difetto-radice del FAIL v1 (tempi di mercato spacciati per nostri) è
  RIBALTATO.
**I tempi sono SEMPRE comparativi? Sì.** Nessuna occorrenza di tempo nostro presentata
da sola senza il riferimento di mercato. Il "3-5 giorni" (SSOT r.90) è in evidenza
sopra la piega in 3 punti. → **PASS** sull'asse-velocità.

**B2 — "8 vs 9" (era FAIL). → CHIUSO.**
`grep -niE "[0-9]+ (piattaforme|organi)"`: ogni occorrenza con numero nel copy dice **8**
(r.27, 58, 68, 125, 139, 154, 257, 290, 302). L'UNICA menzione di "9" (r.54) è nel
changelog che *descrive il difetto v1 corretto*, non un claim di pagina. EGI-STAT
esplicitamente escluso (r.54). Il "8" è ora ancorato a SSOT r.118 (verità dichiarata),
non più gonfiato. → **PASS**.

**B3 — PEER-PROOF (era PARTIAL). → CHIUSO onestamente (no fabbricazione).**
La v2 NON inventa testimonianze (confermato gap reale: il CEO non ne ha, r.359 +
flag NOT_FOUND). Riposiziona la prova su 4 pilastri tutti SSOT (r.57-62) e la incornicia
in Sez.5 (r.252-254): *"Non ti chiediamo di fidarti di altri clienti. Ti facciamo
guardare le cose vive."* Questo è il modo CORRETTO di chiudere un gap di credibilità
quando il ground-truth (testimonianze) non esiste: trasforma l'assenza in coerenza col
risk-reversal, invece di lasciare un buco o fabbricare. **Regge per un PMI scettico?**
In larga parte sì (vedi R4 obiezioni): la leva passa da "fidati di altri" a "controlla
tu", che è difendibile. Resta un residuo (il PMI emotivamente vuole comunque vedere un
suo pari soddisfatto — leva Nielsen) ma NON è più un buco scoperto: è una scelta di
posizionamento dichiarata e onesta. → **PASS** (non più PARTIAL): l'onestà del
riposizionamento è verificabile e coerente con l'SSOT, ed è esattamente ciò che lo
standard impone quando manca il dato.

## R2. NUOVI difetti trovati in v2 (regressioni / claim non ancora ancorati)

**N1 [MEDIO-GRAVE] — Percentuali di caparra (30%/20%/10%) INVENTATE e NON marcate.**
La tabella Sez.4 (r.228-232) introduce una **colonna "Caparra" con percentuali per
fascia: 30%, 20%, 10%, 10%, 10%**. Verifica grep sull'SSOT pubblico: r.59 e r.64 dicono
SOLO "la caparra è un gesto di buona volontà (custodia, non ancora pagamento)" — **zero
importi, zero percentuali**. La tabella prezzi SSOT (r.73-79) NON ha colonna caparra.
Eppure il doc a r.239 attribuisce "Prezzi/manutenzione/**caparra** = fatti SSOT r.75-79"
— FALSA ATTRIBUZIONE: r.75-79 non contiene caparre. A differenza dei valori "con noi"
(correttamente marcati [MY_INFERENCE] in r.240, §6.2 e nei flag), le **percentuali
caparra NON sono marcate da nessuna parte** come inferenza. Su una pagina il cui claim
centrale è "non credermi, controlla", un numero contrattuale inventato e spacciato per
SSOT è il tipo esatto di difetto di fedeltà che il criterio 8 punisce. Va o ancorato a
una fonte CEO o marcato [MY_INFERENCE]/[DA VALIDARE CEO] o rimosso.

**N2 [BASSO] — "schermo condiviso" / "sessione privata" (Sez.5 r.263): impegno
operativo non nell'SSOT.** Grep SSOT: nessuna occorrenza di "schermo condiviso" né
"sessione privata" (c'è "demo privata" per il redesign, r.49, contesto diverso). È
un'inferenza operativa plausibile e benigna, ma è un *impegno di servizio* messo in
bocca all'azienda senza fonte. Andrebbe marcato o confermato CEO. Gravità bassa (non è
un numero, è una modalità).

**N3 [INVARIATO dal v1, BASSO] — claim "200 confermato" su art.florenceegi.com.**
Ri-curl live in questa run: `302 → https://art.florenceegi.com/home`, poi `200`.
La v2 ha **corretto il problema**: NON dice più "HTTP 200 confermato"; dice "lo apri
ora" (r.275, r.358) e segnala onestamente il 302→200 come da ri-verificare (flag
PARTIAL_READ r.416). Il claim di pagina "lo apri ora" regge anche col redirect (curl
seguito = 200, marketplace raggiungibile). → Finding-4 del v1 sostanzialmente **risolto**.

## R3. RI-PUNTEGGIO da zero (stessa rubrica, stessa scala dichiarata)

| # | Criterio | v1 | v2 | Evidenza (riga doc) + difetto residuo |
|---|---|---|---|---|
| 1 | Cosa offri ≤5s | 5 | **5** | Occhiello r.107 + H1 r.110: identità+categoria+beneficio senza scroll. Regge. |
| 2 | Come migliora la vita | 5 | **5** | H1 r.110 "fatto sul tuo modo di lavorare — la provi in 3-5gg prima di firmare": beneficio+velocità+risk-reversal in una riga. Più forte della v1. |
| 3 | Come compro | 5 | **5** | CTA singola "primo parere gratuito" r.119, SSOT r.145. Invariata, regge. |
| 4 | Perché fidarmi (B2B) | 3 | **4** | Riposizionamento onesto (Sez.5 r.252) + meccanismo risk-reversal visibile (Sez.2 box r.184-188) + named/specific above-fold (art.florenceegi.com r.127). NON 5: la leva peer-Nielsen (un pari soddisfatto) resta strutturalmente assente — scelta difendibile ma non equivalente, in B2B, a un caso-cliente. |
| 5 | Chiarezza / anti-gergo | 5 | **5** | Tabella anti-gergo §5 (r.336-347) ampliata (MVP, 8 organi, prova-di-nascita, 200-300% a secco). Solido. |
| 6 | Gerarchia above-fold | 5 | **5** | Ordine identità→promessa→velocità→CTA→prova viva (r.106-127). Velocità ora integrata sopra la piega senza rompere la gerarchia. |
| 7 | Gestione obiezioni in ordine | 3 | **4** | Sequenza §3 (r.145-155) ora include la Sez.3-velocità al posto giusto + box risk-reversal. NON 5: l'ICP/ordine-paure resta importato da PMI generiche, non validato sul cliente reale (gap §6.5 r.96, r.357 dichiarato). Costrutto = proxy onesto. |
| 8 | Prova: evidence + FEDELTÀ SSOT | **1** | **4** | Il FAIL v1 era per contraddizione SSOT su velocità+8/9: **entrambe risolte e verificate** (R1). NON 5 per via di **N1 (caparra 30/20/10% inventata e falsamente attribuita a SSOT r.75-79, r.239)** + N2 (schermo condiviso non-SSOT). Il salto 1→4 è il delta più grande e il più affidabile (verificato su file, non opinione). |
| 9 | CTA singola / attrito | 4 | **4** | Una primaria (r.119) + Padmin secondaria disinnescata (r.122) + mail/WhatsApp finali (r.315). Lieve rischio doppia-azione persiste. Invariato. |
| 10 | Positioning + onestà claim | 3 | **4** | Dunford "software su misura per PMI" vs status-quo (r.83) forte. Onestà claim molto migliorata: valori "con noi" marcati [MY_INFERENCE]+[DA VALIDARE CEO] (r.240, §6.2, flag). NON 5 per N1 (caparra non marcata) + numeri-prova ancora da ri-ancorare al git (§6.1 r.353) — su una pagina che vende verificabilità i numeri devono essere a prova di verifica PRIMA della pubblicazione. |

**Punteggio TOTALE v2 (mio, scala dichiarata): 45/50 (90%).**
v1 = 33/50. **Delta = +12 punti (+24 punti percentuali).**

Scomposizione del delta:
- Criterio 8: **1 → 4 (+3)** — i due conflitti-SSOT bloccanti risolti e verificati su file.
- Criterio 4: 3 → 4 (+1) — peer-proof riposizionato onestamente.
- Criterio 7: 3 → 4 (+1) — obiezioni sciolte + meccanismo visibile.
- Criterio 10: 3 → 4 (+1) — onestà-claim e marcatura [MY_INFERENCE] molto migliorate.
I criteri già a PASS (1,2,3,5,6,9) restano stabili.

**Perché NON 47-50:** quattro criteri restano a 4 (non 5) per ragioni *verificabili*, non
per severità arbitraria: (a) N1 caparra inventata non marcata; (b) numeri-prova non ancora
ri-ancorati al git; (c) peer-proof strutturalmente assente (scelta, non errore, ma in B2B
non è equivalente a un caso-cliente); (d) ICP non validato. Tre di questi sono dichiarati
onestamente dall'autore stesso come gap aperti (§6) e bloccano la pubblicazione — quindi
il documento è coerente, ma "pronto per CEO" ≠ "pubblicabile così".

**Incertezza (calibrazione):** l'asse fedeltà-SSOT/verificabilità (criteri 4,8,10) è
verificato su fatti (grep SSOT + curl) → banda stretta, alta confidenza; qui il +3 sul
criterio 8 è la parte più solida della misura. L'asse CRO/positioning (1,2,3,5,6,7,9) è
giudizio esperto senza A/B reale → ±1 voto a criterio plausibile. **Range complessivo
difendibile: 43-47/50.** In nessuno scenario scende sotto il PASS pieno.

## R4. Red-team v2 — le 7 obiezioni del PMI scettico

| # | Obiezione | v1 | v2 | Verifica nel copy |
|---|---|---|---|---|
| 1 | "30 anni, ma chi di recente?" | aperta | **sciolta (parz.)** | Sez.5/7: prova recente = prodotti vivi (8 organi, marketplace, Padmin) r.257. Onesto, ma il PMI emotivo vorrebbe comunque un pari → residuo soft, non buco. |
| 2 | "Codice pubblico, a me che frega?" | aperta | **sciolta** | Sez.5 Blocco C r.263: tradotto in beneficio for-buyer ("esiste davvero, te lo mostro io"). Buona traduzione. |
| 3 | "Quanto ci metto?" | **aperta (grave)** | **sciolta** | 3-5 giorni sopra la piega + Sez.3 dedicata comparativa. Era IL buco v1, ora è una leva. |
| 4 | "In che fascia sto?" | aperta | **sciolta** | Sez.4 riga auto-qualifica r.235 con esempi concreti (negozio→Mini ecc.). |
| 5 | "Padmin dice una cazzata?" | aperta | **sciolta** | r.122 + r.260 "risponde solo sui documenti reali, se non sa te lo dice e ti passa a una persona, non inventa" (SSOT r.139-141). |
| 6 | "Oracode/LSO fumoso" | aperta | **sciolta** | Sez.6 r.285-290 beneficio+esempi (IVA, reso) PRIMA del nome; nome in nota. |
| 7 | "Cosa firmo?" | aperta | **sciolta** | Sez.2 box "Cosa firmi davvero" r.184-188: caparra in custodia/non pagamento, prima versione comunque tua, registrazione consensata (SSOT r.59/64-66/55-56). Meccanismo VISIBILE. |

**Sciolte: 7/7 nel copy (6 piene, #1 con residuo emotivo soft).** Nessuna obiezione resta
scoperta. Caveat: l'efficacia REALE va misurata col grunt-test su 5 PMI (l'autore stesso
lo propone §8) — qui certifico che il copy *contiene la risposta*, non che converte.
**Nuova mini-obiezione introdotta dalla v2:** la colonna caparra con percentuali (N1) può
generare una domanda "perché 30% sul Micro e 10% sul resto?" senza che la pagina o l'SSOT
la giustifichino → rischio di una frizione nuova, da chiudere prima della pubblicazione.

## R5. VERDETTO v2

**Punteggio: 45/50 (90%). Delta vs v1: +12 (da 33). Verdetto: PASS-WITH-FIXES (minori).**

**È ULTRA-ECCELLENTE? — QUASI. Non ancora al 100%, ma a una distanza minima e ben
definita.** I 3 difetti BLOCCANTI sono tutti chiusi e verificati su fatti esterni (file +
curl), non sulla parola del changelog: questo era il cuore della bocciatura v1 ed è
risolto in modo solido. Il documento è ora nella fascia world-class del copywriting B2B
e, soprattutto, è ONESTO sui propri limiti (li dichiara in §6/§7 invece di nasconderli —
l'opposto del self-preference v1 che si dava 47/50).

Ciò che separa il 45 dal "ultra-eccellente pubblicabile" è una **lista CORTA, chirurgica,
quasi tutta di ANCORAGGIO numeri (non di riscrittura)**:

1. **[BLOCCANTE pubblicazione] Caparra 30/20/10% (N1):** o ancorarla a una decisione CEO
   citabile, o marcarla [MY_INFERENCE]/[DA VALIDARE CEO], o rimuovere la colonna. Oggi è
   un numero contrattuale inventato e falsamente attribuito a SSOT r.75-79 (r.239), su una
   pagina che vende "controlla tu". È l'unico difetto di fedeltà-SSOT residuo.
2. **[BLOCCANTE pubblicazione] Ri-ancorare al git datato** i numeri-prova (date Padmin,
   ampiezza portfolio) e i valori "con noi" della tabella, PRIMA di pubblicare (§6.1-6.2).
   L'autore lo dichiara già; va eseguito, non solo dichiarato.
3. **[BASSO] "schermo condiviso"/"sessione privata" (N2):** marcare come impegno operativo
   da confermare CEO o ancorare.
4. **[MEDIO, non bloccante] Validare l'ICP/dolore-tipo sul cliente reale** (§6.5) — resta
   proxy onesto, ma per il salto a 5/5 sul criterio 7 serve il dato proprietario.
5. **[OPZIONALE upside] Se un domani arriva UNA testimonianza PMI reale citabile**, inserirla
   in Sez.5: porterebbe il criterio 4 a 5/5 (è l'unico modo per chiudere il residuo emotivo
   dell'obiezione #1). Non è un fix obbligatorio (il riposizionamento è già onesto e valido).

In sintesi al CEO: **la v2 è passata da "bozza forte con difetti bloccanti" a "pronta per
approvazione CEO, a un passo dalla pubblicazione".** Il passo che manca NON è riscrivere:
è ancorare 2 set di numeri (caparra + numeri-git) e validare 1 dato (ICP). Fatto questo,
è legittimamente ultra-eccellente. Finché la caparra 30/20/10% resta un numero inventato
non marcato, NON la dichiaro pubblicabile — perché contraddirebbe la promessa stessa della
pagina ("non credermi, controlla").

## R6. Validità & bias della MIA misura (autocritica)
- **Self-preference:** autore e io stesso modello-famiglia. De-bias: ho cercato di
  FALSIFICARE i "SÌ" del changelog, non confermarli — e ho trovato N1 (caparra) che il
  changelog NON dichiara. Il +12 non è compiacenza: nasce da conflitti-SSOT verificati su
  file ora rimossi, misurati col medesimo metro spietato che diede 33 a v1.
- **Costrutto half-hard/half-expert:** identico al v1. L'asse fedeltà-SSOT è hard (grep+
  curl); l'asse CRO è expert senza A/B. Il 45/50 è ordine di grandezza alto-affidabile
  sull'asse fedeltà, expert sull'asse conversione.
- **Campione = 1 artefatto, 1 giudice, no inter-rater.** Manca ancora il gold del CEO
  (domain expert, Hamel Step 1) + grunt-test 5 PMI. La mia è la seconda misura esterna,
  non la conversione reale.
- **No WebFetch delle fonti CRO** (smart-team, conversionsciences, instapage citate dal
  doc): fidato sul doc per quelle citazioni, marcato. Il curl su art.florenceegi.com è
  invece stato ri-eseguito da me (302→200 confermato).

## R7. Fonti citate (metodo)
- `evaluation/sources/hamel-llm-as-a-judge-guide.md` — binary pass/fail > scale 1-5;
  "looking at your data"; domain expert come gold.
- `evaluation/sources/beyond-surface-self-preference-llm-judgments.txt` — bias auto-preferenza.
- `evaluation/sources/measuring-what-matters-construct-validity-llm.txt` — misurare il
  fenomeno (efficacia/fedeltà), non il proxy (eloquenza del doc).
- `evaluation/sources/attributionbench.txt` + `automatic-evaluation-attribution-llm.txt` —
  claim↔fonte: usato per scoprire N1 (caparra falsamente attribuita a SSOT r.75-79).
- Ground-truth: `commercial-claims-public.md` v1.1.0 (r.59,64,75-79,83-103,118-119,139-145)
  + `curl` live art.florenceegi.com (302→200, 2026-06-16).

## UNCERTAINTY FLAGS (ri-misura v2)
- [SSOT_TRUST] commercial-claims-public.md trattato come verità di riferimento; NON letto
  l'SSOT interno commercial-claims.md (visibility:internal) — una clausola lì potrebbe
  contenere le percentuali caparra (30/20/10%) e ribaltare N1 da "inventato" a "non-citato".
  Se quelle % esistono nell'SSOT interno, N1 declassa a difetto di CITAZIONE, non di verità,
  e il criterio 8/10 salirebbero verso 5 → punteggio fino a 47/50.
- [COUNT_BY_EYE] Enumerazione organi: molte directory EGI-* sul filesystem (incl. EGI-STAT,
  correttamente escluso dal conteggio dal doc). Il "8" è governato da SSOT r.118, non da
  conteggio mio; non ho un export-ledger firmato.
- [MY_INFERENCE] Conversione PASS/PARTIAL/FAIL→voto (5/3/1) e quindi 45/50 = scala mia
  dichiarata, half-hard/half-expert; ordine di grandezza, non cifra al punto. Range 43-47.
- [NOT_FOUND≠NOT_EXIST] Nessuna testimonianza PMI reale (confermato CEO via doc); "schermo
  condiviso"/"sessione privata" non trovati in SSOT pubblico — potrebbero stare nell'SSOT
  interno o essere prassi reale non documentata.
- [PARTIAL_READ] Letti verbatim: artefatto v2 intero, commercial-claims-public.md intero,
  verdetto v1 intero. NON ri-fetchate le fonti web CRO; NON letto commercial-claims.md interno
  né i 6 file-lingua non-IT. Curl art.florenceegi.com ri-eseguito (302→200).
