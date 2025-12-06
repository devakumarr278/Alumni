// Test script to check follow requests API endpoint
import fetch from 'node-fetch';

async function testFollowAPI() {
  try {
    console.log('Testing follow requests API endpoint...');
    
    // For this test, I'll need a valid token
    // Let's simulate what the frontend would do
    
    // First, let's try to get follow requests without authentication
    const response = await fetch('http://localhost:5005/api/follow/requests');
    
    console.log('Response status (no auth):', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Response data (no auth):', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('Error response (no auth):', errorText);
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testFollowAPI();