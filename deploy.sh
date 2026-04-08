#!/usr/bin/env bash
# Deploy srojas.app → public_html via tar + SSH
# Usage: bash deploy.sh
set -e

REMOTE="srojasapp"
REMOTE_DIR="~/public_html"

echo "→ Building..."
npm run build

echo "→ Uploading to server..."
tar -czf - -C dist . | ssh "$REMOTE" "
  cd $REMOTE_DIR &&
  tar -xzf - --exclude='.htaccess' --exclude='.well-known' --exclude='hub' --exclude='icon.png' --exclude='logo.png'
"

echo ""
echo "✓ Deploy complete → https://srojas.app"
