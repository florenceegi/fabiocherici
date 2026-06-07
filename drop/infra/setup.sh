#!/usr/bin/env bash
# @package drop — Provisioning AWS idempotente (end-to-end)
# @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
# @purpose Crea/aggiorna TUTTA l'infra di Drop: bucket privato + CORS + policy TLS,
#          DynamoDB token store, IAM role, Lambda di firma, API Gateway HTTP, notifica
#          S3->SNS->email, e genera frontend/config.js con l'endpoint reale.
#
# ⚠️  TOCCA AWS LIVE. Richiede un profilo con permessi ADMIN (S3/Lambda/IAM/DDB/APIGW/SNS).
#     egi-hub-deploy (solo SSM+Route53) NON basta. Imposta AWS_PROFILE in config.env.
#
# Ordine: CORS è la causa #1 di upload falliti → bucket+CORS per primi, poi il resto.
# Uso:  bash infra/setup.sh
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# shellcheck disable=SC1091
source "$DIR/config.env"

AWS=(aws --region "$AWS_REGION" --profile "$AWS_PROFILE" --output json)
say() { printf '\n\033[1;34m▶ %s\033[0m\n' "$*"; }
ok()  { printf '  \033[32m✓ %s\033[0m\n' "$*"; }

# ── 0. Preflight ──────────────────────────────────────────────────────────────
say "Preflight — identità AWS"
ID_ARN="$(aws --profile "$AWS_PROFILE" sts get-caller-identity --query Arn --output text)"
ok "Profilo: $AWS_PROFILE → $ID_ARN"
case "$ID_ARN" in
  *egi-hub-deploy*) echo "  ⚠️  egi-hub-deploy ha solo SSM+Route53: il provisioning fallirà. Cambia AWS_PROFILE."; ;;
esac

# ── 1. S3 bucket (privato) ─────────────────────────────────────────────────────
say "S3 — bucket $DROP_BUCKET"
if "${AWS[@]}" s3api head-bucket --bucket "$DROP_BUCKET" 2>/dev/null; then
  ok "bucket già esistente"
else
  "${AWS[@]}" s3api create-bucket --bucket "$DROP_BUCKET" \
    --create-bucket-configuration "LocationConstraint=$AWS_REGION" >/dev/null
  ok "bucket creato"
fi

say "S3 — blocco accesso pubblico (totale)"
"${AWS[@]}" s3api put-public-access-block --bucket "$DROP_BUCKET" \
  --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true >/dev/null
ok "public access block ON"

say "S3 — bucket policy (forza TLS)"
"${AWS[@]}" s3api put-bucket-policy --bucket "$DROP_BUCKET" \
  --policy "file://$DIR/infra/bucket-policy.json" >/dev/null
ok "policy applicata"

say "S3 — CORS (PUT da $DROP_ORIGIN, espone ETag)"
"${AWS[@]}" s3api put-bucket-cors --bucket "$DROP_BUCKET" \
  --cors-configuration "file://$DIR/infra/bucket-cors.json" >/dev/null
ok "CORS applicato"

# ── 2. DynamoDB token store ────────────────────────────────────────────────────
say "DynamoDB — tabella $DROP_TABLE (+ GSI slug-index)"
if "${AWS[@]}" dynamodb describe-table --table-name "$DROP_TABLE" >/dev/null 2>&1; then
  ok "tabella già esistente"
else
  "${AWS[@]}" dynamodb create-table --table-name "$DROP_TABLE" \
    --attribute-definitions AttributeName=token_hash,AttributeType=S AttributeName=slug,AttributeType=S \
    --key-schema AttributeName=token_hash,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --global-secondary-indexes '[{
      "IndexName":"slug-index",
      "KeySchema":[{"AttributeName":"slug","KeyType":"HASH"}],
      "Projection":{"ProjectionType":"ALL"}
    }]' >/dev/null
  "${AWS[@]}" dynamodb wait table-exists --table-name "$DROP_TABLE"
  ok "tabella creata"
fi

