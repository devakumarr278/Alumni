const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server, path: '/notifications' });
    this.clients = new Map(); // Map of userId -> WebSocket connections
    
    this.initialize();
  }

  initialize() {
    this.wss.on('connection', (ws, req) => {
      // Extract token from query parameters
      const urlParams = new URLSearchParams(req.url.split('?')[1]);
      const token = urlParams.get('token');

      if (!token) {
        ws.close(4001, 'Authentication required');
        return;
      }

      // Verify JWT token
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          console.error('JWT verification error:', err);
          ws.close(4002, 'Invalid token');
          return;
        }

        try {
          // Verify user exists
          const user = await User.findById(decoded.userId || decoded.id);
          if (!user) {
            console.error('User not found for WebSocket connection:', decoded.userId || decoded.id);
            ws.close(4003, 'User not found');
            return;
          }

          // Store client connection
          const userId = user._id.toString();
          this.clients.set(userId, ws);
          console.log(`WebSocket connected for user: ${userId}`);

          // Send welcome message
          ws.send(JSON.stringify({
            type: 'connected',
            message: 'WebSocket connection established',
            userId: userId
          }));

          // Handle incoming messages
          ws.on('message', (message) => {
            try {
              const data = JSON.parse(message);
              this.handleMessage(ws, data, user);
            } catch (error) {
              console.error('Error parsing WebSocket message:', error);
              ws.send(JSON.stringify({
                type: 'error',
                message: 'Invalid message format'
              }));
            }
          });

          // Handle client disconnect
          ws.on('close', (code, reason) => {
            this.clients.delete(userId);
            console.log(`WebSocket disconnected for user: ${userId}`, code, reason?.toString());
          });

          // Handle errors
          ws.on('error', (error) => {
            console.error(`WebSocket error for user ${userId}:`, error);
            this.clients.delete(userId);
          });

        } catch (error) {
          console.error('Error during WebSocket authentication:', error);
          ws.close(5000, 'Internal server error');
        }
      });
    });

    console.log('WebSocket server initialized');
  }

  handleMessage(ws, data, user) {
    // Handle different message types
    switch (data.type) {
      case 'ping':
        ws.send(JSON.stringify({
          type: 'pong',
          timestamp: new Date().toISOString()
        }));
        break;
      default:
        console.log(`Unknown message type from user ${user._id}:`, data.type);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Unknown message type'
        }));
    }
  }

  // Send notification to a specific user
  sendNotificationToUser(userId, notificationData) {
    const ws = this.clients.get(userId.toString());
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({
          type: 'new_notification',
          data: notificationData
        }));
      } catch (error) {
        console.error(`Error sending notification to user ${userId}:`, error);
      }
    } else {
      console.log(`WebSocket not open for user ${userId}, readyState: ${ws?.readyState}`);
    }
  }

  // Broadcast notification to all connected clients
  broadcastNotification(notificationData) {
    this.clients.forEach((ws, userId) => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify({
            type: 'new_notification',
            data: notificationData
          }));
        } catch (error) {
          console.error(`Error broadcasting notification to user ${userId}:`, error);
        }
      }
    });
  }

  // Send notification to a specific user about follow request status
  sendFollowRequestUpdate(userId, data) {
    const ws = this.clients.get(userId.toString());
    console.log(`Attempting to send follow request update to user ${userId}:`, data);
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        const message = JSON.stringify({
          type: 'follow_request_update',
          data: data
        });
        console.log(`Sending WebSocket message to user ${userId}:`, message);
        ws.send(message);
        console.log(`Successfully sent WebSocket message to user ${userId}`);
      } catch (error) {
        console.error(`Error sending follow request update to user ${userId}:`, error);
      }
    } else {
      console.log(`WebSocket not open for user ${userId}, readyState: ${ws?.readyState}`);
    }
  }

  // Send notification to a specific user about mentorship request status
  sendMentorshipRequestUpdate(userId, data) {
    const ws = this.clients.get(userId.toString());
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({
          type: 'mentorship_request_update',
          data: data
        }));
      } catch (error) {
        console.error(`Error sending mentorship request update to user ${userId}:`, error);
      }
    }
  }

  // Send slot update to a specific user
  sendSlotUpdate(userId, data) {
    const ws = this.clients.get(userId.toString());
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({
          type: 'slot_updated',
          data: data
        }));
      } catch (error) {
        console.error(`Error sending slot update to user ${userId}:`, error);
      }
    }
  }

  // Send slot creation notification to all users
  broadcastSlotCreation(data) {
    this.clients.forEach((ws, userId) => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify({
            type: 'slot_created',
            data: data
          }));
        } catch (error) {
          console.error(`Error broadcasting slot creation to user ${userId}:`, error);
        }
      }
    });
  }

  // Send a message to a specific user
  sendToUser(userId, messageData) {
    const ws = this.clients.get(userId.toString());
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(messageData));
      } catch (error) {
        console.error(`Error sending message to user ${userId}:`, error);
      }
    }
  }

  // Send slot deletion notification to all users
  broadcastSlotDeletion(data) {
    this.clients.forEach((ws, userId) => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify({
            type: 'slot_deleted',
            data: data
          }));
        } catch (error) {
          console.error(`Error broadcasting slot deletion to user ${userId}:`, error);
        }
      }
    });
  }

  close() {
    this.wss.close();
    this.clients.clear();
  }
}

module.exports = WebSocketServer;