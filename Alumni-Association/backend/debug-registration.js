require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Institution = require('./models/Institution');
const Notification = require('./models/Notification');

const debugRegistration = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association');
    console.log('Connected to MongoDB');
    
    // Check institutions
    const institutions = await Institution.find();
    console.log('Institutions in database:');
    institutions.forEach(inst => {
      console.log(`- ${inst.name} (${inst._id})`);
    });
    
    // Check for alumni users
    const alumniUsers = await User.find({ userType: 'alumni' });
    console.log('\nAlumni users in database:');
    alumniUsers.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} from ${user.collegeName}`);
      console.log(`  Status: ${user.status}`);
      console.log(`  Institution ID: ${user.institutionId}`);
      console.log(`  Email: ${user.email}`);
    });
    
    // Check notifications
    const notifications = await Notification.find();
    console.log('\nNotifications in database:');
    notifications.forEach(notification => {
      console.log(`- ${notification.message} for institution ${notification.institutionId}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

debugRegistration();