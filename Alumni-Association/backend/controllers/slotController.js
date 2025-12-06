const AvailabilitySlot = require('../models/AvailabilitySlot');
const Booking = require('../models/Booking');
const User = require('../models/User');
const WebSocketServer = require('../webSocketServer');

let webSocketServer = null;

// Set WebSocket server instance
const setWebSocketServer = (wss) => {
  webSocketServer = wss;
};

// Helper function to parse date string in various formats
const parseDate = (dateString) => {
  console.log('Parsing date string:', dateString);
  
  // Handle YYYY-MM-DD format (standard date picker format)
  // Pattern: YYYY-MM-DD where YYYY is 4 digits, MM is 2 digits, DD is 2 digits
  const ymdRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
  const ymdMatch = dateString.match(ymdRegex);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10);
    const day = parseInt(ymdMatch[3], 10);
    
    // Validate that day and month are reasonable
    if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
      // Create date (month is 0-indexed in JS Date)
      const date = new Date(year, month - 1, day);
      console.log(`Parsed as YYYY-MM-DD format (${year}-${month}-${day}):`, date);
      return date;
    }
  }
  
  // Handle DD-MM-YYYY format (in case of manual input)
  // Pattern: DD-MM-YYYY where DD is 1-2 digits, MM is 1-2 digits, YYYY is 4 digits
  const dmyRegex = /^(\d{1,2})-(\d{1,2})-(\d{4})$/;
  const dmyMatch = dateString.match(dmyRegex);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10);
    const year = parseInt(dmyMatch[3], 10);
    
    // Validate that day and month are reasonable
    if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
      // Create date (month is 0-indexed in JS Date)
      const date = new Date(year, month - 1, day);
      console.log(`Parsed as DD-MM-YYYY format (${day}-${month}-${year}):`, date);
      return date;
    }
  }
  
  // Handle other formats or return as-is
  const date = new Date(dateString);
  console.log('Parsed as default format:', date);
  return date;
};

// Create a new availability slot
const createSlot = async (req, res) => {
  try {
    const { date, startTime, endTime, maxParticipants, description } = req.body;
    const alumniId = req.user.id;

    // Validate input
    if (!date || !startTime || !endTime || !maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Parse date properly
    const slotDate = parseDate(date);
    
    // Validate that we have a valid date
    if (isNaN(slotDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Please use DD-MM-YYYY or YYYY-MM-DD format.'
      });
    }
    
    const currentDate = new Date();
    console.log('Slot date:', slotDate);
    console.log('Current date:', currentDate);
    
    // Check if slot is in the future (considering same day)
    const slotDateOnly = new Date(slotDate.getFullYear(), slotDate.getMonth(), slotDate.getDate());
    const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    
    console.log('Slot date only:', slotDateOnly);
    console.log('Current date only:', currentDateOnly);
    
    if (slotDateOnly < currentDateOnly) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create slots for past dates'
      });
    }

    // For today's slots, ensure there's at least 1 hour difference from current time
    if (slotDateOnly.getTime() === currentDateOnly.getTime()) {
      const [hours, minutes] = startTime.split(':');
      const slotTime = new Date(slotDate);
      slotTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      console.log('Slot time:', slotTime);
      console.log('Current time:', currentDate);
      
      // Calculate time difference in hours
      const timeDiff = (slotTime - currentDate) / (1000 * 60 * 60); // Convert to hours
      console.log('Time difference (hours):', timeDiff);
      
      if (timeDiff < 1) {
        return res.status(400).json({
          success: false,
          message: 'For today\'s slots, the start time must be at least 1 hour from now'
        });
      }
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid time format. Use HH:MM format.'
      });
    }

    // Validate that end time is after start time
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const startDate = new Date(slotDate);
    startDate.setHours(startHours, startMinutes, 0, 0);
    
    const endDate = new Date(slotDate);
    endDate.setHours(endHours, endMinutes, 0, 0);
    
    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time'
      });
    }

    // Check for time overlaps with existing slots on the same date
    const existingSlots = await AvailabilitySlot.find({
      alumniId,
      date: {
        $gte: new Date(slotDate.getFullYear(), slotDate.getMonth(), slotDate.getDate()),
        $lt: new Date(slotDate.getFullYear(), slotDate.getMonth(), slotDate.getDate() + 1)
      },
      status: { $in: ['available', 'full'] }
    });

    // Check for time conflicts
    for (const existingSlot of existingSlots) {
      const existingStartDate = new Date(slotDate);
      const [existingStartHours, existingStartMinutes] = existingSlot.startTime.split(':').map(Number);
      existingStartDate.setHours(existingStartHours, existingStartMinutes, 0, 0);
      
      const existingEndDate = new Date(slotDate);
      const [existingEndHours, existingEndMinutes] = existingSlot.endTime.split(':').map(Number);
      existingEndDate.setHours(existingEndHours, existingEndMinutes, 0, 0);
      
      // Check for overlap: (StartA < EndB) and (EndA > StartB)
      if (startDate < existingEndDate && endDate > existingStartDate) {
        return res.status(400).json({
          success: false,
          message: 'Time conflict detected with an existing slot. Please choose a different time.'
        });
      }
    }

    // Create new slot
    const slot = new AvailabilitySlot({
      alumniId,
      date: slotDate,
      startTime,
      endTime,
      maxParticipants,
      description: description || ''
    });

    await slot.save();

    // Send real-time update to all connected clients
    if (webSocketServer) {
      const slotData = {
        slotId: slot._id,
        alumniId,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        maxParticipants: slot.maxParticipants,
        description: slot.description,
        status: slot.status
      };
      
      // Notify all clients about the new slot
      webSocketServer.broadcastNotification({
        type: 'slot_created',
        data: slotData
      });
    }

    res.status(201).json({
      success: true,
      data: slot,
      message: 'Availability slot created successfully'
    });
  } catch (error) {
    console.error('Error creating slot:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create availability slot: ' + error.message,
      error: error.message
    });
  }
};

// Update an existing availability slot
const updateSlot = async (req, res) => {
  try {
    const { slotId } = req.params;
    const { date, startTime, endTime, maxParticipants, description } = req.body;
    const alumniId = req.user.id;

    // Validate input
    if (!slotId || !date || !startTime || !endTime || !maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Parse date properly
    const slotDate = parseDate(date);
    
    // Validate that we have a valid date
    if (isNaN(slotDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Please use DD-MM-YYYY or YYYY-MM-DD format.'
      });
    }
    
    const currentDate = new Date();
    
    // Check if slot is in the future (considering same day)
    const slotDateOnly = new Date(slotDate.getFullYear(), slotDate.getMonth(), slotDate.getDate());
    const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    
    if (slotDateOnly < currentDateOnly) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create slots for past dates'
      });
    }

    // For today's slots, ensure there's at least 1 hour difference from current time
    if (slotDateOnly.getTime() === currentDateOnly.getTime()) {
      const [hours, minutes] = startTime.split(':');
      const slotTime = new Date(slotDate);
      slotTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      // Calculate time difference in hours
      const timeDiff = (slotTime - currentDate) / (1000 * 60 * 60); // Convert to hours
      
      if (timeDiff < 1) {
        return res.status(400).json({
          success: false,
          message: 'For today\'s slots, the start time must be at least 1 hour from now'
        });
      }
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid time format. Use HH:MM format.'
      });
    }

    // Validate that end time is after start time
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const startDate = new Date(slotDate);
    startDate.setHours(startHours, startMinutes, 0, 0);
    
    const endDate = new Date(slotDate);
    endDate.setHours(endHours, endMinutes, 0, 0);
    
    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time'
      });
    }

    // Find the slot and check if it belongs to the current user
    const slot = await AvailabilitySlot.findOne({ _id: slotId, alumniId });
    
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found or you do not have permission to update it'
      });
    }

    // Check for time overlaps with other existing slots on the same date (excluding the current slot)
    const existingSlots = await AvailabilitySlot.find({
      alumniId,
      date: {
        $gte: new Date(slotDate.getFullYear(), slotDate.getMonth(), slotDate.getDate()),
        $lt: new Date(slotDate.getFullYear(), slotDate.getMonth(), slotDate.getDate() + 1)
      },
      status: { $in: ['available', 'full'] },
      _id: { $ne: slotId } // Exclude the current slot being updated
    });

    // Check for time conflicts
    for (const existingSlot of existingSlots) {
      const existingStartDate = new Date(slotDate);
      const [existingStartHours, existingStartMinutes] = existingSlot.startTime.split(':').map(Number);
      existingStartDate.setHours(existingStartHours, existingStartMinutes, 0, 0);
      
      const existingEndDate = new Date(slotDate);
      const [existingEndHours, existingEndMinutes] = existingSlot.endTime.split(':').map(Number);
      existingEndDate.setHours(existingEndHours, existingEndMinutes, 0, 0);
      
      // Check for overlap: (StartA < EndB) and (EndA > StartB)
      if (startDate < existingEndDate && endDate > existingStartDate) {
        return res.status(400).json({
          success: false,
          message: 'Time conflict detected with an existing slot. Please choose a different time.'
        });
      }
    }

    // Update slot
    slot.date = slotDate;
    slot.startTime = startTime;
    slot.endTime = endTime;
    slot.maxParticipants = maxParticipants;
    slot.description = description || '';

    await slot.save();

    // Send real-time update to all connected clients
    if (webSocketServer) {
      const slotData = {
        slotId: slot._id,
        alumniId,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        maxParticipants: slot.maxParticipants,
        description: slot.description,
        status: slot.status
      };
      
      // Notify all clients about the updated slot
      webSocketServer.broadcastNotification({
        type: 'slot_updated',
        data: slotData
      });
    }

    res.status(200).json({
      success: true,
      data: slot,
      message: 'Availability slot updated successfully'
    });
  } catch (error) {
    console.error('Error updating slot:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update availability slot: ' + error.message,
      error: error.message
    });
  }
};

// Get upcoming slots for a specific alumni (modified to ensure students can see them)
const getUpcomingSlotsForAlumni = async (req, res) => {
  try {
    const { alumniId } = req.params;
    
    // Validate alumniId
    if (!alumniId) {
      return res.status(400).json({
        success: false,
        message: 'Missing alumni ID'
      });
    }

    // Find upcoming slots (future dates) for the alumni
    const currentDate = new Date();
    const slots = await AvailabilitySlot.find({
      alumniId,
      date: { $gte: currentDate },
      status: { $in: ['available', 'full'] }
    }).sort({ date: 1, startTime: 1 });

    // Add booking information to each slot
    const slotsWithBookings = await Promise.all(slots.map(async (slot) => {
      const bookings = await Booking.find({ 
        slotId: slot._id, 
        status: 'confirmed' 
      });
      
      return {
        ...slot.toObject(),
        currentBooked: bookings.length,
        status: bookings.length >= slot.maxParticipants ? 'full' : slot.status
      };
    }));

    res.status(200).json({
      success: true,
      data: slotsWithBookings
    });
  } catch (error) {
    console.error('Error fetching alumni slots:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alumni slots',
      error: error.message
    });
  }
};

// Get all upcoming slots for the current user (alumni)
const getMyUpcomingSlots = async (req, res) => {
  try {
    const alumniId = req.user.id;
    const currentDate = new Date();
    console.log('Current date for filtering:', currentDate);
    console.log('Current date string:', currentDate.toDateString());
    
    // Find upcoming slots for the current alumni (future dates or today but not yet ended)
    const slots = await AvailabilitySlot.find({
      alumniId,
      $or: [
        { date: { $gt: currentDate } }, // Future dates
        { 
          date: { $lte: currentDate }, // Today or past dates
          status: { $in: ['available', 'full'] } // But only if they're still available
        }
      ]
    }).sort({ date: 1, startTime: 1 }); // Sort by date and start time

    console.log('Found slots:', slots);

    // Add booking information to each slot
    const slotsWithBookings = await Promise.all(slots.map(async (slot) => {
      console.log('Processing slot:', slot);
      console.log('Slot date string:', slot.date.toDateString());
      
      // For today's slots, check if they've already ended
      if (slot.date.toDateString() === currentDate.toDateString()) {
        const slotDate = new Date(slot.date);
        const [endHours, endMinutes] = slot.endTime.split(':').map(Number);
        slotDate.setHours(endHours, endMinutes, 0, 0);
        
        console.log('Today slot end time:', slotDate);
        console.log('Current time:', currentDate);
        console.log('Slot ended?', slotDate < currentDate);
        
        // If the slot has ended, mark it as completed
        if (slotDate < currentDate) {
          slot.status = 'completed';
          await slot.save();
        }
      }
      
      const bookings = await Booking.find({ 
        slotId: slot._id, 
        status: 'confirmed' 
      });
      
      const slotData = {
        ...slot.toObject(),
        currentBooked: bookings.length,
        status: bookings.length >= slot.maxParticipants ? 'full' : slot.status
      };
      
      console.log('Processed slot data:', slotData);
      return slotData;
    }));

    // Filter out completed slots
    const activeSlots = slotsWithBookings.filter(slot => slot.status !== 'completed');
    console.log('Active slots:', activeSlots);

    res.status(200).json({
      success: true,
      data: activeSlots
    });
  } catch (error) {
    console.error('Error fetching my slots:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your slots',
      error: error.message
    });
  }
};

// Book a slot
const bookSlot = async (req, res) => {
  try {
    const { slotId } = req.body;
    const studentId = req.user.id;

    // Validate input
    if (!slotId) {
      return res.status(400).json({
        success: false,
        message: 'Missing slot ID'
      });
    }

    // Find the slot
    const slot = await AvailabilitySlot.findById(slotId);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found'
      });
    }

    // Check if slot is in the future
    const currentDate = new Date();
    if (slot.date < currentDate) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book past slots'
      });
    }

    // Check if slot is available
    if (slot.status === 'completed' || slot.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Slot is not available for booking'
      });
    }

    // Check if slot is full
    const currentBookings = await Booking.countDocuments({ 
      slotId, 
      status: 'confirmed' 
    });
    
    if (currentBookings >= slot.maxParticipants) {
      // Slot is full, add student to waiting list
      const WaitingList = require('../models/WaitingList');
      
      // Check if student is already on the waiting list
      const existingWaitlistEntry = await WaitingList.findOne({ 
        slotId, 
        studentId 
      });
      
      if (existingWaitlistEntry) {
        return res.status(400).json({
          success: false,
          message: 'You are already on the waiting list for this slot'
        });
      }
      
      // Add student to waiting list
      const waitingListEntry = new WaitingList({
        slotId,
        studentId
      });
      
      await waitingListEntry.save();
      
      return res.status(201).json({
        success: true,
        data: waitingListEntry,
        message: 'Added to waiting list successfully'
      });
    }

    // Check if student has already booked this slot
    const existingBooking = await Booking.findOne({ 
      slotId, 
      studentId, 
      status: 'confirmed' 
    });
    
    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'You have already booked this slot'
      });
    }

    // Create booking
    const booking = new Booking({
      slotId,
      studentId,
      alumniId: slot.alumniId
    });

    await booking.save();

    // Update slot status if it's now full
    if (currentBookings + 1 >= slot.maxParticipants) {
      slot.status = 'full';
      await slot.save();
    }

    // Send real-time update to all connected clients
    if (webSocketServer) {
      const bookingData = {
        bookingId: booking._id,
        slotId: slot._id,
        alumniId: slot.alumniId,
        studentId,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime
      };
      
      // Notify all clients about the new booking
      webSocketServer.broadcastNotification({
        type: 'slot_booked',
        data: bookingData
      });
    }

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Slot booked successfully'
    });
  } catch (error) {
    console.error('Error booking slot:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book slot',
      error: error.message
    });
  }
};

// Cancel a booking
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const studentId = req.user.id;

    // Validate input
    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Missing booking ID'
      });
    }

    // Find the booking and check if it belongs to the current user
    const booking = await Booking.findOne({ _id: bookingId, studentId });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or you do not have permission to cancel it'
      });
    }

    // Check if booking can be cancelled (not already cancelled or completed)
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled'
      });
    }

    // Get the slot details before cancelling
    const slot = await AvailabilitySlot.findById(booking.slotId);
    
    // Update booking status
    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    await booking.save();

    // Update slot status if it was full
    if (slot && slot.status === 'full') {
      const currentBookings = await Booking.countDocuments({ 
        slotId: booking.slotId, 
        status: 'confirmed' 
      });
      
      if (currentBookings < slot.maxParticipants) {
        slot.status = 'available';
        await slot.save();
      }
    }

    // Check if there are students on the waiting list who can be automatically booked
    let autoBookedStudent = null;
    if (slot) {
      const WaitingList = require('../models/WaitingList');
      
      // Get the first student on the waiting list (FIFO)
      const waitingListEntry = await WaitingList.findOne({ 
        slotId: slot._id 
      }).sort({ addedAt: 1 });
      
      if (waitingListEntry) {
        // Remove student from waiting list
        await WaitingList.deleteOne({ _id: waitingListEntry._id });
        
        // Create a new booking for the student from the waiting list
        const autoBooking = new Booking({
          slotId: slot._id,
          studentId: waitingListEntry.studentId,
          alumniId: slot.alumniId
        });
        
        await autoBooking.save();
        autoBookedStudent = {
          booking: autoBooking,
          studentId: waitingListEntry.studentId
        };
        
        // Update slot status if it's now full again
        const updatedBookings = await Booking.countDocuments({ 
          slotId: slot._id, 
          status: 'confirmed' 
        });
        
        if (updatedBookings >= slot.maxParticipants) {
          slot.status = 'full';
          await slot.save();
        }
        
        // Send real-time update to the auto-booked student
        if (webSocketServer) {
          const autoBookingData = {
            bookingId: autoBooking._id,
            slotId: slot._id,
            alumniId: slot.alumniId,
            studentId: waitingListEntry.studentId,
            date: slot.date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            autoBooked: true
          };
          
          // Notify the auto-booked student
          webSocketServer.sendToUser(waitingListEntry.studentId, {
            type: 'slot_auto_booked',
            data: autoBookingData
          });
        }
      }
    }

    // Send real-time update to all connected clients
    if (webSocketServer) {
      const bookingData = {
        bookingId: booking._id,
        slotId: booking.slotId,
        alumniId: booking.alumniId,
        studentId,
        date: slot ? slot.date : null,
        startTime: slot ? slot.startTime : null,
        endTime: slot ? slot.endTime : null,
        autoBookedStudent: autoBookedStudent
      };
      
      // Notify all clients about the cancelled booking
      webSocketServer.broadcastNotification({
        type: 'booking_cancelled',
        data: bookingData
      });
    }

    res.status(200).json({
      success: true,
      data: {
        cancelledBooking: booking,
        autoBookedStudent: autoBookedStudent
      },
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message
    });
  }
};

// Get bookings for a student
const getStudentBookings = async (req, res) => {
  try {
    const studentId = req.user.id;
    console.log('Fetching bookings for student:', studentId);
    const currentDate = new Date();
    console.log('Current date for filtering:', currentDate);
    
    // Find upcoming bookings for the student
    console.log('Attempting to find bookings for student:', studentId);
    const bookings = await Booking.find({ 
      studentId, 
      status: 'confirmed' 
    }).populate({
      path: 'slotId',
      populate: {
        path: 'alumniId',
        select: 'firstName lastName profilePicture'
      }
    });
    
    console.log('Found bookings:', bookings);

    // Filter out bookings without slots (past slots that were removed) and past slots
    console.log('Filtering bookings...');
    const validBookings = bookings.filter(booking => {
      console.log('Checking booking:', booking._id, 'Slot exists:', !!booking.slotId);
      if (!booking.slotId) {
        console.log('Booking', booking._id, 'has no slot, filtering out');
        return false;
      }
      
      // Check if slot date is in the future
      try {
        const slotDate = new Date(booking.slotId.date);
        console.log('Slot date:', slotDate, 'Current date:', currentDate);
        const isValid = slotDate >= currentDate;
        console.log('Is slot valid (future date):', isValid);
        return isValid;
      } catch (dateError) {
        console.error('Error parsing slot date for booking:', booking._id, dateError);
        return false;
      }
    });
    
    console.log('Valid bookings:', validBookings);

    res.status(200).json({
      success: true,
      data: validBookings
    });
  } catch (error) {
    console.error('Error fetching student bookings:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your bookings',
      error: error.message
    });
  }
};

// Function to remove expired slots
const removeExpiredSlots = async () => {
  try {
    const currentDate = new Date();
    
    // Find all slots that have ended
    const expiredSlots = await AvailabilitySlot.find({
      date: { $lte: currentDate },
      status: { $in: ['available', 'full'] }
    });
    
    // Update their status to 'completed'
    for (const slot of expiredSlots) {
      const slotDate = new Date(slot.date);
      const [endHours, endMinutes] = slot.endTime.split(':').map(Number);
      slotDate.setHours(endHours, endMinutes, 0, 0);
      
      // If the slot end time has passed, mark it as completed
      if (slotDate < currentDate) {
        slot.status = 'completed';
        await slot.save();
        
        // Send real-time update to all connected clients
        if (webSocketServer) {
          const slotData = {
            slotId: slot._id,
            alumniId: slot.alumniId,
            date: slot.date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            maxParticipants: slot.maxParticipants,
            description: slot.description,
            status: slot.status
          };
          
          // Notify all clients about the completed slot
          webSocketServer.broadcastNotification({
            type: 'slot_completed',
            data: slotData
          });
        }
      }
    }
    
    console.log(`Checked for expired slots. Marked ${expiredSlots.length} slots as completed.`);
  } catch (error) {
    console.error('Error removing expired slots:', error);
  }
};

// Set up a periodic check for expired slots (every 10 minutes)
setInterval(removeExpiredSlots, 10 * 60 * 1000); // 10 minutes

// Delete a slot (alumni only)
const deleteSlot = async (req, res) => {
  try {
    const { slotId } = req.params;
    const alumniId = req.user.id;

    console.log('Attempting to delete slot:', { slotId, alumniId });

    // Validate slotId
    if (!slotId) {
      return res.status(400).json({
        success: false,
        message: 'Slot ID is required'
      });
    }

    // Find the slot and check if it belongs to the current user
    const slot = await AvailabilitySlot.findOne({ _id: slotId, alumniId });
    
    console.log('Found slot:', slot);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found or you do not have permission to delete it'
      });
    }

    // Delete the slot using deleteOne (modern Mongoose approach)
    await AvailabilitySlot.deleteOne({ _id: slotId });
    console.log('Slot removed from database');

    // Delete associated bookings
    const deletedBookings = await Booking.deleteMany({ slotId });
    console.log('Deleted associated bookings:', deletedBookings);

    // Send real-time update to all connected clients
    if (webSocketServer) {
      const slotData = {
        slotId,
        alumniId
      };
      
      // Notify all clients about the deleted slot
      webSocketServer.broadcastNotification({
        type: 'slot_deleted',
        data: slotData
      });
      console.log('Broadcast slot deletion notification');
    }

    res.status(200).json({
      success: true,
      message: 'Slot deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting slot:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete slot',
      error: error.message
    });
  }
};

