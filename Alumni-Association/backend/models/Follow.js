const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  followingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure unique follower-following pairs
followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

// Indexes for performance
followSchema.index({ followingId: 1, status: 1 });
followSchema.index({ followerId: 1, status: 1 });
followSchema.index({ createdAt: -1 });

// Middleware to update updatedAt on save
followSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Follow', followSchema);