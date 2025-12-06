import React from 'react';
import { FollowRequests } from '../../components/FollowRequests/index';

const SimpleTest = () => {
  console.log('SimpleTest component loaded - this should appear in console');
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
      <h1 style={{ color: 'red', fontSize: '24px' }}>Simple Test Page - ENHANCED VERSION</h1>
      <p>This is a simple test to verify our components are working.</p>
      <div style={{ border: '5px solid red', padding: '20px', margin: '20px 0', backgroundColor: 'yellow' }}>
        <h2 style={{ color: 'blue' }}>Follow Requests Component:</h2>
        <FollowRequests />
      </div>
    </div>
  );
};

export default SimpleTest;