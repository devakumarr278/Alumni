import React, { useState, useEffect, useCallback } from 'react';
import { X, Award, Briefcase, Calendar, Star, Clock, MapPin, Mail, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import databaseService from '../services/databaseService';
import webSocketService from '../services/webSocketService';

const AlumniProfileModal = ({ alumni, onClose, followStatus, onFollowClick }) => {
  console.log('Rendering AlumniProfileModal for alumni:', alumni);
  const [activeTab, setActiveTab] = useState('about');
  const [isFollowing, setIsFollowing] = useState(followStatus === 'following');
  const [followRequestSent, setFollowRequestSent] = useState(followStatus === 'requested');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [alumniDetails, setAlumniDetails] = useState(alumni);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Load detailed alumni profile when modal opens
  useEffect(() => {
    const loadAlumniProfile = async () => {
      if (alumni.id) {
        setLoadingProfile(true);
        try {
          const response = await databaseService.getAlumniProfile(alumni.id);
          if (response.success) {
            setAlumniDetails(response.data.alumni);
          }
        } catch (err) {
          console.error('Failed to load alumni profile:', err);
          // Use the passed alumni data as fallback
          setAlumniDetails(alumni);
        } finally {
          setLoadingProfile(false);
        }
      }
    };

    loadAlumniProfile();
  }, [alumni.id, alumni]);

  // Update local state when followStatus prop changes
  useEffect(() => {
    setIsFollowing(followStatus === 'following');
    setFollowRequestSent(followStatus === 'requested');
  }, [followStatus]);

  // Handle WebSocket messages for follow request updates
  const handleFollowRequestUpdate = useCallback((data) => {
    console.log('Received follow request update in AlumniProfileModal:', data);
    if (data.type === 'follow_request_update' && data.data) {
      // Check if this update is for the current alumni
      if (data.data.alumniId === alumniDetails.id) {
        console.log(`Processing follow request update for alumni ${alumniDetails.id}:`, data.data.status);
        if (data.data.status === 'approved') {
          setIsFollowing(true);
          setFollowRequestSent(false);
          console.log(`Set follow status for ${alumniDetails.id} to following`);
        } else if (data.data.status === 'rejected') {
          setIsFollowing(false);
          setFollowRequestSent(false);
          console.log(`Set follow status for ${alumniDetails.id} to not following`);
        } else if (data.data.status === 'unfollowed') {
          setIsFollowing(false);
          setFollowRequestSent(false);
          console.log(`Set follow status for ${alumniDetails.id} to not following (unfollowed)`);
        }
      } else {
        console.log(`WebSocket message received for alumni ${data.data.alumniId}, but current modal is for alumni ${alumniDetails.id}`);
      }
    } else {
      console.log('Received non-follow-request-update message or missing data:', data);
    }
  }, [alumniDetails.id]);

  // Initialize WebSocket connection and listeners
  useEffect(() => {
    console.log('Adding WebSocket listener in AlumniProfileModal');
    // Listen for follow request updates
    webSocketService.on('notification', handleFollowRequestUpdate);
    
    return () => {
      console.log('Removing WebSocket listener in AlumniProfileModal');
      webSocketService.off('notification', handleFollowRequestUpdate);
    };
  }, [handleFollowRequestUpdate]);

  // Calculate total experience from all experiences
  const calculateTotalExperience = () => {
    if (!alumniDetails.experiences || !Array.isArray(alumniDetails.experiences)) return 0;
    
    return alumniDetails.experiences.reduce((total, exp) => {
      return total + (parseInt(exp.experience) || 0);
    }, 0);
  };

  // Get current experience (where isCurrent is true)
  const getCurrentExperience = () => {
    if (!alumniDetails.experiences || !Array.isArray(alumniDetails.experiences)) return null;
    
    return alumniDetails.experiences.find(exp => exp.isCurrent) || alumniDetails.experiences[0] || null;
  };

  const currentExperience = getCurrentExperience();
  const totalExperience = calculateTotalExperience();

  const handleFollowClickLocal = async () => {
    if (isFollowing || followRequestSent) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await databaseService.followAlumni(alumniDetails.id);
      
      if (response.success) {
        // Update local state
        setFollowRequestSent(true);
        
        // Call the parent's follow handler
        if (onFollowClick) {
          onFollowClick(alumniDetails.id, 'requested');
        }
      } else {
        throw new Error(response.message || 'Failed to send follow request');
      }
    } catch (err) {
      setError('Failed to send follow request. Please try again.');
      console.error('Follow error:', err);
      
      // Fallback to localStorage simulation
      try {
        const followData = JSON.parse(localStorage.getItem('followData') || '{}');
        followData[alumniDetails.id] = 'requested';
        localStorage.setItem('followData', JSON.stringify(followData));
        setFollowRequestSent(true);
        if (onFollowClick) {
          onFollowClick(alumniDetails.id, 'requested');
        }
      } catch (localStorageErr) {
        console.error('LocalStorage fallback error:', localStorageErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollowClickLocal = async () => {
    if (!isFollowing) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await databaseService.unfollowAlumni(alumniDetails.id);
      
      if (response.success) {
        // Update local state
        setIsFollowing(false);
        
        // Call the parent's follow handler
        if (onFollowClick) {
          onFollowClick(alumniDetails.id, 'follow');
        }
      } else {
        throw new Error(response.message || 'Failed to unfollow');
      }
    } catch (err) {
      setError('Failed to unfollow. Please try again.');
      console.error('Unfollow error:', err);
      
      // Fallback to localStorage simulation
      try {
        const followData = JSON.parse(localStorage.getItem('followData') || '{}');
        delete followData[alumniDetails.id];
        localStorage.setItem('followData', JSON.stringify(followData));
        setIsFollowing(false);
        if (onFollowClick) {
          onFollowClick(alumniDetails.id, 'follow');
        }
      } catch (localStorageErr) {
        console.error('LocalStorage fallback error:', localStorageErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const getFollowButtonText = () => {
    if (isFollowing) return 'Following';
    if (followRequestSent) return 'Requested';
    return 'Follow';
  };

  const getFollowButtonClass = () => {
    if (isFollowing) return 'bg-green-100 text-green-800 hover:bg-green-200';
    if (followRequestSent) return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
    return 'bg-blue-600 text-white hover:bg-blue-700';
  };

  const tabs = ["about", "experience", "skills", "mentorship"];

  if (loadingProfile) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative flex flex-col items-center justify-center h-64"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
        >
          {/* Close */}
          <button
            className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 transition"
            onClick={onClose}
          >
            <X size={22} />
          </button>

          {/* Header */}
          <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
            <div className="relative">
              {alumniDetails.profileImage ? (
                <img
                  src={alumniDetails.profileImage}
                  alt={alumniDetails.name}
                  className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-md">
                  {alumniDetails.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'AU'}
                </div>
              )}
              {alumniDetails.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                  <Award size={16} className="text-white" />
                </div>
              )}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800">{alumniDetails.name}</h2>
              <p className="text-gray-600">
                {currentExperience?.role || alumniDetails.currentPosition || 'Role not specified'} @ <span className="font-medium">{currentExperience?.company || alumniDetails.company || 'Company not specified'}</span>
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {alumniDetails.major || alumniDetails.department || 'Department not specified'} • Class of {alumniDetails.graduationYear || 'N/A'}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <MapPin size={12} /> {alumniDetails.location || 'Location not specified'}
                </span>
                <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <Briefcase size={12} /> {totalExperience} yrs experience
                </span>
              </div>
            </div>
            <div className="ml-auto flex flex-col items-end gap-2">
              {isFollowing ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleFollowClickLocal}
                    disabled={loading || isFollowing || followRequestSent}
                    className={`px-6 py-2 rounded-full font-medium ${getFollowButtonClass()} transition-colors ${
                      (isFollowing || followRequestSent || loading) ? 'cursor-default' : ''
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Request...
                      </span>
                    ) : (
                      getFollowButtonText()
                    )}
                  </button>
                  <button
                    onClick={handleUnfollowClickLocal}
                    disabled={loading}
                    className="px-6 py-2 rounded-full font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                  >
                    {loading ? 'Unfollowing...' : 'Unfollow'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleFollowClickLocal}
                  disabled={loading || isFollowing || followRequestSent}
                  className={`px-6 py-2 rounded-full font-medium ${getFollowButtonClass()} transition-colors ${
                    (isFollowing || followRequestSent || loading) ? 'cursor-default' : ''
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Request...
                    </span>
                  ) : (
                    getFollowButtonText()
                  )}
                </button>
              )}
              {error && <p className="text-red-500 text-xs mt-1 text-center">{error}</p>}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mb-5 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-3 font-medium text-sm ${
                  activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "about" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-700 text-lg mb-3">About</h3>
                <p className="text-gray-600 leading-relaxed">
                  {alumniDetails.bio || "This alumnus hasn't added a bio yet."}
                </p>
              </div>

              {/* Badges */}
              {alumniDetails.badges && alumniDetails.badges.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700 text-lg mb-3">Achievements</h3>
                  <div className="flex flex-wrap gap-2">
                    {alumniDetails.badges.map((badge, index) => (
                      <span key={index} className="inline-flex items-center gap-1 rounded-full border font-medium text-sm px-3 py-1 bg-yellow-100 text-yellow-800 border-yellow-300">
                        <Award size={14} />
                        {badge.name}
                        {badge.points > 0 && (
                          <span className="ml-1 bg-white bg-opacity-50 rounded-full px-1.5 py-0.5">
                            {badge.points}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">Total Experience</p>
                  <p className="text-2xl font-bold text-blue-900">{totalExperience} years</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-700">Graduation Year</p>
                  <p className="text-2xl font-bold text-green-900">{alumniDetails.graduationYear || 'N/A'}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 text-lg mb-3">Contact</h3>
                <div className="space-y-3">
                  {alumniDetails.email && (
                    <p className="flex items-center text-gray-700">
                      <Mail size={16} className="mr-2 text-gray-500" />
                      <a href={`mailto:${alumniDetails.email}`} className="text-blue-600 hover:underline">
                        {alumniDetails.email}
                      </a>
                    </p>
                  )}
                  {alumniDetails.linkedinProfile && (
                    <p className="flex items-center text-gray-700">
                      <Linkedin size={16} className="mr-2 text-gray-500" />
                      <a href={alumniDetails.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        LinkedIn Profile
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "experience" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 text-lg mb-2">Experience</h3>
              {alumniDetails.experiences?.length ? (
                alumniDetails.experiences.map((exp, idx) => (
                  <div
                    key={idx}
                    className="border-l-4 border-blue-500 pl-4 py-3 hover:bg-gray-50 rounded-md transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800 flex items-center gap-2">
                          <Briefcase size={16} />
                          {exp.role}
                        </p>
                        <p className="text-gray-700 text-sm mt-1">{exp.company}</p>
                        <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                          <MapPin size={12} /> {exp.location}
                        </p>
                        <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                          <Calendar size={12} /> {exp.experience} years
                        </p>
                      </div>
                      {exp.isCurrent && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Current
                        </span>
                      )}
                    </div>
                    {exp.description && (
                      <p className="text-gray-600 text-sm mt-2">{exp.description}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No experience added yet.</p>
              )}
            </div>
          )}

          {activeTab === "skills" && (
            <div>
              <h3 className="font-semibold text-gray-700 text-lg mb-3">Skills</h3>
              {alumniDetails.skills?.length ? (
                <div className="flex flex-wrap gap-2">
                  {alumniDetails.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-blue-100 text-blue-700 text-sm rounded-full hover:bg-blue-200 transition"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No skills information available.</p>
              )}
            </div>
          )}

          {activeTab === "mentorship" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 text-lg mb-3 flex items-center gap-2">
                <Clock size={20} /> Mentorship
              </h3>
              
              {isFollowing ? (
                <div>
                  <p className="text-gray-600 mb-4">
                    This alumnus is available for mentorship. Send a mentorship request to connect.
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">How Mentorship Works</h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Send a mentorship request with your goals</li>
                      <li>• Wait for the alumni to accept your request</li>
                      <li>• Schedule sessions at mutually convenient times</li>
                      <li>• Build a meaningful professional relationship</li>
                    </ul>
                  </div>
                  
                  <button 
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    onClick={() => alert('Mentorship request feature coming soon!')}
                  >
                    Request Mentorship Session
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Follow to Access Mentorship</h4>
                  <p className="text-gray-500 mb-4">
                    You need to follow this alumnus to view their mentorship availability and send requests.
                  </p>
                  <button
                    onClick={handleFollowClickLocal}
                    disabled={loading || followRequestSent}
                    className={`px-6 py-2 rounded-full font-medium ${getFollowButtonClass()} transition-colors ${
                      (followRequestSent || loading) ? 'cursor-default' : ''
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Request...
                      </span>
                    ) : (
                      followRequestSent ? 'Requested' : 'Follow to Connect'
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AlumniProfileModal;