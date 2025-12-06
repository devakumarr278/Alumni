import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, X, Clock, User, Mail } from 'lucide-react';
import notificationService from '../../services/notificationService';
import databaseService from '../../services/databaseService';
import webSocketService from '../../services/webSocketService';

const NotificationDropdown = ({ user }) => {
  console.log('Rendering NotificationDropdown for user:', user);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Initializing WebSocket with token:', token);
    if (token) {
      webSocketService.connect(token);
      
      // Listen for new notifications
      webSocketService.on('notification', handleNewNotification);
    }

    return () => {
      webSocketService.off('notification', handleNewNotification);
    };
  }, []);

  const handleNewNotification = (data) => {
    if (data.type === 'new_notification') {
      // Reload notifications to get the new one
      if (isOpen) {
        loadNotifications();
      }
      // Update unread count
      loadUnreadCount();
    }
  };

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

  // Load notifications and unread count
  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
    loadUnreadCount();
  }, [isOpen]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getNotifications();
      if (response.success) {
        // Sort notifications according to the specified logic
        const sortedNotifications = notificationService.sortNotifications(response.data.notifications);
        setNotifications(sortedNotifications);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

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

  const handleApproveFollowRequest = async (notification) => {
    try {
      // This would call the follow approval API
      const response = await databaseService.approveFollowRequest(notification.referenceId);
      if (response.success) {
        markAsRead(notification._id);
        // Reload notifications to remove the approved request
        loadNotifications();
        // Update unread count
        loadUnreadCount();
        // Send WebSocket message to update other clients
        webSocketService.sendMessage({
          type: 'follow_request_update',
          data: { 
            requestId: notification.referenceId,
            status: 'approved',
            alumniId: notification.userId // Use the userId from the notification, which should be the alumni ID
          }
        });
      }
    } catch (error) {
      console.error('Failed to approve follow request:', error);
    }
  };

  const handleRejectFollowRequest = async (notification) => {
    try {
      // This would call the follow rejection API
      const response = await databaseService.rejectFollowRequest(notification.referenceId);
      if (response.success) {
        markAsRead(notification._id);
        // Reload notifications to remove the rejected request
        loadNotifications();
        // Update unread count
        loadUnreadCount();
        // Send WebSocket message to update other clients
        webSocketService.sendMessage({
          type: 'follow_request_update',
          data: { 
            requestId: notification.referenceId,
            status: 'rejected',
            alumniId: notification.userId // Use the userId from the notification, which should be the alumni ID
          }
        });
      }
    } catch (error) {
      console.error('Failed to reject follow request:', error);
    }
  };

  const handleAcceptMentorshipRequest = async (notification) => {
    try {
      // This would call the mentorship acceptance API
      // For now, we'll just mark as read and reload
      markAsRead(notification._id);
      // Reload notifications to update the list
      loadNotifications();
      // Update unread count
      loadUnreadCount();
      // Navigate to mentorship page
      window.location.href = '/alumni/mentorship';
      // Send WebSocket message to update other clients
      webSocketService.sendMessage({
        type: 'mentorship_request_accepted',
        data: { notificationId: notification._id }
      });
    } catch (error) {
      console.error('Failed to accept mentorship request:', error);
    }
  };

  const handleDeclineMentorshipRequest = async (notification) => {
    try {
      // This would call the mentorship decline API
      // For now, we'll just mark as read and reload
      markAsRead(notification._id);
      // Reload notifications to update the list
      loadNotifications();
      // Update unread count
      loadUnreadCount();
      // Send WebSocket message to update other clients
      webSocketService.sendMessage({
        type: 'mentorship_request_declined',
        data: { notificationId: notification._id }
      });
    } catch (error) {
      console.error('Failed to decline mentorship request:', error);
    }
  };

  const handleSuggestTime = async (notification) => {
    try {
      // Navigate to mentorship page for scheduling
      window.location.href = '/alumni/mentorship';
    } catch (error) {
      console.error('Failed to suggest time:', error);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffMs = now - notificationDate;
    const diffDays = Math.floor(diffMs / 86400000);
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

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'follow_request':
        return <User size={16} />;
      case 'mentorship_request':
        return <User size={16} />;
      case 'job_recommendation':
        return <Mail size={16} />;
      case 'connection_request':
        return <User size={16} />;
      case 'system_update':
        return <Bell size={16} />;
      default:
        return <Bell size={16} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'follow_request':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'mentorship_request':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'job_recommendation':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityBadge = (priority) => {
    if (!priority) return null;
    
    const priorityClasses = {
      'urgent': 'bg-red-100 text-red-800',
      'high': 'bg-orange-100 text-orange-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800'
    };
    
    return (
      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${priorityClasses[priority] || 'bg-gray-100 text-gray-800'}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Notifications</h3>
              {notifications.some(n => !n.isRead) && (
                <button 
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell size={24} className="mx-auto mb-2" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div 
                    key={notification._id} 
                    className={`p-4 hover:bg-gray-50 ${notification.isRead ? '' : 'bg-blue-50'}`}
                  >
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <h4 className="text-sm font-medium text-gray-900">
                            {notification.title}
                            {notification.priority && getPriorityBadge(notification.priority)}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTime(notification.createdAt)}
                        </p>
                        
                        {/* Action buttons for follow requests */}
                        {notification.type === 'follow_request' && !notification.isRead && (
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleApproveFollowRequest(notification)}
                              className="flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded hover:bg-green-200"
                            >
                              <Check size={12} className="mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectFollowRequest(notification)}
                              className="flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded hover:bg-red-200"
                            >
                              <X size={12} className="mr-1" />
                              Reject
                            </button>
                          </div>
                        )}
                        
                        {/* Action buttons for mentorship requests */}
                        {notification.type === 'mentorship_request' && !notification.isRead && (
                          <div className="flex gap-2 mt-2">
                            <button 
                              onClick={() => handleAcceptMentorshipRequest(notification)}
                              className="flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded hover:bg-green-200"
                            >
                              <Check size={12} className="mr-1" />
                              Accept
                            </button>
                            <button 
                              onClick={() => handleSuggestTime(notification)}
                              className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200"
                            >
                              <Clock size={12} className="mr-1" />
                              Suggest Time
                            </button>
                            <button 
                              onClick={() => handleDeclineMentorshipRequest(notification)}
                              className="flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded hover:bg-red-200"
                            >
                              <X size={12} className="mr-1" />
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-2 border-t border-gray-200 text-center">
            <button 
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={() => {
                // Navigate to full notifications page
                window.location.href = '/alumni/notifications';
              }}
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;