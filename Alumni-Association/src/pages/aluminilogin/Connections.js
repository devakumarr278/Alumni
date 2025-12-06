import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../../components/common/Card';

const Connections = () => {
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockConnections = [
      {
        id: 1,
        name: 'Sarah Johnson',
        position: 'Marketing Director at TechCorp',
        department: 'Business Administration',
        graduationYear: '2018',
        mutualConnections: 12,
        status: 'connected'
      },
      {
        id: 2,
        name: 'Michael Chen',
        position: 'Software Engineer at Google',
        department: 'Computer Science',
        graduationYear: '2020',
        mutualConnections: 5,
        status: 'pending'
      },
      {
        id: 3,
        name: 'Emma Wilson',
        position: 'Data Analyst at FinanceCo',
        department: 'Statistics',
        graduationYear: '2019',
        mutualConnections: 8,
        status: 'connected'
      },
      {
        id: 4,
        name: 'David Brown',
        position: 'Product Manager at StartupX',
        department: 'Business Administration',
        graduationYear: '2017',
        mutualConnections: 3,
        status: 'requested'
      }
    ];

    setTimeout(() => {
      setConnections(mockConnections);
      setLoading(false);
    }, 1000);
  }, []);

  const handleConnect = (id) => {
    setConnections(prev => 
      prev.map(conn => 
        conn.id === id 
          ? { ...conn, status: 'pending' } 
          : conn
      )
    );
  };

  const handleAccept = (id) => {
    setConnections(prev => 
      prev.map(conn => 
        conn.id === id 
          ? { ...conn, status: 'connected' } 
          : conn
      )
    );
  };

  const getStatusButton = (status, id) => {
    switch (status) {
      case 'connected':
        return (
          <button className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            Connected
          </button>
        );
      case 'pending':
        return (
          <button className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
            Pending
          </button>
        );
      case 'requested':
        return (
          <button 
            onClick={() => handleAccept(id)}
            className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600"
          >
            Accept
          </button>
        );
      default:
        return (
          <button 
            onClick={() => handleConnect(id)}
            className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm hover:bg-purple-600"
          >
            Connect
          </button>
        );
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-800">My Connections</h1>
        <p className="text-gray-700 mt-1">Connect with fellow alumni and expand your network</p>
        
        {/* Add button to navigate to follow requests */}
        <div className="mt-4 flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/alumni/follow-requests')}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-700 text-white rounded-xl hover:from-purple-700 hover:to-pink-800 transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            <span className="mr-2 text-xl">📩</span>
            Manage Follow Requests
            <span className="ml-2 bg-white/20 px-2 py-1 rounded-lg text-xs">Enhanced</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Connection Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-lg border border-blue-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <i className="fas fa-users text-xl"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">142</p>
              <p className="text-sm text-gray-600">Total Connections</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-teal-50 backdrop-blur-lg border border-green-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <i className="fas fa-user-plus text-xl"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">24</p>
              <p className="text-sm text-gray-600">New This Month</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 backdrop-blur-lg border border-purple-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <i className="fas fa-building text-xl"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">36</p>
              <p className="text-sm text-gray-600">Industries</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Connections List */}
      <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">My Network</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search connections..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {connections.map((connection) => (
            <motion.div
              key={connection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold">
                  {connection.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-800">{connection.name}</h3>
                  <p className="text-sm text-gray-600">{connection.position}</p>
                  <p className="text-xs text-gray-500">
                    {connection.department} • Class of {connection.graduationYear} • {connection.mutualConnections} mutual connections
                  </p>
                </div>
              </div>
              {getStatusButton(connection.status, connection.id)}
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Suggested Connections */}
      <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Suggested Connections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((id) => (
            <motion.div
              key={id}
              whileHover={{ y: -5 }}
              className="p-4 bg-white/50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                  U{id}
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-gray-800">User {id}</h3>
                  <p className="text-sm text-gray-600">Position at Company</p>
                </div>
              </div>
              <button className="mt-3 w-full px-3 py-1 bg-purple-500 text-white rounded-full text-sm hover:bg-purple-600">
                Connect
              </button>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Connections;