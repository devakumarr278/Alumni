const Post = require('../models/Post');
const User = require('../models/User');
const path = require('path');

class PostController {
  // Create a new post
  static async createPost(req, res) {
    try {
      const { author, caption, visibility } = req.body;
      
      // Validate required fields
      if (!author || !caption) {
        return res.status(400).json({
          success: false,
          message: 'Author and caption are required'
        });
      }
      
      // Process uploaded images
      let media = [];
      if (req.files && req.files.length > 0) {
        media = req.files.map(file => ({
          type: 'image',
          url: `/uploads/posts/${file.filename}`
        }));
      }
      
      // Create new post
      const post = new Post({
        institutionId: req.user.id, // From auth middleware
        createdById: req.user.id, // From auth middleware
        author,
        avatar: req.user.profilePicture || null,
        media: media,
        caption,
        visibility: visibility || 'public'
      });
      
      const savedPost = await post.save();
      
      // Populate the post with user details including profilePicture
      await savedPost.populate('institutionId', 'firstName lastName profilePicture');
      
      res.status(201).json({
        success: true,
        data: savedPost
      });
    } catch (error) {
      console.error('Create post error:', error);
      
      // Clean up uploaded files if there was an error
      if (req.files) {
        try {
          const fs = require('fs').promises;
          for (const file of req.files) {
            await fs.unlink(file.path);
          }
        } catch (unlinkError) {
          console.error('Error deleting files:', unlinkError);
        }
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to create post'
      });
    }
  }
  
  // Get all public posts
  static async getPublicPosts(req, res) {
    try {
      const posts = await Post.find({ visibility: 'public' })
        .populate('institutionId', 'firstName lastName profilePicture')
        .sort({ createdAt: -1 })
        .limit(50); // Limit to 50 most recent posts
      
      res.json({
        success: true,
        data: posts
      });
    } catch (error) {
      console.error('Get public posts error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch posts'
      });
    }
  }
  
  // Get posts by institution
  static async getInstitutionPosts(req, res) {
    try {
      const { institutionId } = req.params;
      
      const posts = await Post.find({ institutionId })
        .populate('institutionId', 'firstName lastName profilePicture')
        .sort({ createdAt: -1 });
      
      res.json({
        success: true,
        data: posts
      });
    } catch (error) {
      console.error('Get institution posts error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch institution posts'
      });
    }
  }
  
  // Like a post
  static async likePost(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id; // Make it optional for guests
      
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      
      // Check if user already liked the post (skip for guests)
      let alreadyLiked = false;
      if (userId) {
        alreadyLiked = post.likes.includes(userId);
      }
      
      if (alreadyLiked) {
        // Unlike the post
        post.likes = post.likes.filter(like => like.toString() !== userId.toString());
      } else if (userId) {
        // Like the post (only if user is logged in)
        post.likes.push(userId);
      }
      
      await post.save();
      
      res.json({
        success: true,
        data: {
          likes: post.likes.length,
          liked: userId ? !alreadyLiked : false
        }
      });
    } catch (error) {
      console.error('Like post error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to like post'
      });
    }
  }
  
  // Add comment to post
  static async addComment(req, res) {
    try {
      const { id } = req.params;
      const { text } = req.body;
      const userId = req.user?.id; // Make it optional for guests
      
      // Get user details (for guests, use "Guest" as username)
      let userName = "Guest";
      if (userId) {
        const user = await User.findById(userId).select('firstName lastName');
        if (user) {
          userName = `${user.firstName} ${user.lastName}`;
        }
      }
      
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      
      const comment = {
        userId: userId || null,
        userName: userName,
        text
      };
      
      post.comments.push(comment);
      await post.save();
      
      res.json({
        success: true,
        data: comment
      });
    } catch (error) {
      console.error('Add comment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add comment'
      });
    }
  }
  
  // Delete a post
  static async deletePost(req, res) {
    try {
      const { id } = req.params;
      
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      
      // Check if user is authorized to delete (post creator or institution)
      if (post.createdById.toString() !== req.user.id.toString() && 
          post.institutionId.toString() !== req.user.id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this post'
        });
      }
      
      // Delete associated files
      try {
        const fs = require('fs').promises;
        for (const mediaItem of post.media) {
          if (mediaItem.url.startsWith('/uploads/posts/')) {
            const filePath = path.join(__dirname, '../..', mediaItem.url);
            await fs.unlink(filePath);
          }
        }
      } catch (fileError) {
        console.error('Error deleting post files:', fileError);
      }
      
      await Post.findByIdAndDelete(id);
      
      res.json({
        success: true,
        message: 'Post deleted successfully'
      });
    } catch (error) {
      console.error('Delete post error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete post'
      });
    }
  }
}

module.exports = { PostController };