// Get waiting list status for a slot
const getWaitingListStatus = async (req, res) => {
  try {
    const { slotId } = req.params;
    const studentId = req.user.id;
    
    const WaitingList = require('../models/WaitingList');
    
    // Check if student is on the waiting list
    const waitingListEntry = await WaitingList.findOne({ 
      slotId, 
      studentId 
    });
    
    // Get total number of people on waiting list
    const waitingListCount = await WaitingList.countDocuments({ slotId });
    
    // Get student's position in waiting list (if on list)
    let position = null;
    if (waitingListEntry) {
      position = await WaitingList.countDocuments({ 
        slotId, 
        addedAt: { $lt: waitingListEntry.addedAt } 
      }) + 1;
    }
    
    res.status(200).json({
      success: true,
      data: {
        isOnWaitingList: !!waitingListEntry,
        position: position,
        totalCount: waitingListCount
      }
    });
  } catch (error) {
    console.error('Error getting waiting list status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get waiting list status',
      error: error.message
    });
  }
};

// Leave waiting list for a slot
const leaveWaitingList = async (req, res) => {
  try {
    const { slotId } = req.params;
    const studentId = req.user.id;
    
    const WaitingList = require('../models/WaitingList');
    
    // Check if student is on the waiting list
    const waitingListEntry = await WaitingList.findOne({ 
      slotId, 
      studentId 
    });
    
    if (!waitingListEntry) {
      return res.status(400).json({
        success: false,
        message: 'You are not on the waiting list for this slot'
      });
    }
    
    // Remove student from waiting list
    await WaitingList.deleteOne({ _id: waitingListEntry._id });
    
    // Get updated waiting list count
    const waitingListCount = await WaitingList.countDocuments({ slotId });
    
    // Send real-time update to all connected clients
    if (webSocketServer) {
      const waitingListData = {
        slotId: slotId,
        studentId: studentId,
        action: 'left'
      };
      
      webSocketServer.broadcastNotification({
        type: 'waiting_list_updated',
        data: waitingListData
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        totalCount: waitingListCount
      },
      message: 'Successfully left the waiting list'
    });
  } catch (error) {
    console.error('Error leaving waiting list:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to leave waiting list',
      error: error.message
    });
  }
};

// Join waiting list for a slot
const joinWaitingList = async (req, res) => {
  try {
    const { slotId } = req.params;
    const studentId = req.user.id;
    
    const WaitingList = require('../models/WaitingList');
    
    // Check if student is already on the waiting list
    const existingWaitlistEntry = await WaitingList.findOne({ 
      slotId, 
      studentId 
    });
    
    if (existingWaitlistEntry) {
      return res.status(400).json({
        success: false,
        message: 'You are already on the waiting list for this slot'
      });
    }
    
    // Add student to waiting list
    const waitingListEntry = new WaitingList({
      slotId,
      studentId
    });
    
    await waitingListEntry.save();
    
    // Get updated waiting list count
    const waitingListCount = await WaitingList.countDocuments({ slotId });
    
    // Send real-time update to all connected clients
    if (webSocketServer) {
      const waitingListData = {
        slotId: slotId,
        studentId: studentId,
        action: 'joined'
      };
      
      webSocketServer.broadcastNotification({
        type: 'waiting_list_updated',
        data: waitingListData
      });
    }
    
    res.status(201).json({
      success: true,
      data: {
        totalCount: waitingListCount
      },
      message: 'Successfully joined the waiting list'
    });
  } catch (error) {
    console.error('Error joining waiting list:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to join waiting list',
      error: error.message
    });
  }
};

module.exports = {
  setWebSocketServer,
  createSlot,
  updateSlot,
  getUpcomingSlotsForAlumni,
  getMyUpcomingSlots,
  bookSlot,
  cancelBooking,
  getStudentBookings,
  getWaitingListStatus,
  leaveWaitingList,
  joinWaitingList,
  deleteSlot
};