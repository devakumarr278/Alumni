require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Follow = require('./models/Follow');

async function checkFollowRequestId(requestId) {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association');
    console.log('✓ Connected to MongoDB');
    
    console.log('Checking if ID exists as a follow request:', requestId);
    const followRequest = await Follow.findById(requestId);
    if (followRequest) {
      console.log('✓ Found follow request:');
      console.log(`  ID: ${followRequest._id}`);
      console.log(`  Follower ID: ${followRequest.followerId}`);
      console.log(`  Following ID: ${followRequest.followingId}`);
      console.log(`  Status: ${followRequest.status}`);
    } else {
      console.log('✗ No follow request found with ID:', requestId);
      
      // Let's also check all follow requests to see what's in the database
      console.log('Checking all follow requests in database...');
      const allRequests = await Follow.find({});
      console.log(`Found ${allRequests.length} follow requests:`);
      allRequests.forEach(req => {
        console.log(`  ID: ${req._id}, Follower: ${req.followerId}, Following: ${req.followingId}, Status: ${req.status}`);
      });
    }
    
    mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Check the reference ID from the error logs
checkFollowRequestId('68fe334d828b41f1e7900481');