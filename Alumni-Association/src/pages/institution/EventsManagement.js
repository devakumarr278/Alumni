import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const EventsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Mock events data
  const eventsData = [
    { id: 1, title: 'Annual Alumni Meet', date: 'Oct 15, 2025', attendees: 150, status: 'upcoming', type: 'Networking' },
    { id: 2, title: 'Career Development Workshop', date: 'Oct 22, 2025', attendees: 80, status: 'upcoming', type: 'Workshop' },
    { id: 3, title: 'Homecoming Weekend', date: 'Nov 5, 2025', attendees: 300, status: 'upcoming', type: 'Social' },
    { id: 4, title: 'Tech Conference 2025', date: 'Sep 10, 2025', attendees: 200, status: 'completed', type: 'Conference' },
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (filterValue) => {
    setFilter(filterValue);
  };

  const filteredEvents = eventsData.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || event.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-purple-100"
      >
        <h1 className="text-2xl font-bold text-gray-800">Events Management</h1>
        <p className="text-gray-700 mt-1">Create, manage, and track all alumni events</p>
      </motion.div>

      {/* Search and Filters */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-lg border border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50"
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
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => handleFilter('all')}
              className={filter === 'all' ? 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
            >
              All
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleFilter('upcoming')}
              className={filter === 'upcoming' ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
            >
              Upcoming
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleFilter('completed')}
              className={filter === 'completed' ? 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
            >
              Completed
            </Button>
          </div>
        </div>
      </Card>

      {/* Events List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/50"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{event.date}</p>
                <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                  {event.type}
                </span>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                event.status === 'upcoming' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {event.status}
              </span>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Expected Attendees:</span>
                <span className="font-medium text-gray-800">{event.attendees}</span>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <Button variant="outline" size="sm" className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50">
                View Details
              </Button>
              <Button variant="primary" size="sm" className="flex-1 bg-purple-500 hover:bg-purple-600">
                Edit
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card className="text-center py-12 bg-gradient-to-r from-purple-50 to-pink-50 backdrop-blur-lg border border-purple-100">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">No events found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </Card>
      )}

      {/* Create Event Button */}
      <div className="fixed bottom-8 right-8">
        <Button variant="primary" className="bg-purple-500 hover:bg-purple-600 shadow-lg py-3 px-6 rounded-full">
          <i className="fas fa-plus mr-2"></i>Create New Event
        </Button>
      </div>
    </div>
  );
};

export default EventsManagement;