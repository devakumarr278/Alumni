const User = require('../models/User');
const Follow = require('../models/Follow');
const { NotificationController } = require('./notificationController');
const mongoose = require('mongoose');

// We'll initialize this when the server starts
let webSocketServer = null;

// Function to set the WebSocket server instance
const setWebSocketServer = (wss) => {
  webSocketServer = wss;
};

class FollowController {
  // Follow an alumni
  static async followAlumni(req, res) {
    try {
      const { alumniId } = req.body;
      const userId = req.user.id;

      // Validate alumniId
      if (!alumniId) {
        return res.status(400).json({
          success: false,
          message: 'Alumni ID is required'
        });
      }

      // Check if user is trying to follow themselves
      if (userId === alumniId) {
        return res.status(400).json({
          success: false,
          message: 'You cannot follow yourself'
        });
      }

      // Check if alumni exists and is approved
      const alumni = await User.findOne({
        _id: alumniId,
        userType: 'alumni',
        status: 'approved'
      });

      if (!alumni) {
        return res.status(404).json({
          success: false,
          message: 'Alumni not found'
        });
      }

      // Check if already following or request pending
      const existingFollow = await Follow.findOne({
        followerId: userId,
        followingId: alumniId
      });

      if (existingFollow) {
        if (existingFollow.status === 'approved') {
          return res.json({
            success: true,
            data: { alreadyFollowing: true },
            message: 'Already following this alumni'
          });
        } else if (existingFollow.status === 'pending') {
          return res.json({
            success: true,
            data: { alreadyFollowing: false },
            message: 'Follow request already sent and pending approval'
          });
        }
      }

      // Create follow request
      const followRequest = new Follow({
        followerId: userId,
        followingId: alumniId,
        status: 'pending'
      });

      await followRequest.save();
      console.log('Follow request created with ID:', followRequest._id);
      console.log('Follow request details:', {
        followerId: followRequest.followerId,
        followingId: followRequest.followingId,
        status: followRequest.status
      });

      // Create notification for the alumni with the follow request ID
      console.log('Creating notification with follow request ID:', followRequest._id);
      await NotificationController.createFollowRequestNotification(followRequest._id, userId, alumniId);

      res.json({
        success: true,
        message: 'Follow request sent successfully'
      });
    } catch (error) {
      console.error('Follow alumni error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to follow alumni'
      });
    }
  }

  // Get follow status
  static async getFollowStatus(req, res) {
    try {
      const { alumniId } = req.params;
      const userId = req.user.id;

      // Validate alumniId
      if (!alumniId) {
        return res.status(400).json({
          success: false,
          message: 'Alumni ID is required'
        });
      }

      // Check if alumni exists
      const alumni = await User.findOne({
        _id: alumniId,
        userType: 'alumni'
      });

      if (!alumni) {
        return res.status(404).json({
          success: false,
          message: 'Alumni not found'
        });
      }

      // Check if user is following this alumni
      const followRecord = await Follow.findOne({
        followerId: userId,
        followingId: alumniId
      });

      res.json({
        success: true,
        data: { 
          isFollowing: followRecord && followRecord.status === 'approved',
          hasRequested: followRecord && followRecord.status === 'pending'
        }
      });
    } catch (error) {
      console.error('Get follow status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get follow status'
      });
    }
  }

  // Get followers list
  static async getFollowers(req, res) {
    try {
      const userId = req.user.id;

      // Get user's approved followers
      const followers = await Follow.find({
        followingId: userId,
        status: 'approved'
      }).populate('followerId', 'firstName lastName profilePicture email department college');

      res.json({
        success: true,
        data: { followers }
      });
    } catch (error) {
      console.error('Get followers error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get followers'
      });
    }
  }

  // Get following list
  static async getFollowing(req, res) {
    try {
      const userId = req.user.id;

      // Get user's approved following
      const following = await Follow.find({
        followerId: userId,
        status: 'approved'
      }).populate('followingId', 'firstName lastName profilePicture email');

      res.json({
        success: true,
        data: { following: following.map(f => f.followingId) }
      });
    } catch (error) {
      console.error('Get following error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get following'
      });
    }
  }

  // Get follow requests for alumni with full user details
  static async getFollowRequests(req, res) {
    try {
      const alumniId = req.user.id;

      // Get pending follow requests for this alumni with full user details
      const followRequests = await Follow.find({
        followingId: alumniId,
        status: 'pending'
      }).populate({
        path: 'followerId',
        select: 'firstName lastName email age department year college gradYear skills location github linkedin profilePicture',
        model: 'User'
      });

      res.json({
        success: true,
        data: { followRequests }
      });
    } catch (error) {
      console.error('Get follow requests error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get follow requests'
      });
    }
  }

  // Get followers list with full user details
  static async getFollowersWithDetails(req, res) {
    try {
      const alumniId = req.user.id;

      // Get user's approved followers with full user details
      const followers = await Follow.find({
        followingId: alumniId,
        status: 'approved'
      }).populate({
        path: 'followerId',
        select: 'firstName lastName email age department year college gradYear skills location github linkedin profilePicture',
        model: 'User'
      });

      res.json({
        success: true,
        data: { followers }
      });
    } catch (error) {
      console.error('Get followers error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get followers'
      });
    }
  }

  // Approve follow request
  static async approveFollowRequest(req, res) {
    try {
      const { requestId } = req.params;
      const alumniId = req.user.id;

      console.log('Approving follow request:', requestId);
      console.log('Alumni ID:', alumniId);
      console.log('Type of requestId:', typeof requestId);
      console.log('Length of requestId:', requestId ? requestId.length : 'undefined');

      // Validate requestId format
      if (!requestId || requestId.length !== 24 || !mongoose.Types.ObjectId.isValid(requestId)) {
        console.log('Invalid requestId format:', requestId);
        return res.status(400).json({
          success: false,
          message: 'Invalid follow request ID format'
        });
      }

      // Log all follow requests in the database for debugging
      const allFollowRequests = await Follow.find({});
      console.log('All follow requests in database:', allFollowRequests.map(r => ({
        id: r._id,
        followerId: r.followerId,
        followingId: r.followingId,
        status: r.status
      })));

      // Find the follow request
      const followRequest = await Follow.findById(requestId);

      if (!followRequest) {
        console.log('Follow request not found:', requestId);
        // Log all pending follow requests for this alumni for debugging
        const allRequests = await Follow.find({
          followingId: alumniId,
          status: 'pending'
        });
        console.log('All pending follow requests for this alumni:', allRequests.map(r => ({
          id: r._id,
          followerId: r.followerId,
          followingId: r.followingId
        })));
        return res.status(404).json({
          success: false,
          message: 'Follow request not found'
        });
      }

      console.log('Found follow request:', followRequest);

      // Check if this alumni is the one being followed
      if (followRequest.followingId.toString() !== alumniId) {
        console.log('Unauthorized approval attempt. Expected alumni ID:', followRequest.followingId, 'Got:', alumniId);
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to approve this request'
        });
      }

      // Update status to approved
      followRequest.status = 'approved';
      followRequest.updatedAt = Date.now();
      await followRequest.save();

      // Send real-time update via WebSocket
      if (webSocketServer) {
        webSocketServer.sendFollowRequestUpdate(followRequest.followerId, {
          requestId: requestId,
          status: 'approved',
          alumniId: followRequest.followingId.toString() // Send the ID of the alumni whose request was approved
        });
      }

      res.json({
        success: true,
        message: 'Follow request approved successfully'
      });
    } catch (error) {
      console.error('Approve follow request error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to approve follow request'
      });
    }
  }

  // Reject follow request
  static async rejectFollowRequest(req, res) {
    try {
      const { requestId } = req.params;
      const alumniId = req.user.id;

      console.log('Rejecting follow request:', requestId);
      console.log('Alumni ID:', alumniId);
      console.log('Type of requestId:', typeof requestId);
      console.log('Length of requestId:', requestId ? requestId.length : 'undefined');

      // Validate requestId format
      if (!requestId || requestId.length !== 24 || !mongoose.Types.ObjectId.isValid(requestId)) {
        console.log('Invalid requestId format:', requestId);
        return res.status(400).json({
          success: false,
          message: 'Invalid follow request ID format'
        });
      }

      // Log all follow requests in the database for debugging
      const allFollowRequests = await Follow.find({});
      console.log('All follow requests in database:', allFollowRequests.map(r => ({
        id: r._id,
        followerId: r.followerId,
        followingId: r.followingId,
        status: r.status
      })));

      // Find the follow request
      const followRequest = await Follow.findById(requestId);

      if (!followRequest) {
        console.log('Follow request not found:', requestId);
        // Log all pending follow requests for this alumni for debugging
        const allRequests = await Follow.find({
          followingId: alumniId,
          status: 'pending'
        });
        console.log('All pending follow requests for this alumni:', allRequests.map(r => ({
          id: r._id,
          followerId: r.followerId,
          followingId: r.followingId
        })));
        return res.status(404).json({
          success: false,
          message: 'Follow request not found'
        });
      }

      console.log('Found follow request:', followRequest);

      // Check if this alumni is the one being followed
      if (followRequest.followingId.toString() !== alumniId) {
        console.log('Unauthorized rejection attempt. Expected alumni ID:', followRequest.followingId, 'Got:', alumniId);
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to reject this request'
        });
      }

      // Store followerId before deleting for WebSocket notification
      const followerId = followRequest.followerId;

      // Delete the follow request
      await Follow.findByIdAndDelete(requestId);

      // Send real-time update via WebSocket
      if (webSocketServer) {
        webSocketServer.sendFollowRequestUpdate(followerId, {
          requestId: requestId,
          status: 'rejected',
          alumniId: followRequest.followingId.toString() // Send the ID of the alumni whose request was rejected
        });
      }

      res.json({
        success: true,
        message: 'Follow request rejected successfully'
      });
    } catch (error) {
      console.error('Reject follow request error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reject follow request'
      });
    }
  }

  // Unfollow an alumni
  static async unfollowAlumni(req, res) {
    try {
      const { alumniId } = req.body;
      const userId = req.user.id;

      // Validate alumniId
      if (!alumniId) {
        return res.status(400).json({
          success: false,
          message: 'Alumni ID is required'
        });
      }

      // Check if alumni exists
      const alumni = await User.findOne({
        _id: alumniId,
        userType: 'alumni'
      });

      if (!alumni) {
        return res.status(404).json({
          success: false,
          message: 'Alumni not found'
        });
      }

      // Find and delete the follow relationship
      const followRecord = await Follow.findOneAndDelete({
        followerId: userId,
        followingId: alumniId,
        status: 'approved'
      });

      if (!followRecord) {
        return res.status(404).json({
          success: false,
          message: 'You are not following this alumni'
        });
      }

      // Send real-time update via WebSocket
      if (webSocketServer) {
        webSocketServer.sendFollowRequestUpdate(userId, {
          alumniId: alumniId,
          status: 'unfollowed'
        });
      }

      res.json({
        success: true,
        message: 'Successfully unfollowed alumni'
      });
    } catch (error) {
      console.error('Unfollow alumni error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to unfollow alumni'
      });
    }
  }
}

module.exports = { FollowController, setWebSocketServer };