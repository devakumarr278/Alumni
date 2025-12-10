const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
  alumniId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'connected'],
    default: 'pending'
  },
  initiatedBy: {
    type: String,
    enum: ['alumni', 'student'],
    required: true
  },
  connectedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Ensure unique connection between alumni and student
connectionSchema.index({ alumniId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Connection', connectionSchema);