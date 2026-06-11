# M-015 — Report Esteso: La pagina che vende il metodo, non la biografia

**Mission:** M-015 | **Data:** 2026-06-11 | **Commit:** _(compilato al commit)_

## Perché

La vecchia /softwarehouse raccontava una storia difensiva: pain table contro i
competitor, recensioni Trustpilot negative di terzi, hero biografico ("dal 1995"),
una formula con termini proprietari e un portfolio misurato in righe di codice.
Il brainstorm CEO del 2026-06-11 (M-014) ha ribaltato l'impianto: il negativo si
attacca alla categoria, le LOC seminano il dubbio AI, la biografia non vende.

La nuova pagina vende DUE atti:
1. **Risk-reversal** — "Vedi il tuo software funzionare. Poi decidi." Il cliente
   vede un MVP funzionante prima di firmare. Prezzi pubblici. Il rischio lo tiene
   il fornitore.
2. **Oracode Nexus → LSO** — non si vende il sistema, si vende ciò che genera:
   un tipo di software nuovo, il Living Software Organism. Si documenta da solo,
   puoi parlargli, sente quando qualcosa non torna. Chiusura: "Risultato: non
   dipendi da nessuno. Nemmeno da me."

## Cosa vede chi visita

8 sezioni con ritmo alternato (denso/respiro, ispirazione Trend Micro business):
hero con claim + 3D ambient → **cantiere aperto con numeri LIVE** (ore protagoniste,
mai LOC-first, "non credermi: guarda i commit") → 3 card offerta (su misura /
esemplare unico col Sigillo / "il tuo sito, già rifatto" SENZA prezzi pubblicati)
→ processo 5 fasi (testo M-008 invariato, il migliore) → la specie nuova LSO con
3 proprietà che "respirano" (CSS-only) e demo della mente interrogabile → demo
toccabile IdealOro → prezzi (fasce INVARIATE) → CTA calda "prima chiamata: esci
con un parere onesto". Testo totale: un quarto del precedente.

## Cosa NON c'è (per decisione, non per dimenticanza)

- Nessun placeholder nel cantiere: i numeri arrivano SOLO dall'endpoint live;
  senza JS la sezione degrada con dignità (testo + GitHub), mai numeri finti.
- Nessuna percentuale per il redesign a scala (il 70-80% è parametro interno).
- Nessuna ora di lavoro vicino ai prezzi, nessuna formula, nessun Trustpilot,
  nessuna biografia, nessun Capasso (arriva al deploy su pinocapasso.com).
- Nessuna chat advisor funzionante in v1: lo slot è predisposto (env + rebuild),
  la mission EGI parallela la innesterà. Intanto: "la provi in chiamata".

## Le 7 lingue

58 chiavi nuove tradotte in it/en/de/es/fr/pt/zh dal primo commit. "Living
Software Organism" resta in inglese ovunque (nome proprio) con glossa nella
lingua del lettore. "Domande in italiano" (trait 2) tradotto letteralmente:
localizzare la capacità sarebbe inventare un claim.

## Gate passati

Test mission GREEN · web-quality-gate 277/277 · QA acceptance 17/17 · audit OS3
0 critici. Resta il gate umano: giudizio CEO dal vivo (CR-1/CR-8), incluso il
veto possibile sulla metafora "fascicolo del fabbricato" (SSOT §5.1).

## Coda generata (fuori M-015)

- M-EGI advisor endpoint (chat su RAG con proiezione PUBBLICA dell'SSOT — mai §2/§4/§6)
- Mission sitewide micro-debiti: chiave `common.opens_new_tab` + serializzatore JSON-LD
- Cron `push-stats.sh` per refresh cantiere automatico
- Badge "demo — disponibile per la tua attività" + noindex su IDEALORO-PREVIEW
- Localizzazione `meta.epp_title` (anomalia OG ×7 spiegata: titolo identico in 7 lingue)
