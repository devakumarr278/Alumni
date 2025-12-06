import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/common/Card';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // In a real application, you would fetch notifications from the backend
  useEffect(() => {
    // Mock data for demonstration
    const mockNotifications = [
      {
        id: 1,
        title: 'RSVP Confirmation',
        message: 'Your RSVP for the Annual Alumni Meet has been confirmed.',
        time: '2 hours ago',
        read: false,
        type: 'event'
      },
      {
        id: 2,
        title: 'New Connection Request',
        message: 'John Smith wants to connect with you.',
        time: '5 hours ago',
        read: true,
        type: 'connection'
      },
      {
        id: 3,
        title: 'Event Reminder',
        message: 'Career Workshop is happening tomorrow at 2 PM.',
        time: '1 day ago',
        read: false,
        type: 'event'
      },
      {
        id: 4,
        title: 'Profile Update',
        message: 'Your profile information has been updated successfully.',
        time: '2 days ago',
        read: true,
        type: 'system'
      },
      {
        id: 5,
        title: 'New Message',
        message: 'You have a new message from Sarah Johnson.',
        time: '3 days ago',
        read: false,
        type: 'message'
      },
    ];
    
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getIcon = (type) => {
    switch (type) {
      case 'event': return '📅';
      case 'connection': return '👥';
      case 'system': return '⚙️';
      case 'message': return '💬';
      default: return '🔔';
    }
  };

  const getBgColor = (type, read) => {
    if (read) {
      switch (type) {
        case 'event': return 'bg-blue-50 border-blue-100';
        case 'connection': return 'bg-green-50 border-green-100';
        case 'system': return 'bg-gray-50 border-gray-100';
        case 'message': return 'bg-purple-50 border-purple-100';
        default: return 'bg-white border-gray-100';
      }
    } else {
      switch (type) {
        case 'event': return 'bg-blue-100 border-blue-200';
        case 'connection': return 'bg-green-100 border-green-200';
        case 'system': return 'bg-gray-100 border-gray-200';
        case 'message': return 'bg-purple-100 border-purple-200';
        default: return 'bg-white border-gray-200';
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-purple-100"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
            <p className="text-gray-700 mt-1">Stay updated with the latest activities</p>
          </div>
          {notifications.some(n => !n.read) && (
            <button 
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200"
            >
              Mark all as read
            </button>
          )}
        </div>
      </motion.div>

      {/* Notifications List */}
      <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🔔</div>
              <h3 className="text-lg font-medium text-gray-800">No notifications</h3>
              <p className="text-gray-600">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-lg border ${getBgColor(notification.type, notification.read)} ${
                  notification.read ? '' : 'border-l-4 border-l-purple-500'
                }`}
              >
                <div className="flex items-start">
                  <div className="p-2 bg-white rounded-full mr-3">
                    <span className="text-lg">{getIcon(notification.type)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-800">{notification.title}</h3>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="mt-2 text-sm text-purple-600 hover:text-purple-800"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default Notifications;