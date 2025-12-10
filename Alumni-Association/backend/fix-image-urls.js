// Script to fix incorrect image URLs in existing posts
// Replaces /api/uploads/ with /uploads/ in all post media URLs

require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Post = require('./models/Post');

async function fixImageUrls() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association');
    console.log('Connected to MongoDB');

    // Find all posts with media containing incorrect URLs (both patterns)
    const posts = await Post.find({
      $or: [
        { 'media.url': { $regex: '/api/uploads/' } },
        { 'media.url': { $regex: '^/uploads/' } }  // Also find relative URLs to convert to full URLs
      ]
    });

    console.log(`Found ${posts.length} posts with URLs to fix`);

    let updatedCount = 0;

    // Update each post
    for (const post of posts) {
      let updated = false;
      
      // Fix media URLs
      for (let i = 0; i < post.media.length; i++) {
        if (post.media[i].url) {
          const oldUrl = post.media[i].url;
          
          // Case 1: Fix /api/uploads/ -> /uploads/
          if (post.media[i].url.includes('/api/uploads/')) {
            post.media[i].url = post.media[i].url.replace('/api/uploads/', '/uploads/');
            console.log(`Fixed API URL: ${oldUrl} -> ${post.media[i].url}`);
            updated = true;
          }
          // Case 2: Convert relative URLs to full URLs
          else if (post.media[i].url.startsWith('/uploads/')) {
            post.media[i].url = `http://localhost:5003${post.media[i].url}`;
            console.log(`Converted relative URL: ${oldUrl} -> ${post.media[i].url}`);
            updated = true;
          }
        }
      }

      // Save updated post
      if (updated) {
        await post.save();
        updatedCount++;
      }
    }

    console.log(`Successfully updated ${updatedCount} posts`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error fixing image URLs:', error);
    process.exit(1);
  }
}

// Run the fix
fixImageUrls();