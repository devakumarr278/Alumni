import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AlumniCard from '../../components/AlumniCard';
import databaseService from '../../services/databaseService';
import webSocketService from '../../services/webSocketService';
import { getMockAlumniData } from '../../utils/mockData';
import { getRecommendationsWithDiversity, calculateMentorScore } from '../../utils/mentorMatching';
import { useStudent } from './StudentContext'; // Assuming this is in the same directory

const AlumniDirectory = ({ isStudentPortal = false }) => {
  console.log('Rendering AlumniDirectory component');

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    graduationYear: '',
    company: '',
    department: ''
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alumniData, setAlumniData] = useState([]);
  const [showMockData, setShowMockData] = useState(!isStudentPortal);
  const [followStatuses, setFollowStatuses] = useState({});
  
  // AI Mentorship states
  const [showAIMatches, setShowAIMatches] = useState(false);
  const [aiMatches, setAiMatches] = useState([]);
  const [isGeneratingMatches, setIsGeneratingMatches] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [selectedMentor, setSelectedMentor] = useState(null);
  
  // Get student context for AI matching
  const { studentData, addMentorshipRequest } = useStudent();

  // Helper function to calculate years of experience
  const calculateExperience = (graduationYear) => {
    if (!graduationYear) return 0;
    const currentYear = new Date().getFullYear();
    return Math.max(0, currentYear - graduationYear);
  };

  // Combine real and mock data
  const combinedAlumniData = useMemo(() => {
    let combined = [...alumniData];
    
    if (showMockData) {
      const mockData = getMockAlumniData();
      combined = [...combined, ...(mockData.data?.alumni || mockData)];
    }
    
    return combined;
  }, [alumniData, showMockData]);

  // Apply search and filters on combined data
  const filteredAlumni = useMemo(() => {
    let result = [...combinedAlumniData];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(alum => 
        alum.name.toLowerCase().includes(term) ||
        alum.major.toLowerCase().includes(term) ||
        alum.currentRole.toLowerCase().includes(term) ||
        alum.company.toLowerCase().includes(term) ||
        alum.department.toLowerCase().includes(term) ||
        alum.skills.some(skill => skill.toLowerCase().includes(term))
      );
    }
    
    if (filters.graduationYear) {
      result = result.filter(alum => alum.graduationYear.toString() === filters.graduationYear);
    }
    
    if (filters.company) {
      result = result.filter(alum => alum.company === filters.company);
    }
    
    if (filters.department) {
      result = result.filter(alum => alum.department === filters.department);
    }
    
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

  // Get alumni for display (regular or AI matches)
  const displayAlumni = showAIMatches ? aiMatches : filteredAlumni;

  // Pagination
  const totalPages = Math.ceil(displayAlumni.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAlumni = displayAlumni.slice(startIndex, startIndex + itemsPerPage);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, showAIMatches]);

  // Fetch real alumni data
  const fetchAlumniData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await databaseService.getAllAlumni({});
      
      if (response.success) {
        const transformedAlumni = response.data.alumni.map(alum => {
          const currentExperience = alum.experiences?.find(exp => exp.isCurrent) || 
                                   alum.experiences?.[0] || {};
          
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
            isVerified: true,
            yearsOfExperience: totalExperience,
            department: alum.department || 'N/A',
            linkedin: alum.linkedinProfile || '',
            email: alum.email || '',
            isMock: false,
            experiences: alum.experiences || [],
            // Additional fields for AI matching
            position: currentExperience.role || alum.currentPosition || 'N/A',
            experience: totalExperience,
            bio: alum.bio || '',
            mentorshipAreas: ['Career Guidance'],
            availability: true
          };
        });
        
        setAlumniData(transformedAlumni);
      } else {
        throw new Error(response.message || 'Failed to fetch alumni data');
      }
    } catch (err) {
      console.error('Error fetching alumni:', err);
      setError(err.message);
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
    if (data.type === 'follow_request_update' && data.data?.alumniId) {
      setFollowStatuses(prev => {
        const updated = { ...prev };
        if (data.data.status === 'approved') {
          updated[data.data.alumniId] = 'following';
        } else if (data.data.status === 'rejected') {
          updated[data.data.alumniId] = 'follow';
        }
        return updated;
      });
    }
  }, []);

  // Initialize WebSocket connection
  useEffect(() => {
    webSocketService.on('notification', handleFollowRequestUpdate);
    
    return () => {
      webSocketService.off('notification', handleFollowRequestUpdate);
    };
  }, [handleFollowRequestUpdate]);

  // Fetch alumni data on component mount
  useEffect(() => {
    fetchAlumniData();
    
    const interval = setInterval(() => {
      fetchAlumniData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Load follow statuses
  useEffect(() => {
    const loadFollowStatuses = async () => {
      try {
        const updatedStatuses = { ...followStatuses };
        let hasChanges = false;
        
        const alumniIds = combinedAlumniData.map(alum => alum.id);
        
        const batchSize = 5;
        for (let i = 0; i < alumniIds.length; i += batchSize) {
          const batch = alumniIds.slice(i, i + batchSize);
          
          for (const alumniId of batch) {
            try {
              const response = await databaseService.getFollowStatus(alumniId);
              if (response.success) {
                const status = response.data.isFollowing ? 'following' : 
                              response.data.hasRequested ? 'requested' : 'follow';
                
                if (updatedStatuses[alumniId] !== status) {
                  updatedStatuses[alumniId] = status;
                  hasChanges = true;
                }
              }
            } catch (error) {
              console.error(`Error fetching follow status for ${alumniId}:`, error);
            }
          }
          
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        if (hasChanges) {
          setFollowStatuses(updatedStatuses);
        }
      } catch (error) {
        console.error('Error loading follow statuses:', error);
      }
    };

    if (combinedAlumniData.length > 0) {
      loadFollowStatuses();
    }
  }, [combinedAlumniData]);

  // AI Mentorship Matching
  const generateAiMatches = async () => {
    if (!studentData?.profile) {
      alert('Please complete your student profile to use AI matching');
      return;
    }

    setIsGeneratingMatches(true);
    
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const studentProfile = {
        id: 'current_student',
        name: studentData.profile?.name || 'Student',
        skills: studentData.profile?.skills || [],
        graduationYear: parseInt(studentData.profile?.graduationYear) || new Date().getFullYear(),
        domain: studentData.profile?.domain || '',
        timeZone: studentData.profile?.timeZone || 'Asia/Kolkata',
        interests: studentData.profile?.interests || []
      };
      
      // Use combined alumni data for matching
      const availableMentors = combinedAlumniData.filter(alum => alum.availability !== false);
      
      const matches = getRecommendationsWithDiversity(studentProfile, availableMentors, {
        maxFromSameDomain: 2,
        prioritizeNewMentors: true
      });
      
      // Calculate scores for each match
      const scoredMatches = matches.map(mentor => {
        const scoreObj = calculateMentorScore(studentProfile, mentor);
        return {
          ...mentor,
          score: scoreObj.total,
          whyMatched: generateWhyMatched(studentProfile, mentor, scoreObj)
        };
      });
      
      setAiMatches(scoredMatches);
      setShowAIMatches(true);
    } catch (error) {
      console.error('Error generating AI matches:', error);
      alert('Failed to generate AI matches. Please try again.');
    } finally {
      setIsGeneratingMatches(false);
    }
  };

  // Generate "why matched" explanation
  const generateWhyMatched = (studentProfile, mentor, scoreObj) => {
    const reasons = [];
    
    if (scoreObj.domainMatch > 0) {
      reasons.push(`Domain match (${mentor.department})`);
    }
    
    if (scoreObj.skillMatch > 0) {
      const commonSkills = mentor.skills?.filter(skill => 
        studentProfile.skills?.some(s => s.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(s.toLowerCase()))
      );
      if (commonSkills.length > 0) {
        reasons.push(`${commonSkills.length} shared skills`);
      }
    }
    
    if (scoreObj.experienceMatch > 0) {
      reasons.push(`Relevant experience (${mentor.experience} years)`);
    }
    
    if (scoreObj.interestsMatch > 0 && studentProfile.interests?.length > 0) {
      reasons.push('Shared interests');
    }
    
    return reasons.length > 0 ? reasons.join(', ') : 'Potential match based on profile';
  };

  // Handle mentorship request
  const handleMentorRequest = (mentor) => {
    setSelectedMentor(mentor);
    setShowRequestModal(true);
  };

  const submitMentorRequest = () => {
    if (selectedMentor && requestMessage.trim()) {
      if (addMentorshipRequest) {
        addMentorshipRequest(selectedMentor.id, selectedMentor.name, requestMessage.trim());
      } else {
        // Fallback if context doesn't have addMentorshipRequest
        console.log('Mentorship request sent:', {
          mentorId: selectedMentor.id,
          mentorName: selectedMentor.name,
          message: requestMessage.trim()
        });
      }
      setShowRequestModal(false);
      setRequestMessage('');
      setSelectedMentor(null);
      alert('Mentorship request sent successfully!');
    }
  };

  // Check if a mentor has been requested
  const hasRequestedMentor = (mentorId) => {
    return studentData?.mentorship?.requests?.some?.(req => req.mentorId === mentorId) || false;
  };

  // Get filter options from combined data
  const graduationYears = useMemo(() => {
    const years = [...new Set(combinedAlumniData.map(alum => alum.graduationYear))];
    return years.filter(Boolean).sort((a, b) => b - a);
  }, [combinedAlumniData]);

  const companies = useMemo(() => {
    const companies = [...new Set(combinedAlumniData.map(alum => alum.company))];
    return companies.filter(Boolean).sort();
  }, [combinedAlumniData]);

  const departments = useMemo(() => {
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
      department: ''
    });
    setSortBy('name');
    setSortOrder('asc');
    setCurrentPage(1);
    setShowAIMatches(false);
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
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm || filters.graduationYear || filters.company || filters.department;

  // Get score color and label for AI matches
  const getScoreColor = (score) => {
    if (score >= 20) return 'bg-green-100 text-green-800';
    if (score >= 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getScoreLabel = (score) => {
    if (score >= 20) return 'Excellent Match';
    if (score >= 10) return 'Good Match';
    return 'Potential Match';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:flex">
        <div className="flex-1 p-6">
          <div className="container mx-auto px-4 py-8">
            {/* Header with AI Matching Button */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  {showAIMatches ? '🤖 AI Recommended Mentors' : 'Alumni Directory'}
                  {showAIMatches && (
                    <span className="text-sm text-gray-600 ml-2">
                      (AI-powered matches based on your profile)
                    </span>
                  )}
                </h1>
                
                {/* AI Matching Controls */}
                <div className="flex flex-wrap gap-3">
                  {isStudentPortal && studentData?.profile && (
                    <>
                      <button
                        onClick={generateAiMatches}
                        disabled={isGeneratingMatches}
                        className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                          showAIMatches 
                            ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                        } ${isGeneratingMatches ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {isGeneratingMatches ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Generating Matches...
                          </>
                        ) : (
                          <>
                            <span className="text-lg">🤖</span>
                            {showAIMatches ? 'Refresh AI Matches' : 'Find AI Mentors'}
                          </>
                        )}
                      </button>
                      
                      {showAIMatches && (
                        <button
                          onClick={() => setShowAIMatches(false)}
                          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium"
                        >
                          Back to All Alumni
                        </button>
                      )}
                    </>
                  )}
                  
                  {!showAIMatches && (
                    <button
                      onClick={fetchAlumniData}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </button>
                  )}
                </div>
              </div>

              {/* Profile Completeness Warning for AI Matching */}
              {isStudentPortal && !showAIMatches && studentData?.profile?.completeness < 70 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-yellow-800">
                        Complete Your Profile for Better AI Matching
                      </h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        Your profile is {studentData.profile.completeness}% complete. 
                        Add more skills and domain information to get better mentor recommendations.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search and Filter Section - Only show when not in AI mode */}
            {!showAIMatches && (
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
            )}

            {/* AI Matches Info Panel */}
            {showAIMatches && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-lg p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      🎯 Personalized AI Mentor Recommendations
                    </h3>
                    <p className="text-gray-700">
                      These mentors are matched based on your profile, skills, and career interests.
                    </p>
                    {aiMatches.length > 0 && (
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                          {aiMatches.filter(m => m.score >= 20).length} Excellent matches
                        </span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                          {aiMatches.filter(m => m.score >= 10 && m.score < 20).length} Good matches
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedDomain('')}
                      className={`px-3 py-1 rounded-md text-sm ${
                        selectedDomain === '' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      All
                    </button>
                    {['Software', 'Data Science', 'Design', 'Marketing', 'Finance'].map(domain => (
                      <button
                        key={domain}
                        onClick={() => setSelectedDomain(domain)}
                        className={`px-3 py-1 rounded-md text-sm ${
                          selectedDomain === domain 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {domain}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
                <p className="text-gray-600">
                  {showAIMatches ? 'Finding your perfect mentors...' : 'Loading alumni directory...'}
                </p>
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
                    {showAIMatches 
                      ? `Found ${aiMatches.length} AI-matched mentors` 
                      : `Found ${displayAlumni.length} alumni`}
                    {!showAIMatches && showMockData && (
                      <span className="text-sm text-gray-500 ml-2">
                        ({alumniData.length} real, {getMockAlumniData().data?.alumni?.length || getMockAlumniData().length} mock)
                      </span>
                    )}
                  </h2>
                </div>

                {displayAlumni.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {paginatedAlumni.map((alumni) => (
                        <div key={alumni.id} className="relative">
                          <AlumniCard
                            alumni={alumni}
                            onFollowStatusChange={handleFollowStatusChange}
                            followStatuses={followStatuses}
                          />
                          
                          {/* AI Match Score Badge */}
                          {showAIMatches && alumni.score !== undefined && (
                            <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(alumni.score)}`}>
                              {getScoreLabel(alumni.score)} ({alumni.score})
                            </div>
                          )}
                          
                          {/* Mentorship Request Button for AI Matches */}
                          {showAIMatches && isStudentPortal && (
                            <div className="mt-3">
                              <button
                                onClick={() => handleMentorRequest(alumni)}
                                disabled={hasRequestedMentor(alumni.id)}
                                className={`w-full px-4 py-2 rounded-md font-medium text-sm ${
                                  hasRequestedMentor(alumni.id)
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                                }`}
                              >
                                {hasRequestedMentor(alumni.id)
                                  ? '✓ Request Sent'
                                  : 'Request Mentorship'
                                }
                              </button>
                              
                              {/* Why Matched Explanation */}
                              {alumni.whyMatched && (
                                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                                  <span className="font-medium">Why matched:</span> {alumni.whyMatched}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
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
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {showAIMatches ? 'No AI matches found' : 'No alumni found'}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {showAIMatches 
                        ? "Try completing your profile with more skills and domain information for better matches."
                        : hasActiveFilters 
                          ? "No alumni match your current filters. Try adjusting your search criteria." 
                          : "There are currently no alumni in the directory."}
                    </p>
                    {showAIMatches ? (
                      <button
                        onClick={() => setShowAIMatches(false)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Browse All Alumni
                      </button>
                    ) : hasActiveFilters && (
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
      
      {/* Mentorship Request Modal */}
      {showRequestModal && selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2">🤖</span>
                Request Mentorship from {selectedMentor.name}
              </h3>
              
              <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mr-3 flex items-center justify-center text-white font-bold">
                    {selectedMentor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-medium">{selectedMentor.name}</h4>
                    <p className="text-sm text-gray-600">{selectedMentor.position} at {selectedMentor.company}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  AI Match Score: <span className="font-medium">{selectedMentor.score || 0}/30</span>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message (required)
                </label>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  rows="4"
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Introduce yourself and explain what kind of mentorship you're looking for..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowRequestModal(false);
                    setRequestMessage('');
                    setSelectedMentor(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitMentorRequest}
                  disabled={!requestMessage.trim()}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniDirectory;