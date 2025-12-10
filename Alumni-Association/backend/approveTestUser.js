const mongoose = require('mongoose');
const User = require('./models/User');

// Load environment variables
require('dotenv').config({ path: __dirname + '/.env' });

async function approveTestUser() {
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
    console.log(`Current status: ${testUser.status}`);
    
    // Approve the user
    testUser.status = 'approved';
    await testUser.save();
    
    console.log('✅ Test user approved successfully');
    
    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error approving test user:', error);
    process.exit(1);
  }
}

approveTestUser();