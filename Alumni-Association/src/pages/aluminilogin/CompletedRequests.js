import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CompletedRequests = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [expandedCard, setExpandedCard] = useState(null);

  const completedRequests = [
    {
      id: 1,
      studentName: 'Alex Johnson',
      studentMajor: 'Computer Science',
      graduationYear: '2024',
      skills: ['Machine Learning', 'Python', 'Data Analysis'],
      purpose: 'Guidance for Data Science internships',
      startDate: '2023-10-15',
      endDate: '2023-12-15',
      sessions: 8,
      hours: 16,
      rating: 5,
      feedback: 'Alex was very dedicated and showed great improvement in data analysis skills throughout our sessions.',
      aiImpact: 'Helped secure internship at TechCorp'
    },
    {
      id: 2,
      studentName: 'Maria Garcia',
      studentMajor: 'Business Administration',
      graduationYear: '2025',
      skills: ['Market Research', 'Financial Analysis', 'Project Management'],
      purpose: 'Entrepreneurship and startup advice',
      startDate: '2023-09-01',
      endDate: '2023-11-30',
      sessions: 6,
      hours: 12,
      rating: 4,
      feedback: 'Maria had a clear vision for her startup and benefited from guidance on business planning.',
      aiImpact: 'Launched successful e-commerce platform'
    },
    {
      id: 3,
      studentName: 'David Kim',
      studentMajor: 'Mechanical Engineering',
      graduationYear: '2024',
      skills: ['CAD Design', 'Manufacturing', 'Quality Control'],
      purpose: 'Graduate school applications',
      startDate: '2023-08-15',
      endDate: '2023-10-15',
      sessions: 5,
      hours: 10,
      rating: 5,
      feedback: 'David was thorough in his research and prepared strong applications for graduate programs.',
      aiImpact: 'Accepted to 3 top universities'
    },
    {
      id: 4,
      studentName: 'Sarah Williams',
      studentMajor: 'Electrical Engineering',
      graduationYear: '2023',
      skills: ['Circuit Design', 'Embedded Systems', 'IoT'],
      purpose: 'Career transition to software',
      startDate: '2023-07-01',
      endDate: '2023-09-30',
      sessions: 7,
      hours: 14,
      rating: 5,
      feedback: 'Sarah adapted quickly to software concepts and built an impressive portfolio.',
      aiImpact: 'Transitioned to software role at InnovateTech'
    }
  ];

  const handleFeedbackSubmit = (id) => {
    console.log(`Feedback submitted for request ${id}:`, feedback[id]);
    setShowFeedbackForm(null);
  };

  const getFilteredRequests = () => {
    let filtered = completedRequests;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(request => 
        request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply time filter
    if (filter !== 'all') {
      // In a real app, we would filter by actual date ranges
      // For now, we'll just return all requests for any filter
    }
    
    return filtered;
  };

  const filteredRequests = getFilteredRequests();

  // Card component for consistent styling
  const Card = ({ children, className = '' }) => (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      {children}
    </div>
  );

  // Get summary stats
  const totalStudents = completedRequests.length;
  const totalSessions = completedRequests.reduce((sum, req) => sum + req.sessions, 0);
  const totalHours = completedRequests.reduce((sum, req) => sum + req.hours, 0);
  const avgRating = totalStudents > 0 ? (completedRequests.reduce((sum, req) => sum + req.rating, 0) / totalStudents).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-2xl mr-4">
            📚
          </div>
          <div>
            <h1 className="text-2xl font-bold">Mentorship History</h1>
            <p className="text-purple-100 mt-1">Review your past mentorship sessions and impact</p>
          </div>
        </div>
      </div>

      {/* Compact Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="flex justify-center mb-2">
            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="text-lg font-bold text-gray-800">{totalStudents}</div>
          <div className="text-xs text-gray-600">Students Mentored</div>
        </Card>
        
        <Card className="text-center">
          <div className="flex justify-center mb-2">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-lg font-bold text-gray-800">{totalSessions}</div>
          <div className="text-xs text-gray-600">Sessions</div>
        </Card>
        
        <Card className="text-center">
          <div className="flex justify-center mb-2">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-lg font-bold text-gray-800">{totalHours}</div>
          <div className="text-xs text-gray-600">Hours</div>
        </Card>
        
        <Card className="text-center">
          <div className="flex justify-center mb-2">
            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div className="text-lg font-bold text-gray-800">{avgRating}/5</div>
          <div className="text-xs text-gray-600">Avg Rating</div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                filter === 'all' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Time
            </button>
            <button 
              onClick={() => setFilter('this-month')}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                filter === 'this-month' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              This Month
            </button>
            <button 
              onClick={() => setFilter('last-month')}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                filter === 'last-month' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Last Month
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search students, skills, or purpose..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </Card>

      {/* Grid of Mentorship History Cards */}
      {filteredRequests.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No completed requests found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRequests.map((request) => (
            <Card key={request.id}>
              <div className="flex items-start gap-4">
                {/* Student Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {request.studentName.charAt(0)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Student Info */}
                  <div>
                    <h3 className="font-bold text-gray-800 truncate">{request.studentName}</h3>
                    <p className="text-sm text-gray-600 truncate">
                      {request.studentMajor} • Class of {request.graduationYear}
                    </p>
                  </div>
                  
                  {/* Skills Tags */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {request.skills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                        {skill}
                      </span>
                    ))}
                    {request.skills.length > 3 && (
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                        +{request.skills.length - 3}
                      </span>
                    )}
                  </div>
                  
                  {/* Purpose & Duration */}
                  <div className="mt-3 text-sm">
                    <p className="text-gray-800 truncate">{request.purpose}</p>
                    <div className="flex items-center text-gray-600 mt-1">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{request.sessions} sessions • {request.hours} hours</span>
                    </div>
                  </div>
                  
                  {/* Feedback (collapsed by default) */}
                  {request.feedback && (
                    <div className="mt-3">
                      <button
                        onClick={() => setExpandedCard(expandedCard === request.id ? null : request.id)}
                        className="text-xs text-purple-600 hover:text-purple-800 flex items-center"
                      >
                        {expandedCard === request.id ? 'Show less' : 'View feedback'}
                        <svg 
                          className={`w-3 h-3 ml-1 transform transition-transform ${expandedCard === request.id ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {expandedCard === request.id && (
                        <div className="mt-2 p-3 bg-gray-50 rounded text-sm text-gray-700">
                          {request.feedback}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Rating */}
                  <div className="mt-3 flex items-center">
                    <div className="flex items-center bg-yellow-50 px-2 py-0.5 rounded-full">
                      <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-bold text-yellow-700 text-xs">{request.rating}/5</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-4 flex justify-end gap-2">
                {showFeedbackForm === request.id ? (
                  <div className="w-full">
                    <textarea
                      className="w-full p-2 text-sm border border-gray-300 rounded"
                      rows="2"
                      placeholder="Leave feedback..."
                      value={feedback[request.id] || ''}
                      onChange={(e) => setFeedback({...feedback, [request.id]: e.target.value})}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => setShowFeedbackForm(null)}
                        className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleFeedbackSubmit(request.id)}
                        className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setShowFeedbackForm(request.id)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                      title="Leave Feedback"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <Link 
                      to="/alumni/mentorship/calendar"
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                      title="View Sessions"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedRequests;