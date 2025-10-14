#!/usr/bin/env node

/**
 * Setup Verification Script
 * Run this after npm install to verify everything is ready
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Verifying Productivity Quest setup...\n');

let hasErrors = false;

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
console.log(`✓ Node.js version: ${nodeVersion}`);
if (majorVersion < 18) {
  console.log('  ⚠️  Warning: Node.js 18+ recommended');
  hasErrors = true;
}

// Check if node_modules exists
if (existsSync('node_modules')) {
  console.log('✓ node_modules directory exists');
} else {
  console.log('✗ node_modules not found - run npm install');
  hasErrors = true;
}

// Check critical files
const criticalFiles = [
  'package.json',
  'tsconfig.json',
  'vite.config.ts',
  'electron/main.ts',
  'electron/preload.ts',
  'src/App.tsx',
  'src/services/database.ts',
];

console.log('\n📁 Checking critical files:');
criticalFiles.forEach(file => {
  if (existsSync(file)) {
    console.log(`  ✓ ${file}`);
  } else {
    console.log(`  ✗ ${file} missing`);
    hasErrors = true;
  }
});

// Check modules
const modules = [
  'activities',
  'calendar',
  'gamification',
  'goals',
  'timer',
  'todos'
];

console.log('\n🧩 Checking modules:');
modules.forEach(module => {
  const modulePath = join('src', 'modules', module);
  if (existsSync(modulePath)) {
    console.log(`  ✓ ${module}`);
  } else {
    console.log(`  ✗ ${module} missing`);
    hasErrors = true;
  }
});

// Check dependencies
console.log('\n📦 Checking key dependencies:');
try {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const keyDeps = [
    'react',
    'electron',
    'typescript',
    'zustand',
    'sql.js',
    'tailwindcss',
  ];
  
  keyDeps.forEach(dep => {
    if (deps[dep]) {
      console.log(`  ✓ ${dep} (${deps[dep]})`);
    } else {
      console.log(`  ✗ ${dep} not found`);
      hasErrors = true;
    }
  });
} catch (error) {
  console.log('  ✗ Error reading package.json');
  hasErrors = true;
}

// Final verdict
console.log('\n' + '='.repeat(50));
if (!hasErrors) {
  console.log('✅ Setup verified! Ready to run.');
  console.log('\nNext steps:');
  console.log('  1. Run: npm run electron:dev');
  console.log('  2. Read: QUICKSTART.md');
  console.log('  3. Enjoy your productivity app! 🚀');
} else {
  console.log('❌ Setup has issues. Please fix the errors above.');
  console.log('\nTry running:');
  console.log('  npm install');
}
console.log('='.repeat(50) + '\n');

process.exit(hasErrors ? 1 : 0);
