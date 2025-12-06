import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const MinimalDashboard = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
 
  // Refs for dropdown containers
  const userDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);
 
  // Mock notifications data
  const notifications = [
    { id: 1, message: 'New event announcement', time: '2 hours ago', read: false },
    { id: 2, message: 'Profile update reminder', time: '1 day ago', read: true },
    { id: 3, message: 'Connection request received', time: '2 days ago', read: false }
  ];

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        setIsNotificationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Debug info */}
      <div className="bg-red-100 p-2 text-xs">
        <div>Dropdown States: User={isUserDropdownOpen ? 'OPEN' : 'CLOSED'}, Notification={isNotificationDropdownOpen ? 'OPEN' : 'CLOSED'}</div>
      </div>
      
      {/* Top bar with Student Dashboard text */}
      <div className="bg-white shadow-sm border-b relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 relative">
            <div className="text-lg font-bold text-gray-900">
              Student Dashboard
            </div>
            {/* User Email Dropdown and Notification Icon */}
            <div className="flex items-center space-x-4">
              {/* Notification Icon - Simplified version */}
              <div className="relative" ref={notificationDropdownRef}>
                <button 
                  onClick={() => {
                    // Close user dropdown if open
                    if (isUserDropdownOpen) {
                      setIsUserDropdownOpen(false);
                    }
                    // Toggle notification dropdown
                    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
                  }}
                  className="flex items-center text-gray-600 hover:text-gray-900 relative"
                  aria-label="Notifications"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
                
                {/* Notification Dropdown */}
                {isNotificationDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border" 
                       style={{ position: 'absolute', right: 0, marginTop: '0.5rem', width: '20rem', backgroundColor: 'white', borderRadius: '0.375rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', zIndex: 9999, border: '2px solid red' }}>
                    <div className="px-4 py-2 border-b">
                      <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`px-4 py-3 border-b hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                          >
                            <p className="text-sm text-gray-800">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          No notifications
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-2 text-center">
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Email Dropdown - Simplified version */}
              <div className="relative" ref={userDropdownRef}>
                <button 
                  onClick={() => {
                    // Close notification dropdown if open
                    if (isNotificationDropdownOpen) {
                      setIsNotificationDropdownOpen(false);
                    }
                    // Toggle user dropdown
                    setIsUserDropdownOpen(!isUserDropdownOpen);
                  }}
                  className="flex items-center text-sm text-gray-700 hover:text-gray-900"
                  aria-label="User menu"
                >
                  <span className="mr-1">student@college.edu</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* User Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border"
                       style={{ position: 'absolute', right: 0, marginTop: '0.5rem', width: '12rem', backgroundColor: 'white', borderRadius: '0.375rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', zIndex: 9999, border: '2px solid blue' }}>
                    <Link 
                      to="/" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      Back to Main Site
                    </Link>
                    <button 
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="pt-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Dashboard</h1>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Dropdown Test</h2>
            <p>Click the notification or user buttons in the top right corner to test the dropdowns.</p>
            
            <div className="mt-4">
              <button 
                onClick={() => setIsNotificationDropdownOpen(true)}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm mr-2"
              >
                Force Show Notification Dropdown
              </button>
              <button 
                onClick={() => setIsUserDropdownOpen(true)}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
              >
                Force Show User Dropdown
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinimalDashboard;