import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const InstitutionSidebar = ({ isSidebarOpen = true, setIsSidebarOpen }) => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const menuItems = [
    {
      name: 'Dashboard',
      icon: '🏠',
      path: '/institution/dashboard'
    },
    {
      name: 'Post Feed',
      icon: '📢',
      path: '/institution/post-feed'
    },
    {
      name: 'Alumni Verification',
      icon: '👥',
      path: '/institution/alumni-verification'
    },
    {
      name: 'Alumni Management',
      icon: '📋',
      path: '/institution/alumni-management'
    },
    {
      name: 'Student Management',
      icon: '🎓',
      path: '/institution/student-management'
    },
    {
      name: 'Activity Analytics',
      icon: '📈',
      path: '/institution/activity-analytics'
    }
  ];

  return (
    <div className={`bg-white shadow-lg h-screen sticky top-16 transition-all duration-300 ${
      isSidebarOpen ? 'w-64' : 'w-16'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header - only show when not collapsed */}
        {isSidebarOpen && (
          <div className="px-6 py-4 bg-violet-600 text-white">
            <h2 className="text-xl font-bold">Institution Portal</h2>
          </div>
        )}

        {/* Navigation Items */}
        <nav className={`flex-1 ${isSidebarOpen ? 'px-4 py-6' : 'px-2 py-6'} space-y-2 overflow-y-auto`}>
          {menuItems.map((item, index) => {
            const isMainItemActive = isActive(item.path);
            
            return (
              <div key={index} className="relative">
                <Link
                  to={item.path}
                  className={`flex items-center rounded-lg transition-colors w-full text-left ${
                    !isSidebarOpen 
                      ? 'justify-center p-3' 
                      : 'px-4 py-3'
                  } ${
                    isMainItemActive
                      ? 'bg-violet-100 text-violet-700 border-r-4 border-violet-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={!isSidebarOpen ? item.name : ''}
                >
                  <span className="text-xl">{item.icon}</span>
                  {isSidebarOpen && (
                    <span className="font-medium ml-3">{item.name}</span>
                  )}
                </Link>
                
                {/* Contextual sidebar toggle arrow for active item */}
                {isMainItemActive && isSidebarOpen && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsSidebarOpen(!isSidebarOpen);
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:bg-gray-50 focus:outline-none"
                    aria-label="Collapse sidebar"
                  >
                    <svg 
                      className={`w-4 h-4 text-gray-600 ${isSidebarOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                
                {/* Contextual sidebar toggle arrow for active item when collapsed */}
                {isMainItemActive && !isSidebarOpen && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsSidebarOpen(!isSidebarOpen);
                    }}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:bg-gray-50 focus:outline-none"
                    aria-label="Expand sidebar"
                  >
                    <svg 
                      className={`w-4 h-4 text-gray-600 ${isSidebarOpen ? 'rotate-180' : ''}`} 
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
      </div>
    </div>
  );
};

export default InstitutionSidebar;