# M-019 — Report Tecnico: hotfix visione immagini operatore

**Mission:** M-019 | **Data:** 2026-06-16 | **Trigger:** 1 | **Status:** deployato live (box) + verificato

## Bug
Padmin negava una capacità reale: a "analizza i file che ti ho inviato" rispondeva "Non ho la
capacità di analizzare i file". Inoltre a un'immagine allegata col testo "ora ti descrivo l'azienda"
poteva ignorare l'immagine. Causa (da log sessione reale): (1) il prompt non dichiarava la capacità
di visione → default disclaimer "sono un'AI testuale"; (2) le immagini NON sono ri-inviate tra i turni
(il widget allega solo l'immagine del messaggio corrente; la history è testo) → ai turni successivi
nessuna immagine in contesto.

## Fix
`nexus-operator/app/prompt.py` — nuova sezione "# IMAGES — YOU CAN SEE THEM, AND YOU USE THEM":
- dichiara la capacità di vedere/leggere le immagini e di USARLE nella discovery;
- quando un'immagine è allegata, la analizza e ne estrae i dati (anche se il testo dice altro);
- MAI negare la capacità;
- se l'utente cita un file non allegato nel messaggio corrente, chiede di riallegarlo ("rimandamelo
  qui") o usa quanto già annotato — niente disclaimer falso.
Deploy: scp prompt.py → box → restart supervisor (server-side, no rebuild sito).

## Verifica
- test mission `test_vision_behavior.sh`: GREEN
- e2e pubblico HTTPS: scenario "file citati non allegati" → "Purtroppo non vedo questi file nei tuoi
  messaggi, se puoi ridammi entrambi... li guardo subito" (chiede riallego, non nega)
- immagine allegata → letta e usata (già verificato M-017)

## Nota / coda
- Persistenza multi-immagine tra turni NON implementata (le immagini non si ri-inviano): per ora
  l'utente riallega l'immagine col messaggio in cui la vuole analizzata. Possibile enhancement futuro
  (re-send ultima immagine o estrazione testuale persistente) — valutare costo/latency.
