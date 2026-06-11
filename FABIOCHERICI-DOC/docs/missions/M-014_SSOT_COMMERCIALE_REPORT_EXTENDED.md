# M-014 — Report Esteso: la fonte unica dei claim commerciali

**Mission:** M-014 | **Data:** 2026-06-11

## Perché

La pagina /softwarehouse va riscritta per monetizzare, ma il sito ha la regola
P0-FC-6: contenuti solo da SSOT, mai inventati. La discovery ha scoperto che
gli SSOT esistenti erano solo tecnici (animation, fonts, seo, i18n): **nessuna
fonte unica per i claim commerciali**. Ogni copy sarebbe stata vibe-content.

## Cosa fissa il documento

1. **La narrativa**: risk-reversal ("vedi prima, decidi dopo") come atto 1;
   **Oracode Nexus protagonista** come atto 2 — il sistema che genera un tipo
   di software nuovo, il LSO (Living Software Organism), che è ciò che il
   cliente riceve. Niente formule. Beneficio prima del nome proprietario.
2. **Le 3 linee**: software su misura (fasce attuali invariate), siti
   seri/esemplare unico (Sigillo: hash front-end + vendita singola, nessun
   prezzo nuovo), redesign a scala (pricing 70-80% mercato — parametro interno).
3. **Cosa si può dire e cosa NO**: cantiere aperto verificabile su GitHub sì,
   LOC-first no; ore nel cantiere sì, ore accanto ai prezzi mai; processo 5
   fasi protagonista; pain-testimonial eliminate per sempre.
4. **I vincoli del CEO**: stats live dal giorno 1 (nessun placeholder), chat
   AI advisor embeddata in v1, Capasso in portfolio al deploy di pinocapasso.com.

## Decisioni CEO registrate

Tutte nel §8 del documento, con data. Le risposte del CEO al questionario
finale (prezzi invariati, 70-80%, Sigillo confermato, inglese+traduzione,
live punto, terza card, Capasso al deploy) sono la fonte normativa.

## Prossimi passi

1. **M-015**: rewrite pagina softwarehouse — engineer-frontend disegna il
   sistema scroll/animazione sul blueprint approvato, dev-frontend costruisce.
2. **M-EGI**: endpoint advisor `fabiocherici` (pattern SigilloAdvisor) + CORS.
3. **M-EGI-STAT**: endpoint pubblico stats cantiere (ore/attività live).
4. Proiezione pubblica di questo SSOT nel RAG della chat.
