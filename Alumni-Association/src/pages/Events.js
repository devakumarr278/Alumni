import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EventsTimeline from '../components/sections/EventsTimeline';
import EventCategories from '../components/sections/EventCategories';
import UpcomingEvents from '../components/sections/UpcomingEvents';
import { allEvents } from '../data/eventsData';
import EventCard from '../components/EventCard';

const Events = () => {
  const [viewType, setViewType] = useState('featured');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-12 bg-gradient-to-br from-gray-50 to-blue-50"
    >
      <div className="container mx-auto px-4 mt-[50px]">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Events & Reunions</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with fellow alumni through our exciting events and activities
          </p>
        </motion.div>

        {/* View Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-full p-1 shadow-lg">
            <button
              onClick={() => setViewType('featured')}
              className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${
                viewType === 'featured'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Featured Events
            </button>
            <button
              onClick={() => setViewType('all')}
              className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${
                viewType === 'all'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              All Events
            </button>
          </div>
        </div>

        {viewType === 'featured' ? (
          <>
            <UpcomingEvents />
            <EventCategories />
            <EventsTimeline />
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {allEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                viewType="grid"
                onRegisterClick={() => {}}
                onAddToCalendar={() => {}}
                onShare={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Events;