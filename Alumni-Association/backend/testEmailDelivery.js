require('dotenv').config({ path: __dirname + '/.env' });
const emailService = require('./services/emailService');

async function testEmailDelivery() {
  try {
    console.log('Testing email delivery...');
    
    // Test different types of emails
    console.log('\n1. Testing verification email...');
    const verificationResult = await emailService.sendVerificationEmail(
      process.env.ADMIN_EMAIL,
      'alumni',
      'test-token-123456',
      'Test User',
      '123456'
    );
    
    console.log('Verification email result:', verificationResult);
    
    console.log('\n2. Testing password reset email...');
    const resetResult = await emailService.sendPasswordResetEmail(
      process.env.ADMIN_EMAIL,
      'reset-token-789012',
      'Test User'
    );
    
    console.log('Password reset email result:', resetResult);
    
    console.log('\n3. Testing welcome email...');
    const welcomeResult = await emailService.sendWelcomeEmail(
      process.env.ADMIN_EMAIL,
      'Test User',
      'alumni'
    );
    
    console.log('Welcome email result:', welcomeResult);
    
    // Summary
    const results = [verificationResult, resetResult, welcomeResult];
    const successCount = results.filter(r => r.success).length;
    
    console.log(`\n--- SUMMARY ---`);
    console.log(`Successful deliveries: ${successCount}/${results.length}`);
    
    if (successCount === results.length) {
      console.log('✅ All email tests passed - service is working');
      console.log('💡 If you are not receiving emails, check:');
      console.log('   - Spam/Junk folder');
      console.log('   - Gmail App Password configuration');
      console.log('   - Email provider filtering rules');
    } else {
      console.log('❌ Some email tests failed - check the errors above');
    }
    
  } catch (error) {
    console.error('Error testing email delivery:', error);
  }
}

// Run the test
testEmailDelivery();