import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StudentNavigation from '../pages/studentpart/components/StudentNavigation';
import Logo from '../assets/images/logo.png';
import webSocketService from '../services/webSocketService';

const StudentLayout = ({ children, userEmail: propUserEmail }) => {
  console.log('Rendering StudentLayout with userEmail:', propUserEmail);
  const { user, logout } = useAuth();
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50 via-purple-50 to-cyan-50"></div>
        
        {/* Animated Gradient Orbs */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-100/40 to-transparent rounded-bl-full animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-gradient-to-t from-purple-100/50 to-transparent rounded-tr-full animate-pulse"></div>
        
        {/* Floating Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl animate-bounce" style={{animationDuration: '8s'}}></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-bounce" style={{animationDuration: '10s', animationDelay: '1s'}}></div>
        
        {/* Additional Floating Elements */}
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-gradient-to-r from-amber-200/20 to-orange-200/20 rounded-full blur-3xl animate-ping" style={{animationDuration: '12s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-gradient-to-r from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-ping" style={{animationDuration: '15s', animationDelay: '2s'}}></div>
      </div>
      
      {/* Enhanced Floating Particles Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20"
            style={{
              width: `${Math.random() * 25 + 5}px`,
              height: `${Math.random() * 25 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float${Math.floor(Math.random() * 3) + 1} ${Math.random() * 15 + 10}s infinite ease-in-out`,
              opacity: Math.random() * 0.5 + 0.3
            }}
          ></div>
        ))}
      </div>
      
      {/* Enhanced Top bar with modern glass effect */}
      <div className="bg-white/90 backdrop-blur-xl shadow-xl border-b border-white/50 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-all duration-300"></div>
                <img
                  src={Logo}
                  alt="Alumni Network"
                  className="h-10 relative drop-shadow-md"
                />
              </div>
              <span className="ml-3 text-xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-text">
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
                  className="flex items-center text-gray-600 hover:text-gray-900 relative focus:outline-none p-2 rounded-full hover:bg-gray-100/50 transition-all duration-300"
                  aria-label="Notifications"
                >
                  <div className="relative">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {unreadNotifications}
                      </span>
                    )}
                  </div>
                </button>
                
                {/* Notification Dropdown */}
                {isNotificationDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl py-2 z-50 border border-white/30">
                    <div className="px-4 py-3 border-b border-gray-200/50">
                      <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`px-4 py-3 border-b border-gray-100/50 hover:bg-white/50 transition-all duration-300 ${
                              !notification.read ? 'bg-gradient-to-r from-blue-50/50 to-cyan-50/50' : ''
                            }`}
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
                      <button className="text-sm font-medium bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Enhanced User Email Dropdown */}
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
                  className="flex items-center text-sm font-bold text-gray-800 hover:text-gray-900 focus:outline-none bg-gradient-to-r from-gray-100/90 to-gray-200/90 backdrop-blur-lg px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  aria-label="User menu"
                >
                  <span className="mr-2 hidden md:inline bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{userEmail}</span>
                  <span className="mr-2 md:hidden bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {userEmail.length > 15 ? `${userEmail.substring(0, 12)}...` : userEmail}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white/50">
                    {userEmail.charAt(0).toUpperCase()}
                  </div>
                </button>
                
                {/* User Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl py-2 z-50 border border-white/30">
                    <Link 
                      to="/" 
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r from-gray-50/50 to-gray-100/50 rounded-lg mx-2 transition-all duration-300"
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
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r from-rose-50/50 to-red-50/50 rounded-lg mx-2 flex items-center transition-all duration-300"
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
      
      <div className="lg:flex pt-16 relative z-10">
        {/* Enhanced Collapsible Sidebar with Glass Effect */}
        <div className={`hidden lg:block transition-all duration-500 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
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
      
      {/* Enhanced Floating Action Button with Pulse Effect */}
      <button className="fixed bottom-6 right-6 w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-2xl hover:shadow-2xl flex items-center justify-center text-white z-40 transition-all duration-300 hover:scale-110 transform-gpu animate-pulse hover:animate-none ring-4 ring-white/30 backdrop-blur-sm">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
      
      {/* Enhanced Animation Styles */}
      <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-25px, -25px) rotate(15deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(25px, -25px) rotate(-15deg); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-20px, 25px) rotate(10deg); }
        }
        @keyframes text {
          0%, 100% { background-size: 200% 200%; }
          50% { background-size: 300% 300%; }
        }
      `}</style>
    </div>
  );
};

export default StudentLayout;