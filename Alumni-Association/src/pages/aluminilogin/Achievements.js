import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/common/Card';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockAchievements = [
      {
        id: 1,
        title: 'Top Contributor',
        description: 'Most active participant in alumni events this year',
        date: '2023-12-01',
        icon: 'fas fa-medal',
        color: 'bg-yellow-100 text-yellow-800'
      },
      {
        id: 2,
        title: 'Networking Champion',
        description: 'Connected with 50+ alumni in the past 6 months',
        date: '2023-11-15',
        icon: 'fas fa-network-wired',
        color: 'bg-blue-100 text-blue-800'
      },
      {
        id: 3,
        title: 'Mentorship Excellence',
        description: 'Provided mentorship to 10+ students this year',
        date: '2023-10-20',
        icon: 'fas fa-hands-helping',
        color: 'bg-green-100 text-green-800'
      },
      {
        id: 4,
        title: 'Event Organizer',
        description: 'Successfully organized 3 alumni events',
        date: '2023-09-05',
        icon: 'fas fa-calendar-check',
        color: 'bg-purple-100 text-purple-800'
      },
      {
        id: 5,
        title: 'Community Builder',
        description: 'Started a new alumni chapter in your city',
        date: '2023-08-12',
        icon: 'fas fa-city',
        color: 'bg-red-100 text-red-800'
      },
      {
        id: 6,
        title: 'Knowledge Sharer',
        description: 'Presented at 2 alumni workshops',
        date: '2023-07-18',
        icon: 'fas fa-chalkboard-teacher',
        color: 'bg-indigo-100 text-indigo-800'
      }
    ];

    setTimeout(() => {
      setAchievements(mockAchievements);
      setLoading(false);
    }, 1000);
  }, []);

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
        <h1 className="text-2xl font-bold text-gray-800">My Achievements</h1>
        <p className="text-gray-700 mt-1">Celebrate your contributions to the alumni community</p>
      </motion.div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 backdrop-blur-lg border border-yellow-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <i className="fas fa-trophy text-xl"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">12</p>
              <p className="text-sm text-gray-600">Total Badges</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-lg border border-blue-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <i className="fas fa-calendar-alt text-xl"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">8</p>
              <p className="text-sm text-gray-600">Events Attended</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-teal-50 backdrop-blur-lg border border-green-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <i className="fas fa-users text-xl"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">42</p>
              <p className="text-sm text-gray-600">Connections Made</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 backdrop-blur-lg border border-purple-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <i className="fas fa-hands-helping text-xl"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">5</p>
              <p className="text-sm text-gray-600">Mentees</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Achievements Grid */}
      <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Earned Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-6 bg-white/50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${achievement.color} mb-4`}>
                <i className={`${achievement.icon} text-lg`}></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{achievement.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{achievement.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{achievement.date}</span>
                <button className="text-xs text-purple-600 hover:text-purple-800 font-medium">
                  Share <i className="fas fa-share ml-1"></i>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Milestones */}
      <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Milestones</h2>
        <div className="space-y-4">
          {[
            { title: '100 Connections', progress: 42, target: 100, icon: 'fas fa-users' },
            { title: '10 Events Attended', progress: 8, target: 10, icon: 'fas fa-calendar-check' },
            { title: '50 Mentees', progress: 5, target: 50, icon: 'fas fa-chalkboard-teacher' },
            { title: '1 Year Active', progress: 9, target: 12, icon: 'fas fa-star' }
          ].map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 bg-white/50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <i className={`${milestone.icon} text-gray-600 mr-3`}></i>
                  <span className="font-medium text-gray-800">{milestone.title}</span>
                </div>
                <span className="text-sm text-gray-600">{milestone.progress}/{milestone.target}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
                  style={{ width: `${(milestone.progress / milestone.target) * 100}%` }}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Achievements;