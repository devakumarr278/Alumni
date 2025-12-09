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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="lg:flex">
        {/* Removed StudentNavigation as it's handled by the shared layout */}
        
        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="pt-8">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Verifiable Micro-Credentials</h1>
              <p className="text-gray-700 text-lg">Earn and showcase your achievements with verified badges</p>
            </div>

            {/* Enhanced Badge Statistics with Glass Effect */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl shadow-sm transform transition-transform duration-300 hover:scale-105">
                    <div className="text-blue-600 text-2xl">🏅</div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-bold text-gray-600">Earned Badges</p>
                    <p className="text-3xl font-extrabold text-gray-900 bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">
                      {userBadges.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl shadow-sm transform transition-transform duration-300 hover:scale-105">
                    <div className="text-green-600 text-2xl">🤝</div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-bold text-gray-600">Mentorship Sessions</p>
                    <p className="text-3xl font-extrabold text-gray-900 bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                      {studentData?.badges?.mentorshipSessions || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-2xl shadow-sm transform transition-transform duration-300 hover:scale-105">
                    <div className="text-amber-600 text-2xl">⏳</div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-bold text-gray-600">Pending Requests</p>
                    <p className="text-3xl font-extrabold text-gray-900 bg-gradient-to-r from-amber-700 to-yellow-700 bg-clip-text text-transparent">
                      {studentData?.badges?.verificationRequests?.filter(r => r?.status === 'pending').length || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Earned Badges Section with Glass Effect */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-extrabold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Your Earned Badges</h2>
                <div className="text-sm font-bold text-gray-700 bg-gray-100/90 px-3 py-1.5 rounded-full">
                  {userBadges.length} badges earned
                </div>
              </div>
              
              {userBadges.length > 0 ? (
                <div className="mb-6">
                  <BadgeList badges={userBadges} interactive={true} />
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-br from-gray-50/80 to-gray-100/80 rounded-2xl border border-gray-200/70">
                  <div className="text-6xl mb-4">🏅</div>
                  <h3 className="text-2xl font-extrabold text-gray-800 mb-2">No badges earned yet</h3>
                  <p className="text-gray-700 mb-6 text-lg">
                    Complete activities and request verification to earn your first badge!
                  </p>
                </div>
              )}

              {/* Enhanced Test Button for Mentorship Sessions with Glass Effect */}
              <div className="border-t pt-6 border-gray-200/70">
                <div className="bg-gradient-to-br from-blue-50/90 to-cyan-50/90 p-5 rounded-2xl border border-blue-200/70 backdrop-blur-lg shadow-lg">
                  <h3 className="font-extrabold text-blue-800 mb-3 text-lg flex items-center">
                    <span className="text-2xl mr-2">🧪</span>
                    Test Mentorship Progress
                  </h3>
                  <p className="text-blue-700 mb-4 text-base">
                    Simulate completing mentorship sessions. Complete 3 sessions to earn the "Mentor Ready" badge automatically.
                  </p>
                  <button
                    onClick={handleTestMentorshipSession}
                    className="px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-cyan-700 text-base shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02]"
                  >
                    Complete Mentorship Session ({studentData?.badges?.mentorshipSessions || 0}/3)
                  </button>
                  {testMessage && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-xl text-base font-medium shadow-sm">
                      {testMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Available Badge Types with Glass Effect */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/50">
              <h2 className="text-2xl font-extrabold text-gray-800 mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Available Badge Types</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-blue-200/70 rounded-2xl p-5 bg-gradient-to-br from-blue-50/80 to-cyan-50/80 backdrop-blur-lg shadow-sm transform transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                  <div className="flex items-center mb-3">
                    <span className="text-3xl mr-3">🎓</span>
                    <div>
                      <h3 className="font-extrabold text-blue-800 text-lg">Verified Alumni</h3>
                      <p className="text-sm font-medium text-blue-600">Admin Approval Required</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-base">
                    Verified as an official alumnus/alumna of the institution. Requires graduation verification.
                  </p>
                </div>

                <div className="border border-green-200/70 rounded-2xl p-5 bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-lg shadow-sm transform transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                  <div className="flex items-center mb-3">
                    <span className="text-3xl mr-3">🌟</span>
                    <div>
                      <h3 className="font-extrabold text-green-800 text-lg">Mentor Ready</h3>
                      <p className="text-sm font-medium text-green-600">Auto-Granted</p>
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