# ── 3. IAM role per la Lambda ──────────────────────────────────────────────────
# NB: i profili deploy locali (egi-hub-deploy / fabiocherici-deploy) NON hanno permessi di
# scrittura IAM. Se la role NON esiste, va creata da Console (vedi README §Deploy / IAM).
say "IAM — role $LAMBDA_ROLE"
if "${AWS[@]}" iam get-role --role-name "$LAMBDA_ROLE" >/dev/null 2>&1; then
  ROLE_ARN="$("${AWS[@]}" iam get-role --role-name "$LAMBDA_ROLE" --query 'Role.Arn' --output text)"
  ok "role già esistente — salto scritture IAM (gestite da Console)"
  # tentativo best-effort di allineare la policy inline (silenzioso se il profilo non può)
  "${AWS[@]}" iam put-role-policy --role-name "$LAMBDA_ROLE" \
    --policy-name drop-signer-inline \
    --policy-document "file://$DIR/infra/lambda-policy.json" >/dev/null 2>&1 \
    && ok "policy inline aggiornata" || echo "  (policy inline non aggiornata via CLI — ok se già impostata da Console)"
else
  cat <<EOF

  ✗ La role $LAMBDA_ROLE non esiste e questo profilo non può crearla (IAM è admin-only).
    Crea la role da AWS Console, poi RILANCIA questo script (è idempotente):

    1) IAM → Roles → Create role → Trusted entity: AWS service → Lambda → Next → Create
       Nome role: $LAMBDA_ROLE
    2) Apri $LAMBDA_ROLE → Permissions → Add permissions → Create inline policy → JSON
       Incolla il contenuto di: infra/lambda-policy.json
       Nome policy: drop-signer-inline → Create
    3) Rilancia:  AWS_PROFILE=$AWS_PROFILE bash infra/setup.sh
EOF
  exit 2
fi

# ── 4. Lambda di firma ─────────────────────────────────────────────────────────
say "Lambda — pacchetto"
ZIP="$(mktemp -d)/drop-signer.zip"
( cd "$DIR/lambda" && zip -q -r "$ZIP" index.mjs lib.mjs package.json )
ok "zip: $ZIP"

LAMBDA_ENV="Variables={DROP_BUCKET=$DROP_BUCKET,DROP_TABLE=$DROP_TABLE,DROP_PREFIX=$DROP_PREFIX,DROP_ORIGIN=$DROP_ORIGIN}"
if "${AWS[@]}" lambda get-function --function-name "$LAMBDA_NAME" >/dev/null 2>&1; then
  "${AWS[@]}" lambda update-function-code --function-name "$LAMBDA_NAME" \
    --zip-file "fileb://$ZIP" >/dev/null
  "${AWS[@]}" lambda wait function-updated --function-name "$LAMBDA_NAME"
  "${AWS[@]}" lambda update-function-configuration --function-name "$LAMBDA_NAME" \
    --handler index.handler --runtime "$LAMBDA_RUNTIME" --timeout 30 --memory-size 256 \
    --environment "$LAMBDA_ENV" >/dev/null
  ok "Lambda aggiornata"
else
  # il role IAM può metterci qualche secondo a propagarsi → retry
  for i in 1 2 3 4 5; do
    if "${AWS[@]}" lambda create-function --function-name "$LAMBDA_NAME" \
        --runtime "$LAMBDA_RUNTIME" --handler index.handler --role "$ROLE_ARN" \
        --timeout 30 --memory-size 256 --environment "$LAMBDA_ENV" \
        --zip-file "fileb://$ZIP" >/dev/null 2>&1; then ok "Lambda creata"; break; fi
    echo "  …attendo propagazione IAM ($i)"; sleep 6
  done
fi
LAMBDA_ARN="$("${AWS[@]}" lambda get-function --function-name "$LAMBDA_NAME" --query 'Configuration.FunctionArn' --output text)"

# ── 5. API Gateway HTTP API ────────────────────────────────────────────────────
say "API Gateway — HTTP API $API_NAME"
API_ID="$("${AWS[@]}" apigatewayv2 get-apis --query "Items[?Name=='$API_NAME'].ApiId | [0]" --output text)"
if [[ "$API_ID" == "None" || -z "$API_ID" ]]; then
  API_ID="$("${AWS[@]}" apigatewayv2 create-api --name "$API_NAME" --protocol-type HTTP \
    --target "$LAMBDA_ARN" --query 'ApiId' --output text)"
  ok "API creata: $API_ID"
