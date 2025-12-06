import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import databaseService from '../../services/databaseService';

// Helper function to calculate estimated graduation year for students
const calculateGraduationYear = (currentYear, department) => {
  if (!currentYear) return null;
  
  // Get current year
  const now = new Date();
  const currentFullYear = now.getFullYear();
  
  // Parse current year string (e.g., "1st Year", "2nd Year", etc.)
  let yearNumber = 1;
  if (currentYear.includes('1') || currentYear.includes('first') || currentYear.includes('First')) {
    yearNumber = 1;
  } else if (currentYear.includes('2') || currentYear.includes('second') || currentYear.includes('Second')) {
    yearNumber = 2;
  } else if (currentYear.includes('3') || currentYear.includes('third') || currentYear.includes('Third')) {
    yearNumber = 3;
  } else if (currentYear.includes('4') || currentYear.includes('fourth') || currentYear.includes('Fourth')) {
    yearNumber = 4;
  }
  
  // Most bachelor's programs are 4 years
  // So graduation year would be current year + (4 - current year number)
  const estimatedGraduationYear = currentFullYear + (4 - yearNumber);
  
  // But we should also consider that the academic year might have started or not
  // If it's after July, we're in the next academic year
  if (now.getMonth() >= 6) { // July is month 6 (0-indexed)
    return estimatedGraduationYear;
  } else {
    return estimatedGraduationYear - 1;
  }
};

const StudentProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    // Registration fields (should come from user registration data)
    name: '',
    firstName: '',
    lastName: '',
    registerNumber: '',
    email: '',
    collegeName: '',
    department: '',
    graduationYear: '',
    
    // Editable fields
    currentYear: '',
    age: '',
    skills: [],
    interests: [],
    bio: '',
    linkedin: '',
    github: '',
    location: '',
    profilePicture: null,
    phone: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [locationInput, setLocationInput] = useState('');

  // Predefined locations for dropdown
  const LOCATIONS = [
    "Chennai, Tamil Nadu",
    "Coimbatore, Tamil Nadu",
    "Bangalore, Karnataka",
    "Hyderabad, Telangana",
    "Mumbai, Maharashtra",
    "Pune, Maharashtra",
    "Kolkata, West Bengal",
    "Delhi, Delhi",
    "Noida, Uttar Pradesh",
    "Gurgaon, Haryana",
    "Ahmedabad, Gujarat",
    "Jaipur, Rajasthan",
    "Lucknow, Uttar Pradesh",
    "Kochi, Kerala",
    "Mysore, Karnataka"
  ];

  // Predefined skills for suggestions
  const COMMON_SKILLS = [
    "React", "Node.js", "Python", "SQL", "JavaScript", "Java", "C++", 
    "CSS", "HTML", "Django", "Flutter", "Angular", "Vue.js", "TypeScript",
    "MongoDB", "PostgreSQL", "MySQL", "AWS", "Azure", "Docker", "Kubernetes",
    "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Pandas",
    "Express.js", "Spring Boot", "C#", ".NET", "PHP", "Ruby", "Go", "Rust",
    "Swift", "Kotlin", "React Native", "Xamarin", "Flutter", "iOS Development",
    "Android Development", "UI/UX Design", "Figma", "Adobe XD", "Sketch",
    "Project Management", "Agile", "Scrum", "DevOps", "CI/CD", "Git",
    "Jenkins", "Terraform", "Ansible", "Chef", "Puppet", "Linux", "Bash",
    "PowerShell", "Networking", "Cybersecurity", "Blockchain", "IoT",
    "Data Analysis", "Business Intelligence", "Tableau", "Power BI",
    "Excel", "R", "MATLAB", "SPSS", "SAS", "Hadoop", "Spark", "Kafka"
  ];

  // Initialize with data from database or user registration data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // First, try to get profile data from database
        const response = await databaseService.getProfile();
        
        if (response.success) {
          // Use database data but ensure registration fields come from user object
          const dbProfile = response.data.user || response.data;
          
          // Construct full name from firstName and lastName
          const fullName = `${dbProfile.firstName || ''} ${dbProfile.lastName || ''}`.trim();
          
          setProfileData({
            // Registration fields - always from user object or database
            firstName: user?.firstName || dbProfile.firstName || '',
            lastName: user?.lastName || dbProfile.lastName || '',
            name: user?.firstName && user?.lastName 
              ? `${user.firstName} ${user.lastName}` 
              : fullName || user?.name || 'Gokul Kannan',
            registerNumber: user?.registerNumber || dbProfile.registerNumber || '',
            email: user?.email || dbProfile.email || '727724eucy024@skcet.ac.in',
            collegeName: user?.collegeName || dbProfile.collegeName || 'SSN College of Engineering',
            department: user?.department || dbProfile.department || 'Computer Science and Engineering',
            graduationYear: user?.graduationYear || dbProfile.graduationYear || '',
            
            // Editable fields - from database or defaults
            currentYear: dbProfile.currentYear || user?.currentYear || '2nd Year',
            age: dbProfile.age || '',
            skills: Array.isArray(dbProfile.skills) ? dbProfile.skills : [],
            interests: Array.isArray(dbProfile.interests) ? dbProfile.interests : [],
            bio: dbProfile.bio || '',
            linkedin: dbProfile.linkedinProfile || '',
            github: dbProfile.githubProfile || '',
            location: dbProfile.location || '',
            profilePicture: dbProfile.profilePicture || null,
            phone: dbProfile.phone || ''
          });
        } else {
          // Fallback to user registration data only
          const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
          
          setProfileData({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            name: fullName || user?.name || 'Gokul Kannan',
            registerNumber: user?.registerNumber || '',
            email: user?.email || '727724eucy024@skcet.ac.in',
            collegeName: user?.collegeName || 'SSN College of Engineering',
            department: user?.department || 'Computer Science and Engineering',
            graduationYear: user?.graduationYear || '',
            currentYear: user?.currentYear || '2nd Year',
            age: '',
            skills: [],
            interests: [],
            bio: '',
            linkedin: '',
            github: '',
            location: '',
            profilePicture: null,
            phone: ''
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
        
        // Even on error, use user registration data as fallback
        const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
        
        setProfileData({
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          name: fullName || user?.name || 'Gokul Kannan',
          registerNumber: user?.registerNumber || '',
          email: user?.email || '727724eucy024@skcet.ac.in',
          collegeName: user?.collegeName || 'SSN College of Engineering',
          department: user?.department || 'Computer Science and Engineering',
          graduationYear: user?.graduationYear || '',
          currentYear: user?.currentYear || '2nd Year',
          age: '',
          skills: [],
          interests: [],
          bio: '',
          linkedin: '',
          github: '',
          location: '',
          profilePicture: null,
          phone: ''
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Prepare data for submission - only send editable fields
      // Make sure we're sending the correct data types
      const profileUpdateData = {
        currentYear: profileData.currentYear || undefined,
        age: profileData.age ? parseInt(profileData.age, 10) : undefined,
        skills: Array.isArray(profileData.skills) ? [...profileData.skills] : [],
        interests: Array.isArray(profileData.interests) ? [...profileData.interests] : [],
        bio: profileData.bio || undefined,
        linkedinProfile: profileData.linkedin || undefined,
        githubProfile: profileData.github || undefined,
        location: profileData.location || undefined,
        phone: profileData.phone || undefined
      };
      
      // Remove undefined fields
      Object.keys(profileUpdateData).forEach(key => {
        if (profileUpdateData[key] === undefined) {
          delete profileUpdateData[key];
        }
      });
      
      // Special handling for currentYear to ensure it's sent as a string
      if (profileUpdateData.currentYear) {
        profileUpdateData.currentYear = profileUpdateData.currentYear.toString();
      }
      
      console.log('Sending profile update data:', profileUpdateData);
      
      const response = await databaseService.updateProfile(profileUpdateData);
      console.log('Profile update response:', response);
      
      if (response.success) {
        setSuccess('Profile updated successfully!');
        // Update the profile data in state to reflect changes immediately
        // Re-fetch the profile to get the updated data from the server
        setTimeout(async () => {
          try {
            const freshProfile = await databaseService.getProfile();
            if (freshProfile.success) {
              const dbProfile = freshProfile.data.user || freshProfile.data;
              setProfileData(prev => ({
                ...prev,
                // Update all fields with fresh data from server
                currentYear: dbProfile.currentYear || prev.currentYear,
                age: dbProfile.age || prev.age,
                skills: Array.isArray(dbProfile.skills) ? dbProfile.skills : prev.skills,
                interests: Array.isArray(dbProfile.interests) ? dbProfile.interests : prev.interests,
                bio: dbProfile.bio || prev.bio,
                linkedin: dbProfile.linkedinProfile || prev.linkedin,
                github: dbProfile.githubProfile || prev.github,
                location: dbProfile.location || prev.location,
                phone: dbProfile.phone || prev.phone,
                // Keep registration fields from user object
                firstName: user?.firstName || dbProfile.firstName || prev.firstName,
                lastName: user?.lastName || dbProfile.lastName || prev.lastName,
                name: user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : `${dbProfile.firstName || prev.firstName} ${dbProfile.lastName || prev.lastName}`.trim() || prev.name,
                email: user?.email || dbProfile.email || prev.email,
                collegeName: user?.collegeName || dbProfile.collegeName || prev.collegeName,
                department: user?.department || dbProfile.department || prev.department,
                graduationYear: user?.graduationYear || dbProfile.graduationYear || prev.graduationYear
              }));
            }
          } catch (err) {
            console.error('Error refreshing profile:', err);
            // Even if refresh fails, keep the local changes
            setProfileData(prev => ({
              ...prev,
              // Update only the editable fields
              currentYear: prev.currentYear,
              age: prev.age,
              skills: [...prev.skills],
              interests: [...prev.interests],
              bio: prev.bio,
              linkedin: prev.linkedin,
              github: prev.github,
              location: prev.location,
              phone: prev.phone
            }));
          }
          setIsEditing(false);
          setSuccess('');
        }, 1500);
      } else {
        // Handle validation errors
        console.log('Profile update failed:', response);
        if (response.errors && Array.isArray(response.errors)) {
          const errorMessages = response.errors.map(err => {
            if (err.param && err.msg) {
              return `${err.param}: ${err.msg}`;
            }
            return err.msg || err.message || 'Unknown error';
          }).join(', ');
          setError(`Validation error: ${errorMessages}`);
        } else if (response.message) {
          setError(`Error: ${response.message}`);
        } else {
          setError('Failed to update profile. Please check your inputs and try again.');
        }
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(`Failed to save profile changes: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = (skill) => {
    if (skill && !profileData.skills.includes(skill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
      setSkillInput('');
      setSuggestedSkills([]);
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addInterest = (interest) => {
    if (interest && !profileData.interests.includes(interest)) {
      setProfileData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
  };

  const removeInterest = (interestToRemove) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  // Handle skill input change with suggestions
  const handleSkillInputChange = (value) => {
    setSkillInput(value);
    
    if (value.length > 1) {
      const filteredSkills = COMMON_SKILLS.filter(skill => 
        skill.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      
      setSuggestedSkills(filteredSkills);
    } else {
      setSuggestedSkills([]);
    }
  };

  // Handle location input change
  const handleLocationInputChange = (value) => {
    setLocationInput(value);
    handleInputChange('location', value);
  };

  // Filter locations based on input
  const filteredLocations = LOCATIONS.filter(location => 
    location.toLowerCase().includes(locationInput.toLowerCase())
  );

  // Show loading state
  if (loading && !profileData.name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !profileData.name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              {/* Profile Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {profileData.name ? profileData.name.charAt(0) : 'G'}
                </div>
                {/* Green dot for active status */}
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              {/* Name and Role */}
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900">{profileData.name || 'Gokul Kannan'}</h1>
                <p className="text-gray-600 mt-1">
                  {profileData.department || 'Computer Science and Engineering'} Student | 
                  {profileData.collegeName || 'SSN College of Engineering'} | 
                  {profileData.currentYear || '2nd Year'}
                </p>
              </div>
            </div>
            
            {/* Edit Profile Button */}
            <button 
              onClick={handleEditClick}
              className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Personal Info */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
              
              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-center">
                  <span className="text-gray-500 mr-3">📧</span>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800">{profileData.email || '727724eucy024@skcet.ac.in'}</p>
                  </div>
                </div>
                
                {/* Phone */}
                <div className="flex items-center">
                  <span className="text-gray-500 mr-3">📱</span>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-800">{profileData.phone || 'Not provided'}</p>
                  </div>
                </div>
                
                {/* Age */}
                <div className="flex items-center">
                  <span className="text-gray-500 mr-3">🎂</span>
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="text-gray-800">{profileData.age ? `${profileData.age} years old` : 'Not provided'}</p>
                  </div>
                </div>
                
                {/* College Info */}
                <div className="flex items-center">
                  <span className="text-gray-500 mr-3">🎓</span>
                  <div>
                    <p className="text-sm text-gray-500">College</p>
                    <p className="text-gray-800">{profileData.collegeName || 'SSN College of Engineering'}</p>
                  </div>
                </div>
                
                {/* Department */}
                <div className="flex items-center">
                  <span className="text-gray-500 mr-3">💻</span>
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="text-gray-800">{profileData.department || 'Computer Science and Engineering'}</p>
                  </div>
                </div>
                
                {/* Graduation Year */}
                <div className="flex items-center">
                  <span className="text-gray-500 mr-3">🎯</span>
                  <div>
                    <p className="text-sm text-gray-500">Graduation Year</p>
                    <p className="text-gray-800">
                      {profileData.graduationYear || 
                       (profileData.currentYear && calculateGraduationYear(profileData.currentYear, profileData.department)) || 
                       'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Skills and Bio */}
            <div>
              {/* Skills Section */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills && profileData.skills.length > 0 ? (
                    profileData.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm border border-blue-200"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No skills added yet</p>
                  )}
                </div>
              </div>
              
              {/* Bio Section */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Bio</h2>
                <p className="text-gray-700 italic">
                  {profileData.bio ? `"${profileData.bio}"` : 'No bio provided yet'}
                </p>
              </div>
              
              {/* Links and Location */}
              <div className="space-y-4">
                {/* LinkedIn */}
                {profileData.linkedin && (
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-3">🔗</span>
                    <div>
                      <p className="text-sm text-gray-500">LinkedIn</p>
                      <a href={`https://${profileData.linkedin}`} className="text-blue-600 hover:underline">
                        {profileData.linkedin}
                      </a>
                    </div>
                  </div>
                )}
                
                {/* GitHub */}
                {profileData.github && (
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-3">💻</span>
                    <div>
                      <p className="text-sm text-gray-500">GitHub</p>
                      <a href={`https://${profileData.github}`} className="text-blue-600 hover:underline">
                        {profileData.github}
                      </a>
                    </div>
                  </div>
                )}
                
                {/* Location */}
                {profileData.location && (
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-3">📍</span>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-gray-800">{profileData.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Info Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Year</label>
                  <select
                    value={profileData.currentYear}
                    onChange={(e) => handleInputChange('currentYear', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Year</option>
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                  </select>
                </div>
                
                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    value={profileData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 21"
                  />
                </div>
                
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+91 98765 43210"
                  />
                </div>
                
                {/* Location */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => handleLocationInputChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Select or type location"
                    list="locations"
                  />
                  <datalist id="locations">
                    {LOCATIONS.map((location, index) => (
                      <option key={index} value={location} />
                    ))}
                  </datalist>
                  {locationInput && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {filteredLocations.map((location, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            handleInputChange('location', location);
                            setLocationInput('');
                          }}
                        >
                          {location}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Skills */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profileData.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm flex items-center border border-blue-200">
                        {skill}
                        <button 
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => handleSkillInputChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (skillInput.trim()) {
                            addSkill(skillInput.trim());
                          }
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Type a skill and press Enter"
                    />
                    {suggestedSkills.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {suggestedSkills.map((skill, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => addSkill(skill)}
                          >
                            {skill}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Interests */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profileData.interests.map((interest, index) => (
                      <span key={index} className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm flex items-center border border-blue-200">
                        {interest}
                        <button 
                          onClick={() => removeInterest(interest)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Type an interest and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (e.target.value.trim()) {
                          addInterest(e.target.value.trim());
                          e.target.value = '';
                        }
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {/* LinkedIn */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <input
                    type="text"
                    value={profileData.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="linkedin.com/in/..."
                  />
                </div>
                
                {/* GitHub */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                  <input
                    type="text"
                    value={profileData.github}
                    onChange={(e) => handleInputChange('github', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="github.com/..."
                  />
                </div>
                
                {/* Bio */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6 flex justify-end space-x-3">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;