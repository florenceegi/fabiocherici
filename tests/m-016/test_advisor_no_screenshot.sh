#!/usr/bin/env bash
# @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
# M-016 Test RED — Rimozione screenshot demo dall'AdvisorSlot /softwarehouse
# PASS quando:
#   1. AdvisorSlot.tsx NON usa next/image né referenzia chat_ai.png (screenshot rimosso)
#   2. La CTA "provala in chiamata" resta (sezione non vuota)
#   3. page.tsx non passa più demoAlt all'AdvisorSlot
set -u
ROOT=/home/fabio/fabiocherici.com
SLOT="$ROOT/components/softwarehouse/AdvisorSlot.tsx"
PAGE="$ROOT/app/[locale]/softwarehouse/page.tsx"
fail() { echo "RED: $1"; exit 1; }

[[ -f "$SLOT" ]] || fail "AdvisorSlot.tsx mancante"
grep -q "chat_ai.png" "$SLOT" && fail "AdvisorSlot referenzia ancora chat_ai.png (screenshot non rimosso)"
grep -qE "from 'next/image'|from \"next/image\"" "$SLOT" && fail "AdvisorSlot importa ancora next/image (screenshot non rimosso)"
grep -q "<Image" "$SLOT" && fail "AdvisorSlot rende ancora <Image> (screenshot non rimosso)"
grep -q "ctaLabel" "$SLOT" || fail "CTA rimossa: la sezione resterebbe vuota"
grep -q "demoAlt" "$PAGE" && fail "page.tsx passa ancora demoAlt (prop screenshot non rimossa)"

echo "GREEN: screenshot demo rimosso da AdvisorSlot, CTA preservata"
exit 0
