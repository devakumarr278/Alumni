// Test script to check users in the database
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config();

// MongoDB connection - using the same connection string as create-test-user.js
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association';

async function testUsers() {
  try {
    console.log('Connecting to MongoDB with URI:', mongoURI);
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
    
    // Import the User model
    const User = require('./models/User');
    
    // Find all alumni
    const allAlumni = await User.find({ userType: 'alumni' });
    console.log('Found', allAlumni.length, 'total alumni');
    
    if (allAlumni.length > 0) {
      console.log('First alumni:', allAlumni[0]);
      console.log('First alumni status:', allAlumni[0].status);
      console.log('First alumni ID:', allAlumni[0]._id.toString());
      
      // Try to find by ID
      const alumniById = await User.findById(allAlumni[0]._id);
      console.log('Found by ID:', alumniById ? 'Yes' : 'No');
      
      if (alumniById) {
        console.log('Alumni by ID:', alumniById);
      }
    }
    
    // Find all users with follow requests
    const usersWithFollowRequests = await User.find({ 
      userType: 'alumni',
      followers: { $exists: true, $ne: [] }
    });
    console.log('Users with follow requests:', usersWithFollowRequests.length);
    
    // Check all users
    const allUsers = await User.find({});
    console.log('Total users in database:', allUsers.length);
    
    if (allUsers.length > 0) {
      console.log('First user:', allUsers[0]);
      console.log('First user type:', allUsers[0].userType);
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Test error:', error);
    if (mongoose.connection.readyState === 1) {
      mongoose.connection.close();
    }
  }
}

testUsers();