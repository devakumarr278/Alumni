require('dotenv').config({ path: __dirname + '/.env' });
const emailService = require('./services/emailService');

async function testEmail() {
  try {
    console.log('Testing email service...');
    
    // Wait a bit for the email service to initialize
    setTimeout(async () => {
      const result = await emailService.sendVerificationEmail(
        'test@example.com',
        'alumni',
        'test-token-123456',
        'Test User',
        '123456'
      );
      
      console.log('Email test result:', result);
      
      if (result.success) {
        console.log('✅ Email service is working correctly');
      } else {
        console.log('❌ Email service failed:', result.error);
      }
    }, 2000);
  } catch (error) {
    console.error('Error testing email service:', error);
  }
}

testEmail();