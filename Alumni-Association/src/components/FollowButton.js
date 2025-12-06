import React, { useState, useEffect, useCallback } from 'react';
import databaseService from '../services/databaseService';
import webSocketService from '../services/webSocketService';

const FollowButton = ({ alumniId, alumniName, onFollowStatusChange, initialFollowStatus }) => {
  console.log('Rendering FollowButton for alumni:', alumniId);
  const [followStatus, setFollowStatus] = useState(initialFollowStatus || 'follow');
  const [loading, setLoading] = useState(false);

  // Check if this is mock data
  const isMockData = alumniId && alumniId.startsWith('mock_');

  // Handle WebSocket messages for follow request updates
  const handleFollowRequestUpdate = useCallback((data) => {
    console.log('Received follow request update in FollowButton:', data);
    if (data.type === 'follow_request_update' && data.data) {
      // Check if this update is for the current alumni
      if (data.data.alumniId === alumniId) {
        console.log(`Processing follow request update for alumni ${alumniId}:`, data.data.status);
        if (data.data.status === 'approved') {
          setFollowStatus('following');
          console.log(`Set follow status for ${alumniId} to following`);
          if (onFollowStatusChange) {
            onFollowStatusChange(alumniId, 'following');
          }
        } else if (data.data.status === 'rejected') {
          setFollowStatus('follow');
          console.log(`Set follow status for ${alumniId} to follow`);
          if (onFollowStatusChange) {
            onFollowStatusChange(alumniId, 'follow');
          }
        } else if (data.data.status === 'unfollowed') {
          setFollowStatus('follow');
          console.log(`Set follow status for ${alumniId} to follow (unfollowed)`);
          if (onFollowStatusChange) {
            onFollowStatusChange(alumniId, 'follow');
          }
        }
      } else {
        console.log(`WebSocket message received for alumni ${data.data.alumniId}, but current button is for alumni ${alumniId}`);
      }
    } else {
      console.log('Received non-follow-request-update message or missing data:', data);
    }
  }, [alumniId, onFollowStatusChange]);

  // Initialize WebSocket connection and listeners
  useEffect(() => {
    console.log('Adding WebSocket listener in FollowButton');
    // Listen for follow request updates
    webSocketService.on('notification', handleFollowRequestUpdate);
    
    return () => {
      console.log('Removing WebSocket listener in FollowButton');
      webSocketService.off('notification', handleFollowRequestUpdate);
    };
  }, [handleFollowRequestUpdate]);

  // Load follow status from API on component mount
  useEffect(() => {
    // Don't try to fetch status for mock data
    if (isMockData) {
      setFollowStatus('follow');
      return;
    }

    const loadFollowStatus = async () => {
      try {
        const response = await databaseService.getFollowStatus(alumniId);
        if (response.success) {
          const status = response.data.isFollowing ? 'following' : 
                        response.data.hasRequested ? 'requested' : 'follow';
          setFollowStatus(status);
        }
      } catch (error) {
        console.error('Error loading follow status:', error);
        // Default to 'follow' status if API fails
        setFollowStatus('follow');
      }
    };

    loadFollowStatus();
  }, [alumniId, isMockData]);

  const handleFollowClick = async () => {
    // Prevent clicking if already following or requested
    if (followStatus === 'following' || followStatus === 'requested' || loading || isMockData) return;
    
    setLoading(true);
    
    try {
      const response = await databaseService.followAlumni(alumniId);
      
      if (response.success) {
        // Check if already following or if request is pending
        const newStatus = response.data.alreadyFollowing ? 'following' : 'requested';
        setFollowStatus(newStatus);
        
        // Notify parent component
        if (onFollowStatusChange) {
          onFollowStatusChange(alumniId, newStatus);
        }
      } else {
        throw new Error(response.message || 'Failed to follow');
      }
    } catch (error) {
      console.error('Follow error:', error);
      // Handle error (you might want to show a toast notification)
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollowClick = async () => {
    // Prevent clicking if not following or if already requested
    if (followStatus !== 'following' || loading || isMockData) return;
    
    setLoading(true);
    
    try {
      const response = await databaseService.unfollowAlumni(alumniId);
      
      if (response.success) {
        // Update status to 'follow'
        setFollowStatus('follow');
        
        // Notify parent component
        if (onFollowStatusChange) {
          onFollowStatusChange(alumniId, 'follow');
        }
      } else {
        throw new Error(response.message || 'Failed to unfollow');
      }
    } catch (error) {
      console.error('Unfollow error:', error);
      // Handle error (you might want to show a toast notification)
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (loading) return '...';
    if (followStatus === 'following') return 'Following';
    if (followStatus === 'requested') return 'Requested';
    return 'Follow';
  };

  const getButtonClass = () => {
    if (loading) return 'bg-gray-300 text-gray-600 cursor-not-allowed';
    
    if (followStatus === 'following') {
      return 'bg-gray-200 text-gray-800 hover:bg-gray-300';
    }
    
    if (followStatus === 'requested') {
      return 'bg-blue-100 text-blue-800 cursor-not-allowed';
    }
    
    return 'bg-blue-600 text-white hover:bg-blue-700';
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={followStatus === 'following' ? handleUnfollowClick : handleFollowClick}
        disabled={loading || isMockData || (followStatus === 'requested')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClass()} ${
          isMockData ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {getButtonText()}
      </button>
      
      {isMockData && (
        <span className="text-xs text-gray-500 italic">
          (Mock data - follow disabled)
        </span>
      )}
    </div>
  );
};

export default FollowButton;