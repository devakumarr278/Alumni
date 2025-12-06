import React, { useState } from 'react';
import Badge, { PendingBadge } from '../../components/Badge';

const BadgesRecognition = () => {
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharedBadge, setSharedBadge] = useState(null);

  // Enhanced badges data with progress and motivation
  const badges = [
    { 
      id: 1, 
      name: 'Mentor', 
      icon: '🤝', 
      earned: true, 
      date: '2023-10-15', 
      description: 'Completed 10 hours of mentoring',
      tier: 'silver',
      xp: 150
    },
    { 
      id: 2, 
      name: 'Donor', 
      icon: '💰', 
      earned: true, 
      date: '2023-09-22', 
      description: 'Donated ₹10,000 to scholarship fund',
      tier: 'gold',
      xp: 200
    },
    { 
      id: 3, 
      name: 'Speaker', 
      icon: '🎤', 
      earned: false, 
      description: 'Speak at 2 career events',
      progress: 65,
      motivation: 'Just 1 more event to go!',
      xp: 75
    },
    { 
      id: 4, 
      name: 'Startup Founder', 
      icon: '🚀', 
      earned: true, 
      date: '2023-05-30', 
      description: 'Founded a company with 5+ employees',
      tier: 'gold',
      xp: 250
    },
    { 
      id: 5, 
      name: 'Event Host', 
      icon: '📅', 
      earned: false, 
      description: 'Host 3 networking events',
      progress: 33,
      motivation: 'Host 2 more events to unlock this badge!',
      xp: 100
    },
    { 
      id: 6, 
      name: 'Alumni Connector', 
      icon: '👥', 
      earned: true, 
      date: '2023-11-05', 
      description: 'Connected 15 alumni with students',
      tier: 'silver',
      xp: 120
    },
    { 
      id: 7, 
      name: 'Community Builder', 
      icon: '🏗️', 
      earned: false, 
      description: 'Participate in 5 community initiatives',
      progress: 80,
      motivation: 'Just 1 more initiative to unlock this badge!',
      xp: 90
    },
    { 
      id: 8, 
      name: 'Knowledge Sharer', 
      icon: '📚', 
      earned: true, 
      date: '2023-12-10', 
      description: 'Published 3 articles or resources',
      tier: 'bronze',
      xp: 80
    },
  ];

  // Leaderboard data
  const leaderboard = [
    { 
      rank: 1, 
      name: 'Robert Smith', 
      badges: 12, 
      points: 1250, 
      avatar: 'RS',
      isUser: false,
      progress: 100
    },
    { 
      rank: 2, 
      name: 'You', 
      badges: 8, 
      points: 980, 
      avatar: 'JA',
      isUser: true,
      progress: 78
    },
    { 
      rank: 3, 
      name: 'Emma Parker', 
      badges: 7, 
      points: 875, 
      avatar: 'EP',
      isUser: false,
      progress: 70
    },
    { 
      rank: 4, 
      name: 'Michael Chen', 
      badges: 6, 
      points: 720, 
      avatar: 'MC',
      isUser: false,
      progress: 58
    },
    { 
      rank: 5, 
      name: 'Sarah Johnson', 
      badges: 6, 
      points: 690, 
      avatar: 'SJ',
      isUser: false,
      progress: 55
    },
    { 
      rank: 15, 
      name: 'David Wilson', 
      badges: 4, 
      points: 420, 
      avatar: 'DW',
      isUser: false,
      progress: 34
    },
  ];

  const earnedBadges = badges.filter(badge => badge.earned);
  const pendingBadges = badges.filter(badge => !badge.earned);

  // User stats
  const totalBadges = badges.length;
  const earnedCount = earnedBadges.length;
  const pendingCount = pendingBadges.length;
  const userXP = earnedBadges.reduce((sum, badge) => sum + (badge.xp || 0), 0);
  const nextLevelXP = 1000;
  const xpProgress = Math.min((userXP / nextLevelXP) * 100, 100);

  // Handle badge click
  const handleBadgeClick = (badge) => {
    setSelectedBadge(badge);
  };

  // Handle share badge
  const handleShareBadge = (badge) => {
    setSharedBadge(badge);
    setShowShareModal(true);
  };

  // Close modals
  const closeModal = () => {
    setSelectedBadge(null);
    setShowShareModal(false);
  };

  // Share to LinkedIn
  const shareToLinkedIn = () => {
    const text = `I've earned the ${sharedBadge.name} badge on the Alumni Association platform! ${sharedBadge.description}`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setShowShareModal(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl shadow-xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">🎉 Badges & Recognition</h1>
              <p className="text-purple-100 mb-4">
                Celebrating your achievements and contributions to our alumni community
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-sm text-purple-100">Badges Earned</div>
                  <div className="text-2xl font-bold">{earnedCount}/{totalBadges}</div>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-sm text-purple-100">Total XP</div>
                  <div className="text-2xl font-bold">{userXP}</div>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-sm text-purple-100">Current Level</div>
                  <div className="text-2xl font-bold">Mentor Lv. 2</div>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="bg-white/10 rounded-full p-2 w-32 h-32 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🏆</div>
                  <div className="text-sm font-semibold">Level 2</div>
                  <div className="text-xs">Mentor</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* XP Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress to Level 3</span>
              <span>{Math.round(xpProgress)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${xpProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Streaks & Milestones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white">
                🔥
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-800">Current Streak</h3>
                <p className="text-2xl font-bold text-blue-600">12 days</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">You've been active for 12 consecutive days!</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white">
                🎯
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-800">Monthly Goal</h3>
                <p className="text-2xl font-bold text-green-600">4/5</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Complete 1 more activity to reach your goal</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg text-white">
                🌟
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-800">Recognition</h3>
                <p className="text-2xl font-bold text-purple-600">3 months</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">You've been recognized for 3 months in a row!</p>
          </div>
        </div>

        {/* Earned Badges Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">🏅 Earned Badges</h2>
            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
              Download Certificates
            </button>
          </div>
          
          {earnedBadges.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {earnedBadges.map(badge => (
                <div key={badge.id} className="flex flex-col items-center">
                  <Badge 
                    badge={badge}
                    size="lg"
                    interactive={true}
                    onClick={handleBadgeClick}
                  />
                  <button 
                    onClick={() => handleShareBadge(badge)}
                    className="mt-2 text-xs text-purple-600 hover:text-purple-800 flex items-center"
                  >
                    <span className="mr-1">↗</span> Share
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏅</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No badges earned yet</h3>
              <p className="text-gray-600">Complete activities to earn your first badge!</p>
            </div>
          )}
        </div>

        {/* Pending Badges Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">🔒 Pending Badges</h2>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
              {pendingCount} badges to unlock
            </span>
          </div>
          
          {pendingBadges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingBadges.map(badge => (
                <PendingBadge 
                  key={badge.id}
                  badge={badge}
                  progress={badge.progress}
                  motivation={badge.motivation}
                  onClick={handleBadgeClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">All badges unlocked!</h3>
              <p className="text-gray-600">You've earned all available badges. Check back later for new ones!</p>
            </div>
          )}
        </div>

        {/* Leaderboard Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">🏆 Community Leaderboard</h2>
            <span className="bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
              Your rank: #2
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Alumni</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Badges</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Points</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Progress</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user) => (
                  <tr 
                    key={user.rank} 
                    className={`
                      border-b border-gray-200 last:border-b-0
                      ${user.isUser ? 'bg-purple-50' : 'hover:bg-gray-50'}
                    `}
                  >
                    <td className="py-4 px-4">
                      {user.rank <= 3 ? (
                        <span className="text-2xl">
                          {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
                        </span>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                          user.isUser 
                            ? 'bg-purple-100 text-purple-800' 
                            : user.rank <= 5 
                              ? 'bg-gray-100 text-gray-800' 
                              : 'bg-gray-50 text-gray-600'
                        }`}>
                          {user.rank}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3
                          ${user.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                            user.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-600' : 
                            user.rank === 3 ? 'bg-gradient-to-r from-orange-400 to-orange-600' : 
                            'bg-gradient-to-r from-blue-400 to-blue-600'}
                        `}>
                          {user.avatar}
                        </div>
                        <span className={`font-medium ${user.isUser ? 'text-purple-700' : 'text-gray-800'}`}>
                          {user.name}
                          {user.isUser && <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">You</span>}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium">{user.badges}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium">{user.points}</span>
                    </td>
                    <td className="py-4 px-4 w-32">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            user.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                            user.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                            user.rank === 3 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                            'bg-gradient-to-r from-blue-400 to-blue-600'
                          }`}
                          style={{ width: `${user.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{user.progress}%</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 text-center">
            <button className="text-purple-600 hover:text-purple-800 font-medium">
              View Full Leaderboard →
            </button>
          </div>
        </div>
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-800">{selectedBadge.name}</h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex justify-center mb-4">
              <Badge 
                badge={selectedBadge}
                size="lg"
              />
            </div>
            
            <p className="text-gray-600 mb-4">{selectedBadge.description}</p>
            
            {selectedBadge.earned ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <div className="text-green-500 mr-2">✓</div>
                  <span className="text-green-800 font-medium">Badge Earned</span>
                </div>
                <div className="text-sm text-green-700 mt-1">
                  Earned on {new Date(selectedBadge.date).toLocaleDateString()}
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <div className="text-yellow-500 mr-2">🔒</div>
                  <span className="text-yellow-800 font-medium">Badge Not Yet Earned</span>
                </div>
                <div className="text-sm text-yellow-700 mt-1">
                  {selectedBadge.motivation || 'Complete the requirements to unlock this badge'}
                </div>
              </div>
            )}
            
            <div className="flex justify-between">
              <button 
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              {selectedBadge.earned && (
                <button 
                  onClick={() => {
                    handleShareBadge(selectedBadge);
                    closeModal();
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:opacity-90"
                >
                  Share Badge
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Share Your Achievement</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex justify-center mb-4">
              <Badge 
                badge={sharedBadge}
                size="lg"
              />
            </div>
            
            <p className="text-center text-gray-600 mb-6">
              Share your <span className="font-semibold">{sharedBadge.name}</span> badge achievement
            </p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={shareToLinkedIn}
                className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90"
              >
                <span className="mr-2">🔗</span> Share on LinkedIn
              </button>
              
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`I've earned the ${sharedBadge.name} badge! ${sharedBadge.description}`);
                  alert('Copied to clipboard!');
                  setShowShareModal(false);
                }}
                className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
              >
                <span className="mr-2">📋</span> Copy Text
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgesRecognition;