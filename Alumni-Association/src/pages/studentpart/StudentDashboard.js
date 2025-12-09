import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
  const { logout } = useAuth();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showDancingEmoji, setShowDancingEmoji] = useState(false);
  const [animatedEmojis, setAnimatedEmojis] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Celebration effect for positive actions
  const triggerCelebration = () => {
    setShowConfetti(true);
    setShowDancingEmoji(true);
    
    // Create animated emojis
    const emojis = ['😄', '🎉', '🎊', '🥳', '👏', '🙌', '👍', '💯', '🔥', '✨'];
    setAnimatedEmojis(emojis.map((emoji, index) => ({
      id: index,
      emoji,
      style: {
        position: 'fixed',
        fontSize: `${Math.random() * 24 + 16}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        zIndex: 1000,
        animation: `dance-${index} 5s forwards`
      }
    })));
    
    // Clean up after animations
    setTimeout(() => {
      setShowConfetti(false);
      setShowDancingEmoji(false);
      setAnimatedEmojis([]);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-blue-100 bg-opacity-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-24 h-24 bg-blue-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-300 rounded-full opacity-30 animate-ping"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-blue-400 rounded-full opacity-30 animate-bounce"></div>
        {/* Additional floating elements */}
        <div className="absolute top-1/4 left-1/3 w-12 h-12 bg-blue-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-blue-300 rounded-full opacity-20 animate-ping delay-500"></div>
      </div>
      
      {/* Celebration Elements */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(300)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                top: '-10%',
                left: `${Math.random() * 100}%`,
                animation: `fall ${Math.random() * 3 + 2}s linear forwards`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}
      
      {showDancingEmoji && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl z-50 animate-bounce">
          😄
        </div>
      )}
      
      {animatedEmojis.map(({ id, emoji, style }) => (
        <div key={id} style={style} className="fixed z-50">
          {emoji}
        </div>
      ))}      
      {/* Enhanced Header with Blue Theme */}
      <header className="bg-blue-600 bg-opacity-90 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link 
                to="/" 
                className="text-white hover:text-blue-100 font-bold text-lg flex items-center transition-all duration-300 transform hover:scale-105"
                onClick={triggerCelebration}
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Main Site
              </Link>
              <span className="text-blue-200 hidden md:block">|</span>
              <div className="hidden md:flex space-x-6">
                <Link 
                  to="/" 
                  className="text-blue-100 hover:text-white font-medium text-base transition-all duration-300 transform hover:scale-105"
                  onClick={triggerCelebration}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className="text-blue-100 hover:text-white font-medium text-base transition-all duration-300 transform hover:scale-105"
                  onClick={triggerCelebration}
                >
                  About
                </Link>
                <Link 
                  to="/events" 
                  className="text-blue-100 hover:text-white font-medium text-base transition-all duration-300 transform hover:scale-105"
                  onClick={triggerCelebration}
                >
                  Events
                </Link>
                <Link 
                  to="/contact" 
                  className="text-blue-100 hover:text-white font-medium text-base transition-all duration-300 transform hover:scale-105"
                  onClick={triggerCelebration}
                >
                  Contact
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Enhanced Logout button */}
              <button 
                onClick={() => {
                  logout();
                  triggerCelebration();
                }}
                className="text-base font-bold text-white bg-blue-700 hover:bg-blue-800 px-5 py-2.5 rounded-full flex items-center transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Transparent Blue Background */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="text-center mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-800 mb-4 animate-fade-in-down">
            Student Dashboard
          </h1>
          <p className="text-lg sm:text-xl text-blue-700 max-w-2xl mx-auto animate-fade-in-up">
            Welcome to your personalized portal. Connect with alumni, explore opportunities, and advance your career journey.
          </p>
        </div>        

        {/* Quick Access Section */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-6 text-center flex items-center justify-center">
            Explore Alumni Association
            <span className="ml-2 text-2xl">🎓</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <Link 
              to="/" 
              className="group"
              onClick={triggerCelebration}
            >
              <div className="bg-blue-500 bg-opacity-90 text-white p-4 sm:p-6 rounded-xl text-center hover:bg-blue-600 transition-all transform group-hover:scale-105 shadow-lg hover:shadow-xl border border-blue-300 card-hover-effect">
                <div className="bg-white bg-opacity-20 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 transform group-hover:rotate-12 transition-transform">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-bold">Home</span>
              </div>
            </Link>
            
            <Link 
              to="/about" 
              className="group"
              onClick={triggerCelebration}
            >
              <div className="bg-blue-500 bg-opacity-90 text-white p-4 sm:p-6 rounded-xl text-center hover:bg-blue-600 transition-all transform group-hover:scale-105 shadow-lg hover:shadow-xl border border-blue-300 card-hover-effect">
                <div className="bg-white bg-opacity-20 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 transform group-hover:rotate-12 transition-transform">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-bold">About</span>
              </div>
            </Link>
            
            <Link 
              to="/events" 
              className="group"
              onClick={triggerCelebration}
            >
              <div className="bg-blue-500 bg-opacity-90 text-white p-4 sm:p-6 rounded-xl text-center hover:bg-blue-600 transition-all transform group-hover:scale-105 shadow-lg hover:shadow-xl border border-blue-300 card-hover-effect">
                <div className="bg-white bg-opacity-20 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 transform group-hover:rotate-12 transition-transform">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-bold">Events</span>
              </div>
            </Link>
            
            <Link 
              to="/contact" 
              className="group"
              onClick={triggerCelebration}
            >
              <div className="bg-blue-500 bg-opacity-90 text-white p-4 sm:p-6 rounded-xl text-center hover:bg-blue-600 transition-all transform group-hover:scale-105 shadow-lg hover:shadow-xl border border-blue-300 card-hover-effect">
                <div className="bg-white bg-opacity-20 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 transform group-hover:rotate-12 transition-transform">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-bold">Contact</span>
              </div>
            </Link>
          </div>
        </section>
        
        {/* Student Portal Features */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-6 text-center flex items-center justify-center">
            Student Portal Features
            <span className="ml-2 text-2xl">🚀</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {/* Dashboard Card */}
            <Link 
              to="/studentpart/dashboard" 
              className="group"
              onClick={triggerCelebration}
              onMouseEnter={() => setHoveredCard('dashboard')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`bg-white bg-opacity-80 rounded-xl shadow-lg p-5 sm:p-6 transition-all duration-300 transform ${hoveredCard === 'dashboard' ? 'scale-105 -translate-y-2' : ''} border-l-4 border-blue-500 card-hover-effect`}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 bg-opacity-90 rounded-xl mb-4 flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Dashboard</h3>
                <p className="text-gray-700 text-sm sm:text-base">Your personalized student homepage</p>
              </div>
            </Link>
            
            {/* Profile Card */}
            <Link 
              to="/studentpart/profile" 
              className="group"
              onClick={triggerCelebration}
              onMouseEnter={() => setHoveredCard('profile')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`bg-white bg-opacity-80 rounded-xl shadow-lg p-5 sm:p-6 transition-all duration-300 transform ${hoveredCard === 'profile' ? 'scale-105 -translate-y-2' : ''} border-l-4 border-blue-500 card-hover-effect`}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 bg-opacity-90 rounded-xl mb-4 flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Profile</h3>
                <p className="text-gray-700 text-sm sm:text-base">Manage your profile and consent settings</p>
              </div>
            </Link>
            
            {/* Alumni Directory Card */}
            <Link 
              to="/studentpart/directory" 
              className="group"
              onClick={triggerCelebration}
              onMouseEnter={() => setHoveredCard('directory')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`bg-white bg-opacity-80 rounded-xl shadow-lg p-5 sm:p-6 transition-all duration-300 transform ${hoveredCard === 'directory' ? 'scale-105 -translate-y-2' : ''} border-l-4 border-blue-500 card-hover-effect`}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 bg-opacity-90 rounded-xl mb-4 flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Alumni Directory</h3>
                <p className="text-gray-700 text-sm sm:text-base">Search and connect with alumni</p>
              </div>
            </Link>
            
            {/* Mentorship Card */}
            <Link 
              to="/studentpart/mentorship" 
              className="group"
              onClick={triggerCelebration}
              onMouseEnter={() => setHoveredCard('mentorship')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`bg-white bg-opacity-80 rounded-xl shadow-lg p-5 sm:p-6 transition-all duration-300 transform ${hoveredCard === 'mentorship' ? 'scale-105 -translate-y-2' : ''} border-l-4 border-blue-500 card-hover-effect`}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 bg-opacity-90 rounded-xl mb-4 flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Mentorship</h3>
                <p className="text-gray-700 text-sm sm:text-base">Find mentors and manage requests</p>
              </div>
            </Link>
            
            {/* My Bookings Card */}
            <Link 
              to="/studentpart/my-bookings" 
              className="group"
              onClick={triggerCelebration}
              onMouseEnter={() => setHoveredCard('bookings')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`bg-white bg-opacity-80 rounded-xl shadow-lg p-5 sm:p-6 transition-all duration-300 transform ${hoveredCard === 'bookings' ? 'scale-105 -translate-y-2' : ''} border-l-4 border-blue-500 card-hover-effect`}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 bg-opacity-90 rounded-xl mb-4 flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">My Bookings</h3>
                <p className="text-gray-700 text-sm sm:text-base">View and manage your bookings</p>
              </div>
            </Link>
            
            {/* Notifications Card */}
            <Link 
              to="/studentpart/notifications" 
              className="group"
              onClick={triggerCelebration}
              onMouseEnter={() => setHoveredCard('notifications')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`bg-white bg-opacity-80 rounded-xl shadow-lg p-5 sm:p-6 transition-all duration-300 transform ${hoveredCard === 'notifications' ? 'scale-105 -translate-y-2' : ''} border-l-4 border-blue-500 card-hover-effect`}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 bg-opacity-90 rounded-xl mb-4 flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM11 17H9a2 2 0 01-2-2V5a2 2 0 012-2h6a2 2 0 012 2v10a2 2 0 01-2 2h-1M11 17v4a2 2 0 002 2h6a2 2 0 002-2v-4" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Notifications</h3>
                <p className="text-gray-700 text-sm sm:text-base">View notifications and messages</p>
              </div>
            </Link>
            
            {/* Badges Card */}
            <Link 
              to="/studentpart/badges" 
              className="group"
              onClick={triggerCelebration}
              onMouseEnter={() => setHoveredCard('badges')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`bg-white bg-opacity-80 rounded-xl shadow-lg p-5 sm:p-6 transition-all duration-300 transform ${hoveredCard === 'badges' ? 'scale-105 -translate-y-2' : ''} border-l-4 border-blue-500 card-hover-effect`}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 bg-opacity-90 rounded-xl mb-4 flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Badges</h3>
                <p className="text-gray-700 text-sm sm:text-base">View your impact badges and leaderboard</p>
              </div>
            </Link>
            
            {/* Jobs Card */}
            <Link 
              to="/studentpart/jobs" 
              className="group"
              onClick={triggerCelebration}
              onMouseEnter={() => setHoveredCard('jobs')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`bg-white bg-opacity-80 rounded-xl shadow-lg p-5 sm:p-6 transition-all duration-300 transform ${hoveredCard === 'jobs' ? 'scale-105 -translate-y-2' : ''} border-l-4 border-blue-500 card-hover-effect`}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 bg-opacity-90 rounded-xl mb-4 flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H6a2 2 0 00-2-2V4m12 0h2a2 2 0 012 2v6.5M4 6h16M4 6v10a2 2 0 002 2h4m-6-6l.01.01M6 16l.01.01" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Jobs</h3>
                <p className="text-gray-700 text-sm sm:text-base">Browse job and internship opportunities</p>
              </div>
            </Link>
            
            {/* Events Card */}
            <Link 
              to="/studentpart/events" 
              className="group"
              onClick={triggerCelebration}
              onMouseEnter={() => setHoveredCard('events')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`bg-white bg-opacity-80 rounded-xl shadow-lg p-5 sm:p-6 transition-all duration-300 transform ${hoveredCard === 'events' ? 'scale-105 -translate-y-2' : ''} border-l-4 border-blue-500 card-hover-effect`}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 bg-opacity-90 rounded-xl mb-4 flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Events</h3>
                <p className="text-gray-700 text-sm sm:text-base">View events and RSVP</p>
              </div>
            </Link>
            
            {/* Pledges Card */}
            <Link 
              to="/studentpart/pledges" 
              className="group"
              onClick={triggerCelebration}
              onMouseEnter={() => setHoveredCard('pledges')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`bg-white bg-opacity-80 rounded-xl shadow-lg p-5 sm:p-6 transition-all duration-300 transform ${hoveredCard === 'pledges' ? 'scale-105 -translate-y-2' : ''} border-l-4 border-blue-500 card-hover-effect`}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 bg-opacity-90 rounded-xl mb-4 flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Pledges</h3>
                <p className="text-gray-700 text-sm sm:text-base">Micropledges and donation campaigns</p>
              </div>
            </Link>
          </div>
        </section>
        
        {/* Quick Stats Section */}
        <section className="mt-12 text-center">
          <div className="bg-blue-50 bg-opacity-70 rounded-2xl shadow-lg p-6 sm:p-8 border border-blue-200">
            <h3 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-6 flex items-center justify-center">
              Quick Stats
              <span className="ml-2 text-2xl">📊</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white bg-opacity-80 p-4 sm:p-5 rounded-xl shadow-md transform hover:scale-105 transition-transform border-l-4 border-blue-500">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 flex items-center justify-center">
                  1,247
                  <span className="ml-1 sm:ml-2 text-green-500 text-lg sm:text-xl">↗</span>
                </div>
                <div className="text-blue-700 font-medium text-sm sm:text-base">Alumni Connected</div>
              </div>
              <div className="bg-white bg-opacity-80 p-4 sm:p-5 rounded-xl shadow-md transform hover:scale-105 transition-transform border-l-4 border-blue-500">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 flex items-center justify-center">
                  89
                  <span className="ml-1 sm:ml-2 text-green-500 text-lg sm:text-xl">↗</span>
                </div>
                <div className="text-blue-700 font-medium text-sm sm:text-base">Events This Year</div>
              </div>
              <div className="bg-white bg-opacity-80 p-4 sm:p-5 rounded-xl shadow-md transform hover:scale-105 transition-transform border-l-4 border-blue-500">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 flex items-center justify-center">
                  156
                  <span className="ml-1 sm:ml-2 text-green-500 text-lg sm:text-xl">↗</span>
                </div>
                <div className="text-blue-700 font-medium text-sm sm:text-base">Job Opportunities</div>
              </div>
              <div className="bg-white bg-opacity-80 p-4 sm:p-5 rounded-xl shadow-md transform hover:scale-105 transition-transform border-l-4 border-blue-500">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 flex items-center justify-center">
                  234
                  <span className="ml-1 sm:ml-2 text-green-500 text-lg sm:text-xl">↗</span>
                </div>
                <div className="text-blue-700 font-medium text-sm sm:text-base">Active Mentors</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;