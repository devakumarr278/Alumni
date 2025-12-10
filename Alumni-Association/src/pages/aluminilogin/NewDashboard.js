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
    { id: 1, studentName: 'Alex Johnson', skills: 'Machine Learning, Python', message: 'Seeking guidance on career in AI', priority: 'High', avatar: 'AJ' },
    { id: 2, studentName: 'Maria Garcia', skills: 'Data Science, R', message: 'Need help with internship applications', priority: 'Medium', avatar: 'MG' },
  ];

  const mockUpcomingEvents = [
    { id: 1, title: 'AI in Healthcare Webinar', date: '2023-12-15', time: '18:00', type: 'Hosted' },
    { id: 2, title: 'Startup Networking', date: '2023-12-20', time: '19:00', type: 'Attending' },
  ];

  // Mock jobs data
  const mockJobs = [
    { id: 1, title: 'Software Engineer Intern', company: 'TechCorp', posted: '2 days ago', matches: 2, skills: ['JavaScript', 'React'] },
    { id: 2, title: 'Data Analyst Position', company: 'DataSystems', posted: '1 week ago', matches: 1, skills: ['Python', 'SQL'] },
  ];

  // Card component for consistent styling with enhanced glassmorphism
  const DashboardCard = ({ children, className = '', hoverable = true }) => (
    <div className={`bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 ease-out ${
      hoverable ? 'hover:shadow-xl hover:-translate-y-1' : ''
    } ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      {/* Top Header – Slim & Premium */}
      <header className="w-full backdrop-blur-md bg-white/30 border-b border-white/20 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, Alumni 👋</h1>
          <p className="text-sm text-gray-500">Here's your activity summary today</p>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/alumni/posts')}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            + Add Post
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold ring-2 ring-purple-400 shadow-md">
            JA
          </div>
        </div>
      </header>

      {/* 3-Column Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 p-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Profile Overview Card */}
          <DashboardCard>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-xl ring-2 ring-purple-400 shadow-md transform transition-transform hover:scale-105">
                JA
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-lg">Jane Alumni</h2>
                    <p className="text-sm text-gray-600">Senior Software Engineer @ TechCorp</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Verified</span>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Premium</span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">Profile Completion</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => navigate('/alumni/profile')}
                    className="text-xs px-3 py-1 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button 
                    onClick={() => navigate('/alumni/mentorship/calendar')}
                    className="text-xs px-3 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    Set Availability
                  </button>
                </div>
              </div>
            </div>
          </DashboardCard>

          {/* Mentorship Requests – Timeline Style */}
          <DashboardCard>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Mentorship Requests</h2>
            <div className="border-l-4 border-purple-500 pl-4 space-y-4">
              {mockMentorshipRequests.map((request) => (
                <div key={request.id} className="bg-white p-4 rounded-xl shadow hover:shadow-md transition-all relative">
                  <div className="absolute -left-7 top-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-white shadow">
                    {request.avatar}
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{request.studentName}</h3>
                      <p className="text-sm text-gray-600 mt-1">{request.skills}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      request.priority === 'High' 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {request.priority} Priority
                    </span>
                  </div>
                  <p className="text-gray-700 mt-2 text-sm">{request.message}</p>
                  <div className="flex gap-2 mt-3">
                    <button className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                      Accept
                    </button>
                    <button className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                      Suggest Time
                    </button>
                    <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/alumni/mentorship/requests')}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 rounded-lg hover:shadow-md transition-all font-medium"
            >
              View All Requests
            </button>
          </DashboardCard>
        </div>

        {/* Middle Column */}
        <div className="space-y-6">
          {/* Impact Snapshot – Icon Cards */}
          <DashboardCard>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Impact Snapshot</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Hours Mentored */}
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow">
                  <span className="text-lg">🤝</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">{stats.hoursMentored} Hours</h3>
                  <p className="text-gray-500 text-sm">Mentored</p>
                </div>
              </div>
              
              {/* Jobs Posted */}
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-white shadow">
                  <span className="text-lg">💼</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">{stats.jobsPosted} Jobs</h3>
                  <p className="text-gray-500 text-sm">Posted</p>
                </div>
              </div>
              
              {/* Amount Donated */}
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow">
                  <span className="text-lg">💰</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">${(stats.amountDonated / 1000).toFixed(0)}K</h3>
                  <p className="text-gray-500 text-sm">Donated</p>
                </div>
              </div>
              
              {/* Connections */}
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow">
                  <span className="text-lg">👥</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">42</h3>
                  <p className="text-gray-500 text-sm">Connections</p>
                </div>
              </div>
            </div>
          </DashboardCard>

          {/* Jobs & Referrals – Tag-Based UI */}
          <DashboardCard>
            <div className="flex justify-between items-center mb-4">
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
                <div key={job.id} className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-sm border border-gray-100 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-gray-600 text-sm">{job.company} • Posted {job.posted}</p>
                      <div className="flex gap-2 mt-2">
                        {job.skills.map((skill, index) => (
                          <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">2 Matches</span>
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
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 rounded-lg hover:shadow-md transition-all"
            >
              Post New Job
            </button>
          </DashboardCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Availability Calendar – Minimal */}
          <DashboardCard>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Availability Calendar</h2>
            <div className="rounded-xl border border-gray-200 p-4 shadow-sm bg-white/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Dec 15-21</span>
                <span className="text-xs text-gray-500">3 slots available</span>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-gray-500 mb-1">{day}</div>
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-all ${
                      index === 2 || index === 4 
                        ? 'bg-purple-600 text-white shadow' 
                        : index === 6 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                      {index + 15}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={() => navigate('/alumni/mentorship/calendar')}
              className="mt-4 w-full border border-purple-600 text-purple-600 py-2 rounded-lg hover:bg-purple-50 transition-colors"
            >
              Manage Availability
            </button>
          </DashboardCard>

          {/* Events Panel – LinkedIn Style Cards */}
          <DashboardCard>
            <div className="flex justify-between items-center mb-4">
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
                <div key={event.id} className="border-l-4 border-purple-500 pl-4 py-2">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{event.title}</h3>
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                      {event.type}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {event.date}
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {event.time}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-xs text-purple-600">
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
              className="mt-4 w-full border border-purple-600 text-purple-600 py-2 rounded-lg hover:bg-purple-50 transition-colors"
            >
              Host Event
            </button>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default NewAlumniDashboard;