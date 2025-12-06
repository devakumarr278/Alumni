import React from 'react';
import { useStudent } from './StudentContext';

const StudentDashboard = () => {
  const { studentData } = useStudent();
  
  // Safe defaults for student data
  const safeStudentData = studentData || {};
  const safeProfile = safeStudentData.profile || {};
  const safeConnections = safeStudentData.connections || {};
  const safeMentorship = safeStudentData.mentorship || {};
  const safeJobs = safeStudentData.jobs || {};
  const safeEvents = safeStudentData.events || {};
  const safeBadges = safeStudentData.badges || {};
  
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="pt-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Profile</h2>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completeness</span>
              <span className="font-semibold text-green-600">{safeProfile.completeness || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{width: `${safeProfile.completeness || 0}%`}}></div>
            </div>
            <p className="text-sm text-gray-700 mt-3">{safeProfile.name || 'Complete your profile'}</p>
            <p className="text-xs text-gray-500">{safeProfile.major ? `${safeProfile.major} • ${safeProfile.graduationYear}` : 'Add your academic details'}</p>
          </div>
        </div>
        
        {/* Alumni Directory Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Alumni Directory</h2>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Connected Alumni</span>
              <span className="font-semibold text-purple-600">{safeConnections.alumni || 0}</span>
            </div>
            <p className="text-sm text-gray-700">Recent connections:</p>
            <div className="space-y-1">
              {safeConnections.recent && safeConnections.recent.length > 0 ? 
                safeConnections.recent.slice(0, 2).map((connection, index) => (
                  <p key={index} className="text-xs text-gray-500">• {connection.name}</p>
                )) : 
                <p className="text-xs text-gray-500">• No connections yet</p>
              }
            </div>
          </div>
        </div>
        
        {/* Mentorship Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Mentorship</h2>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Mentors</span>
              <span className="font-semibold text-orange-600">{safeMentorship.activeMentors || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending Requests</span>
              <span className="font-semibold text-yellow-600">{safeMentorship.pendingRequests || 0}</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">Next session: {safeMentorship.nextSession || 'None scheduled'}</p>
          </div>
        </div>
        
        {/* Jobs Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Jobs</h2>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H6a2 2 0 00-2-2V4m12 0h2a2 2 0 012 2v6.5M4 6h16M4 6v10a2 2 0 002 2h4m-6-6l.01.01M6 16l.01.01" />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Applications</span>
              <span className="font-semibold text-blue-600">{safeJobs.applications || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Interviews</span>
              <span className="font-semibold text-green-600">{safeJobs.interviews || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">New Opportunities</span>
              <span className="font-semibold text-red-500">{safeJobs.newOpportunities || 0}</span>
            </div>
          </div>
        </div>
        
        {/* Events Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Events</h2>
            <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Upcoming Events</span>
              <span className="font-semibold text-indigo-600">{safeEvents.upcoming || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Registered</span>
              <span className="font-semibold text-green-600">{safeEvents.registered || 0}</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">Next: {safeEvents.nextEvent || 'No upcoming events'}</p>
          </div>
        </div>
        
        {/* Badges Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Badges</h2>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Earned Badges</span>
              <span className="font-semibold text-yellow-600">{safeBadges.earned || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Current Rank</span>
              <span className="font-semibold text-purple-600">{safeBadges.rank ? `#${safeBadges.rank}` : 'Unranked'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Points</span>
              <span className="font-semibold text-blue-600">{safeBadges.points || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;