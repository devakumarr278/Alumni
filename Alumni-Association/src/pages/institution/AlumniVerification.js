import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MockAlumniVerification = () => {
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [pendingAlumni, setPendingAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  // Mock confidence distribution data
  const confidenceData = [
    { name: 'High (90-100%)', value: 185, color: '#10B981' },
    { name: 'Medium (70-89%)', value: 42, color: '#F59E0B' },
    { name: 'Low (50-69%)', value: 18, color: '#F97316' },
    { name: 'Very Low (<50%)', value: 3, color: '#EF4444' }
  ];

  // Mock verification statistics - Updated to remove auto-approved
  const statsData = [
    { title: 'Verified', value: '247', change: '+12%', icon: '✅', color: 'bg-green-100 text-green-800' },
    { title: 'Pending Review', value: '32', change: '+3', icon: '⚠️', color: 'bg-yellow-100 text-yellow-800' },
    { title: 'Rejected', value: '18', change: '-2', icon: '❌', color: 'bg-red-100 text-red-800' }
  ];

  // Fetch pending alumni on component mount
  useEffect(() => {
    fetchPendingAlumni();
    fetchNotifications();
  }, []);

  const fetchPendingAlumni = async () => {
    try {
      setLoading(true);
      // Using our mock API instead of the real one
      const response = await fetch('http://localhost:3001/api/institution/pending');
      const data = await response.json();
      setPendingAlumni(data.data);
    } catch (error) {
      console.error('Error fetching pending alumni:', error);
      // Fallback to mock data if API is not available
      setPendingAlumni([
        {
          _id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          collegeName: 'Test University',
          rollNumber: 'CS12345',
          department: 'Computer Science',
          graduationYear: 2020,
          status: 'pending',
          userType: 'alumni',
          aiScore: 92,
          createdAt: new Date('2025-10-01')
        },
        {
          _id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          collegeName: 'Test University',
          rollNumber: 'EE98765',
          department: 'Electrical Engineering',
          graduationYear: 2019,
          status: 'pending',
          userType: 'alumni',
          aiScore: 78,
          createdAt: new Date('2025-10-05')
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/institution/notifications');
      const data = await response.json();
      setNotifications(data.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to mock notifications
      setNotifications([
        {
          id: 1,
          message: 'You have 2 alumni awaiting verification.',
          type: 'pending_approval',
          timestamp: new Date()
        }
      ]);
    }
  };

  const handleAlumniClick = (alumni) => {
    setSelectedAlumni(alumni);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedAlumni(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (score) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleVerifyAlumni = async (alumniId, decision) => {
    try {
      const response = await fetch(`http://localhost:3001/api/institution/verify/${alumniId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          decision // Only decision, no method
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh the list
        fetchPendingAlumni();
        
        // Close the drawer
        closeDrawer();
        
        // Show success message
        alert(`Alumni ${decision === 'approve' ? 'approved' : 'rejected'} successfully!`);
      } else {
        alert('Error verifying alumni. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying alumni:', error);
      alert('Error verifying alumni. Please try again.');
    }
  };

  const filteredAlumni = pendingAlumni.filter(alumni => {
    const matchesSearch = alumni.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          alumni.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          alumni.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alumni.graduationYear.toString().includes(searchTerm);
    const matchesFilter = filter === 'all' || alumni.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Function to simulate a new alumni registration
  const simulateNewRegistration = async () => {
    try {
      const newAlumniData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test.user@example.com',
        collegeName: 'Test University',
        rollNumber: 'TEST001',
        department: 'Testing',
        graduationYear: 2025
      };
      
      const response = await fetch('http://localhost:3001/api/mock/new-alumni', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAlumniData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh the list
        fetchPendingAlumni();
        fetchNotifications();
        alert('New alumni registration simulated successfully!');
      } else {
        alert('Error simulating new registration.');
      }
    } catch (error) {
      console.error('Error simulating new registration:', error);
      alert('Error simulating new registration.');
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`bg-gradient-to-r from-indigo-50 to-purple-50 backdrop-blur-lg rounded-2xl shadow-md p-6 border border-indigo-100 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Mock Alumni Verification
              </h1>
              <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Testing alumni verification workflow with mock data
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button 
                onClick={simulateNewRegistration}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:opacity-90 transition-all text-sm font-medium shadow-md"
              >
                Simulate New Registration
              </button>
              <button 
                onClick={fetchPendingAlumni}
                className={`px-4 py-2 rounded-lg transition-all text-sm font-medium border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
              >
                Refresh
              </button>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <div className={`bg-white rounded-2xl shadow-md p-4 ${darkMode ? 'bg-gray-800' : ''}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search alumni by name, department, or graduation year..."
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${filter === 'all' ? (darkMode ? 'bg-indigo-700 text-white' : 'bg-indigo-100 text-indigo-800') : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700')}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('pending')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${filter === 'pending' ? (darkMode ? 'bg-yellow-700 text-white' : 'bg-yellow-100 text-yellow-800') : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700')}`}
              >
                Pending
              </button>
            </div>
          </div>
        </div>

        {/* Verification Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:scale-[1.01] border border-indigo-100 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}
            >
              <div className="flex items-center">
                <div className="text-2xl">{stat.icon}</div>
                <div className="ml-4">
                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{stat.title}</div>
                  <div className="text-2xl font-bold mt-1">{stat.value}</div>
                </div>
              </div>
              <div className="mt-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.color}`}>
                  {stat.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Verification Queue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`bg-white rounded-2xl shadow-md ${darkMode ? 'bg-gray-800' : ''}`}
        >
          <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className="text-lg font-semibold">Alumni Verification Queue</h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Pending alumni awaiting manual verification
            </p>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAlumni.map((alumni, index) => (
                  <motion.div
                    key={alumni._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`rounded-2xl border p-5 transition-all hover:shadow-lg ${darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {alumni.firstName.charAt(0)}{alumni.lastName.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <div className="font-medium">{alumni.firstName} {alumni.lastName}</div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {alumni.graduationYear} · {alumni.department}
                          </div>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alumni.status)}`}>
                        {alumni.status === 'approved' ? '✅' : 
                         alumni.status === 'rejected' ? '❌' : '⏳'}
                      </span>
                    </div>
                    
                    {alumni.aiScore && (
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Verification Score</span>
                          <span className="font-medium">{alumni.aiScore}%</span>
                        </div>
                        <div className={`w-full bg-gray-200 rounded-full h-2 ${darkMode ? 'bg-gray-600' : ''}`}>
                          <div 
                            className={`h-2 rounded-full ${getConfidenceColor(alumni.aiScore)}`} 
                            style={{ width: `${alumni.aiScore}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => handleAlumniClick(alumni)}
                        className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors ${
                          darkMode 
                            ? 'bg-indigo-700 text-white hover:bg-indigo-600' 
                            : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                        }`}
                      >
                        View Details
                      </button>
                      <button
                        className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors ${
                          alumni.status === 'approved'
                            ? (darkMode ? 'bg-green-700 text-white hover:bg-green-600' : 'bg-green-100 text-green-800 hover:bg-green-200')
                            : alumni.status === 'rejected' 
                              ? (darkMode ? 'bg-red-700 text-white hover:bg-red-600' : 'bg-red-100 text-red-800 hover:bg-red-200')
                              : (darkMode ? 'bg-yellow-700 text-white hover:bg-yellow-600' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200')
                        }`}
                      >
                        {alumni.status === 'approved' ? 'Approved' : 
                         alumni.status === 'rejected' ? 'Rejected' : 'Review'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {!loading && filteredAlumni.length === 0 && (
              <div className={`text-center py-12 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className={`mt-2 text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>No alumni found</h3>
                <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Confidence Distribution Below Queue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className={`bg-white rounded-2xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : ''}`}
        >
          <h2 className="text-lg font-semibold mb-4">Verification Score Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="ml-2 font-medium">Medium (70-89%)</span>
                </div>
                <span className="text-lg font-bold">17%</span>
              </div>
              <div className={`mt-2 w-full bg-gray-200 rounded-full h-2 ${darkMode ? 'bg-gray-600' : ''}`}>
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '17%' }}></div>
              </div>
            </div>
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="ml-2 font-medium">Very Low (&lt;50%)</span>
                </div>
                <span className="text-lg font-bold">1%</span>
              </div>
              <div className={`mt-2 w-full bg-gray-200 rounded-full h-2 ${darkMode ? 'bg-gray-600' : ''}`}>
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '1%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Verification Detail Drawer */}
        {isDrawerOpen && selectedAlumni && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeDrawer}></div>
            <div className="absolute inset-y-0 right-0 max-w-full flex">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.3 }}
                className="relative w-screen max-w-md"
              >
                <div className={`h-full flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
                  <div className="flex-1 overflow-y-auto">
                    <div className="px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Verification Details</h2>
                        <button
                          onClick={closeDrawer}
                          className={`ml-3 h-7 flex items-center justify-center rounded-full focus:outline-none ${
                            darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} px-4 sm:px-6`}>
                      <div className="mt-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            {selectedAlumni.firstName.charAt(0)}{selectedAlumni.lastName.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {selectedAlumni.firstName} {selectedAlumni.lastName}
                            </h3>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {selectedAlumni.graduationYear} • {selectedAlumni.department}
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {selectedAlumni.email}
                            </p>
                          </div>
                        </div>
                        
                        {/* Verification Score */}
                        {selectedAlumni.aiScore && (
                          <div className="mt-6">
                            <div className="flex justify-between items-center">
                              <h4 className={`text-md font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Verification Score</h4>
                              <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedAlumni.aiScore}%</span>
                            </div>
                            <div className={`mt-2 w-full bg-gray-200 rounded-full h-4 ${darkMode ? 'bg-gray-600' : ''}`}>
                              <div 
                                className={`h-4 rounded-full ${
                                  selectedAlumni.aiScore >= 90 ? 'bg-green-500' :
                                  selectedAlumni.aiScore >= 70 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`} 
                                style={{ width: `${selectedAlumni.aiScore}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>0%</span>
                              <span>50%</span>
                              <span>100%</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Verification Breakdown */}
                        <div className="mt-6">
                          <h4 className={`text-md font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Verification Breakdown</h4>
                          <div className="mt-3 space-y-3">
                            <div>
                              <div className="flex justify-between text-sm">
                                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Data Match</span>
                                <span className="font-medium">94%</span>
                              </div>
                              <div className={`mt-1 w-full bg-gray-200 rounded-full h-2 ${darkMode ? 'bg-gray-600' : ''}`}>
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm">
                                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Document Match</span>
                                <span className="font-medium">90%</span>
                              </div>
                              <div className={`mt-1 w-full bg-gray-200 rounded-full h-2 ${darkMode ? 'bg-gray-600' : ''}`}>
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm">
                                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Email Pattern</span>
                                <span className="font-medium">100%</span>
                              </div>
                              <div className={`mt-1 w-full bg-gray-200 rounded-full h-2 ${darkMode ? 'bg-gray-600' : ''}`}>
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm">
                                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Network Confirmation</span>
                                <span className="font-medium">80%</span>
                              </div>
                              <div className={`mt-1 w-full bg-gray-200 rounded-full h-2 ${darkMode ? 'bg-gray-600' : ''}`}>
                                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Summary */}
                          <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-indigo-900' : 'bg-indigo-50'}`}>
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <svg className={`h-5 w-5 ${darkMode ? 'text-indigo-300' : 'text-indigo-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <h3 className={`text-sm font-medium ${darkMode ? 'text-indigo-200' : 'text-indigo-800'}`}>Verification Summary</h3>
                                <div className={`mt-2 text-sm ${darkMode ? 'text-indigo-100' : 'text-indigo-700'}`}>
                                  <p>High confidence match – name and graduation year verified.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} px-4 py-4 sm:px-6`}>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleVerifyAlumni(selectedAlumni._id, 'approve')}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm ${
                          darkMode ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerifyAlumni(selectedAlumni._id, 'reject')}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm ${
                          darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockAlumniVerification;