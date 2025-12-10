import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiMessageSquare, FiShare2, FiBookmark, FiMoreHorizontal, FiSearch, FiFilter, FiPlus, FiChevronDown, FiTag, FiBriefcase, FiBook, FiTrendingUp, FiAward, FiSend, FiThumbsUp } from 'react-icons/fi';

const AlumniKnowledgePosts = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'career-advice',
    tags: []
  });
  const [showPostForm, setShowPostForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [showComments, setShowComments] = useState({});

  const categories = [
    { id: 'all', name: 'All Posts', icon: <FiTag /> },
    { id: 'job-journeys', name: 'Job Journeys', icon: <FiBriefcase /> },
    { id: 'interview-strategies', name: 'Interview Strategies', icon: <FiBook /> },
    { id: 'career-growth', name: 'Career Growth', icon: <FiTrendingUp /> },
    { id: 'resume-tips', name: 'Resume Tips', icon: <FiAward /> },
    { id: 'industry-insights', name: 'Industry Insights', icon: <FiSearch /> }
  ];

  const mockPosts = [
    {
      id: 1,
      author: 'Sarah Johnson',
      authorTitle: 'Senior Marketing Director at TechCorp',
      authorAvatar: 'https://placehold.co/40x40/6366f1/white?text=SJ',
      title: 'From Campus to Corporate: My Journey in Digital Marketing',
      content: 'Three years ago, I graduated with a degree in Communications and no clear career path. Today, I lead a team of 15 marketers at TechCorp. Here\'s how I navigated the transition from student to senior leadership...',
      category: 'job-journeys',
      tags: ['Digital Marketing', 'Career Transition', 'Leadership'],
      timestamp: '2 hours ago',
      likes: 42,
      comments: 8,
      shares: 3,
      bookmarks: 12,
      liked: false,
      bookmarked: false
    },
    {
      id: 2,
      author: 'Michael Chen',
      authorTitle: 'Staff Software Engineer at Google',
      authorAvatar: 'https://placehold.co/40x40/10b981/white?text=MC',
      title: 'Mastering the System Design Interview: 5 Essential Patterns',
      content: 'After conducting over 100 interviews at Google, I\'ve identified the 5 most common system design patterns that candidates struggle with. Here\'s how to approach each one with confidence...',
      category: 'interview-strategies',
      tags: ['System Design', 'Interview Prep', 'Software Engineering'],
      timestamp: '5 hours ago',
      likes: 87,
      comments: 24,
      shares: 18,
      bookmarks: 34,
      liked: true,
      bookmarked: true
    },
    {
      id: 3,
      author: 'Emma Wilson',
      authorTitle: 'Data Scientist at FinanceCo',
      authorAvatar: 'https://placehold.co/40x40/ec4899/white?text=EW',
      title: 'Common Resume Mistakes That Cost Me Job Opportunities',
      content: 'As someone who reviews hundreds of resumes each quarter, I\'ve seen patterns that consistently get candidates rejected. Here are the top 7 mistakes I\'ve encountered and how to fix them...',
      category: 'resume-tips',
      tags: ['Resume Writing', 'Job Applications', 'Career Advice'],
      timestamp: '1 day ago',
      likes: 56,
      comments: 15,
      shares: 9,
      bookmarks: 28,
      liked: false,
      bookmarked: false
    },
    {
      id: 4,
      author: 'David Brown',
      authorTitle: 'Product Manager at StartupX',
      authorAvatar: 'https://placehold.co/40x40/f97316/white?text=DB',
      title: 'Breaking Into Product Management: A Non-Traditional Path',
      content: 'I didn\'t study business or product management in college. My background was in psychology, but I transitioned into PM roles through strategic networking and skill-building. Here\'s my roadmap...',
      category: 'career-growth',
      tags: ['Product Management', 'Career Change', 'Networking'],
      timestamp: '1 day ago',
      likes: 34,
      comments: 12,
      shares: 7,
      bookmarks: 19,
      liked: false,
      bookmarked: true
    }
  ];

  const mockComments = {
    1: [
      {
        id: 1,
        author: 'Alex Turner',
        authorAvatar: 'https://placehold.co/32x32/8b5cf6/white?text=AT',
        content: 'This is incredibly helpful! Could you share more about the specific tools you used in your transition?',
        timestamp: '1 hour ago',
        likes: 3,
        liked: false
      },
      {
        id: 2,
        author: 'Sarah Johnson',
        authorAvatar: 'https://placehold.co/32x32/6366f1/white?text=SJ',
        content: 'Great question! I primarily used HubSpot and Google Analytics. Happy to dive deeper in a follow-up post.',
        timestamp: '45 minutes ago',
        likes: 5,
        liked: true
      }
    ],
    2: [
      {
        id: 1,
        author: 'Priya Sharma',
        authorAvatar: 'https://placehold.co/32x32/ec4899/white?text=PS',
        content: 'This is gold! Would love to see examples of actual system designs for each pattern.',
        timestamp: '3 hours ago',
        likes: 12,
        liked: false
      }
    ]
  };

  useEffect(() => {
    setPosts(mockPosts);
    setComments(mockComments);
  }, []);

  const handleCreatePost = () => {
    if (newPost.title.trim() && newPost.content.trim()) {
      const post = {
        id: posts.length + 1,
        author: 'You',
        authorTitle: 'Alumni Member',
        authorAvatar: 'https://placehold.co/40x40/8b5cf6/white?text=Y',
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
        tags: [...tags],
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        shares: 0,
        bookmarks: 0,
        liked: false,
        bookmarked: false
      };
      setPosts([post, ...posts]);
      setNewPost({
        title: '',
        content: '',
        category: 'career-advice',
        tags: []
      });
      setTags([]);
      setShowPostForm(false);
    }
  };

  const handleLike = (id) => {
    setPosts(posts.map(post => 
      post.id === id 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 } 
        : post
    ));
  };

  const handleBookmark = (id) => {
    setPosts(posts.map(post => 
      post.id === id 
        ? { ...post, bookmarked: !post.bookmarked, bookmarks: post.bookmarked ? post.bookmarks - 1 : post.bookmarks + 1 } 
        : post
    ));
  };

  const handleShare = (id) => {
    setPosts(posts.map(post => 
      post.id === id 
        ? { ...post, shares: post.shares + 1 } 
        : post
    ));
    // In a real app, this would trigger a share action
    alert('Post shared successfully!');
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleCommentSubmit = (postId) => {
    if (newComment[postId]?.trim()) {
      const comment = {
        id: Date.now(),
        author: 'You',
        authorAvatar: 'https://placehold.co/32x32/8b5cf6/white?text=Y',
        content: newComment[postId],
        timestamp: 'Just now',
        likes: 0,
        liked: false
      };
      
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), comment]
      }));
      
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, comments: post.comments + 1 } 
          : post
      ));
      
      setNewComment(prev => ({
        ...prev,
        [postId]: ''
      }));
    }
  };

  const handleCommentLike = (postId, commentId) => {
    setComments(prev => ({
      ...prev,
      [postId]: prev[postId].map(comment => 
        comment.id === commentId 
          ? { ...comment, liked: !comment.liked, likes: comment.liked ? comment.likes - 1 : comment.likes + 1 } 
          : comment
      )
    }));
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
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
            Alumni Knowledge Hub
          </h1>
          <p className="text-gray-600 mt-2">
            Share real-world experiences and insights with fellow alumni
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow border border-white/50 p-4">
            <div className="text-2xl font-bold text-blue-600">1,248</div>
            <div className="text-gray-600 text-sm">Knowledge Posts</div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow border border-white/50 p-4">
            <div className="text-2xl font-bold text-purple-600">892</div>
            <div className="text-gray-600 text-sm">Active Contributors</div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow border border-white/50 p-4">
            <div className="text-2xl font-bold text-pink-600">12.4k</div>
            <div className="text-gray-600 text-sm">Monthly Readers</div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow border border-white/50 p-4">
            <div className="text-2xl font-bold text-indigo-600">98%</div>
            <div className="text-gray-600 text-sm">Helpful Rating</div>
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
              placeholder="Search knowledge posts..."
              className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Category Filter */}
          <div className="relative">
            <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/70 shadow-sm">
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="py-3 pl-4 pr-8 bg-transparent focus:outline-none appearance-none"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          {/* Create Post Button */}
          <button
            onClick={() => setShowPostForm(!showPostForm)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
          >
            <FiPlus className="text-lg" />
            <span className="hidden sm:inline">Share Knowledge</span>
          </button>
        </motion.div>

        {/* Create Post Form */}
        <AnimatePresence>
          {showPostForm && (
            <motion.div 
              className="mb-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Share Your Knowledge</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                      placeholder="What insights are you sharing today?"
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={newPost.category}
                      onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="job-journeys">Job Journeys</option>
                      <option value="interview-strategies">Interview Strategies</option>
                      <option value="career-growth">Career Growth</option>
                      <option value="resume-tips">Resume Tips</option>
                      <option value="industry-insights">Industry Insights</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                    <textarea
                      value={newPost.content}
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                      placeholder="Share your experience, advice, or insights..."
                      rows={6}
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <div className="flex gap-2 mb-2">
                      {tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {tag}
                          <button 
                            onClick={() => removeTag(tag)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTag()}
                        placeholder="Add a tag..."
                        className="flex-1 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={addTag}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => setShowPostForm(false)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreatePost}
                      disabled={!newPost.title.trim() || !newPost.content.trim()}
                      className={`px-4 py-2 rounded-xl text-white ${
                        newPost.title.trim() && newPost.content.trim()
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                          : 'bg-gray-300 cursor-not-allowed'
                      }`}
                    >
                      Share Knowledge
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories Bar */}
        <motion.div 
          className="flex flex-wrap gap-2 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-gray-100 border border-white/50'
              }`}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden"
              >
                <div className="p-6">
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={post.authorAvatar} 
                        alt={post.author}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800">{post.author}</h3>
                        <p className="text-sm text-gray-600">{post.authorTitle}</p>
                        <p className="text-xs text-gray-500">{post.timestamp}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <FiMoreHorizontal />
                    </button>
                  </div>
                  
                  {/* Post Content */}
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-3">{post.title}</h2>
                    <p className="text-gray-700 leading-relaxed">{post.content}</p>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-6">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 ${
                          post.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <FiHeart className={post.liked ? 'fill-current' : ''} />
                        <span>{post.likes}</span>
                      </button>
                      
                      <button 
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center gap-2 text-gray-500 hover:text-blue-500"
                      >
                        <FiMessageSquare />
                        <span>{post.comments}</span>
                      </button>
                      
                      <button 
                        onClick={() => handleShare(post.id)}
                        className="flex items-center gap-2 text-gray-500 hover:text-green-500"
                      >
                        <FiShare2 />
                        <span>{post.shares}</span>
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => handleBookmark(post.id)}
                      className={`text-gray-500 hover:text-purple-500 ${
                        post.bookmarked ? 'text-purple-500' : ''
                      }`}
                    >
                      <FiBookmark className={post.bookmarked ? 'fill-current' : ''} />
                    </button>
                  </div>
                  
                  {/* Comments Section */}
                  <AnimatePresence>
                    {showComments[post.id] && (
                      <motion.div 
                        className="mt-6 pt-6 border-t border-gray-100"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Existing Comments */}
                        {comments[post.id] && comments[post.id].map(comment => (
                          <div key={comment.id} className="flex gap-3 mb-4">
                            <img 
                              src={comment.authorAvatar} 
                              alt={comment.author}
                              className="w-8 h-8 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="bg-gray-100 rounded-xl p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-sm">{comment.author}</span>
                                  <span className="text-xs text-gray-500">{comment.timestamp}</span>
                                </div>
                                <p className="text-gray-700 text-sm">{comment.content}</p>
                              </div>
                              <div className="flex items-center gap-4 mt-2 ml-2">
                                <button 
                                  onClick={() => handleCommentLike(post.id, comment.id)}
                                  className={`flex items-center gap-1 text-xs ${
                                    comment.liked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
                                  }`}
                                >
                                  <FiThumbsUp className={comment.liked ? 'fill-current' : ''} />
                                  <span>{comment.likes}</span>
                                </button>
                                <button className="text-xs text-gray-500 hover:text-blue-500">
                                  Reply
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Add Comment */}
                        <div className="flex gap-3 mt-4">
                          <img 
                            src="https://placehold.co/32x32/8b5cf6/white?text=Y" 
                            alt="You"
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={newComment[post.id] || ''}
                              onChange={(e) => setNewComment(prev => ({
                                ...prev,
                                [post.id]: e.target.value
                              }))}
                              placeholder="Add a comment..."
                              className="flex-1 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/70 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                            />
                            <button
                              onClick={() => handleCommentSubmit(post.id)}
                              disabled={!newComment[post.id]?.trim()}
                              className={`p-2 rounded-full ${
                                newComment[post.id]?.trim()
                                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              <FiSend size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-8">
          <button className="px-6 py-3 bg-white/80 backdrop-blur-lg border border-purple-100 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-200 shadow-sm">
            Load More Posts
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlumniKnowledgePosts;