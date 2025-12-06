const nodemailer = require('nodemailer');

// Test with direct credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'devadevadeva2006@gmail.com',
    pass: 'wwvmjdhrckbifkxl' // Replace with your actual App Password
  }
});

async function testConnection() {
  try {
    console.log('Testing Gmail connection with direct credentials...');
    await transporter.verify();
    console.log('✅ Connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.response) {
      console.error('Error response:', error.response);
    }
    return false;
  }
}

testConnection();