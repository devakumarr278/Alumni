import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { eventCategories } from '../data/eventsData';

const EventCard = ({ 
  event, 
  viewType = 'grid', 
  onRegisterClick,
  onAddToCalendar,
  onShare 
}) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [attendeeCount] = useState(Math.floor(Math.random() * 100) + 25); // Random count for demo

  // Get category details
  const category = eventCategories.find(cat => cat.id === event.category) || {};

  // Calculate time left until event
  useEffect(() => {
    if (event.date) {
      const calculateTimeLeft = () => {
        const eventDate = new Date(event.date);
        const now = new Date();
        const difference = eventDate - now;
        
        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          
          return { days, hours, minutes };
        }
        return null;
      };

      setTimeLeft(calculateTimeLeft());
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 60000); // Update every minute

      return () => clearInterval(timer);
    }
  }, [event.date]);

  // Tags for the event
  const tags = ['#Networking', '#Alumni', '#Community', '#Event'];

  if (viewType === 'list') {
    // List view implementation
    return (
      <motion.div
        className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
        whileHover={{ y: -3 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-1/3">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-48 md:h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute top-3 left-3">
              <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r ${category.color} text-white shadow-lg`}>
                {category.emoji} {category.name}
              </span>
            </div>
            {event.featured && (
              <div className="absolute top-3 right-3">
                <span className="inline-block px-2 py-1 text-xs font-bold rounded-full bg-yellow-400 text-yellow-900 shadow-lg">
                  ⭐ FEATURED
                </span>
              </div>
            )}
          </div>
          
          <div className="p-6 flex-grow flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
              <span className="text-lg font-bold text-purple-600">{event.price}</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <div className="flex items-center text-gray-600">
                <span className="mr-1">📅</span>
                <span className="text-sm">{event.date}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="mr-1">🕐</span>
                <span className="text-sm">{event.time}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="mr-1">📍</span>
                <span className="text-sm">{event.location}</span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4 flex-grow">{event.description}</p>
            
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-white"></div>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">{attendeeCount} going</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onAddToCalendar && onAddToCalendar(event)}
                  className="flex items-center px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <span className="mr-1">📅</span>
                  Calendar
                </button>
                <button
                  onClick={() => onRegisterClick && onRegisterClick(event)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  🎫 Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view implementation
  return (
    <motion.div
      className="event-card h-full flex flex-col group bg-white rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl hover:border-gray-300 transition-all duration-300"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {/* Event Image with Gradient Overlay */}
      <div className="relative overflow-hidden rounded-t-2xl h-60">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r ${category.color} text-white shadow-lg`}>
            {category.emoji} {category.name}
          </span>
        </div>

        {/* Featured Badge */}
        {event.featured && (
          <div className="absolute top-3 right-3">
            <span className="inline-block px-2 py-1 text-xs font-bold rounded-full bg-yellow-400 text-yellow-900 shadow-lg pulse-border">
              ⭐ FEATURED
            </span>
          </div>
        )}

        {/* Price */}
        <div className="absolute bottom-3 right-3">
          <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-bold border border-gray-200">
            {event.price}
          </span>
        </div>
      </div>

      {/* Event Content */}
      <div className="bg-white p-5 rounded-b-2xl flex-grow flex flex-col border-t border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{event.title}</h3>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <div className="event-info-icon bg-blue-100 text-blue-600 mr-2 rounded-full w-6 h-6 flex items-center justify-center">📅</div>
            <span className="font-medium">{event.date}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <div className="event-info-icon bg-purple-100 text-purple-600 mr-2 rounded-full w-6 h-6 flex items-center justify-center">🕐</div>
            <span className="font-medium">{event.time}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <div className="event-info-icon bg-green-100 text-green-600 mr-2 rounded-full w-6 h-6 flex items-center justify-center">📍</div>
            <span className="font-medium text-xs">{event.location}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">{event.description}</p>

        {/* Attendee Count */}
        <div className="flex items-center mb-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-white"></div>
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">{attendeeCount} people going</span>
        </div>

        {/* Countdown Timer */}
        {timeLeft && (
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1">Event starts in:</div>
            <div className="flex gap-2">
              <div className="flex flex-col items-center">
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg px-2 py-1 text-sm font-bold w-12">
                  {timeLeft.days}
                </span>
                <span className="text-xs text-gray-500 mt-1">Days</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg px-2 py-1 text-sm font-bold w-12">
                  {timeLeft.hours}
                </span>
                <span className="text-xs text-gray-500 mt-1">Hours</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg px-2 py-1 text-sm font-bold w-12">
                  {timeLeft.minutes}
                </span>
                <span className="text-xs text-gray-500 mt-1">Mins</span>
              </div>
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onAddToCalendar && onAddToCalendar(event)}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <span className="mr-1">📅</span>
            Calendar
          </button>
          <button
            onClick={() => onShare && onShare(event)}
            className="px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <span>↗</span>
          </button>
          <button
            onClick={() => onRegisterClick && onRegisterClick(event)}
            className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            🎫 Register
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;