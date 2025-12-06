import React from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';

const Events = ({ events = [] }) => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">🎉 Upcoming Events</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join us for these exciting alumni gatherings and networking opportunities
          </p>
        </motion.div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={event.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="event-card h-full flex flex-col"
              >
                <div className="p-6 flex-grow">
                  <div className="timeline mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <div className="event-info-icon bg-blue-100 text-blue-600">
                      📅
                    </div>
                    <p className="text-gray-600 font-medium">{event.date}</p>
                  </div>
                  
                  <p className="text-gray-600 mb-6 line-height-relaxed">{event.description}</p>
                  
                  <div className="mt-auto">
                    <button className="btn-gradient w-full py-3 text-center font-semibold">
                      🎫 Register Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="text-6xl mb-4">📅</div>
            <p className="text-xl text-gray-500 mb-4">No upcoming events at the moment</p>
            <p className="text-gray-400">Check back soon for exciting new events!</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Events;