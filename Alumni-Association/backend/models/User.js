const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Experience sub-schema
const experienceSchema = new mongoose.Schema({
  company: String,
  role: String,
  location: String,
  experience: String,
  description: String,
  isCurrent: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  
  // User Type and Status
  userType: {
    type: String,
    enum: ['student', 'alumni', 'admin'],
    required: [true, 'User type is required']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  
  // Institutional Information
  collegeName: {
    type: String,
    required: [true, 'College name is required'],
    trim: true
  },
  rollNumber: {
    type: String,
    required: function() {
      // Only required for alumni, not for students
      return this.userType === 'alumni';
    },
    trim: true
  },
  department: {
    type: String,
    required: function() {
      return this.userType === 'student' || this.userType === 'alumni';
    },
    trim: true
  },

  // Academic Information
  graduationYear: {
    type: Number,
    required: function() {
      return this.userType === 'alumni';
    }
  },
  currentYear: {
    type: String
  },
  
  // Professional Information (for alumni)
  currentPosition: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  
  // Contact Information
  phone: {
    type: String,
    trim: true
  },
  linkedinProfile: {
    type: String,
    trim: true
  },
  
  // Profile
  profilePicture: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  age: {
    type: Number
  },
  githubProfile: {
    type: String,
    trim: true
  },
  
  // Professional Experiences and Skills
  experiences: [experienceSchema],
  skills: [{
    type: String,
    trim: true
  }],
  interests: [{
    type: String,
    trim: true
  }],
  
  // Followers and Following (for follow functionality)
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Verification
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    default: null
  },
  emailVerificationExpires: {
    type: Date,
    default: null
  },
  
  // OTP Verification (new)
  verificationCode: {
    type: String,
    default: null
  },
  codeExpires: {
    type: Date,
    default: null
  },

  // Password Reset
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  },
  
  // Privacy Settings
  profileVisibility: {
    type: String,
    enum: ['public', 'alumni-only', 'private'],
    default: 'alumni-only'
  },
  
  // Mentorship Settings
  mentorship: {
    availability: [{
      day: String,
      startTime: String,
      endTime: String,
      timezone: String,
      capacity: {
        type: Number,
        default: 1
      }
    }],
    public: {
      type: Boolean,
      default: false
    }
  },
  
  // Badges and Achievements
  badges: [{
    name: String,
    points: Number,
    awardedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Metadata
  lastLogin: {
    type: Date,
    default: null
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  },
  
  // AI Verification Score
  aiScore: {
    type: Number,
    min: 0,
    max: 100
  },
  
  // Institution reference (new field)
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: function() { return this.userType === 'alumni'; }
  },
  
  // Institution-specific fields for admin users
  institutionType: {
    type: String,
    trim: true,
    required: function() { return this.userType === 'admin'; }
  },
  establishedYear: {
    type: Number,
    required: function() { return this.userType === 'admin'; }
  },
  address: {
    type: String,
    trim: true,
    required: function() { return this.userType === 'admin'; }
  },
  website: {
    type: String,
    trim: true
  },
  institutionCode: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!candidatePassword) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Method to generate email verification token
userSchema.methods.generateEmailVerificationToken = function() {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = token;
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return token;
};

// Method to generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  
  this.resetPasswordToken = token;
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  
  return token;
};

// Indexes for performance
userSchema.index({ userType: 1, status: 1 });
userSchema.index({ collegeName: 1, rollNumber: 1 });
userSchema.index({ graduationYear: 1 });
userSchema.index({ department: 1 });
userSchema.index({ followers: 1 });
userSchema.index({ following: 1 });

module.exports = mongoose.model('User', userSchema);