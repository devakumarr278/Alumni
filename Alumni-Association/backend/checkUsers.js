require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUsers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association');
    console.log('✓ Connected to MongoDB');
    
    // Check the alumni user
    console.log('Checking alumni user with ID: 68f219e4bcda074ebf6ffe05');
    const alumniUser = await User.findById('68f219e4bcda074ebf6ffe05');
    if (alumniUser) {
      console.log('✓ Found alumni user:');
      console.log(`  ID: ${alumniUser._id}`);
      console.log(`  Name: ${alumniUser.firstName} ${alumniUser.lastName}`);
      console.log(`  Email: ${alumniUser.email}`);
      console.log(`  User Type: ${alumniUser.userType}`);
      console.log(`  Status: ${alumniUser.status}`);
    } else {
      console.log('✗ No user found with ID: 68f219e4bcda074ebf6ffe05');
    }
    
    // Check the follower user
    console.log('\nChecking follower user with ID: 68fe334d828b41f1e7900481');
    const followerUser = await User.findById('68fe334d828b41f1e7900481');
    if (followerUser) {
      console.log('✓ Found follower user:');
      console.log(`  ID: ${followerUser._id}`);
      console.log(`  Name: ${followerUser.firstName} ${followerUser.lastName}`);
      console.log(`  Email: ${followerUser.email}`);
      console.log(`  User Type: ${followerUser.userType}`);
      console.log(`  Status: ${followerUser.status}`);
    } else {
      console.log('✗ No user found with ID: 68fe334d828b41f1e7900481');
    }
    
    mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUsers();