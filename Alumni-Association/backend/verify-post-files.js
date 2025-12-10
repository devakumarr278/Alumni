// Script to verify that all files referenced in posts actually exist
// Helps identify broken image links

require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Post = require('./models/Post');
const fs = require('fs').promises;
const path = require('path');

async function verifyPostFiles() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association');
    console.log('Connected to MongoDB');

    // Find all posts
    const posts = await Post.find({});
    console.log(`Found ${posts.length} posts in database`);

    let totalFiles = 0;
    let missingFiles = 0;
    let validFiles = 0;

    // Check each post's media files
    for (const post of posts) {
      for (const mediaItem of post.media) {
        if (mediaItem.url) {
          totalFiles++;
          
          // Extract filename from URL
          let filename;
          if (mediaItem.url.includes('/uploads/posts/')) {
            const urlParts = mediaItem.url.split('/uploads/posts/');
            if (urlParts.length > 1) {
              filename = urlParts[1].split('?')[0]; // Remove query params if any
            }
          } else if (mediaItem.url.startsWith('/')) {
            // Relative path
            filename = mediaItem.url.substring(1);
          }

          if (filename) {
            const filePath = path.join(__dirname, 'uploads', 'posts', filename);
            try {
              await fs.access(filePath);
              console.log(`✓ VALID: ${filename}`);
              validFiles++;
            } catch (fileError) {
              console.log(`✗ MISSING: ${filename} (referenced in post ${post._id})`);
              missingFiles++;
            }
          } else {
            console.log(`? UNKNOWN FORMAT: ${mediaItem.url} (referenced in post ${post._id})`);
          }
        }
      }
    }

    console.log(`\n=== VERIFICATION SUMMARY ===`);
    console.log(`Total files referenced: ${totalFiles}`);
    console.log(`Valid files: ${validFiles}`);
    console.log(`Missing files: ${missingFiles}`);
    console.log(`Success rate: ${totalFiles > 0 ? ((validFiles / totalFiles) * 100).toFixed(2) : 0}%`);
    
    if (missingFiles > 0) {
      console.log(`\n⚠️  ACTION RECOMMENDED: Run cleanup-old-posts.js to remove broken references`);
    } else {
      console.log(`\n✅ All files are valid!`);
    }
    
    // Close connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    
  } catch (error) {
    console.error('Error verifying post files:', error);
    process.exit(1);
  }
}

// Run the verification
verifyPostFiles();