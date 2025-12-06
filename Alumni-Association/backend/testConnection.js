require('dotenv').config({ path: __dirname + '/.env' });
const emailService = require('./services/emailService');

(async () => {
  console.log('Testing email service connection...');
  const ok = await emailService.verifyConnection();
  console.log('Connection test result:', ok);
  
  if (ok) {
    console.log('✅ Email service is properly configured and connected!');
  } else {
    console.log('❌ Email service connection failed. Please check your configuration.');
  }
})();