const express = require('express');
const router = express.Router();
const { EventController, eventValidation } = require('../controllers/eventController');
const { auth, optionalAuth, isAlumniOrAdmin } = require('../middleware/auth');

// Public routes
router.get('/', optionalAuth, EventController.getAllEvents);
router.get('/upcoming', EventController.getUpcomingEvents);
router.get('/:id', optionalAuth, EventController.getEventById);

// Protected routes
router.post('/', auth, isAlumniOrAdmin, eventValidation, EventController.createEvent);
router.put('/:id', auth, eventValidation, EventController.updateEvent);
router.delete('/:id', auth, EventController.deleteEvent);

// Registration routes
router.post('/:id/register', auth, EventController.registerForEvent);
router.delete('/:id/register', auth, EventController.unregisterFromEvent);

// User-specific routes
router.get('/user/created', auth, EventController.getMyEvents);
router.get('/user/registered', auth, EventController.getRegisteredEvents);

module.exports = router;