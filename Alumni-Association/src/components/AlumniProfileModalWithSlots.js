import React, { useState, useEffect, useRef } from 'react';
import { X, Award, Briefcase, Calendar, Star, Clock, MapPin, Mail, Linkedin, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import databaseService from '../services/databaseService';
import webSocketService from '../services/webSocketService';

const AlumniProfileModalMentorship = ({ alumni, onClose, followStatus, onFollowClick }) => {
  const [activeTab, setActiveTab] = useState('about');
  const [isFollowing, setIsFollowing] = useState(followStatus === 'following');
  const [followRequestSent, setFollowRequestSent] = useState(followStatus === 'requested');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [alumniDetails, setAlumniDetails] = useState(alumni);
  const [loadingProfile, setLoadingProfile] = useState(false);
  
  // Slot booking related state
  const [upcomingSlots, setUpcomingSlots] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingError, setBookingError] = useState('');
  const [bookingLoadingId, setBookingLoadingId] = useState(null);
  const [waitingListStatus, setWaitingListStatus] = useState({});
  const [waitingListLoadingId, setWaitingListLoadingId] = useState(null);
  const [cancellationLoadingId, setCancellationLoadingId] = useState(null);
  const [countdowns, setCountdowns] = useState({});
  const [loadingSlots, setLoadingSlots] = useState(true); // Add this line
  const countdownIntervalRef = useRef(null);

  // Load detailed alumni profile when modal opens
  useEffect(() => {
    const loadData = async () => {
      if (alumni.id) {
        setLoadingProfile(true);
        try {
          // Load alumni profile
          const profileResponse = await databaseService.getAlumniProfile(alumni.id);
          if (profileResponse.success) {
            setAlumniDetails(profileResponse.data.alumni);
          }
        } catch (err) {
          console.error('Failed to load data:', err);
          // Use the passed alumni data as fallback
          setAlumniDetails(alumni);
        } finally {
          setLoadingProfile(false);
        }
      }
    };

    loadData();
    
    // Set up WebSocket listener for real-time updates
    const handleSlotUpdate = (data) => {
      console.log('WebSocket notification received:', data);
      if (data.type === 'slot_updated' || data.type === 'slot_created' || data.type === 'booking_cancelled' || data.type === 'slot_auto_booked' || data.type === 'waiting_list_updated') {
        console.log('Handling slot update:', data.type);
        // Reload slots when there's an update
        if (alumni.id) {
          databaseService.getUpcomingSlotsForAlumni(alumni.id)
            .then(response => {
              if (response.success) {
                // Filter out past slots and sort by date/time
                const now = new Date();
                const futureSlots = response.data.filter(slot => {
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
                
                setUpcomingSlots(futureSlots);
              }
            })
            .catch(err => console.error('Failed to reload slots:', err));
          
          // Reload student's bookings
          databaseService.getMyBookings()
            .then(response => {
              if (response.success) {
                setMyBookings(response.data);
              }
            })
            .catch(err => console.error('Failed to reload bookings:', err));
            
          // Reload waiting list status if a slot is selected
          if (selectedSlot && selectedSlot._id) {
            loadWaitingListStatus(selectedSlot._id);
          }
        }
      }
    };
    
    webSocketService.on('notification', handleSlotUpdate);
    
    // Clean up WebSocket listener
    return () => {
      webSocketService.off('notification', handleSlotUpdate);
    };
  }, [alumni.id, alumni]);

  // Load waiting list status when a slot is selected
  useEffect(() => {
    const loadWaitingListStatusForSelectedSlot = async () => {
      if (selectedSlot && selectedSlot._id) {
        console.log('Loading waiting list status for selected slot:', selectedSlot._id);
        console.log('Current waiting list status:', waitingListStatus);
        await loadWaitingListStatus(selectedSlot._id);
      }
    };
    
    loadWaitingListStatusForSelectedSlot();
  }, [selectedSlot, waitingListStatus]); // Add waitingListStatus to dependencies

  // Clear booking error when selected slot changes
  useEffect(() => {
    setBookingError('');
  }, [selectedSlot]);

  // Update countdowns every second
  useEffect(() => {
    // Clear any existing interval
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    
    // Only set up interval if we have upcoming slots
    if (upcomingSlots.length > 0) {
      countdownIntervalRef.current = setInterval(() => {
        const newCountdowns = {};
        upcomingSlots.forEach(slot => {
          const timeDiff = getTimeDifference(slot.date, slot.startTime);
          if (timeDiff) {
            newCountdowns[slot._id] = timeDiff;
          }
        });
        setCountdowns(newCountdowns);
      }, 1000);
    }
    
    // Cleanup interval on unmount or when upcomingSlots change
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [upcomingSlots]);

  // Calculate total experience from all experiences
  const calculateTotalExperience = () => {
    if (!alumniDetails.experiences || !Array.isArray(alumniDetails.experiences)) return 0;
    
    return alumniDetails.experiences.reduce((total, exp) => {
      return total + (parseInt(exp.experience) || 0);
    }, 0);
  };

  // Get current experience (where isCurrent is true)
  const getCurrentExperience = () => {
    if (!alumniDetails.experiences || !Array.isArray(alumniDetails.experiences)) return null;
    
    return alumniDetails.experiences.find(exp => exp.isCurrent) || alumniDetails.experiences[0] || null;
  };

  const currentExperience = getCurrentExperience();
  const totalExperience = calculateTotalExperience();

  const handleFollowClickLocal = async () => {
    if (isFollowing || followRequestSent) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await databaseService.followAlumni(alumniDetails.id);
      
      if (response.success) {
        // Update local state
        setFollowRequestSent(true);
        setIsFollowing(false); // Not following yet, just requested
        
        // Call the parent's follow handler
        if (onFollowClick) {
          onFollowClick(alumniDetails.id, 'requested');
        }
      } else {
        throw new Error(response.message || 'Failed to send follow request');
      }
    } catch (err) {
      setError('Failed to send follow request. Please try again.');
      console.error('Follow error:', err);
      
      // Fallback to localStorage simulation
      try {
        const followData = JSON.parse(localStorage.getItem('followData') || '{}');
        followData[alumniDetails.id] = 'requested';
        localStorage.setItem('followData', JSON.stringify(followData));
        setFollowRequestSent(true);
        if (onFollowClick) {
          onFollowClick(alumniDetails.id, 'requested');
        }
      } catch (localStorageErr) {
        console.error('LocalStorage fallback error:', localStorageErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollowClickLocal = async () => {
    if (!isFollowing) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await databaseService.unfollowAlumni(alumniDetails.id);
      
      if (response.success) {
        // Update local state
        setIsFollowing(false);
        setFollowRequestSent(false);
        
        // Call the parent's follow handler
        if (onFollowClick) {
          onFollowClick(alumniDetails.id, 'follow');
        }
      } else {
        throw new Error(response.message || 'Failed to unfollow alumni');
      }
    } catch (err) {
      setError('Failed to unfollow alumni. Please try again.');
      console.error('Unfollow error:', err);
      
      // Fallback to localStorage simulation
      try {
        const followData = JSON.parse(localStorage.getItem('followData') || '{}');
        delete followData[alumniDetails.id];
        localStorage.setItem('followData', JSON.stringify(followData));
        setIsFollowing(false);
        setFollowRequestSent(false);
        if (onFollowClick) {
          onFollowClick(alumniDetails.id, 'follow');
        }
      } catch (localStorageErr) {
        console.error('LocalStorage fallback error:', localStorageErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const getFollowButtonText = () => {
    if (loading) return '...';
    if (isFollowing) return 'Following';
    if (followRequestSent) return 'Requested';
    return 'Follow';
  };

  const getFollowButtonClass = () => {
    if (loading) return 'bg-gray-300 text-gray-600 cursor-not-allowed';
    
    if (isFollowing) {
      return 'bg-gray-200 text-gray-800 hover:bg-gray-300';
    }
    
    if (followRequestSent) {
      return 'bg-blue-100 text-blue-800 cursor-not-allowed';
    }
    
    return 'bg-blue-600 text-white hover:bg-blue-700';
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

  // Get seat availability color
  const getSeatColor = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage >= 100) return 'bg-red-100 text-red-800';
    if (percentage >= 50) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Handle booking a slot
  const handleBookSlot = async (slotId) => {
    setBookingLoadingId(slotId);
    setBookingError('');
    
    try {
      const response = await databaseService.bookSlot(slotId);
      if (response.success) {
        // Reload slots to reflect the booking
        const slotsResponse = await databaseService.getUpcomingSlotsForAlumni(alumni.id);
        if (slotsResponse.success) {
          setUpcomingSlots(slotsResponse.data);
        }
        
        // Reload student bookings
        const bookingsResponse = await databaseService.getMyBookings();
        if (bookingsResponse.success) {
          setMyBookings(bookingsResponse.data);
        }
        
        // Show success message
        setBookingError('Successfully booked the slot!');
        // Clear the success message after 3 seconds
        setTimeout(() => {
          setBookingError('');
        }, 3000);
        
        // Force a re-render by updating the selected slot with new data
        if (selectedSlot && selectedSlot._id === slotId) {
          const updatedSlot = upcomingSlots.find(s => s._id === slotId);
          if (updatedSlot) {
            setSelectedSlot({...updatedSlot});
          }
        }
      } else {
        setBookingError(response.message || 'Failed to book slot');
      }
    } catch (err) {
      setBookingError('Failed to book slot. Please try again.');
      console.error('Booking error:', err);
    } finally {
      // Keep the button disabled for a short time to prevent double clicks
      setTimeout(() => {
        setBookingLoadingId(null);
      }, 1000);
    }
  };

  // Handle joining waiting list for a full slot
  const handleJoinWaitingList = async (slotId) => {
    console.log('Joining waiting list for slot:', slotId);
    // Add defensive check for slotId
    if (!slotId) {
      console.warn('Attempted to join waiting list with empty slotId');
      setBookingError('Invalid slot selected');
      return;
    }
    
    setWaitingListLoadingId(slotId);
    setBookingError('');
    
    try {
      // Directly join the waiting list instead of trying to book the slot
      const response = await databaseService.joinWaitingList(slotId);
      console.log('Join waiting list response:', response);
      if (response.success) {
        console.log('Successfully joined waiting list');
        
        // Update waiting list status in component state immediately
        setWaitingListStatus(prev => {
          const currentCount = prev[slotId] ? prev[slotId].totalCount : 0;
          return {
            ...prev,
            [slotId]: {
              isOnWaitingList: true,
              position: null, // Will be updated by loadWaitingListStatus
              totalCount: currentCount + 1
            }
          };
        });
        
        // Show success message
        setBookingError('Successfully joined the waiting list!');
        // Clear the success message after 3 seconds
        setTimeout(() => {
          setBookingError('');
        }, 3000);
        
        // Force a re-render by updating the selected slot with new data
        if (selectedSlot && selectedSlot._id === slotId) {
          const updatedSlot = upcomingSlots.find(s => s._id === slotId);
          if (updatedSlot) {
            setSelectedSlot({...updatedSlot});
          }
        }
        
        // Reload waiting list status to get accurate position AFTER updating the UI
        setTimeout(async () => {
          await loadWaitingListStatus(slotId);
        }, 100);
      } else {
        console.log('Failed to join waiting list:', response.message);
        setBookingError(response.message || 'Failed to join waiting list');
        
        // Reset loading state on error
        setWaitingListLoadingId(null);
      }
    } catch (err) {
      console.error('Waiting list error:', err);
      setBookingError('Failed to join waiting list. Please try again.');
      
      // Reset loading state on error
      setWaitingListLoadingId(null);
    }
  };

  // Handle leaving waiting list for a slot
  const handleLeaveWaitingList = async (slotId) => {
    console.log('Leaving waiting list for slot:', slotId);
    setWaitingListLoadingId(slotId);
    setBookingError('');
    
    try {
      const response = await databaseService.leaveWaitingList(slotId);
      console.log('Leave waiting list response:', response);
      if (response.success) {
        // Update waiting list status immediately
        setWaitingListStatus(prev => {
          // Create a copy of the previous state
          const newState = { ...prev };
          // Update the specific slot's status
          if (newState[slotId]) {
            newState[slotId] = {
              ...newState[slotId],
              isOnWaitingList: false,
              position: null
            };
            // Update totalCount if it exists
            if (newState[slotId].totalCount > 0) {
              newState[slotId].totalCount -= 1;
            }
          }
          return newState;
        });
        
        // Show success message
        setBookingError('Successfully left the waiting list');
        // Clear the success message after 3 seconds
        setTimeout(() => {
          setBookingError('');
        }, 3000);
        
        // Force a re-render by updating the selected slot with new data
        if (selectedSlot && selectedSlot._id === slotId) {
          const updatedSlot = upcomingSlots.find(s => s._id === slotId);
          if (updatedSlot) {
            setSelectedSlot({...updatedSlot});
          }
        }
      } else {
        setBookingError(response.message || 'Failed to leave waiting list');
        
        // Reset loading state on error
        setWaitingListLoadingId(null);
      }
    } catch (err) {
      setBookingError('Failed to leave waiting list. Please try again.');
      console.error('Leave waiting list error:', err);
      
      // Reset loading state on error
      setWaitingListLoadingId(null);
    }
  };

  // Load waiting list status for a slot
  const loadWaitingListStatus = async (slotId) => {
    try {
      console.log('Loading waiting list status for slot:', slotId);
      // Add defensive check for slotId
      if (!slotId) {
        console.warn('Attempted to load waiting list status with empty slotId');
        return;
      }
      
      const response = await databaseService.getWaitingListStatus(slotId);
      console.log('Waiting list status response:', response);
      if (response.success) {
        setWaitingListStatus(prev => {
          const newStatus = {
            ...prev,
            [slotId]: response.data
          };
          console.log('Updated waiting list status:', newStatus);
          return newStatus;
        });
      } else {
        console.error('Failed to get waiting list status:', response.message);
      }
    } catch (err) {
      console.error('Failed to load waiting list status:', err);
    } finally {
      // Reset loading state after loading is complete
      setWaitingListLoadingId(null);
    }
  };

  // Handle cancellation of a booking
  const handleCancelBooking = async (bookingId) => {
    setCancellationLoadingId(bookingId);
    setBookingError('');
    
    try {
      const response = await databaseService.cancelBooking(bookingId);
      if (response.success) {
        // Reload slots to reflect the cancellation
        const slotsResponse = await databaseService.getUpcomingSlotsForAlumni(alumni.id);
        if (slotsResponse.success) {
          setUpcomingSlots(slotsResponse.data);
        }
        
        // Reload student bookings
        const bookingsResponse = await databaseService.getMyBookings();
        if (bookingsResponse.success) {
          setMyBookings(bookingsResponse.data);
        }
        
        // Show auto-booking notification if applicable
        if (response.data && response.data.autoBookedStudent) {
          // In a real implementation, you might want to show a notification
          console.log('A student from the waiting list was automatically booked');
        }
        
        // Show success message
        setBookingError('Successfully cancelled the booking!');
        // Clear the success message after 3 seconds
        setTimeout(() => {
          setBookingError('');
        }, 3000);
        
        // Force a re-render by updating the selected slot with new data
        const booking = myBookings.find(b => b._id === bookingId);
        if (booking && booking.slotId && selectedSlot && selectedSlot._id === booking.slotId._id) {
          const updatedSlot = slotsResponse.data.find(s => s._id === booking.slotId._id);
          if (updatedSlot) {
            setSelectedSlot({...updatedSlot});
          }
        }
        
        // Don't close the modal immediately - let the user see the updated UI
        // The UI will automatically update to show "Book Slot" button
      } else {
        setBookingError(response.message || 'Failed to cancel booking');
      }
    } catch (err) {
      setBookingError('Failed to cancel booking. Please try again.');
      console.error('Cancellation error:', err);
    } finally {
      // Keep the button disabled for a short time to prevent double clicks
      setTimeout(() => {
        setCancellationLoadingId(null);
      }, 1000);
    }
  };

  const tabs = ["about", "experience", "skills", "mentorship"];

  if (loadingProfile) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative flex flex-col items-center justify-center h-64"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
        >
          {/* Close */}
          <button
            className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 transition"
            onClick={onClose}
          >
            <X size={22} />
          </button>

          {/* Header */}
          <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
            <div className="relative">
              {alumniDetails.profileImage ? (
                <img
                  src={alumniDetails.profileImage}
                  alt={alumniDetails.name}
                  className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-md">
                  {alumniDetails.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'AU'}
                </div>
              )}
              {alumniDetails.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                  <Award size={16} className="text-white" />
                </div>
              )}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800">{alumniDetails.name}</h2>
              <p className="text-gray-600">
                {currentExperience?.role || alumniDetails.currentPosition || 'Role not specified'} @ <span className="font-medium">{currentExperience?.company || alumniDetails.company || 'Company not specified'}</span>
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {alumniDetails.major || alumniDetails.department || 'Department not specified'} • Class of {alumniDetails.graduationYear || 'N/A'}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <MapPin size={12} /> {alumniDetails.location || 'Location not specified'}
                </span>
                <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <Briefcase size={12} /> {totalExperience} yrs experience
                </span>
              </div>
            </div>
            <div className="ml-auto flex flex-col items-end gap-2">
              {isFollowing ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleFollowClickLocal}
                    disabled={loading || isFollowing || followRequestSent}
                    className={`px-6 py-2 rounded-full font-medium ${getFollowButtonClass()} transition-colors ${
                      (isFollowing || followRequestSent || loading) ? 'cursor-default' : ''
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Request...
                      </span>
                    ) : (
                      getFollowButtonText()
                    )}
                  </button>
                  <button
                    onClick={handleUnfollowClickLocal}
                    disabled={loading}
                    className="px-6 py-2 rounded-full font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                  >
                    {loading ? 'Unfollowing...' : 'Unfollow'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleFollowClickLocal}
                  disabled={loading || isFollowing || followRequestSent}
                  className={`px-6 py-2 rounded-full font-medium ${getFollowButtonClass()} transition-colors ${
                    (isFollowing || followRequestSent || loading) ? 'cursor-default' : ''
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Request...
                    </span>
                  ) : (
                    getFollowButtonText()
                  )}
                </button>
              )}
              {error && <p className="text-red-500 text-xs mt-1 text-center">{error}</p>}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mb-5 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-3 font-medium text-sm ${
                  activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "about" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-700 text-lg mb-3">About</h3>
                <p className="text-gray-600 leading-relaxed">
                  {alumniDetails.bio || "This alumnus hasn't added a bio yet."}
                </p>
              </div>

              {/* Badges */}
              {alumniDetails.badges && alumniDetails.badges.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700 text-lg mb-3">Achievements</h3>
                  <div className="flex flex-wrap gap-2">
                    {alumniDetails.badges.map((badge, index) => (
                      <span key={`${badge.name}-${badge.points}-${index}`} className="inline-flex items-center gap-1 rounded-full border font-medium text-sm px-3 py-1 bg-yellow-100 text-yellow-800 border-yellow-300">
                        <Award size={14} />
                        {badge.name}
                        {badge.points > 0 && (
                          <span className="ml-1 bg-white bg-opacity-50 rounded-full px-1.5 py-0.5">
                            {badge.points}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">Total Experience</p>
                  <p className="text-2xl font-bold text-blue-900">{totalExperience} years</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-700">Graduation Year</p>
                  <p className="text-2xl font-bold text-green-900">{alumniDetails.graduationYear || 'N/A'}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 text-lg mb-3">Contact</h3>
                <div className="space-y-3">
                  {alumniDetails.email && (
                    <p className="flex items-center text-gray-700">
                      <Mail size={16} className="mr-2 text-gray-500" />
                      <a href={`mailto:${alumniDetails.email}`} className="text-blue-600 hover:underline">
                        {alumniDetails.email}
                      </a>
                    </p>
                  )}
                  {alumniDetails.linkedinProfile && (
                    <p className="flex items-center text-gray-700">
                      <Linkedin size={16} className="mr-2 text-gray-500" />
                      <a href={alumniDetails.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        LinkedIn Profile
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "experience" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 text-lg mb-2">Experience</h3>
              {alumniDetails.experiences?.length ? (
                alumniDetails.experiences.map((exp, idx) => (
                  <div
                    key={`${exp.role}-${exp.company}-${idx}`}
                    className="border-l-4 border-blue-500 pl-4 py-3 hover:bg-gray-50 rounded-md transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800 flex items-center gap-2">
                          <Briefcase size={16} />
                          {exp.role}
                        </p>
                        <p className="text-gray-700 text-sm mt-1">{exp.company}</p>
                        <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                          <MapPin size={12} /> {exp.location}
                        </p>
                        <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                          <Calendar size={12} /> {exp.experience} years
                        </p>
                      </div>
                      {exp.isCurrent && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Current
                        </span>
                      )}
                    </div>
                    {exp.description && (
                      <p className="text-gray-600 text-sm mt-2">{exp.description}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No experience added yet.</p>
              )}
            </div>
          )}

          {activeTab === "skills" && (
            <div>
              <h3 className="font-semibold text-gray-700 text-lg mb-3">Skills</h3>
              {alumniDetails.skills?.length ? (
                <div className="flex flex-wrap gap-2">
                  {alumniDetails.skills.map((skill, idx) => (
                    <span
                      key={`${skill}-${idx}`}
                      className="px-4 py-2 bg-blue-100 text-blue-700 text-sm rounded-full hover:bg-blue-200 transition"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No skills information available.</p>
              )}
            </div>
          )}

          {activeTab === "mentorship" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-700 text-lg mb-3 flex items-center gap-2">
                  <Clock size={20} /> Upcoming Mentorship Slots
                </h3>
                
                {isFollowing ? (
                  <div>
                    {loadingSlots ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    ) : upcomingSlots.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingSlots.map((slot) => {
                          // Use dynamic countdown from state instead of calculating on render
                          const timeDiff = countdowns[slot._id] || getTimeDifference(slot.date, slot.startTime);
                          const isFull = slot.currentBooked >= slot.maxParticipants;
                          
                          return (
                            <div 
                              key={slot._id} 
                              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => setSelectedSlot(slot)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {formatDisplayDate(slot.date)}
                                  </h4>
                                  <p className="text-gray-600">
                                    {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                                  </p>
                                  {slot.description && (
                                    <p className="text-sm text-gray-500 mt-1">
                                      {slot.description}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-col items-end">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    isFull 
                                      ? 'bg-red-100 text-red-800' 
                                      : getSeatColor(slot.currentBooked, slot.maxParticipants)
                                  }`}>
                                    <Users size={12} className="mr-1" />
                                    {slot.currentBooked}/{slot.maxParticipants}
                                  </span>
                                  {slot.status === 'full' && (
                                    <span className="mt-1 text-xs text-red-600">Slot Full</span>
                                  )}
                                </div>
                              </div>
                              
                              {timeDiff && (
                                <div className="mt-3">
                                  <p className="text-sm text-orange-600 font-medium">
                                    Starts in: {
                                      (() => {
                                        return `${timeDiff.days > 0 ? `${timeDiff.days}d ` : ''}${timeDiff.hours.toString().padStart(2, '0')}:${timeDiff.minutes.toString().padStart(2, '0')}:${timeDiff.seconds.toString().padStart(2, '0')}`;
                                      })()
                                    }
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Slots</h4>
                        <p className="text-gray-500">
                          This alumnus hasn't set any availability slots yet.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Follow to Access Mentorship</h4>
                    <p className="text-gray-500 mb-4">
                      You need to follow this alumnus to view their mentorship availability and send requests.
                    </p>
                    <button
                      onClick={handleFollowClickLocal}
                      disabled={loading || followRequestSent}
                      className={`px-6 py-2 rounded-full font-medium ${getFollowButtonClass()} transition-colors ${
                        (followRequestSent || loading) ? 'cursor-default' : ''
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending Request...
                        </span>
                      ) : (
                        followRequestSent ? 'Requested' : 'Follow to Connect'
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
      
      {/* Slot Details Modal */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Session Details</h3>
                <button
                  onClick={() => setSelectedSlot(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Add defensive check for selectedSlot */}
              {selectedSlot._id ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {formatDisplayDate(selectedSlot.date)}
                    </h4>
                    <p className="text-gray-600">
                      {formatTime(selectedSlot.startTime)} – {formatTime(selectedSlot.endTime)}
                    </p>
                  </div>
                  
                  {selectedSlot.description && (
                    <div>
                      <p className="text-gray-700">{selectedSlot.description}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Participants</p>
                      <p className="font-medium">
                        {selectedSlot.currentBooked}/{selectedSlot.maxParticipants}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedSlot.currentBooked >= selectedSlot.maxParticipants
                        ? 'bg-red-100 text-red-800'
                        : getSeatColor(selectedSlot.currentBooked, selectedSlot.maxParticipants)
                    }`}>
                      {selectedSlot.currentBooked >= selectedSlot.maxParticipants
                        ? 'Slot Full'
                        : `${selectedSlot.maxParticipants - selectedSlot.currentBooked} seats left`}
                    </span>
                  </div>
                  
                  {getTimeDifference(selectedSlot.date, selectedSlot.startTime) && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <p className="text-sm text-orange-700">
                        Starts in: {
                          (() => {
                            const diff = getTimeDifference(selectedSlot.date, selectedSlot.startTime);
                            return `${diff.days > 0 ? `${diff.days}d ` : ''}${diff.hours.toString().padStart(2, '0')}:${diff.minutes.toString().padStart(2, '0')}:${diff.seconds.toString().padStart(2, '0')}`;
                          })()
                        }
                      </p>
                    </div>
                  )}
                  
                  {isFollowing && (
                    <div className="mt-4">
                      {/* Check if student has already booked this slot */}
                      <div key={`booking-check-${selectedSlot._id}`}>
                        {(() => {
                          const isBooked = myBookings && myBookings.some(booking => booking.slotId && booking.slotId._id === selectedSlot._id);
                          const slotWaitingListStatus = waitingListStatus[selectedSlot._id];
                          console.log('Slot waiting list status:', slotWaitingListStatus);
                          
                          // Determine if user is on waiting list
                          // If we're currently loading a waiting list action, use the immediate state update
                          // Otherwise, use the state from waitingListStatus
                          let isOnWaitingList;
                          if (waitingListLoadingId === selectedSlot._id) {
                            // During loading, use the immediate state we set in handleJoinWaitingList/handleLeaveWaitingList
                            isOnWaitingList = slotWaitingListStatus ? slotWaitingListStatus.isOnWaitingList : false;
                          } else {
                            // When not loading, use the state from waitingListStatus
                            isOnWaitingList = slotWaitingListStatus ? slotWaitingListStatus.isOnWaitingList : false;
                          }
                          
                          const waitingListPosition = slotWaitingListStatus ? slotWaitingListStatus.position : null;
                          const waitingListCount = slotWaitingListStatus ? slotWaitingListStatus.totalCount : (selectedSlot.waitingListCount || 0);
                            
                            console.log('Booking status:', { isBooked, isOnWaitingList, waitingListPosition, waitingListCount });
                            
                            // Create a unique key that changes when the waiting list status changes
                            const bookingSectionKey = `booking-section-${selectedSlot._id}-${isOnWaitingList ? 'on-list' : 'not-on-list'}-${waitingListCount}`;
                            
                            return (
                              <div key={bookingSectionKey}>
                                {isBooked ? (
                                  <div key={`cancel-booking-section-${selectedSlot._id}`}>
                                    <button
                                      onClick={() => {
                                        const booking = myBookings.find(b => b.slotId && b.slotId._id === selectedSlot._id);
                                        if (booking) handleCancelBooking(booking._id);
                                      }}
                                      disabled={cancellationLoadingId !== selectedSlot._id && cancellationLoadingId !== null}
                                      className={`w-full py-2 px-4 rounded-md font-medium ${
                                        cancellationLoadingId === selectedSlot._id 
                                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                          : 'bg-red-600 text-white hover:bg-red-700'
                                      }`}
                                    >
                                      {cancellationLoadingId === selectedSlot._id ? (
                                        <span className="flex items-center justify-center">
                                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                          </svg>
                                          Cancelling...
                                        </span>
                                      ) : (
                                        'Cancel Booking'
                                      )}
                                    </button>
                                    <p className="text-sm text-gray-600 mt-2 text-center">You have booked this slot</p>
                                    {isOnWaitingList && (
                                      <p className="text-sm text-blue-600 mt-1 text-center">You were added through waiting list</p>
                                    )}
                                  </div>
                                ) : (
                                  <div key={`booking-options-section-${selectedSlot._id}`}>
                                    {selectedSlot.currentBooked >= selectedSlot.maxParticipants ? (
                                      // Slot is full - show waiting list information
                                      <div key={`full-slot-section-${selectedSlot._id}`}>
                                        {isOnWaitingList ? (
                                          // Student is already on waiting list
                                          <div className="text-center">
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                              <p className="text-blue-800 font-medium">You are on the waiting list</p>
                                              <p className="text-blue-600 text-sm mt-1">
                                                Position: {waitingListPosition !== null ? waitingListPosition : 'Loading...'} of {waitingListCount}
                                              </p>
                                            </div>
                                            <button
                                              onClick={() => handleLeaveWaitingList(selectedSlot._id)}
                                              disabled={waitingListLoadingId !== selectedSlot._id && waitingListLoadingId !== null}
                                              className={`w-full py-2 px-4 rounded-md font-medium ${
                                                waitingListLoadingId === selectedSlot._id
                                                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                  : 'bg-red-600 text-white hover:bg-red-700'
                                              }`}
                                            >
                                              {waitingListLoadingId === selectedSlot._id ? (
                                                <span className="flex items-center justify-center">
                                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                  </svg>
                                                  Leaving...
                                                </span>
                                              ) : (
                                                'Leave Waiting List'
                                              )}
                                            </button>
                                          </div>
                                        ) : (
                                          // Student is not on waiting list - show join button
                                          <div key={`join-waiting-list-${selectedSlot._id}`}>
                                            <button
                                              onClick={() => handleJoinWaitingList(selectedSlot._id)}
                                              disabled={waitingListLoadingId !== selectedSlot._id && waitingListLoadingId !== null}
                                              className={`w-full py-2 px-4 rounded-md font-medium ${
                                                waitingListLoadingId === selectedSlot._id
                                                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                                              }`}
                                            >
                                              {waitingListLoadingId === selectedSlot._id ? (
                                                <span className="flex items-center justify-center">
                                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                  </svg>
                                                  Joining Waiting List...
                                                </span>
                                              ) : (
                                                'Join Waiting List'
                                              )}
                                            </button>
                                            <p className="text-sm text-gray-600 mt-2 text-center">
                                              {waitingListCount > 0 
                                                ? `Queue: ${waitingListCount} ${waitingListCount === 1 ? 'person' : 'people'} waiting` 
                                                : 'Be the first on the waiting list'}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      // Slot has availability - show booking button
                                      <div key={`available-slot-section-${selectedSlot._id}`}>
                                        <button
                                          onClick={() => handleBookSlot(selectedSlot._id)}
                                          disabled={bookingLoadingId !== selectedSlot._id && bookingLoadingId !== null}
                                          className={`w-full py-2 px-4 rounded-md font-medium ${
                                            bookingLoadingId === selectedSlot._id
                                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                              : 'bg-blue-600 text-white hover:bg-blue-700'
                                          }`}
                                        >
                                          {bookingLoadingId === selectedSlot._id ? (
                                            <span className="flex items-center justify-center">
                                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                              </svg>
                                              Booking...
                                            </span>
                                          ) : (
                                            'Book Slot'
                                          )}
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                                {bookingError && (
                                  <p className="text-red-500 text-sm mt-2 text-center" key={`booking-error-${selectedSlot._id}`}>{bookingError}</p>
                                )}
                              </div>
                            );
                          })()}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">Invalid slot selected</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AlumniProfileModalMentorship;