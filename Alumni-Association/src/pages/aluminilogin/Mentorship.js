import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Mentorship = () => {
  const [availability, setAvailability] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockAvailability = [
      { id: 1, day: 'Mon', startTime: '10:00', endTime: '12:00' },
      { id: 2, day: 'Wed', startTime: '14:00', endTime: '16:00' },
      { id: 3, day: 'Fri', startTime: '09:00', endTime: '11:00' },
    ];

    const mockRequests = [
      {
        id: 1,
        studentName: 'Alex Johnson',
        studentMajor: 'Computer Science',
        graduationYear: '2024',
        message: 'Looking for guidance on career paths in software engineering.',
        status: 'pending',
        requestedAt: '2023-12-01',
        aiRelevanceScore: 95
      },
      {
        id: 2,
        studentName: 'Maria Garcia',
        studentMajor: 'Business Administration',
        graduationYear: '2025',
        message: 'Interested in entrepreneurship and startup advice.',
        status: 'pending',
        requestedAt: '2023-11-28',
        aiRelevanceScore: 87
      },
      {
        id: 3,
        studentName: 'David Kim',
        studentMajor: 'Mechanical Engineering',
        graduationYear: '2024',
        message: 'Seeking advice on graduate school applications.',
        status: 'accepted',
        requestedAt: '2023-11-25',
        aiRelevanceScore: 92
      }
    ];

    setTimeout(() => {
      setAvailability(mockAvailability);
      setRequests(mockRequests);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status, relevanceScore) => {
    if (status === 'pending') {
      if (relevanceScore >= 90) return 'bg-green-100 text-green-800';
      if (relevanceScore >= 80) return 'bg-yellow-100 text-yellow-800';
      return 'bg-orange-100 text-orange-800';
    }
    switch (status) {
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPendingRequestsCount = () => {
    return requests.filter(request => request.status === 'pending').length;
  };

  const getHighRelevanceCount = () => {
    return requests.filter(request => request.status === 'pending' && request.aiRelevanceScore >= 90).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const pendingCount = getPendingRequestsCount();
  const highRelevanceCount = getHighRelevanceCount();

  // Card component for consistent styling
  const Card = ({ children, className = '' }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-2xl mr-4">
            🤝
          </div>
          <div>
            <h1 className="text-2xl font-bold">Mentorship Program</h1>
            <p className="text-purple-100 mt-1">Empower the next generation with your expertise and experiences</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Availability Calendar */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Your Availability
              </h2>
              <Link 
                to="/alumni/mentorship/calendar"
                className="text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                View Calendar
              </Link>
            </div>
            
            {/* Compact Weekly View */}
            <div className="space-y-3">
              {availability.map((slot) => (
                <div key={slot.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-sm font-medium mr-3">
                      {slot.day}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{slot.startTime} - {slot.endTime}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              
              {availability.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <p>No availability slots set</p>
                </div>
              )}
              
              <button className="w-full mt-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm flex items-center justify-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Availability Slot
              </button>
            </div>
          </Card>

          {/* Pending Requests Preview */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Pending Requests
              </h2>
              <Link 
                to="/alumni/mentorship/requests"
                className="text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                View All
              </Link>
            </div>
            
            {requests.filter(r => r.status === 'pending').length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-gray-600">No pending mentorship requests</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.filter(r => r.status === 'pending').slice(0, 3).map((request) => (
                  <div key={request.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3 flex-shrink-0">
                        {request.studentName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-gray-800 truncate">{request.studentName}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(request.status, request.aiRelevanceScore)}`}>
                            {request.aiRelevanceScore}% match
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{request.studentMajor} • Class of {request.graduationYear}</p>
                        <p className="text-sm text-gray-700 mt-1 truncate">{request.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column - Sidebar with Three Equal Grids */}
        <div className="space-y-6">
          {/* Mentorship Stats */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Mentorship Stats
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Mentees</p>
                    <p className="text-xl font-bold text-gray-800">12</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active Mentees</p>
                    <p className="text-xl font-bold text-gray-800">8</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Hours Contributed</p>
                    <p className="text-xl font-bold text-gray-800">24</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pending Requests</p>
                    <p className="text-xl font-bold text-gray-800">{pendingCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* AI Insights moved to sidebar */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Top Skills Match
            </h2>
            
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Data Science</span>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Machine Learning</span>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Python</span>
              </div>
            </div>
          </Card>
          
          {/* Suggested Action */}
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Suggested Action
            </h2>
            
            <div className="p-3 bg-white rounded-lg border border-blue-100">
              <p className="text-sm text-gray-700">
                Alex Johnson's request has a 95% relevance score. Consider scheduling a session within the next week.
              </p>
              <button className="mt-3 w-full py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">
                Schedule Now
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Mentorship;