﻿import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  }, [query, onSearch]);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    // Real-time search as user types
    if (onSearch) {
      onSearch(value);
    }
  }, [onSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
    if (onSearch) {
      onSearch('');
    }
  }, [onSearch]);

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search alumni by name, college, department, or profession..."
            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
            value={query}
            onChange={handleInputChange}
            autoComplete="off"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <i className="fas fa-search"></i>
          </div>
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        
        {/* Search suggestions or results count could go here */}
        {query && (
          <div className="mt-2 text-sm text-gray-600">
            Searching for: <span className="font-medium">"{query}"</span>
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default SearchBar;