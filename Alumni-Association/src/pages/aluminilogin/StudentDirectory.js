import React from 'react';

const StudentDirectory = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Student Directory</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
              AJ
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Alex Johnson</h3>
              <p className="text-sm text-gray-600">Computer Science, 2024</p>
            </div>
          </div>
          <div className="mb-3">
            <p className="text-sm text-gray-700">Skills: Machine Learning, Python, Data Analysis</p>
            <p className="text-sm text-gray-700 mt-1">Career Goal: AI Research</p>
          </div>
          <div className="flex space-x-2">
            <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm hover:bg-purple-700">
              Connect
            </button>
            <button className="flex-1 border border-purple-600 text-purple-600 py-2 rounded-lg text-sm hover:bg-purple-50">
              Message
            </button>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
              MG
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Maria Garcia</h3>
              <p className="text-sm text-gray-600">Data Science, 2025</p>
            </div>
          </div>
          <div className="mb-3">
            <p className="text-sm text-gray-700">Skills: R, Statistics, Data Visualization</p>
            <p className="text-sm text-gray-700 mt-1">Career Goal: Data Scientist</p>
          </div>
          <div className="flex space-x-2">
            <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm hover:bg-purple-700">
              Connect
            </button>
            <button className="flex-1 border border-purple-600 text-purple-600 py-2 rounded-lg text-sm hover:bg-purple-50">
              Message
            </button>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
              TR
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Thomas Reed</h3>
              <p className="text-sm text-gray-600">Mechanical Engineering, 2023</p>
            </div>
          </div>
          <div className="mb-3">
            <p className="text-sm text-gray-700">Skills: CAD, Manufacturing, Project Management</p>
            <p className="text-sm text-gray-700 mt-1">Career Goal: Product Development</p>
          </div>
          <div className="flex space-x-2">
            <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm hover:bg-purple-700">
              Connect
            </button>
            <button className="flex-1 border border-purple-600 text-purple-600 py-2 rounded-lg text-sm hover:bg-purple-50">
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDirectory;