import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileModal = ({ user, onClose }) => {
  console.log('ENHANCED ProfileModal component loaded - enhanced version');
  
  return (
    <AnimatePresence>
      <motion.div
        className="profile-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      >
        <motion.div
          className="profile-modal"
          initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0.8, rotate: 5, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ 
            position: 'absolute', 
            top: '10px', 
            left: '10px', 
            backgroundColor: 'purple', 
            color: 'white', 
            padding: '10px', 
            zIndex: 1000,
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            ENHANCED PROFILE MODAL - VERY DISTINCTIVE
          </div>
          <motion.button 
            className="close-btn" 
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            ×
          </motion.button>
          
          <div className="profile-header">
            <motion.div 
              className="avatar-placeholder-large"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {user.firstName} {user.lastName}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {user.department} • Class of {user.gradYear}
            </motion.p>
          </div>
          
          <motion.div 
            className="profile-details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="detail-row">
              <span className="label">Age:</span>
              <span>{user.age || 'Not provided'}</span>
            </div>
            <div className="detail-row">
              <span className="label">Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="detail-row">
              <span className="label">College:</span>
              <span>{user.college}</span>
            </div>
            <div className="detail-row">
              <span className="label">Location:</span>
              <span>{user.location || 'Not provided'}</span>
            </div>
            <div className="detail-row">
              <span className="label">Year:</span>
              <span>{user.year || 'Not provided'}</span>
            </div>
            
            <div className="skills-section">
              <motion.h3
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                Skills
              </motion.h3>
              <div className="skills-container">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill, index) => (
                    <motion.span
                      key={index}
                      className="skill-tag"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ 
                        y: -5,
                        boxShadow: "0 5px 15px rgba(0, 198, 255, 0.4)",
                        background: "linear-gradient(135deg, rgba(0, 198, 255, 0.3), rgba(0, 114, 255, 0.3))"
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))
                ) : (
                  <p className="no-skills">No skills listed</p>
                )}
              </div>
            </div>
            
            <div className="links-section">
              {user.github && (
                <motion.a 
                  href={`https://${user.github}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="link-item"
                  whileHover={{ 
                    y: -3,
                    boxShadow: "0 5px 15px rgba(0, 198, 255, 0.4)",
                    background: "linear-gradient(135deg, rgba(0, 198, 255, 0.3), rgba(0, 114, 255, 0.3))"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  GitHub
                </motion.a>
              )}
              {user.linkedin && (
                <motion.a 
                  href={`https://${user.linkedin}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="link-item"
                  whileHover={{ 
                    y: -3,
                    boxShadow: "0 5px 15px rgba(0, 198, 255, 0.4)",
                    background: "linear-gradient(135deg, rgba(0, 198, 255, 0.3), rgba(0, 114, 255, 0.3))"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  LinkedIn
                </motion.a>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileModal;