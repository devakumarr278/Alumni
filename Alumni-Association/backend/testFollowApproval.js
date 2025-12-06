require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Follow = require('./models/Follow');
const User = require('./models/User');
const { FollowController } = require('./controllers/followController');

async function testFollowApproval() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-association');
    console.log('✓ Connected to MongoDB');
    
    // Test the approval with the correct follow request ID
    console.log('\nTesting approval with the correct follow request ID:');
    
    // Use the correct follow request ID (the one that was fixed)
    const correctRequestId = '68fe41657ea131d724bc405c';
    const alumniId = '68f219e4bcda074ebf6ffe05';  // Rohit kumar's ID (the alumni)
    
    console.log(`Attempting to approve follow request: ${correctRequestId}`);
    
    // Mock request and response objects
    const mockReq = {
      params: { requestId: correctRequestId },
      user: { id: alumniId }  // This is what should be in req.user from auth middleware
    };
    
    let approvalResponse = null;
    const mockRes = {
      status: function(code) {
        this.statusCode = code;
        console.log(`Response Status: ${code}`);
        return this;
      },
      json: function(data) {
        this.responseData = data;
        approvalResponse = data;
        console.log('Response Data:', JSON.stringify(data, null, 2));
        return this;
      }
    };
    
    // Call the approveFollowRequest method
    console.log('\nCalling FollowController.approveFollowRequest...');
    await FollowController.approveFollowRequest(mockReq, mockRes);
    
    // Check if the follow request was actually approved
    if (approvalResponse && approvalResponse.success) {
      console.log('\n✓ Follow request approval was successful!');
      
      // Verify the follow request status in the database
      const updatedFollowRequest = await Follow.findById(correctRequestId);
      if (updatedFollowRequest) {
        console.log(`Follow request status: ${updatedFollowRequest.status}`);
        if (updatedFollowRequest.status === 'approved') {
          console.log('✓ Follow request is now approved in the database');
        } else {
          console.log('✗ Follow request status is not approved');
        }
      } else {
        console.log('✗ Follow request not found in database (may have been deleted)');
      }
    } else {
      console.log('\n✗ Follow request approval failed');
      console.log('Error:', approvalResponse ? approvalResponse.message : 'Unknown error');
    }
    
    mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testFollowApproval();