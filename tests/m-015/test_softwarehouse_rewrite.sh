#!/usr/bin/env bash
# @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
# M-015 Test RED — Rewrite /softwarehouse (risk-reversal + Oracode Nexus→LSO)
# Fonte: FABIOCHERICI-DOC/docs/missions/M-015_DESIGN_SOFTWAREHOUSE.md §G
# PASS quando:
#   1. page.tsx: sezioni vietate morte (pain/evidence/formula/portfolio LOC/hero bio)
#   2. Componenti nuovi presenti: SoftwarehouseHero, LiveSiteStats, LsoTraits, AdvisorSlot, SectionCta
#   3. Riuso: FlowDiagram + PricingTiers ancora in pagina; FormulaBlock ASSENTE
#   4. i18n 7 lingue: chiavi nuove presenti, chiavi morte assenti, process_*/pricing_* sopravvissute
#   5. Claim compliance: vietati SSOT §4 assenti; lso_closing it VERBATIM; LSO name non tradotto
#   6. P0-FC-1: nessun import gsap top-level nei componenti softwarehouse
#   7. Widget live: endpoint corretto, nessun placeholder numerico hardcoded
set -u
ROOT=/home/fabio/fabiocherici.com
PAGE="$ROOT/app/[locale]/softwarehouse/page.tsx"
COMP="$ROOT/components/softwarehouse"
LANGS=(it en de es fr pt zh)

fail() { echo "RED: $1"; exit 1; }

[[ -f "$PAGE" ]] || fail "page.tsx mancante"

# ── 1. Sezioni vietate morte in page.tsx ──────────────────────────────
for pat in "pain_" "evidence_" "how_formula" "portfolio_infra" "portfolio_market" "receive_lever"; do
  grep -q "$pat" "$PAGE" && fail "page.tsx contiene ancora '$pat' (sezione eliminata HANDOFF §2)"
done
grep -q "FormulaBlock" "$PAGE" && fail "FormulaBlock ancora in pagina (vietato SSOT §4.6)"
grep -q "EvidenceBox" "$PAGE" && fail "EvidenceBox ancora in pagina (vietato SSOT §4.4)"

# ── 2. Componenti nuovi ───────────────────────────────────────────────
for c in SoftwarehouseHero LiveSiteStats LsoTraits AdvisorSlot SectionCta; do
  [[ -f "$COMP/$c.tsx" ]] || fail "componente $c.tsx mancante in components/softwarehouse/"
  grep -q "$c" "$PAGE" || fail "$c non usato in page.tsx"
done

# ── 3. Riuso M-008 ────────────────────────────────────────────────────
grep -q "FlowDiagram" "$PAGE" || fail "FlowDiagram (processo 5 fasi) sparito"
grep -q "PricingTiers" "$PAGE" || fail "PricingTiers (fasce invariate) sparito"

# ── 4. i18n 7 lingue ──────────────────────────────────────────────────
NEW_KEYS=(hero_title hero_sub live_title live_hours_label live_fallback live_error
  offer_1_title offer_2_title offer_3_title lso_title lso_name lso_name_translation
  lso_trait_1_title lso_trait_2_title lso_trait_3_title lso_closing lso_chat_cta
  demos_title demos_idealoro_name cta_mid_offer cta_mid_lso cta_mid_pricing
  cta_final_title process_intro_v2)
DEAD_KEYS=(pain_label evidence_title how_formula_term_1 receive_label diff_label
  portfolio_label hero_subtitle_1 hero_p1 cta_paragraph process_intro)
SURVIVE_KEYS=(process_step_1 process_step_11 process_closing pricing_tier_1_price
  pricing_tier_5_price pricing_intro cta_email cta_whatsapp)
for l in "${LANGS[@]}"; do
  f="$ROOT/messages/$l.json"
  for k in "${NEW_KEYS[@]}"; do
    jq -e --arg k "$k" '.softwarehouse | has($k)' "$f" >/dev/null 2>&1 || fail "chiave nuova '$k' mancante in $l.json"
  done
  for k in "${DEAD_KEYS[@]}"; do
    jq -e --arg k "$k" '.softwarehouse | has($k)' "$f" >/dev/null 2>&1 && fail "chiave morta '$k' ancora in $l.json"
  done
  for k in "${SURVIVE_KEYS[@]}"; do
    jq -e --arg k "$k" '.softwarehouse | has($k)' "$f" >/dev/null 2>&1 || fail "chiave sopravvissuta '$k' sparita da $l.json"
  done
done

# ── 5. Claim compliance ───────────────────────────────────────────────
# lso_closing it VERBATIM (SSOT §5)
CLOSING=$(jq -r '.softwarehouse.lso_closing' "$ROOT/messages/it.json")
[[ "$CLOSING" == *"non dipendi da nessuno. Nemmeno da me."* ]] || fail "lso_closing it non verbatim SSOT §5: '$CLOSING'"
# LSO name identico (nome proprio, non tradotto) in 7 lingue
for l in "${LANGS[@]}"; do
  N=$(jq -r '.softwarehouse.lso_name' "$ROOT/messages/$l.json")
  [[ "$N" == "Living Software Organism" ]] || fail "lso_name in $l.json = '$N' (deve essere 'Living Software Organism')"
done
# Vietati SSOT §4 in nessuna lingua (namespace softwarehouse)
for l in "${LANGS[@]}"; do
  SW=$(jq -r '.softwarehouse | to_entries[] | .value' "$ROOT/messages/$l.json" 2>/dev/null)
  for bad in "Trustpilot" "Ultra Enterprise" "Magicsoft" "1995"; do
    echo "$SW" | grep -qi "$bad" && fail "vietato '$bad' presente in $l.json (SSOT §4)"
  done
  echo "$SW" | grep -qE "(50 ?%|40-50)" && fail "claim percentuale vietato in $l.json (SSOT §4.3)"
done

# ── 6. P0-FC-1: GSAP mai top-level ────────────────────────────────────
grep -rn "^import .* from ['\"]gsap" "$COMP" 2>/dev/null && fail "import gsap top-level in components/softwarehouse (P0-FC-1)"

# ── 7. Widget live ────────────────────────────────────────────────────
grep -q "stat.florenceegi.com/api/public/site-stats" "$COMP/LiveSiteStats.tsx" || fail "endpoint stats errato/mancante in LiveSiteStats"
# Nessun numero placeholder a 4+ cifre hardcoded nel JSX del widget (vincolo CEO: zero placeholder)
grep -nE ">[0-9]{4,}" "$COMP/LiveSiteStats.tsx" && fail "possibile numero placeholder hardcoded in LiveSiteStats (vincolo CEO)"

echo "GREEN: rewrite softwarehouse conforme — sezioni, componenti, i18n 7 lingue, claim compliance, P0-FC-1, widget live OK"
exit 0
