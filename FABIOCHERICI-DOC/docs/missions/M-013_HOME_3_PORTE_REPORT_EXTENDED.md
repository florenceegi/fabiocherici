# M-013 — Report Esteso: Home provvisoria 3 porte (Softwarehouse + Florence EGI + EPP)

**Mission:** M-013 | **Data:** 2026-06-11 | **Commit:** `0c0c3cc`

## Perché

Il CEO ha urgenza di mettere online una home orientata alla **monetizzazione**: le tre
offerte vendibili oggi sono la Software house, Florence EGI ed EPP. La porta Oracode
va ritirata temporaneamente dal visibile perché il contenuto è superato — il paradigma
è evoluto a **Oracode Nexus** e la pagina richiede una revisione pesante prima di
tornare in vetrina. Stessa sorte provvisoria per Scrittore e AI-Nous.

Vincolo esplicito del CEO: **non perdere nulla del lato invisibile** — il blocco SEO
sr-only, i metadata, gli hreflang e lo schema JSON-LD che alimentano crawler e motori
restano identici. Le pagine non più linkate dal cerchio (oracode, scrittore, ai-nous,
i-numeri, ecosistema, contatti) restano pubblicate e raggiungibili dai 9 link del
blocco invisibile.

## Cosa è cambiato per chi visita

Il cerchio della home mostra ora **3 porte a triangolo** (0°/120°/240°): Softwarehouse,
Florence EGI, EPP. Il "TU" al centro e la quote restano. L'animazione d'ingresso
CSS-only è invariata — con 3 orbite invece di 6 il DOM è più leggero.

## Cosa NON è cambiato

- Tutto il lato SEO/crawler (sr-only, metadata, hreflang, og:image, JSON-LD)
- Le 7 lingue (it, en, de, es, fr, pt, zh) — nessuna stringa nuova, tutte le label
  esistevano già da M-008/M-012 (waiver SSOT registrato)
- Le pagine ritirate dal visibile: restano online ai loro URL

## Fix collaterali emersi

1. **Hover descrizione Softwarehouse rotto da M-008**: il selettore CSS puntava ancora
   a `creazioni` (vecchio nome porta). La descrizione su hover non appariva. Fixato.
2. **`nav_label` incoerente**: lo screen reader annunciava "Sei porte" su una nav con
   3 link. Sostituito con label neutra "Le porte del sito" (7 lingue) — resiste anche
   al futuro ritorno di Oracode senza nuovo churn.
3. **`web_root` nel descrittore Oracode**: il gate web-quality ora si auto-attiva.

## Esito

Deploy automatico S3+CloudFront via GitHub Actions: **success**. Verifica live:
3 porte, blocco SEO intatto, security headers attivi su tutte le locale testate.
Audit OS3: **PASS** senza finding bloccanti.

## Prossimi passi (fuori mission)

- Rework contenuti Oracode → **Oracode Nexus**, poi rientro della porta in home
- Giudizio estetico CEO dal vivo sul triangolo (desktop + mobile)
- Disposizione OG `epp.png` modificate nel worktree (commit dedicato)
