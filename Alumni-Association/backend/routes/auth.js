const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Import validation middleware directly from authController
const { registerValidation, loginValidation, updateProfileValidation } = require('../middleware/validation');

// Registration route
router.post('/register', registerValidation, AuthController.register);

// Login route
router.post('/login', loginValidation, AuthController.login);

// Get current user profile
router.get('/profile', auth, AuthController.getProfile);

// Get any user profile by ID (for viewing other users' profiles)
router.get('/profile/:id', auth, AuthController.getUserProfileById);

// Update current user profile
router.put('/profile', auth, updateProfileValidation, AuthController.updateProfile);

// Verify email
router.get('/verify-email', AuthController.verifyEmail);

// Verify email with code
router.post('/verify-email-code', AuthController.verifyEmailWithCode);

// Resend verification email
router.post('/resend-verification', AuthController.resendVerificationEmail);

// Forgot password
router.post('/forgot-password', AuthController.forgotPassword);

// Reset password
router.post('/reset-password', AuthController.resetPassword);

// Simple test routes
router.get('/test', (req, res) => {
  res.json({ message: 'Auth test route working' });
});

router.post('/test-post', (req, res) => {
  res.json({ message: 'Auth test POST route working' });
});

module.exports = router;