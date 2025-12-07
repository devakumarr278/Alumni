const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });

// Import User model
const User = require('./models/User');

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association')
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Check if user already exists
  const existingUser = await User.findOne({ email: '727724eucy015@skcet.ac.in' });
  
  if (existingUser) {
    console.log('User already exists:', existingUser.email);
    console.log('Email verified:', existingUser.isEmailVerified);
    
    // If email is not verified, let's verify it for development purposes
    if (!existingUser.isEmailVerified) {
      console.log('Verifying email for development...');
      existingUser.isEmailVerified = true;
      existingUser.emailVerificationToken = undefined;
      existingUser.emailVerificationExpires = undefined;
      await existingUser.save();
      console.log('Email verified successfully!');
    }
    
    // If password needs to be updated
    if (process.argv.includes('--update-password')) {
      console.log('Updating password...');
      existingUser.password = 'Deva@1234';
      await existingUser.save();
      console.log('Password updated successfully!');
    }
  } else {
    // Create new user
    console.log('Creating new user...');
    const newUser = new User({
      firstName: 'Deva',
      lastName: 'User',
      email: '727724eucy015@skcet.ac.in',
      password: 'Deva@1234',
      userType: 'student',
      status: 'approved',
      collegeName: 'SKCET',
      rollNumber: '727724EUCY015',
      department: 'Computer Science',
      currentYear: '2nd Year',
      isEmailVerified: true // Verified for development
    });
    
    await newUser.save();
    console.log('New user created successfully!');
  }
  
  mongoose.connection.close();
  console.log('Database connection closed.');
})
.catch((error) => {
  console.error('Database connection error:', error);
  process.exit(1);
});