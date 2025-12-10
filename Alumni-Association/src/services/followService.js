// Follow service to interact with the backend API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5003/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token ? 'Present' : 'Missing');
  if (token) {
    const headers = { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    console.log('Auth headers:', headers);
    return headers;
  }
  console.log('No token found, returning empty headers');
  return {};
};

// Get follow requests
export const getFollowRequests = async () => {
  try {
    console.log('Fetching follow requests...');
    const headers = getAuthHeaders();
    console.log('Using headers:', headers);
    
    const response = await fetch(`${API_BASE_URL}/follow/requests`, {
      method: 'GET',
      headers: headers
    });
    
    console.log('Follow requests response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Follow requests data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching follow requests:', error);
    throw error;
  }
};

// Get followers
export const getFollowers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/follow/followers`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Followers data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching followers:', error);
    throw error;
  }
};

// Accept follow request
export const acceptFollowRequest = async (requestId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/follow/requests/${requestId}/approve`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error accepting follow request:', error);
    throw error;
  }
};

// Reject follow request
export const rejectFollowRequest = async (requestId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/follow/requests/${requestId}/reject`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error rejecting follow request:', error);
    throw error;
  }
};