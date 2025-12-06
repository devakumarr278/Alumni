import React from 'react';
import { motion } from 'framer-motion';

const EventsTimeline = () => {
  const timelineEvents = [
    {
      id: 1,
      date: "October 15, 2025",
      title: "Annual Alumni Gala",
      description: "An elegant evening of celebration at the Grand Ballroom with keynote speaker Dr. Sarah Johnson.",
      icon: "fas fa-glass-cheers",
      emoji: "🎉",
      calendarDate: "2025-10-15"
    },
    {
      id: 2,
      date: "October 22, 2025",
      title: "Career Networking Workshop",
      description: "Interactive sessions with industry leaders from Google, Amazon, and local startups.",
      icon: "fas fa-briefcase",
      emoji: "💼",
      calendarDate: "2025-10-22"
    },
    {
      id: 3,
      date: "October 28, 2025",
      title: "10-Year Reunion",
      description: "Special gathering for the Class of 2015 with campus tours and memorabilia displays.",
      icon: "fas fa-users",
      emoji: "👥",
      calendarDate: "2025-10-28"
    },
    {
      id: 4,
      date: "October 30, 2025",
      title: "Alumni Golf Tournament",
      description: "Annual charity golf event at the University Golf Club with prizes and dinner reception.",
      icon: "fas fa-golf-ball",
      emoji: "⛳",
      calendarDate: "2025-10-30"
    }
  ];

  const addToCalendar = (event) => {
    // Create calendar event in iCalendar format
    const startDate = event.calendarDate;
    const endDate = new Date(event.calendarDate);
    endDate.setHours(endDate.getHours() + 2); // Add 2 hours for event duration
    
    const title = encodeURIComponent(event.title);
    const description = encodeURIComponent(event.description);
    const location = encodeURIComponent("University Campus");
    
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
LOCATION:University Campus
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

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 text-gray-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          📅 Events Timeline
        </motion.h2>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Enhanced Timeline line */}
          <div className="absolute left-1/2 h-full w-2 bg-gradient-to-b from-blue-400 via-purple-500 to-pink-400 transform -translate-x-1/2 rounded-full"></div>
          
          {timelineEvents.map((event, index) => (
            <motion.div
              key={event.id}
              className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} mb-16 items-center`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex-1 px-8">
                <motion.div 
                  className={`event-card timeline p-8 relative ${
                    index % 2 === 0 ? 'text-right' : 'text-left'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={`absolute top-8 ${
                    index % 2 === 0 ? '-right-3' : '-left-3'
                  } w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 transform rotate-45`}></div>
                  
                  <div className={`flex items-center gap-2 mb-3 ${
                    index % 2 === 0 ? 'justify-end' : 'justify-start'
                  }`}>
                    <span className="text-2xl">{event.emoji}</span>
                    <span className="text-sm font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">{event.date}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{event.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{event.description}</p>
                  
                  <button 
                    onClick={() => addToCalendar(event)}
                    className="btn-gradient px-6 py-3 font-semibold"
                  >
                    📅 Add to Calendar
                  </button>
                </motion.div>
              </div>
              
              <div className="w-20 flex flex-col items-center relative z-10">
                <motion.div 
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-xl flex items-center justify-center text-2xl text-white"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {event.emoji}
                </motion.div>
              </div>
              
              <div className="flex-1 px-8"></div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button className="glass-card px-8 py-4 text-purple-600 hover:text-purple-700 font-semibold transition-all duration-300 hover:scale-105">
            🔍 View Complete Timeline
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsTimeline;