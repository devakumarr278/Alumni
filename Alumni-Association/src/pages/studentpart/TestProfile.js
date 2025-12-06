import React from 'react';
import { useAuth } from '../../context/AuthContext';
import StudentProfile from './StudentProfile';

const TestProfile = () => {
  const { user } = useAuth();
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Profile Test</h1>
        <p className="text-gray-600">Testing the redesigned student profile page</p>
      </div>
      
      {/* Use the new StudentProfile component */}
      {user ? (
        <div>
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <p className="mb-4 text-gray-700">Current user: <span className="font-semibold">{user.firstName} {user.lastName}</span></p>
            <p className="text-gray-600">User ID: {user._id}</p>
            <p className="text-gray-600">Role: {user.userType}</p>
          </div>
          <StudentProfile />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to view the profile</p>
          <a 
            href="/login" 
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md font-medium"
          >
            Go to Login
          </a>
        </div>
      )}
    </div>
  );
};

export default TestProfile;