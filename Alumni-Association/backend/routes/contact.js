const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const emailService = require('../services/emailService');

// Contact form submission
const submitContactForm = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { name, email, phone, subject, message } = req.body;

    // Send notification email to admin
    const emailResult = await emailService.sendContactFormNotification({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim(),
      subject: subject.trim(),
      message: message.trim()
    });

    if (!emailResult.success) {
      console.error('Failed to send contact form notification:', emailResult.error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send your message. Please try again later.'
      });
    }

    res.json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form. Please try again.'
    });
  }
};

// Validation rules for contact form
const contactValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email address'),
  body('phone').optional().isMobilePhone().withMessage('Please enter a valid phone number'),
  body('subject').trim().isLength({ min: 5, max: 200 }).withMessage('Subject must be between 5 and 200 characters'),
  body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters')
];

// Routes
router.post('/submit', contactValidation, submitContactForm);

module.exports = router;