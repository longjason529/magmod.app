#!/usr/bin/env node

/**
 * GitHub Pages Deployment Script
 * Automates building and deploying to gh-pages branch
 * Repository: https://github.com/longjason529/magmod.app
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function executeCommand(command, description) {
  try {
    log(`\n→ ${description}`, 'blue');
    execSync(command, { stdio: 'inherit' });
    log(`✓ ${description} completed`, 'green');
    return true;
  } catch (error) {
    log(`✗ ${description} failed`, 'red');
    log(error.message, 'red');
    return false;
  }
}

async function main() {
  log('\n🚀 Starting GitHub Pages Deployment\n', 'yellow');

  // Check if we're in a git repository
  if (!fs.existsSync('.git')) {
    log('✗ Not a git repository. Run this script from the repository root.', 'red');
    process.exit(1);
  }

  // Step 1: Build the project
  if (!executeCommand('npm run build', 'Building project')) {
    log('Build failed. Aborting deployment.', 'red');
    process.exit(1);
  }

  // Step 2: Check if dist directory exists
  if (!fs.existsSync('./dist')) {
    log('⚠ Warning: dist directory not found. Creating it...', 'yellow');
    fs.mkdirSync('./dist', { recursive: true });
  }

  // Step 3: Create index.html if it doesn't exist
  if (!fs.existsSync('./dist/index.html')) {
    log('Creating default index.html...', 'blue');
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MagMod App</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
      margin: 0;
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      background: white;
      border-radius: 10px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      padding: 3rem;
      text-align: center;
      max-width: 600px;
    }
    h1 {
      color: #333;
      margin: 0 0 1rem 0;
    }
    p {
      color: #666;
      line-height: 1.6;
    }
    .badge {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      margin-top: 1rem;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 MagMod App</h1>
    <p>Acode Plugin Template for Development</p>
    <p><span class="badge">GitHub Pages Deployed ✓</span></p>
  </div>
</body>
</html>`;
    
    fs.writeFileSync('./dist/index.html', indexHtml);
    log('✓ Default index.html created', 'green');
  }

  // Step 4: Initialize gh-pages if needed
  try {
    execSync('npm list gh-pages', { stdio: 'ignore' });
  } catch (e) {
    log('Installing gh-pages package...', 'yellow');
    executeCommand('npm install --save-dev gh-pages', 'Installing gh-pages');
  }

  // Step 5: Deploy using gh-pages
  log('\nDeploying to GitHub Pages...', 'yellow');
  
  const deployCommand = `npx gh-pages -d dist -m "Automated deployment: $(date '+%Y-%m-%d %H:%M:%S')"`;
  
  if (executeCommand(deployCommand, 'Deploying to gh-pages branch')) {
    log('\n✓ Successfully deployed to GitHub Pages!', 'green');
    log('Your site will be available at: https://longjason529.github.io/magmod.app', 'blue');
  } else {
    log('Deployment failed. Check your GitHub credentials and repository settings.', 'red');
    process.exit(1);
  }

  log('\n✓ Deployment complete!\n', 'green');
}

main().catch((error) => {
  log(`\n✗ Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
