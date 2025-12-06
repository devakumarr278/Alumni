// Test script to check alumni profile endpoint
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config();

// MongoDB connection - using the same connection string as create-test-user.js
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association';

async function testAlumniEndpoint() {
  try {
    console.log('Connecting to MongoDB with URI:', mongoURI);
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
    
    // Import the User model
    const User = require('./models/User');
    
    // Find an approved alumni
    const alumni = await User.findOne({ userType: 'alumni', status: 'approved' });
    if (!alumni) {
      console.log('No approved alumni found');
      return;
    }
    
    console.log('Found alumni with ID:', alumni._id.toString());
    
    // Test the alumni profile endpoint logic
    const alumniProfile = await User.findOne({
      _id: alumni._id,
      userType: 'alumni',
      status: 'approved'
    }).select('-password -emailVerificationToken -resetPasswordToken -loginAttempts -lockUntil');
    
    if (!alumniProfile) {
      console.log('Alumni profile not found');
      return;
    }
    
    console.log('Alumni profile found:', alumniProfile.firstName, alumniProfile.lastName);
    console.log('Profile visibility:', alumniProfile.profileVisibility);
    
    // Check visibility permissions
    if (alumniProfile.profileVisibility === 'private') {
      console.log('This profile is private');
      return;
    }
    
    // Allow students to view alumni profiles as well
    // For this test, we'll assume the user is an alumni
    if (alumniProfile.profileVisibility === 'alumni-only') {
      console.log('This profile is visible to alumni and students only');
    }
    
    // Calculate total years of experience
    let totalExperience = 0;
    if (alumniProfile.experiences && Array.isArray(alumniProfile.experiences)) {
      totalExperience = alumniProfile.experiences.reduce((sum, exp) => {
        return sum + (parseInt(exp.experience) || 0);
      }, 0);
    }
    
    // Find current experience
    let currentExperience = null;
    if (alumniProfile.experiences && Array.isArray(alumniProfile.experiences)) {
      currentExperience = alumniProfile.experiences.find(exp => exp.isCurrent) || 
                        (alumniProfile.experiences.length > 0 ? alumniProfile.experiences[0] : null);
    }
    
    // Prepare the response data
    const profileData = {
      id: alumniProfile._id,
      firstName: alumniProfile.firstName,
      lastName: alumniProfile.lastName,
      name: `${alumniProfile.firstName} ${alumniProfile.lastName}`,
      email: alumniProfile.email,
      phone: alumniProfile.phone,
      profileImage: alumniProfile.profilePicture,
      graduationYear: alumniProfile.graduationYear,
      department: alumniProfile.department,
      major: alumniProfile.department || 'N/A',
      currentPosition: currentExperience?.role || alumniProfile.currentPosition || 'N/A',
      currentCompany: currentExperience?.company || alumniProfile.company || 'N/A',
      location: currentExperience?.location || alumniProfile.location || 'N/A',
      bio: alumniProfile.bio,
      linkedinProfile: alumniProfile.linkedinProfile,
      isVerified: alumniProfile.status === 'approved',
      experiences: alumniProfile.experiences || [],
      skills: alumniProfile.skills || [],
      totalExperience: totalExperience,
      profileVisibility: alumniProfile.profileVisibility,
      mentorship: {
        availability: alumniProfile.mentorship?.availability || [],
        public: alumniProfile.mentorship?.public || false
      },
      badges: alumniProfile.badges || []
    };
    
    console.log('Profile data prepared successfully:', profileData);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Test error:', error);
    if (mongoose.connection.readyState === 1) {
      mongoose.connection.close();
    }
  }
}

testAlumniEndpoint();