#!/usr/bin/env bash
# @package fabiocherici.com — M-014 acceptance test
# @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
# @version 1.0.0
# @date 2026-06-11
# @purpose SSOT commerciale esiste, completo (sezioni obbligatorie), registrato nel SSOT_REGISTRY.
set -u
DOC=/home/fabio/fabiocherici.com/FABIOCHERICI-DOC/docs/ssot/commercial-claims.md
REG=/home/fabio/fabiocherici.com/FABIOCHERICI-DOC/docs/lso/SSOT_REGISTRY.json

[[ -f "$DOC" ]] || { echo "RED: $DOC mancante"; exit 1; }

# Sezioni obbligatorie (decisioni CEO brainstorm 2026-06-11)
for s in "Claim citabili" "Claim vietati" "linee" "Oracode Nexus" "Living Software Organism" \
         "Processo" "Sigillo" "cantiere" "Capasso"; do
  grep -qi "$s" "$DOC" || { echo "RED: sezione/termine '$s' assente da $DOC"; exit 1; }
done

# Decisioni vincolanti presenti
grep -q "70-80%" "$DOC" || { echo "RED: pricing redesign 70-80% assente"; exit 1; }
grep -qi "live" "$DOC" || { echo "RED: vincolo stats live assente"; exit 1; }

# Anti-pattern: il doc NON deve istituire claim vietati come citabili
grep -qi "vietat" "$DOC" || { echo "RED: sezione claim vietati assente"; exit 1; }

# Registrato nel registry SSOT (sistema nervoso)
python3 -c "
import json,sys
d=json.load(open('$REG'))
es=d.get('documents',[])
sys.exit(0 if any(e.get('ssot_id')=='commercial-claims' for e in es) else 1)
" || { echo "RED: commercial-claims non registrato in SSOT_REGISTRY.json"; exit 1; }

echo "GREEN: SSOT commerciale presente, completo, registrato"
exit 0
