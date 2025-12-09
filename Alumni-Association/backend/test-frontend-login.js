const fetch = require('node-fetch').default;

async function testFrontendLogin() {
  try {
    console.log('Testing frontend login...');
    
    const loginData = {
      email: 'test.alumni@gmail.com',
      password: 'test123',
      role: 'alumni'
    };
    
    console.log('Sending login request to:', 'http://localhost:5003/api/auth/login');
    
    const response = await fetch('http://localhost:5003/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('Token:', data.token);
      console.log('User data:', data.data);
    } else {
      console.log('❌ Login failed!');
      console.log('Error message:', data.message);
    }
  } catch (error) {
    console.error('Error during login test:', error);
  }
}

testFrontendLogin();