const fs = require('fs');
const path = require('path');
const glob = require('glob');

const sensitivePatterns = [
  /(['"])[0-9a-f]{32}(['"])/i, // API keys
  /(['"])[0-9a-f]{24}(['"])/i, // MongoDB IDs
  /(['"])[0-9A-Za-z\-_]{39}(['"])/i, // AWS keys
  /(['"])[0-9]{12}\.apps\.googleusercontent\.com(['"])/i, // Google Client IDs
  /(['"])[0-9]{15}(['"])/i, // Facebook App IDs
];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let hasMatches = false;

  sensitivePatterns.forEach((pattern) => {
    if (pattern.test(content)) {
      console.log(`⚠️  Found potential hardcoded value in ${filePath}`);
      hasMatches = true;
    }
  });

  return hasMatches;
}

function scanDirectory() {
  const files = glob.sync('**/*.{js,jsx,ts,tsx,json,yml,yaml}', {
    ignore: ['node_modules/**', 'build/**', '.next/**', 'scripts/**']
  });

  let foundIssues = false;
  files.forEach(file => {
    if (scanFile(file)) {
      foundIssues = true;
    }
  });

  return foundIssues;
}

console.log('🔍 Scanning for hardcoded sensitive values...');
const hasIssues = scanDirectory();

if (hasIssues) {
  console.log('\n❌ Found potential hardcoded values. Please review and move them to environment variables.');
  process.exit(1);
} else {
  console.log('\n✅ No hardcoded sensitive values found.');
}