import React, { useState, useEffect } from 'react';
// Removed StudentNavigation import as it's handled by the shared layout
import { useStudent } from './StudentContext';
import { matchMentors, getRecommendationsWithDiversity, calculateMentorScore } from './utils/mentorMatching';
import databaseService from '../../services/databaseService';
import AlumniProfileModalMentorship from '../../components/AlumniProfileModalMentorship'; // Use the new modal component

const StudentMentorship = () => {
  const { studentData, addMentorshipRequest } = useStudent();
  const [recommendedMentors, setRecommendedMentors] = useState([]);
  const [allMentors, setAllMentors] = useState([]); // State for all real alumni
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // Add error state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [showAllMentors, setShowAllMentors] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false); // Add state for profile modal
  const [selectedAlumni, setSelectedAlumni] = useState(null); // Add state for selected alumni
  const [followStatuses, setFollowStatuses] = useState({}); // Track follow statuses

  // Fetch real alumni data
  useEffect(() => {
    const fetchRealAlumniData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await databaseService.getAllAlumni();
        if (response.success) {
          // Transform backend data to match the expected format
          const transformedAlumni = response.data.alumni.map(alum => ({
            id: alum._id,
            name: `${alum.firstName} ${alum.lastName}`,
            email: alum.email || '',
            skills: alum.skills || [],
            graduationYear: alum.graduationYear || new Date().getFullYear(),
            domain: alum.department || 'General', // Use department as domain
            company: alum.company || 'Not specified',
            position: alum.currentPosition || 'Not specified',
            availability: true, // Assume all approved alumni are available
            timeZone: 'Asia/Kolkata', // Default timezone
            menteeCount: 0, // This would need to come from the backend
            bio: alum.bio || 'No bio available',
            experience: alum.yearsOfExperience || 0,
            location: alum.location || 'Not specified',
            linkedIn: alum.linkedinProfile || '',
            specializations: alum.skills || [],
            mentorshipAreas: ['Career Guidance'], // Default value
            isMock: false // Mark as real data
          }));
          
          setAllMentors(transformedAlumni);
        } else {
          throw new Error(response.message || 'Failed to fetch alumni data');
        }
      } catch (error) {
        console.error('Error fetching real alumni data:', error);
        setError(error.message || 'Failed to load mentors. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealAlumniData();
  }, []);

  // Fetch follow statuses for all alumni
  useEffect(() => {
    const fetchFollowStatuses = async () => {
      if (allMentors.length > 0) {
        const newFollowStatuses = {};
        for (const alumni of allMentors) {
          try {
            const response = await databaseService.getFollowStatus(alumni.id);
            if (response.success) {
              const status = response.data.isFollowing ? 'following' : 
                            response.data.hasRequested ? 'requested' : 'follow';
              newFollowStatuses[alumni.id] = status;
            }
          } catch (error) {
            console.error('Error fetching follow status for', alumni.id, error);
            // Default to 'follow' status if API fails
            newFollowStatuses[alumni.id] = 'follow';
          }
        }
        setFollowStatuses(newFollowStatuses);
      }
    };

    fetchFollowStatuses();
  }, [allMentors]);

  // Safety check - ensure studentData is properly initialized
  // Moved useEffect before any conditional rendering to fix the hook order issue
  useEffect(() => {
    // Early return if studentData is not properly initialized
    if (!studentData || !studentData.profile || !studentData.mentorship) {
      return;
    }

    // Generate AI recommendations when component mounts or profile changes
    if (studentData.profile?.skills?.length > 0 && studentData.profile?.domain && allMentors.length > 0) {
      generateRecommendations();
    }
  }, [studentData, allMentors]);

  // Helper function to safely check if a mentor request exists
  const hasRequestedMentor = (mentorId) => {
    return studentData?.mentorship?.requests?.some?.(req => req.mentorId === mentorId) || false;
  };

  const generateRecommendations = async () => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const studentProfile = {
        id: 'current_student',
        name: studentData.profile?.name || 'Student',
        skills: studentData.profile?.skills || [],
        graduationYear: parseInt(studentData.profile?.graduationYear) || new Date().getFullYear(),
        domain: studentData.profile?.domain || '',
        timeZone: studentData.profile?.timeZone || 'Asia/Kolkata'
      };
      
      const matches = getRecommendationsWithDiversity(studentProfile, allMentors, {
        maxFromSameDomain: 2,
        prioritizeNewMentors: true
      });
      
      setRecommendedMentors(matches);
      // Remove the call to updateMentorshipMatches as it doesn't exist
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setError(error.message || 'Failed to generate recommendations. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMentorRequest = (mentor) => {
    setSelectedMentor(mentor);
    setShowRequestModal(true);
  };

  const submitMentorRequest = () => {
    if (selectedMentor && requestMessage.trim()) {
      addMentorshipRequest(selectedMentor.id, selectedMentor.name, requestMessage.trim());
      setShowRequestModal(false);
      setRequestMessage('');
      setSelectedMentor(null);
    }
  };

  // Add function to handle opening the profile modal
  const handleViewProfile = (alumni) => {
    setSelectedAlumni(alumni);
    setShowProfileModal(true);
  };

  const getScoreColor = (score) => {
    if (score >= 20) return 'text-green-600 bg-green-100';
    if (score >= 10) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getScoreLabel = (score) => {
    if (score >= 20) return 'Excellent Match';
    if (score >= 10) return 'Good Match';
    return 'Potential Match';
  };

  // Function to calculate score for a single mentor
  const calculateSingleMentorScore = (mentor) => {
    if (!studentData?.profile) return 0;
    
    const studentProfile = {
      id: 'current_student',
      name: studentData.profile?.name || 'Student',
      skills: studentData.profile?.skills || [],
      graduationYear: parseInt(studentData.profile?.graduationYear) || new Date().getFullYear(),
      domain: studentData.profile?.domain || '',
      timeZone: studentData.profile?.timeZone || 'Asia/Kolkata'
    };
    
    const scoreObj = calculateMentorScore(studentProfile, mentor);
    return scoreObj.total;
  };

  const filteredMentors = showAllMentors 
    ? allMentors.filter(mentor => 
        mentor.availability && 
        (searchTerm === '' || mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         mentor.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))) &&
        (selectedDomain === '' || mentor.domain === selectedDomain)
      ).map(mentor => {
        // Add score to each mentor when browsing all
        const score = calculateSingleMentorScore(mentor);
        return { ...mentor, score };
      })
    : recommendedMentors;

  // Early return for loading state
  if (!studentData || !studentData.profile || !studentData.mentorship) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Removed StudentNavigation as it's handled by the shared layout */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading mentorship data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Removed StudentNavigation as it's handled by the shared layout */}
      
      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="pt-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">AI-Powered Mentorship Matching</h1>
          </div>

          {/* Profile Completeness Check */}
          {studentData.profile?.completeness < 70 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Complete Your Profile for Better Matches</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Add your skills, domain, and interests to get personalized mentor recommendations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error Loading Mentors</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 text-sm"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* AI Recommendations */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold flex items-center">
                      <span className="text-2xl mr-2">🤖</span>
                      AI Recommended Mentors
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Personalized matches based on your profile and career goals
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {studentData.profile?.completeness >= 70 && allMentors.length > 0 && (
                      <button
                        onClick={generateRecommendations}
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                      >
                        {isLoading ? 'Matching...' : 'Refresh Matches'}
                      </button>
                    )}
                    <button
                      onClick={() => setShowAllMentors(!showAllMentors)}
                      className={`px-4 py-2 rounded-md text-sm ${
                        showAllMentors 
                          ? 'bg-gray-600 text-white hover:bg-gray-700' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {showAllMentors ? 'Show AI Matches' : 'Browse All'}
                    </button>
                  </div>
                </div>

                {/* Search and Filter (only when browsing all) */}
                {showAllMentors && (
                  <div className="mb-6 space-y-4">
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        placeholder="Search by name or skills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <select
                        value={selectedDomain}
                        onChange={(e) => setSelectedDomain(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">All Domains</option>
                        <option value="Software">Software</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Finance">Finance</option>
                        <option value="Consulting">Consulting</option>
                        <option value="Product">Product</option>
                        <option value="Security">Security</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {isLoading && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Finding your perfect mentors...</p>
                  </div>
                )}

                {/* Mentor Cards */}
                {!isLoading && !error && (
                  <div className="space-y-6">
                    {filteredMentors.length === 0 && studentData.profile?.completeness < 70 && (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Complete Your Profile First</h3>
                        <p className="text-gray-600 mb-4">
                          To get AI-powered mentor recommendations, please complete your profile with skills and domain information.
                        </p>
                        <a
                          href="/student/profile"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Complete Profile
                        </a>
                      </div>
                    )}
                    
                    {filteredMentors.length === 0 && studentData.profile?.completeness >= 70 && allMentors.length > 0 && (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Matches Found</h3>
                        <p className="text-gray-600 mb-4">
                          Try adjusting your search criteria or browse all available mentors.
                        </p>
                      </div>
                    )}
                    
                    {filteredMentors.length === 0 && allMentors.length === 0 && (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">👥</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Mentors Available</h3>
                        <p className="text-gray-600 mb-4">
                          There are currently no mentors available in the system. Please check back later.
                        </p>
                      </div>
                    )}
                    
                    {filteredMentors.map((mentor) => (
                      <div 
                        key={mentor.id} 
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleViewProfile(mentor)} // Add click handler to view profile
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mr-4 flex items-center justify-center text-white font-bold">
                              {mentor.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
                              <p className="text-sm text-gray-600">{mentor.position} at {mentor.company}</p>
                              {/* Fix experience display - only show if experience > 0 */}
                              {mentor.experience > 0 && (
                                <p className="text-xs text-gray-500">{mentor.location} • {mentor.experience} years exp</p>
                              )}
                            </div>
                          </div>
                          
                          {/* AI Score (only for recommended mentors) - now dynamic for all mentors */}
                          {mentor.score !== undefined && (
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getScoreColor(mentor.score)}`}>
                              {getScoreLabel(mentor.score)} ({mentor.score})
                            </div>
                          )}
                        </div>
                        
                        {/* Skills */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {mentor.skills.slice(0, 5).map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {skill}
                              </span>
                            ))}
                            {mentor.skills.length > 5 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                +{mentor.skills.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Why Matched (AI explanation) - now based on skills only */}
                        {!showAllMentors && mentor.whyMatched && (
                          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800">
                              <span className="font-medium">Why matched:</span> {mentor.whyMatched}
                            </p>
                          </div>
                        )}
                        
                        {/* Remove the information section that was requested to be removed */}
                        <div className="flex items-center justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent opening profile when clicking request button
                              handleMentorRequest(mentor);
                            }}
                            disabled={hasRequestedMentor(mentor.id)}
                            className={`px-4 py-2 rounded-md font-medium ${
                              hasRequestedMentor(mentor.id)
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {hasRequestedMentor(mentor.id)
                              ? 'Request Sent'
                              : 'Request Mentorship'
                            }
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* My Mentorship Requests Sidebar */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">My Requests</h2>
              
              {(studentData.mentorship?.requests?.length || 0) === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🤝</div>
                  <p className="text-gray-600">No mentorship requests yet</p>
                  <p className="text-sm text-gray-500 mt-2">Start by requesting mentorship from recommended mentors</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {studentData.mentorship.requests?.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{request.mentorName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Sent {new Date(request.requestDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-700 mb-3">{request.message}</p>
                      
                      {request.status === 'accepted' && (
                        <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-sm">
                          💬 Message Mentor
                        </button>
                      )}
                      
                      {request.status === 'pending' && (
                        <div className="text-xs text-gray-500">
                          ⏳ Waiting for response...
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Mentorship Stats */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">Your Mentorship Journey</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Active Mentors:</span>
                    <span className="font-medium text-blue-900">{studentData.mentorship.activeMentors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Pending Requests:</span>
                    <span className="font-medium text-blue-900">{studentData.mentorship.pendingRequests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Total Requests:</span>
                    <span className="font-medium text-blue-900">{studentData.mentorship.requests?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Request Modal */}
          {showRequestModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold mb-4">
                  Request Mentorship from {selectedMentor?.name}
                </h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (required)
                  </label>
                  <textarea
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    rows="4"
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Introduce yourself and explain what kind of mentorship you're looking for..."
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitMentorRequest}
                    disabled={!requestMessage.trim()}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send Request
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Profile Modal - Use the new modal component without mentorship option */}
          {showProfileModal && selectedAlumni && (
            <AlumniProfileModalMentorship
              alumni={selectedAlumni}
              onClose={() => setShowProfileModal(false)}
              followStatus={followStatuses[selectedAlumni.id] || 'follow'} // Use the follow status from state
              onFollowClick={(alumniId, status) => {
                // Update follow status in state
                setFollowStatuses(prev => ({
                  ...prev,
                  [alumniId]: status
                }));
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentMentorship;