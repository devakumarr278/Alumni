// Test script to check follow requests data structure
async function testFollowRequests() {
  try {
    console.log('Testing follow requests API...');
    
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    console.log('Token:', token ? 'Present' : 'Missing');
    
    if (!token) {
      console.log('No token found. Please log in first.');
      return;
    }
    
    // Test follow requests endpoint
    const followRequestsResponse = await fetch('http://localhost:5005/api/follow/requests', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Follow requests response status:', followRequestsResponse.status);
    
    if (followRequestsResponse.ok) {
      const followRequestsData = await followRequestsResponse.json();
      console.log('Follow requests data:', JSON.stringify(followRequestsData, null, 2));
      
      // Check the structure of the first follow request
      if (followRequestsData.success && followRequestsData.data && followRequestsData.data.followRequests && followRequestsData.data.followRequests.length > 0) {
        const firstRequest = followRequestsData.data.followRequests[0];
        console.log('First follow request:', JSON.stringify(firstRequest, null, 2));
        console.log('Follower ID:', firstRequest.followerId._id);
        console.log('Follower ID type:', typeof firstRequest.followerId._id);
        
        // Try to fetch the alumni profile for this user
        const profileResponse = await fetch(`http://localhost:5005/api/alumni/${firstRequest.followerId._id}`, {
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
      }
    } else {
      const errorText = await followRequestsResponse.text();
      console.log('Follow requests error response:', errorText);
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

// Run the test
testFollowRequests();