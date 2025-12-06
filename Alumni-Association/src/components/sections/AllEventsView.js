import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { allEvents, eventCategories, getEventsByCategory } from '../../data/eventsData';
import EventCard from '../../components/EventCard'; // Added import

const AllEventsView = ({ isVisible, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(allEvents);
  const [viewType, setViewType] = useState('grid'); // Added state for view type
  const navigate = useNavigate();

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setFilteredEvents(getEventsByCategory(categoryId));
  };

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    // Filter events based on search term and active category
    let eventsToFilter = activeCategory === 'all' ? allEvents : getEventsByCategory(activeCategory);
    
    if (term) {
      eventsToFilter = eventsToFilter.filter(event => 
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term)
      );
    }
    
    setFilteredEvents(eventsToFilter);
  };

  const handleRegisterClick = (event) => {
    // Navigation logic based on event category
    if (event.category === 'social' || event.category === 'professional' || event.category === 'cultural') {
      navigate('/login?type=student');
    } else if (event.category === 'sports' || event.category === 'reunion') {
      navigate('/login?type=alumni');
    }
  };

  // Added function for calendar integration
  const handleAddToCalendar = (event) => {
    // Create calendar event in iCalendar format
    const eventDate = new Date(event.date);
    const startDate = eventDate.getFullYear() + '-' + 
                     String(eventDate.getMonth() + 1).padStart(2, '0') + '-' + 
                     String(eventDate.getDate()).padStart(2, '0');
    const endDate = new Date(eventDate);
    endDate.setHours(endDate.getHours() + 2); // Add 2 hours for event duration
    
    const title = encodeURIComponent(event.title);
    const description = encodeURIComponent(event.description);
    const location = encodeURIComponent(event.location);
    
    // Format end date
    const endDateFormatted = endDate.getFullYear() + 
                           String(endDate.getMonth() + 1).padStart(2, '0') + 
                           String(endDate.getDate()).padStart(2, '0') + 'T' +
                           String(endDate.getHours()).padStart(2, '0') +
                           String(endDate.getMinutes()).padStart(2, '0') +
                           String(endDate.getSeconds()).padStart(2, '0') + 'Z';
    
    // Create Google Calendar URL
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate.replace(/-/g, '')}T090000/${endDateFormatted}&details=${description}&location=${location}`;
    
    // Create iCalendar download
    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
UID:${event.id}@alumni-association
DTSTART:${startDate.replace(/-/g, '')}T090000Z
DTEND:${endDateFormatted}Z
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR
`;
    
    // Create download link
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    // Show options to user
    const choice = window.confirm(`Add "${event.title}" to your calendar?\n\nClick OK for Google Calendar\nClick Cancel to download ICS file`);
    
    if (choice) {
      window.open(googleCalendarUrl, '_blank');
    } else {
      const link = document.createElement('a');
      link.href = url;
      link.download = `${event.title.replace(/\s+/g, '_')}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // Added function for social sharing
  const handleShare = (event) => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.origin + '/events'
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      const text = `${event.title} - ${event.description} #AlumniEvent`;
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin + '/events')}`;
      window.open(url, '_blank');
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">🎯 All Events</h2>
              <p className="text-gray-300">Discover all our amazing alumni events</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Search Bar and View Toggle */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow max-w-xl">
              <input
                type="text"
                placeholder="Search events by title, location, or description..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-3 pl-12 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
            
            {/* View Toggle Buttons */}
            <div className="flex bg-gray-700 rounded-full p-1">
              <button
                onClick={() => setViewType('grid')}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  viewType === 'grid' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  viewType === 'list' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                List View
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-3 justify-center">
            {eventCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg transform scale-105`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                <span className="mr-2 text-lg">{category.emoji}</span>
                {category.name}
                <span className="ml-2 bg-white/20 text-xs px-2 py-1 rounded-full">
                  {getEventsByCategory(category.id).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid/List */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + searchTerm}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={
                viewType === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                  : "flex flex-col gap-4"
              }
            >
              {filteredEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  viewType={viewType}
                  onRegisterClick={handleRegisterClick}
                  onAddToCalendar={handleAddToCalendar}
                  onShare={handleShare}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredEvents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white/50 rounded-2xl border border-gray-200"
            >
              <div className="text-6xl mb-4">🎭</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No events found</h3>
              <p className="text-gray-600">Try adjusting your search or selecting a different category.</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AllEventsView;