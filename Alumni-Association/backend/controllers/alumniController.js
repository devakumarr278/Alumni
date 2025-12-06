const User = require('../models/User');
const { body, validationResult } = require('express-validator');

class AlumniController {
  // Get all alumni with filtering and pagination
  static async getAllAlumni(req, res) {
    try {
      const {
        page = 1,
        limit = 12,
        search,
        department,
        graduationYear,
        location,
        company,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      // Build filter query
      const filter = {
        userType: 'alumni',
        status: 'approved',
        profileVisibility: { $in: ['public', 'alumni-only'] }
      };

      // If user is not authenticated or not alumni/admin/student, only show public profiles
      // Allow students to view alumni profiles as well
      if (!req.user || (req.user.userType !== 'alumni' && req.user.userType !== 'admin' && req.user.userType !== 'student')) {
        filter.profileVisibility = 'public';
      }

      // Search filter
      if (search) {
        filter.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
          { currentPosition: { $regex: search, $options: 'i' } }
        ];
      }

      // Additional filters
      if (department) filter.department = { $regex: department, $options: 'i' };
      if (graduationYear) filter.graduationYear = parseInt(graduationYear);
      if (location) filter.location = { $regex: location, $options: 'i' };
      if (company) filter.company = { $regex: company, $options: 'i' };

      // Sort options
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Execute query with pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const [alumni, totalCount] = await Promise.all([
        User.find(filter)
          .select('-password -emailVerificationToken -resetPasswordToken -loginAttempts -lockUntil')
          .sort(sortOptions)
          .skip(skip)
          .limit(parseInt(limit)),
        User.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(totalCount / parseInt(limit));

      res.json({
        success: true,
        data: {
          alumni,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalCount,
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1
          }
        }
      });

    } catch (error) {
      console.error('Get alumni error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch alumni'
      });
    }
  }

