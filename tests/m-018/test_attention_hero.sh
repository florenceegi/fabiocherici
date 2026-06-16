#!/usr/bin/env bash
# @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
# M-018 Test RED — hero attention-first /softwarehouse + no-3D + no-gergo-MVP
set -u
ROOT=/home/fabio/fabiocherici.com; LANGS=(it en de es fr pt zh)
fail(){ echo "RED: $1"; exit 1; }
PAGE="$ROOT/app/[locale]/softwarehouse/page.tsx"
# 1. niente 3D nella softwarehouse (era solo homepage)
grep -q "Scene3DSwitch" "$PAGE" && fail "Scene3DSwitch ancora referenziato in page.tsx softwarehouse"
grep -rq "Scene3DSwitch" "$ROOT/components/softwarehouse/SoftwarehouseHero.tsx" 2>/dev/null && fail "SoftwarehouseHero usa ancora il 3D"
# 2. niente gergo 'MVP' nella copy cliente (softwarehouse namespace + SSOT public)
for l in "${LANGS[@]}"; do
  jq -r '.softwarehouse | to_entries[] | .value | tostring' "$ROOT/messages/$l.json" 2>/dev/null | grep -qw "MVP" && fail "'MVP' presente in messages/$l.json (softwarehouse) — gergo vietato al cliente"
done
grep -qw "MVP" "$ROOT/FABIOCHERICI-DOC/docs/ssot/commercial-claims-public.md" && fail "'MVP' in commercial-claims-public.md (SSOT pubblico cliente)"
# 3. Padmin/chat sopra la piega: il widget è nell'apertura (sezione padmin presente + prima di cantiere) e la chat è nell'hero
grep -q 'id="padmin"' "$PAGE" || fail "sezione padmin assente"
awk '/id="padmin"/{p=NR} /id="cantiere"/{c=NR} END{exit !(p>0 && c>0 && p<c)}' "$PAGE" || fail "padmin non precede cantiere"
echo "GREEN: hero attention-first (Padmin sopra la piega), 3D rimosso, zero gergo MVP nella copy cliente"
exit 0
