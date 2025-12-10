// Test script to create a follow request and verify notifications
async function testFollowRequest() {
  try {
    console.log('Testing follow request functionality...');
    
    // First, let's get a list of alumni
    console.log('Fetching alumni list...');
    const alumniResponse = await fetch('http://localhost:5003/api/alumni');
    
    if (!alumniResponse.ok) {
      const errorText = await alumniResponse.text();
      console.log('Error fetching alumni:', errorText);
      return;
    }
    
    const alumniData = await alumniResponse.json();
    console.log('Found', alumniData.data.alumni.length, 'alumni');
    
    // If we have alumni, let's try to follow the first one
    if (alumniData.data.alumni.length > 0) {
      const alumniToFollow = alumniData.data.alumni[0];
      console.log('Attempting to follow alumni:', alumniToFollow.firstName, alumniToFollow.lastName);
      
      // Create follow request
      const followResponse = await fetch('http://localhost:5003/api/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          alumniId: alumniToFollow._id
        })
      });
      
      console.log('Follow request response status:', followResponse.status);
      
      if (followResponse.ok) {
        const followData = await followResponse.json();
        console.log('Follow request successful:', followData);
      } else {
        const errorText = await followResponse.text();
        console.log('Follow request failed:', errorText);
      }
    } else {
      console.log('No alumni found to follow');
    }
    
    // Now let's check notifications for the alumni
    console.log('Testing notification system...');
    
    // We would need to authenticate as the alumni to check their notifications
    // This is just a placeholder for now
    console.log('Note: To fully test notifications, you need to:');
    console.log('1. Log in as a student and follow an alumni');
    console.log('2. Log in as that alumni and check the notification dropdown');
    
  } catch (error) {
    console.error('Error in test:', error);
  }
}

testFollowRequest();