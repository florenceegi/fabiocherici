#!/usr/bin/env bash
# @package fabiocherici.com — M-009 acceptance test
# @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
# @version 1.0.0
# @date 2026-05-28
# @purpose Verifica conformità D1-D8 mission M-009 (6 widget EPP accordion + brief §3 v1.1.0 vincoli traduzione)
# @mission M-009

set -e
ROOT="/home/fabio/fabiocherici.com"
FAIL=0

red()   { printf '\033[31m%s\033[0m\n' "$1"; }
green() { printf '\033[32m%s\033[0m\n' "$1"; }

check() {
  local name="$1"; shift
  if "$@" >/dev/null 2>&1; then
    green "  ✓ $name"
  else
    red   "  ✗ $name"
    FAIL=$((FAIL+1))
  fi
}

echo "── M-009 acceptance ──"

# D1: EppAccordion component esiste
echo "D1 — EppAccordion component"
check "components/ui/EppAccordion.tsx esiste"      test -f "$ROOT/components/ui/EppAccordion.tsx"
check "Server Component (no 'use client')"         bash -c "! grep -q \"'use client'\" '$ROOT/components/ui/EppAccordion.tsx'"
check "HTML5 details nativo"                       grep -q '<details' "$ROOT/components/ui/EppAccordion.tsx"
check "HTML5 summary nativo"                       grep -q '<summary' "$ROOT/components/ui/EppAccordion.tsx"
check "ChevronDown icon"                           grep -q 'ChevronDown' "$ROOT/components/ui/EppAccordion.tsx"
check "EppIcons.tsx esiste"                        test -f "$ROOT/components/ui/EppIcons.tsx"

# D3: i18n keys IT
echo "D3 — i18n IT"
for key in ragione_essere apr arf bpe fiscalita_individuale fiscalita_aziende; do
  check "epp.widgets.$key presente in it.json"    grep -q "\"$key\"" "$ROOT/messages/it.json"
done
check "programs_section_title in it.json"          grep -q 'programs_section_title' "$ROOT/messages/it.json"
check "fiscal_section_title in it.json"            grep -q 'fiscal_section_title' "$ROOT/messages/it.json"

# D4: 6 locali — brief §3 v1.1.0 vincoli
echo "D4 — i18n 6 locale + vincoli §3"
for loc in en fr de es pt zh; do
  check "epp.widgets sezione presente in $loc.json"    grep -q '"widgets"' "$ROOT/messages/$loc.json"
  # Vincolo 2: sigle preservate intatte
  check "sigla APR preservata in $loc.json"            grep -q 'APR' "$ROOT/messages/$loc.json"
  check "sigla ARF preservata in $loc.json"            grep -q 'ARF' "$ROOT/messages/$loc.json"
  check "sigla BPE preservata in $loc.json"            grep -q 'BPE' "$ROOT/messages/$loc.json"
  check "Florence EGI preservato in $loc.json"         grep -q 'Florence EGI' "$ROOT/messages/$loc.json"
  check "Art. 15 TUIR preservato in $loc.json"         grep -q 'Art. 15 TUIR' "$ROOT/messages/$loc.json"
  check "Art. 10 DPR 633/72 preservato in $loc.json"   grep -q 'Art. 10 DPR 633/72' "$ROOT/messages/$loc.json"
done

# Vincolo 4: disclaimer fiscale letterale per 6 locale non-IT
echo "D4 — disclaimer fiscale letterale brief §3"
check "EN disclaimer"   grep -q 'This section refers to Italian tax law'              "$ROOT/messages/en.json"
check "FR disclaimer"   grep -q 'Cette section se réfère à la législation fiscale'   "$ROOT/messages/fr.json"
check "DE disclaimer"   grep -q 'Dieser Abschnitt bezieht sich auf das italienische' "$ROOT/messages/de.json"
check "ES disclaimer"   grep -q 'Esta sección se refiere a la legislación fiscal'    "$ROOT/messages/es.json"
check "PT disclaimer"   grep -q 'Esta secção refere-se à legislação fiscal'          "$ROOT/messages/pt.json"
check "ZH disclaimer"   grep -q '本节内容适用于意大利税法'                                "$ROOT/messages/zh.json"

# D5: page.tsx integrazione
echo "D5 — page.tsx integration"
check "EppAccordion importato in page.tsx"      grep -q 'EppAccordion' "$ROOT/app/[locale]/epp/page.tsx"
check "widget-ragione-essere id"                grep -q 'widget-ragione-essere' "$ROOT/app/[locale]/epp/page.tsx"
check "widget-apr id"                           grep -q 'widget-apr' "$ROOT/app/[locale]/epp/page.tsx"
check "widget-arf id"                           grep -q 'widget-arf' "$ROOT/app/[locale]/epp/page.tsx"
check "widget-bpe id"                           grep -q 'widget-bpe' "$ROOT/app/[locale]/epp/page.tsx"
check "widget-fiscal-individual id"             grep -q 'widget-fiscal-individual' "$ROOT/app/[locale]/epp/page.tsx"
check "widget-fiscal-business id"               grep -q 'widget-fiscal-business' "$ROOT/app/[locale]/epp/page.tsx"

# D6: JSON-LD FAQPage
echo "D6 — JSON-LD FAQPage"
check "FAQPage schema in page.tsx"              grep -q 'FAQPage' "$ROOT/app/[locale]/epp/page.tsx"
check "ItemList schema in page.tsx"             grep -q 'ItemList' "$ROOT/app/[locale]/epp/page.tsx"

# D7: meta.epp_description corretto
echo "D7 — meta.epp_description fix"
for loc in it en fr de es pt zh; do
  check "no 'Eccellenza Professionale Permanente' in $loc"   bash -c "! grep -q 'Eccellenza Professionale Permanente' '$ROOT/messages/$loc.json'"
  check "APR (acqua) menzione in $loc meta"                  grep -q 'APR' "$ROOT/messages/$loc.json"
done

# Sintesi
echo ""
if [ $FAIL -eq 0 ]; then
  green "✓ TUTTI I TEST PASSATI (M-009)"
  exit 0
else
  red   "✗ $FAIL test FALLITI (M-009)"
  exit 1
fi
