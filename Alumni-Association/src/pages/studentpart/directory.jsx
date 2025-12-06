import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AlumniCard from '../../components/AlumniCard';
import databaseService from '../../services/databaseService';
import webSocketService from '../../services/webSocketService';
import { getMockAlumniData } from '../../utils/mockData';

const AlumniDirectory = ({ isStudentPortal = false }) => {
  console.log('Rendering AlumniDirectory component');

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    graduationYear: '',
    company: '',
    department: '' // Changed from domain to department to match backend
  });
  const [sortBy, setSortBy] = useState('name'); // name, year, company
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alumniData, setAlumniData] = useState([]);
  // For students, default to not showing mock data
  const [showMockData, setShowMockData] = useState(!isStudentPortal); // State to toggle mock data
  const [followStatuses, setFollowStatuses] = useState({}); // Track follow statuses

  // Helper function to calculate years of experience (kept for backward compatibility)
  const calculateExperience = (graduationYear) => {
    if (!graduationYear) return 0;
    const currentYear = new Date().getFullYear();
    return Math.max(0, currentYear - graduationYear);
  };

  // Combine real and mock data
  const combinedAlumniData = useMemo(() => {
    let combined = [...alumniData];
    
    // Add mock data if showMockData is true
    if (showMockData) {
      const mockData = getMockAlumniData();
      combined = [...combined, ...(mockData.data?.alumni || mockData)];
    }
    
    return combined;
  }, [alumniData, showMockData]);

  // Apply search and filters on combined data
  const filteredAlumni = useMemo(() => {
    let result = [...combinedAlumniData];
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(alum => 
        alum.name.toLowerCase().includes(term) ||
        alum.major.toLowerCase().includes(term) ||
        alum.currentRole.toLowerCase().includes(term) ||
        alum.company.toLowerCase().includes(term) ||
        alum.department.toLowerCase().includes(term) || // Changed from domain to department
        alum.skills.some(skill => skill.toLowerCase().includes(term))
      );
    }
    
    // Apply filters
    if (filters.graduationYear) {
      result = result.filter(alum => alum.graduationYear.toString() === filters.graduationYear);
    }
    
    if (filters.company) {
      result = result.filter(alum => alum.company === filters.company);
    }
    
    if (filters.department) { // Changed from domain to department
      result = result.filter(alum => alum.department === filters.department);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'year':
          aValue = a.graduationYear;
          bValue = b.graduationYear;
          break;
        case 'company':
          aValue = a.company.toLowerCase();
          bValue = b.company.toLowerCase();
          break;
        case 'name':
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return result;
  }, [searchTerm, filters, sortBy, sortOrder, combinedAlumniData]);

  // Pagination
  const totalPages = Math.ceil(filteredAlumni.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAlumni = filteredAlumni.slice(startIndex, startIndex + itemsPerPage);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  // Fetch real alumni data
  const fetchAlumniData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch alumni from the backend
      const response = await databaseService.getAllAlumni({
        // Add any default filters here if needed
      });
      
      if (response.success) {
        // Transform backend data to match the expected format
        const transformedAlumni = response.data.alumni.map(alum => {
          // Find current experience (where isCurrent is true)
          const currentExperience = alum.experiences?.find(exp => exp.isCurrent) || 
                                   // If no current experience, use the first one
                                   alum.experiences?.[0] || 
                                   // Fallback to the top-level data
                                   {};
          
          // Calculate total years of experience
          let totalExperience = 0;
          if (alum.experiences && Array.isArray(alum.experiences)) {
            totalExperience = alum.experiences.reduce((sum, exp) => {
              return sum + (parseInt(exp.experience) || 0);
            }, 0);
          }
          
          return {
            id: alum._id,
            name: `${alum.firstName} ${alum.lastName}`,
            graduationYear: alum.graduationYear,
            major: alum.department || 'N/A',
            currentRole: currentExperience.role || alum.currentPosition || 'N/A',
            company: currentExperience.company || alum.company || 'N/A',
            location: currentExperience.location || alum.location || 'N/A',
            skills: alum.skills || [],
            profileImage: alum.profilePicture || null,
            isVerified: true, // Assuming all approved alumni are verified
            yearsOfExperience: totalExperience, // Use calculated total experience
            department: alum.department || 'N/A', // Changed from domain to department
            linkedin: alum.linkedinProfile || '',
            email: alum.email || '',
            isMock: false, // Mark as real data
            experiences: alum.experiences || [] // Include experiences for profile modal
          };
        });
        
        setAlumniData(transformedAlumni);
      } else {
        throw new Error(response.message || 'Failed to fetch alumni data');
      }
    } catch (err) {
      console.error('Error fetching alumni:', err);
      setError(err.message);
      // Only fallback to mock data if not in student portal
      if (!isStudentPortal) {
        const mockData = getMockAlumniData();
        setAlumniData(mockData.data?.alumni || mockData);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle WebSocket messages for follow request updates
  const handleFollowRequestUpdate = useCallback((data) => {
    console.log('Received follow request update in AlumniDirectory:', data);
    if (data.type === 'follow_request_update') {
      // Update the follow status for the specific alumni
      setFollowStatuses(prev => {
        const updated = { ...prev };
        // The alumniId is in the data, and the status tells us what happened
        if (data.data && data.data.alumniId) {
          if (data.data.status === 'approved') {
            updated[data.data.alumniId] = 'following';
            console.log(`Updated follow status for ${data.data.alumniId} to following`);
          } else if (data.data.status === 'rejected') {
            updated[data.data.alumniId] = 'follow';
            console.log(`Updated follow status for ${data.data.alumniId} to follow`);
          }
        } else {
          console.log('Missing alumniId in follow request update data:', data);
        }
        return updated;
      });
    } else {
      console.log('Received non-follow-request-update message:', data);
    }
  }, []);

  // Initialize WebSocket connection and listeners
  useEffect(() => {
    console.log('Adding WebSocket listener in AlumniDirectory');
    // Listen for follow request updates
    webSocketService.on('notification', handleFollowRequestUpdate);
    
    return () => {
      console.log('Removing WebSocket listener in AlumniDirectory');
      webSocketService.off('notification', handleFollowRequestUpdate);
    };
  }, [handleFollowRequestUpdate]);

  // Fetch alumni data on component mount
  useEffect(() => {
    fetchAlumniData();
    
    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(() => {
      fetchAlumniData();
    }, 30000); // Poll every 30 seconds
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Load follow statuses from API on component mount
  useEffect(() => {
    const loadFollowStatuses = async () => {
      try {
        // Create a copy of current followStatuses
        const updatedStatuses = { ...followStatuses };
        let hasChanges = false;
        
        // For each alumni in the current view, fetch their follow status
        const alumniIds = combinedAlumniData.map(alum => alum.id);
        
        // We'll fetch statuses in batches to avoid overwhelming the API
        const batchSize = 5;
        for (let i = 0; i < alumniIds.length; i += batchSize) {
          const batch = alumniIds.slice(i, i + batchSize);
          
          // Fetch status for each alumni in the batch
          for (const alumniId of batch) {
            try {
              const response = await databaseService.getFollowStatus(alumniId);
              if (response.success) {
                const status = response.data.isFollowing ? 'following' : 
                              response.data.hasRequested ? 'requested' : 'follow';
                
                // Only update if status has changed
                if (updatedStatuses[alumniId] !== status) {
                  updatedStatuses[alumniId] = status;
                  hasChanges = true;
                }
              }
            } catch (error) {
              console.error(`Error fetching follow status for ${alumniId}:`, error);
              // Keep existing status if API call fails
            }
          }
          
          // Add a small delay between batches to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Update state only if there were changes
        if (hasChanges) {
          setFollowStatuses(updatedStatuses);
        }
      } catch (error) {
        console.error('Error loading follow statuses:', error);
      }
    };

    // Only load if we have alumni data
    if (combinedAlumniData.length > 0) {
      loadFollowStatuses();
    }
  }, [combinedAlumniData]);

  // Get filter options from combined data
  const graduationYears = useMemo(() => {
    const years = [...new Set(combinedAlumniData.map(alum => alum.graduationYear))];
    return years.filter(Boolean).sort((a, b) => b - a); // Sort in descending order
  }, [combinedAlumniData]);

  const companies = useMemo(() => {
    const companies = [...new Set(combinedAlumniData.map(alum => alum.company))];
    return companies.filter(Boolean).sort();
  }, [combinedAlumniData]);

  const departments = useMemo(() => { // Changed from domains to departments
    const depts = [...new Set(combinedAlumniData.map(alum => alum.department))];
    return depts.filter(Boolean).sort();
  }, [combinedAlumniData]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setFilters({
      graduationYear: '',
      company: '',
      department: '' // Changed from domain to department
    });
    setSortBy('name');
    setSortOrder('asc');
    setCurrentPage(1);
  };

  // Toggle mock data visibility
  const toggleMockData = () => {
    setShowMockData(!showMockData);
  };

  // Handle follow status change
  const handleFollowStatusChange = (alumniId, status) => {
    setFollowStatuses(prev => ({
      ...prev,
      [alumniId]: status
    }));
    
    // Save to localStorage
    const followData = JSON.parse(localStorage.getItem('followData') || '{}');
    if (status === 'follow') {
      // If unfollowing, remove the entry
      delete followData[alumniId];
    } else {
      // Otherwise, update the status
      followData[alumniId] = status;
    }
    localStorage.setItem('followData', JSON.stringify(followData));
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm || filters.graduationYear || filters.company || filters.department;

  // Render the directory content for both student portal and regular view
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:flex">
        {/* Removed StudentNavigation component as it should be part of the shared layout */}
        
        <div className="flex-1 p-6">
          <div className="container mx-auto px-4 py-8">
            {/* Header - simplified for both views */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Alumni Directory</h1>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name, skills, company, department, or degree..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                  <select
                    value={filters.graduationYear}
                    onChange={(e) => handleFilterChange('graduationYear', e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">All Years</option>
                    {graduationYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <select
                    value={filters.company}
                    onChange={(e) => handleFilterChange('company', e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">All Companies</option>
                    {companies.map(company => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={filters.department}
                    onChange={(e) => handleFilterChange('department', e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={clearAllFilters}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
                <p className="text-gray-600">Loading alumni directory...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="text-red-500 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Error loading alumni</h3>
                <p className="text-gray-500 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Alumni Grid */}
            {!loading && !error && (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Found {filteredAlumni.length} alumni
                    {showMockData && (
                      <span className="text-sm text-gray-500 ml-2">
                        ({alumniData.length} real, {getMockAlumniData().data?.alumni?.length || getMockAlumniData().length} mock)
                      </span>
                    )}
                  </h2>
                  <button
                    onClick={fetchAlumniData}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>

                {filteredAlumni.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {paginatedAlumni.map((alumni) => (
                        <AlumniCard
                          key={alumni.id}
                          alumni={alumni}
                          onFollowStatusChange={handleFollowStatusChange}
                          followStatuses={followStatuses}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-8 flex justify-center">
                        <nav className="flex items-center space-x-2">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded-md ${
                              currentPage === 1 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                            }`}
                          >
                            Previous
                          </button>
                          
                          {[...Array(totalPages)].map((_, i) => {
                            const page = i + 1;
                            return (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 rounded-md ${
                                  currentPage === page
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                }`}
                              >
                                {page}
                              </button>
                            );
                          })}
                          
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded-md ${
                              currentPage === totalPages 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                            }`}
                          >
                            Next
                          </button>
                        </nav>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                    <div className="text-gray-400 mb-4">
                      <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.08-2.33.184-.548.45-1.077.79-1.584C7.758 9.542 9.78 9 12 9s4.242.542 5.29 1.404c.34.507.606 1.036.79 1.584a7.962 7.962 0 01-6.08 2.33z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No alumni found</h3>
                    <p className="text-gray-500 mb-6">
                      {hasActiveFilters 
                        ? "No alumni match your current filters. Try adjusting your search criteria." 
                        : "There are currently no alumni in the directory."}
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={clearAllFilters}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniDirectory;