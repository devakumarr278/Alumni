import React, { useState, useEffect, useRef } from 'react';
// Removed StudentNavigation import as it's handled by the shared layout
import { useStudent } from './StudentContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const FixedDashboard = () => {
  const { studentData } = useStudent();
  const { user, logout } = useAuth();
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

  // Get user email or fallback
  const userEmail = user?.email || studentData?.profile?.email || 'student@college.edu';
  
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
  
  // Safe defaults for student data
  const safeStudentData = studentData || {};
  const safeProfile = safeStudentData.profile || {};
  const safeConnections = safeStudentData.connections || {};
  const safeMentorship = safeStudentData.mentorship || {};
  const safeJobs = safeStudentData.jobs || {};
  const safeEvents = safeStudentData.events || {};
  const safeBadges = safeStudentData.badges || {};
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar with Student Dashboard text */}
      <div className="bg-white shadow-sm border-b relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="text-lg font-bold text-gray-900">
              Student Dashboard
            </div>
            {/* User Email Dropdown and Notification Icon */}
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
                  className="flex items-center text-gray-600 hover:text-gray-900 relative focus:outline-none"
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
                  className="flex items-center text-sm text-gray-700 hover:text-gray-900 focus:outline-none"
                  aria-label="User menu"
                >
                  <span className="mr-1">{userEmail}</span>
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
                        logout();
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
      
      <div className="lg:flex">
        {/* Removed StudentNavigation as it's handled by the shared layout */}
        
        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="pt-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Dashboard</h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Profile</h2>
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completeness</span>
                    <span className="font-semibold text-green-600">{safeProfile.completeness || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: `${safeProfile.completeness || 0}%`}}></div>
                  </div>
                  <p className="text-sm text-gray-700 mt-3">{safeProfile.name || 'Complete your profile'}</p>
                  <p className="text-xs text-gray-500">{safeProfile.major ? `${safeProfile.major} • ${safeProfile.graduationYear}` : 'Add your academic details'}</p>
                </div>
              </div>
              
              {/* Alumni Directory Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Alumni Directory</h2>
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Connected Alumni</span>
                    <span className="font-semibold text-purple-600">{safeConnections.alumni || 0}</span>
                  </div>
                  <p className="text-sm text-gray-700">Recent connections:</p>
                  <div className="space-y-1">
                    {safeConnections.recent && safeConnections.recent.length > 0 ? 
                      safeConnections.recent.slice(0, 2).map((name, index) => (
                        <p key={index} className="text-xs text-gray-500">• {name}</p>
                      )) : 
                      <p className="text-xs text-gray-500">• No connections yet</p>
                    }
                  </div>
                </div>
              </div>
              
              {/* Mentorship Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Mentorship</h2>
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Mentors</span>
                    <span className="font-semibold text-orange-600">{safeMentorship.activeMentors || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pending Requests</span>
                    <span className="font-semibold text-yellow-600">{safeMentorship.pendingRequests || 0}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">Next session: {safeMentorship.nextSession || 'None scheduled'}</p>
                </div>
              </div>
              
              {/* Jobs Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Jobs</h2>
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H6a2 2 0 00-2-2V4m12 0h2a2 2 0 012 2v6.5M4 6h16M4 6v10a2 2 0 002 2h4m-6-6l.01.01M6 16l.01.01" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Applications</span>
                    <span className="font-semibold text-blue-600">{safeJobs.applications || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Interviews</span>
                    <span className="font-semibold text-green-600">{safeJobs.interviews || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">New Opportunities</span>
                    <span className="font-semibold text-red-500">{safeJobs.newOpportunities || 0}</span>
                  </div>
                </div>
              </div>
              
              {/* Events Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Events</h2>
                  <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Upcoming Events</span>
                    <span className="font-semibold text-indigo-600">{safeEvents.upcoming || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Registered</span>
                    <span className="font-semibold text-green-600">{safeEvents.registered || 0}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">Next: {safeEvents.nextEvent || 'No upcoming events'}</p>
                </div>
              </div>
              
              {/* Badges Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Badges</h2>
                  <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Earned Badges</span>
                    <span className="font-semibold text-yellow-600">{safeBadges.earned || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Rank</span>
                    <span className="font-semibold text-purple-600">{safeBadges.rank ? `#${safeBadges.rank}` : 'Unranked'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Points</span>
                    <span className="font-semibold text-blue-600">{safeBadges.points || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixedDashboard;