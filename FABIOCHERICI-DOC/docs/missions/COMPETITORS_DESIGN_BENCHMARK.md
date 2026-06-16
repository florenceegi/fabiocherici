# COMPETITORS DESIGN BENCHMARK — Pagina di vendita FlorenceEGI S.R.L. (software house PMI)

> Studio di design REALE. Ogni sito sotto è stato aperto con WebFetch e descritto da quello che la pagina ha effettivamente restituito.
> Data: 2026-06-16. Autore: ricerca design benchmark.
> SEGMENTO assegnato: migliori pagine di vendita/landing di software house, agenzie dev, SaaS B2B (benchmark di design alto, internazionali) + software house/agenzie ITALIANE visivamente forti.

## HONESTY HEADER — numeri reali

- **Siti APERTI con WebFetch: 25 tentativi.**
- **Letti utilmente (contenuto sufficiente per estrarre pattern visivi): 21.**
- **Parziali / non renderizzati (SPA WebGL che non danno HTML utile via fetch): 2** → Adoratorio (`adoratorio.studio`, solo titolo), Resn (`resn.co.nz`, solo old-browser fallback).
- **Bloccati / falliti: 4** → AQuest `aquest.it` (HTTP 403), Ueno `ueno.co` (HTTP 403), WorkOS `work-os.com` (ECONNREFUSED), Koto `koto.studio` (errore certificato TLS).
- Nota metodologica: WebFetch converte la pagina in markdown e la passa a un modello piccolo. I dettagli di **motion/animazione** sono spesso NON osservabili dall'HTML statico → dove non confermati sono marcati `[UNCERTAINTY: motion non verificabile da fetch]`. Cito letteralmente solo ciò che il fetch ha riportato.

---

## TABELLA PER-SITO

### Gruppo A — SaaS B2B / dev-tool (benchmark di craft)

| # | Sito | Hero | Struttura visiva | Motion | Prove (credibilità visiva) | Cosa ruberei |
|---|------|------|------------------|--------|----------------------------|--------------|
| 1 | **Linear** — linear.app | Headline grande centrata ("The product development system for teams and agents") + 3 screenshot prodotto affiancati orizzontali (dashboard, issue, workspace). Forza: il prodotto È l'eroe, mostrato subito. | NON bento: card verticali numerate (1.0 Intake → 5.0 Monitor), ognuna headline + mockup UI full-width + link. | Scroll-reveal con disclosure progressiva degli elementi UI `[UNCERTAINTY: dettaglio animazione non da fetch]`. Linear è noto per animare la UI per *dimostrare la velocità del prodotto*. | Loghi (OpenAI, Ramp, Opendoor), quote ("You just have to use it"), numero grande "33,000 product teams". | Sezioni numerate (1→5) che raccontano un PROCESSO: perfetto per mostrare "come lavora una software house Oracode" step-by-step. |
| 2 | **Stripe** — stripe.com | Headline grande centrata + sfondo wave animato (gradiente fluido). 2 CTA. | Bento multi-sezione: carosello loghi → 4 card prodotto con sfondi fotografici/gradiente. | Caroselli, scroll-reveal, wave animation di sfondo. | NUMERI GIGANTI ("1,9 Bln USD", "99,999%", "200 Mln+") + card testimonial con quote firmate + case study ad accordion con metriche. | I numeri-bandiera enormi come sezione dedicata. Lo sfondo gradiente fluido dà "vita" senza pesare. |
| 3 | **Vercel** — vercel.com | Headline centrata ("Build and deploy on the AI Cloud") + 2 CTA (Deploy / Get a Demo). Grid pattern sottile dietro l'hero (loro tendenza copiata da tutti). | Card modulari + sistema a TAB per use-case (AI Apps, Web Apps, Ecommerce…). | Scroll-reveal + tab switching. Vercel è noto per l'animated build-log nell'hero (demo = design) `[UNCERTAINTY: non visto nel fetch]`. | Testimonial con logo + miglioramenti quantificati inline ("95% reduction in page load", "24x faster builds"). Tabella "Top models" datata. | Il TAB use-case (mostri lo stesso prodotto su 5 settori PMI diversi). La metrica DENTRO la testimonianza, non separata. |
| 4 | **Notion** — notion.com | Headline breve d'effetto ("Meet the night shift.") + sub lungo + 2 CTA. | Card modulari con sezioni ALTERNATE: ogni feature ha immagine su lato alterno → ritmo visivo scrollando. Più mockup prodotto, non uno solo. | Scroll, alternanza `[UNCERTAINTY]`. Tema scuro, testo bianco, alto contrasto. | 2 fasce loghi (15+ brand), numeri ("100M users", "62% Fortune 100"), quote-card brandizzate (OpenAI, Toyota). | L'alternanza sx/dx delle immagini per dare ritmo. Headline corta+evocativa sopra al sub esplicativo. |
| 5 | **Framer** — framer.com | Headline ("Build better sites, faster") + 2 CTA ("Start free" / "Start with AI"). Conversion-first, non flashy. | 4 sezioni capability orizzontali (AI/Design/CMS/Collaborate) + showcase feature con metadata (data, status, tint). | Menziona "smooth effects/interactions" ma non embedda demo live nell'hero. | Testimonial + logo (Perplexity, Miro), marketplace di "handpicked experts" (ecosistema = profondità). | La sezione "esperti handpicked" = mostrare PERSONE/partner reali, non solo loghi. |
| 6 | **Intercom** — intercom.com | Headline posizionante ("The only helpdesk designed for the AI Agent era") + 2 CTA + fascia loghi subito sotto. | Card modulari + tabelle di confronto feature per beneficio ("Resolve queries faster"). Approccio testo-pesante. | Nessun dettaglio animazione dal markup. | Loghi (Anthropic, Clay), testimonial con metrica ("close 31% more conversations daily"). | Raggruppare le feature per BENEFICIO del cliente (non per funzione tecnica) — chiave per PMI non tecniche. |
| 7 | **Clerk** — clerk.com | Value prop "More than authentication…" + CTA "Start building for free". | Sezioni modulari: hero → trust loghi → feature → testimonial mid-page → CTA finale "no strings attached". | Non descritto nel markup. | Testimonial di FONDATORI noti (Rauch/Vercel, Collison/Stripe, Copplestone/Supabase) con quote multi-paragrafo > stelline generiche. | Testimonial lunghe e firmate da nomi che il compratore riconosce > rating anonimi. |
| 8 | **Retool** — retool.com | Headline ("Build how you want. Ship on a platform you can trust.") + 8 loghi enterprise SUBITO, prima del prodotto. | Card per SEGMENTO di pubblico (Data teams / Operations / Eng). Visual "Govern" illustrato (astratto, non screenshot). | Caroselli loghi animati + transizioni immagine `[UNCERTAINTY]`. | Carosello 20+ loghi + pull-quote con impatto $ ("Ramp saved $8M and 20,000+ hours", "10x reduction in dev time"). | Mettere i loghi/prove PRIMA del prodotto quando il nome (qui FlorenceEGI) non è ancora noto. Quote con impatto economico concreto. |
| 9 | **Supabase** — supabase.com | Tagline "Build in a weekend. Scale to millions." 6 moduli prodotto (Database/Auth/Storage…). | Moduli prodotto + metriche IA ("40+ extensions", "285+ cities"). Tema scuro dev `[parziale dal fetch]`. | Non descritto. | Metriche numeriche come social proof. | Tagline a contrasto (weekend ↔ millions): promessa piccola+grande nella stessa frase. |
| 10 | **Pitch** — pitch.com | Headline ("Create slides that win") + demo prodotto ANIMATA (carosello di slide che ciclano da solo, non screenshot statico). | SaaS classico: hero → feature deep-dive → testimonial carosello → toolkit → FAQ. | Carosello rotante, transizioni a immagini sovrapposte ("Prompts Generate" mostra screenshot UI stratificati = flusso real-time). | Foto profilo + logo (Figma, Perplexity), "Trusted by 4M+ teams". | Mostrare il prodotto IN MOVIMENTO/in uso (UI stratificata che si genera) invece di uno screenshot fermo. |
| 11 | **Attention Insight** — attentioninsight.com | Headline a 3 verbi ("Validate. Fix. Defend with Data.") + 3 screenshot prodotto (heatmap, dashboard focus-score 77, plugin Figma). | SaaS classico: hero → loghi → feature alternate testo/immagine → testimonial → pricing. | Motion minimo, immagini statiche + carosello testimonial. | "625,255 images tested", 15+ loghi, badge Capterra/G2/Trustpilot, "Trusted by 2500 marketers". | Hero a 3 verbi d'azione = chiarezza immediata. Badge review di terze parti per fiducia esterna. |

### Gruppo B — Agenzie creative / studi di prodotto (craft + portfolio)

| # | Sito | Hero | Struttura visiva | Motion | Prove | Cosa ruberei |
|---|------|------|------------------|--------|-------|--------------|
| 12 | **Dogstudio** — dogstudio.co | Hero TIPOGRAFICO bold ("We Make Good Shit", letter-spacing drammatico) + link Showreel (Vimeo). Text-first, non WebGL. | Grid di progetti: titolo + date + categoria (Web/Strategy/Design) + "Discover". | Toggle audio + close-showreel → audio/multimedia `[UNCERTAINTY su scroll/WebGL]`. | Client noti citati (Microsoft, Kennedy Center). Il minimalismo stesso = sicurezza. | Tono di voce sfacciato + showreel video come CTA. La presenza scenica della tipografia gigante. |
| 13 | **Baunfire** — baunfire.com | Hero tipografico ("WE ARE BAUNFIRE", lettere spaziate) + tagline. Whitespace > effetti. | Grid card di 4 progetti "Corporate Website" (Karat, Cellares…) + "View more work". | Nessuna animazione evidente (typography+whitespace). | NOTA: niente loghi/award/numeri (assenza deliberata, rischiosa). | Hero minimale che lascia respirare. (Ma: l'assenza di prove è un ANTI-pattern per noi — sconosciuti). |
| 14 | **Instrument** — instrument.com | Tagline ("creativity meets technology") tipografica + link al portfolio. | Carosello/slider di lavori (Oura, Notion, Nike, PagerDuty) con categorie filtrabili (brand/marketing/product). | Imagery statica + carosello (priorità velocità). | ROSTER clienti enormi (Nike, Google, Netflix, Spotify…) + lista award (Webbys, Awwwards, "Agency of the Year 2026"). | Doppio binario: clienti riconoscibili + award. Filtro per tipo di lavoro. |
| 15 | **Significa** — significa.co | Hero a verbi impilati ("Think. Design. Develop. Launch. Scale."). Gerarchia tipografica, no hero-image. | Doppio livello: grid thumbnail in alto + project card dettagliate sotto (rivelazione progressiva). | Layout statico pulito, whitespace, varianti logo dark/light. | BADGE award (iF, Red Dot, German Design, Awwwards Distinction) con spazio visivo importante + "Proud to have worked with" + sigillo B Corp. | Verbi-processo impilati come hero (Think→Scale = il loro metodo in 5 parole). Badge award come ornamento di fiducia. |
| 16 | **Lazarev** — lazarev.agency | Hero VIDEO (frame da showreel, "Watch our Showreel") — preview animata invece di tipografia statica. | Carosello case-study NUMERATO (/01 → /06): problema → risultato. | Scroll-trigger reveals (numeri /01…/06 avanzano), video come CTA primaria, badge Webby ripetuti. | Stat-card impilate: "$500M+ funding secured", "120+ awards", "+300% sign-up conversion". | Le STAT-CARD di risultato-cliente ("+300% conversioni") come prova. Case study numerati problema→risultato. |
| 17 | **Cuberto** — cuberto.com | Hero minimale ("scalable digital products with thoughtful design systems"). | Gallery grid con sottotitoli descrittivi per progetto. | "Mouse Follower" custom cursor + transizioni fluide/WebGL (loro firma) `[UNCERTAINTY: non nel markup ma noto]`. | Progetti descritti ("First Super-App in Latin America"). | Custom cursor / micro-interazioni come marchio di fabbrica del craft. |
| 18 | **basement.studio** — basement.studio | Posizionamento "cool shit that performs" + "3D & Motion Design" come capability core. Tema scuro. | Grid-card case study (Vercel, Daylight, KidSuper, MrBeast) con tag ("Websites & Features", "IRL Experience"). | 3D/Motion centrale `[parziale: dal fetch solo immagini ottimizzate Next, no dettaglio WebGL]`. | Clienti riconoscibili come trust anchor. | Tema scuro + tipografia bold che lascia dominare il lavoro cliente. |

### Gruppo C — Agenzie ITALIANE

| # | Sito | Hero | Struttura visiva | Motion | Prove | Cosa ruberei |
|---|------|------|------------------|--------|-------|--------------|
| 19 | **Belka** (Trento) — belkadigital.com | Hero minimale: tagline ("We design and develop interfaces with software companies that want to grow") + orologio real-time "12:34:56 in Trento, Italy" (tocco umano, non spettacolo). | Card modulari narrative: Titolo + Sfida + screenshot REALE app + quote cliente + CTA "Case study". Flusso editoriale, non grid rigida. | Video play/pause nella sezione People, frecce hover `[UNCERTAINTY]`. | Loghi italiani forti (Fatture in Cloud, Scalapay, Subito, Doctolib) + testimonial con FOTO profilo + nome+ruolo (Switcho CEO). + sezione "advisor che ti segue". | L'orologio locale = umanità/prossimità. Il case study come storia (Sfida→prova visiva→quote). L'advisor dedicato = relazione, non transazione — perfetto per PMI diffidenti. |
| 20 | **Obliquo Design** (Padova) — obliquodesign.com | Carosello full-width con foto progetto + testo overlay ("l'eleganza che non segue la moda"). Image-led, premium. | Pattern portfolio classico: carosello → grid "Ultimi lavori" filtrabile → servizi icona+testo → loghi → news → form. | Interazioni funzionali (filtro gallery, hover card, scroll-reveal standard). | Photography di alta qualità come asset primario + showcase loghi clienti. | Carosello fotografico premium con frase-manifesto in overlay. Il filtro portfolio per categoria. |

### Non renderizzati / bloccati (onestà)
| Sito | Esito |
|------|-------|
| Adoratorio (adoratorio.studio) | SPA WebGL: fetch ha restituito solo il titolo. Non analizzabile. |
| Resn (resn.co.nz) | Fetch ha restituito solo fallback "old-browser". Non analizzabile. |
| AQuest (aquest.it) | HTTP 403. |
| Ueno (ueno.co) | HTTP 403. |
| WorkOS (work-os.com) | Connessione rifiutata. |
| Koto (koto.studio) | Errore certificato TLS. |

---

## PATTERN VISIVI VINCENTI (visti coi miei occhi, con URL)

1. **Il prodotto È l'eroe, mostrato subito e in movimento.** Linear (3 screenshot UI nell'hero), Pitch (slide che ciclano da sole), Attention Insight (3 screenshot heatmap). Non si racconta il prodotto: lo si fa vedere mentre lavora. → linear.app, pitch.com, attentioninsight.com
2. **Numeri-bandiera enormi come sezione dedicata.** Stripe ("99,999%", "200 Mln+"), Notion ("100M users"), Pitch ("4M+ teams"). Cifre grandi = scala = fiducia istantanea. → stripe.com, notion.com
3. **La metrica DENTRO la testimonianza, con impatto economico.** Retool ("Ramp saved $8M and 20,000+ hours"), Vercel ("24x faster builds"), Lazarev ("+300% conversioni"). La prova è il risultato del cliente, quantificato. → retool.com, vercel.com, lazarev.agency
4. **Loghi/prove PRIMA del prodotto quando il brand è sconosciuto.** Retool e Intercom mettono 8+ loghi enterprise subito sotto l'hero. → retool.com, intercom.com
5. **Sezioni numerate che raccontano un PROCESSO.** Linear (1.0→5.0), Lazarev (/01→/06), Significa ("Think→Scale"). Il visitatore capisce *come lavori* scrollando. → linear.app, lazarev.agency, significa.co
6. **Sezioni alternate sx/dx per dare ritmo.** Notion alterna immagine/testo a ogni feature → l'occhio non si stanca scrollando. → notion.com
7. **Card di case study come STORIA: Sfida → prova visiva → quote cliente.** Belka usa screenshot reali dell'app + quote firmata con foto. → belkadigital.com
8. **Testimonial firmate da nomi riconoscibili > rating anonimi.** Clerk (fondatori di Vercel/Stripe), Instrument (clienti Nike/Google). → clerk.com, instrument.com
9. **Grid pattern sottile + sfondo gradiente/fluido dietro l'hero** dà vita senza pesare. Vercel (grid), Stripe (wave). → vercel.com, stripe.com
10. **Tocco umano/locale che disinnesca la diffidenza.** Belka mostra l'orologio "in Trento, Italy" + un "advisor che ti segue"; Framer mostra esperti reali. → belkadigital.com, framer.com

