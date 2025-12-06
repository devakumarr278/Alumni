import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const InstitutionDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [institutionName, setInstitutionName] = useState('');

  // Debug: Log user data to see what's being received
  useEffect(() => {
    console.log('InstitutionDashboard - User data:', user);
  }, [user]);

  // Mock insight snapshot data
  const insightData = [
    {
      title: 'Alumni Verified This Month',
      value: '124',
      change: '+12%',
      icon: '🎓'
    },
    {
      title: 'Verification Accuracy',
      value: '93%',
      change: '+3%',
      icon: '✅'
    },
    {
      title: 'Pending Reviews',
      value: '8',
      change: '-2',
      icon: '⏳'
    },
    {
      title: 'Active Mentorships',
      value: '5',
      change: '+1',
      icon: '💼'
    }
  ];

  // Mock events data
  const eventsData = {
    nextEvent: 'Alumni Meet 2025',
    date: 'Oct 15',
    status: 'new'
  };

  // Fetch pending alumni count and institution data on component mount
  useEffect(() => {
    fetchPendingCount();
    fetchInstitutionData();
    
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchPendingCount();
    }, 5000); // Poll every 5 seconds
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const fetchPendingCount = async () => {
    try {
      setLoading(true);
      const response = await api.getPendingAlumni();
      setPendingCount(response.data?.length || 0);
    } catch (error) {
      console.error('Error fetching pending alumni count:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstitutionData = async () => {
    try {
      console.log('Fetching institution data, user:', user);
      // Use the collegeName from the user object directly
      if (user?.collegeName) {
        setInstitutionName(user.collegeName);
        console.log('Set institution name from collegeName:', user.collegeName);
      } else if (user?.firstName && user?.lastName) {
        setInstitutionName(`${user.firstName} ${user.lastName}`);
        console.log('Set institution name from firstName/lastName:', `${user.firstName} ${user.lastName}`);
      } else {
        setInstitutionName('Institution');
        console.log('Set default institution name');
      }
    } catch (error) {
      console.error('Error fetching institution data:', error);
      // Fallback to using data from the user object
      if (user?.collegeName) {
        setInstitutionName(user.collegeName);
      } else if (user?.firstName && user?.lastName) {
        setInstitutionName(`${user.firstName} ${user.lastName}`);
      } else {
        setInstitutionName('Institution');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Institution Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-violet-50 to-purple-50 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-violet-100"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Institution Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {institutionName}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Verified Institution
            </span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/70 rounded-xl p-4 border border-white/50">
            <div className="text-gray-600 text-sm">Alumni Verified</div>
            <div className="text-2xl font-bold text-gray-800 mt-1">1,285</div>
          </div>
          <div className="bg-white/70 rounded-xl p-4 border border-white/50">
            <div className="text-gray-600 text-sm">Pending Approvals</div>
            <div className="text-2xl font-bold text-gray-800 mt-1">
              {loading ? (
                <div className="animate-spin h-5 w-5 border-b-2 border-violet-600 rounded-full"></div>
              ) : (
                pendingCount
              )}
            </div>
          </div>
          <div className="bg-white/70 rounded-xl p-4 border border-white/50">
            <div className="text-gray-600 text-sm">Upcoming Events</div>
            <div className="text-2xl font-bold text-gray-800 mt-1">3</div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => navigate('/institution/alumni-verification')}
        >
          <div className="flex items-center">
            <div className="p-3 bg-violet-100 rounded-lg">
              <span className="text-violet-600 text-xl">👥</span>
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Alumni Verification</h3>
              <p className="text-sm text-gray-600 mt-1">Verify new alumni</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-violet-600 font-medium">
            <span>Manage pending ({pendingCount})</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => navigate('/institution/analytics')}
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">📊</span>
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-600 mt-1">View insights</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-blue-600 font-medium">
            <span>View reports</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => navigate('/institution/events')}
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-green-600 text-xl">📅</span>
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Events</h3>
              <p className="text-sm text-gray-600 mt-1">Manage events</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600 font-medium">
            <span>Create & manage</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => navigate('/institution/settings')}
        >
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600 text-xl">⚙️</span>
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Settings</h3>
              <p className="text-sm text-gray-600 mt-1">Configure system</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-yellow-600 font-medium">
            <span>System settings</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Insight Snapshot Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Insight Snapshot</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {insightData.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center">
                <span className="text-2xl">{insight.icon}</span>
                <div className="ml-3">
                  <div className="text-sm text-gray-600">{insight.title}</div>
                  <div className="text-xl font-bold text-gray-800 mt-1">{insight.value}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center">
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {insight.change}
                </span>
                <button className="ml-auto text-gray-400 hover:text-violet-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Events & Announcements */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Events & Announcements</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{eventsData.nextEvent}</h3>
              <p className="text-gray-600 mt-1">{eventsData.date}</p>
            </div>
            {eventsData.status === 'new' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 animate-pulse">
                🔥 New Event
              </span>
            )}
          </div>
          <div className="mt-6 flex space-x-3">
            <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium">
              Create Announcement
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
              View All Events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDashboard;