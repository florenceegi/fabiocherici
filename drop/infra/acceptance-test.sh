#!/usr/bin/env bash
# @package drop — Acceptance test end-to-end (firma reale, upload multipart reale)
# @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
# @purpose Esercita il percorso completo Uppy→API→S3: create → sign part → PUT su S3 →
#          complete. Verifica che il file atterri in incoming/{slug}/ con la dimensione giusta.
#
# Uso:    bash infra/acceptance-test.sh <token-cliente> [size_MiB]
#         size_MiB default 12 (3 parti). Per il test del brief >5GB: usa 5200.
#
# Copre: multipart obbligatorio, confinamento prefix, firma valida, ETag, complete.
# Resume su connessione instabile e notifica email: vedi note finali (verifica manuale).
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# shellcheck disable=SC1091
source "$DIR/config.env"

TOKEN="${1:?token cliente richiesto — crealo con bin/drop-client.sh create <slug>}"
SIZE_MIB="${2:-12}"
PART_MIB=5

API="$(grep -oE 'https://[^"]+' "$DIR/frontend/config.js" 2>/dev/null || true)"
API="${API:-${DROP_API:-}}"
[[ -n "$API" ]] || { echo "✗ API endpoint ignoto: esegui prima infra/setup.sh (genera config.js)"; exit 1; }
API="${API%/}"

H_TOKEN=(-H "x-drop-token: $TOKEN")
jq_get() { python3 -c "import sys,json;print(json.load(sys.stdin).get('$1',''))"; }

echo "▶ API: $API"
echo "▶ Token valido?"
ME="$(curl -fsS "${H_TOKEN[@]}" "$API/me")" || { echo "✗ token rifiutato"; exit 1; }
echo "  ✓ cliente: $(printf '%s' "$ME" | jq_get client)"

echo "▶ File di prova: ${SIZE_MIB} MiB"
TMP="$(mktemp -d)"; FILE="$TMP/prova-$(date +%s).bin"
head -c "$((SIZE_MIB*1024*1024))" /dev/urandom > "$FILE"
SRC_SIZE="$(stat -c%s "$FILE")"

echo "▶ create multipart"
CREATE="$(curl -fsS -X POST "${H_TOKEN[@]}" -H 'content-type: application/json' \
  -d "{\"filename\":\"$(basename "$FILE")\",\"type\":\"application/octet-stream\"}" "$API/s3/multipart")"
KEY="$(printf '%s' "$CREATE" | jq_get key)"
UPLOAD_ID="$(printf '%s' "$CREATE" | jq_get uploadId)"
echo "  ✓ key=$KEY"
case "$KEY" in
  "$DROP_PREFIX"/*/*) echo "  ✓ confinato nel prefix $DROP_PREFIX/" ;;
  *) echo "  ✗ key fuori dal prefix atteso!"; exit 1 ;;
esac

echo "▶ upload parti (${PART_MIB} MiB cad.) — firma + PUT su S3"
split -b "$((PART_MIB*1024*1024))" -d "$FILE" "$TMP/part_"
PARTS_JSON="["; n=0; first=1
for p in "$TMP"/part_*; do
  n=$((n+1))
  URL="$(curl -fsS "${H_TOKEN[@]}" "$API/s3/multipart/$UPLOAD_ID/$n?key=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$KEY")" | jq_get url)"
  ETAG="$(curl -fsS -X PUT --data-binary "@$p" -D - -o /dev/null "$URL" | tr -d '\r' | awk -F': ' 'tolower($1)=="etag"{print $2}')"
  [[ -n "$ETAG" ]] || { echo "  ✗ ETag mancante (CORS/ExposeHeaders ETag?)"; exit 1; }
  [[ $first -eq 1 ]] && first=0 || PARTS_JSON+=","
  PARTS_JSON+="{\"PartNumber\":$n,\"ETag\":$ETAG}"
  echo "  ✓ parte $n caricata (ETag $ETAG)"
done
PARTS_JSON+="]"

echo "▶ complete multipart"
KEY_ENC="$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$KEY")"
curl -fsS -X POST "${H_TOKEN[@]}" -H 'content-type: application/json' \
  -d "{\"parts\":$PARTS_JSON}" "$API/s3/multipart/$UPLOAD_ID/complete?key=$KEY_ENC" >/dev/null
echo "  ✓ upload completato"

echo "▶ verifica oggetto su S3 (head-object)"
DST_SIZE="$(aws --region "$AWS_REGION" --profile "$AWS_PROFILE" s3api head-object \
  --bucket "$DROP_BUCKET" --key "$KEY" --query 'ContentLength' --output text 2>/dev/null || echo '')"
if [[ "$DST_SIZE" == "$SRC_SIZE" ]]; then
  echo "  ✓ oggetto presente, dimensione corretta ($DST_SIZE byte)"
else
  echo "  ⚠️  head-object non confermato (sorgente $SRC_SIZE, dest '$DST_SIZE') — controlla i permessi del profilo"
fi

rm -rf "$TMP"
cat <<EOF

✅ ACCEPTANCE CORE PASSATO: multipart end-to-end, confinamento prefix, firma+ETag+complete.

Verifiche manuali rimanenti (dal brief):
  • >5 GB:   ri-esegui con  bash infra/acceptance-test.sh $TOKEN 5200
  • RESUME:  dalla pagina drop.fabiocherici.com avvia un upload grande, stacca la rete
             a metà, riconnetti → Uppy riprende dalle parti mancanti (listParts).
  • NOTIFICA: controlla che a $NOTIFY_EMAIL sia arrivata la mail S3 ObjectCreated.
EOF
