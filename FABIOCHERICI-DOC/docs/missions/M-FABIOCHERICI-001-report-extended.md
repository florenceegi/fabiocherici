# M-FABIOCHERICI-001 — Report Esteso

> Propagazione del kit AI-Act sul sito del CEO · 2026-06-20

## Contesto
Il CEO ha indicato che anche il suo sito (fabiocherici.com), che ha il chatbot "Padmin", deve avere lo stesso
banner e le stesse informative degli organi dell'ecosistema. È il primo test della **propagazione per-copia**
del canonico: se il kit è davvero portabile, copiare i 3 file in un altro repo Next deve "just work".

## La propagazione ha funzionato
- Copia md5-identica dei 3 file core (nessun adattamento richiesto) → il canonico style-self-contained (CSS
  Module) regge il salto DIMOSTRALO→fabiocherici. Conferma che la scelta "CSS Module, non Tailwind" era
  giusta: zero dipendenza dall'host.
- Wiring minimale: 3 righe in PadminChat (import locale, import banner, sostituzione disclosure).
- Unico attrito: il test di PadminChat mockava `next-intl` con solo `useTranslations` → il nuovo `useLocale()`
  era undefined e rompeva il render. Fix: completare il mock. Tipico effetto-collaterale del wiring, preso dai test.

## Scoperta: il sito aveva già una disclosure ad-hoc
PadminChat mostrava `<p>{t('disclosure')}</p>` = "Padmin è un'AI. Le risposte sono fondate sui documenti del
progetto." La sostanza Art. 50(1) c'era già, ma era testo sciolto senza link né look standard. Sostituita col
banner standard (coerenza ecosistema + link a /ai-transparency + machine-readable). Il claim distintivo
"fondate sui documenti del progetto" non è andato perso: è migrato sulla pagina /ai-transparency.

## Gap onesto: zh
fabiocherici ha 7 lingue (incl. cinese); il canonico ne ha 6. Per zh il banner mostra l'inglese (fallback
dichiarato del componente). La pagina /ai-transparency ha invece testo zh nativo. Estendere il canonico a zh
è una decisione di ecosistema (cambierebbe lo standard per tutti), non una patch locale — segnalata, non fatta.

## Friction tooling (ricorrente, da risolvere a monte)
Il gate web-quality (agente) scrive il report con `gate` = nome-del-gate e senza array `checks`; il hook di
enforcement si aspetta `gate` = verdetto + `checks` array, e crasha silenziosamente ("No stderr output")
altrimenti. Già successo in M-DIM-003. Risolto rieseguendo il gate con lo schema esatto (il verdetto lo
determina il gate, non lo forzo io — l'auto-classifier blocca giustamente la forzatura a mano del report).
**Debito di prodotto da promuovere**: allineare lo schema del report dell'agente web-quality-gate a quello
del hook, una volta per tutte.

## Stato
Banner Art. 50(1) live sulla chat Padmin del sito del CEO + pagina /ai-transparency 7 lingue. Secondo organo
del programma kit coperto. Restano EGI-SIGILLO, EGI-HUB (stessa copia), il tipo-documento legale per-organo,
e la pubblicazione R2 lato EGI.
