---
title: "Playbook — Pagina web Oracode che VENDE"
doc_type: playbook
organ: fabiocherici.com
status: active
date: '2026-06-16'
origin: "Sessione riscrittura /softwarehouse (M-softwarehouse-rewrite). Capitalizzazione delle lezioni dure del CEO."
audience: "Chi costruisce/rifà una pagina pubblica di un organo LSO (sito, landing, sales page)."
---

# Pagina web Oracode che VENDE — metodo verificato

> Distillato da una sessione in cui il CEO ha bocciato ~15 iterazioni prima del
> risultato. Queste regole NON sono opinioni: sono cicatrici. Applicarle dall'inizio
> evita di rifare tutto 15 volte.

## 0. Principio guida — il "musical"
La **danza incanta e mostra il processo; le parole aggiungono significato.** Nel 2026
nessuno legge muri di testo. Una pagina che vende convince con l'**esperienza visiva
in movimento**, non con testo corretto su pagina ferma. Testo giusto + pagina morta = fallimento.

## 1. Punto di vista: il COMPRATORE, non il fornitore
- Scrivi per l'**imprenditore (PMI) non tecnico con un problema**, non per un collega.
- In 5 secondi above-the-fold deve capire: dove sono · chi siete · cosa fate per ME · perché fidarmi · cosa faccio ora.
- **Lingua del compratore.** MAI nomi-codice/gergo interno non spiegato (es. repo
  `os3-matrix`, sigle `LSO`, "cantiere"). **Beneficio prima del nome proprietario.**

## 2. DIMOSTRARE, non scrivere
- Ogni concetto si **MOSTRA**, non si afferma:
  - "23 progetti" → **23 card** di portfolio coi dati VERI (nome, ore, righe, scopo), raggruppate per categoria in lingua-cliente.
  - "processo" → **stepper** visivo (le fasi REALI dell'SSOT, non inventate).
  - "siamo veloci" → **split mercato↔noi** + numeri verificabili.
  - "software vivo" → le 3 cose che il software normale non fa (LSO) + confronto **vibe-coding ✕ / metodo ✓**.
- I numeri sono **dati**, non prosa.

## 3. Animazioni VERE (non il fade timido)
- Gli elementi **entrano, si muovono, si uniscono, scattano** allo scroll.
- Pattern usato: client component `SoftwarehouseMotion` + attributo `data-sw` sui
  contenitori → coreografia per tipo:
  `bento` (figli dai 4 lati che si incastrano), `stepper` (sequenza da sinistra),
  `split` (2 pannelli dai lati opposti), `stagger` (card che salgono in scala), `up`.
- **GSAP + ScrollTrigger via `import()` dentro useEffect** (P0-FC-1). `reduced-motion`
  → tutto fermo e visibile (P0-FC-5). Contenuto visibile senza JS (P0-FC-2).

## 4. Numeri verificabili, non autodichiarati
- **Ore-effort** (dal ledger/git), non giorni di calendario.
- **Inquadra giusto**: "23 repo in 2 anni" = LEVA (forza); "30 anni → 23 repo" = autogoal.
- Usa i **dati reali** che esistono già (bio, SSOT, clienti storici — es. Magicsoft:
  Knauf Italia, Mind, ManettiBattilloro). Non dire "non li abbiamo" se ci sono.
- Prove: "guarda le cose VIVE" (prodotti online, codice pubblico) > "fidati".
  Ciò che è proprietario → "verifica in privato" (gancio credibilità + CTA), mai
  claim "tutto pubblico" se non è vero.

## 5. Contatto SEMPRE raggiungibile
- `mailto:` da solo = **click morto** senza client mail. Mostra SEMPRE email + telefono
  **visibili e copiabili** + canali che funzionano ovunque (WhatsApp, Telegram).

## 6. Niente toppe — risolvi la radice
- Es. peso pagina sopra soglia: **scoping i18n** (passa al `NextIntlClientProvider`
  solo i namespace usati da componenti client; i namespace solo-server — SEO, pagine
  server — fuori dal bundle). NON `--no-verify` del gate.
- Rimuovi le chiavi i18n morte e i componenti non più usati.

## 7. VERIFICA col tuo occhio prima di dire "fatto"
- Sei in CLI: **cattura screenshot con Chrome headless e LEGGILI** (vedi memory
  `reference_verifica_visiva_headless_chrome`). NON fidarti dei report degli agenti
  ("è già buono"): sotto-consegnano sul visivo/animato. **Non far fare al CEO il QA.**
- Il **movimento** non si vede in uno screenshot: dichiaralo onestamente ("lo giudichi
  live"), ma la composizione/contenuto SÌ → verificali tu.

## 8. Gate + deploy (fabiocherici.com)
- Hook Claude Code `web-quality-gate-guard` blocca `git commit` se il report non è PASS.
  Genera: `python3 /home/fabio/os3-matrix/bin/web_quality_gate.py --dir out --page <p>
  --locales it,en,de,es,fr,pt,zh --messages messages --report /tmp/web-quality-gate-report.json`.
- Soglia perf **WS-1 < 200KB** per lingua. Tieni margine (scoping i18n).
- `rm -rf .next` in passi SEPARATI (il combinato viene spesso killato → cache stale → build vecchia).
- Deploy = `git push origin main` → GitHub Actions "Deploy fabiocherici.com" → S3+CloudFront.

## 9. Processo / collaborazione
- **Non chiedere al CEO ciò a cui la ricerca/il lavoro deve già rispondere.**
- Se serve expertise nuova → **crea l'agente persistente** (engineer-meta), non farlo a mano.
- Allinea sul **messaggio/concetto** prima di costruire i visivi (non indovinare).

---
Memorie collegate: `feedback_dimostra_non_scrivere`, `reference_verifica_visiva_headless_chrome`,
`project_softwarehouse_positioning`, `feedback_crea_agente_esperto`.
