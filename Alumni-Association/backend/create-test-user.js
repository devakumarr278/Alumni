const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
  
  // Import User and Institution models
  const User = require('./models/User');
  const Institution = require('./models/Institution');
  
  // Create a test alumni user
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: 'test.alumni@gmail.com' });
    if (existingUser) {
      console.log('Test user already exists');
      await User.deleteOne({ email: 'test.alumni@gmail.com' });
      console.log('Deleted existing test user');
    }
    
    // Find an institution for the alumni
    const institution = await Institution.findOne({ name: { $regex: 'Sri Krishna', $options: 'i' } });
    if (!institution) {
      console.log('No institution found, using first available');
      const firstInstitution = await Institution.findOne();
      if (!firstInstitution) {
        throw new Error('No institutions found in database');
      }
      institutionId = firstInstitution._id;
    } else {
      institutionId = institution._id;
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('test123', salt);
    
    // Create new user
    const user = new User({
      firstName: 'Test',
      lastName: 'Alumni',
      email: 'test.alumni@gmail.com',
      password: 'Test1234!',  // Let the model hash this (8+ chars)
      userType: 'alumni',
      status: 'approved', // Set to approved for testing
      collegeName: 'Sri Krishna College of Engineering and Technology',
      rollNumber: 'TEST123',
      department: 'Computer Science',
      graduationYear: 2020,
      isEmailVerified: true,
      institutionId: institutionId
    });
    
    await user.save();
    console.log('Test user created successfully');
    
    // Create a test student user
    const existingStudent = await User.findOne({ email: 'test.student@skcet.ac.in' });
    if (existingStudent) {
      console.log('Test student already exists');
      await User.deleteOne({ email: 'test.student@skcet.ac.in' });
      console.log('Deleted existing test student');
    }
    
    const studentPassword = await bcrypt.hash('Student123!', salt);
    const student = new User({
      firstName: 'Test',
      lastName: 'Student',
      email: 'test.student@skcet.ac.in',
      password: 'Test1234!',  // Let the model hash this (8+ chars)
      userType: 'student',
      status: 'approved',
      collegeName: 'Sri Krishna College of Engineering and Technology',
      rollNumber: 'STU123',
      department: 'Computer Science',
      currentYear: 3,
      isEmailVerified: true
    });
    
    await student.save();
    console.log('Test student created successfully');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating test user:', error);
    mongoose.connection.close();
  }
});