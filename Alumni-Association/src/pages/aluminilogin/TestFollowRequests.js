import React from 'react';
import { FollowRequests } from '../../components/FollowRequests';

const TestFollowRequests = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
      <h1>Test Page for Enhanced Follow Requests</h1>
      <p>This page directly uses the enhanced FollowRequests component to verify it's working.</p>
      <div style={{ border: '2px solid blue', padding: '10px', margin: '10px 0' }}>
        <h2>Enhanced Follow Requests Component:</h2>
        <FollowRequests />
      </div>
    </div>
  );
};

export default TestFollowRequests;