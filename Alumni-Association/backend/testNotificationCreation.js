require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Follow = require('./models/Follow');
const User = require('./models/User');
const Notification = require('./models/Notification');

async function testNotificationCreation() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association');
    console.log('✓ Connected to MongoDB');
    
    // Create a test follow request
    console.log('Creating test follow request...');
    const followRequest = new Follow({
      followerId: '68fe334d828b41f1e7900481',  // This is the follower ID we saw in the logs
      followingId: '68f219e4bcda074ebf6ffe05',  // This is the following ID we saw in the logs
      status: 'pending'
    });
    
    await followRequest.save();
    console.log('Created follow request with ID:', followRequest._id);
    
    // Get the user details
    console.log('Getting user details...');
    const [follower, following] = await Promise.all([
      User.findById('68fe334d828b41f1e7900481'),
      User.findById('68f219e4bcda074ebf6ffe05')
    ]);
    
    console.log('Follower:', follower ? `${follower.firstName} ${follower.lastName}` : 'Not found');
    console.log('Following:', following ? `${following.firstName} ${following.lastName}` : 'Not found');
    
    if (follower && following) {
      // Create notification manually to see what happens
      console.log('Creating notification manually...');
      const notification = new Notification({
        userId: '68f219e4bcda074ebf6ffe05',
        type: 'follow_request',
        title: 'New Follow Request',
        message: `${follower.firstName} ${follower.lastName} wants to follow you`,
        referenceId: followRequest._id  // Using the correct follow request ID
      });
      
      await notification.save();
      console.log('Created notification with referenceId:', notification.referenceId);
      
      // Check what was actually saved
      const savedNotification = await Notification.findById(notification._id);
      console.log('Retrieved notification referenceId:', savedNotification.referenceId);
    }
    
    // Clean up
    await Follow.findByIdAndDelete(followRequest._id);
    await Notification.deleteMany({ referenceId: followRequest._id });
    
    mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testNotificationCreation();