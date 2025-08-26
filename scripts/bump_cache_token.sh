#!/usr/bin/env bash
set -euo pipefail
shopt -s globstar

CB="$(date +%s)"
for f in **/*.html; do
  [[ -f "$f" ]] || continue
  # Add or replace ?cb= on CSS refs
  sed -i -E 's@(href="/css/[^"?]+)(\?cb=[0-9]+)?@\1?cb='"$CB"'@g' "$f"
  # Add or replace ?cb= on JS refs
  sed -i -E 's@(src="/js/[^"?]+)(\?cb=[0-9]+)?@\1?cb='"$CB"'@g' "$f"
done
echo "Cache token set to $CB"
