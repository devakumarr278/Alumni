import React, { useState, useEffect, useCallback } from 'react';
import { X, Award, Briefcase, Calendar, Star, Clock, MapPin, Mail, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import databaseService from '../services/databaseService';
import webSocketService from '../services/webSocketService';

const AlumniProfileModalMentorship = ({ alumni, onClose, followStatus, onFollowClick }) => {
  console.log('Rendering AlumniProfileModalMentorship for alumni:', alumni);
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
    console.log('Received follow request update in AlumniProfileModalMentorship:', data);
    if (data.type === 'follow_request_update' && data.data) {
      // Check if this update is for the current alumni
      if (data.data.alumniId === alumni.id) {
        console.log(`Processing follow request update for alumni ${alumni.id}:`, data.data.status);
        if (data.data.status === 'approved') {
          setIsFollowing(true);
          setFollowRequestSent(false);
          console.log(`Set follow status for ${alumni.id} to following`);
          if (onFollowClick) {
            onFollowClick(alumni.id, 'following');
          }
        } else if (data.data.status === 'rejected') {
          setIsFollowing(false);
          setFollowRequestSent(false);
          console.log(`Set follow status for ${alumni.id} to follow`);
          if (onFollowClick) {
            onFollowClick(alumni.id, 'follow');
          }
        }
      } else {
        console.log(`WebSocket message received for alumni ${data.data.alumniId}, but current modal is for alumni ${alumni.id}`);
      }
    } else {
      console.log('Received non-follow-request-update message or missing data:', data);
    }
  }, [alumni.id, onFollowClick]);

  // Initialize WebSocket connection and listeners
  useEffect(() => {
    console.log('Adding WebSocket listener in AlumniProfileModalMentorship');
    // Listen for follow request updates
    webSocketService.on('notification', handleFollowRequestUpdate);
    
    return () => {
      console.log('Removing WebSocket listener in AlumniProfileModalMentorship');
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

  // Tabs for the modal - removed mentorship tab as per user request
  const tabs = ["about", "experience", "skills"];

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
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>

          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
            <div className="relative">
              {alumniDetails.profilePicture ? (
                <img
                  src={alumniDetails.profilePicture}
                  alt={alumniDetails.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">
                  {alumniDetails.name?.split(' ').map(n => n[0]).join('') || 'AU'}
                </div>
              )}
              {alumniDetails.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                  <Award className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{alumniDetails.name}</h1>
                  <p className="text-lg text-gray-600 mt-1">
                    {currentExperience?.role || alumniDetails.currentPosition || 'Position not specified'} at {currentExperience?.company || alumniDetails.company || 'Company not specified'}
                  </p>
                </div>
                
                <div className="mt-4 md:mt-0">
                  <button
                    onClick={handleFollowClickLocal}
                    disabled={isFollowing || followRequestSent || loading}
                    className={`px-6 py-2 rounded-full font-medium transition-colors ${getFollowButtonClass()} ${
                      (isFollowing || followRequestSent || loading) ? 'cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></span>
                        Loading...
                      </span>
                    ) : (
                      getFollowButtonText()
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
                {alumniDetails.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {alumniDetails.location}
                  </div>
                )}
                
                {totalExperience > 0 && (
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-1" />
                    {totalExperience} year{totalExperience !== 1 ? 's' : ''} experience
                  </div>
                )}
                
                {alumniDetails.graduationYear && (
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    Class of {alumniDetails.graduationYear}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              {alumniDetails.bio && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-700">{alumniDetails.bio}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {alumniDetails.department && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Department</h4>
                    <p className="mt-1 text-gray-900">{alumniDetails.department}</p>
                  </div>
                )}
                
                {alumniDetails.graduationYear && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Graduation Year</h4>
                    <p className="mt-1 text-gray-900">{alumniDetails.graduationYear}</p>
                  </div>
                )}
                
                {alumniDetails.email && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Email</h4>
                    <p className="mt-1 text-gray-900">{alumniDetails.email}</p>
                  </div>
                )}
                
                {alumniDetails.linkedinProfile && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">LinkedIn</h4>
                    <a 
                      href={alumniDetails.linkedinProfile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-1 text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <Linkedin className="w-4 h-4 mr-1" />
                      View Profile
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
              
              {alumniDetails.experiences && alumniDetails.experiences.length > 0 ? (
                <div className="space-y-4">
                  {alumniDetails.experiences.map((exp, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between">
                        <h4 className="font-semibold text-gray-900">{exp.role}</h4>
                        {exp.isCurrent && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700">{exp.company}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                      </p>
                      {exp.experience && (
                        <p className="text-sm text-gray-500 mt-1">
                          {exp.experience} year{parseInt(exp.experience) !== 1 ? 's' : ''} experience
                        </p>
                      )}
                      {exp.description && (
                        <p className="text-gray-600 mt-2 text-sm">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No experience information available.</p>
              )}
            </div>
          )}

          {activeTab === 'skills' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
              
              {alumniDetails.skills && alumniDetails.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {alumniDetails.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AlumniProfileModalMentorship;