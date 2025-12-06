﻿import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ------------------ Dataset ------------------
const locationData = {
  TamilNadu: {
    Chennai: [
      { collegeName: "IIT Madras", collegeCode: "TN1001", degree: ["B.Tech","M.Tech"], departments: ["Computer Science","ECE","EEE","AI & ML"] },
      { collegeName: "Anna University", collegeCode: "TN1002", degree: ["B.Tech","M.Tech"], departments: ["CSE","ECE","Mechanical"] },
    ],
    Coimbatore: [
      { collegeName: "SKCET", collegeCode: "TN2001", degree: ["B.E"], departments: ["CSE","IT","EEE","AI & ML"] },
      { collegeName: "PSG Tech", collegeCode: "TN2002", degree: ["B.E","M.E"], departments: ["CSE","ECE","EEE"] },
    ],
  },
  Punjab: {
    Ludhiana: [
      { collegeName: "Punjab Engineering College", collegeCode: "PB1001", degree: ["B.Tech","M.Tech"], departments: ["CSE","ECE","Mechanical"] },
    ],
  },
  Karnataka: {
    Bangalore: [
      { collegeName: "IISc Bangalore", collegeCode: "KA1001", degree: ["B.Sc","M.Sc"], departments: ["Physics","Mathematics","Chemistry"] },
      { collegeName: "RV College", collegeCode: "KA1002", degree: ["B.E","M.Tech"], departments: ["CSE","ECE","EEE"] },
    ],
  },
};

// Degree Levels and Types
const degreeLevels = ["UG", "PG", "PhD"];
const degreeTypes = {
  UG: ["B.E", "B.Tech", "B.Sc", "B.Com", "BA", "BCA"],
  PG: ["M.E", "M.Tech", "MBA", "MCA", "M.Sc", "MA"],
  PhD: ["PhD Engineering", "PhD Science", "PhD Management"],
};

// Departments (50+)
const departments = [
  "Computer Science", "Information Technology", "Electronics & Communication", "Electrical & Electronics",
  "Mechanical Engineering", "Civil Engineering", "Aerospace Engineering", "Biotechnology", "AI & ML",
  "Data Science", "Robotics", "Cybersecurity", "Applied Physics", "Applied Mathematics", "Chemistry",
  "Biochemistry", "Industrial Engineering", "Automation", "Embedded Systems", "Instrumentation",
  "Environmental Engineering", "Material Science", "Nanotechnology", "Renewable Energy", "Automobile",
  "Telecommunication", "Software Engineering", "Cloud Computing", "Blockchain", "IoT",
  "Artificial Intelligence", "Machine Learning", "Deep Learning", "Natural Language Processing",
  "Data Analytics", "Business Analytics", "Finance", "Economics", "Commerce",
  "Marketing", "Management", "Human Resource", "Law", "Education",
  "Arts", "Physics", "Mathematics", "Chemistry", "Bioinformatics", "Pharmaceuticals"
];

// Professions based on degree
const professionMap = {
  UG: ["Software Engineer", "Data Analyst", "Civil Engineer", "Mechanical Engineer", "Electrical Engineer"],
  PG: ["Project Manager", "Research Scientist", "Data Scientist", "Business Analyst"],
  PhD: ["Professor", "Research Scientist", "Consultant"]
};

const AlumniFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    batch: "",
    degreeLevel: "",
    degreeType: "",
    department: "",
    profession: "",
    state: "",
    district: "",
    college: "",
    search: "",
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const batchYears = useMemo(() => Array.from({ length: 25 }, (_, i) => 2024 - i), []);

  const filteredDegreeTypes = useMemo(() => 
    filters.degreeLevel ? degreeTypes[filters.degreeLevel] : [], 
    [filters.degreeLevel]
  );

  const filteredProfessions = useMemo(() => 
    filters.degreeLevel ? professionMap[filters.degreeLevel] : [], 
    [filters.degreeLevel]
  );

  const departmentSuggestions = useMemo(() => 
    filters.department.length >= 2
      ? departments.filter((d) => 
          d.toLowerCase().includes(filters.department.toLowerCase())
        ).slice(0, 5)
      : [], 
    [filters.department]
  );

  const filteredColleges = useMemo(() => {
    if (!filters.state || !filters.district) return [];
    return locationData[filters.state][filters.district].filter(c => {
      const matchDegree = !filters.degreeType || c.degree.includes(filters.degreeType);
      const matchDept = !filters.department || 
        c.departments.some(dept => dept.toLowerCase().includes(filters.department.toLowerCase()));
      const matchSearch = !filters.search || 
        c.collegeName.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.collegeCode.toLowerCase().includes(filters.search.toLowerCase());
      return matchDegree && matchDept && matchSearch;
    });
  }, [filters.state, filters.district, filters.degreeType, filters.department, filters.search]);

  // Count active filters
  const countActiveFilters = useCallback((filterObj) => {
    return Object.values(filterObj).filter(value => value !== "").length;
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };

    // Smart reset of dependent fields
    if (name === "degreeLevel") {
      newFilters.degreeType = "";
      newFilters.profession = "";
    }
    if (name === "state") {
      newFilters.district = "";
      newFilters.college = "";
    }
    if (name === "district") {
      newFilters.college = "";
    }

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

  const handleDepartmentSelect = useCallback((department) => {
    const newFilters = { ...filters, department };
    setFilters(newFilters);
    setActiveFiltersCount(countActiveFilters(newFilters));
    if (onFilter) onFilter(newFilters);
  }, [filters, onFilter, countActiveFilters]);

  const resetFilters = useCallback(() => {
    const emptyFilters = {
      batch: "",
      degreeLevel: "",
      degreeType: "",
      department: "",
      profession: "",
      state: "",
      district: "",
      college: "",
      search: "",
    };
    setFilters(emptyFilters);
    setActiveFiltersCount(0);
    if (onFilter) onFilter(emptyFilters);
  }, [onFilter]);

  const removeFilter = useCallback((filterName) => {
    const newFilters = { ...filters, [filterName]: "" };
    
    // Handle dependent field resets
    if (filterName === "degreeLevel") {
      newFilters.degreeType = "";
      newFilters.profession = "";
    }
    if (filterName === "state") {
      newFilters.district = "";
      newFilters.college = "";
    }
    if (filterName === "district") {
      newFilters.college = "";
    }

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
        if (key === "batch") displayValue = `Class of ${value}`;
        if (key === "college") displayValue = value.split(" (")[0]; // Remove college code
        active.push({ key, value: displayValue });
      }
    });
    return active;
  };

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

        {/* Active Filters Display */}
        <AnimatePresence>
          {activeFiltersCount > 0 && (
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
          )}
        </AnimatePresence>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Search */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔍 Quick Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleChange}
                    placeholder="Search by college name, code, or keyword..."
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Batch Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🎓 Graduation Year</label>
                <select 
                  name="batch" 
                  value={filters.batch} 
                  onChange={handleChange} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">All Years</option>
                  {batchYears.map((y) => (
                    <option key={y} value={y}>Class of {y}</option>
                  ))}
                </select>
              </div>

              {/* Degree Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">📚 Degree Level</label>
                <select 
                  name="degreeLevel" 
                  value={filters.degreeLevel} 
                  onChange={handleChange} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">All Levels</option>
                  {degreeLevels.map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>

              {/* Degree Type */}
              {filteredDegreeTypes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">🎖️ Degree Type</label>
                  <select 
                    name="degreeType" 
                    value={filters.degreeType} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">All Types</option>
                    {filteredDegreeTypes.map((dt) => (
                      <option key={dt} value={dt}>{dt}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Profession */}
              {filteredProfessions.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">💼 Profession</label>
                  <select 
                    name="profession" 
                    value={filters.profession} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">All Professions</option>
                    {filteredProfessions.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Department */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">🏛️ Department</label>
                <input
                  type="text"
                  name="department"
                  value={filters.department}
                  onChange={handleChange}
                  placeholder="Type to search departments..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <AnimatePresence>
                  {departmentSuggestions.length > 0 && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto mt-1"
                    >
                      {departmentSuggestions.map((d) => (
                        <li
                          key={d}
                          onClick={() => handleDepartmentSelect(d)}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          {d}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🗺️ State</label>
                <select 
                  name="state" 
                  value={filters.state} 
                  onChange={handleChange} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select State</option>
                  {Object.keys(locationData).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* District */}
              {filters.state && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">🏙️ District</label>
                  <select 
                    name="district" 
                    value={filters.district} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select District</option>
                    {Object.keys(locationData[filters.state]).map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </motion.div>
              )}

              {/* College */}
              {filters.district && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🏫 College {filteredColleges.length > 0 && `(${filteredColleges.length} found)`}
                  </label>
                  <select 
                    name="college" 
                    value={filters.college} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select College</option>
                    {filteredColleges.map((c) => (
                      <option key={c.collegeCode} value={c.collegeName}>
                        {c.collegeName} ({c.collegeCode})
                      </option>
                    ))}
                  </select>
                </motion.div>
              )}

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

export default AlumniFilter;
