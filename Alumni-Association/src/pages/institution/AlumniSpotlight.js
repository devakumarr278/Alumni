import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import api from '../../utils/api';

const AlumniSpotlight = () => {
  const [spotlightAlumni, setSpotlightAlumni] = useState([]);
  const [featuredAlumni, setFeaturedAlumni] = useState([]);

  const fetchSpotlightAlumni = useCallback(async () => {
    try {
      const response = await api.get('/institution/analytics/alumni-spotlight');
      
      if (response.data.success) {
        setSpotlightAlumni(response.data.data.spotlight || []);
        setFeaturedAlumni(response.data.data.featured || []);
      }
    } catch (error) {
      console.error('Error fetching spotlight alumni:', error);
      // Fallback to mock data if API fails
      const mockSpotlightAlumni = [
        {
          id: 1,
          firstName: 'Priya',
          lastName: 'Sharma',
          email: 'priya.sharma@example.com',
          department: 'Computer Science',
          graduationYear: 2015,
          currentPosition: 'Senior Software Engineer',
          company: 'Google',
          location: 'Mountain View, CA',
          bio: 'Priya leads a team of engineers working on machine learning algorithms at Google. She is passionate about AI ethics and mentorship.',
          achievements: ['Published 5 research papers', 'Led team of 15 engineers', 'Mentored 30+ students'],
          profilePicture: null,
          spotlight: true,
          mentorshipCount: 25
        },
        {
          id: 2,
          firstName: 'Raj',
          lastName: 'Patel',
          email: 'raj.patel@example.com',
          department: 'Business Administration',
          graduationYear: 2012,
          currentPosition: 'Founder & CEO',
          company: 'EcoTech Solutions',
          location: 'Bangalore, India',
          bio: 'Raj founded EcoTech Solutions, a renewable energy startup that has impacted over 100,000 lives. He is a TEDx speaker and angel investor.',
          achievements: ['TEDx Speaker', 'Angel Investor', 'Social Impact Award 2023'],
          profilePicture: null,
          spotlight: true,
          mentorshipCount: 18
        },
        {
          id: 3,
          firstName: 'Anjali',
          lastName: 'Verma',
          email: 'anjali.verma@example.com',
          department: 'Medicine',
          graduationYear: 2018,
          currentPosition: 'Research Scientist',
          company: 'Johns Hopkins University',
          location: 'Baltimore, MD',
          bio: 'Anjali is conducting groundbreaking research in cancer immunotherapy. Her work has been published in top medical journals.',
          achievements: ['PhD in Oncology', 'Published 12 research papers', 'NIH Grant Recipient'],
          profilePicture: null,
          spotlight: true,
          mentorshipCount: 22
        }
      ];
      
      const mockFeaturedAlumni = [
        {
          id: 4,
          firstName: 'Vikram',
          lastName: 'Singh',
          department: 'Engineering',
          graduationYear: 2020,
          currentPosition: 'Product Manager',
          company: 'Microsoft',
          achievements: ['Launched 3 successful products', 'Led cross-functional teams'],
          profilePicture: null
        },
        {
          id: 5,
          firstName: 'Neha',
          lastName: 'Gupta',
          department: 'Arts',
          graduationYear: 2019,
          currentPosition: 'Award-winning Filmmaker',
          company: 'Independent Cinema',
          achievements: ['National Film Award', 'International Film Festival Winner'],
          profilePicture: null
        },
        {
          id: 6,
          firstName: 'Arjun',
          lastName: 'Mehta',
          department: 'Law',
          graduationYear: 2017,
          currentPosition: 'Human Rights Lawyer',
          company: 'UN Human Rights Council',
          achievements: ['Represented 50+ cases', 'Policy Advisor to Government'],
          profilePicture: null
        },
        {
          id: 7,
          firstName: 'Sunita',
          lastName: 'Reddy',
          department: 'Business',
          graduationYear: 2016,
          currentPosition: 'Venture Capitalist',
          company: 'Sequoia Capital',
          achievements: ['Managed $2B portfolio', 'Invested in 15 unicorns'],
          profilePicture: null
        }
      ];
      
      setSpotlightAlumni(mockSpotlightAlumni);
      setFeaturedAlumni(mockFeaturedAlumni);
    }
  }, []);

  useEffect(() => {
    fetchSpotlightAlumni();
  }, [fetchSpotlightAlumni]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-amber-50 to-orange-50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-amber-100"
      >
        <h1 className="text-2xl font-bold text-gray-800">Alumni Spotlight</h1>
        <p className="text-gray-700 mt-1">Celebrating outstanding achievements of our alumni community</p>
      </motion.div>

      {/* Spotlight Alumni Carousel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {spotlightAlumni.map((alumni, index) => (
          <motion.div
            key={alumni._id || alumni.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-full w-16 h-16 flex items-center justify-center text-white font-bold text-xl">
                  {alumni.firstName?.charAt(0)}{alumni.lastName?.charAt(0)}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{alumni.firstName} {alumni.lastName}</h3>
                  <p className="text-gray-600">{alumni.currentPosition}</p>
                  <p className="text-gray-600 text-sm">{alumni.company}</p>
                </div>
                <div className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">
                  SPOTLIGHT
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-gray-700 text-sm">{alumni.bio}</p>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {alumni.achievements?.slice(0, 3).map((achievement, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {achievement}
                  </span>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-gray-600">Graduated</p>
                    <p className="font-medium text-gray-800">{alumni.graduationYear}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Department</p>
                    <p className="font-medium text-gray-800">{alumni.department}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Mentorships</p>
                    <p className="font-medium text-gray-800">{alumni.mentorshipCount || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="primary" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                  View Full Profile
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Featured Alumni Grid */}
      <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Featured Alumni</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredAlumni.map((alumni, index) => (
            <motion.div
              key={alumni._id || alumni.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                  {alumni.firstName?.charAt(0)}{alumni.lastName?.charAt(0)}
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-gray-800">{alumni.firstName} {alumni.lastName}</h4>
                  <p className="text-xs text-gray-600">{alumni.currentPosition}</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-700">{alumni.company}</p>
                <p className="text-xs text-gray-600 mt-1">{alumni.graduationYear} • {alumni.department}</p>
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-700 line-clamp-2">{alumni.achievements?.[0]}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Achievement Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 backdrop-blur-lg border border-purple-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
              <i className="fas fa-award text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-700">Total Achievements</p>
              <p className="text-2xl font-bold text-gray-800">
                {spotlightAlumni.reduce((sum, alumni) => sum + (alumni.achievements?.length || 0), 0) +
                 featuredAlumni.reduce((sum, alumni) => sum + (alumni.achievements?.length || 0), 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-teal-50 backdrop-blur-lg border border-green-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <i className="fas fa-hands-helping text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-700">Mentorship Sessions</p>
              <p className="text-2xl font-bold text-gray-800">
                {spotlightAlumni.reduce((sum, alumni) => sum + (alumni.mentorshipCount || 0), 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 backdrop-blur-lg border border-amber-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
              <i className="fas fa-globe text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-700">Countries Represented</p>
              <p className="text-2xl font-bold text-gray-800">
                {[...new Set([...spotlightAlumni, ...featuredAlumni].map(a => a.location?.split(', ')[1] || 'Unknown'))].length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Nominate Form */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 backdrop-blur-lg border border-amber-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Nominate an Alumni for Spotlight</h3>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alumni Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter alumni name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter graduation year"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Achievements</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Describe notable achievements..."
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Why nominate?</label>
            <textarea
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Explain why this alumni deserves recognition..."
            ></textarea>
          </div>
          <div className="flex justify-end">
            <Button variant="primary" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
              Submit Nomination
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AlumniSpotlight;