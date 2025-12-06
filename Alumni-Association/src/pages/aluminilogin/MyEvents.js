import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/common/Card';
import API_BASE_URL from '../../utils/api';
import emptyEventsImage from '../../assets/images/empty-events.svg';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');

  // In a real application, you would fetch events from the backend
  useEffect(() => {
    // Mock data for demonstration
    const mockEvents = [
      { 
        id: 1, 
        title: 'Annual Alumni Meet', 
        date: '2023-12-15', 
        time: '18:00', 
        location: 'Main Campus Auditorium',
        description: 'Join us for our annual gathering of alumni from all batches',
        rsvpStatus: 'accepted',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1738&q=80',
        category: 'social',
        attendees: 150,
        price: 'Free'
      },
      { 
        id: 2, 
        title: 'Career Workshop', 
        date: '2023-12-20', 
        time: '14:00', 
        location: 'Online',
        description: 'Learn about the latest trends in your industry',
        rsvpStatus: 'pending',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
        category: 'career',
        attendees: 75,
        price: 'Free'
      },
      { 
        id: 3, 
        title: 'Holiday Party', 
        date: '2023-12-22', 
        time: '20:00', 
        location: 'Grand Hotel',
        description: 'Celebrate the holidays with fellow alumni',
        rsvpStatus: 'declined',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
        category: 'social',
        attendees: 200,
        price: '$50'
      },
      { 
        id: 4, 
        title: 'Tech Conference 2024', 
        date: '2024-01-10', 
        time: '09:00', 
        location: 'Convention Center',
        description: 'Three-day conference featuring industry leaders and workshops',
        rsvpStatus: 'accepted',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
        category: 'technology',
        attendees: 500,
        price: '$299'
      }
    ];
    
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'declined': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted': return 'Going';
      case 'declined': return 'Not Going';
      default: return 'Pending';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'social': return 'bg-pink-100 text-pink-800';
      case 'career': return 'bg-blue-100 text-blue-800';
      case 'technology': return 'bg-purple-100 text-purple-800';
      case 'education': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter and search events
  const filteredEvents = useMemo(() => {
    let filtered = [...events];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (activeFilter === 'upcoming') {
      filtered = filtered.filter(event => event.rsvpStatus !== 'declined');
    } else if (activeFilter === 'past') {
      // In this mock data, we'll consider events before today as past
      // Fix the date formatting to avoid timezone issues
      const today = new Date();
      const formattedToday = today.getFullYear() + '-' + 
                           String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                           String(today.getDate()).padStart(2, '0');
      filtered = filtered.filter(event => event.date < formattedToday);
    } else if (activeFilter === 'registered') {
      filtered = filtered.filter(event => event.rsvpStatus === 'accepted');
    } else if (activeFilter === 'not-registered') {
      filtered = filtered.filter(event => event.rsvpStatus === 'pending');
    }
    
    return filtered;
  }, [events, activeFilter, searchTerm]);

  const handleRSVP = async (eventId, response) => {
    try {
      // In a real application, you would send the RSVP response to the backend
      console.log(`RSVP ${response} for event ${eventId}`);
      
      // Update the local state to reflect the change
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId 
            ? { ...event, rsvpStatus: response } 
            : event
        )
      );
      
      // Show a success message (in a real app, you might use a toast notification)
      alert(`Your RSVP response (${response}) has been recorded!`);
    } catch (error) {
      console.error('Error processing RSVP:', error);
      alert('Failed to process your RSVP. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full"
        ></motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Premium Hero Section with Dynamic Background */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl shadow-xl"
      >
        {/* Animated gradient background with subtle motion effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 40%)',
            animation: 'pulse 6s ease-in-out infinite'
          }}
        ></div>
        
        {/* University landmark silhouette overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 200 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M20,80 L40,60 L60,80 L80,40 L100,80 L120,60 L140,80 L160,50 L180,80" stroke="#FFFFFF" strokeWidth="2" fill="none" />
            <rect x="90" y="20" width="20" height="40" fill="#FFFFFF" />
          </svg>
        </div>
        
        <div className="relative px-8 py-12 sm:px-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center mb-2"
          >
            <span className="text-4xl mr-3">🎉</span>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Alumni Events</h1>
              <p className="text-lg text-purple-100 mt-1">Reconnect, Learn, and Celebrate with Your Community</p>
            </div>
          </motion.div>
          
          {/* CTA Button for event creation */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-200 flex items-center space-x-2"
          >
            <span>📅</span>
            <span>Add Your Event</span>
          </motion.button>
        </div>
        
        {/* Subtle confetti animation particles */}
        <div className="absolute top-10 right-10 w-2 h-2 bg-yellow-200 rounded-full opacity-70 animate-ping"></div>
        <div className="absolute top-20 left-20 w-1.5 h-1.5 bg-pink-200 rounded-full opacity-60 animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-10 right-20 w-2 h-2 bg-blue-200 rounded-full opacity-70 animate-ping" style={{animationDelay: '2s'}}></div>
      </motion.div>

      {/* Enhanced Filter Bar with Segmented Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-4 border border-gray-200/50 sticky top-20 z-10"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search events by name, location, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
          
          {/* Segmented control style filters with icons */}
          <div className="flex bg-gray-100/70 rounded-xl p-1 backdrop-blur-sm min-w-fit">
            {[
              { key: 'upcoming', label: 'Upcoming', icon: '🔮' },
              { key: 'past', label: 'Past', icon: '🕰️' },
              { key: 'registered', label: 'Registered', icon: '🧾' },
              { key: 'not-registered', label: 'Not Registered', icon: '🚫' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeFilter === filter.key 
                    ? 'bg-white text-gray-900 shadow-md' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{filter.icon}</span>
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Animated filter dropdown trigger (hidden for now, can be expanded) */}
        <motion.div
          className="mt-3 pt-3 border-t border-gray-200/50 flex items-center text-sm text-gray-500"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <span>FilterWhere</span>
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-full text-center py-16"
          >
            <img 
              src={emptyEventsImage} 
              alt="No events" 
              className="mx-auto mb-6 w-60 h-40 object-contain"
            />
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No events yet!</h3>
            <p className="text-gray-600 mb-6">Be the first to host one 🎈</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveFilter('upcoming');
              }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:opacity-90 font-medium shadow-lg transition-all flex items-center mx-auto"
            >
              <span className="mr-2">🎉</span>
              Host Your First Event
            </button>
          </motion.div>
        ) : (
          filteredEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className="bg-white/90 backdrop-blur-lg border border-white/50 overflow-hidden h-full transition-all duration-300 hover:shadow-2xl hover:border-gray-200 relative"
              >
                <div className="relative group">
                  <img 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" 
                    src={event.image} 
                    alt={event.title} 
                  />
                  
                  {/* Gradient overlay on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Category badge with icon */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getCategoryColor(event.category)} flex items-center space-x-1 shadow-lg`}>
                      {event.category === 'social' && '👥'}
                      {event.category === 'career' && '💼'}
                      {event.category === 'technology' && '💻'}
                      {event.category === 'education' && '🎓'}
                      {!(event.category === 'social' || event.category === 'career' || event.category === 'technology' || event.category === 'education') && '🎉'}
                      <span>{event.category.charAt(0).toUpperCase() + event.category.slice(1)}</span>
                    </span>
                  </div>
                  
                  {/* Status badge with enhanced styling */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 ${getStatusColor(event.rsvpStatus)} flex items-center space-x-1 shadow-lg`}>
                      {event.rsvpStatus === 'accepted' && '✅'}
                      {event.rsvpStatus === 'declined' && '❌'}
                      {event.rsvpStatus === 'pending' && '⏳'}
                      <span>{getStatusText(event.rsvpStatus)}</span>
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{event.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 mr-2">📅</span>
                      <span className="text-gray-700">{event.date} at {event.time}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 mr-2">📍</span>
                      <span className="text-gray-700">{event.location}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 mr-2">👥</span>
                      <span className="text-gray-700">{event.attendees} attendees</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 mr-2">💰</span>
                      <span className="text-gray-700">{event.price}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-2">
                      {event.rsvpStatus === 'pending' ? (
                        <>
                          <motion.button 
                            onClick={() => handleRSVP(event.id, 'accepted')}
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2.5 px-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Accept Invitation
                          </motion.button>
                          <motion.button 
                            onClick={() => handleRSVP(event.id, 'declined')}
                            className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-2.5 px-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Can't Attend
                          </motion.button>
                        </>
                      ) : (
                        <motion.button 
                          onClick={() => handleRSVP(event.id, 'pending')}
                          className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-2.5 px-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Change Response
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyEvents;