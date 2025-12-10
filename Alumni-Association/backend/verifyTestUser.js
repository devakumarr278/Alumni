const mongoose = require('mongoose');
const User = require('./models/User');

// Load environment variables
require('dotenv').config({ path: __dirname + '/.env' });

async function verifyTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association');
    console.log('✅ Connected to MongoDB');
    
    // Find the test user
    const testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      console.log('❌ Test user not found');
      mongoose.connection.close();
      return;
    }
    
    console.log(`Found test user: ${testUser.firstName} ${testUser.lastName}`);
    console.log(`Email verified status: ${testUser.isEmailVerified}`);
    
    // Verify the email
    testUser.isEmailVerified = true;
    testUser.emailVerificationToken = undefined;
    testUser.emailVerificationExpires = undefined;
    await testUser.save();
    
    console.log('✅ Test user email verified successfully');
    
    // Also verify the test student
    const testStudent = await User.findOne({ email: 'test.student@skcet.ac.in' });
    if (testStudent) {
      testStudent.isEmailVerified = true;
      testStudent.emailVerificationToken = undefined;
      testStudent.emailVerificationExpires = undefined;
      await testStudent.save();
      console.log('✅ Test student email verified successfully');
    }
    
    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error verifying test user:', error);
    process.exit(1);
  }
}

verifyTestUser();