const Notification = require('../models/Notification');
const User = require('../models/User');
const Follow = require('../models/Follow');
const mongoose = require('mongoose');

// We'll initialize this when the server starts
let webSocketServer = null;

// Function to set the WebSocket server instance
const setWebSocketServer = (wss) => {
  webSocketServer = wss;
};

class NotificationController {
  // Get all notifications for a user
  static async getNotifications(req, res) {
    try {
      const userId = req.user.id;

      // Get all notifications for the user
      const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(50);

      res.json({
        success: true,
        data: { notifications }
      });
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get notifications'
      });
    }
  }

  // Get notifications with sorting logic (follow requests first, then by priority)
  static async getSortedNotifications(req, res) {
    try {
      const userId = req.user.id;

      // Get all notifications for the user
      let notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 });

      // Log notifications for debugging
      console.log('Fetching notifications for user:', userId);
      console.log('Found notifications:', notifications.map(n => ({
        id: n._id,
        type: n.type,
        referenceId: n.referenceId,
        referenceIdType: typeof n.referenceId,
        referenceIdIsObjectId: n.referenceId instanceof mongoose.Types.ObjectId,
        title: n.title,
        message: n.message
      })));

      // Sort notifications: follow requests first, then by priority, then by time
      notifications.sort((a, b) => {
        // Follow requests always come first
        if (a.type === 'follow_request' && b.type !== 'follow_request') return -1;
        if (b.type === 'follow_request' && a.type !== 'follow_request') return 1;
        
        // Mentorship requests sorted by priority
        if (a.type === 'mentorship_request' && b.type === 'mentorship_request') {
          const priorityOrder = { 'urgent': 1, 'high': 2, 'medium': 3, 'low': 4 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        
        // Default: sort by time (newest first)
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      res.json({
        success: true,
        data: { notifications }
      });
    } catch (error) {
      console.error('Get sorted notifications error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get notifications'
      });
    }
  }

  // Mark notification as read
  static async markAsRead(req, res) {
    try {
      const { notificationId } = req.params;
      const userId = req.user.id;

      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { isRead: true },
        { new: true }
      );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }

      res.json({
        success: true,
        message: 'Notification marked as read'
      });
    } catch (error) {
      console.error('Mark notification as read error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark notification as read'
      });
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;

      await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true }
      );

      res.json({
        success: true,
        message: 'All notifications marked as read'
      });
    } catch (error) {
      console.error('Mark all notifications as read error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark all notifications as read'
      });
    }
  }

  // Get unread notifications count
  static async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;

      const count = await Notification.countDocuments({ userId, isRead: false });

      res.json({
        success: true,
        data: { count }
      });
    } catch (error) {
      console.error('Get unread count error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get unread notifications count'
      });
    }
  }

  // Create a follow request notification
  static async createFollowRequestNotification(followRequestId, followerId, followingId) {
    try {
      console.log('Creating follow request notification with parameters:', { followRequestId, followerId, followingId });
      console.log('Type of followRequestId:', typeof followRequestId);
      console.log('Is followRequestId already an ObjectId:', followRequestId instanceof mongoose.Types.ObjectId);
      
      // Get follower and following user details
      const [follower, following] = await Promise.all([
        User.findById(followerId),
        User.findById(followingId)
      ]);

      if (!follower || !following) {
        console.log('User not found. Follower:', follower, 'Following:', following);
        throw new Error('User not found');
      }

      // Ensure followRequestId is properly handled as ObjectId
      let referenceId;
      if (followRequestId instanceof mongoose.Types.ObjectId) {
        referenceId = followRequestId;
      } else if (typeof followRequestId === 'string' && mongoose.Types.ObjectId.isValid(followRequestId)) {
        referenceId = new mongoose.Types.ObjectId(followRequestId);
      } else {
        console.log('Invalid followRequestId format:', followRequestId);
        throw new Error('Invalid follow request ID format');
      }

      // Create notification for the alumni being followed
      const notification = new Notification({
        userId: followingId,
        type: 'follow_request',
        title: 'New Follow Request',
        message: `${follower.firstName} ${follower.lastName} wants to follow you`,
        referenceId: referenceId
      });

      await notification.save();
      console.log('Notification created with referenceId:', notification.referenceId);
      console.log('Notification details:', {
        id: notification._id,
        userId: notification.userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        referenceId: notification.referenceId,
        referenceIdType: typeof notification.referenceId
      });
      
      // Send real-time notification via WebSocket
      if (webSocketServer) {
        webSocketServer.sendNotificationToUser(followingId, {
          notificationId: notification._id,
          type: 'follow_request',
          title: notification.title,
          message: notification.message,
          createdAt: notification.createdAt
        });
      }
    } catch (error) {
      console.error('Create follow request notification error:', error);
    }
  }

  // Create a mentorship request notification
  static async createMentorshipRequestNotification(studentId, alumniId, priority = 'medium') {
    try {
      // Get student and alumni details
      const [student, alumni] = await Promise.all([
        User.findById(studentId),
        User.findById(alumniId)
      ]);

      if (!student || !alumni) {
        throw new Error('User not found');
      }

      // Create notification for the alumni
      const notification = new Notification({
        userId: alumniId,
        type: 'mentorship_request',
        title: 'New Mentorship Request',
        message: `${student.firstName} ${student.lastName} requested mentorship from you`,
        priority: priority,
        referenceId: studentId
      });

      await notification.save();
      
      // Send real-time notification via WebSocket
      if (webSocketServer) {
        webSocketServer.sendNotificationToUser(alumniId, {
          notificationId: notification._id,
          type: 'mentorship_request',
          title: notification.title,
          message: notification.message,
          priority: notification.priority,
          createdAt: notification.createdAt
        });
      }
    } catch (error) {
      console.error('Create mentorship request notification error:', error);
    }
  }
}

module.exports = { NotificationController, setWebSocketServer };