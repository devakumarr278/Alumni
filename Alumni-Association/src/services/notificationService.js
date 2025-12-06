// Notification service for handling frontend notifications
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
};

export const notificationService = {
  // Get all notifications for the current user
  getNotifications: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: getAuthHeaders(),
      });
      const result = await handleResponse(response);
      
      // Log the notifications for debugging
      console.log('Received notifications from backend:', result);
      if (result.success && result.data && result.data.notifications) {
        console.log('Notification details:', result.data.notifications.map(n => ({
          id: n._id,
          type: n.type,
          referenceId: n.referenceId,
          referenceIdType: typeof n.referenceId,
          title: n.title,
          message: n.message
        })));
      }
      
      return result;
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  },

  // Mark a notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Mark notification as read error:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Mark all notifications as read error:', error);
      throw error;
    }
  },

  // Get unread notifications count
  getUnreadCount: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Get unread count error:', error);
      throw error;
    }
  },

  // Sort notifications according to the specified logic
  sortNotifications: (notifications) => {
    return [...notifications].sort((a, b) => {
      // Follow requests always come first
      if (a.type === 'follow_request' && b.type !== 'follow_request') return -1;
      if (b.type === 'follow_request' && a.type !== 'follow_request') return 1;
      
      // Mentorship requests sorted by priority
      if (a.type === 'mentorship_request' && b.type === 'mentorship_request') {
        const priorityOrder = { 'urgent': 1, 'high': 2, 'medium': 3, 'low': 4 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      
      // Default: sort by time (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }
};

export default notificationService;