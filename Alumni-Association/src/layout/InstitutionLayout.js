import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import InstitutionSidebar from '../components/institution/InstitutionSidebar';
import '../assets/styles/institutionDashboard.css';

const InstitutionLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const notificationDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Redirect to login if user is not authenticated or not an institution
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'institution') {
      // If authenticated user is not an institution, redirect to appropriate dashboard
      if (user.role === 'alumni') {
        navigate('/alumni/dashboard');
      } else if (user.role === 'student') {
        navigate('/student/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  // Mock notifications data
  const notifications = [
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
      description: 'Career Fair is scheduled for tomorrow',
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
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'info':
      default:
        return 'bg-blue-100 border-blue-200 text-blue-800';
    }
  };

  // Don't render the layout if user is not authenticated or not an institution
  if (!user || user.role !== 'institution') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar with Institution Dashboard logo and text - FIXED POSITION */}
      <div className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg w-10 h-10 flex items-center justify-center text-white font-bold shadow-md">
                IU
              </div>
              <span className="ml-3 text-lg font-bold text-gray-900">
                Institution Dashboard
              </span>
              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Verified Institution
              </span>
            </div>
            {/* User Email, Notification Icon and Dropdowns - TOP RIGHT CORNER */}
            <div className="flex items-center space-x-4">
              {/* Notification Icon */}
              <div className="relative" ref={notificationDropdownRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="flex items-center text-gray-600 hover:text-gray-900 relative focus:outline-none"
                  aria-label="Notifications"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                          >
                            <div className={`flex items-start p-3 rounded-lg border ${getTypeStyles(notification.type)}`}>
                              <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                                notification.read ? 'bg-gray-400' : 'bg-blue-500'
                              }`}></div>
                              <div className="ml-3 flex-1">
                                <div className="flex justify-between">
                                  <h4 className={`text-sm font-medium ${
                                    notification.read ? 'text-gray-700' : 'text-gray-900 font-semibold'
                                  }`}>
                                    {notification.title}
                                  </h4>
                                  <p className="text-xs text-gray-500">{notification.time}</p>
                                </div>
                                <p className="text-sm mt-1 text-gray-700">{notification.description}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          No notifications
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-2 text-center">
                      <button 
                        onClick={() => {
                          navigate('/institution/notifications');
                          setShowNotifications(false);
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Settings Icon */}
              <button 
                onClick={() => navigate('/institution/profile')}
                className="flex items-center text-gray-600 hover:text-gray-900 focus:outline-none"
                aria-label="Settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              
              {/* User Dropdown */}
              <div className="relative" ref={userDropdownRef}>
                <button 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center text-sm text-gray-700 hover:text-gray-900 focus:outline-none"
                  aria-label="User menu"
                >
                  <span className="mr-1 hidden md:inline">
                    {user?.institutionalEmail || user?.email || 'Institution User'}
                  </span>
                  <span className="mr-1 md:hidden">
                    {user?.institutionalEmail ? `${user.institutionalEmail.substring(0, 10)}...` : 'Institution...'}
                  </span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* User Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <Link 
                      to="/" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      Back to Main Site
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
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
      
      {/* Main layout with sidebar and content - BELOW the fixed top bar */}
      <div className="lg:flex pt-16">
        {/* Collapsible Sidebar */}
        <div className={`hidden lg:block transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'}`}>
          <div className="flex h-full">
            {/* Sidebar Content */}
            <div className="bg-white shadow-lg h-screen sticky top-16">
              <InstitutionSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            </div>
          </div>
        </div>
        
        {/* Main content - WITH scrolling capability */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Outlet />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionLayout;