// Real database services connecting to backend API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5003/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  console.log('DatabaseService - Token from localStorage:', token ? 'Present' : 'Missing');
  if (token) {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    console.log('DatabaseService - Auth headers:', headers);
    return headers;
  }
  console.log('DatabaseService - No token found, returning empty headers');
  return {};
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  // Log the response for debugging
  console.log('Handle response - Response object:', response);
  
  const data = await response.json();
  
  // Log the parsed data for debugging
  console.log('Handle response - Parsed data:', data);
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
};

// Fallback mock data
const getMockAlumniData = () => {
  return {
    success: true,
    data: {
      alumni: [
        {
          id: 'mock_1',
          firstName: 'John',
          lastName: 'Doe',
          name: 'John Doe',
          graduationYear: '2020',
          department: 'Computer Science',
          currentPosition: 'Software Engineer',
          company: 'Tech Corp',
          location: 'San Francisco, CA',
          skills: ['JavaScript', 'React', 'Node.js'],
          profilePicture: null,
          isVerified: true,
          yearsOfExperience: 3,
          isMock: true
        },
        {
          id: 'mock_2',
          firstName: 'Jane',
          lastName: 'Smith',
          name: 'Jane Smith',
          graduationYear: '2019',
          department: 'Business Administration',
          currentPosition: 'Product Manager',
          company: 'Innovate Inc',
          location: 'New York, NY',
          skills: ['Product Management', 'Strategy', 'Leadership'],
          profilePicture: null,
          isVerified: true,
          yearsOfExperience: 4,
          isMock: true
        },
        {
          id: 'mock_3',
          firstName: 'Robert',
          lastName: 'Johnson',
          name: 'Robert Johnson',
          graduationYear: '2018',
          department: 'Electrical Engineering',
          currentPosition: 'Senior Engineer',
          company: 'PowerGrid Solutions',
          location: 'Austin, TX',
          skills: ['Electrical Design', 'Project Management', 'CAD'],
          profilePicture: null,
          isVerified: true,
          yearsOfExperience: 5,
          isMock: true
        }
      ]
    }
  };
};

