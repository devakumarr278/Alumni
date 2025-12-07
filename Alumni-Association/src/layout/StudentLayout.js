import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StudentNavigation from '../pages/studentpart/components/StudentNavigation';
import Logo from '../assets/images/logo.png';
import webSocketService from '../services/webSocketService';

const StudentLayout = ({ children, userEmail: propUserEmail }) => {
  console.log('Rendering StudentLayout with userEmail:', propUserEmail);
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
 
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

  // Get user email or fallback to user data
  const userEmail = propUserEmail || user?.email || user?.institutionalEmail || 'student@college.edu';

  // Initialize WebSocket connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Initializing WebSocket with token:', token);
    if (token) {
      webSocketService.connect(token);
    }

    return () => {
      console.log('Disconnecting WebSocket in StudentLayout');
      webSocketService.disconnect();
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdowns if click is outside
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
  
  // Close dropdowns when pressing Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsUserDropdownOpen(false);
        setIsNotificationDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgba(135, 206, 235, 0.3)' }}>
      {/* Top bar with Alumni Network logo and text - FIXED POSITION */}
      <div className="bg-white shadow-lg border-b fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center">
              <img
                src={Logo}
                alt="Alumni Network"
                className="h-10"
              />
              <span className="ml-3 text-lg font-bold text-gray-900">
                Alumni Network
              </span>
            </div>
            {/* User Email, Notification Icon and Dropdowns - TOP RIGHT CORNER */}
            <div className="flex items-center space-x-4">
              {/* Notification Icon */}
              <div className="relative" ref={notificationDropdownRef}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    // Close user dropdown if open
                    if (isUserDropdownOpen) {
                      setIsUserDropdownOpen(false);
                    }
                    // Toggle notification dropdown
                    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
                  }}
                  className="flex items-center text-gray-600 hover:text-gray-900 relative focus:outline-none p-2 rounded-full hover:bg-gray-100"
                  aria-label="Notifications"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
                
                {/* Notification Dropdown */}
                {isNotificationDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl py-2 z-50 border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-gradient-to-r from-blue-50 to-cyan-50' : ''}`}
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
                    <div className="px-4 py-3 text-center">
                      <button className="text-sm font-medium bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Email Dropdown */}
              <div className="relative" ref={userDropdownRef}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    // Close notification dropdown if open
                    if (isNotificationDropdownOpen) {
                      setIsNotificationDropdownOpen(false);
                    }
                    // Toggle user dropdown
                    setIsUserDropdownOpen(!isUserDropdownOpen);
                  }}
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-full"
                  aria-label="User menu"
                >
                  <span className="mr-2 hidden md:inline">{userEmail}</span>
                  <span className="mr-2 md:hidden">
                    {userEmail.length > 15 ? `${userEmail.substring(0, 12)}...` : userEmail}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {userEmail.charAt(0).toUpperCase()}
                  </div>
                </button>
                
                {/* User Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl py-2 z-50 border border-gray-200">
                    <Link 
                      to="/" 
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg mx-2"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Back to Main Site
                      </div>
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r from-rose-50 to-red-50 rounded-lg mx-2 flex items-center"
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
      
      <div className="lg:flex pt-16">
        {/* Collapsible Sidebar */}
        <div className={`hidden lg:block transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
          <div className="flex h-full">
            {/* Sidebar Content */}
            <div className="h-screen sticky top-16">
              <StudentNavigation isCollapsed={!isSidebarOpen} onToggleSidebar={setIsSidebarOpen} />
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;