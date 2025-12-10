// Connection service to interact with the backend API for alumni-student connections
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5003/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
  return {};
};

// Connect with a student (send connection request)
export const connectWithStudent = async (studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/connections/connect`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ studentId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to connect with student');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error connecting with student:', error);
    return { success: false, error: error.message };
  }
};

// Get connection status with a student
export const getConnectionStatus = async (studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/connections/status/${studentId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get connection status');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error getting connection status:', error);
    return { success: false, error: error.message };
  }
};

// Get all connections for the current alumni
export const getConnections = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/connections`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get connections');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error getting connections:', error);
    return { success: false, error: error.message };
  }
};

// Accept a connection request from a student
export const acceptConnection = async (connectionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/connections/${connectionId}/accept`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to accept connection');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error accepting connection:', error);
    return { success: false, error: error.message };
  }
};

// Reject a connection request from a student
export const rejectConnection = async (connectionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/connections/${connectionId}/reject`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to reject connection');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error rejecting connection:', error);
    return { success: false, error: error.message };
  }
};