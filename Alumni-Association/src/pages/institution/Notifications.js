import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const Notifications = () => {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Alumni Registration',
      description: '5 alumni have registered today',
      time: '2 hours ago',
      type: 'info',
      read: false
    },
    {
      id: 2,
      title: 'Upcoming Event Reminder',
      description: 'Career Fair is scheduled for tomorrow at 10:00 AM',
      time: '5 hours ago',
      type: 'warning',
      read: false
    },
    {
      id: 3,
      title: 'System Update',
      description: 'Maintenance scheduled for this weekend',
      time: '1 day ago',
      type: 'info',
      read: true
    },
    {
      id: 4,
      title: 'New Event Registration',
      description: '15 alumni have registered for the Annual Alumni Meet',
      time: '1 day ago',
      type: 'success',
      read: true
    },
    {
      id: 5,
      title: 'Payment Received',
      description: 'Donation of $2,500 received from alumni association',
      time: '2 days ago',
      type: 'success',
      read: true
    },
    {
      id: 6,
      title: 'Profile Update Required',
      description: 'Please update your institution profile information',
      time: '3 days ago',
      type: 'warning',
      read: false
    }
  ]);

  const filters = [
    { id: 'all', label: 'All', icon: 'fas fa-bell' },
    { id: 'unread', label: 'Unread', icon: 'fas fa-envelope' },
    { id: 'read', label: 'Read', icon: 'fas fa-envelope-open' },
    { id: 'info', label: 'Info', icon: 'fas fa-info-circle' },
    { id: 'warning', label: 'Warnings', icon: 'fas fa-exclamation-triangle' },
    { id: 'success', label: 'Success', icon: 'fas fa-check-circle' }
  ];

  const getTypeStyles = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'warning':
        return 'fas fa-exclamation-triangle text-yellow-500';
      case 'success':
        return 'fas fa-check-circle text-green-500';
      case 'info':
      default:
        return 'fas fa-info-circle text-blue-500';
    }
  };

  const handleFilter = (filterValue) => {
    setFilter(filterValue);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

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
            <p className="text-gray-700 mt-1">Manage and view all your notifications</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              <i className="fas fa-envelope mr-2"></i>{unreadCount} unread
            </span>
            <Button 
              variant="outline" 
              onClick={markAllAsRead}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <i className="fas fa-check-double mr-2"></i>Mark all as read
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-lg border border-blue-100">
        <div className="flex flex-wrap gap-2">
          {filters.map((filterItem) => (
            <Button
              key={filterItem.id}
              variant="outline"
              onClick={() => handleFilter(filterItem.id)}
              className={`${
                filter === filterItem.id
                  ? 'bg-purple-100 text-purple-800 border-purple-200'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <i className={`${filterItem.icon} mr-2`}></i>
              {filterItem.label}
            </Button>
          ))}
        </div>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex items-start p-5 rounded-xl border backdrop-blur-lg transition-all duration-300 ${
                notification.read 
                  ? 'bg-white/50 border-gray-200' 
                  : 'bg-white/80 border-purple-200 shadow-md'
              } ${getTypeStyles(notification.type)}`}
            >
              <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-2 ${
                notification.read ? 'bg-gray-400' : 'bg-purple-500'
              }`}></div>
              <div className={`ml-4 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                notification.read ? 'bg-gray-100' : 'bg-white'
              }`}>
                <i className={getTypeIcon(notification.type)}></i>
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between">
                  <h3 className={`text-sm font-medium ${
                    notification.read ? 'text-gray-700' : 'text-gray-900 font-semibold'
                  }`}>
                    {notification.title}
                  </h3>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
                <p className="text-sm mt-1 text-gray-700">{notification.description}</p>
                <div className="mt-3 flex space-x-3">
                  {!notification.read && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => markAsRead(notification.id)}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs"
                    >
                      Mark as read
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => deleteNotification(notification.id)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs"
                  >
                    <i className="fas fa-trash mr-1"></i> Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <Card className="text-center py-12 bg-gradient-to-r from-purple-50 to-pink-50 backdrop-blur-lg border border-purple-100">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">No notifications found</h3>
            <p className="text-gray-600">
              {filter === 'unread' 
                ? "You're all caught up! No unread notifications." 
                : "Try changing your filter settings."}
            </p>
          </Card>
        )}
      </div>

      {/* Notification Settings */}
      <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Notification Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Push Notifications</p>
              <p className="text-sm text-gray-600">Receive push notifications on your device</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">SMS Notifications</p>
              <p className="text-sm text-gray-600">Receive important notifications via SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Notifications;