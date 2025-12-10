import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../assets/images/logo.png';
import PeopleRequestsDropdown from '../components/alumni/PeopleRequestsDropdown';

const AlumniLayoutNew = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  console.log('AlumniLayoutNew rendered, user:', user);
  
  // Refs for dropdown containers
  const userDropdownRef = useRef(null);

  // Get user email or fallback to user data
  const userEmail = user?.email || user?.personalEmail || 'alumni@college.edu';
  
  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdowns if click is outside
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
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
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar with Alumni Network logo and text - FIXED POSITION */}
      <div className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center">
              <img
                src={Logo}
                alt="Alumni Network"
                className="h-10"
              />
              <span className="ml-3 text-lg font-bold text-gray-900">
                Alumni Network
              </span>
            </div>
            {/* User Email, Notification Icon and Dropdowns - TOP RIGHT CORNER */}
            <div className="flex items-center space-x-4">
              {/* People Requests Dropdown */}
              <PeopleRequestsDropdown user={user} />
              
              {/* User Email Dropdown */}
              <div className="relative" ref={userDropdownRef}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    // Toggle user dropdown
                    setIsUserDropdownOpen(!isUserDropdownOpen);
                  }}
                  className="flex items-center text-sm text-gray-700 hover:text-gray-900 focus:outline-none"
                  aria-label="User menu"
                >
                  <span className="mr-1 hidden md:inline">{userEmail}</span>
                  <span className="mr-1 md:hidden">
                    {userEmail.length > 15 ? `${userEmail.substring(0, 12)}...` : userEmail}
                  </span>
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
                        handleLogout();
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
      
      <div className="lg:flex pt-16">
        {/* Collapsible Sidebar */}
        <div className={`hidden lg:block transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'}`}>
          <div className="flex h-full">
            {/* Sidebar Content */}
            <div className="bg-white shadow-lg h-screen sticky top-16">
              <AlumniSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} userEmail={userEmail} />
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

// Alumni Sidebar Component
const AlumniSidebar = ({ isSidebarOpen, setIsSidebarOpen, userEmail }) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);
  const [openMenus, setOpenMenus] = useState({});

  const sidebarItems = [
    { path: '/alumni/dashboard', name: 'Dashboard', icon: '🏠' },
    { path: '/alumni/knowledge-posts', name: 'Knowledge Posts', icon: '📚' },
    { path: '/alumni/communication-hub', name: 'Communication Hub', icon: '💬' },
    { path: '/alumni/chat', name: 'Student Chat', icon: '💬' },
    { path: '/alumni/institution-events', name: 'Institution Events', icon: '🏛️' },
    { path: '/alumni/opportunities', name: 'Opportunities', icon: '✨' },
    { path: '/alumni/profile', name: 'Profile & Verification', icon: '👤' },
    { 
      name: 'Mentorship', 
      icon: '🤝', 
      path: '/alumni/mentorship',
      subItems: [
        { path: '/alumni/mentorship', name: 'Overview' },
        { path: '/alumni/mentorship/requests', name: 'Requests' },
        { path: '/alumni/mentorship/calendar', name: 'Calendar' },
        { path: '/alumni/mentorship/completed', name: 'History' }
      ]
    },
    { path: '/alumni/directory', name: 'Student Directory', icon: '📋' },
    { path: '/alumni/jobs', name: 'Jobs & Referrals', icon: '💼' },
    { path: '/alumni/events', name: 'Events', icon: '📅' },
    { path: '/alumni/fundraising', name: 'Fundraising', icon: '💰' },
    { path: '/alumni/badges', name: 'Recognition', icon: '🏆' },
    { path: '/alumni/notifications', name: 'Notifications', icon: '🔔' },
    { path: '/alumni/follow-requests', name: 'Follow Requests', icon: '📩' },
  ];
  // Update active item when location changes
  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  const toggleMenu = (menuName) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  return (
    <div className={`bg-white shadow-lg h-screen sticky top-16 transition-all duration-300 ${
      isSidebarOpen ? 'w-64' : 'w-16'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header - only show when not collapsed */}
        {isSidebarOpen && (
          <div className="px-6 py-4 bg-purple-600 text-white">
            <h2 className="text-xl font-bold">Alumni Portal</h2>
          </div>
        )}

        {/* Navigation Items */}
        <nav className={`flex-1 ${isSidebarOpen ? 'px-4 py-6' : 'px-2 py-6'} space-y-2 overflow-y-auto`}>
          {sidebarItems.map((item, index) => {
            // Check if item has subItems
            const hasSubItems = item.subItems && item.subItems.length > 0;
            
            // Check if this is the active main item or if any subitem is active
            let isMainItemActive = false;
            if (hasSubItems) {
              isMainItemActive = item.subItems.some(subItem => 
                subItem.path === '/alumni/mentorship' 
                  ? (activeItem === '/alumni/mentorship' || activeItem === '/alumni/mentorship/')
                  : activeItem === subItem.path
              );
            } else {
              // Special handling for Dashboard to match both '/' and '/alumni/dashboard'
              isMainItemActive = item.path === '/alumni/dashboard' 
                ? (activeItem === '/' || activeItem === '/alumni' || activeItem === '/alumni/dashboard')
                : activeItem === item.path;
            }
            
            return (
              <div key={index} className="relative">
                {hasSubItems ? (
                  <>
                    <div
                      className={`flex items-center rounded-lg transition-colors w-full text-left ${
                        !isSidebarOpen 
                          ? 'justify-center p-3' 
                          : 'px-4 py-3'
                      } ${
                        isMainItemActive
                          ? 'bg-purple-100 text-purple-700 border-r-4 border-purple-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      title={!isSidebarOpen ? item.name : ''}
                    >
                      <Link
                        to={item.path}
                        className="flex items-center w-full"
                        onClick={!isSidebarOpen ? () => toggleMenu(item.name) : undefined}
                      >
                        <span className="text-xl">{item.icon}</span>
                        {isSidebarOpen && (
                          <>
                            <span className="font-medium ml-3">{item.name}</span>
                            <svg 
                              className={`ml-auto w-4 h-4 text-gray-500 transform transition-transform ${
                                openMenus[item.name] ? 'rotate-180' : ''
                              }`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </>
                        )}
                      </Link>
                    </div>
                    
                    {isSidebarOpen && openMenus[item.name] && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.subItems.map((subItem, subIndex) => {
                          // Special handling for Overview to match both '/alumni/mentorship' and '/alumni/mentorship/'
                          const isSubItemActive = subItem.path === '/alumni/mentorship' 
                            ? (activeItem === '/alumni/mentorship' || activeItem === '/alumni/mentorship/')
                            : activeItem === subItem.path;
                          
                          return (
                            <Link
                              key={subIndex}
                              to={subItem.path}
                              className={`flex items-center rounded-lg transition-colors w-full text-left px-4 py-2 text-sm ${
                                isSubItemActive
                                  ? 'bg-purple-50 text-purple-700'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              <span className="font-medium">{subItem.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center rounded-lg transition-colors w-full text-left ${
                      !isSidebarOpen 
                        ? 'justify-center p-3' 
                        : 'px-4 py-3'
                    } ${
                      isMainItemActive
                        ? 'bg-purple-100 text-purple-700 border-r-4 border-purple-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    title={!isSidebarOpen ? item.name : ''}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {isSidebarOpen && (
                      <span className="font-medium ml-3">{item.name}</span>
                    )}
                  </Link>
                )}
                
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
        
        {/* User Info and Back to Main Site - only show when not collapsed */}
        {isSidebarOpen && (
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {userEmail.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate" title={userEmail}>
                  {userEmail}
                </p>
              </div>
            </div>
            <Link
              to="/"
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm hover:bg-gray-200 transition-colors flex items-center"
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
  );
};

export default AlumniLayoutNew;