// Quick setup verification script
// Run this with: node verify-setup.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Universal Store Management System - Setup Verification\n');

// Check if .env file exists and has required variables
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found');
  console.log('   Please create a .env file with your Supabase credentials');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const hasUrl = envContent.includes('VITE_SUPABASE_URL=') && !envContent.includes('your-project-id');
const hasKey = envContent.includes('VITE_SUPABASE_ANON_KEY=') && !envContent.includes('your-anon-key-here');

console.log('📁 Environment Configuration:');
console.log(`   .env file: ✓ Found`);
console.log(`   Supabase URL: ${hasUrl ? '✓ Configured' : '❌ Not configured'}`);
console.log(`   Supabase Key: ${hasKey ? '✓ Configured' : '❌ Not configured'}`);

if (!hasUrl || !hasKey) {
  console.log('\n📝 Next Steps:');
  console.log('   1. Create a Supabase project at https://supabase.com');
  console.log('   2. Get your Project URL and anon key from Settings > API');
  console.log('   3. Update your .env file with the actual values');
  console.log('   4. Run the SQL setup script in your Supabase dashboard');
  console.log('   5. Restart your development server: npm run dev');
}

// Check if SQL setup file exists
const sqlPath = path.join(__dirname, 'supabase-setup.sql');
if (fs.existsSync(sqlPath)) {
  console.log('\n📋 Database Setup:');
  console.log('   SQL setup file: ✓ Found');
  console.log('   Next: Run this script in your Supabase SQL Editor');
} else {
  console.log('\n❌ supabase-setup.sql file not found');
}

// Check package.json dependencies
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const hasSupabase = packageContent.dependencies && packageContent.dependencies['@supabase/supabase-js'];
  
  console.log('\n📦 Dependencies:');
  console.log(`   @supabase/supabase-js: ${hasSupabase ? '✓ Installed' : '❌ Missing'}`);
  
  if (!hasSupabase) {
    console.log('   Run: npm install @supabase/supabase-js');
  }
}

console.log('\n🚀 Ready to start? Run: npm run dev');
console.log('📚 Need help? Check SETUP_GUIDE.md for detailed instructions');