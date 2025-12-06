﻿import React from 'react';
import { motion } from 'framer-motion';

const AlumniGrid = ({ alumni = [], searchQuery = '', filters = {} }) => {
  const filteredAlumni = alumni.filter(alum => {
    // Search query filter - check multiple fields
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || (
      alum.name.toLowerCase().includes(searchLower) ||
      alum.profession.toLowerCase().includes(searchLower) ||
      alum.college?.toLowerCase().includes(searchLower) ||
      alum.department?.toLowerCase().includes(searchLower) ||
      alum.bio?.toLowerCase().includes(searchLower)
    );
    
    // Filter matching
    const matchesBatch = !filters.batch || alum.batch.includes(filters.batch);
    const matchesProfession = !filters.profession || alum.profession.toLowerCase().includes(filters.profession.toLowerCase());
    const matchesDegreeLevel = !filters.degreeLevel || alum.degreeLevel === filters.degreeLevel;
    const matchesDegreeType = !filters.degreeType || alum.degree === filters.degreeType;
    const matchesDepartment = !filters.department || alum.department?.toLowerCase().includes(filters.department.toLowerCase());
    const matchesState = !filters.state || alum.state === filters.state;
    const matchesDistrict = !filters.district || alum.district === filters.district;
    const matchesCollege = !filters.college || alum.college === filters.college;
    const matchesGlobalSearch = !filters.search || (
      alum.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      alum.college?.toLowerCase().includes(filters.search.toLowerCase()) ||
      alum.department?.toLowerCase().includes(filters.search.toLowerCase())
    );
    
    return matchesSearch && matchesBatch && matchesProfession && 
           matchesDegreeLevel && matchesDegreeType && matchesDepartment && 
           matchesState && matchesDistrict && matchesCollege && matchesGlobalSearch;
  });

  return (
    <div className="w-full">
      {/* Results Header */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Alumni Found: <span className="text-blue-600">{filteredAlumni.length}</span>
        </h2>
        {filteredAlumni.length > 0 && (
          <div className="text-sm text-gray-600">
            Showing {filteredAlumni.length} of {alumni.length} alumni
          </div>
        )}
      </div>

      {filteredAlumni.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAlumni.map((alum, index) => (
            <motion.div
              key={alum.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl mr-4">
                    {alum.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">{alum.name}</h3>
                    <p className="text-blue-600 font-medium">{alum.profession}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <i className="fas fa-graduation-cap mr-2 text-blue-500 w-4"></i>
                    <span>{alum.batch}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-university mr-2 text-green-500 w-4"></i>
                    <span className="truncate">{alum.college}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-book mr-2 text-purple-500 w-4"></i>
                    <span>{alum.department}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-certificate mr-2 text-orange-500 w-4"></i>
                    <span>{alum.degree} ({alum.degreeLevel})</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-map-marker-alt mr-2 text-red-500 w-4"></i>
                    <span>{alum.district}, {alum.state}</span>
                  </div>
                </div>

                {alum.bio && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                      {alum.bio}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex space-x-3">
                    {alum.socials?.map((social) => {
                      const icons = {
                        linkedin: 'fab fa-linkedin text-blue-600',
                        twitter: 'fab fa-twitter text-blue-400',
                        github: 'fab fa-github text-gray-800',
                        researchgate: 'fas fa-flask text-green-600',
                        behance: 'fab fa-behance text-purple-600'
                      };
                      return (
                        <a 
                          key={social.platform}
                          href={social.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:scale-110 transition-transform duration-200"
                          title={social.platform}
                        >
                          <i className={`${icons[social.platform] || 'fas fa-link'} text-xl`}></i>
                        </a>
                      );
                    })}
                  </div>
                  <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 transition-colors">
                    Connect
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-xl shadow-md"
        >
          <div className="mb-6">
            <i className="fas fa-search text-6xl text-gray-300"></i>
          </div>
          <h3 className="text-2xl font-bold text-gray-600 mb-2">No Alumni Found</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            No alumni match your current search criteria. Try adjusting your filters or search query.
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <p>💡 Try searching by:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-2 py-1 bg-gray-100 rounded">Name</span>
              <span className="px-2 py-1 bg-gray-100 rounded">College</span>
              <span className="px-2 py-1 bg-gray-100 rounded">Department</span>
              <span className="px-2 py-1 bg-gray-100 rounded">Profession</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AlumniGrid;