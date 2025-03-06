#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Directories to create
const directories = [
  'data',
  'data/reviews',
  'data/analysis',
  'data/reports',
  'backend',
  'backend/routes',
  'backend/services',
  'backend/utils',
  'frontend'
];

// Files to check
const requiredFiles = [
  'backend/server.js',
  'backend/routes/apps.js',
  'backend/routes/reviews.js',
  'backend/routes/analysis.js',
  'backend/services/appStore.js',
  'backend/services/reviews.js',
  'backend/services/analysis.js',
  'backend/utils/storage.js',
  'backend/utils/helpers.js'
];

console.log('🚀 Setting up App Review Analyzer...');

// Create directories
console.log('\n📁 Creating directory structure...');
directories.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`  ✓ Created ${dir}`);
  } else {
    console.log(`  ✓ ${dir} already exists`);
  }
});

// Check required files
console.log('\n📄 Checking required files...');
const missingFiles = requiredFiles.filter(file => {
  const filePath = path.join(__dirname, '..', file);
  return !fs.existsSync(filePath);
});

if (missingFiles.length > 0) {
  console.log('\n⚠️  Missing required files:');
  missingFiles.forEach(file => {
    console.log(`  - ${file}`);
  });
  console.log('\nPlease create these files before continuing.');
}

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('\n📝 Creating .env file...');
  fs.writeFileSync(envPath, 'PORT=3001\n# Optional: OpenAI API key for deeper analysis\n# OPENAI_API_KEY=your_openai_api_key\n');
  console.log('  ✓ Created .env file');
}

// Ask if user wants to set up the frontend
rl.question('\n🖥️  Do you want to set up the Next.js frontend now? (y/n) ', (answer) => {
  if (answer.toLowerCase() === 'y') {
    console.log('\n🔧 Setting up Next.js frontend...');
    
    try {
      // Change to frontend directory
      process.chdir(path.join(__dirname, '..', 'frontend'));
      
      // Check if package.json exists
      if (!fs.existsSync('package.json')) {
        console.log('  ✓ Initializing Next.js app...');
        execSync('npx create-next-app@latest . --app --tailwind --eslint --src-dir --import-alias "@/*" --js', { stdio: 'inherit' });
      } else {
        console.log('  ✓ Next.js app already initialized');
      }
      
      console.log('\n✅ Frontend setup complete!');
    } catch (error) {
      console.error('\n❌ Error setting up frontend:', error.message);
    }
  }
  
  console.log('\n🎉 Setup complete! You can now start the app with:');
  console.log('  npm run dev');
  
  rl.close();
}); 