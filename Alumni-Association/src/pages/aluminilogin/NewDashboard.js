import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewAlumniDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pendingRequests: 2,
    hoursMentored: 10,
    jobsPosted: 3,
    amountDonated: 25000,
  });

  // Mock data for demonstration
  const mockMentorshipRequests = [
    { id: 1, studentName: 'Alex Johnson', skills: 'Machine Learning, Python', message: 'Seeking guidance on career in AI', priority: 'High' },
    { id: 2, studentName: 'Maria Garcia', skills: 'Data Science, R', message: 'Need help with internship applications', priority: 'Medium' },
  ];

  const mockUpcomingEvents = [
    { id: 1, title: 'AI in Healthcare Webinar', date: '2023-12-15', time: '18:00', type: 'Hosted' },
    { id: 2, title: 'Startup Networking', date: '2023-12-20', time: '19:00', type: 'Attending' },
  ];

  // Mock jobs data
  const mockJobs = [
    { id: 1, title: 'Software Engineer Intern', company: 'TechCorp', posted: '2 days ago', matches: 2 },
    { id: 2, title: 'Data Analyst Position', company: 'DataSystems', posted: '1 week ago', matches: 1 },
  ];

  // Card component for consistent styling
  const DashboardCard = ({ children, className = '', hoverable = true }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 ${
      hoverable ? 'hover:shadow-md hover:-translate-y-1' : ''
    } ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
        <h1 className="text-2xl font-bold text-gray-800">Welcome Back, Alumni!</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your profile and activities today</p>
      </div>

      {/* Row 1 (Key Info) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card - Compact Horizontal Style */}
        <DashboardCard className="lg:col-span-1">
          <div className="flex items-start">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xl mr-4">
              JA
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Jane Alumni</h2>
                  <p className="text-gray-600 text-sm">Senior Software Engineer at TechCorp</p>
                  <div className="flex items-center mt-1">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Verified</span>
                    <span className="ml-2 text-xs text-gray-500">Batch of 2020</span>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Profile Completion</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="flex space-x-2 mt-3">
                <button 
                  onClick={() => navigate('/alumni/profile')}
                  className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  Edit Profile
                </button>
                <button 
                  onClick={() => navigate('/alumni/mentorship/calendar')}
                  className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Set Availability
                </button>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Mentorship Requests Card - Big Highlight */}
        <DashboardCard className="lg:col-span-2 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <h2 className="text-xl font-bold text-gray-800">Mentorship Requests</h2>
                <div className="ml-3 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                  AI Priority
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.pendingRequests}</p>
              <p className="text-gray-600 mt-1">2 students highly relevant to your skills have requested mentorship</p>
            </div>
            <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Urgent
            </div>
          </div>
          
          {/* Highlighted Requests */}
          <div className="mt-6 space-y-4">
            {mockMentorshipRequests.map((request) => (
              <div key={request.id} className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{request.studentName}</h3>
                    <p className="text-sm text-gray-600">{request.skills}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    request.priority === 'High' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {request.priority} Priority
                  </span>
                </div>
                <p className="text-gray-700 mt-2 text-sm">{request.message}</p>
                <div className="flex space-x-2 mt-3">
                  <button className="text-xs bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors">
                    Accept
                  </button>
                  <button className="text-xs bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors">
                    Suggest Time
                  </button>
                  <button className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300 transition-colors">
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => navigate('/alumni/mentorship/requests')}
            className="mt-6 w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            View All Requests
          </button>
        </DashboardCard>
      </div>

      {/* Row 2 (Stats & Scheduling) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Impact Snapshot with Mini Charts */}
        <DashboardCard>
          <h2 className="text-xl font-bold text-gray-800 mb-6">Impact Snapshot</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hours Mentored with Bar Chart */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                  <span className="text-white">🤝</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{stats.hoursMentored} hours</p>
                  <p className="text-sm text-gray-600">Mentored</p>
                </div>
              </div>
              {/* Mini bar chart */}
              <div className="mt-4">
                <div className="flex items-end h-12 space-x-1">
                  {[5, 8, 10, 7, 9, 6, 8].map((height, index) => (
                    <div 
                      key={index} 
                      className="bg-blue-500 rounded-t flex-1"
                      style={{ height: `${height * 10}%` }}
                    ></div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Mon</span>
                  <span>Fri</span>
                </div>
              </div>
            </div>
            
            {/* Jobs Posted with Pie Chart Visualization */}
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mr-3">
                  <span className="text-white">💼</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{stats.jobsPosted} jobs</p>
                  <p className="text-sm text-gray-600">Posted</p>
                </div>
              </div>
              {/* Mini pie chart visualization */}
              <div className="mt-4 flex items-center justify-center">
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-green-600">
                  <div className="absolute inset-1 bg-green-50 rounded-full"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-green-700">
                    {stats.jobsPosted}
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-700">2 matches found</p>
                  <p className="text-xs text-gray-500">This month</p>
                </div>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Availability Calendar */}
        <DashboardCard>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Availability Calendar</h2>
            <button 
              onClick={() => navigate('/alumni/mentorship/calendar')}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              View Calendar
            </button>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Dec 15-21</span>
              <span className="text-xs text-gray-500">3 slots available</span>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-gray-500 mb-1">{day}</div>
                  <div className={`h-10 rounded-md flex items-center justify-center text-sm ${
                    index === 2 || index === 4 ? 'bg-purple-100 text-purple-800' : 
                    index === 6 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {index + 15}
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/alumni/mentorship/calendar')}
              className="mt-6 w-full border border-purple-600 text-purple-600 py-2 rounded-lg hover:bg-purple-50 transition-colors"
            >
              Manage Availability
            </button>
          </div>
        </DashboardCard>
      </div>

      {/* Row 3 (Opportunities) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Jobs & Referrals */}
        <DashboardCard>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Jobs & Referrals</h2>
            <button 
              onClick={() => navigate('/alumni/jobs')}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {mockJobs.map((job) => (
              <div key={job.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.company} • Posted {job.posted}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {job.matches} matches
                  </span>
                </div>
                <div className="mt-3 flex items-center text-xs text-blue-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>AI suggests Alex Johnson for this role</span>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => navigate('/alumni/jobs/post')}
            className="mt-6 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Post New Job
          </button>
        </DashboardCard>

        {/* Events */}
        <DashboardCard>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Events</h2>
            <button 
              onClick={() => navigate('/alumni/events')}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {mockUpcomingEvents.map(event => (
              <div key={event.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between">
                  <h3 className="font-semibold text-gray-800">{event.title}</h3>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    {event.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{event.date} at {event.time}</p>
                <div className="mt-3 flex items-center text-xs text-purple-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>AI recommends: Based on your expertise in AI</span>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => navigate('/alumni/events/host')}
            className="mt-6 w-full border border-purple-600 text-purple-600 py-2 rounded-lg hover:bg-purple-50 transition-colors"
          >
            Host Event
          </button>
        </DashboardCard>
      </div>
    </div>
  );
};

export default NewAlumniDashboard;