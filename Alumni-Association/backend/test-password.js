require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association';

async function testPassword() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✓ Connected to MongoDB');
    
    // Import the User model
    const User = require('./models/User');
    
    // Find the test user
    const user = await User.findOne({ email: 'test.alumni@gmail.com' });
    
    if (!user) {
      console.log('✗ Test user not found');
      return;
    }
    
    console.log('✓ Found test user:');
    console.log(`  Name: ${user.firstName} ${user.lastName}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Status: ${user.status}`);
    console.log(`  Hashed Password: ${user.password}`);
    
    // Test password comparison
    const testPassword = 'Test1234!';
    console.log(`\nTesting password: "${testPassword}"`);
    
    const isMatch = await user.comparePassword(testPassword);
    console.log(`Password match: ${isMatch}`);
    
    // Test with wrong password
    const wrongPassword = 'wrongpassword';
    console.log(`\nTesting wrong password: "${wrongPassword}"`);
    
    const isWrongMatch = await user.comparePassword(wrongPassword);
    console.log(`Wrong password match: ${isWrongMatch}`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error testing password:', error);
    mongoose.connection.close();
  }
}

testPassword();