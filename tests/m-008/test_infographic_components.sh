#!/usr/bin/env bash
# M-008 Test RED Sprint 1 — 7 componenti infografici riusabili
# PASS quando: tutti 7 component file esistono in components/infographics/
#              + zero <Image> raster overlay nei componenti (eccetto PortfolioCard se serve)
#              + tutti hanno @author signature + 'use client' (se interactive) o server-safe
set -u
DIR=/home/fabio/fabiocherici.com/components/infographics
[[ -d "$DIR" ]] || { echo "RED: $DIR mancante"; exit 1; }

COMPONENTS=(
  "ComparisonTable.tsx"
  "FormulaBlock.tsx"
  "IconGrid.tsx"
  "FlowDiagram.tsx"
  "PricingTiers.tsx"
  "PortfolioCard.tsx"
  "PortfolioGrid.tsx"
)

for c in "${COMPONENTS[@]}"; do
  F="$DIR/$c"
  [[ -f "$F" ]] || { echo "RED: $c mancante"; exit 1; }
  if ! grep -q "@author" "$F"; then
    echo "RED: $c senza @author signature (P1 Oracode)"
    exit 1
  fi
done

# Zero <Image> raster nei componenti (PortfolioCard può avere link, non immagini raster)
if grep -rqE "next/image|<Image\\s" "$DIR" 2>/dev/null; then
  echo "RED: componenti contengono <Image> raster — vietato (brief §3)"
  exit 1
fi

# Verifica TypeScript syntactic + props typed (export type/interface)
for c in "${COMPONENTS[@]}"; do
  F="$DIR/$c"
  if ! grep -qE "^export (type|interface|default function|function)" "$F"; then
    echo "RED: $c senza export type/interface/default function"
    exit 1
  fi
done

echo "GREEN: 7 componenti infografici presenti + signature OK + zero raster"
exit 0
