const express = require('express');
const router = express.Router();
const { NotificationController } = require('../controllers/notificationController');
const { auth } = require('../middleware/auth');

// Get all notifications for a user
router.get('/', auth, NotificationController.getSortedNotifications);

// Mark notification as read
router.post('/:notificationId/read', auth, NotificationController.markAsRead);

// Mark all notifications as read
router.post('/read-all', auth, NotificationController.markAllAsRead);

// Get unread notifications count
router.get('/unread-count', auth, NotificationController.getUnreadCount);

module.exports = router;