import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStudent } from '../StudentContext';

const StudentNavigation = ({ isCollapsed: propIsCollapsed, onToggleSidebar: propOnToggleSidebar }) => {
  const location = useLocation();
  const contextValue = useStudent();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Get sidebar state from context if not provided via props
  const { studentData, getUserBadges, isSidebarOpen: contextIsSidebarOpen, setIsSidebarOpen: contextSetIsSidebarOpen } = contextValue || {};
  const isSidebarOpen = propIsCollapsed !== undefined ? !propIsCollapsed : (contextIsSidebarOpen !== undefined ? contextIsSidebarOpen : true);
  const onToggleSidebar = propOnToggleSidebar || contextSetIsSidebarOpen;

  // Handle context errors gracefully
  const studentName = studentData?.profile?.name || 'Student User';
  // Removed studentEmail since it's not needed to be displayed
  
  // Get user badges with error handling
  let userBadges = [];
  try {
    userBadges = (getUserBadges && getUserBadges()) || [];
  } catch (error) {
    console.error('Error getting user badges in navigation:', error);
    userBadges = [];
  }
  
  // Get initials for avatar
  const getInitials = (name) => {
    try {
      return name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'SU';
    } catch (error) {
      console.error('Error getting initials:', error);
      return 'SU';
    }
  };

  // Handle scroll to hide/show navigation
  useEffect(() => {
    const handleScroll = () => {
      try {
        const scrollTop = window.scrollY;
        setIsScrolled(scrollTop > 100);
      } catch (error) {
        console.error('Error in scroll handler:', error);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { path: '/studentpart/dashboard', name: 'Dashboard', icon: '🏠' },
    { path: '/studentpart/profile', name: 'Profile', icon: '👤' },
    { path: '/studentpart/directory', name: 'Alumni Directory', icon: '📋' },
    { path: '/studentpart/mentorship', name: 'Mentorship', icon: '🤝' },
    { path: '/studentpart/jobs', name: 'Jobs', icon: '💼' },
    { path: '/studentpart/events', name: 'Events', icon: '📅' },
    { path: '/studentpart/badges', name: 'Badges', icon: '🏆' },
    { path: '/studentpart/notifications', name: 'Notifications', icon: '🔔' },
    { path: '/studentpart/pledges', name: 'Pledges', icon: '💰' },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className={`lg:hidden bg-blue-600 p-4 transition-transform duration-300 ${
        isScrolled ? '-translate-y-full' : 'translate-y-0'
      }`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white flex items-center"
        >
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Menu
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="lg:hidden bg-white shadow-lg border-b">
          <nav className="px-4 py-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              const showBadgeCount = item.path === '/studentpart/badges' && userBadges.length > 0;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                  {showBadgeCount && (
                    <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {userBadges.length}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className={`hidden lg:block bg-white shadow-lg h-screen sticky top-16 transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-16'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header - only show when not collapsed */}
          {isSidebarOpen && (
            <div className="px-6 py-4 bg-blue-600 text-white">
              <h2 className="text-xl font-bold">Student Portal</h2>
            </div>
          )}

          {/* Navigation Items */}
          <nav className={`flex-1 ${isSidebarOpen ? 'px-4 py-6' : 'px-2 py-6'} space-y-2 overflow-y-auto`}>
            {navigationItems.map((item) => {
              // Exact route matching logic
              let isActive = false;
              if (item.path === '/studentpart/dashboard') {
                // Dashboard matches both /studentpart and /studentpart/dashboard
                isActive = location.pathname === '/studentpart' || location.pathname === '/studentpart/dashboard';
              } else {
                // Other pages match exactly
                isActive = location.pathname === item.path;
              }
              
              const showBadgeCount = item.path === '/studentpart/badges' && userBadges.length > 0;
              return (
                <div key={item.path} className="relative">
                  <Link
                    to={item.path}
                    className={`flex items-center rounded-lg transition-colors ${
                      !isSidebarOpen 
                        ? 'justify-center p-3' 
                        : 'px-4 py-3'
                    } ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    title={!isSidebarOpen ? item.name : ''}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {isSidebarOpen && (
                      <>
                        <span className="font-medium ml-3">{item.name}</span>
                        {showBadgeCount && (
                          <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            {userBadges.length}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                  
                  {/* Contextual sidebar toggle arrow for active item */}
                  {isActive && isSidebarOpen && onToggleSidebar && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onToggleSidebar(!isSidebarOpen);
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:bg-gray-50 focus:outline-none"
                      aria-label="Collapse sidebar"
                    >
                      <svg 
                        className="w-4 h-4 text-gray-600 rotate-180" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  
                  {/* Contextual sidebar toggle arrow for active item when collapsed */}
                  {isActive && !isSidebarOpen && onToggleSidebar && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onToggleSidebar(!isSidebarOpen);
                      }}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:bg-gray-50 focus:outline-none"
                      aria-label="Expand sidebar"
                    >
                      <svg 
                        className="w-4 h-4 text-gray-600" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User Info - only show when not collapsed */}
          {isSidebarOpen && (
            <div className="px-4 py-4 border-t border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {getInitials(studentName)}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate" title={studentName}>
                    {studentName}
                  </p>
                  {/* Removed email display as requested */}
                </div>
              </div>
              <Link
                to="/"
                className="mt-3 w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm hover:bg-gray-200 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Back to Main Site
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentNavigation;