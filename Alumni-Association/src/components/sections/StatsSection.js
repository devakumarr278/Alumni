import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ stat, index }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (stat.value && typeof stat.value === 'string' && stat.value.includes('+')) {
      const target = parseInt(stat.value.replace('+', '').replace(',', ''));
      let start = 0;
      const duration = 2000; // ms
      const increment = target / (duration / 16); // 60fps
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    } else {
      setCount(stat.value);
    }
  }, [stat.value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ y: -10, scale: 1.05 }}
      className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
    >
      <motion.div 
        className="text-4xl font-bold text-white mb-3"
        animate={{ 
          textShadow: [
            "0 0 0px rgba(255,255,255,0)",
            "0 0 10px rgba(255,255,255,0.5)",
            "0 0 0px rgba(255,255,255,0)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {typeof stat.value === 'string' && stat.value.includes('+') 
          ? `${count.toLocaleString()}+` 
          : stat.value}
      </motion.div>
      <div className="text-gray-200 font-medium">{stat.label}</div>
    </motion.div>
  );
};

const StatsSection = ({ stats = [] }) => {
  const defaultStats = [
    { value: '10,000', label: 'Alumni' },
    { value: '50', label: 'Countries' },
    { value: '95', label: 'Employment Rate %' },
    { value: '200', label: 'Events Yearly' },
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-white blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-white blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">By The Numbers</h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Our alumni community in numbers
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayStats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;