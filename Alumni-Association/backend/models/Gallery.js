const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Gallery title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  // Media Information
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    required: [true, 'Media type is required']
  },
  fileName: {
    type: String,
    required: [true, 'File name is required']
  },
  originalName: {
    type: String,
    required: [true, 'Original file name is required']
  },
  filePath: {
    type: String,
    required: [true, 'File path is required']
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required']
  },
  mimeType: {
    type: String,
    required: [true, 'MIME type is required']
  },
  
  // Image specific properties
  dimensions: {
    width: Number,
    height: Number
  },
  
  // Video specific properties
  duration: Number, // in seconds
  
  // Thumbnail for videos
  thumbnail: {
    fileName: String,
    filePath: String
  },
  
  // Categorization
  category: {
    type: String,
    enum: ['events', 'campus', 'alumni', 'achievements', 'reunion', 'graduation', 'other'],
    required: [true, 'Category is required']
  },
  subcategory: String,
  
  // Associated Event
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  
  // Date Information
  takenDate: {
    type: Date,
    default: Date.now
  },
  
  // Location Information
  location: {
    name: String,
    address: String,
    city: String,
    state: String,
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // People in the media
  peopleTagged: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String, // For non-users
    position: {
      x: Number, // percentage from left
      y: Number  // percentage from top
    }
  }],
  
  // Uploader Information
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader is required']
  },
  
  // Visibility and Access
  visibility: {
    type: String,
    enum: ['public', 'alumni-only', 'private'],
    default: 'public'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  // Moderation
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: Date,
  rejectionReason: String,
  
  // Tags and Keywords
  tags: [String],
  keywords: [String],
  
  // Social Features
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    replies: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      text: {
        type: String,
        required: true,
        maxlength: [300, 'Reply cannot exceed 300 characters']
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  
  // Copyright and Attribution
  photographer: String,
  copyrightInfo: String,
  license: {
    type: String,
    enum: ['all-rights-reserved', 'creative-commons', 'public-domain'],
    default: 'all-rights-reserved'
  },
  
  // Technical Metadata
  exifData: {
    camera: String,
    lens: String,
    iso: Number,
    aperture: String,
    shutterSpeed: String,
    focalLength: String
  },
  
  // Featured Status
  isFeatured: {
    type: Boolean,
    default: false
  },
  featuredOrder: Number,
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for like count
gallerySchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Virtual for comment count
gallerySchema.virtual('commentCount').get(function() {
  return this.comments ? this.comments.length : 0;
});

// Virtual for file URL
gallerySchema.virtual('fileUrl').get(function() {
  return `/uploads/${this.fileName}`;
});

// Virtual for thumbnail URL
gallerySchema.virtual('thumbnailUrl').get(function() {
  if (this.mediaType === 'video' && this.thumbnail) {
    return `/uploads/${this.thumbnail.fileName}`;
  }
  return this.fileUrl;
});

// Method to add like
gallerySchema.methods.addLike = function(userId) {
  const existingLike = this.likes.find(like => like.user.toString() === userId.toString());
  if (!existingLike) {
    this.likes.push({ user: userId });
    return this.save();
  }
  return this;
};

// Method to remove like
gallerySchema.methods.removeLike = function(userId) {
  this.likes = this.likes.filter(like => like.user.toString() !== userId.toString());
  return this.save();
};

// Method to add comment
gallerySchema.methods.addComment = function(userId, text) {
  this.comments.push({
    user: userId,
    text: text
  });
  return this.save();
};

// Method to increment views
gallerySchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Indexes
gallerySchema.index({ category: 1 });
gallerySchema.index({ visibility: 1 });
gallerySchema.index({ status: 1 });
gallerySchema.index({ uploadedBy: 1 });
gallerySchema.index({ event: 1 });
gallerySchema.index({ tags: 1 });
gallerySchema.index({ takenDate: -1 });
gallerySchema.index({ createdAt: -1 });
gallerySchema.index({ isFeatured: 1, featuredOrder: 1 });

module.exports = mongoose.model('Gallery', gallerySchema);