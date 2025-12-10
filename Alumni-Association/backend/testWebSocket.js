// Test WebSocket connection and message sending
require('dotenv').config({ path: __dirname + '/.env' });
const WebSocket = require('ws');

async function testWebSocket() {
  try {
    // Use the same base URL as the API but with ws protocol and notifications path
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5003';
    const wsBaseUrl = baseUrl.replace('http', 'ws');
    const wsUrl = `${wsBaseUrl}/notifications?token=test-token`;
    
    console.log('Connecting to WebSocket:', wsUrl);
    
    const ws = new WebSocket(wsUrl);

    ws.on('open', () => {
      console.log('WebSocket connected');
      
      // Send a test message
      ws.send(JSON.stringify({
        type: 'ping',
        data: { message: 'Test message' }
      }));
    });

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        console.log('Received message:', message);
      } catch (error) {
        console.error('Error parsing message:', error, 'Raw data:', data);
      }
    });

    ws.on('close', (code, reason) => {
      console.log('WebSocket closed:', code, reason?.toString());
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // Keep the connection open for a while
    setTimeout(() => {
      console.log('Closing WebSocket connection');
      ws.close();
    }, 10000);

  } catch (error) {
    console.error('Error:', error);
  }
}

testWebSocket();