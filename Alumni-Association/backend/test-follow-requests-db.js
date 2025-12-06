// Test script to check follow requests in the database
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config();

// MongoDB connection - using the same connection string as create-test-user.js
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association';

async function testFollowRequests() {
  try {
    console.log('Connecting to MongoDB with URI:', mongoURI);
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
    
    // Import the Follow model
    const Follow = require('./models/Follow');
    const User = require('./models/User');
    
    // Find all follow requests
    const followRequests = await Follow.find({ status: 'pending' });
    console.log('Found', followRequests.length, 'pending follow requests');
    
    for (let i = 0; i < followRequests.length; i++) {
      const request = followRequests[i];
      console.log(`\nFollow Request ${i + 1}:`);
      console.log('  ID:', request._id.toString());
      console.log('  Follower ID:', request.followerId.toString());
      console.log('  Following ID:', request.followingId.toString());
      console.log('  Status:', request.status);
      console.log('  Created At:', request.createdAt);
      
      // Check if follower exists
      const follower = await User.findById(request.followerId);
      console.log('  Follower exists:', !!follower);
      if (follower) {
        console.log('  Follower name:', follower.firstName, follower.lastName);
        console.log('  Follower type:', follower.userType);
        console.log('  Follower status:', follower.status);
      }
      
      // Check if following exists
      const following = await User.findById(request.followingId);
      console.log('  Following exists:', !!following);
      if (following) {
        console.log('  Following name:', following.firstName, following.lastName);
        console.log('  Following type:', following.userType);
        console.log('  Following status:', following.status);
      }
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Test error:', error);
    if (mongoose.connection.readyState === 1) {
      mongoose.connection.close();
    }
  }
}

testFollowRequests();