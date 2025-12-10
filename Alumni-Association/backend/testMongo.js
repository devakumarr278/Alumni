const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config({ path: __dirname + '/.env' });

console.log('MongoDB URI:', process.env.MONGODB_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association')
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
    
    // Try to access a collection
    const db = mongoose.connection;
    db.db.listCollections().toArray()
      .then(collections => {
        console.log('Available collections:');
        collections.forEach(collection => {
          console.log('- ' + collection.name);
        });
        
        // Close the connection
        mongoose.connection.close();
      })
      .catch(err => {
        console.log('Error listing collections:', err);
        mongoose.connection.close();
      });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });