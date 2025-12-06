require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Institution = require('./models/Institution');
const Notification = require('./models/Notification');

const testSriKrishnaRegistration = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association');
    console.log('Connected to MongoDB');
    
    // Find the Sri Krishna institution
    const institution = await Institution.findOne({
      name: { $regex: /sri krishna/i }
    });
    
    if (!institution) {
      console.log('Sri Krishna institution not found');
      process.exit(1);
    }
    
    console.log(`Using institution: ${institution.name}`);
    
    // Create a test alumni from Sri Krishna College of Engineering
    const alumniData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test.user@skcet.ac.in',
      password: 'Password123',
      userType: 'alumni',
      collegeName: 'Sri Krishna College of Engineering',
      rollNumber: 'SKCET12345',
      department: 'Computer Science',
      graduationYear: 2021,
      currentPosition: 'Software Developer',
      company: 'Tech Solutions',
      location: 'Coimbatore',
      institutionId: institution._id,
      status: 'pending'
    };
    
    const alumni = new User(alumniData);
    await alumni.save();
    
    console.log('Test alumni registered successfully:', alumni.fullName);
    
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

testSriKrishnaRegistration();