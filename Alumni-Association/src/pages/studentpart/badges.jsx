import React, { useState } from 'react';
// Removed StudentNavigation import as it's handled by the shared layout
import { useStudent } from './StudentContext';
import { BadgeList } from '../../components/Badge';
import BadgeVerificationRequest from './components/BadgeVerificationRequest';

const StudentBadges = () => {
  // Always call hooks at the top level
  const contextValue = useStudent();
  const [testMessage, setTestMessage] = useState('');

  // Handle context errors
  if (!contextValue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Context Error</h2>
          <p className="text-gray-700 mb-4">There was an error accessing the student data context.</p>
          <p className="text-sm text-gray-500 mb-4">Make sure you're accessing this page through the proper navigation.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  const { studentData, getUserBadges, completeMentorshipSession } = contextValue;
  
  // Handle studentData errors
  if (!studentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Data Error</h2>
          <p className="text-gray-700 mb-4">Student data is not available.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Get user badges with error handling
  let userBadges = [];
  try {
    userBadges = getUserBadges() || [];
  } catch (error) {
    console.error('Error getting user badges:', error);
    userBadges = [];
  }

  // Test function for mentorship session completion
  const handleTestMentorshipSession = () => {
    try {
      completeMentorshipSession();
      setTestMessage('Mentorship session completed! Check your badges.');
      setTimeout(() => setTestMessage(''), 3000);
    } catch (error) {
      console.error('Error completing mentorship session:', error);
      setTestMessage('Error completing mentorship session. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:flex">
        {/* Removed StudentNavigation as it's handled by the shared layout */}
        
        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="pt-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Verifiable Micro-Credentials</h1>
              <p className="text-gray-600">Earn and showcase your achievements with verified badges</p>
            </div>

            {/* Badge Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <div className="text-blue-600 text-2xl">🏅</div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Earned Badges</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {userBadges.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <div className="text-green-600 text-2xl">🤝</div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Mentorship Sessions</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {studentData?.badges?.mentorshipSessions || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <div className="text-yellow-600 text-2xl">⏳</div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {studentData?.badges?.verificationRequests?.filter(r => r?.status === 'pending').length || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Earned Badges Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Your Earned Badges</h2>
                <div className="text-sm text-gray-600">
                  {userBadges.length} badges earned
                </div>
              </div>
              
              {userBadges.length > 0 ? (
                <div className="mb-6">
                  <BadgeList badges={userBadges} interactive={true} />
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏅</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No badges earned yet</h3>
                  <p className="text-gray-600 mb-6">
                    Complete activities and request verification to earn your first badge!
                  </p>
                </div>
              )}

              {/* Test Button for Mentorship Sessions */}
              <div className="border-t pt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">🧪 Test Mentorship Progress</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    Simulate completing mentorship sessions. Complete 3 sessions to earn the "Mentor Ready" badge automatically.
                  </p>
                  <button
                    onClick={handleTestMentorshipSession}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    Complete Mentorship Session ({studentData?.badges?.mentorshipSessions || 0}/3)
                  </button>
                  {testMessage && (
                    <div className="mt-2 p-2 bg-green-100 text-green-700 rounded text-sm">
                      {testMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Available Badge Types */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Available Badge Types</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">🎓</span>
                    <div>
                      <h3 className="font-semibold text-blue-800">Verified Alumni</h3>
                      <p className="text-sm text-blue-600">Admin Approval Required</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Verified as an official alumnus/alumna of the institution. Requires graduation verification.
                  </p>
                </div>

                <div className="border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">🌟</span>
                    <div>
                      <h3 className="font-semibold text-green-800">Mentor Ready</h3>
                      <p className="text-sm text-green-600">Auto-Granted</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Completed 3+ mentorship sessions and ready to mentor students. Automatically awarded.
                  </p>
                </div>

                <div className="border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">🏆</span>
                    <div>
                      <h3 className="font-semibold text-yellow-800">Event Champion</h3>
                      <p className="text-sm text-yellow-600">Admin Approval Required</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Active event organizer and community builder. Requires nomination and approval.
                  </p>
                </div>

                <div className="border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">💡</span>
                    <div>
                      <h3 className="font-semibold text-purple-800">Skill Expert</h3>
                      <p className="text-sm text-purple-600">Admin Approval Required</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Recognized expert in specific technical or professional skills. Requires validation.
                  </p>
                </div>
              </div>
            </div>

            {/* Badge Verification Request Section */}
            <BadgeVerificationRequest />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentBadges;