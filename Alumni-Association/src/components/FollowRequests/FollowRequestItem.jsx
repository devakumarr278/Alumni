import React from 'react';
import { motion } from 'framer-motion';

const FollowRequestItem = ({ request, onAccept, onReject, onOpenProfile }) => {
  console.log('ENHANCED FollowRequestItem component loaded - enhanced version');
  
  const handleAccept = (e) => {
    e.stopPropagation();
    onAccept(request._id);
  };

  const handleReject = (e) => {
    e.stopPropagation();
    onReject(request._id);
  };

  const handleOpenProfile = () => {
    onOpenProfile(request.followerId);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: -50 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        duration: 0.3 
      }}
      whileHover={{ 
        y: -5,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
        borderColor: "rgba(0, 198, 255, 0.3)"
      }}
      className="follow-request-item"
      onClick={handleOpenProfile}
    >
      <div style={{ 
        position: 'absolute', 
        top: '5px', 
        right: '5px', 
        backgroundColor: 'orange', 
        color: 'white', 
        padding: '5px', 
        fontSize: '12px',
        zIndex: 1000,
        fontWeight: 'bold'
      }}>
        ENHANCED REQUEST ITEM
      </div>
      <div className="request-info">
        <motion.div 
          className="avatar-placeholder"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {request.followerId.firstName?.charAt(0)}{request.followerId.lastName?.charAt(0)}
        </motion.div>
        <div className="request-details">
          <h3>{request.followerId.firstName} {request.followerId.lastName}</h3>
          <p>{request.followerId.department} • {request.followerId.college}</p>
        </div>
      </div>
      
      <div className="request-actions">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="accept-btn"
          onClick={handleAccept}
          aria-label="Accept follow request"
        >
          ✅
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
          className="reject-btn"
          onClick={handleReject}
          aria-label="Reject follow request"
        >
          ❌
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FollowRequestItem;