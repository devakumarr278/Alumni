// API utility functions for the Alumni Association application
import axios from 'axios';

// Base configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic API request function
export const apiRequest = async (endpoint, options = {}) => {
  const { method = 'GET', data, params, ...otherOptions } = options;
  
  try {
    const response = await apiClient({
      url: endpoint,
      method,
      data,
      params,
      ...otherOptions,
    });
    
    return response;
  } catch (error) {
    console.error(`API Error ${method} ${endpoint}:`, error);
    throw error;
  }
};

// HTTP methods
export const get = (endpoint, params) => apiRequest(endpoint, { method: 'GET', params });
export const post = (endpoint, data) => apiRequest(endpoint, { method: 'POST', data });
export const put = (endpoint, data) => apiRequest(endpoint, { method: 'PUT', data });
export const del = (endpoint) => apiRequest(endpoint, { method: 'DELETE' });

// Auth-related API functions
export const register = async (userData) => {
  try {
    const response = await post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await post('/auth/login', credentials);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getProfile = async () => {
  try {
    const response = await get('/auth/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await put('/auth/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Event-related API functions
export const getEvents = async (params = {}) => {
  try {
    const response = await get('/events', params);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await post('/events', eventData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await put(`/events/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const response = await del(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// RSVP-related API functions
export const getRSVPs = async (eventId = null) => {
  try {
    const params = eventId ? { eventId } : {};
    const response = await get('/events/rsvps', params);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createRSVP = async (rsvpData) => {
  try {
    const response = await post('/events/rsvps', rsvpData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateRSVP = async (rsvpId, rsvpData) => {
  try {
    const response = await put(`/events/rsvps/${rsvpId}`, rsvpData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteRSVP = async (rsvpId) => {
  try {
    const response = await del(`/events/rsvps/${rsvpId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Alumni-related API functions
export const getAlumni = async (filters = {}) => {
  try {
    const response = await get('/alumni', filters);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAlumniById = async (alumniId) => {
  try {
    const response = await get(`/alumni/${alumniId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateAlumni = async (alumniId, alumniData) => {
  try {
    const response = await put(`/alumni/${alumniId}`, alumniData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Gallery-related API functions
export const getGalleryImages = async () => {
  try {
    const response = await get('/gallery');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const uploadGalleryImage = async (imageData) => {
  try {
    const response = await post('/gallery', imageData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteGalleryImage = async (imageId) => {
  try {
    const response = await del(`/gallery/${imageId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Institution-related API functions
export const getPendingAlumni = async () => {
  try {
    const response = await get('/institution/pending');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const verifyAlumni = async (alumniId, verificationData) => {
  try {
    const response = await post(`/institution/verify/${alumniId}`, verificationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getInstitutionNotifications = async () => {
  try {
    const response = await get('/institution/notifications');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Notification-related API functions
export const sendNotification = async (notificationData) => {
  try {
    const response = await post('/notifications', notificationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getNotificationHistory = async () => {
  try {
    const response = await get('/notifications');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Analytics-related API functions
export const getAnalytics = async (timeRange = 'monthly') => {
  try {
    const response = await get(`/analytics?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Mentorship summary API functions
export const getMentorshipSummary = async (timeRange = 'monthly') => {
  try {
    const response = await get(`/analytics/mentorship-summary?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Location heatmap API functions
export const getLocationHeatmap = async (timeRange = 'all') => {
  try {
    const response = await get(`/analytics/location-heatmap?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Alumni spotlight API functions
export const getAlumniSpotlight = async () => {
  try {
    const response = await get('/analytics/alumni-spotlight');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Overall analytics API functions
export const getOverallAnalytics = async () => {
  try {
    const response = await get('/analytics/overall');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Export default object with all functions
const api = {
  // Generic
  apiRequest,
  get,
  post,
  put,
  del,
  
  // Auth
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  
  // Events
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  
  // RSVPs
  getRSVPs,
  createRSVP,
  updateRSVP,
  deleteRSVP,
  
  // Alumni
  getAlumni,
  getAlumniById,
  updateAlumni,
  
  // Gallery
  getGalleryImages,
  uploadGalleryImage,
  deleteGalleryImage,
  
  // Institution
  getPendingAlumni,
  verifyAlumni,
  getInstitutionNotifications,
  
  // Notifications
  sendNotification,
  getNotificationHistory,
  
  // Analytics
  getAnalytics,
  getMentorshipSummary,
  getLocationHeatmap,
  getAlumniSpotlight,
  getOverallAnalytics
};

export default api;