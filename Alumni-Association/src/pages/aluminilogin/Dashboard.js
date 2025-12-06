import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import AlumniNavigation from '../../components/alumni/AlumniNavigation';

const AlumniDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [stats, setStats] = useState({
    eventsAttended: 0,
    connections: 0,
    achievements: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  // Quick actions for alumni
  const quickActions = [
    { title: 'My Profile', description: 'Update your profile information', icon: '👤', path: '/alumni/profile', color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
    { title: 'Connections', description: 'Connect with fellow alumni', icon: '👥', path: '/alumni/connections', color: 'bg-gradient-to-br from-green-500 to-green-600' },
    { title: 'Follow Requests', description: 'Manage student requests', icon: '📩', path: '/alumni/follow-requests', color: 'bg-gradient-to-br from-purple-500 to-purple-600' },
    { title: 'Events', description: 'View and register for events', icon: '📅', path: '/alumni/events', color: 'bg-gradient-to-br from-purple-500 to-purple-600' },
    { title: 'Mentorship', description: 'Mentor or find a mentor', icon: '🎓', path: '/alumni/mentorship', color: 'bg-gradient-to-br from-orange-500 to-orange-600' },
  ];

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!profileData) return 0;
    
    let completedFields = 0;
    const totalFields = 7; // Adjust based on important profile fields
    
    if (profileData.firstName && profileData.lastName) completedFields++;
    if (profileData.bio) completedFields++;
    if (profileData.skills && profileData.skills.length > 0) completedFields++;
    if (profileData.experiences && profileData.experiences.length > 0) completedFields++;
    if (profileData.education && profileData.education.length > 0) completedFields++;
    if (profileData.currentPosition) completedFields++;
    if (profileData.company) completedFields++;
    
    return Math.round((completedFields / totalFields) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  // Load user data
  useEffect(() => {
    const loadData = async () => {
      try {
        // In a real app, you would fetch this data from your API
        // For now, we'll use mock data
        setStats({
          eventsAttended: 5,
          connections: 24,
          achievements: 3,
        });
        
        setProfileData({
          firstName: user?.firstName || 'John',
          lastName: user?.lastName || 'Doe',
          bio: 'Passionate alumni with experience in software development and team leadership.',
          skills: ['JavaScript', 'React', 'Node.js', 'Project Management'],
          experiences: [
            {
              role: 'Senior Software Engineer',
              company: 'Tech Corp',
              duration: '2020 - Present',
            },
            {
              role: 'Software Engineer',
              company: 'StartupXYZ',
              duration: '2018 - 2020',
            }
          ],
          currentPosition: 'Senior Software Engineer',
          company: 'Tech Corp',
        });
        
        setUpcomingEvents([
          {
            id: 1,
            title: 'Annual Alumni Meet',
            date: '2023-12-15',
            location: 'Main Campus',
            attendees: 120,
          },
          {
            id: 2,
            title: 'Career Workshop',
            date: '2023-12-20',
            location: 'Online',
            attendees: 85,
          }
        ]);
        
        setRecentActivity([
          {
            id: 1,
            type: 'connection',
            title: 'New Connection',
            description: 'Sarah Johnson accepted your connection request',
            time: '2 hours ago',
          },
          {
            id: 2,
            type: 'event',
            title: 'Event Registration',
            description: 'You registered for the Annual Alumni Meet',
            time: '1 day ago',
          }
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <AlumniNavigation user={user} />
        
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl shadow-xl p-6 mb-8 text-white"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.firstName || 'Alumni'}!
              </h1>
              <p className="text-purple-100 mb-4">
                Stay connected with your alma mater and fellow alumni
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-sm text-purple-100">Events Attended</div>
                  <div className="text-2xl font-bold">{stats.eventsAttended}</div>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-sm text-purple-100">Connections</div>
                  <div className="text-2xl font-bold">{stats.connections}</div>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-sm text-purple-100">Achievements</div>
                  <div className="text-2xl font-bold">{stats.achievements}</div>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="bg-white/10 rounded-full p-2 w-32 h-32 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎓</div>
                  <div className="text-sm font-semibold">Alumni</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile Completion */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Profile Completion</span>
              <span>{profileCompletion}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions and Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="cursor-pointer"
                    onClick={() => navigate(action.path)}
                  >
                    <div className={`${action.color} rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow`}>
                      <div className="text-3xl mb-3">{action.icon}</div>
                      <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
                      <p className="text-sm opacity-90">{action.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Upcoming Events */}
            <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Upcoming Events</h2>
                <button 
                  onClick={() => navigate('/alumni/events')}
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold">
                      {new Date(event.date).getDate()}
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3 className="font-medium text-gray-800">{event.title}</h3>
                      <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()} • {event.location}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {event.attendees} attending
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Recent Activity */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      {activity.type === 'connection' ? '👥' : '📅'}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-800 text-sm">{activity.title}</h3>
                      <p className="text-xs text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Achievements */}
            <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Achievements</h2>
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Mentor of the Month</h3>
                <p className="text-gray-600 text-sm">
                  Recognized for outstanding mentorship contributions
                </p>
                <button className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                  View All Badges
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard;