# Mentorship Features Implementation

This document describes the implementation of the mentorship calendar and alumni directory features.

## Backend Implementation

### Models

1. **AvailabilitySlot** - Represents time slots when alumni are available for mentorship
2. **Booking** - Represents student bookings for mentorship slots

### API Endpoints

All endpoints are under `/api/slots`:

- `POST /` - Create a new availability slot (alumni only)
- `GET /alumni/:alumniId` - Get upcoming slots for a specific alumni (public)
- `GET /my-slots` - Get upcoming slots for the current user (alumni)
- `POST /book` - Book a slot (students only)
- `POST /cancel` - Cancel a booking (students only)
- `GET /my-bookings` - Get bookings for a student
- `DELETE /:slotId` - Delete a slot (alumni only)

### WebSocket Events

- `slot_created` - Broadcast when a new slot is created
- `slot_updated` - Broadcast when a slot is updated (booked/cancelled)
- `slot_deleted` - Broadcast when a slot is deleted

## Frontend Implementation

### Components

1. **MentorshipCalendar.jsx** - Main calendar view for managing availability and viewing sessions
2. **AlumniProfileModalWithSlots.js** - Enhanced alumni profile modal showing mentorship slots

### Features Implemented

#### Calendar Page
- Monthly calendar view with session indicators
- "Your Availability" section showing slots for selected date
- "Upcoming Sessions" section with countdown timers
- Add availability form with date/time picker
- Real-time updates via WebSocket

#### Alumni Profile
- Upcoming mentorship slots display
- Slot details with remaining seats
- Book slot functionality
- Real-time seat updates
- Countdown timers for upcoming sessions

### Real-time Updates

The system uses WebSockets for real-time updates:
- When alumni create/delete slots
- When students book/cancel slots
- Automatic UI updates without page refresh

## Database Schema

### AvailabilitySlot
```javascript
{
  alumniId: ObjectId,        // Reference to User
  date: Date,                // Session date
  startTime: String,         // Format: "HH:MM"
  endTime: String,           // Format: "HH:MM"
  maxParticipants: Number,   // Maximum students allowed
  description: String,       // Optional description
  status: String,            // available, full, completed, cancelled
  createdAt: Date,
  updatedAt: Date
}
```

### Booking
```javascript
{
  slotId: ObjectId,          // Reference to AvailabilitySlot
  studentId: ObjectId,       // Reference to User
  status: String,            // pending, confirmed, cancelled
  bookedAt: Date,
  cancelledAt: Date
}
```

## Usage Instructions

### For Alumni
1. Navigate to the Mentorship Calendar page
2. Click "Add Availability" to create new slots
3. View upcoming sessions in the sidebar
4. See real-time updates when students book slots

### For Students
1. Browse the Alumni Directory
2. Click on an alumni card to view their profile
3. Switch to the "Mentorship" tab to see available slots
4. Click on a slot to view details and book
5. See real-time updates when slots become full

## Security

- Only authenticated users can access the APIs
- Alumni can only manage their own slots
- Students can only book/cancel their own bookings
- Proper validation on all inputs
- Rate limiting and error handling

## Future Enhancements

- Waiting list for full slots
- Session reminders via email
- Calendar integration (Google Calendar, etc.)
- Session recording and notes
- Rating and feedback system