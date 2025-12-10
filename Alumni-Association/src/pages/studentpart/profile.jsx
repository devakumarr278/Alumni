import React, { useState, useEffect, useRef } from 'react';
// Removed StudentNavigation import as it's handled by the shared layout
import { useStudent } from './StudentContext';
import { useAuth } from '../../context/AuthContext'; // Import AuthContext for real user data
import { extractSkills } from './utils/skillExtractor';
import { COMMON_INTERESTS, getRandomInterests } from './utils/interests';
import { BadgeList } from '../../components/Badge';
import BadgeVerificationRequest from './components/BadgeVerificationRequest';
import { motion } from 'framer-motion';

const StudentProfile = () => {
  // Always call hooks at the top level
  const contextValue = useStudent();
  const { user: authUser } = useAuth(); // Get real user data from AuthContext
  const fileInputRef = useRef(null);
  const editButtonRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showEditDropdown, setShowEditDropdown] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [personalQuote, setPersonalQuote] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    major: '',
    graduationYear: '',
    phone: '',
    bio: '',
    skills: [],
    domain: '',
    timeZone: 'Asia/Kolkata',
    interests: [],
    careerGoals: '',
    allowMentorship: false,
    shareProfile: false,
    allowContact: false
  });
  const [realProfileData, setRealProfileData] = useState(null); // State for real profile data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Fetch real user profile data from backend
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5003/api'}/auth/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Profile data fetched:', data);
        
        if (data.success && data.data) {
          setRealProfileData(data.data);
          
          // Map backend user data to form data structure
          const userData = data.data;
          setFormData({
            name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
            email: userData.email || '',
            major: userData.department || '',
            graduationYear: userData.graduationYear || '',
            phone: userData.phone || '',
            bio: userData.bio || '',
            skills: userData.skills || [],
            domain: userData.domain || '',
            timeZone: userData.timeZone || 'Asia/Kolkata',
            interests: userData.interests || [],
            careerGoals: userData.careerGoals || '',
            allowMentorship: userData.allowMentorship || false,
            shareProfile: userData.shareProfile || false,
            allowContact: userData.allowContact || false
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, []);
  
  // Initialize form data when studentData is available (fallback to mock data)
  useEffect(() => {
    // Only use mock data if real data hasn't been loaded
    if (!realProfileData && contextValue && contextValue.studentData) {
      const { studentData } = contextValue;
      setFormData({
        name: studentData?.profile?.name || '',
        email: studentData?.profile?.email || '',
        major: studentData?.profile?.major || '',
        graduationYear: studentData?.profile?.graduationYear || '',
        phone: studentData?.profile?.phone || '',
        bio: studentData?.profile?.bio || '',
        skills: studentData?.profile?.skills || [],
        domain: studentData?.profile?.domain || '',
        timeZone: studentData?.profile?.timeZone || 'Asia/Kolkata',
        interests: studentData?.profile?.interests || [],
        careerGoals: studentData?.profile?.careerGoals || '',
        allowMentorship: studentData?.profile?.consentSettings?.allowMentorship || false,
        shareProfile: studentData?.profile?.consentSettings?.shareProfile || false,
        allowContact: studentData?.profile?.consentSettings?.allowContact || false
      });
      
      // Load saved profile photo from localStorage if exists
      const savedPhoto = localStorage.getItem('studentProfilePhoto');
      if (savedPhoto) {
        setProfilePhoto(savedPhoto);
      }
      
      // Load personal quote
      const savedQuote = localStorage.getItem('studentPersonalQuote') || '';
      setPersonalQuote(savedQuote);
    }
  }, [contextValue, realProfileData]);

  // Get random suggestions for skills and interests
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [suggestedInterests, setSuggestedInterests] = useState([]);

  useEffect(() => {
    // Get random skills and interests for suggestions
    setSuggestedSkills(getRandomInterests(8));
    setSuggestedInterests(getRandomInterests(8));
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close edit dropdown if click is outside
      if (showEditDropdown && editButtonRef.current && !editButtonRef.current.contains(event.target)) {
        const dropdown = document.querySelector('.absolute.right-0.top-full.mt-2.w-48');
        if (dropdown && !dropdown.contains(event.target)) {
          setShowEditDropdown(false);
        }
      }
      
      // Close photo options if click is outside
      if (showPhotoOptions) {
        const photoOptions = document.querySelector('.absolute.inset-0.rounded-full');
        if (photoOptions && !photoOptions.contains(event.target)) {
          setShowPhotoOptions(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEditDropdown, showPhotoOptions]);
  
  // Prevent body scrolling when dropdown is open
  useEffect(() => {
    if (showEditDropdown) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [showEditDropdown]);

  // Handle studentData errors - moved this logic to render phase
  const hasContextError = !contextValue;
  const hasDataError = contextValue && !contextValue.studentData;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Add suggested skill
  const addSuggestedSkill = (skill) => {
    if (!formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const addInterest = () => {
    if (interestInput.trim() && !formData.interests.includes(interestInput.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interestInput.trim()]
      }));
      setInterestInput('');
    }
  };

  const removeInterest = (interestToRemove) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  // Add suggested interest
  const addSuggestedInterest = (interest) => {
    if (!formData.interests.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Prepare data for backend API
      const profileData = {
        firstName: formData.name.split(' ')[0] || '',
        lastName: formData.name.split(' ').slice(1).join(' ') || '',
        phone: formData.phone,
        bio: formData.bio,
        skills: formData.skills,
        domain: formData.domain,
        timeZone: formData.timeZone,
        interests: formData.interests,
        careerGoals: formData.careerGoals,
        allowMentorship: formData.allowMentorship,
        shareProfile: formData.shareProfile,
        allowContact: formData.allowContact
      };
      
      // Remove empty fields
      Object.keys(profileData).forEach(key => {
        if (profileData[key] === '' || profileData[key] === null || profileData[key] === undefined) {
          delete profileData[key];
        }
      });
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5003/api'}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
      
      const data = await response.json();
      console.log('Profile updated:', data);
      
      // Update local state with new data
      if (data.success && data.data) {
        setRealProfileData(data.data);
      }
      
      // Also update StudentContext if available
      if (contextValue && contextValue.updateProfile) {
        contextValue.updateProfile({
          name: formData.name,
          email: formData.email,
          major: formData.major,
          graduationYear: formData.graduationYear,
          phone: formData.phone,
          bio: formData.bio,
          skills: formData.skills,
          domain: formData.domain,
          timeZone: formData.timeZone,
          interests: formData.interests,
          careerGoals: formData.careerGoals,
          consentSettings: {
            allowMentorship: formData.allowMentorship,
            shareProfile: formData.shareProfile,
            allowContact: formData.allowContact
          }
        });
      }
      
      setSaveMessage('Profile saved successfully!');
      setIsEditing(false); // Close the form after saving
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveMessage(`Error saving profile: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Test function for mentorship session completion
  const handleTestMentorshipSession = () => {
    try {
      if (contextValue && contextValue.completeMentorshipSession) {
        contextValue.completeMentorshipSession();
        setSaveMessage('Mentorship session completed! Check your badges.');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error completing mentorship session:', error);
      setSaveMessage('Error completing mentorship session. Please try again.');
    }
  };

  // Get user badges with error handling
  let userBadges = [];
  try {
    if (contextValue && contextValue.getUserBadges) {
      userBadges = contextValue.getUserBadges() || [];
    }
  } catch (error) {
    console.error('Error getting user badges:', error);
    userBadges = [];
  }

  // Get student initials for avatar
  const getInitials = (name) => {
    try {
      return name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'ST';
    } catch (error) {
      console.error('Error getting initials:', error);
      return 'ST';
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoDataUrl = e.target.result;
        setProfilePhoto(photoDataUrl);
        // Save to localStorage
        localStorage.setItem('studentProfilePhoto', photoDataUrl);
        setShowPhotoOptions(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle photo removal
  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    localStorage.removeItem('studentProfilePhoto');
    setShowPhotoOptions(false);
  };

  // Handle personal quote change
  const handleQuoteChange = (e) => {
    const quote = e.target.value;
    setPersonalQuote(quote);
    localStorage.setItem('studentPersonalQuote', quote);
  };

  // Activity timeline - use real data when available, fallback to mock data
  const activityTimeline = realProfileData && realProfileData.activityTimeline
    ? realProfileData.activityTimeline.slice(0, 3)
    : (contextValue?.studentData?.activityTimeline || [
        { id: 1, type: 'badge', title: 'Profile Complete', description: 'Completed your profile', date: '2024-01-10', icon: '📋' },
        { id: 2, type: 'event', title: 'Tech Conference', description: 'Attended annual tech conference', date: '2024-01-15', icon: '📅' },
        { id: 3, type: 'connection', title: 'New Connection', description: 'Connected with Sarah Johnson', date: '2024-01-20', icon: '🤝' },
      ]).slice(0, 3); // Limit to 3 items

  // Real-time connections data from context or real profile data
  const connections = realProfileData 
    ? {
        alumni: realProfileData.connections?.alumni || 0,
        students: realProfileData.connections?.students || 0,
        total: (realProfileData.connections?.alumni || 0) + (realProfileData.connections?.students || 0)
      }
    : {
        alumni: contextValue?.studentData?.connections?.alumni || 0,
        students: contextValue?.studentData?.connections?.students || 0,
        total: (contextValue?.studentData?.connections?.alumni || 0) + (contextValue?.studentData?.connections?.students || 0)
      };

  // Mock data for gamification
  const gamification = {
    level: 'Silver',
    progress: 60,
    nextLevel: 'Gold',
    badgesEarned: userBadges.length,
    totalBadges: 10
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Loading Profile</h2>
          <p className="text-gray-600">Fetching your profile data from the server...</p>
        </div>
      </div>
    );
  }

  // Render error states if needed
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Profile</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (hasContextError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Context Error</h2>
          <p className="text-gray-700 mb-4">There was an error accessing the student data context.</p>
          <p className="text-sm text-gray-500 mb-4">Make sure you're accessing this page through the proper navigation.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (hasDataError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Data Error</h2>
          <p className="text-gray-700 mb-4">Student data is not available.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50 via-purple-50 to-cyan-50"></div>
        
        {/* Floating Gradient Orbs */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-100/20 to-transparent rounded-bl-full animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-gradient-to-t from-purple-100/30 to-transparent rounded-tr-full animate-pulse"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-200/15 to-blue-200/15 rounded-full blur-3xl animate-bounce" style={{animationDuration: '8s'}}></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-200/15 to-pink-200/15 rounded-full blur-3xl animate-bounce" style={{animationDuration: '10s', animationDelay: '1s'}}></div>
      </div>
      
      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div 
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10"
            style={{
              width: `${Math.random() * 20 + 5}px`,
              height: `${Math.random() * 20 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
      
      <div className="lg:flex relative z-10">
        {/* Removed StudentNavigation as it's handled by the shared layout */}
        
        {/* Hidden file input for photo upload */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handlePhotoUpload}
        />
        
        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Enhanced Profile Header with Glass Effect */}
            <motion.div 
              className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 relative overflow-hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Enhanced header with gradient background and animated elements */}
              <div className="h-24 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/15 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/15 rounded-full translate-y-12 -translate-x-12 animate-pulse"></div>
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
              </div>
              <div className="border-b border-gray-200/70"></div>
              
              {/* Profile Info */}
              <div className="px-6 py-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center">
                    {/* Enhanced Profile Photo with Glass Effect */}
                    <div className="relative group">
                      {profilePhoto ? (
                        <img 
                          src={profilePhoto} 
                          alt="Profile" 
                          className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl ring-4 ring-white/50"
                        />
                      ) : (
                        <motion.div 
                          className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-extrabold border-4 border-white shadow-xl ring-4 ring-white/50 transform transition-transform duration-300 hover:scale-105"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {getInitials(contextValue?.studentData?.profile?.name)}
                        </motion.div>
                      )}
                      
                      {/* Enhanced hover effect for photo options with Glass Effect */}
                      <div 
                        className="absolute inset-0 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-lg"
                        onClick={() => fileInputRef.current.click()}
                      >
                        <div className="text-white text-center bg-black/30 backdrop-blur-sm rounded-full p-3 transform transition-all duration-300 hover:scale-110">
                          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-xs mt-1 font-bold">Change</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Name and Details with Glass Effect */}
                    <div className="ml-6">
                      <motion.h1 
                        className="text-3xl font-extrabold text-gray-900 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {realProfileData 
                          ? `${realProfileData.firstName || ''} ${realProfileData.lastName || ''}`.trim() 
                          : (contextValue?.studentData?.profile?.name || 'Student Name')}
                      </motion.h1>
                      <motion.input
                        type="text"
                        value={personalQuote}
                        onChange={handleQuoteChange}
                        placeholder="Add your personal quote or motto..."
                        className="mt-2 text-gray-700 bg-transparent border-b-2 border-transparent hover:border-gray-400 focus:border-blue-500 focus:outline-none w-full max-w-md font-medium text-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      />
                      <motion.div 
                        className="mt-3 text-gray-700 space-y-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <p className="font-medium">
                          {realProfileData 
                            ? realProfileData.email 
                            : (contextValue?.studentData?.profile?.email || 'student@college.edu')}
                        </p>
                        <p className="font-medium">
                          {realProfileData 
                            ? `${realProfileData.department || 'Major'} • ${realProfileData.graduationYear || 'Year'}`
                            : `${contextValue?.studentData?.profile?.major || 'Major'} • ${contextValue?.studentData?.profile?.graduationYear || 'Year'}`}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Enhanced Floating Edit Profile Button with Glass Effect */}
                  <motion.div 
                    className="mt-4 md:mt-0 relative"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <button 
                      ref={editButtonRef}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowEditDropdown(!showEditDropdown);
                      }}
                      className="px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 text-base font-bold flex items-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                      <svg className={`w-5 h-5 ml-2 transition-transform duration-300 ${showEditDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {showEditDropdown && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 transform origin-top-right transition-all duration-200 z-50">
                        <button 
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                            setShowEditDropdown(false);
                          }}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit Info
                        </button>
                        <button 
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            // For now, we'll show an alert that this would lead to change password functionality
                            // In a real implementation, this would navigate to the change password page
                            alert('Change Password functionality would be implemented here');
                            setShowEditDropdown(false);
                          }}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Privacy Settings
                        </button>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Gamification Progress with Glass Effect */}
            <motion.div 
              className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-extrabold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Member Level</h2>
                <span className="px-4 py-2 bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 rounded-full text-base font-bold shadow-sm">
                  {gamification.level} Member
                </span>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-base font-medium text-gray-700 mb-2">
                  <span>Progress to {gamification.nextLevel} Member</span>
                  <span>{gamification.progress}%</span>
                </div>
                <div className="w-full bg-gray-200/70 rounded-full h-3 shadow-inner">
                  <motion.div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full shadow-md" 
                    style={{ width: `${gamification.progress}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${gamification.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  ></motion.div>
                </div>
              </div>
              
              <div className="flex items-center text-base font-medium text-gray-700">
                <span className="mr-4">Badges: {gamification.badgesEarned}/{gamification.totalBadges}</span>
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">🚀 {100 - gamification.progress}% to go!</span>
              </div>
            </motion.div>

            {/* Progress Tracker Widget */}

            {/* Enhanced Profile Form with Glass Effect - Only shown when editing */}
            {isEditing && (
              <motion.div 
                className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-blue-500/70 p-6 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-extrabold text-blue-600 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Edit Profile Information</h2>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100/80 transition-all duration-300"
                  >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {saveMessage && (
                  <motion.div 
                    className={`mb-4 p-4 rounded-xl text-base font-medium ${
                      saveMessage.includes('Error') 
                        ? 'bg-red-50/90 text-red-800 border border-red-200/70 backdrop-blur-sm shadow-sm'
                        : 'bg-green-50/90 text-green-800 border border-green-200/70 backdrop-blur-sm shadow-sm'
                    }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {saveMessage}
                  </motion.div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-base font-bold text-gray-800 mb-2">Name *</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-xl p-3 focus:ring-blue-500 focus:border-blue-500 shadow-sm focus:shadow-md transition-all duration-300" 
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email *</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" 
                        placeholder="your.email@college.edu"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Major *</label>
                      <input 
                        type="text" 
                        name="major"
                        value={formData.major}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" 
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Graduation Year *</label>
                      <input 
                        type="number" 
                        name="graduationYear"
                        value={formData.graduationYear}
                        onChange={handleChange}
                        required
                        min="2020"
                        max="2030"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" 
                        placeholder="2024"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" 
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bio</label>
                      <textarea 
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="3"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" 
                        placeholder="Tell us about yourself, your interests, and career goals..."
                      />
                      
                      {/* Skill Extraction Test Section */}
                      {formData.bio && (
                        <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-md">
                          <h4 className="text-sm font-medium text-blue-800 mb-2">🔍 Auto-detected Skills from Bio:</h4>
                          <div className="flex flex-wrap gap-2">
                            {extractSkills(formData.bio).map((skill, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!formData.skills.includes(skill)) {
                                      setFormData(prev => ({
                                        ...prev,
                                        skills: [...prev.skills, skill]
                                      }));
                                    }
                                  }}
                                  className="ml-1 text-blue-600 hover:text-blue-800"
                                  title="Add to your skills"
                                >
                                  +
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Skills section */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Skills</label>
                      <div className="mt-1 flex flex-wrap gap-2 mb-2">
                        {formData.skills.map((skill, index) => (
                          <motion.span 
                            key={index} 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </motion.span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                          className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Add a skill"
                        />
                        <button
                          type="button"
                          onClick={addSkill}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm"
                        >
                          Add
                        </button>
                      </div>
                      
                      {/* Suggested Skills */}
                      {suggestedSkills.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 mb-1">Suggested skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {suggestedSkills.map((skill, index) => (
                              <motion.button
                                key={index}
                                type="button"
                                onClick={() => addSuggestedSkill(skill)}
                                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full"
                                disabled={formData.skills.includes(skill)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {skill}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Domain/Field</label>
                      <select 
                        name="domain"
                        value={formData.domain}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select your domain</option>
                        <option value="Technology">Technology</option>
                        <option value="Business">Business</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                        <option value="Finance">Finance</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Creative Arts">Creative Arts</option>
                        <option value="Research">Research</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Operations">Operations</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Time Zone</label>
                      <select 
                        name="timeZone"
                        value={formData.timeZone}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                        <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                        <option value="Europe/London">Europe/London (GMT)</option>
                        <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                        <option value="Europe/Paris">Europe/Paris (CET)</option>
                        <option value="Australia/Sydney">Australia/Sydney (AEST)</option>
                        <option value="America/Chicago">America/Chicago (CST)</option>
                        <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                        <option value="Pacific/Auckland">Pacific/Auckland (NZST)</option>
                      </select>
                    </div>

                    {/* Interests section */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Interests</label>
                      <div className="mt-1 flex flex-wrap gap-2 mb-2">
                        {formData.interests.map((interest, index) => (
                          <motion.span 
                            key={index} 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            {interest}
                            <button
                              type="button"
                              onClick={() => removeInterest(interest)}
                              className="ml-1 text-green-600 hover:text-green-800"
                            >
                              ×
                            </button>
                          </motion.span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={interestInput}
                          onChange={(e) => setInterestInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                          className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Add an interest"
                        />
                        <button
                          type="button"
                          onClick={addInterest}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 shadow-sm"
                        >
                          Add
                        </button>
                      </div>
                      
                      {/* Suggested Interests */}
                      {suggestedInterests.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 mb-1">Suggested interests:</p>
                          <div className="flex flex-wrap gap-1">
                            {suggestedInterests.map((interest, index) => (
                              <motion.button
                                key={index}
                                type="button"
                                onClick={() => addSuggestedInterest(interest)}
                                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full"
                                disabled={formData.interests.includes(interest)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {interest}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Career Goals</label>
                      <textarea 
                        name="careerGoals"
                        value={formData.careerGoals}
                        onChange={handleChange}
                        rows="2"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" 
                        placeholder="Describe your career aspirations and goals..."
                      />
                    </div>

                    {/* Consent settings */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy & Consent Settings</h3>
                      
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="allowMentorship"
                            checked={formData.allowMentorship}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Allow mentors to contact me for mentorship opportunities
                          </span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="shareProfile"
                            checked={formData.shareProfile}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Make my profile visible in the alumni directory
                          </span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="allowContact"
                            checked={formData.allowContact}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Allow other students and alumni to contact me directly
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 shadow-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? 'Saving...' : 'Save Profile'}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8 flex flex-col">
                {/* Badges Section */}
                <motion.div 
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex-grow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Your Badges</h2>
                    <div className="text-sm text-gray-600">
                      {userBadges.length} earned • {realProfileData?.badges?.mentorshipSessions || contextValue?.studentData?.badges?.mentorshipSessions || 0} mentorship sessions
                    </div>
                  </div>
                  
                  {userBadges.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                      {userBadges.map((badge, index) => (
                        <motion.div 
                          key={index} 
                          className="border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow relative group"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -5 }}
                        >
                          <div className="text-3xl mb-2">{badge.icon || '🏅'}</div>
                          <div className="font-medium text-sm">{badge.name || 'Badge'}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {badge.earnedDate ? new Date(badge.earnedDate).toLocaleDateString() : 'Date'}
                          </div>
                          
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            <div className="font-medium">{badge.name}</div>
                            <div className="mt-1">{badge.description || 'Achievement badge'}</div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* Locked badges as placeholders */}
                      {Array.from({ length: 8 - Math.min(userBadges.length, 8) }).map((_, index) => (
                        <motion.div 
                          key={`locked-${index}`} 
                          className="border border-gray-200 rounded-lg p-4 text-center bg-gray-50 opacity-50"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="text-3xl mb-2">🔒</div>
                          <div className="font-medium text-sm text-gray-500">Locked</div>
                          <div className="text-xs text-gray-400 mt-1">Earn more</div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">🏅</div>
                      <p>No badges earned yet. Complete activities to earn your first badge!</p>
                    </div>
                  )}

                  {/* Badge Tips */}
                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">How to Earn More Badges</h3>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Complete your profile (Profile Complete badge)</li>
                      <li>• Attend 3+ events (Event Explorer badge)</li>
                      <li>• Complete 3 mentorship sessions (Mentor Ready badge)</li>
                      <li>• Connect with 10+ alumni (Networker badge)</li>
                    </ul>
                  </div>

                  {/* Request Badge Verification Button */}
                  <div className="border-t pt-4 mt-4">
                    <button
                      onClick={handleTestMentorshipSession}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm mr-4 shadow-sm flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Complete Mentorship Session (Test)
                    </button>
                    <button
                      onClick={() => document.getElementById('badge-verification-modal').classList.remove('hidden')}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm shadow-sm flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Request Badge Verification
                    </button>
                    <p className="text-xs text-gray-500 mt-1">
                      Test button to simulate completing a mentorship session. Complete 3 sessions to earn "Mentor Ready" badge.
                    </p>
                  </div>
                </motion.div>

                {/* Activity Timeline */}
                <motion.div 
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col flex-grow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="text-xl font-semibold mb-4">Your Activity</h2>
                  <div className="space-y-4 flex-grow">
                    {activityTimeline.map((activity) => (
                      <motion.div 
                        key={activity.id} 
                        className="flex"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: activity.id * 0.1 }}
                      >
                        <div className="flex flex-col items-center mr-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-lg">{activity.icon}</span>
                          </div>
                          {activity.id !== activityTimeline[activityTimeline.length - 1].id && (
                            <div className="h-full w-0.5 bg-gray-200 mt-1"></div>
                          )}
                        </div>
                        <div className="pb-4">
                          <h3 className="font-medium">{activity.title}</h3>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View All Activity
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Right Column */}
              <div className="space-y-8 flex flex-col">
                {/* Connections Summary */}
                <motion.div 
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex-grow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h2 className="text-xl font-semibold mb-4">Your Network</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">Alumni Connections</div>
                          <div className="text-sm text-gray-600">{contextValue?.studentData?.connections?.alumni || 0} connected</div>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View All
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">Student Connections</div>
                          <div className="text-sm text-gray-600">{contextValue?.studentData?.connections?.students || 0} connected</div>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View All
                      </button>
                    </div>
                    
                    {/* Recent Connections */}
                    <div className="pt-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Recent Connections</h3>
                      <div className="space-y-3">
                        {(realProfileData?.connections?.recent || contextValue?.studentData?.connections?.recent || [])
                          .slice(0, 3)
                          .map((connection, index) => (
                            <motion.div 
                              key={index} 
                              className="flex items-center"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <span className="text-xs font-medium text-blue-800">
                                  {connection.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'CN'}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{connection.name || 'Connection Name'}</p>
                                <p className="text-xs text-gray-500 truncate">{connection.title || 'Title'}</p>
                              </div>
                              <span className="text-xs text-gray-500">
                                {connection.connectedDate 
                                  ? new Date(connection.connectedDate).toLocaleDateString() 
                                  : 'Date'}
                              </span>
                            </motion.div>
                          ))}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{(contextValue?.studentData?.connections?.alumni || 0) + (contextValue?.studentData?.connections?.students || 0)}</div>
                        <div className="text-sm text-gray-600">Total Connections</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Suggested Mentors based on interests and skills */}
                <motion.div 
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex-grow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <h2 className="text-xl font-semibold mb-4">Suggested Mentors</h2>
                  <div className="space-y-4">
                    {/* Suggested mentors based on user interests and skills */}
                    {(realProfileData?.interests?.length > 0 || realProfileData?.skills?.length > 0 || 
                      contextValue?.studentData?.profile?.interests?.length > 0 || contextValue?.studentData?.profile?.skills?.length > 0) ? (
                      <>
                        <div className="flex items-center border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-800 font-medium">SJ</span>
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="font-medium">Sarah Johnson</div>
                            <div className="text-sm text-gray-600">Senior Software Engineer</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {(realProfileData?.skills || contextValue?.studentData?.profile?.skills || []).includes('JavaScript') ? 'JavaScript Expert' : 'AI Research Specialist'}
                            </div>
                          </div>
                          <button className="ml-auto text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Connect
                          </button>
                        </div>
                        <div className="flex items-center border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <span className="text-purple-800 font-medium">MC</span>
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="font-medium">Michael Chen</div>
                            <div className="text-sm text-gray-600">Product Manager</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {(realProfileData?.interests || contextValue?.studentData?.profile?.interests || []).includes('AI Research') ? 'AI & Machine Learning' : 'Open Source Contributor'}
                            </div>
                          </div>
                          <button className="ml-auto text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Connect
                          </button>
                        </div>
                        <div className="flex items-center border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-green-800 font-medium">EP</span>
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="font-medium">Emma Patel</div>
                            <div className="text-sm text-gray-600">Data Scientist</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {(realProfileData?.skills || contextValue?.studentData?.profile?.skills || []).includes('Python') ? 'Python & Machine Learning' : 'Data Analysis Specialist'}
                            </div>
                          </div>
                          <button className="ml-auto text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Connect
                          </button>
                        </div>
                        
                        {/* Mentorship Tips */}
                        <div className="pt-4 border-t border-gray-200">
                          <h3 className="text-sm font-medium text-gray-900 mb-2">Mentorship Tips</h3>
                          <ul className="text-xs text-gray-600 space-y-1">
                            <li>• Reach out with a specific question or goal</li>
                            <li>• Be respectful of their time and expertise</li>
                            <li>• Follow up after meetings with a thank you</li>
                            <li>• Set clear expectations for the relationship</li>
                          </ul>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <p>Complete your profile with interests and skills to get personalized mentor suggestions.</p>
                        <p className="text-sm mt-2">Add your skills and interests to connect with relevant mentors.</p>
                        
                        {/* Profile Completion Tips */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h3 className="text-sm font-medium text-gray-900 mb-2">Improve Your Profile</h3>
                          <ul className="text-xs text-gray-600 space-y-1">
                            <li>• Add 5+ skills to your profile</li>
                            <li>• Describe your career goals</li>
                            <li>• List your interests and hobbies</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Badge Verification Request Section - Modal */}
            <div id="badge-verification-modal" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Request Badge Verification</h3>
                    <button 
                      onClick={() => document.getElementById('badge-verification-modal').classList.add('hidden')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="mb-4">
                    <p className="text-gray-600">
                      Request verification for badges you've earned through external activities or achievements.
                      Our team will review your submission and award appropriate badges.
                    </p>
                  </div>
                  <BadgeVerificationRequest />
                </div>
              </div>
            </div>

            {/* Test WebSocket Connection Button - Only visible in development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
                <h3 className="font-medium mb-2">Development Tools</h3>
                <button 
                  onClick={handleTestMentorshipSession}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Test Mentorship Session
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
                      className="
