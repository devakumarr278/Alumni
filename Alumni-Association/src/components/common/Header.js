import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth, USER_ROLES } from '../../context/AuthContext';
import { usePosts } from '../../context/PostContext';
import Button from './Button';
import Logo from '../../assets/images/logo.png'

const Header = () => {
  const { user, logout } = useAuth();
  const { newPostsCount } = usePosts();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);

  // Hide navigation on login and register pages or dashboard pages
  const hideNavigation = location.pathname === '/login' || 
                        location.pathname === '/register';
  
  // Hide logo and site name on dashboard pages and gallery
  const hideLogoAndName = location.pathname.includes('-dashboard') ||
                         location.pathname.includes('/institution/') ||
                         location.pathname.includes('/alumni/') ||
                         location.pathname.includes('/studentpart/') ||
                         location.pathname === '/gallery';
  
  // Hide navigation links on dashboard pages
  const hideNavLinks = location.pathname.includes('-dashboard') ||
                      location.pathname.includes('/institution/') ||
                      location.pathname.includes('/alumni/') ||
                      location.pathname.includes('/studentpart/') ||
                      location.pathname === '/gallery';

  // Hide auth elements (email dropdown and notifications) on dashboard pages
  const hideAuthElements = location.pathname.includes('-dashboard') ||
                          location.pathname.includes('/institution/') ||
                          location.pathname.includes('/alumni/') ||
                          location.pathname.includes('/studentpart/') ||
                          location.pathname === '/gallery';

  // Get dashboard path based on user role
  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case USER_ROLES.STUDENT:
        return '/studentpart/dashboard';
      case USER_ROLES.ALUMNI:
        return '/alumni-dashboard';
      case USER_ROLES.INSTITUTION:
        return '/institution-dashboard';
      default:
        return '/';
    }
  };

  const getRoleDisplayName = () => {
    if (!user) return '';
    switch (user.role) {
      case USER_ROLES.STUDENT:
        return 'Student';
      case USER_ROLES.ALUMNI:
        return 'Alumni';
      case USER_ROLES.INSTITUTION:
        return 'Institution';
      default:
        return '';
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Posts', path: '/posts' },
    { name: 'Contact', path: '/contact' },
  ];

  // Additional links for logged-in users (Alumni and Gallery removed as per request)
  const authenticatedLinks = [
    // { name: 'Alumni', path: '/alumni' },  // Removed as per user request
    // { name: 'Gallery', path: '/gallery' },  // Removed as per user request
  ];

  const allLinks = user ? [...navLinks, ...authenticatedLinks] : navLinks;

  // Mock notifications data
  const notifications = [
    { id: 1, message: 'New event announcement', time: '2 hours ago', read: false },
    { id: 2, message: 'Profile update reminder', time: '1 day ago', read: true },
    { id: 3, message: 'Connection request received', time: '2 days ago', read: false }
  ];

  const unreadNotifications = notifications.filter(n => !n.read).length;

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
          {!hideLogoAndName && (
            <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img
                  src={Logo}
                  alt="Alumni Association"
                  className="h-12"
                />
                <span className="ml-3 text-xl font-bold text-gray-800 hidden sm:block">
                  Alumni Network
                </span>
              </Link>
            </motion.div>
          )}

          {/* Desktop Navigation */}
          {!hideNavigation && !hideNavLinks && (
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
          )}

          {/* Auth Buttons with Email Dropdown and Notification Icon */}
          <div className="hidden md:flex items-center space-x-4">
            {!hideAuthElements && user ? (
              <div className="flex items-center space-x-4">
                {/* Post Notification Icon */}
                <div className="relative">
                  <button 
                    onClick={() => navigate('/')}
                    className="flex items-center text-gray-600 hover:text-gray-900 relative"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    {newPostsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {newPostsCount}
                      </span>
                    )}
                  </button>
                </div>
                
                {/* Notification Icon */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
                      setIsUserDropdownOpen(false);
                    }}
                    className="flex items-center text-gray-600 hover:text-gray-900 relative"
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
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border">
                      <div className="px-4 py-2 border-b">
                        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div 
                              key={notification.id} 
                              className={`px-4 py-3 border-b hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
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
                <div className="relative">
                  <button 
                    onClick={() => {
                      setIsUserDropdownOpen(!isUserDropdownOpen);
                      setIsNotificationDropdownOpen(false);
                    }}
                    className="flex items-center text-sm text-gray-700 hover:text-gray-900"
                  >
                    <span className="mr-1">{user.email}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                      <Link 
                        to={getDashboardPath()} 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        {getRoleDisplayName()} Dashboard
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
            ) : !hideAuthElements && !user ? (
              <div className="flex items-center space-x-2">
                <Button as={Link} to="/login" variant="outline" size="sm">
                  Login
                </Button>
                <Button as={Link} to="/register" size="sm">
                  Register
                </Button>
              </div>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          {!hideNavigation && (
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-500 focus:outline-none"
              >
                <svg
                  className={`h-6 w-6 transition-transform ${isOpen ? 'transform rotate-90' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                  />
                </svg>
              </button>
            </div>
          )}
          
          {/* Mobile Auth Buttons for Login/Register pages */}
          {hideNavigation && !user && (
            <div className="md:hidden flex items-center space-x-2">
              <Button as={Link} to="/login" variant="outline" size="sm">
                Login
              </Button>
              <Button as={Link} to="/register" size="sm">
                Register
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {!hideNavigation && !hideNavLinks && isOpen && (
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
                      isActive
                        ? 'bg-blue-50 text-blue-600'
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
                    <div className="px-3 py-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getRoleDisplayName()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {user.name}
                      </span>
                    </div>
                    <Button
                      onClick={() => {
                        navigate(getDashboardPath());
                        setIsOpen(false);
                      }}
                      variant="outline"
                      className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                    >
                      Dashboard
                    </Button>
                    <Button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      as={Link}
                      to="/login"
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Button>
                    <Button
                      as={Link}
                      to="/register"
                      className="w-full"
                      onClick={() => setIsOpen(false)}
                    >
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