const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AvailabilitySlot',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'confirmed'
  },
  bookedAt: {
    type: Date,
    default: Date.now
  },
  cancelledAt: {
    type: Date
  }
});

// Index for efficient querying
bookingSchema.index({ slotId: 1 });
bookingSchema.index({ studentId: 1 });
bookingSchema.index({ slotId: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);