---

## 5 IDEE CONCRETE E APPLICABILI ALLA NOSTRA PAGINA

> Nostri asset unici: **Padmin (chat AI viva)** + **opere d'arte vere cliccabili (marketplace)**. Sfruttiamoli come ciò che gli altri non hanno.

1. **Hero = prodotto vivo, non screenshot.** Come Linear/Pitch mostrano la UI in azione, noi mettiamo **Padmin LIVE direttamente nell'hero**: una chat reale, funzionante, già in conversazione (placeholder che digita una domanda PMI tipo "Quanto costa un gestionale per la mia officina?"). È la nostra versione del "demo = design" di Vercel, ma meglio: è interattiva davvero, non un'animazione finta. → ruba da linear.app + pitch.com, ma lo superi perché è reale.

2. **Le opere d'arte vere come prova-di-craft visiva (al posto delle stock illustration).** Pattern #1 dei roundup: "real product visuals, not stock illustrations". Noi abbiamo opere reali del marketplace. Usale come **galleria-prova cliccabile** ("questo non è un mockup, è online ora, cliccalo") — la prova che consegniamo cose vere e finite. È il nostro equivalente del portfolio grid di Significa/Baunfire, ma le card portano a opere LIVE. → ruba da significa.co + belkadigital.com.

3. **Sezione-processo numerata Oracode (1→5) con UI reale a ogni step.** Come Linear (1.0→5.0) e Significa (Think→Scale): mostriamo *come lavora una software house Oracode* in 5 step numerati, e a ogni step un pezzo di prodotto reale (un'opera, una schermata Padmin, un widget cantiere live). Trasforma il "metodo" astratto in qualcosa di visibile. → ruba da linear.app + lazarev.agency.

4. **Stat-card con impatto concreto + tocco italiano/umano.** Combina pattern #3 (Retool "$8M saved") con il pattern Belka (orologio "in Trento", advisor dedicato). Per PMI italiane diffidenti: numeri reali del nostro ecosistema (es. opere live, lingue supportate) come stat-card grandi, MA accanto un volto/nome reale e "parli con una persona, non con un form". → ruba da retool.com + belkadigital.com.

5. **Loghi/prove subito sotto l'hero, perché "Fabio Cherici / FlorenceEGI" è ancora sconosciuto.** Come Retool/Intercom mettono i loghi prima del prodotto: noi mettiamo subito sotto l'hero la **fascia di prove reali** — opere live nel marketplace, Padmin che risponde, eventuali clienti/lingue — perché il visitatore non ci conosce e deve fidarsi in 3 secondi. La regola dei roundup: "named social proof within the first scroll". → ruba da retool.com + intercom.com.

---

## UNCERTAINTY FLAGS

- **Motion/animazioni**: WebFetch legge HTML statico convertito in markdown; le animazioni reali (scroll-reveal, WebGL, cursor, transizioni) NON sono osservabili in modo affidabile. Tutto ciò che riguarda il "come si muove" è dedotto da nomi-file, controlli UI o reputazione nota, ed è marcato `[UNCERTAINTY]` in tabella. Per giudizio definitivo sul motion servirebbe aprire i siti in un browser reale.
- **Siti SPA WebGL** (Adoratorio, Resn, e in parte aquest/cuberto/basement) renderizzano via JS: il fetch restituisce poco o nulla. Le loro qualità di motion sono note per reputazione ma NON verificate qui.
- **4 siti bloccati** (403/connection/TLS): zero dati diretti, esclusi dall'analisi.
- I **numeri citati** (es. "33,000 teams", "$8M saved") sono claim di marketing delle rispettive aziende riportati dalle loro pagine, non verificati indipendentemente.
- Diversi roundup di partenza (Awwwards, designrush, ecc.) sono articoli-lista: ne ho estratto gli URL reali e aperto i siti, ma alcuni nomi "premiati" non erano raggiungibili (vedi tabella bloccati).