  // Get single alumni profile
  static async getAlumniById(req, res) {
    try {
      const { id } = req.params;

      const alumni = await User.findOne({
        _id: id,
        userType: 'alumni',
        status: 'approved'
      }).select('-password -emailVerificationToken -resetPasswordToken -loginAttempts -lockUntil');

      if (!alumni) {
        return res.status(404).json({
          success: false,
          message: 'Alumni not found'
        });
      }

      // Check visibility permissions
      if (alumni.profileVisibility === 'private') {
        return res.status(403).json({
          success: false,
          message: 'This profile is private'
        });
      }

      // Allow students to view alumni profiles as well
      if (alumni.profileVisibility === 'alumni-only' && 
          (!req.user || (req.user.userType !== 'alumni' && req.user.userType !== 'admin' && req.user.userType !== 'student'))) {
        return res.status(403).json({
          success: false,
          message: 'This profile is only visible to alumni and students'
        });
      }

      res.json({
        success: true,
        data: { alumni }
      });

    } catch (error) {
      console.error('Get alumni by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch alumni profile'
      });
    }
  }

  // Get detailed alumni profile for modal view
  static async getAlumniProfile(req, res) {
    try {
      const { id } = req.params;

      const alumni = await User.findOne({
        _id: id,
        userType: 'alumni',
        status: 'approved'
      }).select('-password -emailVerificationToken -resetPasswordToken -loginAttempts -lockUntil');

      if (!alumni) {
        return res.status(404).json({
          success: false,
          message: 'Alumni not found'
        });
      }

      // Check visibility permissions
      if (alumni.profileVisibility === 'private') {
        return res.status(403).json({
          success: false,
          message: 'This profile is private'
        });
      }

      // Allow students to view alumni profiles as well
      if (alumni.profileVisibility === 'alumni-only' && 
          (!req.user || (req.user.userType !== 'alumni' && req.user.userType !== 'admin' && req.user.userType !== 'student'))) {
        return res.status(403).json({
          success: false,
          message: 'This profile is only visible to alumni and students'
        });
      }

      // Calculate total years of experience
      let totalExperience = 0;
      if (alumni.experiences && Array.isArray(alumni.experiences)) {
        totalExperience = alumni.experiences.reduce((sum, exp) => {
          return sum + (parseInt(exp.experience) || 0);
        }, 0);
      }

      // Find current experience
      let currentExperience = null;
      if (alumni.experiences && Array.isArray(alumni.experiences)) {
        currentExperience = alumni.experiences.find(exp => exp.isCurrent) || 
                          (alumni.experiences.length > 0 ? alumni.experiences[0] : null);
      }

      // Prepare the response data
      const profileData = {
        id: alumni._id,
        firstName: alumni.firstName,
        lastName: alumni.lastName,
        name: `${alumni.firstName} ${alumni.lastName}`,
        email: alumni.email,
        phone: alumni.phone,
        profileImage: alumni.profilePicture,
        graduationYear: alumni.graduationYear,
        department: alumni.department,
        major: alumni.department || 'N/A',
        currentPosition: currentExperience?.role || alumni.currentPosition || 'N/A',
        currentCompany: currentExperience?.company || alumni.company || 'N/A',
        location: currentExperience?.location || alumni.location || 'N/A',
        bio: alumni.bio,
        linkedinProfile: alumni.linkedinProfile,
        isVerified: alumni.status === 'approved',
        experiences: alumni.experiences || [],
        skills: alumni.skills || [],
        totalExperience: totalExperience,
        profileVisibility: alumni.profileVisibility,
        mentorship: {
          availability: alumni.mentorship?.availability || [],
          public: alumni.mentorship?.public || false
        },
        badges: alumni.badges || []
      };

      res.json({
        success: true,
        data: { alumni: profileData }
      });

    } catch (error) {
      console.error('Get alumni profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch alumni profile'
      });
    }
  }

  // Update alumni profile
  static async updateProfile(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Validate that the user can update this profile (either the owner or an admin)
      if (req.user.id !== id && req.user.userType !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only update your own profile.'
        });
      }

      // Remove fields that shouldn't be updated
      const allowedUpdates = [
        'firstName', 'lastName', 'phone', 'bio', 'currentPosition', 
        'company', 'location', 'linkedinProfile', 'profileVisibility', 
        'experiences', 'skills', 'graduationYear', 'department'
      ];
      
      const filteredUpdates = {};
      Object.keys(updates).forEach(key => {
        if (allowedUpdates.includes(key)) {
          filteredUpdates[key] = updates[key];
        }
      });

      // Update the alumni profile
      const alumni = await User.findByIdAndUpdate(
        id,
        { $set: filteredUpdates },
        { new: true, runValidators: true }
      ).select('-password -emailVerificationToken -resetPasswordToken -loginAttempts -lockUntil');

      if (!alumni) {
        return res.status(404).json({
          success: false,
          message: 'Alumni not found'
        });
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { alumni }
      });

    } catch (error) {
      console.error('Update alumni profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      });
    }
  }

  // Get alumni statistics
  static async getAlumniStats(req, res) {
    try {
      const [
        totalAlumni,
        departmentStats,
        graduationYearStats,
        locationStats,
        recentAlumni
      ] = await Promise.all([
        // Total alumni count
        User.countDocuments({ 
          userType: 'alumni', 
          status: 'approved',
          profileVisibility: { $in: ['public', 'alumni-only'] }
        }),
        
        // Department distribution
        User.aggregate([
          { 
            $match: { 
              userType: 'alumni', 
              status: 'approved',
              profileVisibility: { $in: ['public', 'alumni-only'] }
            } 
          },
          { $group: { _id: '$department', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]),
        
        // Graduation year distribution
        User.aggregate([
          { 
            $match: { 
              userType: 'alumni', 
              status: 'approved',
              profileVisibility: { $in: ['public', 'alumni-only'] }
            } 
          },
          { $group: { _id: '$graduationYear', count: { $sum: 1 } } },
          { $sort: { _id: -1 } },
          { $limit: 10 }
        ]),
        
        // Location distribution
        User.aggregate([
          { 
            $match: { 
              userType: 'alumni', 
              status: 'approved',
              location: { $exists: true, $ne: '' },
              profileVisibility: { $in: ['public', 'alumni-only'] }
            } 
          },
          { $group: { _id: '$location', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]),
        
        // Recent alumni (last 5)
        User.find({ 
          userType: 'alumni', 
          status: 'approved',
          profileVisibility: { $in: ['public', 'alumni-only'] }
        })
        .select('firstName lastName profilePicture graduationYear department')
        .sort({ createdAt: -1 })
        .limit(5)
      ]);

      res.json({
        success: true,
        data: {
          totalAlumni,
          departmentStats,
          graduationYearStats,
          locationStats,
          recentAlumni
        }
      });

    } catch (error) {
      console.error('Get alumni stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch alumni statistics'
      });
    }
  }

  // Get filter options for alumni directory
  static async getFilterOptions(req, res) {
    try {
      const [departments, graduationYears, locations, companies] = await Promise.all([
        // Unique departments
        User.distinct('department', {
          userType: 'alumni',
          status: 'approved',
          profileVisibility: { $in: ['public', 'alumni-only'] }
        }),
        
        // Unique graduation years
        User.distinct('graduationYear', {
          userType: 'alumni',
          status: 'approved',
          profileVisibility: { $in: ['public', 'alumni-only'] }
        }),
        
        // Unique locations
        User.distinct('location', {
          userType: 'alumni',
          status: 'approved',
          location: { $exists: true, $ne: '' },
          profileVisibility: { $in: ['public', 'alumni-only'] }
        }),
        
        // Unique companies
        User.distinct('company', {
          userType: 'alumni',
          status: 'approved',
          company: { $exists: true, $ne: '' },
          profileVisibility: { $in: ['public', 'alumni-only'] }
        })
      ]);

      res.json({
        success: true,
        data: {
          departments: departments.filter(Boolean).sort(),
          graduationYears: graduationYears.filter(Boolean).sort((a, b) => b - a),
          locations: locations.filter(Boolean).sort(),
          companies: companies.filter(Boolean).sort()
        }
      });

    } catch (error) {
      console.error('Get filter options error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch filter options'
      });
    }
  }

  // Search alumni with advanced filters
  static async searchAlumni(req, res) {
    try {
      const {
        query,
        department,
        graduationYear,
        location,
        company,
        skills,
        limit = 10
      } = req.query;

      if (!query || query.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Search query must be at least 2 characters long'
        });
      }

      // Build search filter
      const filter = {
        userType: 'alumni',
        status: 'approved',
        profileVisibility: { $in: ['public', 'alumni-only'] }
      };

      // Allow students to view alumni profiles as well
      if (!req.user || (req.user.userType !== 'alumni' && req.user.userType !== 'admin' && req.user.userType !== 'student')) {
        filter.profileVisibility = 'public';
      }

      // Text search
      filter.$or = [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } },
        { currentPosition: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } }
      ];

      // Additional filters
      if (department) filter.department = { $regex: department, $options: 'i' };
      if (graduationYear) filter.graduationYear = parseInt(graduationYear);
      if (location) filter.location = { $regex: location, $options: 'i' };
      if (company) filter.company = { $regex: company, $options: 'i' };

      const alumni = await User.find(filter)
        .select('firstName lastName profilePicture department graduationYear currentPosition company location')
        .limit(parseInt(limit))
        .sort({ firstName: 1 });

      res.json({
        success: true,
        data: { alumni }
      });

    } catch (error) {
      console.error('Search alumni error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search alumni'
      });
    }
  }
}

module.exports = { AlumniController };