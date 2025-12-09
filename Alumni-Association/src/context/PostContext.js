import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const PostContext = createContext();

// Use the environment variable for the API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch posts from backend
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For public posts, we don't need authentication
      const response = await fetch(`${API_BASE_URL}/posts/public`);
      
      const result = await response.json();
      
      if (result.success) {
        setPosts(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch posts');
      console.error('Fetch posts error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new post with image upload
  const createPost = async (postData, images) => {
    if (!user) return;
    
    try {
      const formData = new FormData();
      
      // Append post data as JSON string
      formData.append('author', postData.author);
      formData.append('caption', postData.caption);
      formData.append('visibility', postData.visibility || 'public');
      
      // Append images
      if (images && images.length > 0) {
        images.forEach((image, index) => {
          formData.append('images', image);
        });
      }
      
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh posts after creating a new one
        fetchPosts();
        return result.data;
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error('Create post error:', err);
      throw err;
    }
  };

  // Like a post
  const likePost = async (postId) => {
    // Allow liking even when not logged in by sending a guest request
    try {
      const headers = {};
      if (user && localStorage.getItem('token')) {
        headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: headers
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update the post in state
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId 
              ? { ...post, likes: result.data.likes }
              : post
          )
        );
      }
    } catch (err) {
      console.error('Like post error:', err);
    }
  };

  // Add comment to post
  const addComment = async (postId, commentText) => {
    // Allow commenting even when not logged in by sending a guest request
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      if (user && localStorage.getItem('token')) {
        headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comment`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ text: commentText })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update the post in state
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId 
              ? { ...post, comments: [...post.comments, result.data] }
              : post
          )
        );
      }
    } catch (err) {
      console.error('Add comment error:', err);
    }
  };

  // Delete a post
  const deletePost = async (postId) => {
    if (!user) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Remove the post from state
        setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      }
    } catch (err) {
      console.error('Delete post error:', err);
    }
  };

  // Load posts when component mounts (both for logged in and logged out users)
  useEffect(() => {
    fetchPosts();
  }, []);

  const value = {
    posts,
    loading,
    error,
    createPost,
    likePost,
    addComment,
    deletePost,
    fetchPosts
  };

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
};