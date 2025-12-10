const mongoose = require('mongoose');
const User = require('./models/User');

// Load environment variables
require('dotenv').config({ path: __dirname + '/.env' });

async function checkTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association');
    console.log('✅ Connected to MongoDB');
    
    // Find the test user
    const testUser = await User.findOne({ email: 'test.alumni@gmail.com' });
    if (!testUser) {
      console.log('❌ Test user not found');
      mongoose.connection.close();
      return;
    }
    
    console.log(`Found test user: ${testUser.firstName} ${testUser.lastName}`);
    console.log(`Email: ${testUser.email}`);
    console.log(`User Type: ${testUser.userType}`);
    console.log(`Status: ${testUser.status}`);
    console.log(`Email Verified: ${testUser.isEmailVerified}`);
    console.log(`Created: ${testUser.createdAt}`);
    
    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error checking test user:', error);
    process.exit(1);
  }
}

checkTestUser();