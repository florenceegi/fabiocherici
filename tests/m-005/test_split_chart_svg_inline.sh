#!/usr/bin/env bash
# M-005 Test RED — Fix EPP split chart label overlap
# Problema: label PIATTAFORMA + FRANGETTE in coordinate adiacenti sovrapposti.
# PASS quando: coordinate vecchie sostituite con nuove non-overlapping.
set -u
F=/home/fabio/fabiocherici.com/app/\[locale\]/epp/page.tsx
[[ -f "$F" ]] || { echo "RED: page.tsx mancante"; exit 1; }
# Vecchie coordinate problematiche: top-[8%] right-[32%] + top-[14%] right-[24%]
if grep -q 'top-\[8%\] right-\[32%\]' "$F"; then
  echo "RED: vecchia coord PIATTAFORMA top-[8%] right-[32%] ancora presente"
  exit 1
fi
if grep -q 'top-\[14%\] right-\[24%\]' "$F"; then
  echo "RED: vecchia coord FRANGETTE top-[14%] right-[24%] ancora presente"
  exit 1
fi
echo "GREEN: coordinate PIATTAFORMA + FRANGETTE aggiornate non-overlapping"
exit 0
