#!/usr/bin/env bash
# @package drop — Admin CLI gestione token-cliente (DynamoDB drop-clients)
# @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
# @purpose Genera/elenca/revoca i link di caricamento per cliente. Il token in chiaro è
#          mostrato UNA SOLA VOLTA alla creazione (in DB se ne salva solo lo sha256).
#
# Uso:
#   bin/drop-client.sh create <slug> ["Etichetta cliente"]
#   bin/drop-client.sh list
#   bin/drop-client.sh revoke <slug>
#
# Richiede: aws cli, openssl, sha256sum. Profilo AWS con accesso DynamoDB (config.env).
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# shellcheck disable=SC1091
source "$DIR/config.env"

ddb() { aws dynamodb "$@" --region "$AWS_REGION" --profile "$AWS_PROFILE" --output json; }

cmd="${1:-}"
case "$cmd" in
  create)
    slug="${2:?slug richiesto (es. acme-srl)}"
    label="${3:-$slug}"
    # slug sicuro: solo minuscole, numeri, trattino
    if ! [[ "$slug" =~ ^[a-z0-9][a-z0-9-]{1,62}$ ]]; then
      echo "✗ slug non valido. Usa minuscole/numeri/trattino, 2-63 char." >&2; exit 1
    fi
    token="$(openssl rand -hex 24)"
    token_hash="$(printf %s "$token" | sha256sum | cut -d' ' -f1)"
    now="$(date +%s)"
    ddb put-item \
      --table-name "$DROP_TABLE" \
      --item "{
        \"token_hash\": {\"S\": \"$token_hash\"},
        \"slug\":       {\"S\": \"$slug\"},
        \"label\":      {\"S\": \"$label\"},
        \"active\":     {\"BOOL\": true},
        \"created_at\": {\"N\": \"$now\"}
      }" \
      --condition-expression "attribute_not_exists(token_hash)" >/dev/null
    echo "✓ Cliente creato: $slug ($label)"
    echo
    echo "  LINK (invialo al cliente — il token NON è recuperabile dopo):"
    echo "  ${DROP_PAGE_URL:-$DROP_ORIGIN}?k=$token"
    echo
    echo "  File del cliente atterreranno in: s3://$DROP_BUCKET/$DROP_PREFIX/$slug/"
    ;;

  list)
    echo "Clienti (tabella $DROP_TABLE):"
    ddb scan --table-name "$DROP_TABLE" \
      --projection-expression "slug,label,active,created_at" \
      | python3 -c '
import sys, json, datetime
d = json.load(sys.stdin)
items = sorted(d.get("Items", []), key=lambda i: i.get("created_at", {}).get("N", "0"))
if not items:
    print("  (nessuno)"); sys.exit()
for it in items:
    slug = it.get("slug", {}).get("S", "?")
    label = it.get("label", {}).get("S", "")
    active = it.get("active", {}).get("BOOL", True)
    ts = it.get("created_at", {}).get("N")
    when = datetime.datetime.fromtimestamp(int(ts)).strftime("%Y-%m-%d") if ts else "—"
    flag = "attivo " if active else "REVOCATO"
    print(f"  [{flag}] {slug:24} {when}  {label}")
'
    ;;

  revoke)
    slug="${2:?slug richiesto}"
    # disattiva TUTTI i token dello slug (non solo il primo)
    ths="$(ddb query --table-name "$DROP_TABLE" --index-name slug-index \
      --key-condition-expression "slug = :s" \
      --expression-attribute-values "{\":s\": {\"S\": \"$slug\"}}" \
      | python3 -c "import json,sys;print('\n'.join(i['token_hash']['S'] for i in json.load(sys.stdin).get('Items',[])))")"
    if [[ -z "$ths" || "$ths" == "None" ]]; then echo "✗ slug non trovato: $slug" >&2; exit 1; fi
    n=0
    for th in $ths; do
      [[ "$th" == "None" ]] && continue
      ddb update-item --table-name "$DROP_TABLE" \
        --key "{\"token_hash\": {\"S\": \"$th\"}}" \
        --update-expression "SET active = :f" \
        --expression-attribute-values "{\":f\": {\"BOOL\": false}}" >/dev/null
      n=$((n+1))
    done
    echo "✓ Cliente revocato: $slug ($n token disattivati). I file restano in incoming/$slug/."
    ;;

  reissue)
    # Revoca TUTTI i vecchi token dello slug ed emette UN nuovo link. Stesso slug = STESSI file.
    slug="${2:?slug richiesto}"
    label="${3:-}"
    if [[ -z "$label" ]]; then
      label="$(ddb query --table-name "$DROP_TABLE" --index-name slug-index \
        --key-condition-expression "slug = :s" \
        --expression-attribute-values "{\":s\": {\"S\": \"$slug\"}}" \
        | python3 -c "import json,sys;items=json.load(sys.stdin).get('Items',[]);print(items[0]['label']['S'] if items else '')")"
      [[ -z "$label" ]] && label="$slug"
    fi
    # 1) revoca tutti i token esistenti
    ths="$(ddb query --table-name "$DROP_TABLE" --index-name slug-index \
      --key-condition-expression "slug = :s" \
      --expression-attribute-values "{\":s\": {\"S\": \"$slug\"}}" \
      | python3 -c "import json,sys;print('\n'.join(i['token_hash']['S'] for i in json.load(sys.stdin).get('Items',[])))")"
    rev=0
    for th in $ths; do
      [[ -z "$th" || "$th" == "None" ]] && continue
      ddb update-item --table-name "$DROP_TABLE" \
        --key "{\"token_hash\": {\"S\": \"$th\"}}" \
        --update-expression "SET active = :f" \
        --expression-attribute-values "{\":f\": {\"BOOL\": false}}" >/dev/null
      rev=$((rev+1))
    done
    # 2) nuovo token sullo stesso slug (punta alla stessa cartella -> stessi file)
    token="$(openssl rand -hex 24)"
    token_hash="$(printf %s "$token" | sha256sum | cut -d' ' -f1)"
    now="$(date +%s)"
    ddb put-item --table-name "$DROP_TABLE" \
      --item "{
        \"token_hash\": {\"S\": \"$token_hash\"},
        \"slug\":       {\"S\": \"$slug\"},
        \"label\":      {\"S\": \"$label\"},
        \"active\":     {\"BOOL\": true},
        \"created_at\": {\"N\": \"$now\"}
      }" \
      --condition-expression "attribute_not_exists(token_hash)" >/dev/null
    echo "✓ Reissue '$slug' ($label): $rev vecchi token revocati, nuovo link emesso."
    echo "  I file precedenti restano visibili (stesso slug = stessa cartella)."
    echo
    echo "  NUOVO LINK (invialo al cliente — il vecchio non funziona più):"
    echo "  ${DROP_PAGE_URL:-$DROP_ORIGIN}?k=$token"
    ;;

  *)
    echo "Uso: bin/drop-client.sh {create <slug> [label] | reissue <slug> [label] | list | revoke <slug>}" >&2
    exit 1 ;;
esac
