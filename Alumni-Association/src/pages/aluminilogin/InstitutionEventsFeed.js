import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiClock, FiMapPin, FiCheck, FiX, FiFilter, FiSearch, FiChevronDown, FiUsers, FiBookmark, FiArrowUp, FiArrowDown } from 'react-icons/fi';

const InstitutionEventsFeed = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedEvents, setExpandedEvents] = useState({});
  const [eventStatus, setEventStatus] = useState({}); // Track accepted/rejected events
  const [sortBy, setSortBy] = useState('date'); // date, popularity, relevance
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc

  // Mock data for demonstration
  const mockEvents = [
    {
      id: 1,
      title: 'Annual Alumni Networking Conference 2025',
      description: 'Join us for our biggest alumni gathering of the year. Connect with fellow graduates, industry leaders, and explore new career opportunities. Keynote speakers from top tech companies will share insights on future trends.',
      date: '2025-08-15',
      time: '09:00 AM - 5:00 PM',
      location: 'Grand Ballroom, University Convention Center',
      category: 'conference',
      organizer: 'SSN College of Engineering',
      organizerAvatar: 'https://placehold.co/40x40/6366f1/white?text=SSN',
      attendees: 245,
      interested: 89,
      status: 'pending', // pending, accepted, rejected
      imageUrl: 'https://placehold.co/600x300/6366f1/white?text=Conference'
    },
    {
      id: 2,
      title: 'Career Workshop: Mastering Technical Interviews',
      description: 'Learn insider strategies for acing technical interviews from our alumni who work at FAANG companies. Interactive sessions with live coding practice and resume review.',
      date: '2025-07-22',
      time: '2:00 PM - 4:00 PM',
      location: 'Virtual Event (Zoom)',
      category: 'workshop',
      organizer: 'Computer Science Department',
      organizerAvatar: 'https://placehold.co/40x40/10b981/white?text=CS',
      attendees: 0,
      interested: 156,
      status: 'accepted',
      imageUrl: 'https://placehold.co/600x300/10b981/white?text=Workshop'
    },
    {
      id: 3,
      title: 'Startup Pitch Competition Finals',
      description: 'Watch the final round of our annual student startup pitch competition. Winners will receive funding opportunities and mentorship from our distinguished alumni panel.',
      date: '2025-07-30',
      time: '6:00 PM - 9:00 PM',
      location: 'Innovation Hub, Main Campus',
      category: 'competition',
      organizer: 'Entrepreneurship Cell',
      organizerAvatar: 'https://placehold.co/40x40/f97316/white?text=ECell',
      attendees: 0,
      interested: 203,
      status: 'pending',
      imageUrl: 'https://placehold.co/600x300/f97316/white?text=Pitch'
    },
    {
      id: 4,
      title: 'Alumni Awards Ceremony 2025',
      description: 'Celebrate outstanding achievements by our alumni community. Awards will be presented in categories including Innovation, Leadership, Social Impact, and Lifetime Achievement.',
      date: '2025-09-05',
      time: '7:00 PM - 10:00 PM',
      location: 'Auditorium, Main Building',
      category: 'ceremony',
      organizer: 'Alumni Relations Office',
      organizerAvatar: 'https://placehold.co/40x40/ec4899/white?text=ARO',
      attendees: 0,
      interested: 312,
      status: 'rejected',
      imageUrl: 'https://placehold.co/600x300/ec4899/white?text=Awards'
    },
    {
      id: 5,
      title: 'Industry Trends Panel Discussion',
      description: 'Hear from industry veterans about emerging trends in AI, cybersecurity, and sustainable technology. Q&A session included.',
      date: '2025-08-08',
      time: '3:00 PM - 5:00 PM',
      location: 'Seminar Hall 3, Engineering Block',
      category: 'panel',
      organizer: 'IEEE Student Chapter',
      organizerAvatar: 'https://placehold.co/40x40/8b5cf6/white?text=IEEE',
      attendees: 0,
      interested: 94,
      status: 'accepted',
      imageUrl: 'https://placehold.co/600x300/8b5cf6/white?text=Panel'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Events', icon: <FiCalendar /> },
    { id: 'conference', name: 'Conferences', icon: <FiUsers /> },
    { id: 'workshop', name: 'Workshops', icon: <FiBookmark /> },
    { id: 'competition', name: 'Competitions', icon: <FiUsers /> },
    { id: 'ceremony', name: 'Ceremonies', icon: <FiUsers /> },
    { id: 'panel', name: 'Panel Discussions', icon: <FiUsers /> }
  ];

  const sortOptions = [
    { id: 'date', name: 'Date', icon: <FiCalendar /> },
    { id: 'popularity', name: 'Popularity', icon: <FiUsers /> },
    { id: 'relevance', name: 'Relevance', icon: <FiSearch /> }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      case 'pending': return 'Pending Review';
      default: return 'Unknown';
    }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let result = events;
    
    // Apply category filter
    if (activeFilter !== 'all') {
      result = result.filter(event => event.category === activeFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.organizer.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'popularity':
          comparison = b.interested - a.interested;
          break;
        case 'relevance':
          // Simple relevance scoring based on search term matches
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const aScore = 
              (a.title.toLowerCase().includes(query) ? 3 : 0) +
              (a.description.toLowerCase().includes(query) ? 2 : 0) +
              (a.organizer.toLowerCase().includes(query) ? 1 : 0);
            const bScore = 
              (b.title.toLowerCase().includes(query) ? 3 : 0) +
              (b.description.toLowerCase().includes(query) ? 2 : 0) +
              (b.organizer.toLowerCase().includes(query) ? 1 : 0);
            comparison = bScore - aScore;
          } else {
            comparison = 0;
          }
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
    
    setFilteredEvents(result);
  }, [activeFilter, searchQuery, events, sortBy, sortOrder]);

  const handleAcceptEvent = (eventId) => {
    setEventStatus(prev => ({
      ...prev,
      [eventId]: 'accepted'
    }));
    
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { ...event, status: 'accepted' } 
          : event
      )
    );
  };

  const handleRejectEvent = (eventId) => {
    setEventStatus(prev => ({
      ...prev,
      [eventId]: 'rejected'
    }));
    
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { ...event, status: 'rejected' } 
          : event
      )
    );
  };

  const toggleEventExpansion = (eventId) => {
    setExpandedEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-red-500 mb-2">⚠️</div>
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Institution Events Feed
          </h1>
          <p className="text-gray-600 mt-2">
            Stay connected with announcements and events from your alma mater
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow border border-white/50 p-4">
            <div className="text-2xl font-bold text-blue-600">24</div>
            <div className="text-gray-600 text-sm">Upcoming Events</div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow border border-white/50 p-4">
            <div className="text-2xl font-bold text-purple-600">156</div>
            <div className="text-gray-600 text-sm">Interested Alumni</div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow border border-white/50 p-4">
            <div className="text-2xl font-bold text-pink-600">89%</div>
            <div className="text-gray-600 text-sm">Response Rate</div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow border border-white/50 p-4">
            <div className="text-2xl font-bold text-indigo-600">12</div>
            <div className="text-gray-600 text-sm">New This Month</div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div 
          className="flex flex-col lg:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filters and Sorting */}
          <div className="flex gap-2">
            {/* Category Filter */}
            <div className="relative">
              <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/70 shadow-sm">
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                  className="py-3 pl-4 pr-8 bg-transparent focus:outline-none appearance-none"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            {/* Sort By */}
            <div className="relative">
              <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/70 shadow-sm">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="py-3 pl-4 pr-8 bg-transparent focus:outline-none appearance-none"
                >
                  {sortOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            {/* Sort Order */}
            <button
              onClick={toggleSortOrder}
              className="flex items-center justify-center w-12 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/70 shadow-sm text-gray-600 hover:text-gray-800"
            >
              {sortOrder === 'asc' ? <FiArrowUp size={20} /> : <FiArrowDown size={20} />}
            </button>
          </div>
        </motion.div>

        {/* Categories Bar */}
        <motion.div 
          className="flex flex-wrap gap-2 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === category.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-gray-100 border border-white/50'
              }`}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Events Feed */}
        <div className="space-y-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden"
              >
                {/* Event Status Badge */}
                <div className={`px-4 py-2 text-center font-medium ${
                  getStatusColor(event.status)
                }`}>
                  {getStatusText(event.status)}
                </div>
                
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Event Image */}
                    <div className="md:w-1/3">
                      <img 
                        src={event.imageUrl} 
                        alt={event.title}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                    </div>
                    
                    {/* Event Details */}
                    <div className="md:w-2/3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h2>
                          <div className="flex items-center gap-4 text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <FiCalendar />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FiClock />
                              <span>{event.time}</span>
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => toggleEventExpansion(event.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <FiChevronDown className={`transform transition-transform ${
                            expandedEvents[event.id] ? 'rotate-180' : ''
                          }`} />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <img 
                          src={event.organizerAvatar} 
                          alt={event.organizer}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{event.organizer}</p>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <FiMapPin size={14} />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Event Description */}
                      <AnimatePresence>
                        {expandedEvents[event.id] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-4"
                          >
                            <p className="text-gray-700">{event.description}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Event Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-gray-600">
                            <FiUsers />
                            <span>{event.interested} interested</span>
                          </div>
                          {event.attendees > 0 && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <FiCheck />
                              <span>{event.attendees} attending</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Accept/Reject Buttons (only for pending events) */}
                        {event.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAcceptEvent(event.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                              <FiCheck />
                              <span>Accept</span>
                            </button>
                            <button
                              onClick={() => handleRejectEvent(event.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <FiX />
                              <span>Reject</span>
                            </button>
                          </div>
                        )}
                        
                        {/* Accepted/Rejected Message */}
                        {event.status === 'accepted' && (
                          <div className="text-green-600 font-medium">
                            You've accepted this event
                          </div>
                        )}
                        
                        {event.status === 'rejected' && (
                          <div className="text-red-600 font-medium">
                            You've declined this event
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No events found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-8">
          <button className="px-6 py-3 bg-white/80 backdrop-blur-lg border border-purple-100 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-200 shadow-sm">
            Load More Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstitutionEventsFeed;