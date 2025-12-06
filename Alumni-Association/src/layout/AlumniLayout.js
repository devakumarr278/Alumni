import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import AlumniSidebar from '../components/alumni/AlumniSidebar';
import PeopleRequestsDropdown from '../components/alumni/PeopleRequestsDropdown';

const AlumniLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  console.log('Rendering AlumniLayout with user:', user);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };



  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ 
        backgroundImage: "url('https://img.freepik.com/premium-vector/abstract-tech-background-futuristic-technology-interface-with-arrows-lines-waves-speed-lights-motion-data-concept-science-element-cyberspace-shapes-connection-lines_249611-17961.jpg')",
      }}
    >
      {/* Alumni Header */}
      <header className="bg-white/90 backdrop-blur-lg shadow-lg relative z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg w-10 h-10 flex items-center justify-center text-white font-bold shadow-md">
                AU
              </div>
              <span className="ml-3 text-xl font-bold text-gray-800">Alumni Portal</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* People Requests Dropdown */}
              <PeopleRequestsDropdown user={user} />
              
              <span className="text-sm font-medium text-gray-700">
                Welcome, {user?.name || user?.firstName || 'Alumni'}
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl p-4 h-full border border-white/50">
              <AlumniSidebar />
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Button variant="primary" className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                  <i className="fas fa-question-circle mr-2"></i>Help & Support
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Outlet />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Alumni Footer */}
      <footer className="bg-white/90 backdrop-blur-lg border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-700">
            <p>© {new Date().getFullYear()} Alumni Association Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AlumniLayout;