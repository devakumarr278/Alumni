const mongoose = require('mongoose');

const availabilitySlotSchema = new mongoose.Schema({
  alumniId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  maxParticipants: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['available', 'full', 'completed', 'cancelled'],
    default: 'available'
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

// Index for efficient querying
availabilitySlotSchema.index({ alumniId: 1, date: 1 });
availabilitySlotSchema.index({ date: 1 });

module.exports = mongoose.model('AvailabilitySlot', availabilitySlotSchema);