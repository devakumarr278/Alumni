const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Load environment variables
require('dotenv').config({ path: __dirname + '/.env' });

async function resetUserPassword() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association');
    console.log('✅ Connected to MongoDB');
    
    // Find the user
    const user = await User.findOne({ email: 'devadevadeva2006@gmail.com' });
    if (!user) {
      console.log('❌ User not found');
      mongoose.connection.close();
      return;
    }
    
    console.log(`Found user: ${user.firstName} ${user.lastName}`);
    console.log(`Email: ${user.email}`);
    console.log(`Current password hash: ${user.password.substring(0, 20)}...`);
    
    // Reset the password
    const newPassword = 'Test1234!';
    user.password = newPassword; // Let the model hash this
    await user.save();
    
    console.log('✅ User password reset successfully');
    console.log(`New password: ${newPassword}`);
    
    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error resetting user password:', error);
    process.exit(1);
  }
}

resetUserPassword();