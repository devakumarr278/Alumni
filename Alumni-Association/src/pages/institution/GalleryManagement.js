import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const GalleryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Mock gallery data
  const galleryData = [
    { id: 1, title: 'Annual Alumni Meet 2025', images: 24, date: 'Oct 15, 2025', category: 'Events' },
    { id: 2, title: 'Career Fair 2025', images: 18, date: 'Sep 22, 2025', category: 'Events' },
    { id: 3, title: 'Campus Life', images: 32, date: 'Aug 10, 2025', category: 'Campus' },
    { id: 4, title: 'Graduation Ceremony 2025', images: 45, date: 'Jun 15, 2025', category: 'Events' },
    { id: 5, title: 'Sports Day 2025', images: 28, date: 'Mar 20, 2025', category: 'Activities' },
    { id: 6, title: 'Research Showcase', images: 15, date: 'Feb 5, 2025', category: 'Academics' },
  ];

  const categories = ['all', 'Events', 'Campus', 'Activities', 'Academics'];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (filterValue) => {
    setFilter(filterValue);
  };

  const filteredGallery = galleryData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || item.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-pink-50 to-rose-50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-pink-100"
      >
        <h1 className="text-2xl font-bold text-gray-800">Gallery Management</h1>
        <p className="text-gray-700 mt-1">Organize and manage alumni event photos and memories</p>
      </motion.div>

      {/* Search and Filters */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-lg border border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search gallery collections..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white/50"
                value={searchTerm}
                onChange={handleSearch}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                onClick={() => handleFilter(category)}
                className={`${
                  filter === category
                    ? 'bg-pink-100 text-pink-800 border-pink-200'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGallery.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-white/50"
          >
            {/* Image Preview */}
            <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-2 w-32 h-32">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white/30 rounded border-2 border-dashed border-white/50"></div>
                  ))}
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {item.images} photos
              </div>
            </div>
            
            {/* Content */}
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.date}</p>
                </div>
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-800">
                  {item.category}
                </span>
              </div>
              
              <div className="mt-4 flex space-x-3">
                <Button variant="outline" size="sm" className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50">
                  <i className="fas fa-eye mr-2"></i>View
                </Button>
                <Button variant="primary" size="sm" className="flex-1 bg-pink-500 hover:bg-pink-600">
                  <i className="fas fa-edit mr-2"></i>Edit
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredGallery.length === 0 && (
        <Card className="text-center py-12 bg-gradient-to-r from-pink-50 to-rose-50 backdrop-blur-lg border border-pink-100">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">No gallery collections found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </Card>
      )}

      {/* Upload New Collection Button */}
      <div className="fixed bottom-8 right-8">
        <Button variant="primary" className="bg-pink-500 hover:bg-pink-600 shadow-lg py-3 px-6 rounded-full">
          <i className="fas fa-plus mr-2"></i>Upload Collection
        </Button>
      </div>
    </div>
  );
};

export default GalleryManagement;