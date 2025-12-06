const Event = require('../models/Event');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

class EventController {
  // Get all events with filtering and pagination
  static async getAllEvents(req, res) {
    try {
      const {
        page = 1,
        limit = 12,
        search,
        eventType,
        category,
        status = 'published',
        startDate,
        endDate,
        sortBy = 'startDate',
        sortOrder = 'asc'
      } = req.query;

      // Build filter query
      const filter = { status };

      // Search filter
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { 'venue.name': { $regex: search, $options: 'i' } },
          { 'venue.city': { $regex: search, $options: 'i' } }
        ];
      }

      // Additional filters
      if (eventType) filter.eventType = eventType;
      if (category) filter.category = category;
      
      // Date range filter
      if (startDate || endDate) {
        filter.startDate = {};
        if (startDate) filter.startDate.$gte = new Date(startDate);
        if (endDate) filter.startDate.$lte = new Date(endDate);
      }

      // Sort options
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Execute query with pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const [events, totalCount] = await Promise.all([
        Event.find(filter)
          .populate('organizer', 'firstName lastName profilePicture')
          .populate('coOrganizers', 'firstName lastName profilePicture')
          .sort(sortOptions)
          .skip(skip)
          .limit(parseInt(limit)),
        Event.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(totalCount / parseInt(limit));

      res.json({
        success: true,
        data: {
          events,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalCount,
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1
          }
        }
      });

    } catch (error) {
      console.error('Get events error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch events'
      });
    }
  }

  // Get single event by ID or slug
  static async getEventById(req, res) {
    try {
      const { id } = req.params;
      
      // Try to find by MongoDB ID first, then by slug
      let event = await Event.findById(id)
        .populate('organizer', 'firstName lastName profilePicture email')
        .populate('coOrganizers', 'firstName lastName profilePicture')
        .populate('attendees.user', 'firstName lastName profilePicture userType');
      
      if (!event) {
        event = await Event.findOne({ slug: id })
          .populate('organizer', 'firstName lastName profilePicture email')
          .populate('coOrganizers', 'firstName lastName profilePicture')
          .populate('attendees.user', 'firstName lastName profilePicture userType');
      }

      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }

      // Increment view count
      await event.updateOne({ $inc: { views: 1 } });

      res.json({
        success: true,
        data: { event }
      });

    } catch (error) {
      console.error('Get event by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch event'
      });
    }
  }

  // Create new event
  static async createEvent(req, res) {
    try {
      console.log('=== EVENT CREATION ATTEMPT ===');
      console.log('Event creation request received:', req.body);
      console.log('Request method:', req.method);
      console.log('Request URL:', req.url);
      console.log('Request IP:', req.ip);
      console.log('Request headers:', req.headers);
      console.log('Request originalUrl:', req.originalUrl);
      console.log('Request baseUrl:', req.baseUrl);
      console.log('User:', req.user);
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      // Check if required fields are present
      const requiredFields = ['title', 'description', 'eventType', 'category', 'startDate', 'endDate', 'startTime', 'endTime'];
      const missingFields = [];
      
      for (const field of requiredFields) {
        if (!req.body[field] || (typeof req.body[field] === 'string' && !req.body[field].trim())) {
          missingFields.push(field);
        }
      }
      
      // Check venue fields
      if (!req.body.venue || !req.body.venue.name || !req.body.venue.name.trim()) {
        missingFields.push('venue.name');
      }
      
      if (!req.body.venue || !req.body.venue.address || !req.body.venue.address.trim()) {
        missingFields.push('venue.address');
      }
      
      if (!req.body.venue || !req.body.venue.city || !req.body.venue.city.trim()) {
        missingFields.push('venue.city');
      }
      
      if (!req.body.venue || !req.body.venue.country || !req.body.venue.country.trim()) {
        missingFields.push('venue.country');
      }
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`
        });
      }

      const eventData = {
        ...req.body,
        organizer: req.user.id,
        status: 'draft' // All events start as draft
      };

      // Validate dates
      if (new Date(eventData.endDate) <= new Date(eventData.startDate)) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after start date'
        });
      }

      const event = new Event(eventData);
      await event.save();

      const populatedEvent = await Event.findById(event._id)
        .populate('organizer', 'firstName lastName profilePicture');

      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: { event: populatedEvent }
      });

    } catch (error) {
      console.error('Create event error:', error);
      // Provide more specific error messages
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: 'Validation failed: ' + messages.join(', ')
        });
      }
      res.status(500).json({
        success: false,
        message: 'Failed to create event: ' + error.message
      });
    }
  }

  // Update event
  static async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const event = await Event.findById(id);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }

      // Check if user is organizer or admin
      if (event.organizer.toString() !== req.user.id && req.user.userType !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Only event organizer or admin can update this event.'
        });
      }

      // Validate dates if they're being updated
      if (req.body.startDate && req.body.endDate) {
        if (new Date(req.body.endDate) <= new Date(req.body.startDate)) {
          return res.status(400).json({
            success: false,
            message: 'End date must be after start date'
          });
        }
      }

      const updatedEvent = await Event.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      ).populate('organizer', 'firstName lastName profilePicture');

      res.json({
        success: true,
        message: 'Event updated successfully',
        data: { event: updatedEvent }
      });

    } catch (error) {
      console.error('Update event error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update event'
      });
    }
  }

  // Delete event
  static async deleteEvent(req, res) {
    try {
      const { id } = req.params;

      const event = await Event.findById(id);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }

      // Check if user is organizer or admin
      if (event.organizer.toString() !== req.user.id && req.user.userType !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Only event organizer or admin can delete this event.'
        });
      }

      await Event.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Event deleted successfully'
      });

    } catch (error) {
      console.error('Delete event error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete event'
      });
    }
  }

  // Register for event
  static async registerForEvent(req, res) {
    try {
      const { id } = req.params;

      const event = await Event.findById(id);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }

      // Check if event is published and registration is open
      if (event.status !== 'published') {
        return res.status(400).json({
          success: false,
          message: 'Registration is not open for this event'
        });
      }

      if (!event.registrationRequired) {
        return res.status(400).json({
          success: false,
          message: 'This event does not require registration'
        });
      }

      // Check registration deadline
      if (event.registrationDeadline && new Date() > event.registrationDeadline) {
        return res.status(400).json({
          success: false,
          message: 'Registration deadline has passed'
        });
      }

      // Check if user is already registered
      const existingRegistration = event.attendees.find(
        attendee => attendee.user.toString() === req.user.id
      );

      if (existingRegistration) {
        return res.status(400).json({
          success: false,
          message: 'You are already registered for this event'
        });
      }

      // Check if event is full
      if (event.maxAttendees && event.attendeeCount >= event.maxAttendees) {
        return res.status(400).json({
          success: false,
          message: 'Event is full. No more registrations accepted.'
        });
      }

      // Add user to attendees
      event.attendees.push({
        user: req.user.id,
        status: 'registered',
        paymentStatus: event.registrationFee > 0 ? 'pending' : 'paid'
      });

      await event.save();

      res.json({
        success: true,
        message: 'Successfully registered for the event'
      });

    } catch (error) {
      console.error('Register for event error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to register for event'
      });
    }
  }

  // Unregister from event
  static async unregisterFromEvent(req, res) {
    try {
      const { id } = req.params;

      const event = await Event.findById(id);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }

      // Find and remove user from attendees
      const attendeeIndex = event.attendees.findIndex(
        attendee => attendee.user.toString() === req.user.id
      );

      if (attendeeIndex === -1) {
        return res.status(400).json({
          success: false,
          message: 'You are not registered for this event'
        });
      }

      event.attendees.splice(attendeeIndex, 1);
      await event.save();

      res.json({
        success: true,
        message: 'Successfully unregistered from the event'
      });

    } catch (error) {
      console.error('Unregister from event error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to unregister from event'
      });
    }
  }

  // Get upcoming events
  static async getUpcomingEvents(req, res) {
    try {
      const { limit = 5 } = req.query;

      const upcomingEvents = await Event.find({
        status: 'published',
        startDate: { $gte: new Date() }
      })
      .populate('organizer', 'firstName lastName')
      .sort({ startDate: 1 })
      .limit(parseInt(limit))
      .select('title shortDescription startDate endDate venue featuredImage eventType category');

      res.json({
        success: true,
        data: { events: upcomingEvents }
      });

    } catch (error) {
      console.error('Get upcoming events error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch upcoming events'
      });
    }
  }

  // Get events created by current user
  static async getMyEvents(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [events, totalCount] = await Promise.all([
        Event.find({ organizer: req.user.id })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        Event.countDocuments({ organizer: req.user.id })
      ]);

      const totalPages = Math.ceil(totalCount / parseInt(limit));

      res.json({
        success: true,
        data: {
          events,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalCount,
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1
          }
        }
      });

    } catch (error) {
      console.error('Get my events error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch your events'
      });
    }
  }

  // Get events user is registered for
  static async getRegisteredEvents(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [events, totalCount] = await Promise.all([
        Event.find({ 'attendees.user': req.user.id })
          .populate('organizer', 'firstName lastName')
          .sort({ startDate: 1 })
          .skip(skip)
          .limit(parseInt(limit)),
        Event.countDocuments({ 'attendees.user': req.user.id })
      ]);

      const totalPages = Math.ceil(totalCount / parseInt(limit));

      res.json({
        success: true,
        data: {
          events,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalCount,
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1
          }
        }
      });

    } catch (error) {
      console.error('Get registered events error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch registered events'
      });
    }
  }
}

// Validation rules
const eventValidation = [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description').trim().isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
  body('eventType').isIn(['networking', 'reunion', 'workshop', 'seminar', 'social', 'career', 'other']).withMessage('Invalid event type'),
  body('category').isIn(['academic', 'professional', 'social', 'cultural', 'sports', 'charity']).withMessage('Invalid category'),
  body('startDate').isISO8601().withMessage('Invalid start date format'),
  body('endDate').isISO8601().withMessage('Invalid end date format'),
  body('venue.name').trim().notEmpty().withMessage('Venue name is required'),
  body('venue.address').trim().notEmpty().withMessage('Venue address is required'),
  body('venue.city').trim().notEmpty().withMessage('City is required'),
  body('venue.country').trim().notEmpty().withMessage('Country is required')
];

module.exports = {
  EventController,
  eventValidation
};