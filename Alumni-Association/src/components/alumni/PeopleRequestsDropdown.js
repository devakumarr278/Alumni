import React, { useState, useEffect, useCallback, useRef } from 'react';
import { User, Check, X, Bell, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import notificationService from '../../services/notificationService';
import databaseService from '../../services/databaseService';
import webSocketService from '../../services/webSocketService';
import { getFollowRequests, getFollowers } from '../../services/followService';

// Helper function to calculate estimated graduation year for students
const calculateGraduationYear = (currentYear, department) => {
  if (!currentYear) return null;
  
  // Get current year
  const now = new Date();
  const currentFullYear = now.getFullYear();
  
  // Parse current year string (e.g., "1st Year", "2nd Year", etc.)
  let yearNumber = 1;
  if (currentYear.includes('1') || currentYear.includes('first') || currentYear.includes('First')) {
    yearNumber = 1;
  } else if (currentYear.includes('2') || currentYear.includes('second') || currentYear.includes('Second')) {
    yearNumber = 2;
  } else if (currentYear.includes('3') || currentYear.includes('third') || currentYear.includes('Third')) {
    yearNumber = 3;
  } else if (currentYear.includes('4') || currentYear.includes('fourth') || currentYear.includes('Fourth')) {
    yearNumber = 4;
  }
  
  // Most bachelor's programs are 4 years
  // So graduation year would be current year + (4 - current year number)
  const estimatedGraduationYear = currentFullYear + (4 - yearNumber);
  
  // But we should also consider that the academic year might have started or not
  // If it's after July, we're in the next academic year
  if (now.getMonth() >= 6) { // July is month 6 (0-indexed)
    return estimatedGraduationYear;
  } else {
    return estimatedGraduationYear - 1;
  }
};

const PeopleRequestsDropdown = ({ user }) => {
  console.log('Rendering PeopleRequestsDropdown for user:', user);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('requests'); // Change default to 'requests'
  const [notifications, setNotifications] = useState([]);
  const [followRequests, setFollowRequests] = useState([]); // Add follow requests state
  const [followers, setFollowers] = useState([]); // Add followers state
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const [selectedUser, setSelectedUser] = useState(null); // Add state for selected user
  const [removingRequests, setRemovingRequests] = useState(new Set()); // Track removing requests
  const [closingProfile, setClosingProfile] = useState(false); // Track profile closing
  const [loadingProfile, setLoadingProfile] = useState(false); // Track profile loading

  // Load notifications function
  const loadNotifications = useCallback(async () => {
    try {
      console.log('Loading notifications...');
      const response = await notificationService.getNotifications();
      console.log('Notifications response:', response);
      if (response.success) {
        // Sort notifications according to the specified logic
        const sortedNotifications = notificationService.sortNotifications(response.data.notifications);
        console.log('Sorted notifications:', sortedNotifications);
        console.log('Follow request notifications:', sortedNotifications.filter(n => n.type === 'follow_request').map(n => ({
          id: n._id,
          referenceId: n.referenceId,
          referenceIdType: typeof n.referenceId,
          title: n.title,
          message: n.message
        })));
        setNotifications(sortedNotifications);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }, []);

  // Load follow requests function
  const loadFollowRequests = useCallback(async () => {
    try {
      const response = await getFollowRequests();
      if (response.success) {
        setFollowRequests(response.data.followRequests || []);
      }
    } catch (error) {
      console.error('Failed to load follow requests:', error);
    }
  }, []);

  // Load followers function
  const loadFollowers = useCallback(async () => {
    try {
      const response = await getFollowers();
      if (response.success) {
        setFollowers(response.data.followers || []);
      }
    } catch (error) {
      console.error('Failed to load followers:', error);
    }
  }, []);

  // Load unread count function
  const loadUnreadCount = useCallback(async () => {
    try {
      console.log('Loading unread count...');
      const response = await notificationService.getUnreadCount();
      console.log('Unread count response:', response);
      if (response.success) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  }, []);

  // Handle new notifications
  const handleNewNotification = useCallback((data) => {
    console.log('Received new notification in PeopleRequestsDropdown:', data);
    if (data.type === 'new_notification') {
      // Reload notifications to get the new one
      if (isOpen) {
        loadNotifications();
      }
      // Update unread count
      loadUnreadCount();
    }
  }, [isOpen, loadNotifications, loadUnreadCount]);

  // Handle follow request updates
  const handleFollowRequestUpdate = useCallback((data) => {
    console.log('Received follow request update in PeopleRequestsDropdown:', data);
    if (data.type === 'follow_request_update') {
      // Show a message to the user
      if (data.data && data.data.status) {
        if (data.data.status === 'approved') {
          alert('A follow request has been approved. This person is now following you.');
        } else if (data.data.status === 'rejected') {
          alert('A follow request has been rejected.');
        }
      }
      
      // Reload data to update the follow request status
      if (isOpen) {
        if (activeTab === 'requests') {
          loadFollowRequests();
        } else if (activeTab === 'followers') {
          loadFollowers();
        }
      }
      // Update unread count
      loadUnreadCount();
    } else {
      console.log('Received non-follow-request-update message:', data);
    }
  }, [isOpen, loadFollowRequests, loadFollowers, loadUnreadCount, activeTab]);

  // Initialize WebSocket connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Initializing WebSocket with token:', token);
    if (token) {
      webSocketService.connect(token);
      
      // Listen for new notifications
      webSocketService.on('notification', handleNewNotification);
      
      // Listen for follow request updates
      webSocketService.on('notification', handleFollowRequestUpdate);
    }

    return () => {
      webSocketService.off('notification', handleNewNotification);
      webSocketService.off('notification', handleFollowRequestUpdate);
    };
  }, [handleNewNotification, handleFollowRequestUpdate]); // Add dependencies

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load data when dropdown opens or tab changes
  useEffect(() => {
    if (isOpen) {
      if (activeTab === 'requests') {
        loadFollowRequests();
      } else if (activeTab === 'followers') {
        loadFollowers();
      } else {
        loadNotifications();
      }
    }
    loadUnreadCount();
  }, [isOpen, activeTab, loadFollowRequests, loadFollowers, loadNotifications, loadUnreadCount]); // Add dependencies

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => 
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleAccept = async (id) => {
    try {
      // Add to removing set for animation
      setRemovingRequests(prev => new Set(prev).add(id));
      
      // Delay actual removal to allow animation
      setTimeout(async () => {
        const response = await databaseService.approveFollowRequest(id);
        if (response.success) {
          // Remove from requests list
          setFollowRequests(prev => prev.filter(r => r._id !== id));
          
          // Show success message
          alert('Successfully approved follow request. This person is now following you.');
          
          // Update unread count
          loadUnreadCount();
          
          // Send WebSocket message to update other clients
          webSocketService.sendMessage({
            type: 'follow_request_update',
            data: { 
              requestId: id,
              status: 'approved',
              alumniId: user._id // Use the current user ID
            }
          });
        }
        // Remove from removing set
        setRemovingRequests(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 300);
    } catch (err) {
      console.error('Error accepting request:', err);
      alert('Failed to approve follow request. Please try again.');
      // Remove from removing set on error
      setRemovingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleReject = async (id) => {
    try {
      // Add to removing set for animation
      setRemovingRequests(prev => new Set(prev).add(id));
      
      // Delay actual removal to allow animation
      setTimeout(async () => {
        const response = await databaseService.rejectFollowRequest(id);
        if (response.success) {
          // Remove from requests list
          setFollowRequests(prev => prev.filter(r => r._id !== id));
          
          // Show success message
          alert('Successfully rejected follow request.');
          
          // Update unread count
          loadUnreadCount();
          
          // Send WebSocket message to update other clients
          webSocketService.sendMessage({
            type: 'follow_request_update',
            data: { 
              requestId: id,
              status: 'rejected',
              alumniId: user._id // Use the current user ID
            }
          });
        }
        // Remove from removing set
        setRemovingRequests(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 300);
    } catch (err) {
      console.error('Error rejecting request:', err);
      alert('Failed to reject follow request. Please try again.');
      // Remove from removing set on error
      setRemovingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleAcceptMentorshipRequest = async (notification) => {
    try {
      console.log('Accepting mentorship request for notification:', notification);
      
      // Validate that we have a proper referenceId
      if (!notification.referenceId) {
        console.error('Missing referenceId in notification:', notification);
        alert('Error: Missing mentorship request ID. Please try again.');
        return;
      }
      
      // For now, we'll just mark the notification as read
      // In a real implementation, you would call an API to accept the mentorship request
      markAsRead(notification._id);
      
      // Show success message
      alert('Mentorship request accepted.');
      
      // Reload notifications to update the UI
      loadNotifications();
      
      // Update unread count
      loadUnreadCount();
    } catch (error) {
      console.error('Failed to accept mentorship request:', error);
      alert('An unexpected error occurred while accepting the mentorship request.');
    }
  };

  const handleSuggestTime = async (notification) => {
    try {
      console.log('Suggesting time for mentorship request:', notification);
      
      // Validate that we have a proper referenceId
      if (!notification.referenceId) {
        console.error('Missing referenceId in notification:', notification);
        alert('Error: Missing mentorship request ID. Please try again.');
        return;
      }
      
      // For now, we'll just mark the notification as read
      // In a real implementation, you would open a modal to suggest a time
      markAsRead(notification._id);
      
      // Show message
      alert('Time suggestion feature would open here.');
      
      // Reload notifications to update the UI
      loadNotifications();
      
      // Update unread count
      loadUnreadCount();
    } catch (error) {
      console.error('Failed to suggest time for mentorship request:', error);
      alert('An unexpected error occurred while processing the time suggestion.');
    }
  };

  const handleDeclineMentorshipRequest = async (notification) => {
    try {
      console.log('Declining mentorship request for notification:', notification);
      
      // Validate that we have a proper referenceId
      if (!notification.referenceId) {
        console.error('Missing referenceId in notification:', notification);
        alert('Error: Missing mentorship request ID. Please try again.');
        return;
      }
      
      // For now, we'll just mark the notification as read
      // In a real implementation, you would call an API to decline the mentorship request
      markAsRead(notification._id);
      
      // Show success message
      alert('Mentorship request declined.');
      
      // Reload notifications to update the UI
      loadNotifications();
      
      // Update unread count
      loadUnreadCount();
    } catch (error) {
      console.error('Failed to decline mentorship request:', error);
      alert('An unexpected error occurred while declining the mentorship request.');
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffMs = now - notificationDate;
    const diffDays = Math.floor(diffMs / 86600000);
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHrs > 0) {
      return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  // Safely get user name with fallbacks
  const getUserName = (user) => {
    if (!user) return 'Unknown User';
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Unknown User';
  };

  // Safely get user initials
  const getUserInitials = (user) => {
    if (!user) return 'UU';
    const firstInitial = user.firstName ? user.firstName.charAt(0) : '';
    const lastInitial = user.lastName ? user.lastName.charAt(0) : '';
    return (firstInitial + lastInitial) || user.email?.charAt(0) || 'UU';
  };

  const getMentorshipRequests = () => {
    return notifications.filter(n => n.type === 'mentorship_request');
  };

  const getOtherNotifications = () => {
    return notifications.filter(n => n.type !== 'follow_request' && n.type !== 'mentorship_request');
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // When opening, reset unread count
      setUnreadCount(0);
    }
  };

  const openProfile = async (user) => {
    setClosingProfile(false); // Reset closing state
    setLoadingProfile(true); // Set loading state
    
    try {
      console.log('Opening profile for user:', user);
      console.log('User object keys:', Object.keys(user));
      console.log('User ID:', user._id);
      console.log('User ID type:', typeof user._id);
      console.log('User ID value:', user._id);
      console.log('User role/type:', user.role || user.userType || 'unknown');
      
      // Check if this is a student profile
      const isStudent = user.role === 'student' || user.userType === 'student' || 
                     (user.email && user.email.includes('@')) || 
                     user.hasOwnProperty('registerNumber') ||
                     user.hasOwnProperty('currentYear');
      
      if (isStudent) {
        console.log('This is a student profile');
        // For students, fetch their profile using the new endpoint
        if (user._id) {
          console.log('Fetching student profile for user ID:', user._id);
          try {
            const response = await databaseService.getUserProfileById(user._id);
            console.log('Student profile response:', response);
            if (response.success && response.data) {
              console.log('Setting selected user with student data:', response.data);
              setSelectedUser(response.data);
            } else {
              console.log('API response structure not as expected, falling back to original user data');
              setSelectedUser(user);
            }
          } catch (error) {
            console.error('Error fetching student profile:', error);
            // Fallback to the original user data if API call fails
            setSelectedUser(user);
          }
        } else {
          console.log('No user ID found for student, using provided user data');
          setSelectedUser(user);
        }
      } 
      // If this is an alumni profile, fetch the complete alumni profile
      else if (user._id && (user.role === 'alumni' || user.userType === 'alumni')) {
        console.log('Fetching complete alumni profile for user ID:', user._id);
        const response = await databaseService.getAlumniProfile(user._id);
        console.log('Profile response:', response);
        if (response.success && response.data && response.data.alumni) {
          console.log('Setting selected user with real data:', response.data.alumni);
          // Check if this is mock data
          if (response.data.alumni.isMock) {
            console.warn('WARNING: Received mock data instead of real data!');
          }
          setSelectedUser(response.data.alumni);
        } else {
          console.log('API response structure not as expected, falling back to original user data');
          console.log('Response structure:', response);
          // Fallback to the original user data if API call fails
          setSelectedUser(user);
        }
      } else if (user._id) {
        // For other user types, try to get their profile using the general endpoint
        console.log('Fetching profile for user ID:', user._id);
        try {
          const response = await databaseService.getUserProfileById(user._id);
          console.log('Profile response:', response);
          if (response.success && response.data) {
            console.log('Setting selected user with real data:', response.data);
            setSelectedUser(response.data);
          } else {
            console.log('API response structure not as expected, falling back to original user data');
            setSelectedUser(user);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          // Fallback to the original user data if API call fails
          setSelectedUser(user);
        }
      } else {
        console.log('No user ID found, using provided user data');
        console.log('User object:', user);
        // For other cases, use the provided user data
        setSelectedUser(user);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      console.log('Falling back to original user data due to error');
      // Fallback to the original user data if API call fails
      setSelectedUser(user);
    } finally {
      setLoadingProfile(false);
    }
  };

  const closeProfile = () => {
    setClosingProfile(true); // Set closing state
    setTimeout(() => {
      setSelectedUser(null);
      setClosingProfile(false);
    }, 300);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
      >
        <User size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" style={{ animation: 'fadeIn 0.3s ease-out forwards' }}>
          <motion.div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.7, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              duration: 0.3
            }}
          >
            {/* Header with tabs */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Requests & Notifications</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('requests')}
                  className={`pb-2 px-1 relative ${
                    activeTab === 'requests' 
                      ? 'text-purple-600 font-semibold' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Follow Requests ({followRequests.length})
                  {activeTab === 'requests' && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
                      layoutId="tabIndicator"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('followers')}
                  className={`pb-2 px-1 relative ${
                    activeTab === 'followers' 
                      ? 'text-purple-600 font-semibold' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Followers ({followers.length})
                  {activeTab === 'followers' && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
                      layoutId="tabIndicator"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`pb-2 px-1 relative ${
                    activeTab === 'notifications' 
                      ? 'text-purple-600 font-semibold' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Notifications
                  {activeTab === 'notifications' && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
                      layoutId="tabIndicator"
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Content area */}
            <div className="overflow-y-auto max-h-[70vh]">
              <AnimatePresence mode="wait">
                {activeTab === 'requests' && (
                  <motion.div
                    key="requests"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.3 }}
                    className="p-4"
                  >
                    {followRequests.length === 0 ? (
                      <div className="text-center py-8">
                        <User size={48} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">No pending follow requests</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {followRequests.map((request) => {
                          // Safely access student data from followerId
                          const student = request.followerId || {};
                          const isRemoving = removingRequests.has(request._id);
                          
                          return (
                            <motion.div
                              key={request._id}
                              layout
                              initial={{ opacity: 1, x: 0 }}
                              animate={{ 
                                opacity: isRemoving ? 0 : 1, 
                                x: isRemoving ? 50 : 0,
                                height: isRemoving ? 0 : 'auto'
                              }}
                              exit={{ opacity: 0, x: 50, height: 0 }}
                              transition={{ 
                                duration: 0.3,
                                opacity: { duration: 0.2 },
                                height: { duration: 0.3 }
                              }}
                              className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-all duration-300 ${isRemoving ? 'pointer-events-none' : 'hover:shadow-lg'}`}
                              style={{
                                border: '1px solid rgba(0, 0, 0, 0.05)',
                                transform: isRemoving ? 'translateX(50px)' : 'translateX(0)',
                              }}
                            >
                              <div 
                                className="flex items-center space-x-3 cursor-pointer flex-grow"
                                onClick={() => openProfile(student)}
                              >
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg big-avatar"
                                     style={{ 
                                       boxShadow: '0 0 0 2px rgba(165, 180, 252, 0.8)',
                                       animation: 'breathe 2s infinite ease-in-out'
                                     }}>
                                  {getUserInitials(student)}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">{getUserName(student)}</p>
                                  <p className="text-sm text-gray-600">
                                    {student.department || 'Department not specified'} • {student.college || 'College not specified'}
                                  </p>
                                  <p className="text-xs text-gray-500">{formatTime(request.createdAt)}</p>
                                </div>
                              </div>
                              <div className="flex space-x-2 actions">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAccept(request._id);
                                  }}
                                  className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg"
                                  style={{ 
                                    willChange: 'transform',
                                    transition: 'transform 0.1s ease'
                                  }}
                                  onMouseDown={(e) => {
                                    e.currentTarget.style.transform = 'scale(0.8)';
                                  }}
                                  onMouseUp={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                  }}
                                >
                                  <Check size={20} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReject(request._id);
                                  }}
                                  className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
                                  style={{ 
                                    willChange: 'transform',
                                    transition: 'transform 0.1s ease'
                                  }}
                                  onMouseDown={(e) => {
                                    e.currentTarget.style.transform = 'scale(0.8)';
                                  }}
                                  onMouseUp={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                  }}
                                >
                                  <X size={20} />
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'followers' && (
                  <motion.div
                    key="followers"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="p-4"
                  >
                    {followers.length === 0 ? (
                      <div className="text-center py-8">
                        <User size={48} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">No followers yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {followers.map((follower) => {
                          // Safely access follower data from followerId
                          const followerUser = follower.followerId || {};
                          return (
                            <motion.div
                              key={follower._id}
                              layout
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ 
                                type: "spring", 
                                stiffness: 300, 
                                damping: 20,
                                duration: 0.3
                              }}
                              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 cursor-pointer hover:shadow-lg"
                              onClick={() => openProfile(followerUser)}
                              style={{
                                border: '1px solid rgba(0, 0, 0, 0.05)',
                              }}
                            >
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg big-avatar"
                                   style={{ 
                                     boxShadow: '0 0 0 2px rgba(165, 180, 252, 0.8)',
                                     animation: 'breathe 2s infinite ease-in-out'
                                   }}>
                                {getUserInitials(followerUser)}
                              </div>
                              <div className="ml-3">
                                <p className="font-medium text-gray-800">{getUserName(followerUser)}</p>
                                <p className="text-sm text-gray-600">
                                  {followerUser.department || 'Department not specified'} • {followerUser.college || 'College not specified'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Following since {follower.createdAt ? new Date(follower.createdAt).toLocaleDateString() : 'Unknown date'}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'notifications' && (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="p-4"
                  >
                    {/* Mentorship Requests */}
                    {getMentorshipRequests().length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-sm text-gray-500 mb-2">Mentorship Requests</h3>
                        <div className="space-y-3">
                          {getMentorshipRequests().map((notification) => (
                            <motion.div
                              key={notification._id}
                              layout
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.3 }}
                              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                  U
                                </div>
                                <div>
                                  <p className="font-medium">Mentorship Request</p>
                                  <p className="text-sm text-gray-500">{notification.message}</p>
                                  <p className="text-xs text-gray-400">{formatTime(notification.createdAt)}</p>
                                </div>
                              </div>
                              {!notification.isRead && (
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAcceptMentorshipRequest(notification);
                                    }}
                                    className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors"
                                  >
                                    <Check size={16} />
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSuggestTime(notification);
                                    }}
                                    className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                                  >
                                    <Clock size={16} />
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeclineMentorshipRequest(notification);
                                    }}
                                    className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Other Notifications */}
                    {getOtherNotifications().length > 0 ? (
                      <div className="space-y-3">
                        {getOtherNotifications().map((notification) => (
                          <motion.div
                            key={notification._id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            className={`p-3 rounded-lg ${
                              notification.isRead ? 'bg-gray-50' : 'bg-blue-50 border border-blue-100'
                            }`}
                            onClick={() => markAsRead(notification._id)}
                          >
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mt-1">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                  <Bell size={16} />
                                </div>
                              </div>
                              <div className="ml-3 flex-1">
                                <div className="flex justify-between">
                                  <h4 className="text-sm font-medium">
                                    {notification.title}
                                  </h4>
                                  {!notification.isRead && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </div>
                                <p className="text-sm text-gray-700 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatTime(notification.createdAt)}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Bell size={48} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">No notifications yet</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Modal */}
            <AnimatePresence>
              {selectedUser && (
                <motion.div
                  className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl bg-gray-900/90 shadow-[0px_0px_25px_rgba(100,100,255,0.3)] relative"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 40, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <button 
                      className="absolute right-4 top-3 bg-gray-800 text-white border-none text-xl rounded-full w-7 h-7 cursor-pointer transition-all duration-200 hover:bg-red-600"
                      onClick={closeProfile}
                    >
                      ×
                    </button>

                    <div className="border-3 border-purple-600 rounded-xl p-5 shadow-[0px_0px_15px_#7a1ce5]">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex justify-center items-center text-2xl font-bold text-white shadow-[0px_0px_20px_#b141ff]">
                          <span>{getUserInitials(selectedUser)}</span>
                        </div>
                        <motion.h2
                          className="text-white text-2xl font-bold"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          {getUserName(selectedUser)}
                        </motion.h2>
                        <motion.p
                          className="text-gray-400"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          {selectedUser.college || selectedUser.institution || selectedUser.collegeName || 'College not specified'} | {selectedUser.currentYear || '2nd Year'}
                        </motion.p>
                      </div>

                      <hr className="border-gray-700 my-4" />

                      {/* Info Section */}
                      <motion.div
                        className="text-gray-300 text-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="my-1"><strong>Age:</strong> {selectedUser.age || "Not provided"}</div>
                        <div className="my-1"><strong>Email:</strong> {selectedUser.email}</div>
                        <div className="my-1"><strong>Location:</strong> {selectedUser.location || "Not provided"}</div>
                        <div className="my-1"><strong>Graduation Year:</strong> {selectedUser.graduationYear || (selectedUser.currentYear && calculateGraduationYear(selectedUser.currentYear, selectedUser.department)) || "Not provided"}</div>
                        <div className="my-1"><strong>Department:</strong> {selectedUser.department || selectedUser.major || "Not provided"}</div>
                      </motion.div>

                      <hr className="border-gray-700 my-4" />

                      {/* Bio */}
                      <motion.h3
                        className="text-white text-lg font-semibold"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        Bio
                      </motion.h3>
                      <motion.p
                        className="text-gray-400 text-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        {selectedUser.bio || "No bio available"}
                      </motion.p>

                      <hr className="border-gray-700 my-4" />

                      {/* Skills */}
                      <motion.h3
                        className="text-white text-lg font-semibold"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        Skills
                      </motion.h3>
                      <motion.div
                        className="flex flex-wrap gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        {selectedUser.skills && selectedUser.skills.length > 0 ? (
                          selectedUser.skills.map((skill, index) => (
                            <span 
                              key={index} 
                              className="inline-block bg-gray-800 border border-blue-800 text-blue-400 px-3 py-1.5 rounded-2xl text-xs"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-400 text-sm">No skills added.</p>
                        )}
                      </motion.div>

                      <hr className="border-gray-700 my-4" />

                      {/* Social */}
                      <motion.h3
                        className="text-white text-lg font-semibold"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                      >
                        Connect
                      </motion.h3>
                      <motion.div
                        className="flex gap-3 mt-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 }}
                      >
                        {selectedUser.linkedinProfile || selectedUser.linkedin ? (
                          <a 
                            href={`https://${selectedUser.linkedinProfile || selectedUser.linkedin}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0e76a8] text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 hover:brightness-115"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.414v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                            LinkedIn
                          </a>
                        ) : null}
                        {selectedUser.githubProfile || selectedUser.github ? (
                          <a 
                            href={`https://${selectedUser.githubProfile || selectedUser.github}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#242424] text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 hover:brightness-115"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 1.205.84 1.839 1.304 1.839 1.304 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221 0 .111-.044.222-.124.314.714.42 1.538.811 2.435.811 1.096 0 1.92.4 2.434.811.08.092.124.203.124.314zm3.605 2.542c-.18-.31-.52-.514-.92-.514-.77 0-1.385.614-1.385 1.385 0 .77.615 1.385 1.385 1.385.4 0 .74-.204.92-.515zM12 11.806c-1.556 0-2.805 1.249-2.805 2.805 0 1.556 1.249 2.805 2.805 2.805 1.556 0 2.805-1.249 2.805-2.805 0-1.556-1.249-2.805-2.805-2.805zm0 4.994c-1.472 0-2.661-1.189-2.661-2.661 0-1.472 1.189-2.661 2.661-2.661 1.472 0 2.661 1.189 2.661 2.661 0 1.472-1.189 2.661-2.661 2.661z"/>
                            </svg>
                            GitHub
                          </a>
                        ) : null}
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Add CSS styles
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(40px); opacity: 0; }
    to   { transform: translateY(0);   opacity: 1; }
  }

  @keyframes breathe {
    0% { 
      transform: scale(1); 
      box-shadow: 0 0 0 0 rgba(165, 180, 252, 0.4);
    }
    50% { 
      transform: scale(1.05); 
      box-shadow: 0 0 0 8px rgba(165, 180, 252, 0.1);
    }
    100% { 
      transform: scale(1); 
      box-shadow: 0 0 0 0 rgba(165, 180, 252, 0.4);
    }
  }

  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
    100% { transform: translateY(0px); }
  }

  @keyframes shine {
    0% { transform: rotate(30deg) translate(-100%, -100%); }
    100% { transform: rotate(30deg) translate(100%, 100%); }
  }

  /* Profile Modal Styles */
  .profile-modal-overlay {
    position: fixed;
    inset: 0;
    background: #0000007c;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: fadeIn .3s ease;
    z-index: 9999;
    backdrop-filter: blur(5px);
  }

  .profile-modal-container {
    width: 480px;
    max-height: 85vh;
    overflow-y: auto;
    border-radius: 16px;
    background: rgba(17, 24, 39, 0.9);
    box-shadow: 0px 0px 25px rgba(100, 100, 255, 0.3);
    padding: 20px;
    position: relative;
    animation: slideUp .4s ease;
  }

  .glow-border {
    border: 3px solid #7a1ce5;
    border-radius: 14px;
    padding: 20px;
    box-shadow: 0px 0px 15px #7a1ce5;
  }

  .close-btn {
    position: absolute;
    right: 15px;
    top: 12px;
    background: #1f1f1f;
    color: white;
    border: none;
    font-size: 22px;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    cursor: pointer;
    transition: .2s;
  }

  .close-btn:hover {
    background: crimson;
  }

  .profile-header {
    text-align: center;
  }

  .avatar-glow {
    width: 80px;
    height: 80px;
    margin: auto;
    margin-bottom: 10px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4287f5, #b141ff);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 26px;
    color: white;
    font-weight: bold;
    box-shadow: 0px 0px 20px #b141ff;
  }

  .muted {
    color: #9ca3af;
  }

  .small {
    font-size: 0.85rem;
  }

  .divider {
    border: none;
    border-bottom: 1px solid #ffffff1a;
    margin: 15px 0;
  }

  .info-section div {
    margin: 6px 0;
    font-size: 15px;
    color: #d1d5db;
  }

  .skills span {
    display: inline-block;
    background: #131b2e;
    border: 1px solid #1e40af;
    color: #60a5fa;
    padding: 6px 12px;
    border-radius: 20px;
    margin: 4px;
    font-size: 13px;
  }

  .connect-buttons {
    display: flex;
    gap: 10px;
    margin-top: 8px;
  }

  .connect-buttons a {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: .2s;
    color: white;
  }

  .linkedin {
    background: #0e76a8;
  }

  .github {
    background: #242424;
  }

  .linkedin:hover,
  .github:hover {
    transform: scale(1.05);
    filter: brightness(1.15);
  }

  /* Animations */
  @keyframes slideUp {
    from { transform: translateY(40px); opacity: 0; }
    to   { transform: translateY(0);   opacity: 1; }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .big-avatar {
    animation: breathe 2s infinite ease-in-out;
  }

  .skill-box span {
    animation: float 3s ease-in-out infinite;
  }

  .skill-box span:nth-child(even) {
    animation-delay: 0.2s;
  }

  .skill-box span:nth-child(3n) {
    animation-delay: 0.4s;
  }

  .close {
    transform: scale(0.7) rotate(5deg) !important;
    opacity: 0 !important;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  // Remove existing style element if it exists
  const existingStyle = document.getElementById('people-requests-dropdown-styles');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  // Create new style element
  const styleElement = document.createElement('style');
  styleElement.id = 'people-requests-dropdown-styles';
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

export default PeopleRequestsDropdown;
