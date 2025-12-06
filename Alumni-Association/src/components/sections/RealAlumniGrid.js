import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const RealAlumniGrid = ({ searchQuery = '', filters = {} }) => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build query parameters
        const queryParams = new URLSearchParams();
        
        // Add search query if provided
        if (searchQuery) {
          queryParams.append('search', searchQuery);
        }
        
        // Add filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            queryParams.append(key, value);
          }
        });
        
        // Make API call to fetch real alumni data
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/alumni?${queryParams}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch alumni data');
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Transform real alumni data to match the expected format
          const transformedRealAlumni = data.data.alumni.map(alum => ({
            id: alum._id,
            name: `${alum.firstName} ${alum.lastName}`,
            batch: `Class of ${alum.graduationYear || 'N/A'}`,
            profession: alum.currentPosition || alum.company || 'Professional',
            bio: alum.bio || `Alumni from ${alum.collegeName || 'our institution'}`,
            image: alum.profilePicture || null,
            college: alum.collegeName || 'College',
            department: alum.department || 'Department',
            location: alum.location || 'Location',
            company: alum.company || 'Company',
            socials: alum.linkedinProfile ? [
              { platform: 'linkedin', url: alum.linkedinProfile }
            ] : []
          }));
          
          // Mock data to supplement real data
          const mockAlumni = [
            {
              id: 'mock1',
              name: "David Wilson",
              batch: "Class of 2015",
              profession: "Software Engineer",
              bio: "Specializing in machine learning and AI development. Passionate about mentoring new graduates in tech careers.",
              image: null,
              college: "IIT Madras",
              department: "Computer Science",
              location: "Chennai, Tamil Nadu",
              company: "Tech Innovations Inc.",
              socials: [
                { platform: "linkedin", url: "https://linkedin.com" },
                { platform: "twitter", url: "https://twitter.com" }
              ]
            },
            {
              id: 'mock2',
              name: "Emma Rodriguez",
              batch: "Class of 2018",
              profession: "Data Scientist",
              bio: "Working on predictive analytics for healthcare solutions. Published researcher in medical AI applications.",
              image: null,
              college: "Anna University",
              department: "Data Science",
              location: "Bangalore, Karnataka",
              company: "HealthTech Solutions",
              socials: [
                { platform: "linkedin", url: "https://linkedin.com" },
                { platform: "github", url: "https://github.com" }
              ]
            }
          ];
          
          // Combine real and mock data
          setAlumni([...transformedRealAlumni, ...mockAlumni]);
        } else {
          throw new Error(data.message || 'Failed to fetch alumni data');
        }
      } catch (err) {
        console.error('Error fetching alumni:', err);
        setError(err.message);
        
        // Fallback to mock data if real data fetch fails
        const mockAlumni = [
          {
            id: 'mock1',
            name: "David Wilson",
            batch: "Class of 2015",
            profession: "Software Engineer",
            bio: "Specializing in machine learning and AI development. Passionate about mentoring new graduates in tech careers.",
            image: null,
            college: "IIT Madras",
            department: "Computer Science",
            location: "Chennai, Tamil Nadu",
            company: "Tech Innovations Inc.",
            socials: [
              { platform: "linkedin", url: "https://linkedin.com" },
              { platform: "twitter", url: "https://twitter.com" }
            ]
          },
          {
            id: 'mock2',
            name: "Emma Rodriguez",
            batch: "Class of 2018",
            profession: "Data Scientist",
            bio: "Working on predictive analytics for healthcare solutions. Published researcher in medical AI applications.",
            image: null,
            college: "Anna University",
            department: "Data Science",
            location: "Bangalore, Karnataka",
            company: "HealthTech Solutions",
            socials: [
              { platform: "linkedin", url: "https://linkedin.com" },
              { platform: "github", url: "https://github.com" }
            ]
          },
          {
            id: 'mock3',
            name: "Michael Chen",
            batch: "Class of 2012",
            profession: "Business Analyst",
            bio: "Leading global marketing campaigns with a focus on digital transformation and brand strategy.",
            image: null,
            college: "Anna University",
            department: "CSE",
            location: "Chennai, Tamil Nadu",
            company: "Global Marketing Corp",
            socials: [
              { platform: "linkedin", url: "https://linkedin.com" },
              { platform: "twitter", url: "https://twitter.com" }
            ]
          }
        ];
        
        setAlumni(mockAlumni);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAlumni();
  }, [searchQuery, filters]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16 bg-white rounded-xl shadow-md"
      >
        <div className="mb-6">
          <i className="fas fa-exclamation-triangle text-6xl text-yellow-500"></i>
        </div>
        <h3 className="text-2xl font-bold text-gray-600 mb-2">Error Loading Alumni</h3>
        <p className="text-gray-500 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      {/* Results Header */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Alumni Found: <span className="text-blue-600">{alumni.length}</span>
        </h2>
        {alumni.length > 0 && (
          <div className="text-sm text-gray-600">
            Showing {alumni.length} alumni
          </div>
        )}
      </div>

      {alumni.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {alumni.map((alum, index) => (
            <motion.div
              key={alum.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {alum.image ? (
                    <img 
                      src={alum.image} 
                      alt={alum.name} 
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl mr-4">
                      {alum.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">{alum.name}</h3>
                    <p className="text-blue-600 font-medium">{alum.profession}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <i className="fas fa-graduation-cap mr-2 text-blue-500 w-4"></i>
                    <span>{alum.batch}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-university mr-2 text-green-500 w-4"></i>
                    <span className="truncate">{alum.college}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-book mr-2 text-purple-500 w-4"></i>
                    <span>{alum.department}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-map-marker-alt mr-2 text-red-500 w-4"></i>
                    <span>{alum.location}</span>
                  </div>
                </div>

                {alum.bio && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                      {alum.bio}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex space-x-3">
                    {alum.socials?.map((social) => {
                      const icons = {
                        linkedin: 'fab fa-linkedin text-blue-600',
                        twitter: 'fab fa-twitter text-blue-400',
                        github: 'fab fa-github text-gray-800',
                        researchgate: 'fas fa-flask text-green-600',
                        behance: 'fab fa-behance text-purple-600'
                      };
                      return (
                        <a 
                          key={social.platform}
                          href={social.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:scale-110 transition-transform duration-200"
                          title={social.platform}
                        >
                          <i className={`${icons[social.platform] || 'fas fa-link'} text-xl`}></i>
                        </a>
                      );
                    })}
                  </div>
                  <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 transition-colors">
                    Connect
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-xl shadow-md"
        >
          <div className="mb-6">
            <i className="fas fa-search text-6xl text-gray-300"></i>
          </div>
          <h3 className="text-2xl font-bold text-gray-600 mb-2">No Alumni Found</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            No alumni match your current search criteria. Try adjusting your filters or search query.
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <p>💡 Try searching by:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-2 py-1 bg-gray-100 rounded">Name</span>
              <span className="px-2 py-1 bg-gray-100 rounded">College</span>
              <span className="px-2 py-1 bg-gray-100 rounded">Department</span>
              <span className="px-2 py-1 bg-gray-100 rounded">Profession</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RealAlumniGrid;