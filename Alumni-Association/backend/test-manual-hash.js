require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association';

async function testManualHash() {
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
    
    // Manually hash the expected password
    const expectedPassword = 'test123';
    console.log(`\nExpected password: "${expectedPassword}"`);
    
    // Hash it with the same salt rounds
    const salt = await bcrypt.genSalt(12);
    const manualHash = await bcrypt.hash(expectedPassword, salt);
    console.log(`Manually hashed password: ${manualHash}`);
    
    // Compare with stored hash
    const isMatch = await bcrypt.compare(expectedPassword, user.password);
    console.log(`Direct bcrypt comparison: ${isMatch}`);
    
    // Try comparing with different salt rounds
    const salt10 = await bcrypt.genSalt(10);
    const manualHash10 = await bcrypt.hash(expectedPassword, salt10);
    console.log(`\nWith salt rounds 10: ${manualHash10}`);
    const isMatch10 = await bcrypt.compare(expectedPassword, manualHash10);
    console.log(`Comparison with salt 10: ${isMatch10}`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error testing manual hash:', error);
    mongoose.connection.close();
  }
}

testManualHash();