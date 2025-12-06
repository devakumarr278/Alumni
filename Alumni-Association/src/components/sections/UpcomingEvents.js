import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { allEvents, eventCategories } from '../../data/eventsData';
import EventCard from '../../components/EventCard'; // Added import

const UpcomingEvents = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  
  // Show 3 events at a time
  const eventsPerPage = 3;
  const totalPages = Math.ceil(allEvents.length / eventsPerPage);
  
  // Get current events to display
  const getCurrentEvents = () => {
    const start = currentIndex * eventsPerPage;
    const end = start + eventsPerPage;
    return allEvents.slice(start, end);
  };
  
  const currentEvents = getCurrentEvents();
  
  const nextEvents = () => {
    if (currentIndex < totalPages - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const prevEvents = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRegisterClick = (event) => {
    navigate('/login');
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

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 text-gray-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          🔥 Upcoming Events
        </motion.h2>
        
        {/* Navigation Arrows */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={prevEvents}
            disabled={currentIndex === 0}
            className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              currentIndex === 0 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-gray-800 hover:bg-gray-100 shadow-lg hover:shadow-xl'
            }`}
          >
            <span className="mr-2">←</span>
            Previous
          </button>
          
          <div className="text-center">
            <span className="text-gray-600 font-medium">
              Page {currentIndex + 1} of {totalPages}
            </span>
          </div>
          
          <button 
            onClick={nextEvents}
            disabled={currentIndex === totalPages - 1}
            className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              currentIndex === totalPages - 1 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-gray-800 hover:bg-gray-100 shadow-lg hover:shadow-xl'
            }`}
          >
            Next
            <span className="ml-2">→</span>
          </button>
        </div>
        
        {/* Events Grid - Show 3 events at a time */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {currentEvents.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              viewType="grid"
              onRegisterClick={handleRegisterClick}
              onAddToCalendar={handleAddToCalendar}
              onShare={handleShare}
            />
          ))}
        </div>
        
        {/* View All Events Button */}
        <div className="text-center">
          <button 
            onClick={() => navigate('/events')}
            className="btn-gradient px-8 py-3 font-semibold rounded-full"
          >
            📅 View All Events
          </button>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;