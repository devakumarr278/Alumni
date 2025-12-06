import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/common/Card';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [showPostForm, setShowPostForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockPosts = [
      {
        id: 1,
        author: 'Sarah Johnson',
        authorTitle: 'Marketing Director at TechCorp',
        content: 'Just finished speaking at the Digital Marketing Summit! It was amazing to connect with fellow alumni and share insights on the future of marketing. #AlumniNetwork #Marketing',
        timestamp: '2 hours ago',
        likes: 24,
        comments: 5,
        shares: 3,
        liked: false
      },
      {
        id: 2,
        author: 'Michael Chen',
        authorTitle: 'Software Engineer at Google',
        content: 'Excited to announce that our team just launched a new feature that will help millions of users! Big thanks to my alma mater for the foundation that got me here. #SoftwareEngineering #Success',
        timestamp: '5 hours ago',
        likes: 42,
        comments: 8,
        shares: 12,
        liked: true
      },
      {
        id: 3,
        author: 'Emma Wilson',
        authorTitle: 'Data Analyst at FinanceCo',
        content: 'Just published a new article on predictive analytics in the financial sector. Would love to hear your thoughts! Link in comments. #DataScience #Analytics',
        timestamp: '1 day ago',
        likes: 18,
        comments: 3,
        shares: 7,
        liked: false
      },
      {
        id: 4,
        author: 'David Brown',
        authorTitle: 'Product Manager at StartupX',
        content: 'Looking for recommendations on the best project management tools for remote teams. Any suggestions from fellow alumni?',
        timestamp: '1 day ago',
        likes: 15,
        comments: 12,
        shares: 2,
        liked: false
      }
    ];

    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreatePost = () => {
    if (newPost.trim()) {
      const post = {
        id: posts.length + 1,
        author: 'You',
        authorTitle: 'Alumni Member',
        content: newPost,
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false
      };
      setPosts([post, ...posts]);
      setNewPost('');
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

  const handleShare = (id) => {
    setPosts(posts.map(post => 
      post.id === id 
        ? { ...post, shares: post.shares + 1 } 
        : post
    ));
    // In a real app, this would trigger a share action
    alert('Post shared successfully!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-purple-100"
      >
        <h1 className="text-2xl font-bold text-gray-800">Community Posts</h1>
        <p className="text-gray-700 mt-1">Share updates, ask questions, and connect with fellow alumni</p>
      </motion.div>

      {/* Create Post */}
      <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
        <div className="flex">
          <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold mr-3">
            Y
          </div>
          <div className="flex-1">
            <button
              onClick={() => setShowPostForm(!showPostForm)}
              className="w-full text-left p-3 bg-gray-100 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors duration-200"
            >
              Share something with the community...
            </button>
            
            {showPostForm && (
              <div className="mt-3">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="What would you like to share?"
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50"
                ></textarea>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                      <i className="fas fa-image"></i>
                    </button>
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                      <i className="fas fa-video"></i>
                    </button>
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                      <i className="fas fa-calendar-alt"></i>
                    </button>
                  </div>
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPost.trim()}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                      newPost.trim() 
                        ? 'bg-purple-500 text-white hover:bg-purple-600' 
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold mr-3">
                  {post.author.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{post.author}</h3>
                      <p className="text-sm text-gray-600">{post.authorTitle}</p>
                    </div>
                    <span className="text-xs text-gray-500">{post.timestamp}</span>
                  </div>
                  
                  <p className="mt-3 text-gray-700">{post.content}</p>
                  
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <div className="flex space-x-6">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center space-x-1 ${
                          post.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <i className={`fas ${post.liked ? 'fa-heart' : 'fa-heart'}`}></i>
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
                        <i className="fas fa-comment"></i>
                        <span>{post.comments}</span>
                      </button>
                      <button 
                        onClick={() => handleShare(post.id)}
                        className="flex items-center space-x-1 text-gray-500 hover:text-green-500"
                      >
                        <i className="fas fa-share"></i>
                        <span>{post.shares}</span>
                      </button>
                    </div>
                    
                    <button className="text-gray-500 hover:text-purple-500">
                      <i className="fas fa-ellipsis-h"></i>
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center">
        <button className="px-6 py-3 bg-white/80 backdrop-blur-lg border border-purple-100 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-200">
          Load More Posts
        </button>
      </div>
    </div>
  );
};

export default Posts;