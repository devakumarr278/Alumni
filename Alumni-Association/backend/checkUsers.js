const mongoose = require('mongoose');
const User = require('./models/User');

// Load environment variables
require('dotenv').config({ path: __dirname + '/.env' });

async function checkUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association');
    console.log('✅ Connected to MongoDB');
    
    // Find all users
    const users = await User.find({});
    console.log(`Found ${users.length} users:`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
      console.log(`   - ID: ${user._id}`);
      console.log(`   - Type: ${user.userType}`);
      console.log(`   - Status: ${user.status}`);
      console.log(`   - Email Verified: ${user.isEmailVerified}`);
      console.log(`   - Created: ${user.createdAt}`);
      console.log('');
    });
    
    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error checking users:', error);
    process.exit(1);
  }
}

checkUsers();