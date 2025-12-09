const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });

// Import the models
const Post = require('./models/Post');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Get all posts
    const posts = await Post.find({}).populate('institutionId', 'firstName lastName');
    console.log('Total posts:', posts.length);
    console.log('Posts:');
    posts.forEach((post, index) => {
      console.log(`${index + 1}.`, JSON.stringify(post, null, 2));
    });
    
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });