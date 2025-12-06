const fs = require('fs');

const envContent = `EMAIL_SERVICE=gmail
EMAIL_USER=devadevadeva2006@gmail.com
EMAIL_PASS=wwvmjdhrckbifkxl
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587`;

fs.writeFileSync('.env', envContent, 'utf8');
console.log('.env file created successfully');