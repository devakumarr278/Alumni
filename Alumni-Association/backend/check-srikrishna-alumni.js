require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Institution = require('./models/Institution');

const checkSriKrishnaAlumni = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association');
    console.log('Connected to MongoDB');
    
    // Find all alumni from colleges with "Sri Krishna" in the name
    const sriKrishnaAlumni = await User.find({ 
      userType: 'alumni',
      collegeName: { $regex: /sri krishna/i }
    });
    
    console.log(`Found ${sriKrishnaAlumni.length} alumni from Sri Krishna colleges:`);
    
    for (const alumni of sriKrishnaAlumni) {
      console.log(`- ${alumni.firstName} ${alumni.lastName} (${alumni.email})`);
      console.log(`  College: ${alumni.collegeName}`);
      console.log(`  Status: ${alumni.status}`);
      console.log(`  Institution ID: ${alumni.institutionId}`);
      
      if (alumni.institutionId) {
        const institution = await Institution.findById(alumni.institutionId);
        if (institution) {
          console.log(`  Linked Institution: ${institution.name}`);
        } else {
          console.log(`  Linked Institution: NOT FOUND`);
        }
      } else {
        console.log(`  Linked Institution: NONE`);
      }
      console.log('');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkSriKrishnaAlumni();