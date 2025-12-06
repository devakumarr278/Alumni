require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Institution = require('./models/Institution');
const Notification = require('./models/Notification');

const fixAlumniInstitutionLinks = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association');
    console.log('Connected to MongoDB');
    
    // Find all alumni without institutionId
    const alumniWithoutInstitution = await User.find({ 
      userType: 'alumni',
      institutionId: { $exists: false }
    });
    
    console.log(`Found ${alumniWithoutInstitution.length} alumni without institution links`);
    
    for (const alumni of alumniWithoutInstitution) {
      console.log(`Processing ${alumni.firstName} ${alumni.lastName} from ${alumni.collegeName}`);
      
      // Try to find an institution that matches the college name
      const institution = await Institution.findOne({
        $or: [
          { name: { $regex: alumni.collegeName, $options: 'i' } },
          { name: { $regex: alumni.collegeName.split(' ')[0], $options: 'i' } }
        ]
      });
      
      if (institution) {
        // Update the alumni with the institutionId
        alumni.institutionId = institution._id;
        await alumni.save();
        console.log(`  Linked to institution: ${institution.name}`);
        
        // Create notification for the institution
        const notification = await Notification.create({
          institutionId: institution._id,
          type: 'alumni_pending_verification',
          message: `New alumni ${alumni.firstName} ${alumni.lastName} awaiting verification.`,
          userRef: alumni._id
        });
        console.log(`  Created notification: ${notification.message}`);
      } else {
        // If no exact match, assign to the first available institution as fallback
        const fallbackInstitution = await Institution.findOne();
        if (fallbackInstitution) {
          alumni.institutionId = fallbackInstitution._id;
          await alumni.save();
          console.log(`  Linked to fallback institution: ${fallbackInstitution.name}`);
          
          // Create notification for the institution
          const notification = await Notification.create({
            institutionId: fallbackInstitution._id,
            type: 'alumni_pending_verification',
            message: `New alumni ${alumni.firstName} ${alumni.lastName} awaiting verification.`,
            userRef: alumni._id
          });
          console.log(`  Created notification: ${notification.message}`);
        } else {
          console.log(`  No institutions available for linking`);
        }
      }
    }
    
    console.log('Finished processing alumni institution links');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixAlumniInstitutionLinks();