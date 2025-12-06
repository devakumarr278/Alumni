// Test script to directly access the mock API

async function testDirectAPI() {
  try {
    console.log('Testing direct access to mock API...\n');
    
    // Test 1: Get pending alumni
    console.log('Test 1: Fetching pending alumni from mock API...');
    const pendingResponse = await fetch('http://localhost:3001/api/institution/pending');
    const pendingData = await pendingResponse.json();
    
    console.log('✅ Pending alumni fetch successful');
    console.log(`Found ${pendingData.data.length} pending alumni`);
    pendingData.data.forEach((alumni, index) => {
      console.log(`  ${index + 1}. ${alumni.firstName} ${alumni.lastName} (${alumni.status})`);
    });
    
    console.log('');
    
    // Test 2: Get notifications
    console.log('Test 2: Fetching notifications from mock API...');
    const notificationsResponse = await fetch('http://localhost:3001/api/institution/notifications');
    const notificationsData = await notificationsResponse.json();
    
    console.log('✅ Notifications fetch successful');
    console.log(`Found ${notificationsData.data.length} notifications`);
    notificationsData.data.forEach((notification, index) => {
      console.log(`  ${index + 1}. ${notification.message}`);
    });
    
    console.log('\n🎉 Direct API test completed successfully!');
    console.log('\nThis confirms that:');
    console.log('1. The mock API server is running correctly on port 3001');
    console.log('2. The endpoints are working properly');
    console.log('3. There is mock data available');
    console.log('\nThe issue is likely in the frontend component not connecting to the mock API correctly.');
    
  } catch (error) {
    console.error('❌ Error testing direct API:', error.message);
  }
}

// Run the test
testDirectAPI();