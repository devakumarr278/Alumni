const http = require('http');

const data = JSON.stringify({
  message: 'I need help with my resume for software engineering positions.'
});

const options = {
  hostname: 'localhost',
  port: 5003,
  path: '/api/analyze/analyze',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  console.log(`Status Code: ${res.statusCode}`);
  
  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error('Error:', error);
});

req.write(data);
req.end();