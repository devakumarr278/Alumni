import React, { createContext, useContext, useState, useEffect } from 'react';

const StudentContext = createContext();

// Mock data for student
const mockStudentData = {
  profile: {
    id: 'stu_12345',
    name: 'John Student',
    email: 'john.student@skcet.ac.in',
    registerNumber: 'STU2024001',
    major: 'Computer Science',
    graduationYear: 2028,
    yearOfAdmission: 2024,
    phone: '+91 9876543210',
    bio: 'Passionate computer science student with interest in AI and Machine Learning. Experienced in web development and mobile apps.',
    skills: ['JavaScript', 'Python', 'React', 'Node.js', 'Machine Learning', 'Data Analysis', 'UI/UX Design'],
    domain: 'Software Development',
    timeZone: 'Asia/Kolkata',
    interests: ['Artificial Intelligence', 'Web Development', 'Open Source', 'Hackathons', 'Mentoring'],
    careerGoals: 'Become a Machine Learning Engineer working on innovative AI solutions',
    consentSettings: {
      allowMentorship: true,
      shareProfile: true,
      allowContact: true
    },
    completeness: 85
  },
  connections: {
    alumni: 12,
    students: 8,
    recent: [
      { name: 'Sarah Johnson', title: 'Senior Software Engineer at Google', connectedDate: '2024-01-20' },
      { name: 'Michael Chen', title: 'Product Manager at Microsoft', connectedDate: '2024-01-15' },
      { name: 'Emma Patel', title: 'Data Scientist at Amazon', connectedDate: '2024-01-10' }
    ]
  },
  mentorship: {
    activeMentors: 3,
    pendingRequests: 1,
    nextSession: 'Tomorrow, 3:00 PM',
    requests: [
      {
        id: 'req_1',
        mentorName: 'Dr. Priya Sharma',
        status: 'pending',
        requestDate: '2024-01-15',
        message: 'Looking for guidance on career paths in AI.'
      }
    ]
  },
  jobs: {
    applications: 5,
    interviews: 2,
    newOpportunities: 8
  },
  events: {
    upcoming: 4,
    registered: 2,
    nextEvent: 'Tech Talk: Future of AI'
  },
  badges: {
    earned: 7,
    rank: 12,
    points: 245,
    mentorshipSessions: 2,
    verificationRequests: []
  },
  activityTimeline: [
    { id: 1, type: 'badge', title: 'Profile Complete', description: 'Completed your profile', date: '2024-01-10', icon: '📋' },
    { id: 2, type: 'event', title: 'Tech Conference', description: 'Attended annual tech conference', date: '2024-01-15', icon: '📅' },
    { id: 3, type: 'connection', title: 'New Connection', description: 'Connected with Sarah Johnson', date: '2024-01-20', icon: '🤝' },
  ]
};

// Mock badges data
const mockBadges = [
  {
    id: 'badge_1',
    name: 'Profile Complete',
    description: 'Complete your profile with all details',
    icon: '📋',
    earnedDate: '2024-01-10',
    type: 'profile'
  },
  {
    id: 'badge_2',
    name: 'First Connection',
    description: 'Connect with your first alumni',
    icon: '🤝',
    earnedDate: '2024-01-12',
    type: 'connection'
  },
  {
    id: 'badge_3',
    name: 'Event Explorer',
    description: 'Register for 3 events',
    icon: '📅',
    earnedDate: '2024-01-15',
    type: 'event'
  }
];

export const StudentProvider = ({ children }) => {
  const [studentData, setStudentData] = useState(mockStudentData);
  const [badges, setBadges] = useState(mockBadges);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Add sidebar state

  // Load data from localStorage on app start
  useEffect(() => {
    try {
      const savedStudentData = localStorage.getItem('studentData');
      const savedBadges = localStorage.getItem('studentBadges');
      // Load sidebar state from localStorage
      const savedSidebarState = localStorage.getItem('studentSidebarOpen');
      if (savedSidebarState !== null) {
        setIsSidebarOpen(JSON.parse(savedSidebarState));
      }
      
      if (savedStudentData) {
        try {
          const parsedData = JSON.parse(savedStudentData);
          // Ensure badges.verificationRequests exists
          if (parsedData.badges && !parsedData.badges.verificationRequests) {
            parsedData.badges.verificationRequests = [];
          }
          // Ensure other required properties exist
          if (!parsedData.badges) {
            parsedData.badges = {
              earned: 0,
              rank: 0,
              points: 0,
              mentorshipSessions: 0,
              verificationRequests: []
            };
          }
          setStudentData(parsedData);
        } catch (error) {
          console.error('Error parsing saved student data:', error);
          localStorage.removeItem('studentData');
        }
      }
      
      if (savedBadges) {
        try {
          const parsedBadges = JSON.parse(savedBadges);
          // Validate that parsedBadges is an array
          if (Array.isArray(parsedBadges)) {
            setBadges(parsedBadges);
          } else {
            console.error('Saved badges data is not an array, using mock data');
            setBadges(mockBadges);
          }
        } catch (error) {
          console.error('Error parsing saved badges:', error);
          localStorage.removeItem('studentBadges');
          setBadges(mockBadges);
        }
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      // Fallback to mock data
      setStudentData(mockStudentData);
      setBadges(mockBadges);
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('studentData', JSON.stringify(studentData));
    } catch (error) {
      console.error('Error saving studentData to localStorage:', error);
    }
  }, [studentData]);

  useEffect(() => {
    try {
      localStorage.setItem('studentBadges', JSON.stringify(badges));
    } catch (error) {
      console.error('Error saving badges to localStorage:', error);
    }
  }, [badges]);

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('studentSidebarOpen', JSON.stringify(isSidebarOpen));
    } catch (error) {
      console.error('Error saving sidebar state to localStorage:', error);
    }
  }, [isSidebarOpen]);

  // Update profile
  const updateProfile = (profileData) => {
    try {
      setStudentData(prev => {
        if (!prev) return { ...mockStudentData, profile: { ...mockStudentData.profile, ...profileData } };
        
        return {
          ...prev,
          profile: {
            ...prev.profile,
            ...profileData,
            // Calculate completeness based on filled fields
            completeness: calculateProfileCompleteness({ ...prev.profile, ...profileData })
          }
        };
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Calculate profile completeness
  const calculateProfileCompleteness = (profile) => {
    try {
      const fields = [
        profile.name,
        profile.email,
        profile.major,
        profile.graduationYear,
        profile.phone,
        profile.bio,
        profile.skills && profile.skills.length > 0,
        profile.domain,
        profile.interests && profile.interests.length > 0
      ];
      
      const filledFields = fields.filter(field => field).length;
      return Math.round((filledFields / fields.length) * 100);
    } catch (error) {
      console.error('Error calculating profile completeness:', error);
      return 0;
    }
  };

  // Get user badges
  const getUserBadges = () => {
    try {
      return badges || [];
    } catch (error) {
      console.error('Error getting user badges:', error);
      return [];
    }
  };

  // Add mentorship request
  const addMentorshipRequest = (requestData) => {
    try {
      const newRequest = {
        id: `req_${Date.now()}`,
        ...requestData,
        status: 'pending',
        requestDate: new Date().toISOString()
      };
      
      setStudentData(prev => {
        if (!prev) return mockStudentData;
        
        return {
          ...prev,
          mentorship: {
            ...prev.mentorship,
            requests: [...(prev.mentorship?.requests || []), newRequest],
            pendingRequests: (prev.mentorship?.pendingRequests || 0) + 1
          }
        };
      });
    } catch (error) {
      console.error('Error adding mentorship request:', error);
    }
  };

  // Update mentorship request
  const updateMentorshipRequest = (requestId, status) => {
    try {
      setStudentData(prev => {
        if (!prev) return mockStudentData;
        
        const updatedRequests = (prev.mentorship?.requests || []).map(request => 
          request.id === requestId ? { ...request, status } : request
        );
        
        return {
          ...prev,
          mentorship: {
            ...prev.mentorship,
            requests: updatedRequests,
            pendingRequests: status === 'pending' 
              ? prev.mentorship?.pendingRequests 
              : Math.max(0, (prev.mentorship?.pendingRequests || 0) - 1),
            activeMentors: status === 'accepted' 
              ? (prev.mentorship?.activeMentors || 0) + 1 
              : prev.mentorship?.activeMentors
          }
        };
      });
    } catch (error) {
      console.error('Error updating mentorship request:', error);
    }
  };

  // Complete mentorship session
  const completeMentorshipSession = () => {
    try {
      setStudentData(prev => {
        if (!prev) return mockStudentData;
        
        const newSessions = (prev.badges?.mentorshipSessions || 0) + 1;
        const newPoints = (prev.badges?.points || 0) + 20;
        
        // Check if user should earn "Mentor Ready" badge
        let updatedBadges = [...badges];
        if (newSessions >= 3 && !badges.find(b => b.id === 'badge_mentor_ready')) {
          updatedBadges.push({
            id: 'badge_mentor_ready',
            name: 'Mentor Ready',
            description: 'Complete 3 mentorship sessions',
            icon: '🎓',
            earnedDate: new Date().toISOString(),
            type: 'mentorship'
          });
          setBadges(updatedBadges);
        }
        
        return {
          ...prev,
          badges: {
            ...prev.badges,
            mentorshipSessions: newSessions,
            points: newPoints
          }
        };
      });
    } catch (error) {
      console.error('Error completing mentorship session:', error);
    }
  };

  // Submit verification request
  const submitVerificationRequest = (badgeType, documents) => {
    try {
      // In a real app, this would send to a server
      console.log('Verification request submitted:', { badgeType, documents });
      
      // Add the verification request to the student data
      const newRequest = {
        id: `vr_${Date.now()}`,
        badgeType,
        submissionDate: new Date().toISOString(),
        status: 'pending',
        documents
      };
      
      setStudentData(prev => {
        if (!prev) return mockStudentData;
        
        return {
          ...prev,
          badges: {
            ...prev.badges,
            verificationRequests: [...(prev.badges?.verificationRequests || []), newRequest]
          }
        };
      });
      
      // Simulate processing delay
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, message: 'Verification request submitted successfully!' });
        }, 1000);
      });
    } catch (error) {
      console.error('Error submitting verification request:', error);
      return Promise.reject(error);
    }
  };

  // Check if user has a specific badge
  const hasUserBadge = (badgeType) => {
    try {
      return badges.some(badge => badge.type === badgeType);
    } catch (error) {
      console.error('Error checking user badge:', error);
      return false;
    }
  };

  const value = {
    studentData: studentData || mockStudentData,
    badges: badges || mockBadges,
    updateProfile,
    getUserBadges,
    addMentorshipRequest,
    updateMentorshipRequest,
    completeMentorshipSession,
    submitVerificationRequest,
    hasUserBadge,
    isSidebarOpen, // Export sidebar state
    setIsSidebarOpen // Export sidebar state setter
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
};

// Custom hook with proper error handling
export function useStudent() {
  try {
    const context = useContext(StudentContext);
    return context;
  } catch (error) {
    console.error('Error in useStudent hook:', error);
    return null;
  }
}

export default StudentContext;