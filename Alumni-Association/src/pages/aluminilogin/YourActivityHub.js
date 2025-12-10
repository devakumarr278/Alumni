import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiMessageSquare, FiCalendar, FiUserPlus, FiBook, FiTrendingUp, FiAward, FiSearch, FiFilter, FiChevronDown, FiClock, FiMapPin, FiCheck, FiX, FiUsers, FiBookmark, FiSend } from 'react-icons/fi';

const YourActivityHub = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock data for all activity types
  const mockActivities = [
    // Knowledge Posts
    {
      id: 1,
      type: 'knowledge_post',
      author: 'You',
      authorAvatar: 'https://placehold.co/40x40/8b5cf6/white?text=Y',
      title: 'Breaking Into Product Management: A Non-Traditional Path',
      content: 'I didn\'t study business or product management in college. My background was in psychology, but I transitioned into PM roles through strategic networking and skill-building...',
      category: 'career-growth',
      timestamp: '2 hours ago',
      likes: 34,
      comments: 12,
      shares: 7,
      bookmarks: 19,
      liked: false,
      bookmarked: true
    },
    // Comments on your posts
    {
      id: 2,
      type: 'comment',
      commenter: 'Alex Turner',
      commenterAvatar: 'https://placehold.co/40x40/6366f1/white?text=AT',
      postTitle: 'From Campus to Corporate: My Journey in Digital Marketing',
      content: 'This is incredibly helpful! Could you share more about the specific tools you used in your transition?',
      timestamp: '1 hour ago',
      likes: 3,
      liked: false
    },
    // Likes on your posts
    {
      id: 3,
      type: 'like',
      liker: 'Sarah Johnson',
      likerAvatar: 'https://placehold.co/40x40/10b981/white?text=SJ',
      postTitle: 'Mastering the System Design Interview: 5 Essential Patterns',
      timestamp: '45 minutes ago'
    },
    // Institution Events
    {
      id: 4,
      type: 'event',
      title: 'Annual Alumni Networking Conference 2025',
      description: 'Join us for our biggest alumni gathering of the year. Connect with fellow graduates, industry leaders, and explore new career opportunities.',
      date: '2025-08-15',
      time: '09:00 AM - 5:00 PM',
      location: 'Grand Ballroom, University Convention Center',
      organizer: 'SSN College of Engineering',
      organizerAvatar: 'https://placehold.co/40x40/6366f1/white?text=SSN',
      interested: 89,
      status: 'pending',
      imageUrl: 'https://placehold.co/600x300/6366f1/white?text=Conference'
    },
    // Mentorship Requests
    {
      id: 5,
      type: 'mentorship_request',
      studentName: 'Alex Johnson',
      studentMajor: 'Computer Science',
      graduationYear: '2024',
      message: 'Looking for guidance on career paths in software engineering.',
      status: 'pending',
      requestedAt: '30 minutes ago',
      aiRelevanceScore: 95
    },
    // More Knowledge Posts
    {
      id: 6,
      type: 'knowledge_post',
      author: 'Michael Chen',
      authorTitle: 'Staff Software Engineer at Google',
      authorAvatar: 'https://placehold.co/40x40/10b981/white?text=MC',
      title: 'Mastering the System Design Interview: 5 Essential Patterns',
      content: 'After conducting over 100 interviews at Google, I\'ve identified the 5 most common system design patterns that candidates struggle with...',
      category: 'interview-strategies',
      timestamp: '5 hours ago',
      likes: 87,
      comments: 24,
      shares: 18,
      bookmarks: 34,
      liked: true,
      bookmarked: true
    },
    // More Comments
    {
      id: 7,
      type: 'comment',
      commenter: 'Priya Sharma',
      commenterAvatar: 'https://placehold.co/40x40/ec4899/white?text=PS',
      postTitle: 'Mastering the System Design Interview: 5 Essential Patterns',
      content: 'This is gold! Would love to see examples of actual system designs for each pattern.',
      timestamp: '3 hours ago',
      likes: 12,
      liked: false
    },
    // More Events
    {
      id: 8,
      type: 'event',
      title: 'Startup Pitch Competition Finals',
      description: 'Watch the final round of our annual student startup pitch competition. Winners will receive funding opportunities and mentorship...',
      date: '2025-07-30',
      time: '6:00 PM - 9:00 PM',
      location: 'Innovation Hub, Main Campus',
      organizer: 'Entrepreneurship Cell',
      organizerAvatar: 'https://placehold.co/40x40/f97316/white?text=ECell',
      interested: 203,
      status: 'accepted',
      imageUrl: 'https://placehold.co/600x300/f97316/white?text=Pitch'
    }
  ];

  const filters = [
    { id: 'all', name: 'All Activities', icon: <FiFilter /> },
    { id: 'knowledge_post', name: 'Knowledge Posts', icon: <FiBook /> },
    { id: 'comment', name: 'Comments', icon: <FiMessageSquare /> },
    { id: 'like', name: 'Likes', icon: <FiHeart /> },
    { id: 'event', name: 'Events', icon: <FiCalendar /> },
    { id: 'mentorship_request', name: 'Mentorship', icon: <FiUserPlus /> }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'knowledge_post': return <FiBook className="text-blue-500" />;
      case 'comment': return <FiMessageSquare className="text-green-500" />;
      case 'like': return <FiHeart className="text-red-500" />;
      case 'event': return <FiCalendar className="text-purple-500" />;
      case 'mentorship_request': return <FiUserPlus className="text-indigo-500" />;
      default: return <FiActivity className="text-gray-500" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'knowledge_post': return 'Knowledge Post';
      case 'comment': return 'Comment';
      case 'like': return 'Like';
      case 'event': return 'Event';
      case 'mentorship_request': return 'Mentorship Request';
      default: return 'Activity';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // In a real app, this would filter based on search and filter criteria
    // For now, we're just setting the mock data
  }, [searchQuery, activeFilter]);

  const formatDate = (timestamp) => {
    return timestamp;
  };

  const handleLike = (id) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id 
          ? { 
              ...activity, 
              liked: !activity.liked, 
              likes: activity.liked ? activity.likes - 1 : activity.likes + 1 
            } 
          : activity
      )
    );
  };

  const handleBookmark = (id) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id 
          ? { 
              ...activity, 
              bookmarked: !activity.bookmarked, 
              bookmarks: activity.bookmarked ? activity.bookmarks - 1 : activity.bookmarks + 1 
            } 
          : activity
      )
    );
  };

  const handleAcceptEvent = (id) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id && activity.type === 'event'
          ? { ...activity, status: 'accepted' } 
          : activity
      )
    );
  };

  const handleRejectEvent = (id) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id && activity.type === 'event'
          ? { ...activity, status: 'rejected' } 
          : activity
      )
    );
  };

  const handleAcceptMentorship = (id) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id && activity.type === 'mentorship_request'
          ? { ...activity, status: 'accepted' } 
          : activity
      )
    );
  };

  const handleRejectMentorship = (id) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id && activity.type === 'mentorship_request'
          ? { ...activity, status: 'rejected' } 
          : activity
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your activity feed...</p>
        </div>
      </div>
    );
  }

  // Filter activities based on active filter and search query
  const filteredActivities = activities.filter(activity => {
    // Apply type filter
    if (activeFilter !== 'all' && activity.type !== activeFilter) {
      return false;
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      switch (activity.type) {
        case 'knowledge_post':
          return activity.title.toLowerCase().includes(query) || 
                 activity.content.toLowerCase().includes(query) ||
                 activity.author.toLowerCase().includes(query);
        case 'comment':
          return activity.commenter.toLowerCase().includes(query) || 
                 activity.postTitle.toLowerCase().includes(query) ||
                 activity.content.toLowerCase().includes(query);
        case 'like':
          return activity.liker.toLowerCase().includes(query) || 
                 activity.postTitle.toLowerCase().includes(query);
        case 'event':
          return activity.title.toLowerCase().includes(query) || 
                 activity.description.toLowerCase().includes(query) ||
                 activity.organizer.toLowerCase().includes(query);
        case 'mentorship_request':
          return activity.studentName.toLowerCase().includes(query) || 
                 activity.studentMajor.toLowerCase().includes(query) ||
                 activity.message.toLowerCase().includes(query);
        default:
          return true;
      }
    }
    
    return true;
  }).sort((a, b) => {
    // Sort by timestamp (most recent first)
    // For simplicity, we're using the id as a proxy for timestamp
    return b.id - a.id;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Activity Hub
          </h1>
          <p className="text-gray-600 mt-2">
            All your alumni activities in one place, sorted by most recent
          </p>
        </motion.div>

        {/* Stats Cards */}
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

        {/* Controls */}
        <motion.div 
          className="flex flex-col lg:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filter */}
          <div className="relative">
            <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/70 shadow-sm">
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="py-3 pl-4 pr-8 bg-transparent focus:outline-none appearance-none"
              >
                {filters.map(filter => (
                  <option key={filter.id} value={filter.id}>
                    {filter.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Activity Feed */}
        <div className="space-y-6">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <motion.div
                key={`${activity.type}-${activity.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden"
              >
                <div className="p-6">
                  {/* Activity Header */}
                  <div className="flex items-start mb-4">
                    <div className="mr-3 mt-1">
                      {getTypeIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">
                          {getTypeLabel(activity.type)}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {formatDate(activity.timestamp || activity.requestedAt)}
                        </span>
                      </div>
                      {activity.type === 'knowledge_post' && (
                        <p className="text-gray-600 text-sm">
                          Posted by {activity.author}
                        </p>
                      )}
                      {activity.type === 'comment' && (
                        <p className="text-gray-600 text-sm">
                          {activity.commenter} commented on "{activity.postTitle}"
                        </p>
                      )}
                      {activity.type === 'like' && (
                        <p className="text-gray-600 text-sm">
                          {activity.liker} liked your post "{activity.postTitle}"
                        </p>
                      )}
                      {activity.type === 'event' && (
                        <p className="text-gray-600 text-sm">
                          {activity.title} by {activity.organizer}
                        </p>
                      )}
                      {activity.type === 'mentorship_request' && (
                        <p className="text-gray-600 text-sm">
                          Request from {activity.studentName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Activity Content */}
                  {activity.type === 'knowledge_post' && (
                    <div className="mb-4">
                      <h4 className="text-lg font-bold text-gray-800 mb-2">{activity.title}</h4>
                      <p className="text-gray-700 mb-4">{activity.content.substring(0, 150)}...</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {activity.tags && activity.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <button 
                            onClick={() => handleLike(activity.id)}
                            className={`flex items-center space-x-1 ${activity.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                          >
                            <FiHeart className={activity.liked ? 'fill-current' : ''} />
                            <span>{activity.likes}</span>
                          </button>
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500">
                            <FiMessageSquare />
                            <span>{activity.comments}</span>
                          </button>
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-purple-500">
                            <FiSend />
                            <span>{activity.shares}</span>
                          </button>
                        </div>
                        <button 
                          onClick={() => handleBookmark(activity.id)}
                          className={`flex items-center space-x-1 ${activity.bookmarked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
                        >
                          <FiBookmark className={activity.bookmarked ? 'fill-current' : ''} />
                          <span>{activity.bookmarks}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {activity.type === 'comment' && (
                    <div className="mb-4">
                      <div className="flex items-center mb-3">
                        <img 
                          src={activity.commenterAvatar} 
                          alt={activity.commenter}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="font-medium text-gray-800">{activity.commenter}</span>
                      </div>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg mb-3">
                        "{activity.content}"
                      </p>
                      <button 
                        onClick={() => handleLike(activity.id)}
                        className={`flex items-center space-x-1 ${activity.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                      >
                        <FiHeart className={activity.liked ? 'fill-current' : ''} />
                        <span>{activity.likes} likes</span>
                      </button>
                    </div>
                  )}

                  {activity.type === 'like' && (
                    <div className="flex items-center">
                      <img 
                        src={activity.likerAvatar} 
                        alt={activity.liker}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className="text-gray-700">
                        <span className="font-medium">{activity.liker}</span> liked your post "{activity.postTitle}"
                      </span>
                    </div>
                  )}

                  {activity.type === 'event' && (
                    <div className="mb-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-1/3">
                          <img 
                            src={activity.imageUrl} 
                            alt={activity.title}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                        <div className="md:w-2/3">
                          <h4 className="text-lg font-bold text-gray-800 mb-2">{activity.title}</h4>
                          <p className="text-gray-700 text-sm mb-3">{activity.description.substring(0, 100)}...</p>
                          <div className="flex items-center gap-4 text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <FiCalendar size={16} />
                              <span>{activity.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FiClock size={16} />
                              <span>{activity.time}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600 mb-4">
                            <FiMapPin size={16} />
                            <span>{activity.location}</span>
                          </div>
                          <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-4 ${
                            getStatusColor(activity.status)
                          }`}>
                            {getStatusText(activity.status)}
                          </div>
                          
                          {activity.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAcceptEvent(activity.id)}
                                className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                              >
                                <FiCheck size={14} />
                                <span>Accept</span>
                              </button>
                              <button
                                onClick={() => handleRejectEvent(activity.id)}
                                className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                              >
                                <FiX size={14} />
                                <span>Decline</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activity.type === 'mentorship_request' && (
                    <div className="mb-4">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                          {activity.studentName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{activity.studentName}</h4>
                          <p className="text-gray-600 text-sm">{activity.studentMajor}, Class of {activity.graduationYear}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg mb-4">
                        "{activity.message}"
                      </p>
                      <div className="flex items-center justify-between">
                        <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          activity.aiRelevanceScore >= 90 ? 'bg-green-100 text-green-800' :
                          activity.aiRelevanceScore >= 80 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          Relevance: {activity.aiRelevanceScore}%
                        </div>
                        
                        {activity.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAcceptMentorship(activity.id)}
                              className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                            >
                              <FiCheck size={14} />
                              <span>Accept</span>
                            </button>
                            <button
                              onClick={() => handleRejectMentorship(activity.id)}
                              className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                            >
                              <FiX size={14} />
                              <span>Decline</span>
                            </button>
                          </div>
                        )}
                        
                        {activity.status === 'accepted' && (
                          <div className="text-green-600 font-medium">
                            Accepted
                          </div>
                        )}
                        
                        {activity.status === 'rejected' && (
                          <div className="text-red-600 font-medium">
                            Declined
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No activities found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YourActivityHub;