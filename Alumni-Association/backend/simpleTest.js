const nodemailer = require('nodemailer');

// Use the credentials directly without dotenv
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'devadevadeva2006@gmail.com',
    pass: 'wwvmjdhrckbifkxl'
  }
});

async function testConnection() {
  try {
    console.log('Testing SMTP connection...');
    await transporter.verify();
    console.log('✓ Connection successful!');
    
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: '"Alumni Association" <devadevadeva2006@gmail.com>',
      to: 'devadevadeva2006@gmail.com',
      subject: 'Test Email - OTP Verification',
      text: 'This is a test email to check if SMTP works!'
    });
    
    console.log('✓ Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('✗ Error:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.response) {
      console.error('Error response:', error.response);
    }
  }
}

testConnection();