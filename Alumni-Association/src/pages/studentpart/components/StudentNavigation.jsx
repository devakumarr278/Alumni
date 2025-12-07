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
    { path: '/studentpart/dashboard', name: 'Dashboard', icon: '🏠', color: 'from-blue-500 to-cyan-500' },
    { path: '/studentpart/profile', name: 'Profile', icon: '👤', color: 'from-purple-500 to-pink-500' },
    { path: '/studentpart/directory', name: 'Alumni Directory', icon: '📋', color: 'from-amber-500 to-orange-500' },
    { path: '/studentpart/mentorship', name: 'Mentorship', icon: '🤝', color: 'from-emerald-500 to-teal-500' },
    { path: '/studentpart/jobs', name: 'Jobs', icon: '💼', color: 'from-rose-500 to-red-500' },
    { path: '/studentpart/events', name: 'Events', icon: '📅', color: 'from-violet-500 to-purple-500' },
    { path: '/studentpart/badges', name: 'Badges', icon: '🏆', color: 'from-yellow-500 to-amber-500' },
    { path: '/studentpart/notifications', name: 'Notifications', icon: '🔔', color: 'from-cyan-500 to-blue-500' },
    { path: '/studentpart/pledges', name: 'Pledges', icon: '💰', color: 'from-green-500 to-emerald-500' },
    { path: '/studentpart/roadmap', name: 'Career Roadmap', icon: '🛣️', color: 'from-indigo-500 to-blue-500' }
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className={`lg:hidden bg-gradient-to-r from-slate-800 to-slate-900 p-3 transition-transform duration-300 ${
        isScrolled ? '-translate-y-full' : 'translate-y-0'
      }`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white flex items-center font-medium text-sm"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Menu
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="lg:hidden bg-white shadow-lg border-b">
          <nav className="px-3 py-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              const showBadgeCount = item.path === '/studentpart/badges' && userBadges.length > 0;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${item.color} text-white shadow-sm`
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-base mr-2.5">{item.icon}</span>
                  <span className="font-medium text-sm">{item.name}</span>
                  {showBadgeCount && (
                    <span className="ml-auto bg-white text-cyan-600 text-xs px-1.5 py-0.5 rounded-full font-bold">
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
        isSidebarOpen ? 'w-60' : 'w-16'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header - only show when not collapsed */}
          {isSidebarOpen && (
            <div className="px-5 py-5 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-br-2xl">
              <h2 className="text-base font-semibold">Student Portal</h2>
            </div>
          )}

          {/* Navigation Items */}
          <nav className={`flex-1 ${isSidebarOpen ? 'px-3 py-5' : 'px-1.5 py-5'} space-y-1.5 overflow-y-auto`}>
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
                    className={`flex items-center rounded-xl transition-all ${
                      !isSidebarOpen 
                        ? 'justify-center p-3' 
                        : 'px-3 py-3'
                    } ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white shadow-sm`
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    title={!isSidebarOpen ? item.name : ''}
                  >
                    <span className="text-base">{item.icon}</span>
                    {isSidebarOpen && (
                      <>
                        <span className="font-medium text-sm ml-2.5">{item.name}</span>
                        {showBadgeCount && (
                          <span className={`ml-auto bg-white text-${item.color.includes('blue') ? 'blue' : item.color.includes('purple') ? 'purple' : item.color.includes('pink') ? 'pink' : item.color.includes('red') ? 'red' : item.color.includes('orange') ? 'orange' : item.color.includes('yellow') ? 'yellow' : item.color.includes('green') ? 'green' : item.color.includes('teal') ? 'teal' : item.color.includes('cyan') ? 'cyan' : 'slate'}-600 text-xs px-1.5 py-0.5 rounded-full font-bold`}>
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
                      className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:bg-slate-50 focus:outline-none"
                      aria-label="Collapse sidebar"
                    >
                      <svg 
                        className="w-3 h-3 text-slate-600 rotate-180" 
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
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:bg-slate-50 focus:outline-none"
                      aria-label="Expand sidebar"
                    >
                      <svg 
                        className="w-3 h-3 text-slate-600" 
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
            <div className="px-3 py-5 border-t border-slate-200">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                  {getInitials(studentName)}
                </div>
                <div className="ml-2.5 flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate" title={studentName}>
                    {studentName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">Student</p>
                </div>
              </div>
              <Link
                to="/"
                className="w-full bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 py-2.5 px-3 rounded-xl text-xs hover:from-slate-200 hover:to-slate-300 transition-all flex items-center justify-center font-medium"
              >
                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Main Site
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentNavigation;