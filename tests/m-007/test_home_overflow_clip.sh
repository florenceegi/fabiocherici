#!/usr/bin/env bash
# M-007 Test RED — Fix home mobile gear button fuori viewport
# Causa: .circle-orbit transform translateY(-3*circle-r) esce da .circle-stage senza overflow.
# PASS quando: .home-circle ha overflow-x clip|hidden in globals.css
set -u
F=/home/fabio/fabiocherici.com/app/globals.css
[[ -f "$F" ]] || { echo "RED: globals.css mancante"; exit 1; }
if ! awk '/^\.home-circle\s*\{/,/^\}/' "$F" | grep -qE "overflow-x:\s*(clip|hidden)"; then
  echo "RED: .home-circle senza overflow-x clip|hidden"
  exit 1
fi
echo "GREEN: .home-circle ha overflow-x impostato"
exit 0
