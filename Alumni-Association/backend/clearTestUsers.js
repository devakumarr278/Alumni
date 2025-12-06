const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });

// If MONGODB_URI is not set, use default
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb://localhost:27017/alumni-association';
}

// Import models
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Delete test users
  const result = await User.deleteMany({
    email: {
      $in: [
        'test.user@skcet.ac.in',
        'test.alumni@gmail.com',
        'john.doe@example.com'
      ]
    }
  });
  
  console.log(`Deleted ${result.deletedCount} test users`);
  
  // Check remaining users
  const users = await User.find({});
  console.log(`Remaining ${users.length} users:`);
  
  users.forEach(user => {
    console.log(`- ${user.email} (${user.userType}) - Verified: ${user.isEmailVerified} - Status: ${user.status}`);
  });
  
  // Close connection
  mongoose.connection.close();
  console.log('Disconnected from MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});