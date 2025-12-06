import React from 'react';
import { motion } from 'framer-motion';

const timelineData = [
  {
    year: "1995",
    title: "Founding Years",
    description: "Our alumni association was established with just 50 founding members.",
    icon: "🏛️"
  },
  {
    year: "2002",
    title: "First Reunion",
    description: "Hosted our first official alumni reunion with over 200 attendees.",
    icon: "🎉"
  },
  {
    year: "2010",
    title: "Global Expansion",
    description: "Established international chapters in 5 countries.",
    icon: "🌎"
  },
  {
    year: "2018",
    title: "Digital Platform",
    description: "Launched our online alumni portal connecting thousands worldwide.",
    icon: "💻"
  },
  {
    year: "2023",
    title: "Modern Era",
    description: "Celebrated 10,000+ active members with enhanced career services.",
    icon: "🚀"
  }
];

const HistoryTimeline = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12 text-gray-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Our History
        </motion.h2>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-600 transform -translate-x-1/2"></div>
          
          {timelineData.map((item, index) => (
            <motion.div
              key={index}
              className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} mb-12`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex-1 px-4">
                <motion.div 
                  className={`bg-white p-6 rounded-xl shadow-md relative ${index % 2 === 0 ? 'text-right' : 'text-left'}`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={`absolute top-6 ${index % 2 === 0 ? '-right-2' : '-left-2'} w-4 h-4 bg-purple-600 transform rotate-45`}></div>
                  <span className="text-sm font-semibold text-purple-600">{item.year}</span>
                  <h3 className="text-xl font-bold text-gray-800 mt-1">{item.title}</h3>
                  <p className="text-gray-600 mt-2">{item.description}</p>
                </motion.div>
              </div>
              <div className="w-16 flex flex-col items-center">
                <div className="w-1 h-full bg-gradient-to-b from-blue-400 to-purple-500"></div>
                <div className="w-12 h-12 rounded-full bg-white border-4 border-purple-600 shadow-md flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
              </div>
              <div className="flex-1 px-4"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HistoryTimeline;