import React, { useState, useEffect } from 'react';

// Sample data for companies, job titles, and locations
const COMPANY_DATA = [
  "Google",
  "Microsoft",
  "Amazon",
  "Apple",
  "Facebook",
  "IBM",
  "Oracle",
  "Accenture",
  "Deloitte",
  "TCS",
  "Infosys",
  "Wipro",
  "HCL Technologies",
  "Tech Mahindra",
  "Cognizant",
  "Capgemini",
  "Adobe",
  "Salesforce",
  "SAP",
  "Intel",
  "NVIDIA",
  "Cisco",
  "Qualcomm",
  "HP",
  "Dell",
  "Siemens",
  "GE",
  "Boeing",
  "Lockheed Martin",
  "JPMorgan Chase",
  "Goldman Sachs",
  "Morgan Stanley",
  "Bank of America",
  "Wells Fargo",
  "Citigroup",
  "HSBC",
  "Barclays",
  "UBS",
  "Credit Suisse",
  "PwC",
  "KPMG",
  "EY",
  "McKinsey & Company",
  "Boston Consulting Group",
  "Bain & Company"
];

const JOB_TITLE_DATA = [
  "Software Engineer",
  "Senior Software Engineer",
  "Tech Lead",
  "Engineering Manager",
  "Product Manager",
  "Data Scientist",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "Cloud Architect",
  "UI/UX Designer",
  "Product Designer",
  "Business Analyst",
  "Project Manager",
  "Scrum Master",
  "Quality Assurance Engineer",
  "Technical Writer",
  "Solutions Architect",
  "Security Engineer",
  "Database Administrator",
  "Network Engineer",
  "Systems Engineer",
  "Research Scientist",
  "Data Analyst",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile Developer",
  "Game Developer",
  "Embedded Systems Engineer",
  "Hardware Engineer"
];

const COMPANY_LOCATIONS = {
  "Google": ["Bangalore", "Hyderabad", "Mumbai", "Gurgaon", "Pune", "Chennai"],
  "Microsoft": ["Bangalore", "Hyderabad", "Noida", "Chennai", "Pune"],
  "Amazon": ["Bangalore", "Hyderabad", "Chennai", "Mumbai", "Pune", "Gurgaon"],
  "Apple": ["Bangalore", "Hyderabad", "Mumbai"],
  "Facebook": ["Bangalore", "Hyderabad"],
  "IBM": ["Bangalore", "Chennai", "Kolkata", "Mumbai", "Pune"],
  "TCS": ["Mumbai", "Chennai", "Kolkata", "Hyderabad", "Pune", "Bangalore", "Noida", "Gurgaon"],
  "Infosys": ["Bangalore", "Mysore", "Chennai", "Pune", "Hyderabad", "Mumbai"],
  "Wipro": ["Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Mumbai"],
  "Accenture": ["Mumbai", "Chennai", "Kolkata", "Hyderabad", "Pune", "Bangalore", "Noida", "Gurgaon"],
  "Deloitte": ["Mumbai", "Chennai", "Kolkata", "Hyderabad", "Pune", "Bangalore", "Noida"],
  "HCL Technologies": ["Noida", "Chennai", "Kolkata", "Hyderabad", "Pune", "Bangalore"],
  "Tech Mahindra": ["Pune", "Chennai", "Kolkata", "Hyderabad", "Bangalore", "Noida"],
  "Cognizant": ["Chennai", "Kolkata", "Hyderabad", "Pune", "Bangalore", "Noida"],
  "Capgemini": ["Mumbai", "Chennai", "Kolkata", "Hyderabad", "Pune", "Bangalore"],
  "Adobe": ["Bangalore", "Noida"],
  "Salesforce": ["Bangalore", "Hyderabad"],
  "SAP": ["Bangalore", "Mumbai"],
  "Intel": ["Bangalore"],
  "NVIDIA": ["Bangalore"],
  "Cisco": ["Bangalore", "Chennai"],
  "JPMorgan Chase": ["Mumbai"],
  "Goldman Sachs": ["Mumbai", "Bangalore"],
  "Morgan Stanley": ["Mumbai", "Bangalore"]
};

// Simple icon components
const User = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const Mail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const Phone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const Briefcase = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

const AlumniProfile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentPosition: '',
    company: '',
    location: '',
    bio: '',
    linkedinProfile: '',
    profileVisibility: 'public' // Default to public so students can see it
  });
  const [experiences, setExperiences] = useState([
    { id: Date.now(), company: '', role: '', location: '', experience: '', description: '', isCurrent: false }
  ]);
  const [skills, setSkills] = useState([]);
  const [availableSkills] = useState([
    'JavaScript', 'Python', 'Java', 'C++', 'React', 'Angular', 'Vue.js', 
    'Node.js', 'Express', 'MongoDB', 'SQL', 'PostgreSQL', 'AWS', 'Docker',
    'Kubernetes', 'Machine Learning', 'Data Science', 'Cybersecurity',
    'UI/UX Design', 'Project Management', 'Agile', 'Scrum'
  ]);
  const [skillSearch, setSkillSearch] = useState(''); // Add this state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Add this back
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Extract user ID from user object
  const extractUserId = (userObj) => {
    if (!userObj) return null;
    // Check different possible locations for user ID
    return userObj.id || userObj._id || userObj.userId || null;
  };

  // Fetch profile data when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Fix: The backend returns user data directly in data.data, not data.user
          setUser(data.data);
          
          // Set profile data
          setProfile({
            firstName: data.data.firstName || '',
            lastName: data.data.lastName || '',
            email: data.data.email || '',
            phone: data.data.phone || '',
            currentPosition: data.data.currentPosition || '',
            company: data.data.company || '',
            location: data.data.location || '',
            bio: data.data.bio || '',
            linkedinProfile: data.data.linkedinProfile || '',
            profileVisibility: data.data.profileVisibility || 'public'
          });
          
          // Set experiences if they exist in the profile
          if (data.data.experiences && Array.isArray(data.data.experiences)) {
            // Ensure each experience has a unique ID
            const experiencesWithIds = data.data.experiences.map((exp, index) => ({
              id: exp._id || exp.id || Date.now() + index,
              company: exp.company || '',
              role: exp.role || '',
              location: exp.location || '',
              experience: exp.experience || '',
              description: exp.description || '',
              isCurrent: exp.isCurrent || false
            }));
            setExperiences(experiencesWithIds);
          } else {
            // Initialize with default experience if none exist
            setExperiences([
              { id: Date.now(), company: '', role: '', location: '', experience: '', description: '', isCurrent: false }
            ]);
          }
          
          // Set skills if they exist in the profile
          if (data.data.skills && Array.isArray(data.data.skills)) {
            setSkills(data.data.skills);
          } else {
            setSkills([]);
          }
        } else {
          throw new Error(data.message || 'Failed to fetch profile');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  // Handle input changes for profile fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle skill search
  const handleSkillSearch = (e) => {
    setSkillSearch(e.target.value);
  };

  // Handle experience changes
  const handleExperienceChange = (id, field, value) => {
    setExperiences(prev => prev.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  // Add new experience
  const addExperience = () => {
    setExperiences(prev => [
      ...prev,
      { id: Date.now(), company: '', role: '', location: '', experience: '', description: '', isCurrent: false }
    ]);
  };

  // Remove experience
  const removeExperience = (id) => {
    if (experiences.length > 1) {
      setExperiences(prev => prev.filter(exp => exp.id !== id));
    }
  };

  // Add skill
  const addSkill = (skill) => {
    if (skill && !skills.includes(skill)) {
      setSkills(prev => [...prev, skill]);
      setSkillSearch(''); // Clear the search after adding
    }
  };

  // Remove skill
  const removeSkill = (skill) => {
    setSkills(prev => prev.filter(s => s !== skill));
  };

  // Get locations based on selected company
  const getLocationsForCompany = (company) => {
    return COMPANY_LOCATIONS[company] || [];
  };

  // Get current company and position
  const getCurrentExperience = () => {
    const currentExp = experiences.find(exp => exp.isCurrent);
    if (currentExp) {
      return {
        company: currentExp.company,
        role: currentExp.role
      };
    }
    
    // If no current experience is marked, use the last one
    if (experiences.length > 0) {
      const lastExp = experiences[experiences.length - 1];
      return {
        company: lastExp.company,
        role: lastExp.role
      };
    }
    
    return {
      company: profile.company || '',
      role: profile.currentPosition || ''
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Include experiences and skills in the profile data
      const profileData = {
        ...profile,
        experiences,
        skills
      };
      
      console.log('Sending profile data to backend:', profileData);
      
      // Use the correct endpoint for updating current user's profile
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/profile`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(profileData),
      });
      
      const data = await response.json();
      console.log('Response from backend:', data);
      
      if (data.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        // Re-fetch the profile to ensure we have the latest data
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  console.log('Rendering profile component, loading state:', loading);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <div className="ml-4 text-gray-600">Loading profile...</div>
      </div>
    );
  }

  // Extract user ID for display
  const userId = extractUserId(user);

  // If there's no user or user ID, show an error
  if (!userId) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <h2 className="text-xl font-bold text-red-800 mb-2">Authentication Required</h2>
          <p className="text-red-600">Please log in to view your profile.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // If there's an error, show it
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Profile</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Get current experience for display
  const currentExperience = getCurrentExperience();

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between border-b pb-6 mb-6">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-md">
              {profile.firstName && profile.lastName ? 
                `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}` : 
                "U"}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-gray-600 flex items-center">
                {currentExperience.role} at {currentExperience.company}
                {experiences.some(exp => exp.isCurrent) && (
                  <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </p>
            </div>
          </div>

          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="mt-5 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium shadow"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Personal Info Edit */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <User /> Personal Info
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      disabled
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      disabled
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      disabled
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Experience and Skills Edit */}
              <div className="space-y-6">
                {/* Experience Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Briefcase /> Experience
                    </h3>
                    <button 
                      type="button"
                      onClick={addExperience}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      + Add Experience
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {experiences.map((exp, index) => (
                      <div key={exp.id} className="border border-gray-200 rounded-lg p-4 relative">
                        {experiences.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExperience(exp.id)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                          >
                            ×
                          </button>
                        )}
                        
                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                            <select
                              value={exp.company}
                              onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="">Select Company</option>
                              {COMPANY_DATA.map(company => (
                                <option key={company} value={company}>{company}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select
                              value={exp.role}
                              onChange={(e) => handleExperienceChange(exp.id, 'role', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="">Select Role</option>
                              {JOB_TITLE_DATA.map(title => (
                                <option key={title} value={title}>{title}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <select
                              value={exp.location}
                              onChange={(e) => handleExperienceChange(exp.id, 'location', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              disabled={!exp.company}
                            >
                              <option value="">Select Location</option>
                              {exp.company && getLocationsForCompany(exp.company).map(location => (
                                <option key={location} value={location}>{location}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                            <input
                              type="number"
                              min="0"
                              max="50"
                              value={exp.experience}
                              onChange={(e) => handleExperienceChange(exp.id, 'experience', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Years of experience"
                            />
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`current-${exp.id}`}
                              checked={exp.isCurrent}
                              onChange={(e) => handleExperienceChange(exp.id, 'isCurrent', e.target.checked)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`current-${exp.id}`} className="ml-2 block text-sm text-gray-700">
                              Current Company
                            </label>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                              value={exp.description}
                              onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Describe your responsibilities..."
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Skills Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills</h3>
                  
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Add Skills</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={skillSearch}
                        onChange={handleSkillSearch}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Search for skills..."
                      />
                      {skillSearch && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                          {availableSkills
                            .filter(skill => skill.toLowerCase().includes(skillSearch.toLowerCase()))
                            .map(skill => (
                              <div
                                key={skill}
                                className="px-4 py-2 hover:bg-indigo-50 cursor-pointer"
                                onClick={() => addSkill(skill)}
                              >
                                {skill}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                      <span 
                        key={skill} 
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-indigo-600 hover:text-indigo-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bio Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Bio</h3>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>
            
            {/* LinkedIn Profile */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
              <input
                type="url"
                name="linkedinProfile"
                value={profile.linkedinProfile}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            {/* Form Actions */}
            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          /* View Mode */
          <>
            {/* Success message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">{success}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <User /> Personal Info
                </h3>
                <div className="text-gray-700 space-y-2">
                  <p className="flex items-center gap-2"><Mail /> {profile.email}</p>
                  <p className="flex items-center gap-2"><Phone /> {profile.phone || 'Not provided'}</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Briefcase /> Experience
                </h3>
                <div className="space-y-3">
                  {experiences.length > 0 ? (
                    experiences.map((exp, i) => (
                      <div key={i} className="border-l-4 border-indigo-500 pl-4">
                        <div className="flex items-start">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{exp.role} at {exp.company}</p>
                            <p className="text-sm text-gray-600">{exp.location} | {exp.experience} years</p>
                            <p className="text-sm text-gray-700 mt-1">{exp.description}</p>
                          </div>
                          {exp.isCurrent && (
                            <span className="ml-2 mt-1 w-2 h-2 bg-green-500 rounded-full"></span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No experience added yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills</h3>
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No skills added yet</p>
              )}
            </div>

            {/* Bio */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Bio</h3>
              <p className="text-gray-700">{profile.bio || 'No bio provided'}</p>
            </div>
            
            {/* LinkedIn Profile */}
            {profile.linkedinProfile && (
              <div className="mt-4">
                <a 
                  href={profile.linkedinProfile} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  LinkedIn Profile
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AlumniProfile;