#!/bin/bash

set -e

echo "🚀 Setting up GitHub Pages for MagMod App"
echo ""
echo "Repository: https://github.com/longjason529/magmod.app"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Step 1: Check if in git repo
if [ ! -d .git ]; then
    echo -e "${RED}✗ Not a git repository${NC}"
    exit 1
fi

echo -e "${BLUE}→ Checking repository setup${NC}"

# Step 2: Create scripts directory
mkdir -p scripts
echo -e "${GREEN}✓ Scripts directory ready${NC}"

# Step 3: Create workflow directory
mkdir -p .github/workflows
echo -e "${GREEN}✓ Workflow directory ready${NC}"

# Step 4: Check package.json exists
if [ ! -f package.json ]; then
    echo -e "${RED}✗ package.json not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ package.json found${NC}"

# Step 5: Install dependencies
echo ""
echo -e "${BLUE}→ Installing dependencies${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Step 6: Install gh-pages
echo ""
echo -e "${BLUE}→ Installing gh-pages${NC}"
npm install --save-dev gh-pages
echo -e "${GREEN}✓ gh-pages installed${NC}"

# Step 7: Create dist directory
mkdir -p dist
echo -e "${GREEN}✓ Dist directory created${NC}"

# Step 8: Make deploy script executable
if [ -f scripts/deploy-gh-pages.js ]; then
    chmod +x scripts/deploy-gh-pages.js
    echo -e "${GREEN}✓ Deploy script made executable${NC}"
fi

echo ""
echo -e "${BLUE}→ GitHub Pages Setup Complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Push these changes to your repository:"
echo "   git add ."
echo "   git commit -m 'Setup GitHub Pages automation'"
echo "   git push origin main"
echo ""
echo "2. Enable GitHub Pages in repository settings:"
echo "   - Go to https://github.com/longjason529/magmod.app/settings/pages"
echo "   - Source: GitHub Actions"
echo ""
echo "3. Deploy manually (optional):"
echo "   npm run deploy"
echo ""
echo "4. Or let GitHub Actions handle it automatically on push!"
echo ""
echo -e "${BLUE}Your site will be available at:${NC}"
echo "https://longjason529.github.io/magmod.app"
echo ""
