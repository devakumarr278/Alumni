const { default: fetch } = require('node-fetch');

async function testLogin() {
  try {
    const response = await fetch('http://localhost:5003/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: '727724eucy015@skcet.ac.in',
        password: 'Deva@1234',
        role: 'student'
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('Login successful!');
      console.log('Token:', data.token);
      console.log('User data:', data.data);
    } else {
      console.log('Login failed!');
      console.log('Error message:', data.message);
    }
  } catch (error) {
    console.error('Error during login test:', error);
  }
}

testLogin();