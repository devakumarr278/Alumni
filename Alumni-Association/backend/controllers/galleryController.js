const Gallery = require('../models/Gallery');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { body, validationResult } = require('express-validator');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/gallery');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    cb(null, fileName);
  }
});

const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

class GalleryController {
  // Get all gallery items with filtering and pagination
  static async getAllGalleryItems(req, res) {
    try {
      const {
        page = 1,
        limit = 12,
        search,
        category,
        mediaType,
        event,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      // Build filter query
      const filter = {
        status: 'approved',
        visibility: { $in: ['public', 'alumni-only'] }
      };

      // If user is not authenticated or not alumni/admin, only show public items
      if (!req.user || (req.user.userType !== 'alumni' && req.user.userType !== 'admin')) {
        filter.visibility = 'public';
      }

      // Search filter
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } },
          { keywords: { $regex: search, $options: 'i' } }
        ];
      }

      // Additional filters
      if (category) filter.category = category;
      if (mediaType) filter.mediaType = mediaType;
      if (event) filter.event = event;

      // Sort options
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Execute query with pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const [galleryItems, totalCount] = await Promise.all([
        Gallery.find(filter)
          .populate('uploadedBy', 'firstName lastName profilePicture')
          .populate('event', 'title startDate')
          .populate('likes.user', 'firstName lastName')
          .populate('comments.user', 'firstName lastName profilePicture')
          .sort(sortOptions)
          .skip(skip)
          .limit(parseInt(limit)),
        Gallery.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(totalCount / parseInt(limit));

      res.json({
        success: true,
        data: {
          galleryItems,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalCount,
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1
          }
        }
      });

    } catch (error) {
      console.error('Get gallery items error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch gallery items'
      });
    }
  }

  // Get single gallery item
  static async getGalleryItemById(req, res) {
    try {
      const { id } = req.params;

      const galleryItem = await Gallery.findById(id)
        .populate('uploadedBy', 'firstName lastName profilePicture')
        .populate('event', 'title startDate venue')
        .populate('likes.user', 'firstName lastName')
        .populate('comments.user', 'firstName lastName profilePicture')
        .populate('comments.replies.user', 'firstName lastName profilePicture');

      if (!galleryItem) {
        return res.status(404).json({
          success: false,
          message: 'Gallery item not found'
        });
      }

      // Check visibility permissions
      if (galleryItem.visibility === 'private') {
        if (!req.user || galleryItem.uploadedBy._id.toString() !== req.user.id) {
          return res.status(403).json({
            success: false,
            message: 'This item is private'
          });
        }
      }

      if (galleryItem.visibility === 'alumni-only' && 
          (!req.user || (req.user.userType !== 'alumni' && req.user.userType !== 'admin'))) {
        return res.status(403).json({
          success: false,
          message: 'This item is only visible to alumni'
        });
      }

      // Increment view count
      await galleryItem.incrementViews();

      res.json({
        success: true,
        data: { galleryItem }
      });

    } catch (error) {
      console.error('Get gallery item by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch gallery item'
      });
    }
  }

  // Upload new gallery item
  static async uploadGalleryItem(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const {
        title,
        description,
        category,
        tags,
        keywords,
        event,
        visibility = 'public',
        takenDate,
        location
      } = req.body;

      // Prepare gallery item data
      const galleryData = {
        title: title.trim(),
        description: description?.trim(),
        mediaType: req.file.mimetype.startsWith('image/') ? 'image' : 'video',
        fileName: req.file.filename,
        originalName: req.file.originalname,
        filePath: req.file.path,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        category,
        visibility,
        uploadedBy: req.user.id,
        status: 'pending', // Requires admin approval
        takenDate: takenDate ? new Date(takenDate) : new Date()
      };

      // Add optional fields
      if (tags) {
        galleryData.tags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
      }
      if (keywords) {
        galleryData.keywords = Array.isArray(keywords) ? keywords : keywords.split(',').map(keyword => keyword.trim());
      }
      if (event) galleryData.event = event;
      if (location) {
        try {
          galleryData.location = typeof location === 'string' ? JSON.parse(location) : location;
        } catch (e) {
          console.error('Invalid location data:', e);
        }
      }

      // Get image dimensions for images
      if (galleryData.mediaType === 'image') {
        try {
          const sharp = require('sharp');
          const metadata = await sharp(req.file.path).metadata();
          galleryData.dimensions = {
            width: metadata.width,
            height: metadata.height
          };
        } catch (error) {
          console.error('Error getting image dimensions:', error);
        }
      }

      const galleryItem = new Gallery(galleryData);
      await galleryItem.save();

      const populatedItem = await Gallery.findById(galleryItem._id)
        .populate('uploadedBy', 'firstName lastName profilePicture')
        .populate('event', 'title startDate');

      res.status(201).json({
        success: true,
        message: 'Gallery item uploaded successfully and is pending approval',
        data: { galleryItem: populatedItem }
      });

    } catch (error) {
      console.error('Upload gallery item error:', error);
      
      // Clean up uploaded file if there was an error
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      }

      res.status(500).json({
        success: false,
        message: 'Failed to upload gallery item'
      });
    }
  }

  // Update gallery item
  static async updateGalleryItem(req, res) {
    try {
      const { id } = req.params;
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const galleryItem = await Gallery.findById(id);
      if (!galleryItem) {
        return res.status(404).json({
          success: false,
          message: 'Gallery item not found'
        });
      }

      // Check if user is uploader or admin
      if (galleryItem.uploadedBy.toString() !== req.user.id && req.user.userType !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Only uploader or admin can update this item.'
        });
      }

      const allowedUpdates = ['title', 'description', 'category', 'tags', 'keywords', 'visibility'];
      const updates = {};
      
      allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });

      const updatedItem = await Gallery.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      ).populate('uploadedBy', 'firstName lastName profilePicture');

      res.json({
        success: true,
        message: 'Gallery item updated successfully',
        data: { galleryItem: updatedItem }
      });

    } catch (error) {
      console.error('Update gallery item error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update gallery item'
      });
    }
  }

  // Delete gallery item
  static async deleteGalleryItem(req, res) {
    try {
      const { id } = req.params;

      const galleryItem = await Gallery.findById(id);
      if (!galleryItem) {
        return res.status(404).json({
          success: false,
          message: 'Gallery item not found'
        });
      }

      // Check if user is uploader or admin
      if (galleryItem.uploadedBy.toString() !== req.user.id && req.user.userType !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Only uploader or admin can delete this item.'
        });
      }

      // Delete the file from filesystem
      try {
        await fs.unlink(galleryItem.filePath);
        
        // Delete thumbnail if exists
        if (galleryItem.thumbnail && galleryItem.thumbnail.filePath) {
          await fs.unlink(galleryItem.thumbnail.filePath);
        }
      } catch (fileError) {
        console.error('Error deleting file:', fileError);
      }

      await Gallery.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Gallery item deleted successfully'
      });

    } catch (error) {
      console.error('Delete gallery item error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete gallery item'
      });
    }
  }

  // Like/Unlike gallery item
  static async toggleLike(req, res) {
    try {
      const { id } = req.params;

      const galleryItem = await Gallery.findById(id);
      if (!galleryItem) {
        return res.status(404).json({
          success: false,
          message: 'Gallery item not found'
        });
      }

      const existingLike = galleryItem.likes.find(
        like => like.user.toString() === req.user.id
      );

      if (existingLike) {
        // Remove like
        await galleryItem.removeLike(req.user.id);
        res.json({
          success: true,
          message: 'Like removed',
          data: { liked: false, likeCount: galleryItem.likeCount - 1 }
        });
      } else {
        // Add like
        await galleryItem.addLike(req.user.id);
        res.json({
          success: true,
          message: 'Like added',
          data: { liked: true, likeCount: galleryItem.likeCount + 1 }
        });
      }

    } catch (error) {
      console.error('Toggle like error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to toggle like'
      });
    }
  }

  // Add comment to gallery item
  static async addComment(req, res) {
    try {
      const { id } = req.params;
      const { text } = req.body;

      if (!text || text.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Comment text is required'
        });
      }

      const galleryItem = await Gallery.findById(id);
      if (!galleryItem) {
        return res.status(404).json({
          success: false,
          message: 'Gallery item not found'
        });
      }

      await galleryItem.addComment(req.user.id, text.trim());
      
      const updatedItem = await Gallery.findById(id)
        .populate('comments.user', 'firstName lastName profilePicture')
        .select('comments');

      res.json({
        success: true,
        message: 'Comment added successfully',
        data: { comments: updatedItem.comments }
      });

    } catch (error) {
      console.error('Add comment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add comment'
      });
    }
  }

  // Get featured gallery items
  static async getFeaturedItems(req, res) {
    try {
      const { limit = 6 } = req.query;

      const featuredItems = await Gallery.find({
        isFeatured: true,
        status: 'approved',
        visibility: 'public'
      })
      .populate('uploadedBy', 'firstName lastName')
      .sort({ featuredOrder: 1, createdAt: -1 })
      .limit(parseInt(limit))
      .select('title fileName fileUrl thumbnailUrl mediaType category');

      res.json({
        success: true,
        data: { galleryItems: featuredItems }
      });

    } catch (error) {
      console.error('Get featured items error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch featured items'
      });
    }
  }

  // Get gallery items by user
  static async getMyGalleryItems(req, res) {
    try {
      const { page = 1, limit = 12 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [galleryItems, totalCount] = await Promise.all([
        Gallery.find({ uploadedBy: req.user.id })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        Gallery.countDocuments({ uploadedBy: req.user.id })
      ]);

      const totalPages = Math.ceil(totalCount / parseInt(limit));

      res.json({
        success: true,
        data: {
          galleryItems,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalCount,
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1
          }
        }
      });

    } catch (error) {
      console.error('Get my gallery items error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch your gallery items'
      });
    }
  }
}

// Validation rules
const galleryValidation = [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('category').isIn(['events', 'campus', 'alumni', 'achievements', 'reunion', 'graduation', 'other']).withMessage('Invalid category'),
  body('visibility').optional().isIn(['public', 'alumni-only', 'private']).withMessage('Invalid visibility setting')
];

module.exports = {
  GalleryController,
  galleryValidation,
  upload
};