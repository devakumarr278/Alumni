const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'devadevadeva2006@gmail.com',
    pass: 'drobudryviaycgoq' // App Password
  }
});

transporter.verify((err, success) => {
  if (err) console.log('SMTP Error:', err);
  else console.log('SMTP is ready:', success);
});