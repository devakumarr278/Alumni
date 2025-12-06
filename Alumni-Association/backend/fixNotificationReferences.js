require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Follow = require('./models/Follow');
const Notification = require('./models/Notification');

async function fixNotificationReferences() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association');
    console.log('✓ Connected to MongoDB');
    
    // Get all follow request notifications
    const notifications = await Notification.find({ type: 'follow_request' });
    console.log(`Found ${notifications.length} follow request notifications`);
    
    let fixedCount = 0;
    
    for (const notification of notifications) {
      // Get the follower ID that's currently stored as referenceId
      const followerId = notification.referenceId.toString();
      
      // Find the corresponding follow request
      const followRequest = await Follow.findOne({ 
        followerId: followerId,
        followingId: notification.userId,
        status: 'pending'
      });
      
      if (followRequest) {
        // Update the notification with the correct follow request ID
        notification.referenceId = followRequest._id;
        await notification.save();
        console.log(`✓ Fixed notification ${notification._id}: Updated referenceId from ${followerId} to ${followRequest._id}`);
        fixedCount++;
      } else {
        console.log(`ℹ No matching follow request found for notification ${notification._id} with follower ${followerId}`);
      }
    }
    
    console.log(`\nFixed ${fixedCount} notifications`);
    
    mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixNotificationReferences();