import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    established: '',
    location: '',
    website: '',
    email: '',
    phone: '',
    description: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  // Initialize profile data with user information
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.institutionName || user.name || 'Institution',
        established: user.establishedYear || '',
        location: user.address || '',
        website: user.website || '',
        email: user.institutionalEmail || user.email || '',
        phone: user.landlineNumber || user.phone || '',
        description: user.description || `Welcome to ${user.institutionName || user.name || 'our institution'}'s profile.`,
        facebook: user.facebook || '',
        twitter: user.twitter || '',
        linkedin: user.linkedin || '',
        instagram: user.instagram || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // In a real app, you would save the data to a server here
    console.log('Profile updated:', profileData);
  };

  // Get initials for the avatar
  const getInitials = () => {
    const name = profileData.name || '';
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-indigo-50 to-purple-50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-indigo-100"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Institution Profile</h1>
            <p className="text-gray-700 mt-1">Manage your institution's public profile information</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(!isEditing)}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <i className={`fas ${isEditing ? 'fa-times' : 'fa-edit'} mr-2`}></i>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Established</label>
                  <input
                    type="text"
                    name="established"
                    value={profileData.established}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={profileData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50"
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="bg-indigo-500 hover:bg-indigo-600"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl w-16 h-16 flex items-center justify-center text-white text-2xl font-bold">
                    {getInitials()}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-800">{profileData.name}</h3>
                    <p className="text-gray-600 mt-1">{profileData.location}</p>
                    {profileData.established && (
                      <p className="text-sm text-gray-500 mt-1">Established {profileData.established}</p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-gray-700">{profileData.description}</p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h4>
                  <div className="space-y-2">
                    {profileData.website && (
                      <div className="flex items-center text-sm">
                        <i className="fas fa-globe text-gray-500 w-5"></i>
                        <span className="ml-2 text-gray-700">{profileData.website}</span>
                      </div>
                    )}
                    {profileData.email && (
                      <div className="flex items-center text-sm">
                        <i className="fas fa-envelope text-gray-500 w-5"></i>
                        <span className="ml-2 text-gray-700">{profileData.email}</span>
                      </div>
                    )}
                    {profileData.phone && (
                      <div className="flex items-center text-sm">
                        <i className="fas fa-phone text-gray-500 w-5"></i>
                        <span className="ml-2 text-gray-700">{profileData.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Social Media */}
          <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Social Media</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {profileData.facebook && (
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <i className="fab fa-facebook text-blue-600 text-xl"></i>
                  <div className="ml-3">
                    <p className="text-xs text-gray-600">Facebook</p>
                    <p className="text-sm font-medium text-gray-800">@{profileData.facebook}</p>
                  </div>
                </div>
              )}
              {profileData.twitter && (
                <div className="flex items-center p-3 bg-sky-50 rounded-lg">
                  <i className="fab fa-twitter text-sky-600 text-xl"></i>
                  <div className="ml-3">
                    <p className="text-xs text-gray-600">Twitter</p>
                    <p className="text-sm font-medium text-gray-800">@{profileData.twitter}</p>
                  </div>
                </div>
              )}
              {profileData.linkedin && (
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <i className="fab fa-linkedin text-blue-700 text-xl"></i>
                  <div className="ml-3">
                    <p className="text-xs text-gray-600">LinkedIn</p>
                    <p className="text-sm font-medium text-gray-800">@{profileData.linkedin}</p>
                  </div>
                </div>
              )}
              {profileData.instagram && (
                <div className="flex items-center p-3 bg-pink-50 rounded-lg">
                  <i className="fab fa-instagram text-pink-600 text-xl"></i>
                  <div className="ml-3">
                    <p className="text-xs text-gray-600">Instagram</p>
                    <p className="text-sm font-medium text-gray-800">@{profileData.instagram}</p>
                  </div>
                </div>
              )}
              {!profileData.facebook && !profileData.twitter && !profileData.linkedin && !profileData.instagram && (
                <div className="col-span-4 text-center py-4 text-gray-500">
                  No social media accounts added yet
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Stats and Achievements */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-lg border border-blue-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Achievements</h2>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-white/50 rounded-lg">
                <div className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg w-12 h-12 flex items-center justify-center text-white">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <div className="ml-3">
                  <p className="text-lg font-bold text-gray-800">125+</p>
                  <p className="text-sm text-gray-700">Years of Excellence</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-white/50 rounded-lg">
                <div className="bg-gradient-to-br from-green-400 to-teal-500 rounded-lg w-12 h-12 flex items-center justify-center text-white">
                  <i className="fas fa-users"></i>
                </div>
                <div className="ml-3">
                  <p className="text-lg font-bold text-gray-800">45K+</p>
                  <p className="text-sm text-gray-700">Alumni Worldwide</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-white/50 rounded-lg">
                <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg w-12 h-12 flex items-center justify-center text-white">
                  <i className="fas fa-globe"></i>
                </div>
                <div className="ml-3">
                  <p className="text-lg font-bold text-gray-800">150+</p>
                  <p className="text-sm text-gray-700">Countries Represented</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-white/50 rounded-lg">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg w-12 h-12 flex items-center justify-center text-white">
                  <i className="fas fa-trophy"></i>
                </div>
                <div className="ml-3">
                  <p className="text-lg font-bold text-gray-800">85%</p>
                  <p className="text-sm text-gray-700">Engagement Rate</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Profile Completion */}
          <Card className="bg-gradient-to-br from-green-50 to-teal-50 backdrop-blur-lg border border-green-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Completion</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Profile Information</span>
                  <span className="text-gray-700">100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Social Media Links</span>
                  <span className="text-gray-700">100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Photos & Media</span>
                  <span className="text-gray-700">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="pt-2">
                <Button variant="primary" className="w-full bg-green-500 hover:bg-green-600">
                  <i className="fas fa-plus mr-2"></i>Upload Media
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;