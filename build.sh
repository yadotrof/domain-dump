#!/usr/bin/env bash
# Build a clean ZIP of the extension for Chrome Web Store upload.
# Usage: ./build.sh
# Produces: dist/domain-dump-<version>.zip

set -euo pipefail

cd "$(dirname "$0")"

VERSION=$(grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' manifest.json | sed -E 's/.*"([^"]+)"$/\1/')
OUT_DIR="dist"
OUT_FILE="$OUT_DIR/domain-dump-$VERSION.zip"

mkdir -p "$OUT_DIR"
rm -f "$OUT_FILE"

# Files and folders to include in the extension package.
# Anything not listed here (README.md, PRIVACY.md, STORE.md, build.sh,
# logo.png, dist/, .git/, .DS_Store, etc.) is excluded.
zip -rq "$OUT_FILE" \
  manifest.json \
  background.js \
  popup.html \
  popup.css \
  popup.js \
  vendor/psl-data.js \
  vendor/psl.js \
  icons/icon16.png \
  icons/icon48.png \
  icons/icon128.png \
  -x '*.DS_Store'

echo "Built $OUT_FILE"
unzip -l "$OUT_FILE"
