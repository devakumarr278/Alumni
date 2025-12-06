// WebSocket service for real-time notifications
class WebSocketService {
  constructor() {
    console.log('Creating new WebSocketService instance');
    this.socket = null;
    this.listeners = {};
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10; // Increased from 5 to 10
    this.reconnectDelay = 1000;
    this.token = null;
  }

  connect(token) {
    if (!token) {
      console.warn('No token provided, skipping WebSocket connection');
      return;
    }

    // If already connected with the same token, do nothing
    if (this.socket && this.socket.readyState === WebSocket.OPEN && this.token === token) {
      console.log('WebSocket already connected with the same token');
      return;
    }

    // If there's an existing connection, close it first
    if (this.socket) {
      console.log('Closing existing WebSocket connection');
      this.disconnect();
    }

    // Store token for reconnection
    this.token = token;

    // Use the same base URL as the API but with ws protocol and notifications path
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5005/api';
    console.log('Base URL for WebSocket:', baseUrl);
    
    // Fix the WebSocket URL construction
    let wsBaseUrl = baseUrl.replace('http://', 'ws://').replace('https://', 'wss://');
    
    // Remove /api from the end if it exists, as it will be added back with /notifications
    if (wsBaseUrl.endsWith('/api')) {
      wsBaseUrl = wsBaseUrl.slice(0, -4); // Remove '/api'
    }
    
    console.log('WebSocket base URL:', wsBaseUrl);
    const wsUrl = `${wsBaseUrl}/notifications?token=${token}`;
    
    console.log('Connecting to WebSocket:', wsUrl);
    
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.emit('connected');
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received WebSocket message:', data);
        this.emit('notification', data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error, 'Raw message:', event.data);
      }
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket disconnected', event.code, event.reason);
      this.emit('disconnected', { code: event.code, reason: event.reason });
      
      // Only attempt reconnection for non-normal closures
      if (event.code !== 1000) { // 1000 is normal closure
        this.reconnect(token);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };
  }

  reconnect(token) {
    console.log(`Attempting to reconnect WebSocket. Attempt ${this.reconnectAttempts + 1} of ${this.maxReconnectAttempts}`);
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.min(this.reconnectAttempts, 5); // Cap delay at 5 seconds
      setTimeout(() => {
        console.log(`Reconnecting WebSocket... Attempt ${this.reconnectAttempts}`);
        this.connect(token);
      }, delay);
    } else {
      console.error('Max WebSocket reconnection attempts reached');
      this.emit('maxReconnectAttemptsReached');
    }
  }

  disconnect() {
    console.log('Disconnecting WebSocket');
    if (this.socket) {
      this.socket.close(1000, 'Client disconnect'); // Normal closure
      this.socket = null;
    }
  }

  on(event, callback) {
    console.log(`Adding listener for event: ${event}`);
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    console.log(`Removing listener for event: ${event}`);
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event, data) {
    console.log(`Emitting event: ${event}`, data);
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket listener for event ${event}:`, error);
        }
      });
    }
  }

  sendMessage(message) {
    console.log('Sending WebSocket message:', message);
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      try {
        this.socket.send(JSON.stringify(message));
        console.log('WebSocket message sent successfully');
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
      }
    } else {
      console.warn('WebSocket is not connected. Ready state:', this.socket?.readyState);
    }
  }
}

// Export singleton instance
const webSocketService = new WebSocketService();
console.log('WebSocketService singleton created');
export default webSocketService;