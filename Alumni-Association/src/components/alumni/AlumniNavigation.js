import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const AlumniNavigation = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { 
      path: '/alumni-dashboard', 
      label: 'Dashboard', 
      icon: '🏠',
      description: 'Overview and recent activity'
    },
    { 
      path: '/alumni/profile', 
      label: 'Profile', 
      icon: '👤',
      description: 'Manage your profile'
    },
    { 
      path: '/alumni/connections', 
      label: 'Connections', 
      icon: '👥',
      description: 'Connect with other alumni'
    },
    { 
      path: '/alumni/follow-requests', 
      label: 'Follow Requests', 
      icon: '📩',
      description: 'Manage student connection requests',
      highlight: true
    },
    { 
      path: '/alumni/events', 
      label: 'Events', 
      icon: '📅',
      description: 'Upcoming alumni events'
    },
    { 
      path: '/alumni/posts', 
      label: 'Posts', 
      icon: '📝',
      description: 'Community posts and updates'
    },
    { 
      path: '/alumni/mentorship', 
      label: 'Mentorship', 
      icon: '🎓',
      description: 'Mentor or be mentored'
    },
    { 
      path: '/alumni/achievements', 
      label: 'Achievements', 
      icon: '🏆',
      description: 'Your accomplishments'
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-4 mb-6 border border-white/50">
      <div className="flex flex-wrap gap-2">
        {navigationItems.map((item, index) => (
          <motion.button
            key={item.path}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(item.path)}
            className={`
              group flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${item.highlight ? 'ring-2 ring-purple-500 ring-opacity-50' : ''}
              ${isActive(item.path)
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
              }
            `}
            title={item.description}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="hidden sm:inline">{item.label}</span>
            {isActive(item.path) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 bg-white rounded-full"
              />
            )}
            {item.highlight && !isActive(item.path) && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-purple-500 rounded-full"
              />
            )}
          </motion.button>
        ))}
      </div>
    </nav>
  );
};

export default AlumniNavigation;