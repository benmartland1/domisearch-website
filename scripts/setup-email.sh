#!/bin/bash
# One-shot script to wire up Resend Audience + fix CONTACT_FROM_EMAIL + redeploy.
# Safe to run multiple times - it will replace existing values cleanly.
set -e

cd "$(dirname "$0")/.."

# --- 1. Vercel CLI: ensure logged in + linked ---
echo "→ Checking Vercel CLI auth..."
if ! npx --yes vercel@latest whoami >/dev/null 2>&1; then
  echo "  Not logged in. Launching login..."
  npx --yes vercel@latest login
fi

if [ ! -f .vercel/project.json ]; then
  echo "→ Linking project..."
  npx --yes vercel@latest link
fi

# --- 2. Resend API key ---
echo ""
echo "→ Paste your Resend API key (starts with 're_'). Input is hidden:"
read -s RESEND_KEY
echo ""

if [ -z "$RESEND_KEY" ]; then
  echo "Error: no API key provided." >&2
  exit 1
fi

# --- 3. Find or create the Resend Audience ---
echo "→ Checking Resend audiences..."
LIST_RESPONSE=$(curl -s -H "Authorization: Bearer $RESEND_KEY" https://api.resend.com/audiences)
AUDIENCE_ID=$(echo "$LIST_RESPONSE" | python3 -c "
import sys, json
data = json.load(sys.stdin)
audiences = data.get('data', []) or []
existing = next((a for a in audiences if a.get('name') == 'DomiSearch Newsletter'), None)
print(existing['id'] if existing else '')
")

if [ -z "$AUDIENCE_ID" ]; then
  echo "→ Creating new audience 'DomiSearch Newsletter'..."
  CREATE_RESPONSE=$(curl -s -X POST https://api.resend.com/audiences \
    -H "Authorization: Bearer $RESEND_KEY" \
    -H "Content-Type: application/json" \
    -d '{"name":"DomiSearch Newsletter"}')
  AUDIENCE_ID=$(echo "$CREATE_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('id',''))")
else
  echo "→ Reusing existing audience."
fi

if [ -z "$AUDIENCE_ID" ]; then
  echo "Error: could not determine audience ID. Resend response: $CREATE_RESPONSE" >&2
  exit 1
fi

echo "   Audience ID: $AUDIENCE_ID"

# --- 4. Update Vercel env vars (remove old, add new) ---
echo ""
echo "→ Updating Vercel env vars (production)..."

# CONTACT_FROM_EMAIL → noreply@domisearch.com
npx --yes vercel@latest env rm CONTACT_FROM_EMAIL production --yes >/dev/null 2>&1 || true
printf "noreply@domisearch.com" | npx --yes vercel@latest env add CONTACT_FROM_EMAIL production

# RESEND_AUDIENCE_ID
npx --yes vercel@latest env rm RESEND_AUDIENCE_ID production --yes >/dev/null 2>&1 || true
printf "%s" "$AUDIENCE_ID" | npx --yes vercel@latest env add RESEND_AUDIENCE_ID production

# --- 5. Trigger production redeploy ---
echo ""
echo "→ Triggering production redeploy..."
npx --yes vercel@latest --prod --yes

echo ""
echo "✓ Done."
echo "  - Resend audience: $AUDIENCE_ID"
echo "  - CONTACT_FROM_EMAIL: noreply@domisearch.com"
echo "  - Production deploy triggered"
echo ""
echo "Wait ~1 min for the deploy to complete, then test the newsletter signup form."
