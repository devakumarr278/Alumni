require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/Post');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association')
.then(async () => {
  console.log('Connected to MongoDB');
  
  const posts = await Post.find();
  console.log('Total posts:', posts.length);
  
  let deletedCount = 0;
  for (const post of posts) {
    // Check if post has blob URLs in media
    if (post.media && post.media.some(media => 
      media.url && typeof media.url === 'string' && media.url.startsWith('blob:'))) {
      await Post.findByIdAndDelete(post._id);
      console.log('Deleted post with blob URLs:', post._id);
      deletedCount++;
    }
  }
  
  console.log(`Cleanup completed. Deleted ${deletedCount} posts with blob URLs.`);
  process.exit(0);
})
.catch(err => {
  console.error('Error:', err);
  process.exit(1);
});