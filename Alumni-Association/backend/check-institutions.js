require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Institution = require('./models/Institution');

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Check if institutions exist
  const institutions = await Institution.find({});
  console.log('Number of institutions:', institutions.length);
  
  if (institutions.length > 0) {
    console.log('Institutions found:');
    institutions.forEach(inst => {
      console.log(`- ${inst.name} (${inst.email})`);
    });
  } else {
    console.log('No institutions found in database');
  }
  
  mongoose.connection.close();
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});