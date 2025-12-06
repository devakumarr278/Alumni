require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Follow = require('./models/Follow');

async function testFollowRequests() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association');
    console.log('✓ Connected to MongoDB');
    
    console.log('Fetching all follow requests...');
    const followRequests = await Follow.find({});
    console.log(`Found ${followRequests.length} follow requests`);
    
    followRequests.forEach((request, index) => {
      console.log(`Request ${index + 1}:`);
      console.log(`  ID: ${request._id}`);
      console.log(`  Follower ID: ${request.followerId}`);
      console.log(`  Following ID: ${request.followingId}`);
      console.log(`  Status: ${request.status}`);
      console.log(`  Created At: ${request.createdAt}`);
      console.log('---');
    });
    
    mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testFollowRequests();