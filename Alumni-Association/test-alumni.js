async function testAlumniAPI() {
  try {
    console.log('Testing alumni API...');
    
    // Test getting all alumni
    const allAlumniResponse = await fetch('http://localhost:5003/api/alumni');
    const allAlumniData = await allAlumniResponse.json();
    console.log('All alumni response:', allAlumniData);
    
    // Test getting specific alumni by ID
    const alumniId = '68f219e4bcda074ebf6ffe05';
    console.log('Testing specific alumni with ID:', alumniId);
    
    const alumniResponse = await fetch(`http://localhost:5003/api/alumni/${alumniId}`);
    console.log('Response status:', alumniResponse.status);
    
    if (alumniResponse.ok) {
      const alumniData = await alumniResponse.json();
      console.log('Specific alumni response:', alumniData);
    } else {
      const errorText = await alumniResponse.text();
      console.log('Error response:', errorText);
    }
    
    // Test creating a follow request
    console.log('Testing follow request...');
    const followResponse = await fetch('http://localhost:5003/api/follow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add a test token here if needed
      },
      body: JSON.stringify({
        alumniId: alumniId
      })
    });
    
    console.log('Follow request response status:', followResponse.status);
    
    if (followResponse.ok) {
      const followData = await followResponse.json();
      console.log('Follow request response:', followData);
    } else {
      const errorText = await followResponse.text();
      console.log('Follow request error response:', errorText);
    }
  } catch (error) {
    console.error('Error testing alumni API:', error);
  }
}

testAlumniAPI();