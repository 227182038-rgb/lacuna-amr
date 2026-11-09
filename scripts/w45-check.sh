#!/bin/bash
# W4/W5 verification: RUO notice, key metering, webhook HMAC round-trip, outbound dispatcher
set -u
cd /home/z/my-project

KEY=$(curl -s -X POST localhost:3000/api/keys -H 'content-type: application/json' \
  -d '{"label":"w45-webhook-check","scope":"read+predict"}' \
  | python3 -c 'import json,sys; print(json.load(sys.stdin)["key"])')
echo "key issued: ${KEY:0:16}..."

curl -s -X POST localhost:3000/api/v1/predict -H 'content-type: application/json' \
  -H "x-api-key: $KEY" -d '{"drug":"ciprofloxacin","isolate":"SAMN10620096"}' \
  | python3 -c 'import json,sys; d=json.load(sys.stdin); print("RUO notice present:", "RESEARCH USE ONLY" in d["notice"], "| credits left:", d["creditsRemaining"])'

echo "--- config before ---"
curl -s localhost:3000/api/integrations/vecura \
  | python3 -c 'import json,sys; d=json.load(sys.stdin); c=d["config"]; print("events:", c["events"], "| endpoint:", c.get("endpointUrl"), "| lastTest:", c.get("lastTestStatus"))'

SECRET=$(curl -s -X POST localhost:3000/api/integrations/vecura -H 'content-type: application/json' \
  -d '{"action":"rotate-secret"}' | python3 -c 'import json,sys; print(json.load(sys.stdin)["secret"])')
echo "secret rotated: ${SECRET:0:4}****"

BODY='{"event":"workflow.started","origin":"vecura-test"}'
SIG=$(node -e 'const c=require("crypto");console.log("sha256="+c.createHmac("sha256",process.argv[1]).update(process.argv[2]).digest("hex"))' "$SECRET" "$BODY")

echo "--- W4: bad signature (expect 401) ---"
curl -s -o /dev/null -w "%{http_code}\n" -X POST localhost:3000/api/webhooks/vecura \
  -H 'content-type: application/json' -H 'x-lacuna-signature: sha256=deadbeef' -d "$BODY"

echo "--- W4: good signature (expect 200 + received) ---"
curl -s -X POST localhost:3000/api/webhooks/vecura -H 'content-type: application/json' \
  -H "x-lacuna-signature: $SIG" -d "$BODY"
echo ""

echo "--- W5: outbound test action (real network attempt, honest outcome) ---"
curl -s -X POST localhost:3000/api/integrations/vecura -H 'content-type: application/json' \
  -d '{"action":"test"}' | head -c 300
echo ""

echo "--- webhook event log (latest 5) ---"
curl -s localhost:3000/api/integrations/vecura \
  | python3 -c 'import json,sys; d=json.load(sys.stdin); [print(e["direction"], e["eventType"], e["status"], e.get("httpStatus"), e["createdAt"][:19]) for e in d["events"][:5]]'

echo "--- W6: banned-claims grep on new code ---"
grep -riEc "partnership|diagnos|cure|guarantee|100%|state-of-the-art|FDA" \
  src/components/lacuna/integrations.tsx src/lib/lacuna/openapi.ts src/lib/lacuna/v1.ts \
  src/app/api/v1 src/app/api/mcp src/app/api/integrations src/app/api/webhooks 2>/dev/null \
  | grep -v ":0$" || echo "no banned-claim hits"
