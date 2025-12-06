import React, { useState } from 'react';
import { motion } from 'framer-motion';

const GalleryCategories = ({ onCategoryChange }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All Photos', icon: 'fas fa-images' },
    { id: 'events', name: 'Events', icon: 'fas fa-calendar-alt' },
    { id: 'campus', name: 'Campus', icon: 'fas fa-university' },
    { id: 'reunions', name: 'Reunions', icon: 'fas fa-users' },
    { id: 'sports', name: 'Sports', icon: 'fas fa-running' },
    { id: 'awards', name: 'Awards', icon: 'fas fa-trophy' }
  ];

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    onCategoryChange(categoryId);
  };

  return (
    <motion.div 
      className="flex flex-wrap justify-center gap-3 mb-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {categories.map((category) => (
        <motion.button
          key={category.id}
          className={`flex items-center px-5 py-2.5 rounded-full transition-all duration-300 ${
            activeCategory === category.id
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
          onClick={() => handleCategoryClick(category.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className={`${category.icon} mr-2`}></i>
          {category.name}
        </motion.button>
      ))}
    </motion.div>
  );
};

export default GalleryCategories;