import React from 'react';
import { FollowRequests } from '../../components/FollowRequests';

const FollowRequestsPage = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <FollowRequests />
      </div>
    </div>
  );
};

export default FollowRequestsPage;