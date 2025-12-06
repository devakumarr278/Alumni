// src/components/common/Header.js
import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';
import Logo from '../../assets/images/logo.png';

const Header = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu')) {
        setIsUserMenuOpen(false);
      }
      if (isNotificationMenuOpen && !event.target.closest('.notification-menu')) {
        setIsNotificationMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isUserMenuOpen, isNotificationMenuOpen]);

  // Base links visible to everyone (without alumni and gallery)
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Contact', path: '/contact' },
  ];

  // Admin-only links
  const adminLinks = [
    { name: 'Badge Admin', path: '/admin/badges' },
  ];

  // Build final link list
  let allLinks = [...navLinks];
  
  if (user?.userType === 'admin' || user?.email === 'admin@college.edu') { // Add admin links for admins
    allLinks = [...allLinks, ...adminLinks];
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="Alumni Association" className="h-12" />
              <span className="ml-3 text-xl font-bold text-gray-800 hidden sm:block">
                Alumni Network
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {allLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-500'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <motion.span
                        layoutId="navUnderline"
                        className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-600"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right side buttons - Notifications and User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notification Menu */}
            {user && user.userType === 'student' && (
              <div className="relative notification-menu">
                <button
                  onClick={() => setIsNotificationMenuOpen(!isNotificationMenuOpen)}
                  className="p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none relative"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 17H9a2 2 0 01-2-2V5a2 2 0 012-2h6a2 2 0 012 2v10a2 2 0 01-2 2h-1M11 17v4a2 2 0 002 2h6a2 2 0 002-2v-4" />
                  </svg>
                  {/* Notification badge */}
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                    3
                  </span>
                </button>
                
                {/* Notification Dropdown Menu */}
                {isNotificationMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      <Link to="/studentpart/notifications" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100" onClick={() => setIsNotificationMenuOpen(false)}>
                        <div className="flex justify-between">
                          <span className="font-medium">New Mentor Request</span>
                          <span className="text-xs text-gray-500">2 hours ago</span>
                        </div>
                        <p className="mt-1 text-gray-600">John Smith has requested to be your mentor</p>
                      </Link>
                      <Link to="/studentpart/notifications" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100" onClick={() => setIsNotificationMenuOpen(false)}>
                        <div className="flex justify-between">
                          <span className="font-medium">Event Reminder</span>
                          <span className="text-xs text-gray-500">1 day ago</span>
                        </div>
                        <p className="mt-1 text-gray-600">Alumni Networking Event starts tomorrow</p>
                      </Link>
                      <Link to="/studentpart/notifications" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsNotificationMenuOpen(false)}>
                        <div className="flex justify-between">
                          <span className="font-medium">New Badge Awarded</span>
                          <span className="text-xs text-gray-500">2 days ago</span>
                        </div>
                        <p className="mt-1 text-gray-600">You've been awarded the Mentor-Ready badge</p>
                      </Link>
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200 text-center">
                      <Link 
                        to="/studentpart/notifications" 
                        className="text-sm text-blue-600 hover:text-blue-800"
                        onClick={() => setIsNotificationMenuOpen(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Menu */}
            {user ? (
              <div className="relative user-menu">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-blue-600 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span>{user.name}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    {user.userType === 'student' && (
                      <Link
                        to="/studentpart"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Student Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); setIsUserMenuOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button as={Link} to="/login" variant="outline" size="sm">
                  Login
                </Button>
                <Button as={Link} to="/register" size="sm">
                  Register
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-500 focus:outline-none"
            >
              <svg
                className={`h-6 w-6 transition-transform ${isOpen ? 'transform rotate-90' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path
                  strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4"
          >
            <div className="px-2 pt-2 pb-4 space-y-1 bg-white rounded-lg shadow-lg">
              {allLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-500'
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <div className="flex flex-col space-y-2">
                    <span className="px-3 py-2 text-sm font-medium text-gray-500">
                      Signed in as {user.email}
                    </span>
                    {user.userType === 'student' && (
                      <Link
                        to="/student"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-500"
                        onClick={() => setIsOpen(false)}
                      >
                        Student Dashboard
                      </Link>
                    )}
                    <Button
                      onClick={() => { logout(); setIsOpen(false); }}
                      variant="outline" className="w-full"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Button as={Link} to="/login" variant="outline" className="w-full"
                      onClick={() => setIsOpen(false)}>
                      Login
                    </Button>
                    <Button as={Link} to="/register" className="w-full"
                      onClick={() => setIsOpen(false)}>
                      Register
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;