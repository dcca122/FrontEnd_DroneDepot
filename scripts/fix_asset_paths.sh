#!/usr/bin/env bash
set -euo pipefail
shopt -s globstar

changed=0
for f in **/*.html; do
  [[ -f "$f" ]] || continue
  # Make paths absolute from docroot
  sed -i -E 's@href="css/@href="/css/@g; s@src="js/@src="/js/@g' "$f" && changed=1
done

if [[ $changed -eq 1 ]]; then
  echo "Asset paths normalized to /css and /js."
else
  echo "No HTML files changed."
fi
