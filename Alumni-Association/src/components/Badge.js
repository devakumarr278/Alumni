import React, { useState } from 'react';
import { Award } from 'lucide-react';

// Simple Badge Component (used in ProfileBadge.js as well)
const SimpleBadgeComponent = ({ name, points, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const pointColors = {
    10: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    20: 'bg-blue-100 text-blue-800 border-blue-300',
    50: 'bg-purple-100 text-purple-800 border-purple-300',
    100: 'bg-green-100 text-green-800 border-green-300'
  };

  const getColorClass = (points) => {
    if (points >= 100) return pointColors[100];
    if (points >= 50) return pointColors[50];
    if (points >= 20) return pointColors[20];
    return pointColors[10];
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${sizeClasses[size]} ${getColorClass(points)}`}>
      <Award size={size === 'sm' ? 12 : size === 'lg' ? 20 : 16} />
      {name}
      {points > 0 && (
        <span className="ml-1 bg-white bg-opacity-50 rounded-full px-1.5 py-0.5">
          {points}
        </span>
      )}
    </span>
  );
};

export default SimpleBadgeComponent;

// Badge types configuration with tiers
export const BADGE_TYPES = {
  'profile-complete': {
    name: 'Profile Complete',
    description: 'Complete your profile with all details',
    icon: '📋',
    tier: 'bronze',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-300',
    glowColor: 'shadow-blue-300'
  },
  'first-connection': {
    name: 'First Connection',
    description: 'Connect with your first alumni',
    icon: '🤝',
    tier: 'bronze',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-300',
    glowColor: 'shadow-green-300'
  },
  'event-explorer': {
    name: 'Event Explorer',
    description: 'Register for 3 events',
    icon: '📅',
    tier: 'bronze',
    color: 'purple',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-300',
    glowColor: 'shadow-purple-300'
  },
  'mentor-ready': {
    name: 'Mentor Ready',
    description: 'Complete 3 mentorship sessions',
    icon: '🌟',
    tier: 'silver',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-300',
    glowColor: 'shadow-yellow-300'
  },
  'verified-alumni': {
    name: 'Verified Alumni',
    description: 'Verified as official alumnus/alumna',
    icon: '🎓',
    tier: 'gold',
    color: 'indigo',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-800',
    borderColor: 'border-indigo-300',
    glowColor: 'shadow-indigo-300'
  },
  'skill-expert': {
    name: 'Skill Expert',
    description: 'Recognized expert in specific skills',
    icon: '💡',
    tier: 'gold',
    color: 'pink',
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-800',
    borderColor: 'border-pink-300',
    glowColor: 'shadow-pink-300'
  },
  'event-champion': {
    name: 'Event Champion',
    description: 'Active event organizer and community builder',
    icon: '🏆',
    tier: 'gold',
    color: 'orange',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    borderColor: 'border-orange-300',
    glowColor: 'shadow-orange-300'
  },
  // Fallback badge types for the student context
  'profile': {
    name: 'Profile Badge',
    description: 'Profile related achievement',
    icon: '📋',
    tier: 'bronze',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-300',
    glowColor: 'shadow-blue-300'
  },
  'connection': {
    name: 'Connection Badge',
    description: 'Connection related achievement',
    icon: '🤝',
    tier: 'bronze',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-300',
    glowColor: 'shadow-green-300'
  },
  'event': {
    name: 'Event Badge',
    description: 'Event related achievement',
    icon: '📅',
    tier: 'bronze',
    color: 'purple',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-300',
    glowColor: 'shadow-purple-300'
  },
  'mentorship': {
    name: 'Mentorship Badge',
    description: 'Mentorship related achievement',
    icon: '🌟',
    tier: 'silver',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-300',
    glowColor: 'shadow-yellow-300'
  }
};

// Tier configurations
const TIER_CONFIG = {
  bronze: {
    name: 'Bronze',
    color: 'from-amber-700 to-amber-900',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-800',
    borderColor: 'border-amber-300',
    glowColor: 'shadow-amber-300'
  },
  silver: {
    name: 'Silver',
    color: 'from-gray-300 to-gray-500',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-300',
    glowColor: 'shadow-gray-300'
  },
  gold: {
    name: 'Gold',
    color: 'from-yellow-300 to-yellow-500',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-300',
    glowColor: 'shadow-yellow-300'
  }
};

// Default fallback configuration
const DEFAULT_BADGE_CONFIG = {
  name: 'Badge',
  description: 'Achievement badge',
  icon: '🏅',
  tier: 'bronze',
  bgColor: 'bg-gray-100',
  textColor: 'text-gray-800',
  borderColor: 'border-gray-300',
  glowColor: 'shadow-gray-300'
};

// Enhanced Badge Component with animations and tier styling
const EnhancedBadgeComponent = ({ 
  badge, 
  name, 
  description, 
  icon, 
  type, 
  earnedDate, 
  size = 'md',
  interactive = false,
  className = '',
  isLocked = false,
  progress = 0,
  onClick = null
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get badge configuration with multiple fallbacks
  let badgeConfig = DEFAULT_BADGE_CONFIG;
  
  if (badge && badge.type && BADGE_TYPES[badge.type]) {
    badgeConfig = BADGE_TYPES[badge.type];
  } else if (type && BADGE_TYPES[type]) {
    badgeConfig = BADGE_TYPES[type];
  } else if (name || description || icon) {
    // Use provided props directly if no matching type
    badgeConfig = {
      name: name || badgeConfig.name,
      description: description || badgeConfig.description,
      icon: icon || badgeConfig.icon,
      tier: badgeConfig.tier,
      bgColor: badgeConfig.bgColor,
      textColor: badgeConfig.textColor,
      borderColor: badgeConfig.borderColor,
      glowColor: badgeConfig.glowColor
    };
  }
  
  // Get tier configuration
  const tierConfig = TIER_CONFIG[badgeConfig.tier] || TIER_CONFIG.bronze;
  
  // Size classes
  const sizeClasses = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-16 h-16 text-base',
    lg: 'w-20 h-20 text-lg'
  };
  
  // Get size classes
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  
  // Handle click
  const handleClick = () => {
    if (onClick) {
      onClick(badge || { name, description, icon, type, earnedDate });
    }
  };
  
  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Badge Container */}
      <div 
        className={`
          ${sizeClass} rounded-full flex flex-col items-center justify-center
          ${isLocked ? 'bg-gray-200 border-2 border-dashed border-gray-400' : badgeConfig.bgColor}
          ${isLocked ? 'text-gray-500' : badgeConfig.textColor}
          border-2 ${isLocked ? 'border-gray-400' : badgeConfig.borderColor}
          shadow-md transition-all duration-300
          ${!isLocked && !interactive ? tierConfig.glowColor : ''}
          ${interactive || onClick ? 'cursor-pointer hover:scale-105 hover:shadow-lg' : ''}
          ${isHovered && !isLocked ? 'animate-pulse' : ''}
          relative overflow-hidden
        `}
      >
        {/* Glossy effect */}
        {!isLocked && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full"></div>
        )}
        
        {/* Badge Icon */}
        <div className={`text-2xl ${size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-xl' : ''}`}>
          {isLocked ? '🔒' : (badgeConfig.icon || icon || DEFAULT_BADGE_CONFIG.icon)}
        </div>
        
        {/* Tier indicator */}
        {!isLocked && (
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r ${tierConfig.color} flex items-center justify-center`}>
            <span className="text-xs text-white font-bold">
              {badgeConfig.tier === 'gold' ? '🥇' : badgeConfig.tier === 'silver' ? '🥈' : '🥉'}
            </span>
          </div>
        )}
      </div>
      
      {/* Badge Name */}
      <div className="mt-2 text-center">
        <p className={`text-xs font-medium ${isLocked ? 'text-gray-500' : 'text-gray-700'}`}>
          {badgeConfig.name || name || DEFAULT_BADGE_CONFIG.name}
        </p>
      </div>
      
      {/* Progress bar for pending badges */}
      {progress > 0 && progress < 100 && (
        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-blue-400 to-purple-500 h-1.5 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      
      {/* Earned date */}
      {(badge?.earnedDate || earnedDate) && (
        <div className="mt-1 text-center">
          <p className="text-xs text-gray-500">
            {new Date(badge?.earnedDate || earnedDate).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};

// Badge List Component
export const BadgeList = ({ badges, size = 'md', interactive = false, onClick = null }) => {
  if (!badges || badges.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No badges earned yet
      </div>
    );
  }
  
  return (
    <div className="flex flex-wrap gap-4">
      {badges.map((badge, index) => (
        <EnhancedBadgeComponent 
          key={`${badge.id || badge.type || index}`} 
          badge={badge} 
          size={size}
          interactive={interactive}
          onClick={onClick}
        />
      ))}
    </div>
  );
};

// Pending Badge Component
export const PendingBadge = ({ 
  badge, 
  name, 
  description, 
  icon, 
  type, 
  progress = 0,
  motivation = '',
  size = 'md',
  onClick = null
}) => {
  // Get badge configuration
  let badgeConfig = DEFAULT_BADGE_CONFIG;
  
  if (badge && badge.type && BADGE_TYPES[badge.type]) {
    badgeConfig = BADGE_TYPES[badge.type];
  } else if (type && BADGE_TYPES[type]) {
    badgeConfig = BADGE_TYPES[type];
  } else if (name || description || icon) {
    badgeConfig = {
      name: name || badgeConfig.name,
      description: description || badgeConfig.description,
      icon: icon || badgeConfig.icon,
      tier: badgeConfig.tier,
      bgColor: badgeConfig.bgColor,
      textColor: badgeConfig.textColor,
      borderColor: badgeConfig.borderColor,
      glowColor: badgeConfig.glowColor
    };
  }
  
  return (
    <div 
      className="relative bg-white rounded-xl shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
      onClick={() => onClick && onClick(badge || { name, description, icon, type })}
    >
      <div className="flex items-center">
        <EnhancedBadgeComponent 
          badge={badge}
          name={name}
          description={description}
          icon={icon}
          type={type}
          size={size}
          isLocked={true}
          progress={progress}
        />
        
        <div className="ml-4 flex-grow">
          <h3 className="font-semibold text-gray-800">{badgeConfig.name || name}</h3>
          <p className="text-sm text-gray-600 mt-1">{badgeConfig.description || description}</p>
          
          {progress > 0 && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {motivation && (
            <div className="mt-2 text-xs text-purple-600 font-medium">
              {motivation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Export the enhanced badge as the main Badge component
export { EnhancedBadgeComponent as Badge };