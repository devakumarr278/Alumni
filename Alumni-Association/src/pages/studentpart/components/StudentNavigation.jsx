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
    { path: '/studentpart/portfolio', name: 'Portfolio', icon: '🖼️', color: 'from-pink-500 to-rose-500' },
    { path: '/studentpart/directory', name: 'Alumni Directory', icon: '📋', color: 'from-amber-500 to-orange-500' },
    { path: '/studentpart/mentorship', name: 'Mentorship', icon: '🤝', color: 'from-emerald-500 to-teal-500' },
    {     path: '/studentpart/skill-analyzer', name: 'Skill Analyzer', icon: '🧠', color: 'from-purple-500 to-indigo-500' },
    { path: '/studentpart/resume-improver', name: 'Resume Improver', icon: '📄', color: 'from-blue-500 to-cyan-500' },
    { path: '/studentpart/roadmap', name: 'Career Roadmap', icon: '🛣️', color: 'from-indigo-500 to-blue-500' },
    // New AI-powered features
    { path: '/studentpart/daily-tasks', name: 'Daily Tasks', icon: '✅', color: 'from-green-500 to-emerald-500' },
    { path: '/studentpart/project-suggestions', name: 'Project Ideas', icon: '💡', color: 'from-amber-500 to-yellow-500' },
    { path: '/studentpart/interview-prep', name: 'Interview Prep', icon: '🎤', color: 'from-rose-500 to-red-500' },
    { path: '/studentpart/skill-gap', name: 'Skill Gap', icon: '📈', color: 'from-teal-500 to-green-500' },
    { path: '/studentpart/industry-insights', name: 'Industry Insights', icon: '📊', color: 'from-violet-500 to-purple-500' },
    { path: '/studentpart/mentorship-tracker', name: 'Mentorship Tracker', icon: '📊', color: 'from-cyan-500 to-blue-500' },
    { path: '/studentpart/events', name: 'Events', icon: '📅', color: 'from-violet-500 to-purple-500' },
    { path: '/studentpart/badges', name: 'Badges', icon: '🏆', color: 'from-yellow-500 to-amber-500' },
    { path: '/studentpart/notifications', name: 'Notifications', icon: '🔔', color: 'from-cyan-500 to-blue-500' },
    { path: '/studentpart/jobs', name: 'Jobs', icon: '💼', color: 'from-rose-500 to-red-500' },
    { path: '/studentpart/pledges', name: 'Pledges', icon: '💰', color: 'from-green-500 to-emerald-500' }
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
        <div className="lg:hidden bg-white/90 backdrop-blur-lg shadow-lg border-b border-white/30">
          <nav className="px-3 py-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              const showBadgeCount = item.path === '/studentpart/badges' && userBadges.length > 0;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-3 py-2.5 rounded-xl transition-all duration-300 hover:shadow-md ${
                    isActive
                      ? `bg-gradient-to-r ${item.color} text-white shadow-sm`
                      : 'text-slate-700 hover:bg-slate-100/50'
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

      {/* Enhanced Desktop Sidebar with Glass Morphism */}
      <div className={`hidden lg:block bg-white/90 backdrop-blur-xl shadow-xl h-screen sticky top-16 transition-all duration-500 ease-in-out ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}>
        <div className="flex flex-col h-full border-r border-white/50">
          {/* Enhanced Header - only show when not collapsed */}
          {isSidebarOpen && (
            <div className="px-5 py-5 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-br-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse"></div>
              <h2 className="text-lg font-bold relative z-10">Student Portal</h2>
              <p className="text-xs text-slate-300 mt-1 relative z-10">Navigate Your Future</p>
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
                <div key={item.path} className="relative group">
                  <Link
                    to={item.path}
                    className={`flex items-center rounded-2xl transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] ${
                      !isSidebarOpen 
                        ? 'justify-center p-3.5' 
                        : 'px-4 py-3.5'
                    } ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg ring-2 ring-white/30`
                        : 'text-slate-700 hover:bg-slate-100/70 backdrop-blur-sm'
                    }`}
                    title={!isSidebarOpen ? item.name : ''}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {isSidebarOpen && (
                      <>
                        <span className="font-semibold text-sm ml-3">{item.name}</span>
                        {showBadgeCount && (
                          <span className={`ml-auto bg-white/90 backdrop-blur-sm text-${item.color.includes('blue') ? 'blue' : item.color.includes('purple') ? 'purple' : item.color.includes('pink') ? 'pink' : item.color.includes('red') ? 'red' : item.color.includes('orange') ? 'orange' : item.color.includes('yellow') ? 'yellow' : item.color.includes('green') ? 'green' : item.color.includes('teal') ? 'teal' : item.color.includes('cyan') ? 'cyan' : 'slate'}-600 text-xs px-2 py-1 rounded-full font-bold shadow-sm`}>
                            {userBadges.length}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                  
                  {/* Enhanced Tooltip for collapsed sidebar */}
                  {!isSidebarOpen && (
                    <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 backdrop-blur-lg border border-white/10">
                      <div className="flex items-center">
                        <span className="mr-2">{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                    </div>
                  )}
                  
                  {/* Contextual sidebar toggle arrow for active item */}
                  {isActive && isSidebarOpen && onToggleSidebar && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onToggleSidebar(!isSidebarOpen);
                      }}
                      className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:bg-slate-50 focus:outline-none transition-all duration-300"
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
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:bg-slate-50 focus:outline-none transition-all duration-300"
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

          {/* Enhanced User Info - only show when not collapsed */}
          {isSidebarOpen && (
            <div className="px-4 py-5 border-t border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-slate-100/50 backdrop-blur-sm rounded-t-2xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-white/50 transform transition-transform duration-300 hover:scale-105">
                  {getInitials(studentName)}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-base font-bold text-slate-800 truncate bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent" title={studentName}>
                    {studentName}
                  </p>
                  <p className="text-xs text-slate-600 truncate font-medium">Student Member</p>
                </div>
              </div>
              <Link
                to="/"
                className="w-full bg-gradient-to-r from-slate-800 to-slate-900 backdrop-blur-sm text-white py-3 px-4 rounded-2xl text-sm hover:from-slate-900 hover:to-black transition-all flex items-center justify-center font-semibold shadow-lg hover:shadow-xl transform transition-transform duration-300 hover:scale-[1.02]"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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