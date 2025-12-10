// Test script for slot WebSocket functionality
const WebSocket = require('ws');

// Connect to WebSocket server
const ws = new WebSocket('ws://localhost:5003/notifications?token=YOUR_JWT_TOKEN_HERE');

ws.on('open', function open() {
  console.log('Connected to WebSocket server');
  
  // Send a test message
  ws.send(JSON.stringify({
    type: 'test',
    message: 'Hello from slot test client'
  }));
});

ws.on('message', function incoming(data) {
  console.log('Received:', data);
  
  try {
    const message = JSON.parse(data);
    if (message.type === 'connected') {
      console.log('Successfully connected to WebSocket');
    }
  } catch (error) {
    console.error('Error parsing message:', error);
  }
});

ws.on('close', function close() {
  console.log('Disconnected from WebSocket server');
});

ws.on('error', function error(err) {
  console.error('WebSocket error:', err);
});