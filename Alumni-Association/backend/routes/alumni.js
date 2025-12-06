const express = require('express');
const router = express.Router();
const { AlumniController } = require('../controllers/alumniController');
const { auth, optionalAuth, isAlumniOrAdmin } = require('../middleware/auth');

// Public routes (with optional auth for visibility checks)
router.get('/', optionalAuth, AlumniController.getAllAlumni);
router.get('/stats', optionalAuth, AlumniController.getAlumniStats);
router.get('/filters', optionalAuth, AlumniController.getFilterOptions);
router.get('/search', optionalAuth, AlumniController.searchAlumni);
router.get('/:id', optionalAuth, AlumniController.getAlumniById);
router.get('/:id/profile', optionalAuth, AlumniController.getAlumniProfile);

// Protected routes (require auth)
router.put('/:id', auth, AlumniController.updateProfile);

module.exports = router;