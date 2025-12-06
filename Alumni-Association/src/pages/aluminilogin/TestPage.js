import React from 'react';
import FollowRequests from '../../components/FollowRequests/FollowRequests';

const TestPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Follow Requests Test Page</h1>
      <div className="bg-white p-4 rounded-lg shadow">
        <FollowRequests />
      </div>
    </div>
  );
};

export default TestPage;