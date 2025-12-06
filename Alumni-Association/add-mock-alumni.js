// Script to add a mock alumni registration to test the workflow

async function addMockAlumni() {
  try {
    console.log('Adding mock alumni registration...\n');
    
    const mockAlumniData = {
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
      collegeName: 'State University',
      rollNumber: 'SU78901',
      department: 'Computer Science',
      graduationYear: 2022
    };
    
    console.log('Mock alumni data:');
    console.log(JSON.stringify(mockAlumniData, null, 2));
    
    // Send request to our mock API
    const response = await fetch('http://localhost:3001/api/mock/new-alumni', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockAlumniData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('\n✅ Mock alumni registration added successfully!');
      console.log('Message:', data.message);
      console.log('\nNow you can test the institution dashboard to see this alumni in the pending list.');
      console.log('\nTo test the institution dashboard:');
      console.log('1. Go to http://localhost:3000');
      console.log('2. Log in as an institution user');
      console.log('3. Navigate to the Alumni Verification page');
      console.log('4. You should see Alice Johnson in the pending list');
      console.log('5. Click "View Details" and then "Approve" to approve the registration');
    } else {
      console.log('\n❌ Error adding mock alumni:', data.message);
    }
  } catch (error) {
    console.error('Error:', error.message);
    console.log('\nMake sure the mock API server is running on port 3001');
    console.log('Start it with: node mock-institution-api.js');
  }
}

// Run the function
addMockAlumni();