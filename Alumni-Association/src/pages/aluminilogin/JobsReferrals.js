import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  calculateMatchScore, 
  filterEligibleJobs, 
  sortJobsByMatch, 
  getTopRecommendations, 
  JobMatchIndicator,
  checkEligibility
} from '../../components/JobMatcher';

const JobsReferrals = () => {
  const [showJobModal, setShowJobModal] = useState(false);
  const [showApplicationsDrawer, setShowApplicationsDrawer] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobForApplications, setSelectedJobForApplications] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requiredSkills: '',
    type: 'Internship'
  });
  const [studentProfile, setStudentProfile] = useState({
    skills: ["React", "JavaScript", "CSS", "Python", "SQL"],
    badges: [
      { name: "Frontend Developer", level: "advanced" },
      { name: "Web Developer", level: "intermediate" },
      { name: "Data Analyst", level: "beginner" }
    ],
    projects: 2,
    college: "Indian Institute of Technology",
    location: "Bangalore",
    experience: 1 // in years
  });

  // Mock data for startup jobs
  const startupJobs = [
    {
      id: 1,
      title: "Frontend Developer Intern",
      company: "CodeNest Labs",
      location: "Pune",
      requiredSkills: ["React", "JavaScript"],
      preferredSkills: ["Tailwind", "Firebase"],
      requiredBadges: ["Frontend Developer"],
      minProjects: 1,
      minExperience: 0,
      collegePreference: "Indian Institute of Technology",
      alumniName: "Ananya Sharma",
      alumniBatch: "2019",
      description: "Join our team to build modern web applications using cutting-edge frontend technologies. Perfect opportunity for students interested in React development.",
      postedDate: "2024-01-15",
      type: "Internship",
      logo: null
    },
    {
      id: 2,
      title: "Data Science Intern",
      company: "DataDriven Solutions",
      location: "Bangalore",
      requiredSkills: ["Python", "Statistics"],
      preferredSkills: ["Machine Learning", "SQL"],
      requiredBadges: ["Data Analyst"],
      minProjects: 2,
      minExperience: 1,
      collegePreference: "Indian Institute of Technology",
      alumniName: "Rajesh Kumar",
      alumniBatch: "2018",
      description: "Work on exciting data science projects involving machine learning models and data analysis. Great opportunity for students with strong Python skills.",
      postedDate: "2024-01-12",
      type: "Internship",
      logo: null
    },
    {
      id: 3,
      title: "Product Design Intern",
      company: "UX Innovations",
      location: "Mumbai",
      requiredSkills: ["Figma", "UI Design"],
      preferredSkills: ["Prototyping", "User Research"],
      requiredBadges: ["Design Specialist"],
      minProjects: 1,
      minExperience: 0,
      collegePreference: "",
      alumniName: "Priya Desai",
      alumniBatch: "2020",
      description: "Design beautiful user experiences for our mobile and web applications. Perfect for students passionate about design and user experience.",
      postedDate: "2024-01-10",
      type: "Internship",
      logo: null
    },
    {
      id: 4,
      title: "Backend Developer",
      company: "ServerStack",
      location: "Bangalore",
      requiredSkills: ["Node.js", "SQL"],
      preferredSkills: ["Python", "Docker"],
      requiredBadges: ["Backend Developer"],
      minProjects: 3,
      minExperience: 2,
      collegePreference: "Indian Institute of Technology",
      alumniName: "Vikram Patel",
      alumniBatch: "2017",
      description: "Build scalable backend services and APIs for high-traffic applications. Experience with cloud platforms is a plus.",
      postedDate: "2024-01-18",
      type: "Full-time",
      logo: null
    }
  ];

  // Mock data for posted jobs
  const postedJobs = [
    {
      id: 1,
      title: "Software Engineer Intern",
      company: "TechCorp",
      postedDate: "2 days ago",
      applications: [
        { id: 1, name: "Alex Johnson", skills: ["Python", "SQL", "Problem Solving"], status: "Pending" },
        { id: 2, name: "Sarah Williams", skills: ["Python", "Java", "Docker"], status: "Shortlisted" }
      ],
      topMatch: "Alex Johnson",
      description: "Looking for a Computer Science student with Python experience for a summer internship.",
      requiredSkills: ["Python", "SQL", "Problem Solving"]
    },
    {
      id: 2,
      title: "Data Analyst Position",
      company: "DataSystems",
      postedDate: "1 week ago",
      applications: [
        { id: 1, name: "Maria Garcia", skills: ["Statistics", "Excel", "SQL"], status: "Pending" }
      ],
      topMatch: "Maria Garcia",
      description: "Entry-level position for a graduate with strong statistical analysis skills.",
      requiredSkills: ["Statistics", "Excel", "SQL"]
    }
  ];

  // Calculate match scores for all jobs
  const [jobsWithScores, setJobsWithScores] = useState([]);

  useEffect(() => {
    const jobsWithMatchScores = startupJobs.map(job => {
      const matchData = calculateMatchScore(studentProfile, job);
      return {
        ...job,
        matchScore: matchData.score,
        matchDetails: matchData.details
      };
    });
    setJobsWithScores(jobsWithScores);
  }, [studentProfile]);

  // Filter jobs based on active filter
  const filteredJobs = activeFilter === 'all' 
    ? jobsWithScores 
    : jobsWithScores.filter(job => job.type.toLowerCase() === activeFilter);

  // Get top recommendations for AI Insights Dashboard
  const topRecommendations = getTopRecommendations(studentProfile, startupJobs, 3);

  // Handle job click
  const handleJobClick = (job) => {
    setSelectedJob(job);
    setShowJobModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowJobModal(false);
    setSelectedJob(null);
  };

  // Clear filters
  const clearFilters = () => {
    setActiveFilter('all');
  };

  // Handle new job input change
  const handleNewJobChange = (e) => {
    const { name, value } = e.target;
    setNewJob(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle post new job
  const handlePostNewJob = (e) => {
    e.preventDefault();
    // In a real app, this would send data to backend
    alert('Job posted successfully!');
    setShowJobModal(false);
    setNewJob({
      title: '',
      company: '',
      location: '',
      description: '',
      requiredSkills: '',
      type: 'Internship'
    });
  };

  // View applications for a job
  const viewApplications = (job) => {
    setSelectedJobForApplications(job);
    setShowApplicationsDrawer(true);
  };

  // Close applications drawer
  const closeApplicationsDrawer = () => {
    setShowApplicationsDrawer(false);
    setSelectedJobForApplications(null);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-lg p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Jobs & Referrals
        </h1>
        <motion.button 
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-3 rounded-xl hover:opacity-90 font-medium shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowJobModal(true)}
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Post New Job
          </div>
        </motion.button>
      </div>
      
      {/* Student Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          {['all', 'internship', 'full-time', 'remote'].map((filter) => (
            <motion.button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all shadow-md ${
                activeFilter === filter 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {filter === 'all' ? 'All Opportunities' : 
               filter === 'internship' ? 'Internships' :
               filter === 'full-time' ? 'Full-time' : 'Remote'}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Startup Hiring Hub - New Section */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 rounded-t-2xl p-5 text-white shadow-lg">
          <div className="flex items-center">
            <div className="text-3xl mr-3">🌟</div>
            <h2 className="text-2xl font-bold">Startup Opportunities by Alumni</h2>
          </div>
          <p className="text-purple-100 mt-1">Posted by Alumni Founders from your college</p>
        </div>
        
        <div className="border border-gray-200 rounded-b-2xl p-5 bg-white shadow-sm">
          {filteredJobs.length > 0 ? (
            <div className="space-y-5">
              {filteredJobs.map((job) => (
                <motion.div 
                  key={job.id} 
                  className="border border-gray-200 rounded-2xl p-5 hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-white to-gray-50"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  onClick={() => handleJobClick(job)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: job.id * 0.1 }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-gray-800 text-xl">{job.title}</h3>
                          <p className="text-gray-600 font-medium mt-1">{job.company} • {job.location}</p>
                        </div>
                        <JobMatchIndicator score={job.matchScore} />
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        {job.requiredSkills.slice(0, 4).map((skill, index) => (
                          <span key={index} className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
                            {skill}
                          </span>
                        ))}
                        {job.requiredSkills.length > 4 && (
                          <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
                            +{job.requiredSkills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      Posted by: <span className="font-semibold text-purple-700">{job.alumniName}</span> (Batch {job.alumniBatch})
                    </p>
                    <div className="flex items-center">
                      <span className="text-xs bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 px-2.5 py-1 rounded-full mr-2 shadow-sm">
                        {job.type}
                      </span>
                      <motion.button 
                        className="text-purple-600 hover:text-purple-800 text-sm font-semibold flex items-center"
                        whileHover={{ x: 5 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJobClick(job);
                        }}
                      >
                        View Details
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <motion.div 
                className="text-6xl mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                🚀
              </motion.div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">No opportunities match your filters</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters to see more opportunities.</p>
              <motion.button 
                onClick={clearFilters}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-3 rounded-xl hover:opacity-90 font-medium shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear Filters
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Posted Jobs - Existing Section */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center">
          <span className="mr-3 text-2xl">💼</span> Posted Jobs
        </h2>
        <div className="space-y-5">
          {postedJobs.map((job) => (
            <motion.div 
              key={job.id} 
              className="border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all bg-white"
              whileHover={{ y: -3 }}
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">{job.title}</h3>
                  <p className="text-gray-600 mt-1">{job.company} • Posted {job.postedDate}</p>
                </div>
                <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm">
                  {job.applications.length} applications
                </span>
              </div>
              <p className="text-gray-700 mt-3">{job.description}</p>
              <div className="flex justify-between items-center mt-5">
                <div>
                  <span className="text-sm text-gray-600">Top Match:</span>
                  <span className="ml-2 font-medium text-gray-800">{job.topMatch}</span>
                </div>
                <div className="space-x-3">
                  <button 
                    className="text-purple-600 hover:text-purple-800 font-medium"
                    onClick={() => viewApplications(job)}
                  >
                    View Applications
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 font-medium">
                    Edit
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      

      


      {/* Job Detail Modal */}
      {showJobModal && selectedJob && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <div className="p-7">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h3 className="text-3xl font-bold text-gray-800">{selectedJob.title}</h3>
                  <p className="text-gray-600 font-medium text-lg mt-1">{selectedJob.company} • {selectedJob.location}</p>
                </div>
                <motion.button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-5">
                {selectedJob.requiredSkills.map((skill, index) => (
                  <motion.span 
                    key={index} 
                    className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                    whileHover={{ scale: 1.05 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
              
              <div className="mb-5">
                <h4 className="font-semibold text-gray-800 text-lg mb-3">Description</h4>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{selectedJob.description}</p>
              </div>
              
              <div className="mb-5">
                <h4 className="font-semibold text-gray-800 text-lg mb-3">Posted By</h4>
                <div className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 shadow-md">
                    {selectedJob.alumniName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-lg">{selectedJob.alumniName}</p>
                    <p className="text-gray-600">Batch {selectedJob.alumniBatch}</p>
                    <p className="text-sm text-gray-500 mt-1">Alumni of {studentProfile.college}</p>
                  </div>
                </div>
              </div>
              
              {/* Match Score Breakdown */}
              <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm">
                <h4 className="font-semibold text-gray-800 text-lg mb-4 flex items-center">
                  <span className="mr-2 text-xl">📊</span> Match Score Breakdown
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex justify-between items-center bg-white bg-opacity-70 rounded-xl p-3 shadow-sm">
                    <span className="text-gray-700">Skills</span>
                    <span className="font-bold text-gray-800">{selectedJob.matchDetails.skills}%</span>
                  </div>
                  <div className="flex justify-between items-center bg-white bg-opacity-70 rounded-xl p-3 shadow-sm">
                    <span className="text-gray-700">Badges</span>
                    <span className="font-bold text-gray-800">{selectedJob.matchDetails.badges}%</span>
                  </div>
                  <div className="flex justify-between items-center bg-white bg-opacity-70 rounded-xl p-3 shadow-sm">
                    <span className="text-gray-700">Projects</span>
                    <span className="font-bold text-gray-800">{selectedJob.matchDetails.projects}%</span>
                  </div>
                  <div className="flex justify-between items-center bg-white bg-opacity-70 rounded-xl p-3 shadow-sm">
                    <span className="text-gray-700">Experience</span>
                    <span className="font-bold text-gray-800">{selectedJob.matchDetails.experience}%</span>
                  </div>
                  <div className="flex justify-between items-center bg-white bg-opacity-70 rounded-xl p-3 shadow-sm">
                    <span className="text-gray-700">Location</span>
                    <span className="font-bold text-gray-800">{selectedJob.matchDetails.location}%</span>
                  </div>
                  <div className="flex justify-between items-center bg-white bg-opacity-70 rounded-xl p-3 shadow-sm">
                    <span className="text-gray-700">College</span>
                    <span className="font-bold text-gray-800">{selectedJob.matchDetails.college}%</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-100 flex justify-between items-center">
                  <span className="font-semibold text-gray-800 text-lg">Total Match Score</span>
                  <JobMatchIndicator score={selectedJob.matchScore} />
                </div>
              </div>
              
              {/* Eligibility Status */}
              <div className="mb-7">
                {(() => {
                  const eligibility = checkEligibility(studentProfile, selectedJob);
                  if (eligibility.isEligible) {
                    return (
                      <motion.div 
                        className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 shadow-sm"
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl mr-4 shadow-md">
                            ✓
                          </div>
                          <div>
                            <p className="font-bold text-green-700 text-lg">You are eligible!</p>
                            <p className="text-green-600">Your skill match: {selectedJob.matchScore}%</p>
                          </div>
                        </div>
                        <motion.button 
                          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:opacity-90 font-medium shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Apply Now
                        </motion.button>
                      </motion.div>
                    );
                  } else {
                    return (
                      <motion.div 
                        className="flex items-center justify-between bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-5 shadow-sm"
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xl mr-4 shadow-md">
                            !
                          </div>
                          <div>
                            <p className="font-bold text-yellow-700 text-lg">Additional requirements needed</p>
                            <ul className="text-yellow-600 list-disc list-inside mt-1">
                              {eligibility.issues.slice(0, 2).map((issue, index) => (
                                <li key={index}>{issue}</li>
                              ))}
                              {eligibility.issues.length > 2 && (
                                <li>+{eligibility.issues.length - 2} more requirements</li>
                              )}
                            </ul>
                          </div>
                        </div>
                        <button className="bg-gray-300 text-gray-500 px-6 py-3 rounded-xl font-medium cursor-not-allowed shadow-sm" disabled>
                          Apply
                        </button>
                      </motion.div>
                    );
                  }
                })()}
              </div>
              
              <div className="flex justify-end space-x-4">
                <motion.button 
                  onClick={closeModal}
                  className="px-5 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium shadow-sm"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
                <motion.button 
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-3 rounded-xl hover:opacity-90 font-medium shadow-lg"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Apply Now
                </motion.button>
                <motion.button 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-5 py-3 rounded-xl hover:opacity-90 font-medium shadow-lg"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Message Alumni
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Post New Job Modal */}
      {showJobModal && !selectedJob && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <div className="p-7">
              <div className="flex justify-between items-start mb-5">
                <h3 className="text-3xl font-bold text-gray-800">Post a New Job</h3>
                <motion.button 
                  onClick={() => {
                    setShowJobModal(false);
                    setNewJob({
                      title: '',
                      company: '',
                      location: '',
                      description: '',
                      requiredSkills: '',
                      type: 'Internship'
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              
              <form onSubmit={handlePostNewJob}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Job Title</label>
                    <input
                      type="text"
                      name="title"
                      value={newJob.title}
                      onChange={handleNewJobChange}
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g. Frontend Developer Intern"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Company</label>
                      <input
                        type="text"
                        name="company"
                        value={newJob.company}
                        onChange={handleNewJobChange}
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Company Name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={newJob.location}
                        onChange={handleNewJobChange}
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g. Bangalore"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Job Type</label>
                    <select
                      name="type"
                      value={newJob.type}
                      onChange={handleNewJobChange}
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="Internship">Internship</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Required Skills</label>
                    <input
                      type="text"
                      name="requiredSkills"
                      value={newJob.requiredSkills}
                      onChange={handleNewJobChange}
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g. React, JavaScript, CSS (comma separated)"
                      required
                    />
                    <p className="text-gray-500 text-sm mt-1">Enter skills separated by commas</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Job Description</label>
                    <textarea
                      name="description"
                      value={newJob.description}
                      onChange={handleNewJobChange}
                      rows="4"
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Describe the job role, responsibilities, and requirements..."
                      required
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 mt-8">
                  <motion.button 
                    type="button"
                    onClick={() => {
                      setShowJobModal(false);
                      setNewJob({
                        title: '',
                        company: '',
                        location: '',
                        description: '',
                        requiredSkills: '',
                        type: 'Internship'
                      });
                    }}
                    className="px-5 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium shadow-sm"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button 
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-3 rounded-xl hover:opacity-90 font-medium shadow-lg"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Post Job
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Applications Drawer */}
      {showApplicationsDrawer && selectedJobForApplications && (
        <motion.div 
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div 
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={closeApplicationsDrawer}
          ></div>
          <motion.div 
            className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Applications for {selectedJobForApplications.title}
                </h3>
                <motion.button 
                  onClick={closeApplicationsDrawer}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              
              <div className="space-y-4">
                {selectedJobForApplications.applications && selectedJobForApplications.applications.length > 0 ? (
                  selectedJobForApplications.applications.map((applicant) => (
                    <div key={applicant.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-800">{applicant.name}</h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {applicant.skills.map((skill, index) => (
                              <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          applicant.status === 'Pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : applicant.status === 'Shortlisted' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {applicant.status}
                        </span>
                      </div>
                      <div className="flex justify-end space-x-2 mt-4">
                        <button className="text-sm text-gray-600 hover:text-gray-800">
                          View Profile
                        </button>
                        <button className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-lg hover:bg-purple-200">
                          Contact
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">📄</div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">No Applications Yet</h4>
                    <p className="text-gray-600">Share this job posting to attract applicants.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default JobsReferrals;