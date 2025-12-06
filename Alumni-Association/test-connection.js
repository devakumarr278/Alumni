// Test file to verify frontend-backend connection
const testConnection = async () => {
  try {
    console.log('Testing frontend-backend connection...');
    
    // Test API call to backend
    const response = await fetch('http://localhost:49669/api/health');
    const data = await response.json();
    
    if (data.status === 'OK') {
      console.log('✅ Backend connection successful!');
      console.log('Backend message:', data.message);
      console.log('Timestamp:', data.timestamp);
    } else {
      console.log('❌ Backend connection failed');
      console.log('Response:', data);
    }
    
    // Test alumni API call
    const alumniResponse = await fetch('http://localhost:49669/api/alumni');
    const alumniData = await alumniResponse.json();
    
    if (alumniData.success) {
      console.log('✅ Alumni API connection successful!');
      console.log('Number of alumni found:', alumniData.data.alumni.length);
    } else {
      console.log('❌ Alumni API connection failed');
      console.log('Response:', alumniData);
    }
  } catch (error) {
    console.log('❌ Connection test failed with error:', error.message);
  }
};

// Run the test
testConnection();