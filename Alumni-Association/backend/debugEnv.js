const fs = require('fs');
const path = require('path');

console.log('Current working directory:', process.cwd());
console.log('Env file path:', path.join(__dirname, '.env'));

// Check if .env file exists
if (fs.existsSync(path.join(__dirname, '.env'))) {
  console.log('.env file exists');
  
  // Read the file content
  const content = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  console.log('.env file content:');
  console.log(content);
  
  // Try to parse it manually
  const lines = content.split('\n');
  console.log('Lines in .env file:');
  lines.forEach((line, index) => {
    console.log(`${index}: ${line}`);
  });
} else {
  console.log('.env file does not exist');
}

// Try to load dotenv
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('After dotenv config:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
console.log('EMAIL_USER:', process.env.EMAIL_USER);