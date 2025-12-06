const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association';

async function checkDatabase() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');
    
    // Define a simple user schema to check the data
    const userSchema = new mongoose.Schema({
      firstName: String,
      lastName: String,
      email: String,
      userType: String,
      status: String,
      collegeName: String,
      rollNumber: String,
      department: String,
      graduationYear: Number
    }, { timestamps: true });
    
    const User = mongoose.model('User', userSchema);
    
    // Check if there are any users in the database
    const userCount = await User.countDocuments();
    console.log(`Found ${userCount} users in the database\n`);
    
    // Show all alumni users with their status
    const alumniUsers = await User.find({ userType: 'alumni' }).select('firstName lastName email status collegeName department graduationYear');
    
    if (alumniUsers.length > 0) {
      console.log('Alumni users in database:');
      alumniUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Status: ${user.status}`);
        console.log(`   College: ${user.collegeName}`);
        console.log(`   Department: ${user.department}`);
        console.log(`   Graduation Year: ${user.graduationYear}`);
        console.log('');
      });
    } else {
      console.log('No alumni users found in database');
    }
    
    // Show all pending users
    const pendingUsers = await User.find({ status: 'pending' }).select('firstName lastName email userType status createdAt');
    
    if (pendingUsers.length > 0) {
      console.log('Pending users awaiting approval:');
      pendingUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.userType})`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Registered: ${user.createdAt}`);
        console.log('');
      });
    } else {
      console.log('No pending users found');
    }
    
    // Close connection
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error checking database:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  }
}

// Run the database check
checkDatabase();