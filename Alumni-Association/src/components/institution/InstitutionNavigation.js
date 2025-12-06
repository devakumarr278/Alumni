import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const InstitutionNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { 
      path: '/institution/dashboard', 
      label: 'Dashboard', 
      icon: 'fa-chart-simple',
      description: 'Overview and statistics'
    },
    { 
      path: '/institution/alumni-verification', 
      label: 'Verification', 
      icon: 'fa-user-check',
      description: 'Verify new alumni'
    },
    { 
      path: '/institution/events', 
      label: 'Events', 
      icon: 'fa-calendar-days',
      description: 'Plan and organize events'
    },
    { 
      path: '/institution/gallery', 
      label: 'Gallery', 
      icon: 'fa-images',
      description: 'Manage photo galleries'
    },
    { 
      path: '/institution/analytics', 
      label: 'Analytics', 
      icon: 'fa-chart-pie',
      description: 'View detailed reports'
    },
    { 
      path: '/institution/rsvp', 
      label: 'RSVP', 
      icon: 'fa-calendar-check',
      description: 'Manage event registrations'
    },
    { 
      path: '/institution/notifications', 
      label: 'Notifications', 
      icon: 'fa-bell',
      description: 'Send announcements'
    },
    { 
      path: '/institution/settings', 
      label: 'Profile', 
      icon: 'fa-user',
      description: 'Institution settings'
    }
  ];

  const isActive = (path) => {
    // Special handling for dashboard routes
    if (path === '/institution/dashboard') {
      return location.pathname === '/institution' || location.pathname === '/institution/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-4 mb-6 border border-white/50">
      <div className="flex flex-wrap gap-2">
        {navigationItems.map((item, index) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`
              group flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${isActive(item.path)
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
              }
            `}
            title={item.description}
          >
            <i className={`fas ${item.icon}`}></i>
            <span className="hidden sm:inline">{item.label}</span>
            {isActive(item.path) && (
              <div className="w-2 h-2 bg-white rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default InstitutionNavigation;