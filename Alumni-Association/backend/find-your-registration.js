require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const findYourRegistration = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association');
    console.log('Connected to MongoDB');
    
    // Look for users from Sri Krishna College of Engineering
    const skcetUsers = await User.find({ 
      collegeName: { $regex: /sri krishna/i } 
    });
    
    console.log('Users from Sri Krishna College of Engineering:');
    if (skcetUsers.length === 0) {
      console.log('No users found from Sri Krishna College of Engineering');
      
      // Let's check all alumni users to see if we can find a match
      const allAlumni = await User.find({ userType: 'alumni' });
      console.log('\nAll alumni users:');
      allAlumni.forEach(user => {
        console.log(`- ${user.firstName} ${user.lastName} from ${user.collegeName} (${user.email})`);
        console.log(`  Status: ${user.status}`);
        console.log(`  Institution ID: ${user.institutionId}`);
      });
    } else {
      skcetUsers.forEach(user => {
        console.log(`- ${user.firstName} ${user.lastName} (${user.email})`);
        console.log(`  Status: ${user.status}`);
        console.log(`  Institution ID: ${user.institutionId}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

findYourRegistration();