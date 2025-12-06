// Test script to create a follow request for testing
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config();

// MongoDB connection - using the same connection string as create-test-user.js
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association';

async function createTestFollowRequest() {
  try {
    console.log('Connecting to MongoDB with URI:', mongoURI);
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
    
    // Import the Follow model
    const Follow = require('./models/Follow');
    const User = require('./models/User');
    
    // Find an alumni user
    const alumni = await User.findOne({ userType: 'alumni', status: 'approved' });
    if (!alumni) {
      console.log('No approved alumni found');
      return;
    }
    console.log('Found alumni:', alumni.firstName, alumni.lastName, alumni._id.toString());
    
    // Find a student user
    const student = await User.findOne({ userType: 'student', status: 'approved' });
    if (!student) {
      console.log('No approved student found');
      return;
    }
    console.log('Found student:', student.firstName, student.lastName, student._id.toString());
    
    // Check if a follow request already exists
    const existingRequest = await Follow.findOne({
      followerId: student._id,
      followingId: alumni._id
    });
    
    if (existingRequest) {
      console.log('Follow request already exists:', existingRequest._id.toString());
      await Follow.deleteOne({ _id: existingRequest._id });
      console.log('Deleted existing follow request');
    }
    
    // Create a new follow request
    const followRequest = new Follow({
      followerId: student._id,
      followingId: alumni._id,
      status: 'pending'
    });
    
    await followRequest.save();
    console.log('Created follow request:', followRequest._id.toString());
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Test error:', error);
    if (mongoose.connection.readyState === 1) {
      mongoose.connection.close();
    }
  }
}

createTestFollowRequest();