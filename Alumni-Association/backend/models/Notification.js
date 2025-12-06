const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  institutionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Institution',
    required: false // Not all notifications are institution-specific
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'alumni_pending_verification', 
      'pending_approval', 
      'event_created', 
      'other',
      'follow_request',
      'mentorship_request',
      'job_recommendation',
      'connection_request',
      'system_update'
    ]
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Indexes for performance
notificationSchema.index({ userId: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ priority: 1 });

module.exports = mongoose.model('Notification', notificationSchema);