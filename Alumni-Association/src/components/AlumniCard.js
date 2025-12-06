import React, { useState, useEffect } from 'react';
import FollowButton from './FollowButton';
import AlumniProfileModal from './AlumniProfileModalWithSlots';

const AlumniCard = ({ alumni, onFollowStatusChange, followStatuses }) => {
  console.log('Rendering AlumniCard for alumni:', alumni);
  const {
    id,
    name,
    graduationYear,
    currentRole,
    company,
    location,
    skills,
    profileImage,
    isVerified,
    yearsOfExperience,
  } = alumni;

  const [showModal, setShowModal] = useState(false);
  const [followStatus, setFollowStatus] = useState('follow');

  // Get initials for avatar if no profile image
  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'AU';
  };

  const handleCardClick = (e) => {
    // Don't open modal if clicking on buttons
    if (e.target.tagName === 'BUTTON') return;
    setShowModal(true);
  };

  const handleFollowStatusChange = (alumniId, status) => {
    setFollowStatus(status);
    if (onFollowStatusChange) {
      onFollowStatusChange(alumniId, status);
    }
  };

  // Update follow status when followStatuses prop changes
  useEffect(() => {
    if (followStatuses && followStatuses[id] !== undefined) {
      setFollowStatus(followStatuses[id]);
    }
  }, [followStatuses, id]);

  return (
    <>
      <div 
        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-100"
        onClick={handleCardClick}
      >
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt={name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  {getInitials(name)}
                </div>
              )}
              <div>
                <div className="flex items-center">
                  <h3 className="font-semibold text-gray-900">{name}</h3>
                  {isVerified && (
                    <span className="ml-1 text-blue-500" title="Verified Alumni">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{graduationYear}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium">{currentRole}</span>
              {company && <span className="mx-1">•</span>}
              <span>{company}</span>
            </div>
            
            {location && (
              <div className="flex items-center text-sm text-gray-600">
                <span>{location}</span>
              </div>
            )}
            
            {yearsOfExperience && (
              <div className="text-sm text-gray-600">
                <span>{yearsOfExperience} years of experience</span>
              </div>
            )}
          </div>
          
          {skills && skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {skills.slice(0, 3).map((skill, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{skills.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
          <FollowButton 
            alumniId={id}
            alumniName={name}
            onFollowStatusChange={handleFollowStatusChange}
            initialFollowStatus={followStatus}
          />
        </div>
      </div>
      
      {showModal && (
        <AlumniProfileModal 
          alumni={alumni}
          followStatus={followStatus}
          onFollowClick={handleFollowStatusChange}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default AlumniCard;