import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const InstitutionSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const navigationItems = [
    { path: '/institution/dashboard', label: 'Dashboard', icon: '🏫' },
    { path: '/institution/alumni-verification', label: 'Alumni Verification', icon: '👥' },
    { path: '/institution/analytics', label: 'Analytics', icon: '📊' },
    { path: '/institution/events', label: 'Events & Announcements', icon: '📅' },
    { path: '/institution/settings', label: 'Settings', icon: '⚙️' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`bg-white shadow-lg h-screen sticky top-16 transition-all duration-300 ${
      isSidebarOpen ? 'w-64' : 'w-16'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header - only show when not collapsed */}
        {isSidebarOpen && (
          <div className="px-6 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
            <h2 className="text-xl font-bold">Institution Portal</h2>
          </div>
        )}

        {/* Navigation Items */}
        <nav className={`flex-1 ${isSidebarOpen ? 'px-4 py-6' : 'px-2 py-6'} space-y-2 overflow-y-auto`}>
          {navigationItems.map((item, index) => (
            <div key={item.path} className="relative">
              <button
                className={`flex items-center rounded-lg transition-colors w-full text-left ${
                  !isSidebarOpen 
                    ? 'justify-center p-3' 
                    : 'px-4 py-3'
                } ${
                  isActive(item.path)
                    ? 'bg-violet-100 text-violet-700 border-r-4 border-violet-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                title={!isSidebarOpen ? item.label : ''}
                onClick={() => navigate(item.path)}
              >
                <span className="text-xl">{item.icon}</span>
                {isSidebarOpen && (
                  <span className="font-medium ml-3">{item.label}</span>
                )}
              </button>
              
              {/* Contextual sidebar toggle arrow for active item */}
              {isActive(item.path) && isSidebarOpen && (
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
              {isActive(item.path) && !isSidebarOpen && (
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
          ))}
        </nav>
        
        {/* User Info and Back to Main Site - only show when not collapsed */}
        {isSidebarOpen && (
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-violet-500 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate" title="admin@college.edu">
                  admin@college.edu
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm hover:bg-gray-200 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Back to Main Site
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstitutionSidebar;