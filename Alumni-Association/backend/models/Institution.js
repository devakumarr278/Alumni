const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  website: {
    type: String,
    trim: true
  },
  contactPerson: {
    name: String,
    email: String,
    phone: String
  }
}, {
  timestamps: true
});

// Indexes for performance
institutionSchema.index({ name: 1 });

module.exports = mongoose.model('Institution', institutionSchema);