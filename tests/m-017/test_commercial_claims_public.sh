#!/usr/bin/env bash
# @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
# M-017 Test RED — Proiezione pubblica dei claim per il RAG dell'operatore fabiocherici
# Fonte: HANDOFF_RAG_OPERATORE §0-ter + commercial-claims.md §3 (citabili) / §5 (linguaggio LSO)
# PASS quando il doc public:
#   1. esiste e ha frontmatter visibility:public + audience:public (lo prende export-ssot)
#   2. contiene SOLO claim citabili (§3) + linguaggio LSO (§5) + offerta/processo/prezzi pubblici
#   3. NON contiene nulla di vietato (§4) né interno (§2 pricing 70-80%, lista vietati, Capasso pre-deploy,
#      ore Le Vespe, biografia)
set -u
ROOT=/home/fabio/fabiocherici.com
DOC="$ROOT/FABIOCHERICI-DOC/docs/ssot/commercial-claims-public.md"
fail() { echo "RED: $1"; exit 1; }

[[ -f "$DOC" ]] || fail "commercial-claims-public.md mancante"

# 1. Frontmatter classificazione pubblica
grep -qE '^visibility:[[:space:]]*public' "$DOC" || fail "manca 'visibility: public' nel frontmatter"
grep -qE '^audience:[[:space:]]*public' "$DOC" || fail "manca 'audience: public' nel frontmatter"

# 2. Contenuti citabili obbligatori (§3 + §5)
need=(
  "Sigillo" "hash" "vendita singola"          # §3 sigillo, definizione esatta
  "MVP" "caparra"                              # §3 processo / risk-reversal
  "GitHub"                                     # §3 verificabilità
  "Living Software Organism"                   # nome deliverable
  "documenta da solo" "parlargli" "non torna"  # §5 le 3 proprietà LSO
  "non dipendi da nessuno. Nemmeno da me"      # §5 chiusura approvata
  "FlorenceEGI"                                # §3 primo LSO in produzione
  "2.000" "60.000"                             # fasce pubbliche (estremi)
)
for s in "${need[@]}"; do
  grep -qF "$s" "$DOC" || fail "contenuto citabile mancante: '$s'"
done

# Guida CTA per l'operatore (ogni risposta chiude verso il contatto)
grep -qiE "CTA|chiamata|contatto" "$DOC" || fail "manca la guida CTA per l'operatore"

# 3. NIENTE vietato/interno (§2 §4 + esclusioni handoff)
forbidden=(
  "70-80" "70-80%"           # §2 pricing interno redesign
  "Trustpilot"               # §4.4
  "Ultra Enterprise"         # §4.3
  "1995"                     # §4.5 biografia
  "12,5h" "12.5h"            # ore Le Vespe — solo interno, mai pubblico
  "Capasso"                  # §3: solo al deploy pinocapasso.com
)
for s in "${forbidden[@]}"; do
  grep -qF "$s" "$DOC" && fail "contenuto VIETATO/INTERNO presente nel public: '$s'"
done
# La lista dei claim vietati NON deve trapelare nel corpus dell'operatore (handoff §0-ter)
grep -qiE "claim vietat|VIETATI in pagina" "$DOC" && fail "la lista claim vietati NON deve entrare nel public"

echo "GREEN: commercial-claims-public.md valido — citabili+LSO presenti, zero vietati/interni, CTA, classificato public"
exit 0
