// Test script to simulate frontend API call
import fetch from 'node-fetch';

async function testFrontendAPI() {
  try {
    console.log('Testing frontend API call simulation...');
    
    // Use the alumni ID we found earlier
    const alumniId = '68f219e4bcda074ebf6ffe05';
    
    // Test the alumni profile endpoint
    const response = await fetch(`http://localhost:5005/api/alumni/${alumniId}`);
    
    console.log('Response status:', response.status);
    console.log('Response URL:', response.url);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Response data:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
    
    // Also test the profile endpoint
    const profileResponse = await fetch(`http://localhost:5005/api/alumni/${alumniId}/profile`);
    
    console.log('Profile response status:', profileResponse.status);
    console.log('Profile response URL:', profileResponse.url);
    
    if (profileResponse.ok) {
      const data = await profileResponse.json();
      console.log('Profile response data:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await profileResponse.text();
      console.log('Profile error response:', errorText);
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testFrontendAPI();