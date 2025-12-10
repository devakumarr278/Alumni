const axios = require('axios');

// Test the new analytics endpoints
const API_BASE_URL = 'http://localhost:5003/api';

async function testAnalyticsEndpoints() {
  try {
    console.log('Testing analytics endpoints...\n');
    
    // Test mentorship summary
    console.log('1. Testing mentorship summary endpoint:');
    const mentorshipRes = await axios.get(`${API_BASE_URL}/analytics/mentorship-summary`);
    console.log('   Status:', mentorshipRes.status);
    console.log('   Success:', mentorshipRes.data.success);
    console.log('   Data keys:', Object.keys(mentorshipRes.data.data || {}));
    console.log('\n');
    
    // Test location heatmap
    console.log('2. Testing location heatmap endpoint:');
    const locationRes = await axios.get(`${API_BASE_URL}/analytics/location-heatmap`);
    console.log('   Status:', locationRes.status);
    console.log('   Success:', locationRes.data.success);
    console.log('   Data sample:', locationRes.data.data?.slice(0, 3));
    console.log('\n');
    
    // Test alumni spotlight
    console.log('3. Testing alumni spotlight endpoint:');
    const spotlightRes = await axios.get(`${API_BASE_URL}/analytics/alumni-spotlight`);
    console.log('   Status:', spotlightRes.status);
    console.log('   Success:', spotlightRes.data.success);
    console.log('   Spotlight count:', spotlightRes.data.data?.spotlight?.length || 0);
    console.log('   Featured count:', spotlightRes.data.data?.featured?.length || 0);
    console.log('\n');
    
    // Test overall analytics
    console.log('4. Testing overall analytics endpoint:');
    const overallRes = await axios.get(`${API_BASE_URL}/analytics/overall`);
    console.log('   Status:', overallRes.status);
    console.log('   Success:', overallRes.data.success);
    console.log('   Data:', overallRes.data.data);
    console.log('\n');
    
    console.log('All endpoints tested successfully!');
  } catch (error) {
    console.error('Error testing endpoints:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Status:', error.response.status);
    }
  }
}

// Run the test
testAnalyticsEndpoints();