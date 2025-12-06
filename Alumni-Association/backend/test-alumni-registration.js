const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Institution = require('./models/Institution');
const Notification = require('./models/Notification');

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Test alumni registration
const testAlumniRegistration = async () => {
  try {
    await connectDB();
    
    // Get the first institution
    const institution = await Institution.findOne();
    if (!institution) {
      console.log('No institutions found. Please run the add-mock-institutions script first.');
      process.exit(1);
    }
    
    console.log('Using institution:', institution.name);
    
    // Create a test alumni
    const alumniData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'Password123',
      userType: 'alumni',
      collegeName: 'IIT Bombay',
      rollNumber: 'IITB12345',
      department: 'Computer Science',
      graduationYear: 2020,
      currentPosition: 'Software Engineer',
      company: 'Tech Corp',
      location: 'Bangalore',
      institutionId: institution._id
    };
    
    const alumni = new User(alumniData);
    await alumni.save();
    
    console.log('Alumni registered successfully:', alumni.fullName);
    
    // Create notification
    const notification = await Notification.create({
      institutionId: institution._id,
      type: 'alumni_pending_verification',
      message: `New alumni ${alumni.firstName} ${alumni.lastName} awaiting verification.`,
      userRef: alumni._id
    });
    
    console.log('Notification created:', notification.message);
    
    // Test fetching pending alumni for institution
    const pendingAlumni = await User.find({ 
      userType: 'alumni', 
      status: 'pending',
      institutionId: institution._id
    }).select('-password');
    
    console.log(`Found ${pendingAlumni.length} pending alumni for institution`);
    
    // Test fetching notifications for institution
    const notifications = await Notification.find({ 
      institutionId: institution._id 
    }).sort({ createdAt: -1 });
    
    console.log(`Found ${notifications.length} notifications for institution`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error in test:', error);
    process.exit(1);
  }
};

// Run the test
testAlumniRegistration();