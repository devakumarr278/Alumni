import React, { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RealAlumniFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    graduationYear: "",
    department: "",
    location: "",
    company: "",
    search: "",
  });

  const [filterOptions, setFilterOptions] = useState({
    departments: [],
    graduationYears: [],
    locations: [],
    companies: []
  });

  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Fetch filter options from backend
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5003/api'}/alumni/filters`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch filter options');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setFilterOptions(data.data);
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  // Count active filters
  const countActiveFilters = useCallback((filterObj) => {
    return Object.values(filterObj).filter(value => value !== "").length;
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };

    setFilters(newFilters);
    setActiveFiltersCount(countActiveFilters(newFilters));
    
    // Debounced filter update for search
    if (name === "search") {
      clearTimeout(window.searchTimeout);
      window.searchTimeout = setTimeout(() => {
        if (onFilter) onFilter(newFilters);
      }, 300);
    } else {
      if (onFilter) onFilter(newFilters);
    }
  }, [filters, onFilter, countActiveFilters]);

  const resetFilters = useCallback(() => {
    const emptyFilters = {
      graduationYear: "",
      department: "",
      location: "",
      company: "",
      search: "",
    };
    setFilters(emptyFilters);
    setActiveFiltersCount(0);
    if (onFilter) onFilter(emptyFilters);
  }, [onFilter]);

  const removeFilter = useCallback((filterName) => {
    const newFilters = { ...filters, [filterName]: "" };
    
    setFilters(newFilters);
    setActiveFiltersCount(countActiveFilters(newFilters));
    if (onFilter) onFilter(newFilters);
  }, [filters, onFilter, countActiveFilters]);

  // Active filters display
  const getActiveFilters = () => {
    const active = [];
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        let displayValue = value;
        if (key === "graduationYear") displayValue = `Class of ${value}`;
        active.push({ key, value: displayValue });
      }
    });
    return active;
  };

  if (loading) {
    return (
      <motion.div
        className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h3 className="text-xl font-bold text-gray-800">Filter Alumni</h3>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Filter Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-xl font-bold text-gray-800">Filter Alumni</h3>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
                {activeFiltersCount} active
              </span>
            )}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <span>{isExpanded ? "Hide" : "Show"} Filters</span>
            <motion.svg
              className="w-4 h-4"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>
        </div>

        {/* Active Filters Display */}{
          activeFiltersCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div className="flex flex-wrap gap-2">
                {getActiveFilters().map(({ key, value }) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                  >
                    <span>{value}</span>
                    <button
                      onClick={() => removeFilter(key)}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </motion.div>
                ))}
                <button
                  onClick={resetFilters}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 text-sm rounded-full transition-colors"
                >
                  Clear all
                </button>
              </div>
            </motion.div>
          )
        }
      </div>

      {/* Filter Form */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔍 Quick Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleChange}
                    placeholder="Search by name, company, or keyword..."
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Graduation Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🎓 Graduation Year</label>
                <select 
                  name="graduationYear" 
                  value={filters.graduationYear} 
                  onChange={handleChange} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">All Years</option>
                  {filterOptions.graduationYears.map((year) => (
                    <option key={year} value={year}>Class of {year}</option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🏛️ Department</label>
                <select 
                  name="department" 
                  value={filters.department} 
                  onChange={handleChange} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">All Departments</option>
                  {filterOptions.departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🗺️ Location</label>
                <select 
                  name="location" 
                  value={filters.location} 
                  onChange={handleChange} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">All Locations</option>
                  {filterOptions.locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🏢 Company</label>
                <select 
                  name="company" 
                  value={filters.company} 
                  onChange={handleChange} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">All Companies</option>
                  {filterOptions.companies.map((comp) => (
                    <option key={comp} value={comp}>{comp}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={resetFilters}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset All
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RealAlumniFilter;