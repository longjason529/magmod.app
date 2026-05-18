#!/bin/bash

set -e

echo "ðŸš€ Setting up GitHub Pages for MagMod App"
echo ""
echo "Repository: https://github.com/longjason529/magmod.app"
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

if [ ! -d .git ]; then
    echo -e "${RED}âœ— Not a git repository${NC}"
    exit 1
fi

echo -e "${BLUE}â†’ Checking repository setup${NC}"

mkdir -p scripts
echo -e "${GREEN}âœ“ Scripts directory ready${NC}"

mkdir -p .github/workflows
echo -e "${GREEN}âœ“ Workflow directory ready${NC}"

if [ ! -f package.json ]; then
    echo -e "${RED}âœ— package.json not found${NC}"
    exit 1
fi
echo -e "${GREEN}âœ“ package.json found${NC}"

echo ""
echo -e "${BLUE}â†’ Installing dependencies${NC}"
npm install
echo -e "${GREEN}âœ“ Dependencies installed${NC}"

echo ""
echo -e "${BLUE}â†’ Installing gh-pages${NC}"
npm install --save-dev gh-pages
echo -e "${GREEN}âœ“ gh-pages installed${NC}"

mkdir -p dist
echo -e "${GREEN}âœ“ Dist directory created${NC}"

if [ -f scripts/deploy-gh-pages.js ]; then
    chmod +x scripts/deploy-gh-pages.js
    echo -e "${GREEN}âœ“ Deploy script made executable${NC}"
fi

echo ""
echo -e "${BLUE}â†’ GitHub Pages Setup Complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Commit and push:"
echo "   git add ."
echo "   git commit -m 'Setup GitHub Pages automation'"
echo "   git push origin main"
echo ""
echo "2. Enable in repository settings:"
echo "   https://github.com/longjason529/magmod.app/settings/pages"
echo "   Source: GitHub Actions"
echo ""
echo "3. Your site will be available at:"
echo "   https://longjason529.github.io/magmod.app"
echo ""
