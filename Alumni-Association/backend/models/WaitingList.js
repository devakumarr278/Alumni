const mongoose = require('mongoose');

const waitingListSchema = new mongoose.Schema({
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
  addedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
waitingListSchema.index({ slotId: 1 });
waitingListSchema.index({ studentId: 1 });
waitingListSchema.index({ slotId: 1, addedAt: 1 });

module.exports = mongoose.model('WaitingList', waitingListSchema);