else
  ok "API già esistente: $API_ID"
fi
API_ENDPOINT="$("${AWS[@]}" apigatewayv2 get-api --api-id "$API_ID" --query 'ApiEndpoint' --output text)"

say "Lambda — permesso invoke da API Gateway"
"${AWS[@]}" lambda add-permission --function-name "$LAMBDA_NAME" \
  --statement-id apigw-invoke --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:$AWS_REGION:$AWS_ACCOUNT:$API_ID/*/*" >/dev/null 2>&1 \
  && ok "permesso aggiunto" || ok "permesso già presente"

# ── 6. Notifica S3 ObjectCreated -> SNS -> email ───────────────────────────────
say "SNS — topic $SNS_TOPIC + subscription email"
TOPIC_ARN="$("${AWS[@]}" sns create-topic --name "$SNS_TOPIC" --query 'TopicArn' --output text)"
ok "topic: $TOPIC_ARN"
"${AWS[@]}" sns set-topic-attributes --topic-arn "$TOPIC_ARN" --attribute-name Policy \
  --attribute-value "{
    \"Version\":\"2012-10-17\",
    \"Statement\":[{
      \"Effect\":\"Allow\",
      \"Principal\":{\"Service\":\"s3.amazonaws.com\"},
      \"Action\":\"SNS:Publish\",
      \"Resource\":\"$TOPIC_ARN\",
      \"Condition\":{
        \"ArnLike\":{\"aws:SourceArn\":\"arn:aws:s3:::$DROP_BUCKET\"},
        \"StringEquals\":{\"aws:SourceAccount\":\"$AWS_ACCOUNT\"}
      }
    }]
  }" >/dev/null
ok "topic policy (consente publish da S3)"
if "${AWS[@]}" sns list-subscriptions-by-topic --topic-arn "$TOPIC_ARN" \
    --query "Subscriptions[?Endpoint=='$NOTIFY_EMAIL'] | [0].SubscriptionArn" --output text \
    | grep -qE 'arn:|PendingConfirmation'; then
  ok "subscription email già presente"
else
  "${AWS[@]}" sns subscribe --topic-arn "$TOPIC_ARN" --protocol email --notification-endpoint "$NOTIFY_EMAIL" >/dev/null
  ok "subscription creata → CONFERMA la mail inviata a $NOTIFY_EMAIL"
fi

say "S3 — notification ObjectCreated -> SNS"
"${AWS[@]}" s3api put-bucket-notification-configuration --bucket "$DROP_BUCKET" \
  --notification-configuration "{
    \"TopicConfigurations\":[{
      \"TopicArn\":\"$TOPIC_ARN\",
      \"Events\":[\"s3:ObjectCreated:*\"],
      \"Filter\":{\"Key\":{\"FilterRules\":[{\"Name\":\"prefix\",\"Value\":\"$DROP_PREFIX/\"}]}}
    }]
  }" >/dev/null
ok "notifica configurata su prefix $DROP_PREFIX/"

# ── 7. Genera config.js per il frontend ────────────────────────────────────────
say "Frontend — genero config.js con l'endpoint reale"
cat > "$DIR/frontend/config.js" <<EOF
/* GENERATO da infra/setup.sh — non modificare a mano */
window.DROP_API = "$API_ENDPOINT";
EOF
ok "frontend/config.js → DROP_API=$API_ENDPOINT"

# ── Riepilogo ──────────────────────────────────────────────────────────────────
say "FATTO — riepilogo"
cat <<EOF
  Bucket:        s3://$DROP_BUCKET/$DROP_PREFIX/{slug}/
  API endpoint:  $API_ENDPOINT
  Notifica:      S3 ObjectCreated -> $TOPIC_ARN -> $NOTIFY_EMAIL (conferma la mail!)

  PROSSIMI PASSI:
   1) Conferma la subscription email arrivata a $NOTIFY_EMAIL
   2) Crea un cliente:   bin/drop-client.sh create acme-srl "ACME Srl"
   3) Pubblica frontend/ su https://drop.fabiocherici.com
      (subdomain Route53 → nginx EC2 statico, oppure S3+CloudFront)
   4) Acceptance test:   bash infra/acceptance-test.sh <token-di-prova>
EOF
