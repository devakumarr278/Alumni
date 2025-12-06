import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { eventCategories, getEventsByCategory } from '../../data/eventsData';
import AllEventsView from './AllEventsView';
import EventCard from '../../components/EventCard'; // Added import

const EventCategories = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [displayedEvents, setDisplayedEvents] = useState(getEventsByCategory('all').slice(0, 3));
  const [showAllEvents, setShowAllEvents] = useState(false);
  const navigate = useNavigate();
  
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    const categoryEvents = getEventsByCategory(categoryId);
    setDisplayedEvents(categoryEvents.slice(0, 3)); // Show first 3 events of the category
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

  const handleExploreClick = () => {
    setShowAllEvents(true);
  };

  return (
    <section className="py-12 bg-gradient-to-br from-white to-blue-50">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center mb-8 text-gray-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          🎯 Browse by Category
        </motion.h2>
        
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
        >
          {eventCategories.map((category) => (
            <motion.button
              key={category.id}
              className={`flex items-center px-6 py-3 font-semibold rounded-full transition-all duration-300 ${
                activeCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg transform scale-105`
                  : 'bg-white text-gray-800 hover:bg-gray-50 border border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => handleCategoryChange(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2 text-lg">{category.emoji}</span>
              {category.name}
              <span className="ml-2 bg-white/20 text-xs px-2 py-1 rounded-full">
                {getEventsByCategory(category.id).length}
              </span>
            </motion.button>
          ))}
        </motion.div>

        <motion.div 
          className="glass-card p-8 mx-auto max-w-6xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">
              {eventCategories.find(c => c.id === activeCategory)?.emoji}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {activeCategory === 'all' 
                ? 'All Upcoming Events' 
                : `${eventCategories.find(c => c.id === activeCategory)?.name} Events`
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {activeCategory === 'all' 
                ? 'Discover all the amazing events we have planned for our alumni community' 
                : `Explore ${eventCategories.find(c => c.id === activeCategory)?.name.toLowerCase()} events designed to bring our community together`
              }
            </p>
          </div>

          {/* Featured Events Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {displayedEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  viewType="grid"
                  onRegisterClick={(e) => handleRegisterClick(e)}
                  onAddToCalendar={(e) => handleAddToCalendar(e)}
                  onShare={(e) => handleShare(e)}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="text-center">
            <button 
              onClick={handleExploreClick}
              className="btn-gradient px-8 py-3 font-semibold"
            >
              🔍 Explore More {activeCategory === 'all' ? 'Events' : eventCategories.find(c => c.id === activeCategory)?.name} Events
            </button>
          </div>
        </motion.div>
        
        {/* All Events Modal */}
        <AllEventsView 
          isVisible={showAllEvents} 
          onClose={() => setShowAllEvents(false)} 
        />
      </div>
    </section>
  );
};

export default EventCategories;