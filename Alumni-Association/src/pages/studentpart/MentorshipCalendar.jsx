import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Users, Plus, X, ChevronDown } from 'lucide-react';
import databaseService from '../../services/databaseService';
import webSocketService from '../../services/webSocketService';

const MentorshipCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddAvailability, setShowAddAvailability] = useState(false);
  const [showUpcomingSessions, setShowUpcomingSessions] = useState(false);
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = '';
  const [showDateDetails, setShowDateDetails] = useState(false); // Add this state
  
  // New state for multiple day selection
  const [selectedDays, setSelectedDays] = useState([]);

  // Form state for adding availability
  const [availabilityForm, setAvailabilityForm] = useState({
    days: [], // Changed to array for multiple days
    date: '', // Single date for specific date selection
    startTime: '',
    endTime: '',
    maxParticipants: 5,
    description: ''
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
    
    // Set up WebSocket listener for real-time updates
    webSocketService.on('notification', handleWebSocketUpdate);
    
    // Clean up WebSocket listener
    return () => {
      webSocketService.off('notification', handleWebSocketUpdate);
    };
  }, []);

  // Handle WebSocket updates
  const handleWebSocketUpdate = (data) => {
    if (data.type === 'slot_created' || data.type === 'slot_updated' || data.type === 'slot_deleted' || data.type === 'slot_booked' || data.type === 'booking_cancelled') {
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
        // Filter out past slots and sort by date/time
        const now = new Date();
        const futureSlots = slotsResponse.data.filter(slot => {
          const slotDate = new Date(slot.date);
          const [hours, minutes] = slot.startTime.split(':').map(Number);
          slotDate.setHours(hours, minutes, 0, 0);
          return slotDate >= now;
        }).sort((a, b) => {
          // Sort by date and time
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          
          if (dateA.getTime() !== dateB.getTime()) {
            return dateA - dateB;
          }
          
          // If same date, sort by start time
          const [hoursA, minutesA] = a.startTime.split(':').map(Number);
          const [hoursB, minutesB] = b.startTime.split(':').map(Number);
          
          if (hoursA !== hoursB) {
            return hoursA - hoursB;
          }
          
          return minutesA - minutesB;
        });
        
        setAvailabilitySlots(futureSlots);
      }
      
      // Load upcoming sessions (for students, this would be their bookings)
      const bookingsResponse = await databaseService.getMyBookings();
      if (bookingsResponse.success) {
        setMyBookings(bookingsResponse.data);
        // Get the next upcoming session
        if (bookingsResponse.data.length > 0) {
          setUpcomingSessions([bookingsResponse.data[0]]);
        }
      }
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAvailabilityForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle checkbox changes for days
  const handleDayChange = (day) => {
    setAvailabilityForm(prev => {
      const days = prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day];
      
      return {
        ...prev,
        days
      };
    });
  };

  // Submit availability form
  const handleSubmitAvailability = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // For each selected day, create a slot
      if (availabilityForm.days.length > 0) {
        // Create slots for each selected day
        for (const day of availabilityForm.days) {
          const response = await databaseService.createSlot({
            date: availabilityForm.date,
            startTime: availabilityForm.startTime,
            endTime: availabilityForm.endTime,
            maxParticipants: availabilityForm.maxParticipants,
            description: availabilityForm.description
          });
          
          if (!response.success) {
            throw new Error(response.message || 'Failed to create availability slot');
          }
        }
      } else {
        // Create single slot for specific date
        const response = await databaseService.createSlot(availabilityForm);
        if (!response.success) {
          throw new Error(response.message || 'Failed to create availability slot');
        }
      }
      
      setShowAddAvailability(false);
      setAvailabilityForm({
        days: [],
        date: '',
        startTime: '',
        endTime: '',
        maxParticipants: 5,
        description: ''
      });
      loadData(); // Refresh data
    } catch (err) {
      setError('Failed to create availability slot');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get days in month for calendar
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  // Check if a date has sessions
  const hasSessionsOnDate = (date) => {
    if (!date) return false;
    
    // Check availability slots
    const hasAvailability = availabilitySlots.some(slot => {
      const slotDate = new Date(slot.date);
      return slotDate.toDateString() === date.toDateString();
    });
    
    // Check bookings
    const hasBooking = myBookings.some(booking => {
      if (!booking.slotId) return false;
      const slotDate = new Date(booking.slotId.date);
      return slotDate.toDateString() === date.toDateString();
    });
    
    return hasAvailability || hasBooking;
  };

  // Get session status for a date
  const getSessionStatus = (date) => {
    if (!date) return null;
    
    // Check for upcoming sessions
    const upcomingSlot = availabilitySlots.find(slot => {
      const slotDate = new Date(slot.date);
      return slotDate.toDateString() === date.toDateString() && slot.status === 'available';
    });
    
    if (upcomingSlot) return 'upcoming';
    
    // Check for completed sessions
    const completedSlot = availabilitySlots.find(slot => {
      const slotDate = new Date(slot.date);
      return slotDate.toDateString() === date.toDateString() && slot.status === 'completed';
    });
    
    if (completedSlot) return 'completed';
    
    return null;
  };

  // Format date as "Day | DD Mon YYYY"
  const formatDisplayDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
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

  // Calculate time difference for countdown
  const getTimeDifference = (date, time) => {
    if (!date || !time) return null;
    
    const [hours, minutes] = time.split(':');
    const sessionDate = new Date(date);
    sessionDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const now = new Date();
    const diffMs = sessionDate - now;
    
    if (diffMs <= 0) return null;
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    return { days: diffDays, hours: diffHours, minutes: diffMinutes, seconds: diffSeconds };
  };

  // Render calendar days
  const renderCalendarDays = () => {
    const days = getDaysInMonth(currentDate);
    
    return days.map((day, index) => {
      if (!day) {
        return (
          <div key={`empty-${index}`} className="h-24 border border-gray-200"></div>
        );
      }
      
      // Get all sessions for this date
      const sessionsForDate = [];
      
      // Add availability slots (only show slots that have NOT started yet)
      availabilitySlots.forEach(slot => {
        const slotDate = new Date(slot.date);
        if (slotDate.toDateString() === day.toDateString()) {
          // Check if the slot has started (compare with current time)
          const [hours, minutes] = slot.startTime.split(':').map(Number);
          const slotStartTime = new Date(slotDate);
          slotStartTime.setHours(hours, minutes, 0, 0);
          
          // Only show slots that have NOT started yet
          if (slotStartTime > new Date()) {
            sessionsForDate.push({
              type: 'slot',
              status: slot.status,
              startTime: slot.startTime,
              endTime: slot.endTime,
              data: slot
            });
          }
        }
      });
      
      // Add bookings
      myBookings.forEach(booking => {
        if (booking.slotId) {
          const slotDate = new Date(booking.slotId.date);
          if (slotDate.toDateString() === day.toDateString()) {
            sessionsForDate.push({
              type: 'booking',
              status: booking.status,
              startTime: booking.slotId.startTime,
              endTime: booking.slotId.endTime,
              data: booking
            });
          }
        }
      });
      
      const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
      
      return (
        <div
          key={day.toISOString()}
          className={`h-24 border border-gray-200 p-1 cursor-pointer transition-colors ${
            isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
          }`}
          onClick={() => {
            setSelectedDate(day);
            setShowDateDetails(true);
          }}
        >
          <div className="text-sm font-medium text-gray-700">
            {day.getDate()}
          </div>
          {/* Show dots for all sessions */}
          <div className="flex flex-wrap justify-center gap-1 mt-1">
            {sessionsForDate.slice(0, 6).map((session, index) => {
              // Determine if session is finished (based on end time)
              const sessionDate = new Date(day);
              const [startHours, startMinutes] = session.startTime.split(':').map(Number);
              const [endHours, endMinutes] = session.endTime.split(':').map(Number);
              const sessionStartTime = new Date(sessionDate);
              const sessionEndTime = new Date(sessionDate);
              sessionStartTime.setHours(startHours, startMinutes, 0, 0);
              sessionEndTime.setHours(endHours, endMinutes, 0, 0);
              
              const now = new Date();
              const isFinished = sessionEndTime < now;
              
              // Determine color based on status and whether it's finished
              let colorClass = 'bg-gray-300';
              if (isFinished) {
                colorClass = 'bg-green-500'; // Finished sessions are green
              } else {
                // For upcoming/active sessions, use status-based colors
                if (session.status === 'available' || session.status === 'confirmed') {
                  colorClass = 'bg-red-500'; // Active/upcoming sessions are red
                } else if (session.status === 'pending') {
                  colorClass = 'bg-yellow-500'; // Pending sessions are yellow
                } else if (session.status === 'completed' || session.status === 'cancelled') {
                  colorClass = 'bg-green-500'; // Completed/cancelled sessions are green
                }
              }
              
              return (
                <div 
                  key={index} 
                  className={`w-2 h-2 rounded-full ${colorClass}`}
                  title={`${session.type}: ${isFinished ? 'Completed' : session.status}`}
                ></div>
              );
            })}
            {sessionsForDate.length > 6 && (
              <div className="w-2 h-2 rounded-full bg-gray-400 flex items-center justify-center text-xs text-white">
                +{sessionsForDate.length - 6}
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  // Render availability slots for selected date with new format
  const renderAvailabilitySlots = () => {
    // Filter slots to only show those that haven't started yet
    const slotsForDate = availabilitySlots.filter(slot => {
      const slotDate = new Date(slot.date);
      if (slotDate.toDateString() !== selectedDate.toDateString()) {
        return false;
      }
      
      // Check if the slot has started (compare with current time)
      const [hours, minutes] = slot.startTime.split(':').map(Number);
      const slotStartTime = new Date(slotDate);
      slotStartTime.setHours(hours, minutes, 0, 0);
      
      // Only show slots that have NOT started yet
      return slotStartTime > new Date();
    });
    
    // Sort slots by start time
    slotsForDate.sort((a, b) => {
      const [hoursA, minutesA] = a.startTime.split(':').map(Number);
      const [hoursB, minutesB] = b.startTime.split(':').map(Number);
      
      if (hoursA !== hoursB) {
        return hoursA - hoursB;
      }
      
      return minutesA - minutesB;
    });
    
    if (slotsForDate.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500">
          No availability slots for this date
        </div>
      );
    }
    
    return slotsForDate.map((slot) => {
      const timeDiff = getTimeDifference(slot.date, slot.startTime);
      
      return (
        <div key={slot._id} className="border border-gray-200 rounded-lg p-4 mb-3">
          <div className="flex justify-between items-start">
            <div>
              {/* Updated format: Monday | 28 Oct 2025 */}
              <h3 className="font-medium text-gray-900">
                {(() => {
                  const slotDate = new Date(slot.date);
                  return slotDate.toLocaleDateString('en-US', { weekday: 'long' }) + ' | ' + 
                         slotDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                })()}
              </h3>
              {/* Time range: 10:00 AM – 12:00 PM */}
              <p className="text-gray-700 mt-1">
                {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
              </p>
              {/* Max persons: Max Persons: 5 */}
              <div className="flex items-center mt-2 text-gray-600">
                <Users size={14} className="mr-1" />
                <span>Max Persons: {slot.maxParticipants}</span>
              </div>
              {slot.description && (
                <p className="text-sm text-gray-600 mt-2">{slot.description}</p>
              )}
            </div>
            <button
              onClick={() => databaseService.deleteSlot(slot._id)}
              className="text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </button>
          </div>
          
          {timeDiff && (
            <div className="mt-2 text-sm">
              <span className="text-orange-600 font-medium">
                Starts in: {timeDiff.days > 0 && `${timeDiff.days}d `}
                {timeDiff.hours.toString().padStart(2, '0')}:
                {timeDiff.minutes.toString().padStart(2, '0')}:
                {timeDiff.seconds.toString().padStart(2, '0')}
              </span>
            </div>
          )}
        </div>
      );
    });
  };

  // Get next upcoming session
  const getNextUpcomingSession = () => {
    if (myBookings.length === 0) return null;
    
    // Find the earliest future booking
    const now = new Date();
    const futureBookings = myBookings.filter(booking => {
      if (!booking.slotId) return false;
      const slotDate = new Date(booking.slotId.date);
      const [hours, minutes] = booking.slotId.startTime.split(':');
      slotDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      return slotDate > now;
    });
    
    if (futureBookings.length === 0) return null;
    
    // Sort by date and return the earliest
    futureBookings.sort((a, b) => {
      const dateA = new Date(a.slotId.date);
      const [hoursA, minutesA] = a.slotId.startTime.split(':');
      dateA.setHours(parseInt(hoursA), parseInt(minutesA), 0, 0);
      
      const dateB = new Date(b.slotId.date);
      const [hoursB, minutesB] = b.slotId.startTime.split(':');
      dateB.setHours(parseInt(hoursB), parseInt(minutesB), 0, 0);
      
      return dateA - dateB;
    });
    
    return futureBookings[0];
  };

  const nextSession = getNextUpcomingSession();

  // Add state for countdown updates
  const [countdowns, setCountdowns] = useState({});
  
  // Ref to keep track of interval ID for cleanup
  const countdownIntervalRef = useRef(null);
  
  // Update countdowns every second
  useEffect(() => {
    // Clear any existing interval
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    
    // Set up interval to update countdowns
    countdownIntervalRef.current = setInterval(() => {
      // Update next session countdown
      if (nextSession && nextSession.slotId) {
        const diff = getTimeDifference(nextSession.slotId.date, nextSession.slotId.startTime);
        setCountdowns(prev => ({
          ...prev,
          nextSession: diff
        }));
      }
      
      // Update upcoming sessions countdowns
      myBookings.forEach(booking => {
        if (booking.slotId) {
          const diff = getTimeDifference(booking.slotId.date, booking.slotId.startTime);
          setCountdowns(prev => ({
            ...prev,
            [booking._id]: diff
          }));
        }
      });
    }, 1000);
    
    // Cleanup interval on unmount
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [nextSession, myBookings]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mentorship Calendar</h1>
          <p className="text-gray-600 mt-2">
            Manage your availability and view upcoming mentorship sessions
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                    className="p-2 rounded-md hover:bg-gray-100"
                  >
                    &larr;
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                    className="p-2 rounded-md hover:bg-gray-100"
                  >
                    &rarr;
                  </button>
                </div>
              </div>

              {/* Calendar Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {renderCalendarDays()}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center mt-6 space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm text-gray-600">Upcoming</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm text-gray-600">Completed</span>
                </div>
              </div>
            </div>

            {/* Selected Date Details */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {formatDisplayDate(selectedDate)}
              </h2>
              
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-700">Your Availability</h3>
                <button
                  onClick={() => setShowAddAvailability(true)}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <Plus size={16} className="mr-1" />
                  Add Availability
                </button>
              </div>
              
              {renderAvailabilitySlots()}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Upcoming Sessions */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Upcoming Sessions</h2>
                <button 
                  onClick={() => setShowUpcomingSessions(!showUpcomingSessions)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronDown 
                    size={20} 
                    className={`transform transition-transform ${showUpcomingSessions ? 'rotate-180' : ''}`} 
                  />
                </button>
              </div>
              
              {nextSession ? (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {(() => {
                          const sessionDate = new Date(nextSession.slotId.date);
                          return sessionDate.toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          });
                        })()}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatTime(nextSession.slotId.startTime)} – {formatTime(nextSession.slotId.endTime)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        with {nextSession.slotId.alumniId?.firstName} {nextSession.slotId.alumniId?.lastName}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Upcoming
                    </span>
                  </div>
                  
                  {getTimeDifference(nextSession.slotId.date, nextSession.slotId.startTime) && (
                    <div className="mt-3">
                      <p className="text-sm text-orange-600 font-medium">
                        Starts in: {
                          (() => {
                            const diff = countdowns.nextSession || getTimeDifference(nextSession.slotId.date, nextSession.slotId.startTime);
                            return `${diff.days > 0 ? `${diff.days}d ` : ''}${diff.hours.toString().padStart(2, '0')}:${diff.minutes.toString().padStart(2, '0')}:${diff.seconds.toString().padStart(2, '0')}`;
                          })()
                        }
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No upcoming sessions
                </p>
              )}
              
              {showUpcomingSessions && (
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-700 mb-2">All Upcoming Sessions</h4>
                  {myBookings.length > 0 ? (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {myBookings.map(booking => {
                        if (!booking.slotId) return null;
                        
                        const slotDate = new Date(booking.slotId.date);
                        const [hours, minutes] = booking.slotId.startTime.split(':');
                        slotDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                        
                        const now = new Date();
                        if (slotDate <= now) return null;
                        
                        return (
                          <div key={booking._id} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {slotDate.toLocaleDateString('en-US', { 
                                    weekday: 'short', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {formatTime(booking.slotId.startTime)} – {formatTime(booking.slotId.endTime)}
                                </p>
                              </div>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Booked
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-2">
                      No upcoming sessions
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">This Month</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Slots</span>
                  <span className="font-medium">{availabilitySlots.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Booked Sessions</span>
                  <span className="font-medium">{myBookings.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Slots</span>
                  <span className="font-medium">
                    {availabilitySlots.filter(slot => slot.status === 'available').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Availability Modal */}
        {showAddAvailability && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Add Availability</h3>
                  <button
                    onClick={() => setShowAddAvailability(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmitAvailability}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Days of Week
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                          <div key={day} className="flex items-center">
                            <input
                              type="checkbox"
                              id={day}
                              checked={availabilityForm.days.includes(day)}
                              onChange={() => handleDayChange(day)}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor={day} className="ml-2 text-sm text-gray-700">
                              {day}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={availabilityForm.date}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Time
                        </label>
                        <input
                          type="time"
                          name="startTime"
                          value={availabilityForm.startTime}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maximum Persons per Slot
                      </label>
                      <input
                        type="number"
                        name="maxParticipants"
                        min="1"
                        value={availabilityForm.maxParticipants}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <p className="mt-1 text-sm text-gray-500">
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
                        rows="3"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add details about this session..."
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddAvailability(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Adding...' : 'Add Availability'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Date Details Popup */}
        {showDateDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <button 
                    onClick={() => setShowDateDetails(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                {/* Get sessions for selected date */}
                {(() => {
                  // Get all sessions for this date
                  const sessionsForDate = [];
                  
                  // Add availability slots (only show slots that have NOT started yet)
                  availabilitySlots.forEach(slot => {
                    const slotDate = new Date(slot.date);
                    if (slotDate.toDateString() === selectedDate.toDateString()) {
                      // Check if the slot has started (compare with current time)
                      const [hours, minutes] = slot.startTime.split(':').map(Number);
                      const slotStartTime = new Date(slotDate);
                      slotStartTime.setHours(hours, minutes, 0, 0);
                      
                      // Only show slots that have NOT started yet
                      if (slotStartTime > new Date()) {
                        sessionsForDate.push({
                          type: 'slot',
                          status: slot.status,
                          startTime: slot.startTime,
                          endTime: slot.endTime,
                          data: slot
                        });
                      }
                    }
                  });
                  
                  // Add bookings
                  myBookings.forEach(booking => {
                    if (booking.slotId) {
                      const slotDate = new Date(booking.slotId.date);
                      if (slotDate.toDateString() === selectedDate.toDateString()) {
                        sessionsForDate.push({
                          type: 'booking',
                          status: booking.status,
                          startTime: booking.slotId.startTime,
                          endTime: booking.slotId.endTime,
                          data: booking
                        });
                      }
                    }
                  });
                  
                  return sessionsForDate.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-3">📅</div>
                      {selectedDate < new Date().setHours(0, 0, 0, 0) ? (
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
                              setShowDateDetails(false);
                              setShowAddAvailability(true);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                          >
                            Add Availability
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      <h4 className="font-medium text-gray-800">Scheduled Sessions ({sessionsForDate.length})</h4>
                      {sessionsForDate.map((session, index) => {
                        // Determine if session is finished (based on end time)
                        const sessionDate = new Date(selectedDate);
                        const [startHours, startMinutes] = session.startTime.split(':').map(Number);
                        const [endHours, endMinutes] = session.endTime.split(':').map(Number);
                        const sessionStartTime = new Date(sessionDate);
                        const sessionEndTime = new Date(sessionDate);
                        sessionStartTime.setHours(startHours, startMinutes, 0, 0);
                        sessionEndTime.setHours(endHours, endMinutes, 0, 0);
                        
                        const now = new Date();
                        const isFinished = sessionEndTime < now;
                        
                        return (
                          <div 
                            key={index} 
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-800">
                                  {session.type === 'slot' ? 'Mentorship Availability' : 'Booked Session'}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {formatTime(session.startTime)} – {formatTime(session.endTime)}
                                </p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full border ${
                                isFinished ? 'text-green-700 border-green-200 bg-green-100' :
                                session.status === 'available' || session.status === 'confirmed' ? 'text-red-700 border-red-200 bg-red-100' : 
                                session.status === 'pending' ? 'text-yellow-700 border-yellow-200 bg-yellow-100' : 
                                'text-green-700 border-green-200 bg-green-100'
                              }`}>
                                {isFinished ? 'Completed' : session.status}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorshipCalendar;