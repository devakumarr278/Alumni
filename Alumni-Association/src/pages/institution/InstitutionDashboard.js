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
  const [totalAlumni, setTotalAlumni] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);

  // Debug: Log user data to see what's being received
  useEffect(() => {
    console.log('InstitutionDashboard - User data:', user);
  }, [user]);

  // Fetch pending alumni count and institution data on component mount
  useEffect(() => {
    fetchPendingCount();
    fetchInstitutionData();
    fetchAnalyticsData();
    
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchPendingCount();
      fetchAnalyticsData();
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

  const fetchAnalyticsData = async () => {
    try {
      // Fetch real analytics data
      const response = await api.get('/institution/analytics/overall');
      if (response.data.success) {
        setTotalAlumni(response.data.data.totalAlumni || 0);
        setActiveUsers(response.data.data.activeUsers || 0);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      // Fallback to mock data
      setTotalAlumni(1285);
      setActiveUsers(420);
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
          onClick={() => navigate('/institution/location-heatmap')}
        >
          <div className="flex items-center">
            <div className="p-3 bg-teal-100 rounded-lg">
              <span className="text-teal-600 text-xl">🗺️</span>
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Location Map</h3>
              <p className="text-sm text-gray-600 mt-1">Alumni locations</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-teal-600 font-medium">
            <span>View heatmap</span>
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
          onClick={() => navigate('/institution/alumni-spotlight')}
        >
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600 text-xl">🌟</span>
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Alumni Spotlight</h3>
              <p className="text-sm text-gray-600 mt-1">Featured alumni</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-yellow-600 font-medium">
            <span>View spotlight</span>
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
          <motion.div
            key="verified"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center">
              <span className="text-2xl">🎓</span>
              <div className="ml-3">
                <div className="text-sm text-gray-600">Alumni Verified This Month</div>
                <div className="text-xl font-bold text-gray-800 mt-1">124</div>
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                +12%
              </span>
              <button className="ml-auto text-gray-400 hover:text-violet-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
          
          <motion.div
            key="accuracy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center">
              <span className="text-2xl">✅</span>
              <div className="ml-3">
                <div className="text-sm text-gray-600">Verification Accuracy</div>
                <div className="text-xl font-bold text-gray-800 mt-1">93%</div>
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                +3%
              </span>
              <button className="ml-auto text-gray-400 hover:text-violet-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
          
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center">
              <span className="text-2xl">⏳</span>
              <div className="ml-3">
                <div className="text-sm text-gray-600">Pending Reviews</div>
                <div className="text-xl font-bold text-gray-800 mt-1">{pendingCount}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                -2
              </span>
              <button className="ml-auto text-gray-400 hover:text-violet-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
          
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center">
              <span className="text-2xl">👥</span>
              <div className="ml-3">
                <div className="text-sm text-gray-600">Active Users</div>
                <div className="text-xl font-bold text-gray-800 mt-1">{activeUsers}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                +8%
              </span>
              <button className="ml-auto text-gray-400 hover:text-violet-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Analytics & Spotlight */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Quick Access</h2>
        </div>
        <div className="p-6">
          <div className="mt-6 flex space-x-3">
            <button 
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium"
              onClick={() => navigate('/institution/analytics')}
            >
              View Analytics
            </button>
            <button 
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              onClick={() => navigate('/institution/alumni-spotlight')}
            >
              View Spotlight
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDashboard;