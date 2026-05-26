#!/usr/bin/env bash
# M-006 Test RED — EPP immagini localizzate per lingua
# PASS quando:
#   1. page.tsx NON contiene più riferimenti a epp-{split,flow,comparison,guarantee,cycle,dashboard}.png
#   2. page.tsx contiene 6 referenze a path dinamico ${locale}/0N.png
#   3. nessun residuo overlay HTML span percentuali (split label)
set -u
F=/home/fabio/fabiocherici.com/app/\[locale\]/epp/page.tsx
[[ -f "$F" ]] || { echo "RED: page.tsx mancante"; exit 1; }
for OLD in epp-split.png epp-flow.png epp-comparison.png epp-guarantee.png epp-cycle.png epp-dashboard.png; do
  if grep -q "$OLD" "$F"; then
    echo "RED: $OLD ancora referenziato"
    exit 1
  fi
done
# Verifica 6 immagini localizzate (01.png-06.png con interpolazione locale)
COUNT=$(grep -cE '/images/epp/\$\{locale\}/0[1-6]\.png' "$F")
if [[ "$COUNT" -ne 6 ]]; then
  echo "RED: trovati $COUNT src localizzati, attesi 6"
  exit 1
fi
# Verifica rimozione overlay HTML split (split_creator_pct, split_epp_pct ecc.)
if grep -qE "split_creator_pct|split_epp_pct|split_platform_pct|split_frangette_pct" "$F"; then
  echo "RED: overlay HTML donut percentuali ancora presenti"
  exit 1
fi
echo "GREEN: 6 immagini localizzate + overlay HTML rimosso"
exit 0
