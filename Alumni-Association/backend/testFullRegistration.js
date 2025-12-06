require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');

async function testFullRegistration() {
  try {
    console.log('Testing full registration flow...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
    
    // Simulate a registration request
    const registrationData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test.full.registration@example.com',
      password: 'TestPassword123',
      userType: 'alumni',
      collegeName: 'Test College',
      rollNumber: 'TEST001',
      department: 'Computer Science',
      graduationYear: 2020,
      phone: '1234567890'
    };
    
    console.log('Registration data:', registrationData);
    
    // Make a request to the actual registration endpoint
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
    }
    
    // Close database connection
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error testing full registration:', error);
  }
}

testFullRegistration();