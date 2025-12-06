import React, { useState, useEffect } from 'react';

// Notification types
const NOTIFICATION_TYPES = {
  INTERNSHIP_APPLICATION: 'internship_application',
  MENTORSHIP_REQUEST: 'mentorship_request',
  JOB_RECOMMENDATION: 'job_recommendation',
  EVENT_REMINDER: 'event_reminder',
  BADGE_EARNED: 'badge_earned',
  CONNECTION_REQUEST: 'connection_request',
  SYSTEM_UPDATE: 'system_update'
};

// Notification system component
export const NotificationSystem = ({ studentProfile, jobs }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Initialize with some sample notifications
  useEffect(() => {
    const initialNotifications = [
      {
        id: 1,
        type: NOTIFICATION_TYPES.INTERNSHIP_APPLICATION,
        title: 'New Internship Application',
        message: 'Alex Johnson applied for your Frontend Developer Intern position.',
        time: new Date(Date.now() - 3600000), // 1 hour ago
        unread: true,
        icon: '💼',
        category: 'Internship Applications'
      },
      {
        id: 2,
        type: NOTIFICATION_TYPES.MENTORSHIP_REQUEST,
        title: 'Mentorship Request',
        message: 'Maria Garcia requested to be your mentee.',
        time: new Date(Date.now() - 86400000), // 1 day ago
        unread: true,
        icon: '🤝',
        category: 'Mentorship Requests'
      },
      {
        id: 3,
        type: NOTIFICATION_TYPES.JOB_RECOMMENDATION,
        title: 'Job Recommendation',
        message: '3 new opportunities match your profile.',
        time: new Date(Date.now() - 172800000), // 2 days ago
        unread: false,
        icon: '🎯',
        category: 'Job Recommendations'
      }
    ];
    
    setNotifications(initialNotifications);
    setUnreadCount(initialNotifications.filter(n => n.unread).length);
  }, []);

  // Add a new notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      time: new Date(),
      unread: true,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, unread: false } 
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, unread: false }))
    );
    setUnreadCount(0);
  };

  // Get notifications by category
  const getNotificationsByCategory = (category) => {
    return notifications.filter(n => n.category === category);
  };

  // Get unread notifications count by category
  const getUnreadCountByCategory = (category) => {
    return notifications.filter(n => n.category === category && n.unread).length;
  };

  // Format time for display
  const formatTime = (date) => {
    const now = new Date();
    const diffMs = now - date;
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

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    getNotificationsByCategory,
    getUnreadCountByCategory,
    formatTime
  };
};

// Notification badge component
export const NotificationBadge = ({ count }) => {
  if (count === 0) return null;
  
  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
      {count > 99 ? '99+' : count}
    </span>
  );
};

// Notification item component
export const NotificationItem = ({ notification, onMarkAsRead, formatTime }) => {
  const handleMarkAsRead = () => {
    if (notification.unread) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div 
      className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
        notification.unread ? 'bg-blue-50' : ''
      }`}
      onClick={handleMarkAsRead}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
            {notification.icon}
          </div>
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h3 className={`font-medium ${
              notification.unread ? 'text-gray-900' : 'text-gray-700'
            }`}>
              {notification.title}
            </h3>
            {notification.unread && (
              <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {notification.message}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {formatTime(notification.time)}
          </p>
        </div>
      </div>
    </div>
  );
};

// Category filter component
export const NotificationCategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => onCategoryChange('all')}
        className={`px-3 py-1 rounded-full text-sm ${
          activeCategory === 'all'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      {categories.map(category => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-3 py-1 rounded-full text-sm ${
            activeCategory === category
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default {
  NotificationSystem,
  NotificationBadge,
  NotificationItem,
  NotificationCategoryFilter,
  NOTIFICATION_TYPES
};