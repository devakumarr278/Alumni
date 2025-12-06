// Test script to check alumni profile endpoint
async function testAlumniProfile() {
  try {
    console.log('Testing alumni profile API...');
    
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    console.log('Token:', token ? 'Present' : 'Missing');
    
    if (!token) {
      console.log('No token found. Please log in first.');
      return;
    }
    
    // First, get all alumni to find a valid ID
    const allAlumniResponse = await fetch('http://localhost:5005/api/alumni', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('All alumni response status:', allAlumniResponse.status);
    
    if (allAlumniResponse.ok) {
      const allAlumniData = await allAlumniResponse.json();
      console.log('All alumni count:', allAlumniData.data.alumni.length);
      
      if (allAlumniData.data.alumni.length > 0) {
        const firstAlumni = allAlumniData.data.alumni[0];
        console.log('First alumni:', JSON.stringify(firstAlumni, null, 2));
        console.log('First alumni ID:', firstAlumni._id);
        
        // Try to fetch the profile for this alumni
        const profileResponse = await fetch(`http://localhost:5005/api/alumni/${firstAlumni._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Profile response status:', profileResponse.status);
        console.log('Profile response URL:', profileResponse.url);
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log('Profile data:', JSON.stringify(profileData, null, 2));
        } else {
          const errorText = await profileResponse.text();
          console.log('Profile error response:', errorText);
        }
        
        // Also test the profile endpoint
        const profileResponse2 = await fetch(`http://localhost:5005/api/alumni/${firstAlumni._id}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Profile /profile response status:', profileResponse2.status);
        console.log('Profile /profile response URL:', profileResponse2.url);
        
        if (profileResponse2.ok) {
          const profileData2 = await profileResponse2.json();
          console.log('Profile /profile data:', JSON.stringify(profileData2, null, 2));
        } else {
          const errorText2 = await profileResponse2.text();
          console.log('Profile /profile error response:', errorText2);
        }
      }
    } else {
      const errorText = await allAlumniResponse.text();
      console.log('All alumni error response:', errorText);
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

// Run the test
testAlumniProfile();