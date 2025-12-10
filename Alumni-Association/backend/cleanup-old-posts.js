// Script to clean up old posts and their associated files
// This helps prevent issues with missing image files

require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Post = require('./models/Post');
const fs = require('fs').promises;
const path = require('path');

async function cleanupOldPosts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association');
    console.log('Connected to MongoDB');

    // Find all posts (you can add date filters if needed)
    const posts = await Post.find({});
    console.log(`Found ${posts.length} posts in database`);

    let deletedCount = 0;
    let fileDeletionErrors = 0;

    // Delete each post and its associated files
    for (const post of posts) {
      try {
        // Delete associated files from filesystem
        for (const mediaItem of post.media) {
          if (mediaItem.url) {
            // Extract filename from URL
            // Handle both full URLs and relative paths
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
                await fs.unlink(filePath);
                console.log(`Deleted file: ${filePath}`);
              } catch (fileError) {
                // File might not exist, which is fine
                console.log(`File not found or already deleted: ${filePath}`);
                fileDeletionErrors++;
              }
            }
          }
        }

        // Delete post from database
        await Post.findByIdAndDelete(post._id);
        console.log(`Deleted post: ${post._id}`);
        deletedCount++;
      } catch (postError) {
        console.error(`Error deleting post ${post._id}:`, postError);
      }
    }

    console.log(`Successfully deleted ${deletedCount} posts`);
    if (fileDeletionErrors > 0) {
      console.log(`Note: ${fileDeletionErrors} files were not found (already deleted or missing)`);
    }
    
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error cleaning up posts:', error);
    process.exit(1);
  }
}

// Run the cleanup
cleanupOldPosts();