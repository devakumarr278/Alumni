import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiHeart, FiBookmark, FiShare2, FiCalendar, FiUserPlus, FiTrendingUp, FiClock, FiMapPin, FiCheck, FiX, FiUsers, FiBell, FiSearch, FiFilter, FiChevronDown, FiSend } from 'react-icons/fi';

const AdvancedAlumniDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for all sections
  const mockStudentMessages = [
    {
      id: 1,
      name: 'John Smith',
      avatar: 'https://placehold.co/40x40/6366f1/white?text=JS',
      lastMessage: 'Hey, are you coming to the reunion?',
      timestamp: '2 min ago',
      unread: 2,
      online: true,
      isGroup: false
    },
    {
      id: 2,
      name: 'Alumni Networking Group',
      avatar: 'https://placehold.co/40x40/10b981/white?text=AG',
      lastMessage: 'Sarah: The event is moved to next week',
      timestamp: '1 hour ago',
      unread: 0,
      online: false,
      isGroup: true
    },
    {
      id: 3,
      name: 'Emily Johnson',
      avatar: 'https://placehold.co/40x40/ec4899/white?text=EJ',
      lastMessage: 'Thanks for the recommendation!',
      timestamp: '3 hours ago',
      unread: 0,
      online: true,
      isGroup: false
    }
  ];

  const mockPostEngagement = {
    totalPosts: 24,
    totalLikes: 156,
    totalComments: 42,
    totalShares: 18,
    totalBookmarks: 34,
    engagementRate: 78.5,
    topPerformingPost: {
      title: 'Mastering the System Design Interview',
      likes: 87,
      comments: 24,
      shares: 18
    },
    weeklyStats: [
      { day: 'Mon', engagements: 12 },
      { day: 'Tue', engagements: 18 },
      { day: 'Wed', engagements: 22 },
      { day: 'Thu', engagements: 15 },
      { day: 'Fri', engagements: 25 },
      { day: 'Sat', engagements: 8 },
      { day: 'Sun', engagements: 5 }
    ]
  };

  const mockMentorshipStatus = {
    totalHours: 42,
    studentsMentored: 8,
    activeSessions: 3,
    upcomingMeetings: 2,
    satisfactionRate: 94,
    recentFeedback: [
      {
        student: 'Alex Johnson',
        rating: 5,
        comment: 'Really helpful session on career paths!'
      },
      {
        student: 'Maria Garcia',
        rating: 5,
        comment: 'Great insights on entrepreneurship.'
      }
    ]
  };

  const mockEventUpdates = [
    {
      id: 1,
      title: 'Annual Alumni Networking Conference 2025',
      date: '2025-08-15',
      time: '09:00 AM - 5:00 PM',
      location: 'Grand Ballroom, University Convention Center',
      status: 'registered',
      attendees: 245,
      interested: 89,
      imageUrl: 'https://placehold.co/600x300/6366f1/white?text=Conference'
    },
    {
      id: 2,
      title: 'Startup Pitch Competition Finals',
      date: '2025-07-30',
      time: '6:00 PM - 9:00 PM',
      location: 'Innovation Hub, Main Campus',
      status: 'interested',
      attendees: 0,
      interested: 203,
      imageUrl: 'https://placehold.co/600x300/f97316/white?text=Pitch'
    }
  ];

  const mockMentorshipRequests = [
    {
      id: 1,
      studentName: 'Alex Johnson',
      studentMajor: 'Computer Science',
      graduationYear: '2024',
      message: 'Looking for guidance on career paths in software engineering.',
      status: 'pending',
      requestedAt: '30 minutes ago',
      aiRelevanceScore: 95
    },
    {
      id: 2,
      studentName: 'Maria Garcia',
      studentMajor: 'Business Administration',
      graduationYear: '2025',
      message: 'Interested in entrepreneurship and startup advice.',
      status: 'pending',
      requestedAt: '2 hours ago',
      aiRelevanceScore: 87
    }
  ];

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
      case 'registered': return 'bg-green-100 text-green-800';
      case 'interested': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'accepted': return 'Accepted';
      case 'declined': return 'Declined';
      case 'completed': return 'Completed';
      case 'registered': return 'Registered';
      case 'interested': return 'Interested';
      default: return 'Unknown';
    }
  };

  // Card component for consistent styling
  const DashboardCard = ({ children, className = '', title, actions, hoverable = true }) => (
    <motion.div
      className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 transition-all duration-200 ${
        hoverable ? 'hover:shadow-2xl hover:-translate-y-1' : ''
      } ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {(title || actions) && (
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="text-lg font-bold text-gray-800">{title}</h2>}
          {actions && <div className="flex space-x-2">{actions}</div>}
        </div>
      )}
      {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Advanced Alumni Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Your personalized hub for all alumni activities and connections
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow border border-white/50 p-4 text-center">
            <div className="text-xl font-bold text-blue-600">24</div>
            <div className="text-gray-600 text-sm">Posts</div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow border border-white/50 p-4 text-center">
            <div className="text-xl font-bold text-green-600">42</div>
            <div className="text-gray-600 text-sm">Comments</div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow border border-white/50 p-4 text-center">
            <div className="text-xl font-bold text-red-600">156</div>
            <div className="text-gray-600 text-sm">Likes</div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow border border-white/50 p-4 text-center">
            <div className="text-xl font-bold text-purple-600">8</div>
            <div className="text-gray-600 text-sm">Events</div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow border border-white/50 p-4 text-center">
            <div className="text-xl font-bold text-indigo-600">3</div>
            <div className="text-gray-600 text-sm">Mentorship</div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          className="flex flex-wrap gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-gray-100 border border-white/50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'messages'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-gray-100 border border-white/50'
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setActiveTab('engagement')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'engagement'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-gray-100 border border-white/50'
            }`}
          >
            Engagement
          </button>
          <button
            onClick={() => setActiveTab('mentorship')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'mentorship'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-gray-100 border border-white/50'
            }`}
          >
            Mentorship
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'events'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-gray-100 border border-white/50'
            }`}
          >
            Events
          </button>
        </motion.div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Student Messages Section */}
            <DashboardCard 
              title="Student Messages" 
              actions={[
                <button 
                  key="view-all"
                  onClick={() => navigate('/alumni/communication')}
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                >
                  View All
                </button>
              ]}
            >
              <div className="space-y-4">
                {mockStudentMessages.map((chat) => (
                  <div 
                    key={chat.id} 
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate('/alumni/communication')}
                  >
                    <div className="relative">
                      <img 
                        src={chat.avatar} 
                        alt={chat.name}
                        className="w-12 h-12 rounded-full"
                      />
                      {chat.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-gray-800 truncate">{chat.name}</h3>
                        <span className="text-xs text-gray-500">{chat.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unread > 0 && (
                      <div className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {chat.unread}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </DashboardCard>

            {/* Post Engagement Section */}
            <DashboardCard 
              title="Post Engagement Analytics" 
              actions={[
                <button 
                  key="view-details"
                  onClick={() => navigate('/alumni/knowledge-posts')}
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                >
                  View Details
                </button>
              ]}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-blue-600">{mockPostEngagement.totalPosts}</div>
                  <div className="text-xs text-gray-600">Total Posts</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-red-600">{mockPostEngagement.totalLikes}</div>
                  <div className="text-xs text-gray-600">Likes</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-green-600">{mockPostEngagement.totalComments}</div>
                  <div className="text-xs text-gray-600">Comments</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-purple-600">{mockPostEngagement.engagementRate}%</div>
                  <div className="text-xs text-gray-600">Engagement</div>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-800 mb-2">Weekly Engagement</h3>
                <div className="flex items-end h-16 space-x-1">
                  {mockPostEngagement.weeklyStats.map((day, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t w-full"
                        style={{ height: `${(day.engagements / 30) * 100}%` }}
                      ></div>
                      <span className="text-xs text-gray-500 mt-1">{day.day}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Top Performing Post</h3>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-gray-800">{mockPostEngagement.topPerformingPost.title}</h4>
                  <div className="flex space-x-4 mt-2 text-sm">
                    <span className="flex items-center text-red-500">
                      <FiHeart className="mr-1" /> {mockPostEngagement.topPerformingPost.likes}
                    </span>
                    <span className="flex items-center text-green-500">
                      <FiMessageSquare className="mr-1" /> {mockPostEngagement.topPerformingPost.comments}
                    </span>
                    <span className="flex items-center text-purple-500">
                      <FiShare2 className="mr-1" /> {mockPostEngagement.topPerformingPost.shares}
                    </span>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Mentorship Status Section */}
            <DashboardCard 
              title="Mentorship Status" 
              actions={[
                <button 
                  key="view-all"
                  onClick={() => navigate('/alumni/mentorship')}
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                >
                  View All
                </button>
              ]}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-indigo-50 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-indigo-600">{mockMentorshipStatus.totalHours}</div>
                    <div className="text-xs text-gray-600">Hours</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-green-600">{mockMentorshipStatus.studentsMentored}</div>
                    <div className="text-xs text-gray-600">Students</div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Satisfaction</span>
                    <span className="text-sm font-bold text-blue-600">{mockMentorshipStatus.satisfactionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full" 
                      style={{ width: `${mockMentorshipStatus.satisfactionRate}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Recent Feedback</h3>
                  <div className="space-y-2">
                    {mockMentorshipStatus.recentFeedback.map((feedback, index) => (
                      <div key={index} className="bg-gray-50 p-2 rounded">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-800 text-sm">{feedback.student}</span>
                          <div className="flex">
                            {[...Array(feedback.rating)].map((_, i) => (
                              <span key={i} className="text-yellow-400">★</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{feedback.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DashboardCard>

            {/* Event Updates Section */}
            <DashboardCard 
              title="Event Updates" 
              actions={[
                <button 
                  key="view-all"
                  onClick={() => navigate('/alumni/institution-events')}
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                >
                  View All
                </button>
              ]}
            >
              <div className="space-y-4">
                {mockEventUpdates.map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={event.imageUrl} 
                      alt={event.title}
                      className="w-full h-24 object-cover"
                    />
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-800 text-sm">{event.title}</h3>
                      <div className="flex items-center text-xs text-gray-600 mt-1">
                        <FiCalendar className="mr-1" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600 mt-1">
                        <FiClock className="mr-1" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(event.status)}`}>
                          {getStatusText(event.status)}
                        </span>
                        <div className="flex items-center text-xs text-gray-600">
                          <FiUsers className="mr-1" />
                          <span>{event.interested} interested</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>

            {/* New Mentorship Requests Section */}
            <DashboardCard 
              title="New Mentorship Requests" 
              actions={[
                <button 
                  key="view-all"
                  onClick={() => navigate('/alumni/mentorship/requests')}
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                >
                  View All
                </button>
              ]}
            >
              <div className="space-y-4">
                {mockMentorshipRequests.length > 0 ? (
                  mockMentorshipRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">{request.studentName}</h3>
                          <p className="text-sm text-gray-600">{request.studentMajor} • Class of {request.graduationYear}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(request.status, request.aiRelevanceScore)}`}>
                          {request.aiRelevanceScore}% match
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">{request.message}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs text-gray-500">{request.requestedAt}</span>
                        <div className="flex space-x-2">
                          <button className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors">
                            Accept
                          </button>
                          <button className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors">
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <div className="text-gray-400 text-2xl mb-2">📭</div>
                    <p className="text-gray-600 text-sm">No new requests</p>
                  </div>
                )}
              </div>
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAlumniDashboard;