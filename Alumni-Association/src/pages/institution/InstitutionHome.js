import React from 'react';
import PostFeed from '../../components/institution/PostFeed';

const InstitutionHome = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Institution Home</h1>
          <p className="text-gray-600 mt-2">Connect with alumni, share updates, and manage your community</p>
        </div>
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome to Your Institution Dashboard</h2>
              <p className="opacity-90 max-w-2xl">
                Share announcements, create events, and engage with your alumni community. 
                Stay connected and build lasting relationships with your graduates.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
                <div className="text-center">
                  <div className="text-2xl font-bold">1,248</div>
                  <div className="text-sm opacity-90">Active Alumni</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-blue-600 text-xl">👥</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">1,248</div>
                <div className="text-gray-600">Active Alumni</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-green-600 text-xl">📅</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">12</div>
                <div className="text-gray-600">Upcoming Events</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-purple-600 text-xl">📢</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">24</div>
                <div className="text-gray-600">Recent Posts</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Post Feed */}
        <PostFeed />
      </div>
    </div>
  );
};

export default InstitutionHome;