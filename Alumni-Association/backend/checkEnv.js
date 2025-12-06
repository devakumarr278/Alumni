const fs = require('fs');
const path = require('path');

// Read .env file directly
const envPath = path.join(__dirname, '.env');
console.log('Reading .env file from:', envPath);

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('.env file content:');
  console.log('===================');
  console.log(envContent);
  console.log('===================');
  
  // Parse the content
  const lines = envContent.split('\n');
  const envVars = {};
  
  lines.forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    }
  });
  
  console.log('\nParsed environment variables:');
  Object.keys(envVars).forEach(key => {
    if (key.includes('PASS')) {
      console.log(`${key}: [HIDDEN - ${envVars[key].length} characters]`);
    } else {
      console.log(`${key}: ${envVars[key]}`);
    }
  });
  
} catch (error) {
  console.error('Error reading .env file:', error.message);
}