const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Institution = require('./models/Institution');

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

// Mock institutions data
const mockInstitutions = [
  {
    name: 'Indian Institute of Technology',
    email: 'admin@iit.edu',
    phone: '+91 1234567890',
    address: {
      street: 'IIT Campus',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400076',
      country: 'India'
    },
    website: 'https://www.iit.edu',
    contactPerson: {
      name: 'Dr. Smith',
      email: 'dr.smith@iit.edu',
      phone: '+91 1234567891'
    }
  },
  {
    name: 'Delhi University',
    email: 'admin@du.ac.in',
    phone: '+91 9876543210',
    address: {
      street: 'DU Campus',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110007',
      country: 'India'
    },
    website: 'https://www.du.ac.in',
    contactPerson: {
      name: 'Prof. Johnson',
      email: 'prof.johnson@du.ac.in',
      phone: '+91 9876543211'
    }
  },
  {
    name: 'Anna University',
    email: 'admin@annauniv.edu',
    phone: '+91 9123456789',
    address: {
      street: 'AU Campus',
      city: 'Chennai',
      state: 'Tamil Nadu',
      zipCode: '600025',
      country: 'India'
    },
    website: 'https://www.annauniv.edu',
    contactPerson: {
      name: 'Dr. Williams',
      email: 'dr.williams@annauniv.edu',
      phone: '+91 9123456780'
    }
  }
];

// Add mock institutions
const addMockInstitutions = async () => {
  try {
    await connectDB();
    
    // Clear existing institutions
    await Institution.deleteMany({});
    console.log('Cleared existing institutions');
    
    // Add mock institutions
    const institutions = await Institution.insertMany(mockInstitutions);
    console.log(`Added ${institutions.length} mock institutions`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding mock institutions:', error);
    process.exit(1);
  }
};

// Run the function
addMockInstitutions();