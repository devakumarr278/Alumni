require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Notification = require('./models/Notification');

async function testNotifications() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association');
    console.log('✓ Connected to MongoDB');
    
    console.log('Fetching all notifications...');
    const notifications = await Notification.find({}).sort({ createdAt: -1 });
    console.log(`Found ${notifications.length} notifications`);
    
    notifications.forEach((notification, index) => {
      console.log(`Notification ${index + 1}:`);
      console.log(`  ID: ${notification._id}`);
      console.log(`  User ID: ${notification.userId}`);
      console.log(`  Type: ${notification.type}`);
      console.log(`  Reference ID: ${notification.referenceId}`);
      console.log(`  Title: ${notification.title}`);
      console.log(`  Message: ${notification.message}`);
      console.log(`  Created At: ${notification.createdAt}`);
      console.log('---');
    });
    
    mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testNotifications();