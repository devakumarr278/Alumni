require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association';

async function checkTestUsers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✓ Connected to MongoDB');
    
    // Import the User model
    const User = require('./models/User');
    
    // Check for test users
    console.log('\nChecking for test users...');
    
    // Look for the test users we created
    const testUsers = await User.find({
      $or: [
        { email: 'test.alumni@gmail.com' },
        { email: 'test.student@skcet.ac.in' }
      ]
    });
    
    if (testUsers.length > 0) {
      console.log(`✓ Found ${testUsers.length} test user(s):`);
      testUsers.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.firstName} ${user.lastName}`);
        console.log(`     Email: ${user.email}`);
        console.log(`     User Type: ${user.userType}`);
        console.log(`     Status: ${user.status}`);
        console.log(`     ID: ${user._id}`);
        console.log('');
      });
    } else {
      console.log('✗ No test users found');
    }
    
    // Check for any alumni users
    const alumniUsers = await User.find({ userType: 'alumni' }).limit(5);
    if (alumniUsers.length > 0) {
      console.log(`\nFound ${alumniUsers.length} alumni user(s) (showing up to 5):`);
      alumniUsers.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.firstName} ${user.lastName}`);
        console.log(`     Email: ${user.email}`);
        console.log(`     User Type: ${user.userType}`);
        console.log(`     Status: ${user.status}`);
        console.log(`     ID: ${user._id}`);
        console.log('');
      });
    } else {
      console.log('\nNo alumni users found');
    }
    
    // Check for any student users
    const studentUsers = await User.find({ userType: 'student' }).limit(5);
    if (studentUsers.length > 0) {
      console.log(`\nFound ${studentUsers.length} student user(s) (showing up to 5):`);
      studentUsers.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.firstName} ${user.lastName}`);
        console.log(`     Email: ${user.email}`);
        console.log(`     User Type: ${user.userType}`);
        console.log(`     Status: ${user.status}`);
        console.log(`     ID: ${user._id}`);
        console.log('');
      });
    } else {
      console.log('\nNo student users found');
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error checking test users:', error);
    mongoose.connection.close();
  }
}

checkTestUsers();