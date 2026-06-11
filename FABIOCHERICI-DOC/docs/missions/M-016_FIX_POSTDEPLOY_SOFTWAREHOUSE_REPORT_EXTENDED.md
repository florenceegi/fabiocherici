# M-016 — Report Esteso: i due difetti visti dal CEO dopo il go-live

**Mission:** M-016 | **Data:** 2026-06-12

## Cosa è successo

Appena online /softwarehouse (M-015), il CEO ha visto due cose sbagliate:
i numeri del cantiere non comparivano, e al posto della chat AI c'era uno
screenshot.

**I numeri** non c'erano per un motivo invisibile da terminale: la policy di
sicurezza del sito (CSP) servita da CloudFront permette al browser di
connettersi solo a sé stesso (`connect-src 'self'`). Il widget chiama
`stat.florenceegi.com` — un altro host — e il browser blocca la chiamata. Da
`curl` i dati c'erano perché curl ignora la CSP. Il fix è una riga nella
funzione di sicurezza apex (aggiungere `stat.florenceegi.com` alle connessioni
permesse); va applicata su AWS dal CEO perché la modifica dell'infra di
produzione è bloccata all'agent.

**Lo screenshot** era una scelta di ripiego di M-015: la chat reale dipende da
un endpoint che non esiste ancora, quindi era stato messo un fermo-immagine.
Il CEO lo ha tolto: ora la sezione dice onestamente "presto potrai farle una
domanda qui — intanto la provi in chiamata", senza finzioni.

## Cosa NON è ancora fatto (la chat vera)

La chat AI reale è un lavoro a sé, che tocca l'organo EGI: serve una rotta
`fabiocherici/advisor/chat` modellata sul pattern già esistente del Sigillo
(stessa mente interrogabile, guest con limite, risposte fondate sui documenti),
ma con una regola dura: nel motore di ricerca della chat entra SOLO la parte
PUBBLICA dell'SSOT commerciale — mai i prezzi interni, i razionali, il
protocollo demo (vincolo audit M-014). Più il componente di chat nel sito e il
permesso CSP per l'host della API. È la prossima mission, fatta come si deve,
non improvvisata.
