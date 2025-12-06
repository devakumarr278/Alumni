const nodemailer = require('nodemailer');
require('dotenv').config({ path: __dirname + '/.env' });

console.log('Environment variables:');
console.log('- EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
console.log('- EMAIL_USER:', process.env.EMAIL_USER);
console.log('- EMAIL_PASS:', process.env.EMAIL_PASS ? '[SET - ' + process.env.EMAIL_PASS.length + ' characters]' : '[NOT SET]');
console.log('- EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('- EMAIL_PORT:', process.env.EMAIL_PORT);

async function sendTestEmail() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Please set EMAIL_USER and EMAIL_PASS in your .env file');
    return;
  }

  console.log('\nCreating transporter with configuration:');
  const transporterConfig = {
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  };
  
  console.log('Transporter config:', JSON.stringify(transporterConfig, null, 2));

  const transporter = nodemailer.createTransport(transporterConfig);

  try {
    console.log('\nVerifying SMTP connection...');
    await transporter.verify();
    console.log('✓ SMTP connection verified successfully');

    console.log('\nSending test email...');
    const info = await transporter.sendMail({
      from: `"Alumni Association" <${process.env.EMAIL_USER}>`,
      to: process.env.TEST_EMAIL || process.env.EMAIL_USER,
      subject: 'Test Email - OTP Verification',
      text: 'This is a test email to check if SMTP works!',
      html: '<h1>Test Email</h1><p>This is a test email to check if SMTP works!</p>'
    });

    console.log('✓ Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('✗ Error sending test email:', error);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.response) {
      console.error('Error response:', error.response);
    }
    if (error.responseCode) {
      console.error('Error response code:', error.responseCode);
    }
  }
}

sendTestEmail().catch(console.error);