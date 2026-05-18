#!/bin/bash
# Script to brief Codex on the portfolio redesign
cd /home/keagan/repos/portfolio

echo "=== PORTFOLIO REDESIGN BRIEF ==="
cat REDESIGN_BRIEF.md

echo ""
echo "=== CURRENT FILES ==="
echo "--- astro.config.mjs ---"
cat astro.config.mjs
echo ""
echo "--- package.json ---"
cat package.json
echo ""
echo "--- src/layouts/BaseLayout.astro ---"
head -100 src/layouts/BaseLayout.astro
echo "... (truncated, read full file for details)"
echo ""
echo "--- src/pages/index.astro ---"
cat src/pages/index.astro
echo ""
echo "--- src/pages/about.astro ---"
cat src/pages/about.astro
echo ""
echo "--- src/pages/projects.astro ---"
cat src/pages/projects.astro
