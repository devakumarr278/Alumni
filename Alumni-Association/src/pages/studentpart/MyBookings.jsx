import React, { useState, useEffect } from 'react';
import { Clock, Users, X, Calendar } from 'lucide-react';
import databaseService from '../../services/databaseService';
import webSocketService from '../../services/webSocketService';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Replace generic cancelling state with specific one for each booking
  const [cancellingId, setCancellingId] = useState(null);

  // Load bookings on component mount
  useEffect(() => {
    loadData();
    
    // Set up WebSocket listener for real-time updates
    const handleBookingUpdate = (data) => {
      if (data.type === 'booking_cancelled' || data.type === 'slot_auto_booked') {
        // Reload bookings when there's an update
        loadData();
      }
    };
    
    webSocketService.on('notification', handleBookingUpdate);
    
    // Clean up WebSocket listener
    return () => {
      webSocketService.off('notification', handleBookingUpdate);
    };
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await databaseService.getMyBookings();
      if (response.success) {
        setBookings(response.data);
      } else {
        setError(response.message || 'Failed to load bookings');
      }
    } catch (err) {
      setError('Failed to load bookings. Please try again.');
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancellation of a booking
  const handleCancelBooking = async (bookingId) => {
    setCancellingId(bookingId);
    setError('');
    
    try {
      const response = await databaseService.cancelBooking(bookingId);
      if (response.success) {
        // Reload bookings to reflect the cancellation
        loadData();
      } else {
        setError(response.message || 'Failed to cancel booking');
      }
    } catch (err) {
      setError('Failed to cancel booking. Please try again.');
      console.error('Cancellation error:', err);
    } finally {
      // Only reset the cancellingId for this specific booking after a delay to prevent double clicks
      setTimeout(() => {
        setCancellingId(null);
      }, 1000);
    }
  };

  // Format date as "Day | DD Mon YYYY"
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Mentorship Bookings</h1>
        <p className="text-gray-600">View and manage your upcoming mentorship sessions</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <Clock className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Upcoming Bookings</h3>
          <p className="text-gray-500 mb-6">
            You don't have any upcoming mentorship sessions scheduled.
          </p>
          <a 
            href="/studentpart/directory" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Users className="mr-2 h-4 w-4" />
            Find Mentors
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {bookings.map((booking) => {
              const slot = booking.slotId;
              if (!slot) return null;
              
              const timeDiff = getTimeDifference(slot.date, slot.startTime);
              
              return (
                <div key={booking._id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {booking.alumniId?.firstName} {booking.alumniId?.lastName}
                        </h3>
                        <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Confirmed
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-2">
                        <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="font-medium">
                          {formatDisplayDate(slot.date)}
                        </span>
                        <span className="mx-2">•</span>
                        <span>
                          {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                        </span>
                      </div>
                      
                      {slot.description && (
                        <p className="text-gray-600 text-sm mb-3">
                          {slot.description}
                        </p>
                      )}
                      
                      {timeDiff && (
                        <div className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                          <Clock className="mr-1 h-4 w-4" />
                          Starts in: {
                            (() => {
                              return `${timeDiff.days > 0 ? `${timeDiff.days}d ` : ''}${timeDiff.hours.toString().padStart(2, '0')}:${timeDiff.minutes.toString().padStart(2, '0')}:${timeDiff.seconds.toString().padStart(2, '0')}`;
                            })()
                          }
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4 flex flex-col items-end">
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 text-sm"
                      >
                        {cancellingId === booking._id ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Cancelling...
                          </span>
                        ) : (
                          'Cancel Booking'
                        )}
                      </button>
                      
                      <div className="mt-2 text-sm text-gray-500">
                        Booked on {new Date(booking.bookedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;