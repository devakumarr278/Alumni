import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const PendingApproval = () => {
  const { pendingRegistration, user, logout } = useAuth();
  
  // Use either pending registration data or current user data
  const userData = pendingRegistration || user;
  const isLoggedInPending = user && user.status === 'pending';
  
  const handleLogout = () => {
    logout();
    // No navigation needed as logout will trigger redirect
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full space-y-8"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-6xl mb-4"
          >
            ⏳
          </motion.div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Alumni Registration Under Review
          </h2>
          
          {userData && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Registration Details</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Name:</strong> {userData.firstName} {userData.lastName}</p>
                <p><strong>Email:</strong> {userData.email || userData.personalEmail}</p>
                <p><strong>Institution:</strong> {userData.institutionName}</p>
                <p><strong>Department:</strong> {userData.department}</p>
                <p><strong>Graduation Year:</strong> {userData.graduationYear}</p>
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
            <div className="text-left space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">Approval Process Status</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-green-500 font-bold text-xl">✓</span>
                  <div>
                    <p className="font-medium text-green-800">Email Verified</p>
                    <p className="text-sm text-green-600">Your email has been successfully verified</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <span className="text-yellow-500 font-bold text-xl">📤</span>
                  <div>
                    <p className="font-medium text-yellow-800">Sent to Institution</p>
                    <p className="text-sm text-yellow-600">Your application has been forwarded to your institution for verification</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-500 font-bold text-xl">⏳</span>
                  <div>
                    <p className="font-medium text-blue-800">Institution Review</p>
                    <p className="text-sm text-blue-600">Your institution admin is reviewing your alumni status and documents</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-400 font-bold text-xl">📧</span>
                  <div>
                    <p className="font-medium text-gray-600">Approval Notification</p>
                    <p className="text-sm text-gray-500">You'll receive an email once approved</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-800 mb-2">Expected Timeline:</h4>
              <p className="text-sm text-gray-600">
                Approval typically takes 1-3 business days. Our team will verify your credentials and approve your account.
              </p>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-800 mb-2">Need Help?</h4>
              <p className="text-sm text-gray-600">
                If you have questions or need assistance, please contact our support team.
              </p>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            {isLoggedInPending ? (
              <>
                <button 
                  onClick={handleLogout}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Logout
                </button>
                <Link 
                  to="/contact" 
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Contact Support
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/" 
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Return to Home
                </Link>
                <Link 
                  to="/contact" 
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Contact Support
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PendingApproval;