const express = require('express');
const router = express.Router();
const { PostController } = require('../controllers/postController');
const { auth, isInstitution, isAlumniOrAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/posts');
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
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Post routes
// Create a new post (institution only) with file upload
router.post('/', auth, isInstitution, upload.array('images', 10), PostController.createPost);

// Get all public posts (available to ALL users, including non-authenticated)
router.get('/public', PostController.getPublicPosts);

// Get posts by institution
router.get('/institution/:institutionId', auth, PostController.getInstitutionPosts);

// Like a post (available to ALL users, including non-authenticated)
router.post('/:id/like', PostController.likePost);

// Add comment to post (available to ALL users, including non-authenticated)
router.post('/:id/comment', PostController.addComment);

// Delete a post (institution or post creator)
router.delete('/:id', auth, PostController.deletePost);

module.exports = router;