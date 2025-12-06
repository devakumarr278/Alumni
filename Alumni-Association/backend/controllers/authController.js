const User = require('../models/User');
const Institution = require('../models/Institution');
const emailService = require('../services/emailService');
const { generateToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');

class AuthController {
  // Register new user
  static async register(req, res) {
    try {
      console.log('=== REGISTRATION ATTEMPT ===');
      console.log('Registration request received:', req.body);
      console.log('Request method:', req.method);
      console.log('Request URL:', req.url);
      console.log('Request IP:', req.ip);
      console.log('Request headers:', req.headers);
      console.log('Request originalUrl:', req.originalUrl);
      console.log('Request baseUrl:', req.baseUrl);
      
      // Log individual fields for debugging
      console.log('Fields received:');
      console.log('- firstName:', req.body.firstName);
      console.log('- lastName:', req.body.lastName);
      console.log('- email:', req.body.email);
      console.log('- password:', req.body.password ? '[HIDDEN]' : 'MISSING');
      console.log('- userType:', req.body.userType);
      console.log('- collegeName:', req.body.collegeName);
      console.log('- rollNumber:', req.body.rollNumber);
      console.log('- department:', req.body.department);
      console.log('- graduationYear:', req.body.graduationYear);
      console.log('- currentYear:', req.body.currentYear);
      console.log('- phone:', req.body.phone);
      console.log('- currentPosition:', req.body.currentPosition);
      console.log('- company:', req.body.company);
      console.log('- location:', req.body.location);
      console.log('- institutionType:', req.body.institutionType);
      console.log('- establishedYear:', req.body.establishedYear);
      console.log('- address:', req.body.address);
      console.log('- website:', req.body.website);
      console.log('- institutionCode:', req.body.institutionCode);
      
      // Validation
      const errors = validationResult(req);
      console.log('Validation result - isEmpty:', errors.isEmpty());
      console.log('Validation result - errors:', errors.array());
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        // Log each error individually for better debugging
        errors.array().forEach((error, index) => {
          console.log(`Validation error ${index + 1}:`, {
            field: error.param,
            message: error.msg,
            value: error.value,
            location: error.location
          });
        });
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const {
        firstName,
        lastName,
        email,
        password,
        userType,
        collegeName,
        rollNumber,
        department,
        graduationYear,
        currentYear,
        phone,
        currentPosition,
        company,
        location,
        institutionType,
        establishedYear,
        address,
        website,
        institutionCode
      } = req.body;

      console.log('Extracted data:', {
        firstName: firstName || (userType === 'admin' && collegeName ? collegeName.split(' ').slice(0, 1).join(' ') : 'Institution'),
        lastName: lastName || (userType === 'admin' && collegeName ? collegeName.split(' ').slice(1).join(' ') || 'Admin' : 'User'),
        email,
        password: password ? '[HIDDEN]' : null,
        userType,
        collegeName,
        rollNumber,
        department,
        graduationYear,
        currentYear,
        phone,
        currentPosition,
        company,
        location,
        institutionType,
        establishedYear,
        address,
        website,
        institutionCode
      });

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser && existingUser.isEmailVerified) {
        console.log('User already exists with verified email:', email);
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists and is verified. Please login instead.'
        });
      } else if (existingUser && !existingUser.isEmailVerified) {
        // If user exists but email is not verified, allow re-registration
        console.log('User exists but email not verified, allowing re-registration:', email);
        // Delete the existing unverified user to allow re-registration
        await User.deleteOne({ _id: existingUser._id });
      }

      // Check if roll number is already taken at this college
      const existingRollNumber = await User.findOne({ 
        collegeName, 
        rollNumber,
        userType 
      });
      if (existingRollNumber) {
        console.log('Roll number already exists:', rollNumber);
        return res.status(400).json({
          success: false,
          message: 'This roll number is already registered for your college'
        });
      }

      // Set status based on user type
      // Alumni need approval, others are auto-approved
      // For institutions, we want to ensure manual approval only
      const status = userType === 'alumni' ? 'pending' : 'approved';
      console.log('Setting user status to:', status);

      // Create new user
      const userData = {
        firstName: firstName?.trim() || (userType === 'admin' && collegeName ? collegeName.split(' ').slice(0, 1).join(' ') : 'Institution'),
        lastName: lastName?.trim() || (userType === 'admin' && collegeName ? collegeName.split(' ').slice(1).join(' ') || 'Admin' : 'User'),
        email: email.toLowerCase().trim(),
        password,
        userType,
        status, // Set status based on user type - always pending for alumni
        collegeName: collegeName?.trim(),
        rollNumber: rollNumber ? rollNumber.trim() : undefined,
        department: department ? department.trim() : undefined,
        phone: phone?.trim(),
        // Institution-specific fields
        institutionType: institutionType ? institutionType.trim() : undefined,
        establishedYear: establishedYear ? parseInt(establishedYear) : undefined,
        address: address ? address.trim() : undefined,
        website: website ? website.trim() : undefined,
        institutionCode: institutionCode ? institutionCode.trim() : undefined
      };

      console.log('Final user data to be saved:', JSON.stringify(userData, null, 2));

      console.log('User data to save:', userData);

      // Add institutionId for alumni by matching college name
      if (userType === 'alumni') {
        // Try to find an institution that matches the college name
        const institution = await Institution.findOne({
          $or: [
            { name: { $regex: collegeName, $options: 'i' } },
            { name: { $regex: collegeName.split(' ')[0], $options: 'i' } } // Match by first word
          ]
        });
        
        if (institution) {
          userData.institutionId = institution._id;
          console.log('Found institution:', institution.name);
        } else {
          // If no exact match, assign to the first available institution as fallback
          const fallbackInstitution = await Institution.findOne();
          if (fallbackInstitution) {
            userData.institutionId = fallbackInstitution._id;
            console.log('Using fallback institution:', fallbackInstitution.name);
          }
        }
      }

      // Add conditional fields based on user type
      if (userType === 'alumni' && graduationYear) {
        userData.graduationYear = graduationYear;
        if (currentPosition) userData.currentPosition = currentPosition.trim();
        if (company) userData.company = company.trim();
        if (location) userData.location = location.trim();
      } else if (userType === 'student' && currentYear) {
        userData.currentYear = currentYear;
      }

      const user = new User(userData);
      console.log('Created user object');

      // Generate email verification token
      const verificationToken = user.generateEmailVerificationToken();
      console.log('Generated verification token:', verificationToken); // Log the token for debugging
      console.log('Token expires at:', new Date(user.emailVerificationExpires)); // Log expiration time
      
      // Also generate OTP code for mobile-friendly verification
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
      user.verificationCode = verificationCode;
      user.codeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      
      await user.save();
      console.log('User saved successfully');

      // Create notification for institution if user is alumni
      if (userType === 'alumni' && user.institutionId) {
        const Notification = require('../models/Notification');
        await Notification.create({
          institutionId: user.institutionId,
          userId: user._id, // Add the required userId field
          type: 'alumni_pending_verification',
          title: 'New Alumni Registration', // Add the required title field
          message: `New alumni ${user.firstName} ${user.lastName} awaiting verification.`,
          userRef: user._id
        });
        console.log('Created alumni notification');
      }

      // Send verification email with both link and code
      const emailResult = await emailService.sendVerificationEmail(
        user.email,
        user.userType,
        verificationToken,
        user.fullName,
        verificationCode // Pass the OTP code
      );

      if (!emailResult.success) {
        console.error('Failed to send verification email:', emailResult.error);
        // Don't fail registration if email fails
      }

      // Send admin notification (for non-admin users)
      if (userType !== 'admin') {
        const adminUsers = await User.find({ userType: 'admin', status: 'approved' });
        for (const admin of adminUsers) {
          await emailService.sendAdminApprovalNotification(admin.email, {
            fullName: user.fullName,
            email: user.email,
            userType: user.userType,
            collegeName: user.collegeName,
            rollNumber: user.rollNumber,
            department: user.department,
            createdAt: user.createdAt
          });
        }
        console.log('Sent admin notifications');
        
        // Send institution notification for alumni
        if (userType === 'alumni' && user.institutionId) {
          // Get the institution details
          const institution = await Institution.findById(user.institutionId);
          if (institution) {
            await emailService.sendInstitutionNotification(institution.email, {
              fullName: user.fullName,
              email: user.email,
              collegeName: user.collegeName,
              department: user.department,
              graduationYear: user.graduationYear,
              createdAt: user.createdAt
            });
            console.log('Sent institution notification');
          }
        }
      }

      // Log final user data being saved
      console.log('Final user data saved:', JSON.stringify(user, null, 2));
      
      res.status(201).json({
        success: true,
        message: userType === 'alumni' 
          ? 'Registration successful! Please check your email to verify your account and wait for institution approval.' 
          : 'Registration successful! Please check your email to verify your account.',
        data: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          userType: user.userType,
          status: user.status,
          isEmailVerified: user.isEmailVerified,
          collegeName: user.collegeName
        }
      });

    } catch (error) {
      console.error('=== REGISTRATION ERROR ===');
      console.error('Registration error:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Provide more specific error messages based on error type
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.name === 'ValidationError') {
        errorMessage = 'Validation failed: ' + Object.values(error.errors).map(err => err.message).join(', ');
      } else if (error.name === 'MongoError' && error.code === 11000) {
        errorMessage = 'A user with this email or roll number already exists.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      res.status(500).json({
        success: false,
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          name: error.name,
          stack: error.stack
        } : undefined
      });
    }
  }

  // Login user
  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { email, password, role } = req.body;

      // Find user by email and role if provided
      let userQuery = { email: email.toLowerCase() };
      if (role) {
        // Map frontend roles to backend userType
        const roleMap = {
          'student': 'student',
          'alumni': 'alumni',
          'institution': 'admin' // Institution is mapped to admin in backend
        };
        userQuery.userType = roleMap[role] || role;
      }
      
      const user = await User.findOne(userQuery);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check if email is verified
      if (!user.isEmailVerified) {
        return res.status(401).json({
          success: false,
          message: 'Please verify your email before logging in'
        });
      }

      // Check if user is approved (for alumni)
      if (user.userType === 'alumni' && user.status !== 'approved') {
        if (user.status === 'pending') {
          return res.status(403).json({
            success: false,
            message: 'Your account is pending approval from your institution. Please wait for approval before logging in.'
          });
        } else if (user.status === 'rejected') {
          return res.status(403).json({
            success: false,
            message: 'Your account has been rejected. Please contact support for more information.'
          });
        } else {
          return res.status(403).json({
            success: false,
            message: 'Your account is not approved. Please contact support for more information.'
          });
        }
      }

      // Check if account is locked
      if (user.isLocked) {
        return res.status(403).json({
          success: false,
          message: 'Account is locked due to too many failed login attempts. Please try again later.'
        });
      }

      // Compare password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        // Increment login attempts
        await user.incLoginAttempts();
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Reset login attempts on successful login
      await user.resetLoginAttempts();

      // Generate JWT token
      const token = generateToken(user);

      // Update last login
      user.lastLogin = Date.now();
      await user.save();

      // Map backend userType to frontend role
      const roleMap = {
        'student': 'student',
        'alumni': 'alumni',
        'admin': 'institution' // Backend admin maps to frontend institution
      };

      res.json({
        success: true,
        token,
        data: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: roleMap[user.userType] || user.userType,
          userType: user.userType,
          status: user.status,
          isEmailVerified: user.isEmailVerified,
          collegeName: user.collegeName,
          profilePicture: user.profilePicture,
          department: user.department,
          graduationYear: user.graduationYear,
          currentPosition: user.currentPosition,
          company: user.company,
          location: user.location
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed. Please try again.'
      });
    }
  }

  // Get current user profile
  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id)
        .select('-password -emailVerificationToken -emailVerificationExpires -resetPasswordToken -resetPasswordExpires -verificationCode -codeExpires')
        .populate('institutionId', 'name email')
        .populate('followers', 'firstName lastName profilePicture')
        .populate('following', 'firstName lastName profilePicture');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Map backend userType to frontend role
      const roleMap = {
        'student': 'student',
        'alumni': 'alumni',
        'admin': 'institution' // Backend admin maps to frontend institution
      };

      // Return the response with the user data in the 'data' field to match frontend expectations
      res.json({
        success: true,
        data: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: roleMap[user.userType] || user.userType,
          userType: user.userType,
          status: user.status,
          isEmailVerified: user.isEmailVerified,
          collegeName: user.collegeName,
          rollNumber: user.rollNumber,
          department: user.department,
          graduationYear: user.graduationYear,
          currentYear: user.currentYear,
          currentPosition: user.currentPosition,
          company: user.company,
          location: user.location,
          phone: user.phone,
          linkedinProfile: user.linkedinProfile,
          profilePicture: user.profilePicture,
          bio: user.bio,
          age: user.age,
          githubProfile: user.githubProfile,
          experiences: user.experiences,
          skills: user.skills,
          interests: user.interests,
          followers: user.followers,
          following: user.following,
          profileVisibility: user.profileVisibility,
          mentorship: user.mentorship,
          institutionId: user.institutionId,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch profile'
      });
    }
  }

  // Get any user profile by ID (for viewing other users' profiles)
  static async getUserProfileById(req, res) {
    try {
      const { id } = req.params;
      
      // Check if the requested ID is the same as the current user's ID
      if (id === req.user.id) {
        // If it's the same user, use the existing getProfile method
        return await AuthController.getProfile(req, res);
      }

      // Find the user by ID
      const user = await User.findById(id)
        .select('-password -emailVerificationToken -emailVerificationExpires -resetPasswordToken -resetPasswordExpires -verificationCode -codeExpires')
        .populate('institutionId', 'name email')
        .populate('followers', 'firstName lastName profilePicture')
        .populate('following', 'firstName lastName profilePicture');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // For privacy, we only show limited information for other users
      // unless the current user is an admin or from the same institution (for alumni)
      const isSameInstitution = req.user.institutionId && user.institutionId && 
                               req.user.institutionId.toString() === user.institutionId.toString();
      
      const canViewFullProfile = req.user.userType === 'admin' || 
                                isSameInstitution || 
                                user.profileVisibility === 'public' ||
                                (user.profileVisibility === 'alumni-only' && req.user.userType === 'alumni');

      // Prepare the response data based on visibility settings
      const profileData = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        status: user.status,
        isEmailVerified: user.isEmailVerified,
        collegeName: user.collegeName,
        department: user.department,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      };

      // Add additional fields based on visibility permissions
      if (canViewFullProfile) {
        profileData.rollNumber = user.rollNumber;
        profileData.graduationYear = user.graduationYear;
        profileData.currentYear = user.currentYear;
        profileData.currentPosition = user.currentPosition;
        profileData.company = user.company;
        profileData.location = user.location;
        profileData.phone = user.phone;
        profileData.linkedinProfile = user.linkedinProfile;
        profileData.bio = user.bio;
        profileData.age = user.age;
        profileData.githubProfile = user.githubProfile;
        profileData.experiences = user.experiences;
        profileData.skills = user.skills;
        profileData.interests = user.interests;
        profileData.followers = user.followers;
        profileData.following = user.following;
        profileData.profileVisibility = user.profileVisibility;
        profileData.mentorship = user.mentorship;
        profileData.institutionId = user.institutionId;
      }

      // Map backend userType to frontend role
      const roleMap = {
        'student': 'student',
        'alumni': 'alumni',
        'admin': 'institution' // Backend admin maps to frontend institution
      };

      res.json({
        success: true,
        data: profileData
      });
    } catch (error) {
      console.error('Get user profile by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user profile'
      });
    }
  }

  // Update current user profile
  static async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const userId = req.user.id;
      const updateData = req.body;

      // Remove fields that shouldn't be updated directly
      delete updateData.email;
      delete updateData.userType;
      delete updateData.status;
      delete updateData.isEmailVerified;
      delete updateData.emailVerificationToken;
      delete updateData.emailVerificationExpires;
      delete updateData.resetPasswordToken;
      delete updateData.resetPasswordExpires;
      delete updateData.verificationCode;
      delete updateData.codeExpires;
      delete updateData.institutionId;
      delete updateData.followers;
      delete updateData.following;
      delete updateData.createdAt;
      delete updateData.updatedAt;

      // Trim string fields
      Object.keys(updateData).forEach(key => {
        if (typeof updateData[key] === 'string') {
          updateData[key] = updateData[key].trim();
        }
      });

      // Handle password update separately
      if (updateData.password) {
        // For security, we should require current password for password change
        // This would require additional validation
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }
        
        // Compare current password
        const isMatch = await user.comparePassword(updateData.currentPassword);
        if (!isMatch) {
          return res.status(401).json({
            success: false,
            message: 'Current password is incorrect'
          });
        }
        
        // Set new password (will be hashed by pre-save hook)
        user.password = updateData.password;
        await user.save();
        
        // Remove password fields from updateData
        delete updateData.password;
        delete updateData.currentPassword;
      }

      // Update user
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password -emailVerificationToken -emailVerificationExpires -resetPasswordToken -resetPasswordExpires -verificationCode -codeExpires');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Map backend userType to frontend role
      const roleMap = {
        'student': 'student',
        'alumni': 'alumni',
        'admin': 'institution' // Backend admin maps to frontend institution
      };

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: roleMap[user.userType] || user.userType,
          userType: user.userType,
          status: user.status,
          isEmailVerified: user.isEmailVerified,
          collegeName: user.collegeName,
          rollNumber: user.rollNumber,
          department: user.department,
          graduationYear: user.graduationYear,
          currentYear: user.currentYear,
          currentPosition: user.currentPosition,
          company: user.company,
          location: user.location,
          phone: user.phone,
          linkedinProfile: user.linkedinProfile,
          profilePicture: user.profilePicture,
          bio: user.bio,
          age: user.age,
          githubProfile: user.githubProfile,
          experiences: user.experiences,
          skills: user.skills,
          interests: user.interests,
          followers: user.followers,
          following: user.following,
          profileVisibility: user.profileVisibility,
          mentorship: user.mentorship,
          institutionId: user.institutionId,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: messages
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      });
    }
  }

  // Verify email with token
  static async verifyEmail(req, res) {
    try {
      const { token, email } = req.query;

      if (!token || !email) {
        return res.status(400).json({
          success: false,
          message: 'Verification token and email are required'
        });
      }

      const user = await User.findOne({
        email: email.toLowerCase(),
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired verification token'
        });
      }

      // Mark email as verified
      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      
      await user.save();

      // Auto-login after email verification
      const tokenJWT = generateToken(user);

      // Map backend userType to frontend role
      const roleMap = {
        'student': 'student',
        'alumni': 'alumni',
        'admin': 'institution' // Backend admin maps to frontend institution
      };

      res.json({
        success: true,
        message: 'Email verified successfully',
        token: tokenJWT,
        data: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: roleMap[user.userType] || user.userType,
          userType: user.userType,
          status: user.status,
          isEmailVerified: user.isEmailVerified,
          collegeName: user.collegeName
        }
      });
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Email verification failed'
      });
    }
  }

  // Verify email with code (OTP)
  static async verifyEmailWithCode(req, res) {
    try {
      const { code, email } = req.body;

      if (!code || !email) {
        return res.status(400).json({
          success: false,
          message: 'Verification code and email are required'
        });
      }

      const user = await User.findOne({
        email: email.toLowerCase(),
        verificationCode: code,
        codeExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired verification code'
        });
      }

      // Mark email as verified
      user.isEmailVerified = true;
      user.verificationCode = undefined;
      user.codeExpires = undefined;
      
      await user.save();

      // Auto-login after email verification
      const tokenJWT = generateToken(user);

      // Map backend userType to frontend role
      const roleMap = {
        'student': 'student',
        'alumni': 'alumni',
        'admin': 'institution' // Backend admin maps to frontend institution
      };

      res.json({
        success: true,
        message: 'Email verified successfully',
        token: tokenJWT,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: roleMap[user.userType] || user.userType,
          userType: user.userType,
          status: user.status,
          isEmailVerified: user.isEmailVerified,
          collegeName: user.collegeName
        }
      });
    } catch (error) {
      console.error('Email verification with code error:', error);
      res.status(500).json({
        success: false,
        message: 'Email verification failed'
      });
    }
  }

  // Resend verification email
  static async resendVerificationEmail(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (user.isEmailVerified) {
        return res.status(400).json({
          success: false,
          message: 'Email is already verified'
        });
      }

      // Generate new verification token
      const verificationToken = user.generateEmailVerificationToken();
      
      // Also generate new OTP code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
      user.verificationCode = verificationCode;
      user.codeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      
      await user.save();

      // Send verification email with both link and code
      const emailResult = await emailService.sendVerificationEmail(
        user.email,
        user.userType,
        verificationToken,
        user.fullName,
        verificationCode // Pass the OTP code
      );

      if (emailResult.success) {
        res.json({
          success: true,
          message: 'Verification email sent successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to send verification email'
        });
      }
    } catch (error) {
      console.error('Resend verification email error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to resend verification email'
      });
    }
  }

  // Forgot password
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        // Don't reveal if user exists or not for security
        return res.json({
          success: true,
          message: 'If an account exists with that email, a password reset link has been sent.'
        });
      }

      // Generate reset token
      const resetToken = user.generatePasswordResetToken();
      await user.save();

      // Send reset email
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${user.email}`;
      
      const emailResult = await emailService.sendPasswordResetEmail(
        user.email,
        resetToken,
        user.fullName
      );

      if (emailResult.success) {
        res.json({
          success: true,
          message: 'Password reset email sent successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to send password reset email'
        });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process password reset request'
      });
    }
  }

  // Reset password
  static async resetPassword(req, res) {
    try {
      const { token, email, password } = req.body;

      if (!token || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Token, email, and password are required'
        });
      }

      const user = await User.findOne({
        email: email.toLowerCase(),
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token'
        });
      }

      // Set new password (will be hashed by pre-save hook)
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      
      await user.save();

      res.json({
        success: true,
        message: 'Password reset successfully'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reset password'
      });
    }
  }
}

module.exports = AuthController;