import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FollowRequestItem from './FollowRequestItem';
import ProfileModal from './ProfileModal';
import { getFollowRequests, getFollowers, acceptFollowRequest, rejectFollowRequest } from '../../services/followService';
import './FollowRequests.css';

const FollowRequests = () => {
  console.log('ENHANCED FollowRequests component loaded - this should be visible if the enhanced version is working');
  
  const [requests, setRequests] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('requests');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (activeTab === 'requests') {
          const response = await getFollowRequests();
          if (response.success) {
            setRequests(response.data.followRequests);
          }
        } else {
          const response = await getFollowers();
          if (response.success) {
            setFollowers(response.data.followers);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleAccept = async (id) => {
    try {
      const response = await acceptFollowRequest(id);
      if (response.success) {
        // Remove from requests list with animation
        setRequests(prev => prev.filter(r => r._id !== id));
        
        // In a real implementation, you might want to add to followers list
        // But for now, we'll just refresh the data when switching tabs
      }
    } catch (err) {
      console.error('Error accepting request:', err);
      // You might want to show an error message to the user
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await rejectFollowRequest(id);
      if (response.success) {
        // Remove from requests list with animation
        setRequests(prev => prev.filter(r => r._id !== id));
      }
    } catch (err) {
      console.error('Error rejecting request:', err);
      // You might want to show an error message to the user
    }
  };

  const openProfile = (user) => {
    setSelectedUser(user);
  };

  const closeProfile = () => {
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <div className="follow-requests-container">
        <div style={{ 
          position: 'absolute', 
          top: '10px', 
          left: '10px', 
          backgroundColor: 'red', 
          color: 'white', 
          padding: '10px', 
          zIndex: 1000,
          fontWeight: 'bold',
          fontSize: '20px'
        }}>
          ENHANCED VERSION LOADING - VERY DISTINCTIVE
        </div>
        <div className="loading-state">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="spinner"
          ></motion.div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="follow-requests-container">
        <div style={{ 
          position: 'absolute', 
          top: '10px', 
          left: '10px', 
          backgroundColor: 'red', 
          color: 'white', 
          padding: '10px', 
          zIndex: 1000,
          fontWeight: 'bold',
          fontSize: '20px'
        }}>
          ENHANCED VERSION ERROR - VERY DISTINCTIVE
        </div>
        <div className="error-state">
          <p>{error}</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
          >
            Retry
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="follow-requests-container">
      <div style={{ 
        position: 'absolute', 
        top: '10px', 
        left: '10px', 
        backgroundColor: 'red', 
        color: 'white', 
        padding: '10px', 
        zIndex: 1000,
        fontWeight: 'bold',
        fontSize: '20px'
      }}>
        ENHANCED VERSION ACTIVE - VERY DISTINCTIVE
      </div>
      <div style={{ 
        position: 'absolute', 
        top: '10px', 
        right: '10px', 
        backgroundColor: 'purple', 
        color: 'white', 
        padding: '10px', 
        zIndex: 1000,
        fontWeight: 'bold',
        fontSize: '20px'
      }}>
        ENHANCED VERSION ACTIVE - VERY DISTINCTIVE
      </div>
      <div className="follow-requests-header">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Follow Requests - ENHANCED VERSION
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Manage your connection requests - ENHANCED VERSION
        </motion.p>
      </div>

      <div className="tabs-container">
        <motion.button 
          className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Follow Requests ({requests.length})
        </motion.button>
        <motion.button 
          className={`tab ${activeTab === 'followers' ? 'active' : ''}`}
          onClick={() => setActiveTab('followers')}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Followers ({followers.length})
        </motion.button>
      </div>

      <div className="content-container">
        <AnimatePresence mode="wait">
          {activeTab === 'requests' && (
            <motion.div
              key="requests"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="requests-panel"
            >
              {requests.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="empty-state"
                >
                  <p>No pending follow requests</p>
                </motion.div>
              ) : (
                <div className="requests-list">
                  <AnimatePresence>
                    {requests.map((request) => (
                      <FollowRequestItem
                        key={request._id}
                        request={request}
                        onAccept={handleAccept}
                        onReject={handleReject}
                        onOpenProfile={openProfile}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'followers' && (
            <motion.div
              key="followers"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="followers-panel"
            >
              {followers.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="empty-state"
                >
                  <p>No followers yet</p>
                </motion.div>
              ) : (
                <div className="followers-list">
                  <AnimatePresence>
                    {followers.map((follower) => (
                      <motion.div
                        key={follower._id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ 
                          y: -5,
                          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                          borderColor: "rgba(0, 198, 255, 0.3)"
                        }}
                        className="follower-item"
                        onClick={() => openProfile(follower.followerId)}
                      >
                        <div className="follower-info">
                          <motion.div 
                            className="avatar-placeholder"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {follower.followerId.firstName?.charAt(0)}{follower.followerId.lastName?.charAt(0)}
                          </motion.div>
                          <div className="follower-details">
                            <h3>{follower.followerId.firstName} {follower.followerId.lastName}</h3>
                            <p>{follower.followerId.department} • {follower.followerId.college}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedUser && (
          <ProfileModal user={selectedUser} onClose={closeProfile} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FollowRequests;