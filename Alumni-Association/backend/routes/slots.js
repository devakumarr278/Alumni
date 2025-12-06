const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');
const { auth } = require('../middleware/auth');

// Create a new availability slot (alumni only)
router.post('/', auth, slotController.createSlot);

// Update an existing availability slot (alumni only)
router.put('/:slotId', auth, slotController.updateSlot);

// Get upcoming slots for a specific alumni (public)
router.get('/alumni/:alumniId', slotController.getUpcomingSlotsForAlumni);

// Get upcoming slots for the current user (alumni)
router.get('/my-slots', auth, slotController.getMyUpcomingSlots);

// Book a slot (students only)
router.post('/book', auth, slotController.bookSlot);

// Cancel a booking (students only)
router.post('/cancel', auth, slotController.cancelBooking);

// Get bookings for a student
router.get('/my-bookings', auth, slotController.getStudentBookings);

// Get waiting list status for a slot
router.get('/:slotId/waiting-list', auth, slotController.getWaitingListStatus);

// Join waiting list for a slot
router.post('/:slotId/join-waiting-list', auth, slotController.joinWaitingList);

// Leave waiting list for a slot
router.post('/:slotId/leave-waiting-list', auth, slotController.leaveWaitingList);

// Delete a slot (alumni only)
router.delete('/:slotId', auth, slotController.deleteSlot);

module.exports = router;