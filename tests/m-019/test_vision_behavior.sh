#!/usr/bin/env bash
# @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
# M-019 — il prompt istruisce Padmin a USARE le immagini e a NON negare la capacita
set -u
P=/home/fabio/fabiocherici.com/nexus-operator/app/prompt.py
fail(){ echo "RED: $1"; exit 1; }
grep -qi "You CAN see and read images" "$P" || fail "manca istruzione 'puoi vedere le immagini'"
grep -qi "NEVER say you .cannot analyze" "$P" || fail "manca divieto di negare la capacita"
grep -qi "re-attach it in this message\|rimandamelo qui" "$P" || fail "manca 'chiedi di riallegare se non in vista'"
echo "GREEN: prompt istruisce uso immagini + mai negare + riallega"
exit 0
