const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Verify JWT token middleware
const auth = async (req, res, next) => {
  try {
    let token = req.header('Authorization');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    // Remove 'Bearer ' prefix if present
    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Access denied. User not found.' 
        });
      }

      if (user.status !== 'approved') {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied. Account not approved yet.' 
        });
      }

      if (user.isLocked) {
        return res.status(423).json({ 
          success: false, 
          message: 'Account is temporarily locked due to multiple failed login attempts.' 
        });
      }

      req.user = user;
      next();
    } catch (jwtError) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error in authentication.' 
    });
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.userType === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin rights required.' 
    });
  }
};

// Check if user is alumni
const isAlumni = (req, res, next) => {
  if (req.user && req.user.userType === 'alumni') {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Access denied. Alumni access required.' 
    });
  }
};

// Check if user is student
const isStudent = (req, res, next) => {
  if (req.user && req.user.userType === 'student') {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Access denied. Student access required.' 
    });
  }
};

// Check if user is institution
const isInstitution = (req, res, next) => {
  // For this implementation, we'll assume admins can act as institutions
  // In a full implementation, you would check against the Institution collection
  if (req.user && req.user.userType === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Access denied. Institution access required.' 
    });
  }
};

// Check if user is alumni or admin
const isAlumniOrAdmin = (req, res, next) => {
  if (req.user && (req.user.userType === 'alumni' || req.user.userType === 'admin')) {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Access denied. Alumni or admin access required.' 
    });
  }
};

// Optional auth - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    let token = req.header('Authorization');
    
    if (!token) {
      req.user = null;
      return next();
    }

    // Remove 'Bearer ' prefix if present
    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.status === 'approved' && !user.isLocked) {
        req.user = user;
      } else {
        req.user = null;
      }
    } catch (jwtError) {
      req.user = null;
    }
    
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    req.user = null;
    next();
  }
};

// Rate limiting for registration
// Export a dummy middleware that does nothing instead
const registerLimiter = (req, res, next) => {
  // Completely disable rate limiting
  next();
};

// Rate limiting for login attempts
const loginLimiter = require('express-rate-limit')({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: {
    success: false,
    message: 'Too many login attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

// Rate limiting for registration
// const registerLimiter = require('express-rate-limit')({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 3, // Limit each IP to 3 registration requests per hour
//   message: {
//     success: false,
//     message: 'Too many registration attempts. Please try again later.'
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// });

module.exports = {
  generateToken,
  auth,
  isAdmin,
  isAlumni,
  isStudent,
  isInstitution,
  isAlumniOrAdmin,
  optionalAuth,
  loginLimiter,
  registerLimiter
};