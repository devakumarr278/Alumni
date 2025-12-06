import React from 'react';
import { motion } from 'framer-motion';

const StatsSection = ({ stats = [] }) => {
  const defaultStats = [
    { value: '10,000+', label: 'Alumni' },
    { value: '50+', label: 'Countries' },
    { value: '95%', label: 'Employment Rate' },
    { value: '200+', label: 'Events Yearly' },
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">By The Numbers</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our alumni community in numbers
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {displayStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-700">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;