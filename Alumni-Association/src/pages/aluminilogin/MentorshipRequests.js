import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MentorshipRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('date'); // date, match, priority
  const [viewMode, setViewMode] = useState('grid'); // grid, timeline
  const [loading, setLoading] = useState(true);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockRequests = [
      {
        id: 1,
        studentName: 'Alex Johnson',
        studentMajor: 'Computer Science',
        graduationYear: '2024',
        skills: ['Machine Learning', 'Python', 'Data Analysis'],
        purpose: 'Guidance for Data Science internships',
        message: 'Looking for advice on preparing for technical interviews and building a strong portfolio for data science roles.',
        preferredSlots: ['Mon 10:00-12:00', 'Wed 14:00-16:00', 'Fri 09:00-11:00'],
        status: 'pending',
        aiRelevanceScore: 95,
        priority: 'high',
        requestedAt: '2023-12-01T14:30:00Z'
      },
      {
        id: 2,
        studentName: 'Maria Garcia',
        studentMajor: 'Business Administration',
        graduationYear: '2025',
        skills: ['Market Research', 'Financial Analysis', 'Project Management'],
        purpose: 'Entrepreneurship and startup advice',
        message: 'Interested in starting a tech startup after graduation. Seeking guidance on business planning and funding options.',
        preferredSlots: ['Tue 11:00-13:00', 'Thu 15:00-17:00'],
        status: 'pending',
        aiRelevanceScore: 87,
        priority: 'medium',
        requestedAt: '2023-11-28T09:15:00Z'
      },
      {
        id: 3,
        studentName: 'David Kim',
        studentMajor: 'Mechanical Engineering',
        graduationYear: '2024',
        skills: ['CAD Design', 'Manufacturing', 'Quality Control'],
        purpose: 'Graduate school applications',
        message: 'Seeking advice on selecting the right graduate programs and preparing strong applications for mechanical engineering.',
        preferredSlots: ['Mon 14:00-16:00', 'Wed 10:00-12:00'],
        status: 'accepted',
        aiRelevanceScore: 92,
        priority: 'high',
        requestedAt: '2023-11-25T16:45:00Z'
      },
      {
        id: 4,
        studentName: 'Sarah Williams',
        studentMajor: 'Electrical Engineering',
        graduationYear: '2023',
        skills: ['Circuit Design', 'Embedded Systems', 'IoT'],
        purpose: 'Career transition to software',
        message: 'Experienced in hardware but want to transition to software roles. Need guidance on learning paths and job search strategies.',
        preferredSlots: ['Tue 14:00-16:00', 'Fri 11:00-13:00'],
        status: 'completed',
        aiRelevanceScore: 78,
        priority: 'low',
        requestedAt: '2023-11-20T11:20:00Z'
      },
      {
        id: 5,
        studentName: 'James Wilson',
        studentMajor: 'Computer Science',
        graduationYear: '2024',
        skills: ['Web Development', 'React', 'Node.js'],
        purpose: 'Full-stack development guidance',
        message: 'Seeking mentorship to improve full-stack development skills and build better projects.',
        preferredSlots: ['Wed 09:00-11:00', 'Fri 14:00-16:00'],
        status: 'pending',
        aiRelevanceScore: 91,
        priority: 'medium',
        requestedAt: '2023-12-02T10:00:00Z'
      },
      {
        id: 6,
        studentName: 'Emma Thompson',
        studentMajor: 'Marketing',
        graduationYear: '2025',
        skills: ['Digital Marketing', 'SEO', 'Content Strategy'],
        purpose: 'Digital marketing career advice',
        message: 'Looking for guidance on building a career in digital marketing and developing expertise.',
        preferredSlots: ['Mon 15:00-17:00', 'Thu 10:00-12:00'],
        status: 'declined',
        aiRelevanceScore: 65,
        priority: 'low',
        requestedAt: '2023-11-30T13:30:00Z'
      }
    ];

    setTimeout(() => {
      setRequests(mockRequests);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRequestAction = (id, action) => {
    setRequests(requests.map(request => 
      request.id === id ? { ...request, status: action } : request
    ));
  };

  const handleBulkAction = (action) => {
    const updatedRequests = requests.map(request => 
      selectedRequests.includes(request.id) ? { ...request, status: action } : request
    );
    setRequests(updatedRequests);
    setSelectedRequests([]);
    setSelectAll(false);
  };

  const handleSelectRequest = (id) => {
    if (selectedRequests.includes(id)) {
      setSelectedRequests(selectedRequests.filter(requestId => requestId !== id));
    } else {
      setSelectedRequests([...selectedRequests, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(getFilteredRequests().map(request => request.id));
    }
    setSelectAll(!selectAll);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getRelevanceColor = (score) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFilteredRequests = () => {
    let filtered = requests;
    
    // Apply filter
    if (filter !== 'all') {
      filtered = requests.filter(request => request.status === filter);
    }
    
    // Apply sorting
    switch (sort) {
      case 'match':
        filtered = [...filtered].sort((a, b) => b.aiRelevanceScore - a.aiRelevanceScore);
        break;
      case 'date':
        filtered = [...filtered].sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
        break;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        filtered = [...filtered].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
      default:
        break;
    }
    
    return filtered;
  };

  const getPendingRequestsCount = () => {
    return requests.filter(request => request.status === 'pending').length;
  };

  const getHighRelevanceCount = () => {
    return requests.filter(request => request.status === 'pending' && request.aiRelevanceScore >= 90).length;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredRequests = getFilteredRequests();
  const pendingCount = getPendingRequestsCount();
  const highRelevanceCount = getHighRelevanceCount();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Card component for consistent styling
  const Card = ({ children, className = '' }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md ${className}`}>
      {children}
    </div>
  );

  // Grid Card Component
  const RequestCard = ({ request }) => (
    <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
            {request.studentName.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{request.studentName}</h3>
            <p className="text-sm text-gray-600">{request.studentMajor} • {request.graduationYear}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRelevanceColor(request.aiRelevanceScore)} mb-1`}>
            {request.aiRelevanceScore}% match
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="mb-3">
        <p className="text-sm text-gray-700 line-clamp-2">{request.purpose}</p>
      </div>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {request.skills.slice(0, 3).map((skill, index) => (
          <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
            {skill}
          </span>
        ))}
        {request.skills.length > 3 && (
          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
            +{request.skills.length - 3}
          </span>
        )}
      </div>
      
      <div className="mt-auto pt-3 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedRequests.includes(request.id)}
              onChange={() => handleSelectRequest(request.id)}
              className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
            />
          </div>
          <div className="flex space-x-2">
            {request.status === 'pending' && (
              <>
                <button
                  onClick={() => handleRequestAction(request.id, 'accepted')}
                  className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                  title="Accept"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={() => handleRequestAction(request.id, 'suggest-time')}
                  className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                  title="Suggest Time"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleRequestAction(request.id, 'declined')}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  title="Decline"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            )}
            {request.status === 'accepted' && (
              <button
                onClick={() => handleRequestAction(request.id, 'completed')}
                className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200"
                title="Mark as Completed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Simplified Header */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Mentorship Requests</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'all' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Requests
          </button>
          <button 
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'pending' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilter('accepted')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'accepted' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Accepted
          </button>
          <button 
            onClick={() => setFilter('declined')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'declined' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Declined
          </button>
        </div>
      </div>

      {/* Requests Grid - Full Width */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRequests.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-8 border border-gray-200 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No requests found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'You have no mentorship requests at the moment.' 
                : `You have no ${filter} requests.`}
            </p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))
        )}
      </div>
    </div>
  );
};

export default MentorshipRequests;