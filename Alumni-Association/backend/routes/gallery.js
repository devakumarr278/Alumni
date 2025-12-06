const express = require('express');
const router = express.Router();
const { GalleryController, galleryValidation, upload } = require('../controllers/galleryController');
const { auth, optionalAuth, isAlumniOrAdmin } = require('../middleware/auth');

// Public routes
router.get('/', optionalAuth, GalleryController.getAllGalleryItems);
router.get('/featured', GalleryController.getFeaturedItems);
router.get('/:id', optionalAuth, GalleryController.getGalleryItemById);

// Protected routes
router.post('/', auth, upload.single('file'), galleryValidation, GalleryController.uploadGalleryItem);
router.put('/:id', auth, galleryValidation, GalleryController.updateGalleryItem);
router.delete('/:id', auth, GalleryController.deleteGalleryItem);

// Interaction routes
router.post('/:id/like', auth, GalleryController.toggleLike);
router.post('/:id/comment', auth, GalleryController.addComment);

// User-specific routes
router.get('/user/my-items', auth, GalleryController.getMyGalleryItems);

module.exports = router;