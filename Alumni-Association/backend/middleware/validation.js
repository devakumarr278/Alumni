const { body } = require('express-validator');

// Registration validation rules
const registerValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and must be between 1 and 50 characters'),
  
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and must be between 1 and 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('userType')
    .isIn(['student', 'alumni', 'admin'])
    .withMessage('Valid user type is required (student, alumni, admin)'),
  
  body('collegeName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('College name is required'),
  
  body('rollNumber')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage('Roll number cannot be empty if provided'),
  
  body('department')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage('Department cannot be empty if provided'),
  
  body('graduationYear')
    .optional()
    .isInt({ min: 1900, max: 2100 })
    .withMessage('Graduation year must be a valid year'),
  
  body('currentYear')
    .optional()
    .isIn(['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'])
    .withMessage('Current year must be a valid year (1st Year, 2nd Year, etc.)'),
  
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Phone number must be valid (up to 15 digits, optional + prefix)'),
  
  body('currentPosition')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Current position cannot exceed 100 characters'),
  
  body('company')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  
  body('location')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters')
];

// Login validation rules
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Profile update validation rules
const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Phone number must be valid (up to 15 digits, optional + prefix)'),
  
  body('bio')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  
  body('age')
    .optional()
    .isInt({ min: 13, max: 120 })
    .withMessage('Age must be between 13 and 120'),
  
  body('currentPosition')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Current position cannot exceed 100 characters'),
  
  body('company')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  
  body('location')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters')
];

module.exports = {
  registerValidation,
  loginValidation,
  updateProfileValidation
};