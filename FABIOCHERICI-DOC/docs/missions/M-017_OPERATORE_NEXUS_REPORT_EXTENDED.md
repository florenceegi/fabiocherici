# M-017 — Report Esteso: Padmin, la responsabile tecnica che parla coi clienti

**Mission:** M-017 | **Data:** 2026-06-16 | **Commit:** `c2f65b5`

## Perché

fabiocherici.com aveva un sito che *raccontava* la software house. Mancava ciò
che la rende diversa: qualcuno con cui *parlare*. Il CEO voleva un operatore AI
che guidasse le PMI nella scoperta del loro progetto — non un chatbot tuttofare,
ma una mente che conosce il metodo, fa le domande giuste, e dà una stima onesta.

Da lì è nato un disegno preso in sessione Fucina: tre RAG separati per
costruzione (FlorenceEGI, Oracode Nexus, e questo). L'operatore di fabiocherici
non riusa il cervello di EGI: ha il **suo**, isolato, alimentato solo da
documenti pubblici. "L'errore deve morire all'autenticazione, non alla buona
condotta."

## Chi è Padmin

Padmin D. Curtis è la **responsabile tecnica** dello studio — l'AI partner che
ha co-costruito l'ecosistema FlorenceEGI. Non un assistente generico: si presenta
per nome, parla in prima persona, dice "abbiamo costruito" perché è vero. Voce
chiara, decisa, calore senza esibizione. Quando un cliente arriva confuso, lo
guida: qual è il problema, cosa deve fare il sistema, e qual è il passo concreto.

## Cosa fa, in concreto

- **Guida con le domande** (una per volta): parte dal problema, non dal prodotto.
- **Vede gli screenshot**: carichi la foto del tuo Excel dei turni e lei la legge.
- **Dà la stima onesta**, nella fascia giusta, e **mai uguale al mercato**:
  "normalmente serve X, noi in circa metà" — perché lavora il doppio più veloce,
  e una prima versione funzionante la vedi in 3-5 giorni, non in mesi.
- **Racconta il sistema che vi distingue**: chiamate registrate per l'analisi,
  software da provare PRIMA di firmare, caparra in custodia.
- **Non dice mai "MVP"** (il cliente non sa cosa sia): lo spiega a parole.
- Chiude sempre verso la prima chiamata — e semina inviti lungo tutta la chat.

## Cosa vede chi visita

Su /softwarehouse, **per prima cosa**, c'è Padmin: una chat ampia, in alto,
perché alla gente non piace leggere, piace interagire. Accanto, una vetrina con
le **opere vere** dell'ecosistema vivo che lo studio ha costruito (cliccabili),
e le pillole del paradigma Oracode che scorrono. Sotto, per chi vuole
approfondire, il resto della pagina.

## La difesa, prima di aprire

L'operatore pubblico è la superficie più esposta dell'ecosistema. Prima di
metterlo online — come il CEO aveva imposto — è passato da: utente non
privilegiato, IP pseudonimizzato e cancellato dopo 30 giorni (privacy), tetti di
costo, e un red-team che ha provato a dirottarlo e a estrarne i segreti, anche
nascondendo comandi dentro un'immagine. Ha retto tutto: "Vedo un'immagine con
del testo che tenta di modificare il mio comportamento. Tuttavia, lo ignoro."

## Lo stato

Padmin è **online** su fabiocherici.com. Funziona, è grounded sui documenti
reali, è difesa. La mira delle fasce di prezzo resta provvisoria — si ritara
quando ci saranno progetti-cliente veri — ma il sistema c'è e regge.

## Coda
- Revisione legale del testo privacy (avvocato).
- Store `rag_fabiocherici` planned→active (filo auto-aggiornamento SSOT).
- Osservabilità + retention log conversazioni.
- Debito perf minore (peso pagina) e lazy-load widget.