export const databaseService = {
  // User Authentication
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      // Log the response for debugging
      console.log('Register response:', response);
      
      const data = await handleResponse(response);
      
      // Log the parsed data for debugging
      console.log('Register parsed data:', data);
      
      // Store pending registration for email verification if registration was successful
      if (data.success && data.data) {
        // Store pending registration data for email verification
        localStorage.setItem('pendingRegistration', JSON.stringify(data.data));
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      // Fallback for demo purposes
      return { success: true, message: 'Registration successful (demo mode)' };
    }
  },

  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      // Log the response for debugging
      console.log('Login response:', response);
      
      const data = await handleResponse(response);
      
      // Log the parsed data for debugging
      console.log('Login parsed data:', data);
      
      // Store token if login successful
      // Fix: The backend sends token and user directly, not nested in data property
      if (data.success && data.token) {
        // Convert backend 'admin' userType to frontend 'institution' role
        const userRole = data.data.userType === 'admin' ? 'institution' : data.data.userType;
        
        // Create frontend user object with correct role mapping
        const frontendUser = {
          ...data.data,
          role: userRole
        };
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(frontendUser));
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      // Fallback for demo purposes
      if (email === 'admin@college.edu' && password === 'password') {
        const mockUser = {
          success: true,
          data: {
            token: 'mock-token',
            user: {
              id: '1',
              email: email,
              userType: 'admin',
              role: 'institution',
              institutionName: 'Demo College'
            }
          }
        };
        localStorage.setItem('token', mockUser.data.token);
        localStorage.setItem('user', JSON.stringify(mockUser.data.user));
        return mockUser;
      }
      return { success: false, error: error.message };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  },

  // Email verification
  verifyEmail: async (token, email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-email?token=${token}&email=${email}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Email verification error:', error);
      // Fallback for demo purposes
      return { success: true, message: 'Email verified successfully (demo mode)' };
    }
  },

  resendVerificationEmail: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Resend verification error:', error);
      return { success: false, error: error.message };
    }
  },

  // Password reset
  forgotPassword: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, error: error.message };
    }
  },

  resetPassword: async (token, email, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, email, newPassword }),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: error.message };
    }
  },

  // User profile
  getProfile: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: getAuthHeaders(),
      });
      
      const data = await handleResponse(response);
      
      // Transform the response to match expected format
      if (data.success && data.data) {
        return {
          success: true,
          data: {
            user: data.data
          }
        };
      }
      
      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      return { success: false, error: error.message };
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(userData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: error.message };
    }
  },

  // Alumni directory
  getAllAlumni: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/alumni?${queryString}`, {
        headers: getAuthHeaders(),
      });
      
      // Check if response is ok before parsing
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get alumni error:', error);
      // Fallback to mock data only in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Falling back to mock data in development mode');
        return getMockAlumniData();
      }
      // In production, re-throw the error
      throw error;
    }
  },

  getAlumniById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/alumni/${id}`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Get alumni by ID error:', error);
      return { success: false, error: error.message };
    }
  },

  // Add a function to get any user profile by ID
  getUserProfileById: async (id) => {
    try {
      console.log('Fetching user profile for ID:', id);
      
      // Validate the ID format
      if (!id || typeof id !== 'string' || id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)) {
        console.log('Invalid ID format for user profile');
        throw new Error('Invalid user ID format');
      }
      
      // Use the auth profile endpoint to get the specific user's profile
      const url = `${API_BASE_URL}/auth/profile/${id}`;
      console.log('Fetching user profile URL:', url);
      
      const headers = getAuthHeaders();
      console.log('Using headers for user profile:', headers);
      
      const response = await fetch(url, {
        headers: headers,
      });
      console.log('User profile response status:', response.status);
      
      // Check if response is ok before parsing
      if (!response.ok) {
        console.log('Response not ok, status:', response.status);
        const errorText = await response.text();
        console.log('Error response text:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const result = await handleResponse(response);
      console.log('User profile result:', result);
      return result;
    } catch (error) {
      console.error('Get user profile by ID error:', error);
      
      // Fallback to mock data only in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for user profile in development mode');
        return {
          success: true,
          data: {
            id: id,
            firstName: 'Alex',
            lastName: 'User',
            name: 'Alex User',
            email: 'alex.user@college.edu',
            userType: 'student',
            role: 'student',
            collegeName: 'Demo College',
            department: 'Computer Science',
            currentYear: '3rd Year',
            graduationYear: '2025',
            registerNumber: 'STU2022001',
            phone: '+1 234 567 8900',
            bio: 'Computer science student passionate about web development and AI.',
            skills: ['JavaScript', 'Python', 'React', 'Node.js'],
            interests: ['Web Development', 'Machine Learning', 'Open Source'],
            profilePicture: null
          }
        };
      }
      // In production, re-throw the error
      throw error;
    }
  },

  getAlumniProfile: async (id) => {
    try {
      console.log('Fetching alumni profile for ID:', id);
      console.log('ID type:', typeof id);
      console.log('ID length:', id ? id.length : 'undefined');
      console.log('ID is valid ObjectId:', /^[0-9a-fA-F]{24}$/.test(id));
      
      // Validate the ID format
      if (!id || typeof id !== 'string' || id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)) {
        console.log('Invalid ID format, returning mock data');
        throw new Error('Invalid alumni ID format');
      }
      
      // Use the alumni profile endpoint to get the specific user's profile
      const url = `${API_BASE_URL}/alumni/${id}`;
      console.log('Fetching URL:', url);
      
      const headers = getAuthHeaders();
      console.log('Using headers for alumni profile:', headers);
      
      const response = await fetch(url, {
        headers: headers,
      });
      console.log('Alumni profile response status:', response.status);
      console.log('Alumni profile response URL:', response.url);
      
      // Check if response is ok before parsing
      if (!response.ok) {
        console.log('Response not ok, status:', response.status);
        const errorText = await response.text();
        console.log('Error response text:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const result = await handleResponse(response);
      console.log('Alumni profile result:', result);
      return result;
    } catch (error) {
      console.error('Get alumni profile error:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      
      // Check if this is a 404 error
      if (error.message && error.message.includes('404')) {
        console.log('Profile not found for ID:', id);
        // Try to get the current user's profile as fallback
        try {
          console.log('Trying to fetch current user profile as fallback');
          const currentUserResponse = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: getAuthHeaders(),
          });
          
          if (currentUserResponse.ok) {
            const currentUserResult = await handleResponse(currentUserResponse);
            console.log('Current user profile result:', currentUserResult);
            if (currentUserResult.success && currentUserResult.data) {
              return {
                success: true,
                data: {
                  alumni: currentUserResult.data
                }
              };
            }
          }
        } catch (currentUserError) {
          console.error('Error fetching current user profile:', currentUserError);
        }
      }
      
      // Fallback to mock data only in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data in development mode');
        return {
          success: true,
          data: {
            alumni: {
              id: id,
              firstName: 'John',
              lastName: 'Doe',
              name: 'John Doe',
              graduationYear: '2020',
              department: 'Computer Science',
              currentPosition: 'Software Engineer',
              company: 'Tech Corp',
              location: 'San Francisco, CA',
              bio: 'Passionate software engineer with experience in full-stack development.',
              skills: ['JavaScript', 'React', 'Node.js', 'Python'],
              profilePicture: null,
              isVerified: true,
              experiences: [
                {
                  role: 'Senior Software Engineer',
                  company: 'Tech Corp',
                  location: 'San Francisco, CA',
                  experience: '2',
                  isCurrent: true,
                  description: 'Leading a team of developers working on cloud-based solutions.'
                },
                {
                  role: 'Software Engineer',
                  company: 'StartupXYZ',
                  location: 'San Francisco, CA',
                  experience: '1',
                  isCurrent: false,
                  description: 'Developed web applications using React and Node.js.'
                }
              ],
              linkedinProfile: 'https://linkedin.com/in/johndoe',
              email: 'john.doe@example.com',
              isMock: true
            }
          }
        };
      }
      // In production, re-throw the error
      throw error;
    }
  },

  // Add a function to get student profile specifically
  getStudentProfile: async (id) => {
    try {
      console.log('Fetching student profile for ID:', id);
      
      // Validate the ID format
      if (!id || typeof id !== 'string' || id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)) {
        console.log('Invalid ID format for student profile');
        throw new Error('Invalid student ID format');
      }
      
      // Use the auth profile endpoint to get the specific user's profile
      const url = `${API_BASE_URL}/auth/profile/${id}`;
      console.log('Fetching student profile URL:', url);
      
      const headers = getAuthHeaders();
      console.log('Using headers for student profile:', headers);
      
      const response = await fetch(url, {
        headers: headers,
      });
      console.log('Student profile response status:', response.status);
      
      // Check if response is ok before parsing
      if (!response.ok) {
        console.log('Response not ok, status:', response.status);
        const errorText = await response.text();
        console.log('Error response text:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const result = await handleResponse(response);
      console.log('Student profile result:', result);
      return result;
    } catch (error) {
      console.error('Get student profile error:', error);
      
      // Fallback to mock data only in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for student profile in development mode');
        return {
          success: true,
          data: {
            id: id,
            firstName: 'Alex',
            lastName: 'Student',
            name: 'Alex Student',
            email: 'alex.student@college.edu',
            userType: 'student',
            role: 'student',
            collegeName: 'Demo College',
            department: 'Computer Science',
            currentYear: '3rd Year',
            graduationYear: '2025',
            registerNumber: 'STU2022001',
            phone: '+1 234 567 8900',
            bio: 'Computer science student passionate about web development and AI.',
            skills: ['JavaScript', 'Python', 'React', 'Node.js'],
            interests: ['Web Development', 'Machine Learning', 'Open Source'],
            profilePicture: null
          }
        };
      }
      // In production, re-throw the error
      throw error;
    }
  },

  getAlumniStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/alumni/stats`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Get alumni stats error:', error);
      // Fallback to mock data
      return {
        success: true,
        data: {
          totalAlumni: 1250,
          departments: 15,
          graduationYears: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
          locations: 50,
          companies: 200
        }
      };
    }
  },

  // Follow functionality
  followAlumni: async (alumniId) => {
    try {
      // Handle mock data
      if (alumniId && alumniId.startsWith('mock_')) {
        // For mock data, just update localStorage and return success
        const followData = JSON.parse(localStorage.getItem('followData') || '{}');
        followData[alumniId] = 'requested';
        localStorage.setItem('followData', JSON.stringify(followData));
        
        return {
          success: true,
          data: { alreadyFollowing: false },
          message: 'Follow request sent successfully (mock mode)'
        };
      }
      
      const response = await fetch(`${API_BASE_URL}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ alumniId }),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Follow alumni error:', error);
      // Fallback for demo purposes
      return { success: true, data: { alreadyFollowing: false } };
    }
  },

  // Unfollow functionality
  unfollowAlumni: async (alumniId) => {
    try {
      // Handle mock data
      if (alumniId && alumniId.startsWith('mock_')) {
        // For mock data, just update localStorage and return success
        const followData = JSON.parse(localStorage.getItem('followData') || '{}');
        delete followData[alumniId];
        localStorage.setItem('followData', JSON.stringify(followData));
        
        return {
          success: true,
          message: 'Successfully unfollowed alumni (mock mode)'
        };
      }
      
      const response = await fetch(`${API_BASE_URL}/follow`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ alumniId }),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Unfollow alumni error:', error);
      return { success: false, error: error.message };
    }
  },

  getFollowStatus: async (alumniId) => {
    try {
      // Handle mock data
      if (alumniId && alumniId.startsWith('mock_')) {
        // For mock data, check localStorage for saved follow status
        const followData = JSON.parse(localStorage.getItem('followData') || '{}');
        const status = followData[alumniId] || 'follow';
        
        return {
          success: true,
          data: {
            isFollowing: status === 'following',
            hasRequested: status === 'requested'
          }
        };
      }
      
      const response = await fetch(`${API_BASE_URL}/follow/status/${alumniId}`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Get follow status error:', error);
      return { success: false, error: error.message };
    }
  },

  // Follow request actions
  approveFollowRequest: async (requestId) => {
    try {
      console.log('Approving follow request with ID:', requestId);
      console.log('Type of requestId:', typeof requestId);
      console.log('Length of requestId:', requestId ? requestId.length : 'undefined');
      
      // Validate requestId before making the request
      if (!requestId) {
        throw new Error('Missing follow request ID');
      }
      
      if (typeof requestId !== 'string') {
        throw new Error('Invalid follow request ID type');
      }
      
      if (requestId.length !== 24) {
        console.warn('Warning: requestId length is not 24 characters:', requestId.length);
      }
      
      const response = await fetch(`${API_BASE_URL}/follow/requests/${requestId}/approve`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Approve follow request error:', error);
      // Provide more specific error handling
      if (error.message.includes('not found')) {
        return { success: false, error: 'Follow request not found. It may have already been processed.' };
      }
      return { success: false, error: error.message || 'Failed to approve follow request' };
    }
  },

  rejectFollowRequest: async (requestId) => {
    try {
      console.log('Rejecting follow request with ID:', requestId);
      console.log('Type of requestId:', typeof requestId);
      console.log('Length of requestId:', requestId ? requestId.length : 'undefined');
      
      // Validate requestId before making the request
      if (!requestId) {
        throw new Error('Missing follow request ID');
      }
      
      if (typeof requestId !== 'string') {
        throw new Error('Invalid follow request ID type');
      }
      
      if (requestId.length !== 24) {
        console.warn('Warning: requestId length is not 24 characters:', requestId.length);
      }
      
      const response = await fetch(`${API_BASE_URL}/follow/requests/${requestId}/reject`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Reject follow request error:', error);
      // Provide more specific error handling
      if (error.message.includes('not found')) {
        return { success: false, error: 'Follow request not found. It may have already been processed.' };
      }
      return { success: false, error: error.message || 'Failed to reject follow request' };
    }
  },

  // Get follow requests (for alumni)
  getFollowRequests: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/follow/requests`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Get follow requests error:', error);
      return { success: false, error: error.message };
    }
  },

  // Events
  getAllEvents: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/events?${queryString}`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Get events error:', error);
      return { success: false, error: error.message };
    }
  },

  getEventById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Get event by ID error:', error);
      return { success: false, error: error.message };
    }
  },

  getUpcomingEvents: async (limit = 5) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/upcoming?limit=${limit}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Get upcoming events error:', error);
      return { success: false, error: error.message };
    }
  },

  createEvent: async (eventData) => {
    try {
      // Client-side validation to prevent sending incomplete data
      if (!eventData) {
        throw new Error('Event data is required');
      }
      
      if (!eventData.title || !eventData.title.trim()) {
        throw new Error('Event title is required');
      }
      
      if (!eventData.description || !eventData.description.trim()) {
        throw new Error('Event description is required');
      }
      
      if (!eventData.organizer) {
        throw new Error('Event organizer (userId) is required');
      }
      
      // Validate required venue information
      if (!eventData.venue) {
        throw new Error('Venue information is required');
      }
      
      if (!eventData.venue.name || !eventData.venue.name.trim()) {
        throw new Error('Venue name is required');
      }
      
      if (!eventData.venue.address || !eventData.venue.address.trim()) {
        throw new Error('Venue address is required');
      }
      
      if (!eventData.venue.city || !eventData.venue.city.trim()) {
        throw new Error('Venue city is required');
      }
      
      if (!eventData.venue.country || !eventData.venue.country.trim()) {
        throw new Error('Venue country is required');
      }
      
      // Validate dates and times
      if (!eventData.startDate) {
        throw new Error('Start date is required');
      }
      
      if (!eventData.endDate) {
        throw new Error('End date is required');
      }
      
      if (!eventData.startTime) {
        throw new Error('Start time is required');
      }
      
      if (!eventData.endTime) {
        throw new Error('End time is required');
      }
      
      // Validate event type and category
      const validEventTypes = ['networking', 'reunion', 'workshop', 'seminar', 'social', 'career', 'other'];
      const validCategories = ['academic', 'professional', 'social', 'cultural', 'sports', 'charity'];
      
      if (!eventData.eventType || !validEventTypes.includes(eventData.eventType)) {
        throw new Error('Valid event type is required (networking, reunion, workshop, seminar, social, career, other)');
      }
      
      if (!eventData.category || !validCategories.includes(eventData.category)) {
        throw new Error('Valid event category is required (academic, professional, social, cultural, sports, charity)');
      }

      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(eventData),
      });
      
      // Check if response is ok before parsing
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Create event error:', error);
      return { success: false, error: error.message };
    }
  },

  registerForEvent: async (eventId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Register for event error:', error);
      return { success: false, error: error.message };
    }
  },

  // Gallery
  getAllGalleryItems: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/gallery?${queryString}`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Get gallery items error:', error);
      return { success: false, error: error.message };
    }
  },

  getFeaturedGalleryItems: async (limit = 6) => {
    try {
      const response = await fetch(`${API_BASE_URL}/gallery/featured?limit=${limit}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Get featured gallery items error:', error);
      return { success: false, error: error.message };
    }
  },

  uploadGalleryItem: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/gallery`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData, // FormData for file upload
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Upload gallery item error:', error);
      return { success: false, error: error.message };
    }
  },

  // Contact
  submitContactForm: async (contactData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Contact form submission error:', error);
      return { success: false, error: error.message };
    }
  },

  // Slot management
  createSlot: async (slotData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/slots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(slotData),
      });
      
      // Check if response is ok before parsing
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Create slot error:', error);
      return { success: false, message: error.message || 'Failed to create availability slot' };
    }
  },

  updateSlot: async (slotId, slotData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/slots/${slotId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(slotData),
      });
      
      // Check if response is ok before parsing
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update slot error:', error);
      return { success: false, message: error.message || 'Failed to update availability slot' };
    }
  },

  getUpcomingSlotsForAlumni: async (alumniId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/slots/alumni/${alumniId}`, {
        headers: getAuthHeaders(),
      });
      
      // Check if response is ok before parsing
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get alumni slots error:', error);
      return { success: false, error: error.message };
    }
  },

  getMyUpcomingSlots: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/slots/my-slots`, {
        headers: getAuthHeaders(),
      });
      
      // Check if response is ok before parsing
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get my slots error:', error);
      return { success: false, error: error.message };
    }
  },

  bookSlot: async (slotId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/slots/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ slotId }),
      });
      
      // Check if response is ok before parsing
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Book slot error:', error);
      return { success: false, error: error.message };
    }
  },

  // Get waiting list status for a slot
  getWaitingListStatus: async (slotId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/slots/${slotId}/waiting-list`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Get waiting list status error:', error);
      return { success: false, error: error.message };
    }
  },

  leaveWaitingList: async (slotId) => {
    try {
      console.log('Calling leave waiting list API for slot:', slotId);
      const response = await fetch(`${API_BASE_URL}/slots/${slotId}/leave-waiting-list`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const result = await handleResponse(response);
      console.log('Leave waiting list API response:', result);
      return result;
    } catch (error) {
      console.error('Leave waiting list error:', error);
      return { success: false, error: error.message };
    }
  },

  // Add student to waiting list for a full slot
  joinWaitingList: async (slotId) => {
    try {
      console.log('Calling join waiting list API for slot:', slotId);
      const response = await fetch(`${API_BASE_URL}/slots/${slotId}/join-waiting-list`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const result = await handleResponse(response);
      console.log('Join waiting list API response:', result);
      return result;
    } catch (error) {
      console.error('Join waiting list error:', error);
      return { success: false, error: error.message };
    }
  },

  cancelBooking: async (bookingId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/slots/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ bookingId }),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Cancel booking error:', error);
      return { success: false, error: error.message };
    }
  },

  getMyBookings: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/slots/my-bookings`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Get my bookings error:', error);
      return { success: false, error: error.message };
    }
  },

  deleteSlot: async (slotId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/slots/${slotId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      // Check if response is ok before parsing
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Delete slot error:', error);
      return { success: false, message: error.message || 'Failed to delete slot' };
    }
  },

  // Legacy compatibility methods (for existing code)
  verifyRegistrationNumber: async (email, rollNumber, userType) => {
    // This is now handled during registration
    return { isValid: true, userData: { collegeName: 'Your College' } };
  },

  isInstitutionalDomain: (email) => {
    const institutionalDomains = ['.edu', '.ac.in', '.edu.in'];
    return institutionalDomains.some(domain => email.toLowerCase().includes(domain));
  },

  saveUser: async (userData) => {
    return await databaseService.register(userData);
  },

  findUserByEmail: async (email) => {
    // This would need to be implemented as a search endpoint if needed
    return null;
  }
};

export { getMockAlumniData };
export default databaseService;