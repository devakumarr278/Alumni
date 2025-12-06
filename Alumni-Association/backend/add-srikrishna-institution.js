require('dotenv').config();
const mongoose = require('mongoose');
const Institution = require('./models/Institution');

const addSriKrishnaInstitution = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association');
    console.log('Connected to MongoDB');
    
    // Check if institution already exists
    const existingInstitution = await Institution.findOne({
      $or: [
        { name: { $regex: /sri krishna/i } },
        { email: { $regex: /skcet/i } }
      ]
    });
    
    if (existingInstitution) {
      console.log('Institution already exists:');
      console.log(`- ${existingInstitution.name} (${existingInstitution.email})`);
      process.exit(0);
    }
    
    // Create new institution for Sri Krishna College of Engineering
    const newInstitution = new Institution({
      name: 'Sri Krishna College of Engineering and Technology',
      email: 'admin@skcet.ac.in',
      phone: '+91 422 1234567',
      address: {
        street: 'Kuniamuthur',
        city: 'Coimbatore',
        state: 'Tamil Nadu',
        zipCode: '641008',
        country: 'India'
      },
      website: 'https://www.skcet.ac.in',
      contactPerson: {
        name: 'Dr. Kumar',
        email: 'dr.kumar@skcet.ac.in',
        phone: '+91 422 1234568'
      }
    });
    
    await newInstitution.save();
    console.log('Added new institution:');
    console.log(`- ${newInstitution.name} (${newInstitution.email})`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addSriKrishnaInstitution();