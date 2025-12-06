import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import api from '../../utils/api';

const AlumniManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('pending');
  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch alumni data on component mount
  useEffect(() => {
    fetchAlumniData();
    
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchAlumniData();
    }, 5000); // Poll every 5 seconds
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [filter]);

  const fetchAlumniData = async () => {
    try {
      setLoading(true);
      const response = await api.getPendingAlumni();
      setAlumniData(response.data || []);
    } catch (error) {
      console.error('Error fetching alumni data:', error);
      // Fallback to mock data if API fails
      setAlumniData([
        { 
          _id: 1, 
          firstName: 'John', 
          lastName: 'Smith', 
          email: 'john@example.com', 
          graduationYear: 2020, 
          department: 'Computer Science', 
          status: 'pending',
          aiScore: 92
        },
        { 
          _id: 2, 
          firstName: 'Sarah', 
          lastName: 'Johnson', 
          email: 'sarah@example.com', 
          graduationYear: 2019, 
          department: 'Business', 
          status: 'pending',
          aiScore: 78
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (filterValue) => {
    setFilter(filterValue);
  };

  const handleVerifyAlumni = async (alumniId, decision) => {
    try {
      const response = await api.verifyAlumni(alumniId, { decision });
      if (response.success) {
        // Refresh the list
        fetchAlumniData();
        alert(`Alumni ${decision === 'approve' ? 'approved' : 'rejected'} successfully!`);
      } else {
        alert('Error verifying alumni. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying alumni:', error);
      alert('Error verifying alumni. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getConfidenceColor = (score) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredAlumni = alumniData.filter(alumni => {
    const matchesSearch = 
      (alumni.firstName && alumni.firstName.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (alumni.lastName && alumni.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (alumni.email && alumni.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (alumni.department && alumni.department.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === 'all' || alumni.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
      >
        <h1 className="text-2xl font-bold text-gray-800">Alumni Verification</h1>
        <p className="text-gray-600 mt-1">Manually verify new alumni registrations</p>
      </motion.div>

      {/* Search and Filters */}
      <Card className="bg-white/90 backdrop-blur-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search alumni by name, email, or department..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={handleSearch}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant={filter === 'all' ? 'primary' : 'outline'} 
              onClick={() => handleFilter('all')}
              className={filter === 'all' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : ''}
            >
              All
            </Button>
            <Button 
              variant={filter === 'pending' ? 'primary' : 'outline'} 
              onClick={() => handleFilter('pending')}
              className={filter === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : ''}
            >
              Pending
            </Button>
            <Button 
              variant={filter === 'approved' ? 'primary' : 'outline'} 
              onClick={() => handleFilter('approved')}
              className={filter === 'approved' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
            >
              Approved
            </Button>
            <Button 
              variant={filter === 'rejected' ? 'primary' : 'outline'} 
              onClick={() => handleFilter('rejected')}
              className={filter === 'rejected' ? 'bg-red-100 text-red-800 hover:bg-red-200' : ''}
            >
              Rejected
            </Button>
          </div>
        </div>
      </Card>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Alumni List */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((alumni, index) => (
            <motion.div
              key={alumni._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold">
                    {alumni.firstName?.charAt(0)}{alumni.lastName?.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {alumni.firstName} {alumni.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{alumni.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(alumni.status)}`}>
                  {alumni.status}
                </span>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Graduation Year:</span>
                  <span className="font-medium text-gray-800">{alumni.graduationYear}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Department:</span>
                  <span className="font-medium text-gray-800">{alumni.department}</span>
                </div>
                {alumni.aiScore && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Verification Score:</span>
                      <span className="font-medium text-gray-800">{alumni.aiScore}%</span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getConfidenceColor(alumni.aiScore)}`} 
                        style={{ width: `${alumni.aiScore}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              {alumni.status === 'pending' && (
                <div className="mt-6 flex space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
                    onClick={() => handleVerifyAlumni(alumni._id, 'approve')}
                  >
                    Approve
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                    onClick={() => handleVerifyAlumni(alumni._id, 'reject')}
                  >
                    Reject
                  </Button>
                </div>
              )}
              
              {alumni.status === 'approved' && (
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    View Profile
                  </Button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredAlumni.length === 0 && (
        <Card className="text-center py-12 bg-white/90 backdrop-blur-lg">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">No alumni found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </Card>
      )}
    </div>
  );
};

export default AlumniManagement;