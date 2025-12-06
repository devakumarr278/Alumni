const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  
  // Event Details
  eventType: {
    type: String,
    enum: ['networking', 'reunion', 'workshop', 'seminar', 'social', 'career', 'other'],
    required: [true, 'Event type is required']
  },
  category: {
    type: String,
    enum: ['academic', 'professional', 'social', 'cultural', 'sports', 'charity'],
    required: [true, 'Event category is required']
  },
  
  // Date and Time
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(endDate) {
        return endDate >= this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required']
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  
  // Location
  venue: {
    name: {
      type: String,
      required: [true, 'Venue name is required']
    },
    address: {
      type: String,
      required: [true, 'Venue address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: String,
    country: {
      type: String,
      required: [true, 'Country is required']
    },
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // Virtual Event Details
  isVirtual: {
    type: Boolean,
    default: false
  },
  virtualDetails: {
    platform: {
      type: String,
      enum: ['zoom', 'teams', 'meet', 'webex', 'other']
    },
    meetingLink: String,
    meetingId: String,
    password: String
  },
  
  // Registration
  registrationRequired: {
    type: Boolean,
    default: true
  },
  registrationDeadline: {
    type: Date
  },
  maxAttendees: {
    type: Number,
    min: [1, 'Maximum attendees must be at least 1']
  },
  registrationFee: {
    type: Number,
    min: [0, 'Registration fee cannot be negative'],
    default: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  
  // Access Control
  targetAudience: [{
    type: String,
    enum: ['all', 'alumni', 'students', 'faculty', 'staff']
  }],
  graduationYearRange: {
    from: Number,
    to: Number
  },
  departmentRestriction: [String],
  
  // Media
  featuredImage: {
    type: String,
    default: null
  },
  gallery: [{
    type: String
  }],
  
  // Organizer
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Organizer is required']
  },
  coOrganizers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Speakers/Guests
  speakers: [{
    name: {
      type: String,
      required: true
    },
    title: String,
    bio: String,
    profileImage: String,
    linkedinProfile: String
  }],
  
  // Status and Visibility
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'invite-only'],
    default: 'public'
  },
  
  // Attendees
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['registered', 'confirmed', 'attended', 'cancelled'],
      default: 'registered'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending'
    }
  }],
  
  // Tags and SEO
  tags: [String],
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  
  // Additional Information
  agenda: [{
    time: String,
    title: String,
    description: String,
    speaker: String
  }],
  requirements: [String],
  benefits: [String],
  
  // Contact Information
  contactEmail: String,
  contactPhone: String,
  
  // Social Media
  socialLinks: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add pre-save hook for debugging
eventSchema.pre('save', function(next) {
  console.log('=== EVENT SAVE ATTEMPT ===');
  console.log('Event data being saved:', {
    title: this.title,
    organizer: this.organizer,
    description: this.description,
    eventType: this.eventType,
    category: this.category,
    startDate: this.startDate,
    endDate: this.endDate,
    startTime: this.startTime,
    endTime: this.endTime,
    venue: this.venue
  });
  
  // Check for missing required fields
  const missingFields = [];
  if (!this.title) missingFields.push('title');
  if (!this.organizer) missingFields.push('organizer (userId)');
  if (!this.description) missingFields.push('description');
  if (!this.eventType) missingFields.push('eventType');
  if (!this.category) missingFields.push('category');
  if (!this.startDate) missingFields.push('startDate');
  if (!this.endDate) missingFields.push('endDate');
  if (!this.startTime) missingFields.push('startTime');
  if (!this.endTime) missingFields.push('endTime');
  if (!this.venue) {
    missingFields.push('venue');
  } else {
    if (!this.venue.name) missingFields.push('venue.name');
    if (!this.venue.address) missingFields.push('venue.address');
    if (!this.venue.city) missingFields.push('venue.city');
    if (!this.venue.country) missingFields.push('venue.country');
  }
  
  if (missingFields.length > 0) {
    console.error('=== EVENT VALIDATION ERROR ===');
    console.error('Missing required fields:', missingFields);
    console.error('Full event data:', JSON.stringify(this.toObject(), null, 2));
    // Properly handle validation errors by throwing an error
    return next(new Error('Validation failed: Missing required fields: ' + missingFields.join(', ')));
  }
  
  next();
});

// Virtual for attendee count
eventSchema.virtual('attendeeCount').get(function() {
  return this.attendees ? this.attendees.length : 0;
});

// Virtual for available spots
eventSchema.virtual('availableSpots').get(function() {
  if (!this.maxAttendees) return null;
  return this.maxAttendees - this.attendeeCount;
});

// Virtual for event status based on dates
eventSchema.virtual('eventStatus').get(function() {
  const now = new Date();
  if (this.endDate < now) return 'past';
  if (this.startDate <= now && this.endDate >= now) return 'ongoing';
  return 'upcoming';
});

// Generate slug before saving
eventSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50) + '-' + Date.now();
  }
  next();
});

// Indexes
eventSchema.index({ startDate: 1 });
eventSchema.index({ endDate: 1 });
eventSchema.index({ eventType: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ visibility: 1 });
eventSchema.index({ tags: 1 });
eventSchema.index({ 'venue.city': 1 });

module.exports = mongoose.model('Event', eventSchema);