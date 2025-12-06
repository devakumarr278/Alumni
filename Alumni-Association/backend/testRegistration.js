const fetch = require('node-fetch');

async function testRegistration() {
  try {
    console.log('Testing registration...');
    
    const registrationData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test.user@gmail.com',
      password: 'TestPass123',
      userType: 'alumni',
      collegeName: 'Test College',
      rollNumber: 'TEST123',
      department: 'Computer Science',
      graduationYear: 2020
    };
    
    console.log('Sending registration data:', registrationData);
    
    const response = await fetch('http://localhost:49669/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    });
    
    const result = await response.json();
    console.log('Registration response:', result);
    
    if (result.success) {
      console.log('✅ Registration successful');
    } else {
      console.log('❌ Registration failed:', result.message);
      if (result.errors) {
        console.log('Validation errors:', result.errors);
      }
    }
  } catch (error) {
    console.error('Error testing registration:', error);
  }
}

testRegistration();