import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import databaseService from '../../services/databaseService';
import webSocketService from '../../services/webSocketService';

const MentorshipCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, agenda
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showAvailabilityPopup, setShowAvailabilityPopup] = useState(false);
  const [showReschedulePopup, setShowReschedulePopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // New states for upcoming sessions features
  const [showAllUpcomingSessions, setShowAllUpcomingSessions] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [countdowns, setCountdowns] = useState({});
  
  // Dynamic availability slots state - now from backend
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  
  // Form state for adding availability
  const [availabilityForm, setAvailabilityForm] = useState({
    date: '',
    day: '', // Auto-filled based on date
    startTime: '',
    endTime: '',
    maxParticipants: 5,
    description: ''
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
    setError(''); // Clear any existing errors on component mount
    
    // Set up WebSocket listener for real-time updates
    webSocketService.on('notification', handleWebSocketUpdate);
    
    // Clean up WebSocket listener
    return () => {
      webSocketService.off('notification', handleWebSocketUpdate);
    };
  }, []);
  
  // Also load data when events change
  useEffect(() => {
    // This useEffect runs when events change
  }, [events]);
  
  // Force load data on first render
  useEffect(() => {
    console.log('Component mounted, loading data');
    loadData();
  }, []);

  // Handle WebSocket updates
  const handleWebSocketUpdate = (data) => {
    if (data.type === 'slot_created' || data.type === 'slot_updated' || data.type === 'slot_deleted' || data.type === 'slot_completed') {
      // Refresh data when slots are updated
      loadData();
    }
  };

  // Load all necessary data
  const loadData = async () => {
    setLoading(true);
    try {
      // Load availability slots
      const slotsResponse = await databaseService.getMyUpcomingSlots();
      
      if (slotsResponse.success) {
        setAvailabilitySlots(slotsResponse.data);
        
        // Convert availability slots to events format for the calendar and upcoming sessions
        const slotEvents = slotsResponse.data.map((slot) => {
          // Handle date parsing more carefully
          let startDate;
          if (typeof slot.date === 'string') {
            // If it's already a string, parse it directly
            startDate = new Date(slot.date);
          } else {
            // If it's a Date object, use it directly
            startDate = new Date(slot.date);
          }
          
          const [startHours, startMinutes] = slot.startTime.split(':').map(Number);
          const [endHours, endMinutes] = slot.endTime.split(':').map(Number);
          
          // Format time as HH:MM AM/PM - HH:MM AM/PM
          const formatTimePeriod = (hours, minutes) => {
            const period = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
          };
          
          const timeString = `${formatTimePeriod(startHours, startMinutes)} - ${formatTimePeriod(endHours, endMinutes)}`;
          
          // For the student field, we want to show "Open Slot" for availability slots
          // Fix the date formatting to avoid timezone issues
          const formattedDate = startDate.getFullYear() + '-' + 
                               String(startDate.getMonth() + 1).padStart(2, '0') + '-' + 
                               String(startDate.getDate()).padStart(2, '0');
          
          // Format date info without timezone conversion issues
          const dateInfoFormatted = startDate.toLocaleDateString('en-US', { weekday: 'long' }) + ' | ' + 
                                  startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          
          return {
            id: `slot-${slot._id}`,
            title: 'Mentorship Program',
            date: formattedDate, // Use properly formatted date instead of toISOString
            time: timeString,
            student: 'Open Slot',
            dateInfo: dateInfoFormatted,
            type: 'mentorship',
            status: 'confirmed',
            slotId: slot._id,
            maxParticipants: slot.maxParticipants,
            currentBooked: slot.currentBooked || 0
          };
        });
        
        // Set events to only include real availability slots
        setEvents(slotEvents);
      }
    } catch (err) {
      setError('Failed to load data: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update countdowns every second
  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns = {};
      events.forEach(event => {
        if (event.type === 'mentorship' && event.status === 'confirmed') {
          // Parse the time correctly from the formatted string
          const timePart = event.time.split(' - ')[0]; // Get the start time part
          const [time, period] = timePart.split(' ');
          const [hours, minutes] = time.split(':').map(Number);
          
          // Convert to 24-hour format for comparison
          let hour24 = hours;
          if (period === 'PM' && hours !== 12) {
            hour24 += 12;
          } else if (period === 'AM' && hours === 12) {
            hour24 = 0;
          }
          
          const eventDate = new Date(event.date);
          eventDate.setHours(hour24, minutes, 0, 0);
          
          const now = new Date();
          const diff = eventDate - now;
          
          if (diff > 0) {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            newCountdowns[event.id] = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          } else {
            newCountdowns[event.id] = 'Session started';
          }
        }
      });
      setCountdowns(newCountdowns);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [events]);

  // Function to get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Function to get first day of month
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Function to format date as YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Function to get day name from date string
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Function to navigate to previous month/week
  const prevPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (viewMode === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
      setCurrentDate(newDate);
    }
  };

  // Function to navigate to next month/week
  const nextPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (viewMode === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
      setCurrentDate(newDate);
    }
  };

  // Function to get events for a specific date
  const getEventsForDate = (dateStr) => {
    return events.filter(event => event.date === dateStr);
  };

  // Function to handle date click
  const handleDateClick = (day) => {
    if (!day) return;
    setSelectedDate(day);
    setShowPopup(true);
  };

  // Function to close popup
  const closePopup = () => {
    setShowPopup(false);
    setSelectedDate(null);
  };

  // Function to open availability popup
  const openAvailabilityPopup = (event = null) => {
    setSelectedEvent(event);
    setShowAvailabilityPopup(true);
    setError(''); // Clear error when opening the form
    // Reset form when opening for new slot
    if (!event) {
      setAvailabilityForm({
        date: '',
        day: '',
        startTime: '',
        endTime: '',
        maxParticipants: 5,
        description: ''
      });
    }
  };

  // Function to close availability popup
  const closeAvailabilityPopup = () => {
    setShowAvailabilityPopup(false);
    setSelectedEvent(null);
    setError(''); // Clear error when closing the form
  };

  // Function to open reschedule popup
  const openReschedulePopup = (event) => {
    setSelectedEvent(event);
    setShowReschedulePopup(true);
  };

  // Function to close reschedule popup
  const closeReschedulePopup = () => {
    setShowReschedulePopup(false);
    setSelectedEvent(null);
  };

  // Handle date change to auto-fill day
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setAvailabilityForm(prev => ({
      ...prev,
      date: selectedDate,
      day: selectedDate ? getDayName(selectedDate) : ''
    }));
  };

  // Handle other form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAvailabilityForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit availability form
  const handleSubmitAvailability = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validate form data before submission
      if (!availabilityForm.date || !availabilityForm.startTime || !availabilityForm.endTime || !availabilityForm.maxParticipants) {
        throw new Error('Please fill in all required fields');
      }
      
      // Validate date is not in the past
      const selectedDate = new Date(availabilityForm.date);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < currentDate) {
        throw new Error('Cannot create slots for past dates');
      }
      
      // For today's slots, ensure at least 1 hour advance notice
      if (selectedDate.toDateString() === currentDate.toDateString()) {
        const [hours, minutes] = availabilityForm.startTime.split(':');
        const slotTime = new Date(selectedDate);
        slotTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        // Calculate time difference in hours
        const timeDiff = (slotTime - new Date()) / (1000 * 60 * 60); // Convert to hours
        
        if (timeDiff < 1) {
          throw new Error('For today\'s slots, the start time must be at least 1 hour from now');
        }
      }
      
      // Validate that end time is after start time
      const [startHours, startMinutes] = availabilityForm.startTime.split(':').map(Number);
      const [endHours, endMinutes] = availabilityForm.endTime.split(':').map(Number);
      
      const startDate = new Date(selectedDate);
      startDate.setHours(startHours, startMinutes, 0, 0);
      
      const endDate = new Date(selectedDate);
      endDate.setHours(endHours, endMinutes, 0, 0);
      
      if (endDate <= startDate) {
        throw new Error('End time must be after start time');
      }
      
      let response;
      
      // Check if we're editing an existing slot or creating a new one
      if (selectedEvent && selectedEvent._id) {
        // Update existing slot
        response = await databaseService.updateSlot(selectedEvent._id, availabilityForm);
      } else {
        // Create new slot
        response = await databaseService.createSlot(availabilityForm);
      }
      
      if (!response.success) {
        // Show specific error message from backend if available
        throw new Error(response.message || `Failed to ${selectedEvent && selectedEvent._id ? 'update' : 'create'} availability slot`);
      }
      
      closeAvailabilityPopup();
      loadData(); // Refresh data
    } catch (err) {
      // Show specific error message to user
      setError(err.message || 'An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete availability slot
  const deleteAvailabilitySlot = async (slotId) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await databaseService.deleteSlot(slotId);
      if (response.success) {
        loadData(); // Refresh data
      } else {
        setError(response.message || 'Failed to delete slot');
      }
    } catch (err) {
      setError('Failed to delete slot: ' + (err.message || 'Unknown error occurred'));
      console.error('Delete slot error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate calendar days for month view
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = formatDate(date);
      const dayEvents = getEventsForDate(dateStr);
      days.push({
        date: date,
        dateStr: dateStr,
        day: day,
        isToday: formatDate(new Date()) === dateStr,
        events: dayEvents
      });
    }
    
    return days;
  };

  // Generate week days for week view
  const generateWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = currentDate.getDay();
    const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateStr = formatDate(date);
      const dayEvents = getEventsForDate(dateStr);
      days.push({
        date: date,
        dateStr: dateStr,
        day: date.getDate(),
        weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday: formatDate(new Date()) === dateStr,
        events: dayEvents
      });
    }
    
    return days;
  };

  const calendarDays = viewMode === 'month' ? generateCalendarDays() : [];
  const weekDays = viewMode === 'week' ? generateWeekDays() : [];
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get status marker color based on requirements
  const getStatusMarkerColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get status marker label
  const getStatusMarkerLabel = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Upcoming';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  // Card component for consistent styling
  const Card = ({ children, className = '' }) => (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      {children}
    </div>
  );

  // Get upcoming and past sessions
  const getUpcomingSessions = () => {
    const today = new Date();
    return events
      .filter(event => new Date(event.date) >= today && event.type === 'mentorship')
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
  };

  const getPastSessions = () => {
    const today = new Date();
    return events
      .filter(event => new Date(event.date) < today && event.type === 'mentorship')
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  };

  // Get the very next upcoming session
  const getNextUpcomingSession = () => {
    const today = new Date();
    console.log('=== Filtering sessions ===');
    console.log('Current time:', today);
    console.log('Available events:', events);
    
    // Filter and sort events to find the next upcoming session
    const upcomingSessions = events
      .filter(event => {
        try {
          console.log('Checking event:', event);
          // Parse the time correctly from the formatted string
          const timePart = event.time.split(' - ')[0]; // Get the start time part
          const [time, period] = timePart.split(' ');
          const [hours, minutes] = time.split(':').map(Number);
          
          console.log('Parsed time components:', { time, period, hours, minutes });
          
          // Convert to 24-hour format for comparison
          let hour24 = hours;
          if (period === 'PM' && hours !== 12) {
            hour24 += 12;
          } else if (period === 'AM' && hours === 12) {
            hour24 = 0;
          }
          
          const eventDateTime = new Date(event.date);
          eventDateTime.setHours(hour24, minutes, 0, 0);
          
          console.log('Event datetime:', eventDateTime);
          console.log('Today datetime:', today);
          console.log('Comparison result (event >= today):', eventDateTime >= today);
          
          // Compare dates properly
          const result = eventDateTime >= today;
          console.log('Including event in results:', result);
          return result;
        } catch (error) {
          console.error('Error parsing event time:', error, 'Event:', event);
          return false; // Exclude events with parsing errors
        }
      })
      .sort((a, b) => {
        try {
          // Parse time for both events
          const parseEventTime = (event) => {
            const timePart = event.time.split(' - ')[0]; // Get the start time part
            const [time, period] = timePart.split(' ');
            const [hours, minutes] = time.split(':').map(Number);
            
            // Convert to 24-hour format for comparison
            let hour24 = hours;
            if (period === 'PM' && hours !== 12) {
              hour24 += 12;
            } else if (period === 'AM' && hours === 12) {
              hour24 = 0;
            }
            
            const eventDateTime = new Date(event.date);
            eventDateTime.setHours(hour24, minutes, 0, 0);
            return eventDateTime;
          };
          
          const dateA = parseEventTime(a);
          const dateB = parseEventTime(b);
          const result = dateA - dateB;
          console.log('Sorting events:', a.id, 'vs', b.id, 'Result:', result);
          return result;
        } catch (error) {
          console.error('Error sorting events:', error, 'Events:', a, b);
          return 0; // Keep original order for events with parsing errors
        }
      });
    
    console.log('Filtered and sorted upcoming sessions:', upcomingSessions);
    const result = upcomingSessions.length > 0 ? upcomingSessions[0] : null;
    console.log('Next session result:', result);
    console.log('=== End filtering sessions ===');
    
    return result;
  };

  // Get all upcoming sessions in next 1-2 weeks
  const getAllUpcomingSessions = () => {
    const today = new Date();
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(today.getDate() + 14);
    
    return events
      .filter(event => {
        try {
          // Parse the time correctly from the formatted string
          const timePart = event.time.split(' - ')[0]; // Get the start time part
          const [time, period] = timePart.split(' ');
          const [hours, minutes] = time.split(':').map(Number);
          
          // Convert to 24-hour format for comparison
          let hour24 = hours;
          if (period === 'PM' && hours !== 12) {
            hour24 += 12;
          } else if (period === 'AM' && hours === 12) {
            hour24 = 0;
          }
          
          const eventDateTime = new Date(event.date);
          eventDateTime.setHours(hour24, minutes, 0, 0);
          
          const isInRange = eventDateTime >= today && eventDateTime <= twoWeeksFromNow;
          return isInRange;
        } catch (error) {
          console.error('Error parsing event time in getAllUpcomingSessions:', error, 'Event:', event);
          return false; // Exclude events with parsing errors
        }
      })
      .sort((a, b) => {
        try {
          // Parse time for both events
          const parseEventTime = (event) => {
            const timePart = event.time.split(' - ')[0]; // Get the start time part
            const [time, period] = timePart.split(' ');
            const [hours, minutes] = time.split(':').map(Number);
            
            // Convert to 24-hour format for comparison
            let hour24 = hours;
            if (period === 'PM' && hours !== 12) {
              hour24 += 12;
            } else if (period === 'AM' && hours === 12) {
              hour24 = 0;
            }
            
            const eventDateTime = new Date(event.date);
            eventDateTime.setHours(hour24, minutes, 0, 0);
            return eventDateTime;
          };
          
          const dateA = parseEventTime(a);
          const dateB = parseEventTime(b);
          return dateA - dateB;
        } catch (error) {
          console.error('Error sorting events in getAllUpcomingSessions:', error, 'Events:', a, b);
          return 0; // Keep original order for events with parsing errors
        }
      });
  };

  const nextSession = getNextUpcomingSession();
  console.log('Calculated next session:', nextSession);
  
  // Get all upcoming sessions in next 1-2 weeks
  const allUpcomingSessions = getAllUpcomingSessions();
  
  const pastSessions = getPastSessions();

  // Get period title based on view mode
  const getPeriodTitle = () => {
    if (viewMode === 'month') {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else if (viewMode === 'week') {
      const startOfWeek = new Date(currentDate);
      const day = currentDate.getDay();
      const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return '';
  };

  // Function to get events for selected date in popup
  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];
    return events.filter(event => event.date === selectedDate.dateStr);
  };

  // Format time as "HH:MM AM/PM"
  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Render availability slots for the "Your Availability" section with new format
  const renderAvailabilitySlots = () => {
    // Sort slots by date and time
    const sortedSlots = [...availabilitySlots].sort((a, b) => {
      // First sort by date
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
      
      // If dates are the same, sort by start time
      const [hoursA, minutesA] = a.startTime.split(':').map(Number);
      const [hoursB, minutesB] = b.startTime.split(':').map(Number);
      
      if (hoursA !== hoursB) {
        return hoursA - hoursB;
      }
      
      return minutesA - minutesB;
    });
    
    return sortedSlots.map((slot) => (
      <div key={slot._id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
        <div>
          {/* First line: Thursday | Oct 30, 2025 */}
          <p className="font-medium text-gray-800 text-sm">
            {(() => {
              const slotDate = new Date(slot.date);
              return slotDate.toLocaleDateString('en-US', { weekday: 'long' }) + ' | ' + 
                     slotDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            })()}
          </p>
          {/* Second line: 12:00 PM - 1:00 PM */}
          <p className="text-xs text-gray-600">
            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
          </p>
        </div>
        <div className="flex space-x-1">
          <button 
            className="text-gray-500 hover:text-gray-700 p-1"
            onClick={() => {
              // Pre-fill form with existing slot data for editing
              // Fix the date formatting to avoid timezone issues
              const slotDate = new Date(slot.date);
              const formattedDate = slotDate.getFullYear() + '-' + 
                                   String(slotDate.getMonth() + 1).padStart(2, '0') + '-' + 
                                   String(slotDate.getDate()).padStart(2, '0');
              
              setAvailabilityForm({
                date: formattedDate,
                day: getDayName(slot.date),
                startTime: slot.startTime,
                endTime: slot.endTime,
                maxParticipants: slot.maxParticipants,
                description: slot.description || ''
              });
              setSelectedEvent(slot);
              setShowAvailabilityPopup(true);
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            className="text-gray-500 hover:text-red-500 p-1"
            onClick={() => deleteAvailabilitySlot(slot._id)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-2xl mr-4">
            📅
          </div>
          <div>
            <h1 className="text-2xl font-bold">Mentorship Calendar</h1>
            <p className="text-purple-100 mt-1">Manage your mentorship sessions and availability</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* View Toggle and Navigation */}
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex space-x-2">
                <button 
                  onClick={() => setViewMode('month')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    viewMode === 'month' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Month
                </button>
                <button 
                  onClick={() => setViewMode('week')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    viewMode === 'week' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Week
                </button>
                <button 
                  onClick={() => setViewMode('agenda')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    viewMode === 'agenda' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Agenda
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={prevPeriod}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-lg font-semibold text-gray-800">
                  {getPeriodTitle()}
                </h2>
                <button 
                  onClick={nextPeriod}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {viewMode === 'month' && (
              <>
                {/* Calendar Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    if (!day) {
                      return (
                        <div key={index} className="h-24 border border-gray-100"></div>
                      );
                    } else {
                      const isPrevMonth = (day.date.getMonth() < currentDate.getMonth() && day.date.getFullYear() === currentDate.getFullYear()) || day.date.getFullYear() < currentDate.getFullYear();
                      const isNextMonth = (day.date.getMonth() > currentDate.getMonth() && day.date.getFullYear() === currentDate.getFullYear()) || day.date.getFullYear() > currentDate.getFullYear();
                      const dayNumber = day.date.getDate();
                      
                      return (
                        <div 
                          key={index}
                          className={`h-24 border border-gray-100 p-1 cursor-pointer transition-all duration-200 ${
                            day.isToday 
                              ? 'bg-purple-50 border-2 border-purple-500' 
                              : isPrevMonth || isNextMonth 
                                ? 'bg-gray-50 text-gray-400' 
                                : 'hover:bg-gray-50'
                          }`}
                          onClick={() => {
                            const clickedDate = day.date;
                            const dayData = {
                              date: clickedDate,
                              dateStr: formatDate(clickedDate),
                              day: dayNumber,
                              isToday: formatDate(new Date()) === formatDate(clickedDate),
                              events: getEventsForDate(formatDate(clickedDate))
                            };
                            
                            handleDateClick(dayData);
                          }}
                        >
                          <div className="text-sm font-medium text-center">
                            {dayNumber}
                          </div>
                          {/* Show dots for events */}
                          <div className="flex flex-wrap justify-center gap-1 mt-1">
                            {day.events.slice(0, 6).map((event, index) => {
                              // Determine if event is finished (based on end time)
                              const eventDate = new Date(event.date);
                              const [startTime, periodStart] = event.time.split(' - ')[0].split(' ');
                              const [endTime, periodEnd] = event.time.split(' - ')[1].split(' ');
                              const [startHours, startMinutes] = startTime.split(':').map(Number);
                              const [endHours, endMinutes] = endTime.split(':').map(Number);
                              
                              // Convert to 24-hour format
                              let startHour24 = startHours;
                              if (periodStart === 'PM' && startHours !== 12) {
                                startHour24 += 12;
                              } else if (periodStart === 'AM' && startHours === 12) {
                                startHour24 = 0;
                              }
                              
                              let endHour24 = endHours;
                              if (periodEnd === 'PM' && endHours !== 12) {
                                endHour24 += 12;
                              } else if (periodEnd === 'AM' && endHours === 12) {
                                endHour24 = 0;
                              }
                              
                              const eventStartTime = new Date(eventDate);
                              const eventEndTime = new Date(eventDate);
                              eventStartTime.setHours(startHour24, startMinutes, 0, 0);
                              eventEndTime.setHours(endHour24, endMinutes, 0, 0);
                              
                              const now = new Date();
                              const isFinished = eventEndTime < now;
                              
                              // Determine color based on status and whether it's finished
                              let colorClass = 'bg-gray-300';
                              if (isFinished) {
                                colorClass = 'bg-green-500'; // Finished events are green
                              } else {
                                // For upcoming/active events, use status-based colors
                                if (event.status === 'confirmed') {
                                  colorClass = 'bg-red-500'; // Active/upcoming confirmed events are red
                                } else if (event.status === 'pending') {
                                  colorClass = 'bg-yellow-500'; // Pending events are yellow
                                } else if (event.status === 'cancelled') {
                                  colorClass = 'bg-green-500'; // Cancelled events are green
                                }
                              }
                              
                              return (
                                <div 
                                  key={index} 
                                  className={`w-2 h-2 rounded-full ${colorClass}`}
                                  title={`${event.title} - ${isFinished ? 'Completed' : event.status}`}
                                ></div>
                              );
                            })}
                            {day.events.length > 6 && (
                              <div className="w-2 h-2 rounded-full bg-gray-400 flex items-center justify-center text-xs text-white">
                                +{day.events.length - 6}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
                
                {/* Color Legend */}
                <div className="flex justify-end mt-4 space-x-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                    <span>Upcoming</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                    <span>Pending</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                    <span>Completed</span>
                  </div>
                </div>
              </>
            )}

            {viewMode === 'week' && (
              <div className="space-y-4">
                {weekDays.map((day) => (
                  <div 
                    key={day.dateStr} 
                    className={`border rounded-lg p-3 relative cursor-pointer transition-all duration-200 ${
                      day.isToday ? 'border-2 border-purple-500 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleDateClick(day)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className={`font-medium ${day.isToday ? 'text-purple-600' : 'text-gray-700'}`}>
                          {day.weekday}, {day.day}
                        </span>
                        {day.isToday && (
                          <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
                            Today
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openAvailabilityPopup();
                        }}
                        className="text-gray-400 hover:text-purple-600 text-sm"
                      >
                        + Add
                      </button>
                    </div>
                    
                    {day.events.length === 0 ? (
                      <div className="text-sm text-gray-500 mt-2 py-2">
                        No events scheduled
                      </div>
                    ) : (
                      <div className="mt-2 space-y-2">
                        {day.events.map((event) => (
                          <div 
                            key={event.id} 
                            className="flex items-center p-2 bg-white rounded border text-sm"
                          >
                            <div className={`w-3 h-3 rounded-full ${
                              event.status === 'confirmed' ? 'bg-red-500' : 
                              event.status === 'pending' ? 'bg-yellow-500' : 
                              'bg-green-500'
                            } mr-2`}></div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{event.title}</div>
                              <div className="text-gray-600 text-xs truncate">{event.student}</div>
                            </div>
                            <div className="text-gray-500 text-xs">{event.time}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {viewMode === 'agenda' && (
              <div className="space-y-3">
                {events
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .slice(0, 10)
                  .map((event) => (
                    <div 
                      key={event.id} 
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className={`w-3 h-3 rounded-full ${
                        event.status === 'confirmed' ? 'bg-red-500' : 
                        event.status === 'pending' ? 'bg-yellow-500' : 
                        'bg-green-500'
                      } mr-3`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="text-gray-600 text-sm truncate">{event.student}</div>
                        <div className="text-gray-500 text-xs">
                          {(() => {
                            const eventDate = new Date(event.date);
                            return eventDate.toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            });
                          })()} at {event.time}
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full border ${
                        event.status === 'confirmed' ? 'text-red-700 border-red-200 bg-red-100' : 
                        event.status === 'pending' ? 'text-yellow-700 border-yellow-200 bg-yellow-100' : 
                        'text-green-700 border-green-200 bg-green-100'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                  ))}
                  
                {/* Load More Button */}
                <div className="text-center mt-4">
                  <button className="px-4 py-2 text-purple-600 hover:text-purple-800 font-medium">
                    Load More Sessions
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Sessions */}
          <Card className="relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upcoming Sessions
              </h2>
              <div className="flex space-x-2">
                <button 
                  onClick={loadData}
                  className="text-gray-500 hover:text-gray-700"
                  title="Refresh data"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button 
                  onClick={() => setShowAllUpcomingSessions(!showAllUpcomingSessions)}
                  className="text-purple-600 hover:text-purple-800 text-sm"
                >
                  View All
                </button>
              </div>
            </div>
            
            {/* Dropdown mini sidebar for all upcoming sessions */}
            {showAllUpcomingSessions && (
              <div className="absolute right-0 top-0 mt-12 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">All Upcoming Sessions</h3>
                    <button 
                      onClick={() => setShowAllUpcomingSessions(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {allUpcomingSessions.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No upcoming sessions
                    </div>
                  ) : (
                    allUpcomingSessions.map((session) => (
                      <div 
                        key={session.id}
                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                          selectedSession && selectedSession.id === session.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => {
                          setSelectedSession(session);
                          setShowAllUpcomingSessions(false);
                        }}
                      >
                        <div className="font-bold text-purple-600 text-sm mb-1">{session.title}</div>
                        <div className="text-xs text-gray-600 mb-2">{session.dateInfo}</div>
                        <div className="text-xs text-gray-500 mb-1">{session.time}</div>
                        {session.status === 'confirmed' && countdowns[session.id] && (
                          <div className="text-xs text-blue-600 font-medium">
                            Starts in: {countdowns[session.id]}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            
            {/* Session details card */}
            {selectedSession && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-gray-800">
                        Session Details
                      </h3>
                      <button 
                        onClick={() => setSelectedSession(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold text-gray-800">{selectedSession.title}</h4>
                        <p className="text-gray-600 text-sm mt-1">With: {selectedSession.student}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Date & Time</p>
                            <p className="font-medium">
                              {(() => {
                                const sessionDate = new Date(selectedSession.date);
                                return sessionDate.toLocaleDateString('en-US', { weekday: 'long' });
                              })()}
                            </p>
                            <p className="font-medium">
                              {(() => {
                                const sessionDate = new Date(selectedSession.date);
                                return sessionDate.toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                });
                              })()}
                            </p>
                            <p className="font-medium">{selectedSession.time}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-600">Details</p>
                            <p className="font-medium">Maximum Persons: {selectedSession.maxParticipants || 'N/A'}</p>
                            <p className="font-medium">Registered: {selectedSession.currentBooked || 0}</p>
                            <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full border ${
                              selectedSession.status === 'confirmed' ? 'text-red-700 border-red-200 bg-red-100' : 
                              selectedSession.status === 'pending' ? 'text-yellow-700 border-yellow-200 bg-yellow-100' : 
                              'text-green-700 border-green-200 bg-green-100'
                            }`}>
                              {getStatusMarkerLabel(selectedSession.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {selectedSession.status === 'confirmed' && countdowns[selectedSession.id] && (
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                          <p className="text-sm text-gray-600">Session starts in</p>
                          <p className="text-2xl font-bold text-blue-700">{countdowns[selectedSession.id]}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Show only the very next upcoming session */}
            {nextSession ? (
              <div 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => setSelectedSession(nextSession)}
              >
                <div className="font-bold text-purple-600 text-sm mb-1">{nextSession.title}</div>
                <div className="text-xs text-gray-600 mb-2">{nextSession.dateInfo}</div>
                <div className="text-xs text-gray-500 mb-1">{nextSession.time}</div>
                {nextSession.status === 'confirmed' && countdowns[nextSession.id] && (
                  <div className="text-xs text-blue-600 font-medium">
                    Starts in: {countdowns[nextSession.id]}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">📅</div>
                <h3 className="font-medium text-gray-800 mb-1">No upcoming sessions</h3>
                <p className="text-sm text-gray-600 mb-4">Schedule your first mentorship session</p>
                <button 
                  onClick={openAvailabilityPopup}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                >
                  Add Availability
                </button>
              </div>
            )}
          </Card>

          {/* Availability */}
          <Card>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Your Availability
              </h2>
              <button 
                onClick={() => openAvailabilityPopup()}
                className="text-purple-600 hover:text-purple-800 text-sm"
              >
                Add Slot
              </button>
            </div>
            <div className="space-y-2">
              {renderAvailabilitySlots()}
              <button 
                onClick={() => openAvailabilityPopup()}
                className="w-full py-2 border border-dashed border-gray-300 rounded text-gray-600 hover:bg-gray-50 flex items-center justify-center text-sm"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Availability
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Date Popup */}
      {showPopup && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedDate.date.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <button 
                  onClick={closePopup}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {selectedDate.events.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">📅</div>
                  {selectedDate.date < new Date().setHours(0, 0, 0, 0) ? (
                    <>
                      <h3 className="font-medium text-gray-800 mb-1">No events conducted</h3>
                      <p className="text-sm text-gray-600">This date is in the past and no sessions were scheduled</p>
                    </>
                  ) : (
                    <>
                      <h3 className="font-medium text-gray-800 mb-1">No sessions scheduled</h3>
                      <p className="text-sm text-gray-600 mb-4">Would you like to schedule a session for this day?</p>
                      <button 
                        onClick={() => {
                          closePopup();
                          openAvailabilityPopup();
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                      >
                        Add Availability
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <h4 className="font-medium text-gray-800">Scheduled Sessions ({selectedDate.events.length})</h4>
                  {selectedDate.events.map((event) => (
                    <div 
                      key={event.id} 
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800">{event.title}</h4>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">With:</span> {event.student}
                          </p>
                          {event.type === 'mentorship' && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Role:</span> {event.type === 'mentorship' ? 'Mentor' : 'Participant'}
                            </p>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full border ${
                          event.status === 'confirmed' ? 'text-red-700 border-red-200 bg-red-100' : 
                          event.status === 'pending' ? 'text-yellow-700 border-yellow-200 bg-yellow-100' : 
                          'text-green-700 border-green-200 bg-green-100'
                        }`}>
                          {getStatusMarkerLabel(event.status)}
                        </span>
                      </div>
                      
                      <div className="mt-3 flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{event.time}</span>
                      </div>
                      
                      <div className="mt-3 flex space-x-2">
                        <button 
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs hover:bg-purple-200"
                          onClick={() => openReschedulePopup(event)}
                        >
                          Reschedule
                        </button>
                        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-gray-200">
                          Cancel
                        </button>
                        {event.status !== 'confirmed' && (
                          <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs hover:bg-green-200">
                            Confirm
                          </button>
                        )}
                        {event.status === 'confirmed' && (
                          <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs hover:bg-blue-200">
                            Join Meeting
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Availability Popup */}
      {showAvailabilityPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedEvent ? 'Edit Availability Slot' : 'Add Availability Slot'}
                </h3>
                <button 
                  onClick={closeAvailabilityPopup}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmitAvailability}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={availabilityForm.date}
                      onChange={handleDateChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Day (Auto-filled)
                    </label>
                    <input
                      type="text"
                      name="day"
                      value={availabilityForm.day}
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={availabilityForm.startTime}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={availabilityForm.endTime}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Persons per Slot
                    </label>
                    <input
                      type="number"
                      name="maxParticipants"
                      min="1"
                      max="75"
                      value={availabilityForm.maxParticipants}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum number of students that can book this slot
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      name="description"
                      value={availabilityForm.description}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      rows="3"
                      placeholder="Add details about this session..."
                    ></textarea>
                  </div>
                  
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button 
                      type="button"
                      onClick={closeAvailabilityPopup}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : (selectedEvent ? 'Update Slot' : 'Save Slot')}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Popup */}
      {showReschedulePopup && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Reschedule Session
                </h3>
                <button 
                  onClick={closeReschedulePopup}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-800">{selectedEvent.title}</h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">With:</span> {selectedEvent.student}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Current time:</span> {selectedEvent.time}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Status:</span> {getStatusMarkerLabel(selectedEvent.status)}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Date
                  </label>
                  <input 
                    type="date" 
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Time
                  </label>
                  <input 
                    type="time" 
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    onClick={closeReschedulePopup}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      closeReschedulePopup();
                      alert('Session rescheduled successfully!');
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorshipCalendar;