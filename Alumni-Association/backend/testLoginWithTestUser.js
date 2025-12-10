// Use the built-in fetch in Node.js (version 18+)
// If using older Node.js versions, uncomment the next line:
// const fetch = require('node-fetch');

async function testLogin() {
  try {
    console.log('Testing login with test user...');
    
    const response = await fetch('http://localhost:5003/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test.alumni@gmail.com',
        password: 'Test1234!',
      }),
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error testing login:', error);
  }
}

testLogin();