require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const emailService = require('./services/emailService');

async function testRegistrationEmail() {
  try {
    console.log('Testing registration email flow...');
    
    // Simulate user data like in the registration process
    const userData = {
      email: 'test.registration@example.com',
      userType: 'alumni',
      fullName: 'Test Registration User'
    };
    
    // Generate a test token and code like in the registration process
    const crypto = require('crypto');
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    console.log('Sending verification email...');
    console.log('Email:', userData.email);
    console.log('User Type:', userData.userType);
    console.log('Full Name:', userData.fullName);
    console.log('Token:', verificationToken);
    console.log('Code:', verificationCode);
    
    // Send verification email like in the registration process
    const emailResult = await emailService.sendVerificationEmail(
      userData.email,
      userData.userType,
      verificationToken,
      userData.fullName,
      verificationCode
    );
    
    console.log('Email result:', emailResult);
    
    if (emailResult.success) {
      console.log('✅ Registration email would be sent successfully');
      console.log('Message ID:', emailResult.messageId);
    } else {
      console.log('❌ Registration email failed:', emailResult.error);
    }
  } catch (error) {
    console.error('Error testing registration email:', error);
  }
}

testRegistrationEmail();