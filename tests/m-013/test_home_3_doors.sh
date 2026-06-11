#!/usr/bin/env bash
# M-013 Test RED — Home provvisoria 3 porte (softwarehouse, egi, epp)
# PASS quando:
#   1. DOORS in app/[locale]/page.tsx contiene SOLO softwarehouse, egi, epp (3 porte)
#   2. Blocco sr-only SEO INTATTO: tutti i 9 link seo_section_* presenti (crawler vedono tutto il sito)
#   3. CSS hover desc copre softwarehouse (non più creazioni — rinomina M-008 mai propagata)
#   4. Chiavi i18n door_/desc_ per le 3 porte presenti in tutte le 7 lingue
set -u
ROOT=/home/fabio/fabiocherici.com
PAGE="$ROOT/app/[locale]/page.tsx"
CSS="$ROOT/app/globals.css"

[[ -f "$PAGE" ]] || { echo "RED: page.tsx mancante"; exit 1; }

# 1. DOORS = esattamente 3: softwarehouse, egi, epp
DOORS_BLOCK=$(sed -n '/const DOORS = \[/,/\] as const/p' "$PAGE")
N=$(echo "$DOORS_BLOCK" | grep -c "id: '")
[[ "$N" -eq 3 ]] || { echo "RED: DOORS ha $N porte, attese 3"; exit 1; }
for id in softwarehouse egi epp; do
  echo "$DOORS_BLOCK" | grep -q "id: '$id'" || { echo "RED: porta $id mancante in DOORS"; exit 1; }
done
for id in oracode scrittore ai-nous; do
  echo "$DOORS_BLOCK" | grep -q "id: '$id'" && { echo "RED: porta $id ancora in DOORS (deve sparire dal visibile)"; exit 1; }
done

# 2. Blocco SEO sr-only intatto — 9 sezioni
for s in softwarehouse oracode scrittore ainous egi epp numeri ecosistema contatti; do
  grep -q "seo_section_$s" "$PAGE" || { echo "RED: seo_section_$s sparito dal blocco sr-only (P0 SEO)"; exit 1; }
done
grep -q 'className="sr-only"' "$PAGE" || { echo "RED: blocco sr-only mancante"; exit 1; }

# 3. CSS hover desc per softwarehouse
grep -q 'data-door="softwarehouse"' "$CSS" || { echo "RED: CSS hover desc softwarehouse mancante (residuo creazioni)"; exit 1; }

# 4. i18n: 7 lingue con door_/desc_ per le 3 porte
for f in "$ROOT"/messages/{it,en,de,es,fr,pt,zh}.json; do
  for k in door_softwarehouse door_egi door_epp desc_softwarehouse desc_egi desc_epp; do
    python3 -c "import json,sys; d=json.load(open('$f')); sys.exit(0 if '$k' in d.get('home',{}) else 1)" \
      || { echo "RED: $k mancante in $f"; exit 1; }
  done
done

echo "GREEN: home 3 porte OK, SEO sr-only intatto, CSS hover OK, i18n 7 lingue OK"
exit 0
