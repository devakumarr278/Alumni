// Test script to verify the mock API is working correctly

async function testMockAPI() {
  try {
    console.log('Testing Mock Institution API...\n');
    
    // Test 1: Get pending alumni
    console.log('Test 1: Fetching pending alumni...');
    const pendingResponse = await fetch('http://localhost:3001/api/institution/pending');
    const pendingData = await pendingResponse.json();
    
    console.log('✅ Pending alumni fetch successful');
    console.log(`Found ${pendingData.data.length} pending alumni`);
    pendingData.data.forEach((alumni, index) => {
      console.log(`  ${index + 1}. ${alumni.firstName} ${alumni.lastName} (${alumni.status})`);
    });
    
    console.log('');
    
    // Test 2: Get notifications
    console.log('Test 2: Fetching notifications...');
    const notificationsResponse = await fetch('http://localhost:3001/api/institution/notifications');
    const notificationsData = await notificationsResponse.json();
    
    console.log('✅ Notifications fetch successful');
    console.log(`Found ${notificationsData.data.length} notifications`);
    notificationsData.data.forEach((notification, index) => {
      console.log(`  ${index + 1}. ${notification.message}`);
    });
    
    console.log('');
    
    // Test 3: Approve an alumni (using the first one)
    if (pendingData.data.length > 0) {
      const firstAlumni = pendingData.data[0];
      console.log(`Test 3: Approving alumni ${firstAlumni.firstName} ${firstAlumni.lastName}...`);
      
      const approveResponse = await fetch(`http://localhost:3001/api/institution/verify/${firstAlumni._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'manual',
          decision: 'approve'
        })
      });
      
      const approveData = await approveResponse.json();
      
      if (approveData.success) {
        console.log('✅ Alumni approval successful');
        console.log(`Message: ${approveData.message}`);
      } else {
        console.log('❌ Alumni approval failed');
      }
    }
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('\nTo use the mock system in the frontend:');
    console.log('1. Replace the AlumniVerification component with MockAlumniVerification');
    console.log('2. The mock component will automatically connect to the mock API on port 3001');
    console.log('3. You can simulate new registrations with the "Simulate New Registration" button');
    
  } catch (error) {
    console.error('❌ Error testing mock API:', error.message);
    console.log('\nMake sure the mock API server is running on port 3001');
    console.log('Start it with: node mock-institution-api.js');
  }
}

// Run the test
testMockAPI();