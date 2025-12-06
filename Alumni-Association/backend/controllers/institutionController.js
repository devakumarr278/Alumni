const User = require('../models/User');
const Institution = require('../models/Institution');
const emailService = require('../services/emailService');

class InstitutionController {
  // Get institution profile
  static async getInstitutionProfile(req, res) {
    try {
      // For admin users, we can get the institution data from the User model
      // or we can look up the corresponding institution in the Institution collection
      const user = await User.findById(req.user.id).select('-password');
      
      if (!user || user.userType !== 'admin') {
        return res.status(404).json({
          success: false,
          message: 'Institution not found'
        });
      }
      
      // Try to find the corresponding institution in the Institution collection
      const institution = await Institution.findOne({ email: user.email });
      
      // If not found, create a response with user data
      const institutionData = {
        name: institution ? institution.name : (user.collegeName || `${user.firstName} ${user.lastName}`),
        email: user.email,
        collegeName: user.collegeName,
        institutionType: user.institutionType,
        establishedYear: user.establishedYear,
        address: user.address,
        website: user.website,
        institutionCode: user.institutionCode
      };
      
      res.json({
        success: true,
        data: institutionData
      });
    } catch (error) {
      console.error('Get institution profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get institution profile'
      });
    }
  }
  
  // Get all pending alumni for verification
  static async getPendingAlumni(req, res) {
    try {
      // Get pending alumni for the specific institution based on collegeName
      const pendingAlumni = await User.find({ 
        userType: 'alumni', 
        status: 'pending',
        collegeName: req.user.collegeName
      }).select('-password');

      res.json({
        success: true,
        data: pendingAlumni
      });
    } catch (error) {
      console.error('Get pending alumni error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch pending alumni'
      });
    }
  }

  // Verify alumni (approve/reject) - Manual approval only
  static async verifyAlumni(req, res) {
    try {
      const { alumniId } = req.params;
      const { decision } = req.body; // Only decision: "approve" or "reject"

      // Find the alumni
      const alumni = await User.findById(alumniId);
      if (!alumni) {
        return res.status(404).json({
          success: false,
          message: 'Alumni not found'
        });
      }

      // Check if the logged-in institution can verify this alumni
      if (alumni.collegeName !== req.user.collegeName) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to verify this alumni.'
        });
      }

      // Check if alumni is already verified
      if (alumni.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Alumni is already verified'
        });
      }

      // Verify that the user is an alumni
      if (alumni.userType !== 'alumni') {
        return res.status(400).json({
          success: false,
          message: 'User is not an alumni'
        });
      }

      // Update alumni status based on decision - Manual approval only
      if (decision === 'approve') {
        alumni.status = 'approved';
      } else {
        alumni.status = 'rejected';
      }

      // Generate AI score if not already present (for display purposes only)
      if (!alumni.aiScore) {
        // Simple AI score simulation (in a real system, this would be more complex)
        alumni.aiScore = Math.floor(Math.random() * 40) + 60; // Random score between 60-99
      }

      await alumni.save();

      // Send notification to alumni
      if (alumni.status === 'approved') {
        await emailService.sendAlumniApprovalNotification(alumni.email, {
          fullName: alumni.fullName,
          method: 'manual' // Always manual
        });
      } else if (alumni.status === 'rejected') {
        await emailService.sendAlumniRejectionNotification(alumni.email, {
          fullName: alumni.fullName
        });
      }

      res.json({
        success: true,
        message: `Alumni ${decision === 'approve' ? 'approved' : 'rejected'} successfully`,
        data: alumni
      });
    } catch (error) {
      console.error('Verify alumni error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify alumni'
      });
    }
  }

  // Get notifications for institution
  static async getNotifications(req, res) {
    try {
      // Get actual notifications for this institution
      const Notification = require('../models/Notification');
      let notifications = await Notification.find({ 
        institutionId: req.user._id 
      }).sort({ createdAt: -1 });

      // If no specific notifications, create a simulated one based on pending alumni
      if (notifications.length === 0) {
        const pendingCount = await User.countDocuments({ 
          userType: 'alumni', 
          status: 'pending',
          institutionId: req.user._id
        });

        if (pendingCount > 0) {
          notifications.push({
            id: Date.now(),
            message: `You have ${pendingCount} alumni awaiting verification.`,
            type: 'pending_approval',
            timestamp: new Date()
          });
        }
      }

      res.json({
        success: true,
        data: notifications
      });
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch notifications'
      });
    }
  }
}

module.exports = {
  InstitutionController
};