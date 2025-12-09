import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const AlumniManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'insights'

  // Mock data - in a real app, this would come from an API
  const mockAlumniData = [
    {
      id: 1,
      name: 'John Smith',
      department: 'CSE',
      batch: '2020',
      company: 'TCS',
      location: 'Bangalore',
      status: 'Active',
      regNumber: 'CSE2020001',
      college: 'Test University',
      email: 'john.smith@testuniv.edu',
      tags: ['Mentor'],
      age: 26,
      github: 'https://github.com/johnsmith',
      linkedin: 'https://linkedin.com/in/johnsmith',
      experience: 4.2,
      isVerified: true,
      careerTimeline: [
        { year: 2020, role: 'Intern', company: 'StartupXYZ' },
        { year: 2021, role: 'Software Engineer', company: 'TCS' },
        { year: 2023, role: 'Senior Engineer', company: 'TCS' }
      ],
      mentorshipSessions: 18,
      studentsConnected: 12,
      avgTimeSpent: 1.6,
      avgRating: 4.6,
      engagementScore: 85,
      consistency: 92,
      longevity: 78,
      mentorshipData: [
        { day: "Mon", sessions: 2 },
        { day: "Tue", sessions: 4 },
        { day: "Wed", sessions: 3 },
        { day: "Thu", sessions: 6 },
        { day: "Fri", sessions: 5 },
        { day: "Sat", sessions: 7 },
        { day: "Sun", sessions: 4 },
      ],
      intensityData: [3, 4, 2, 5, 3, 2, 4, 3, 5, 4, 3, 2],
      replayData: [
        { date: '2023-05-01', attendees: 5, duration: 1.5, feedback: '⭐⭐⭐⭐' },
        { date: '2023-05-08', attendees: 6, duration: 1.7, feedback: '⭐⭐⭐⭐⭐' },
        { date: '2023-05-15', attendees: 4, duration: 1.3, feedback: '⭐⭐⭐⭐' }
      ]
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      department: 'ECE',
      batch: '2019',
      company: 'Infosys',
      location: 'Chennai',
      status: 'Active',
      regNumber: 'ECE2019002',
      college: 'Test University',
      email: 'sarah.j@testuniv.edu',
      tags: [],
      age: 27,
      github: 'https://github.com/sarahj',
      linkedin: 'https://linkedin.com/in/sarahj',
      experience: 5.1,
      isVerified: true,
      careerTimeline: [
        { year: 2019, role: 'Trainee', company: 'Infosys' },
        { year: 2021, role: 'System Engineer', company: 'Infosys' },
        { year: 2023, role: 'Tech Lead', company: 'Infosys' }
      ],
      mentorshipSessions: 12,
      studentsConnected: 8,
      avgTimeSpent: 1.3,
      avgRating: 4.2,
      engagementScore: 72,
      consistency: 78,
      longevity: 85,
      mentorshipData: [
        { day: "Mon", sessions: 1 },
        { day: "Tue", sessions: 2 },
        { day: "Wed", sessions: 1 },
        { day: "Thu", sessions: 3 },
        { day: "Fri", sessions: 2 },
        { day: "Sat", sessions: 4 },
        { day: "Sun", sessions: 2 },
      ],
      intensityData: [2, 3, 1, 4, 2, 1, 3, 2, 4, 3, 2, 1],
      replayData: [
        { date: '2023-05-02', attendees: 4, duration: 1.2, feedback: '⭐⭐⭐⭐' },
        { date: '2023-05-09', attendees: 5, duration: 1.4, feedback: '⭐⭐⭐⭐⭐' }
      ]
    },
    {
      id: 3,
      name: 'Michael Brown',
      department: 'EEE',
      batch: '2021',
      company: 'Wipro',
      location: 'Hyderabad',
      status: 'Inactive',
      regNumber: 'EEE2021003',
      college: 'Test University',
      email: 'michael.b@testuniv.edu',
      tags: ['Speaker'],
      age: 25,
      github: 'https://github.com/michaelb',
      linkedin: 'https://linkedin.com/in/michaelb',
      experience: 3.2,
      isVerified: true,
      careerTimeline: [
        { year: 2021, role: 'Associate', company: 'Wipro' },
        { year: 2022, role: 'Engineer', company: 'Wipro' }
      ],
      mentorshipSessions: 8,
      studentsConnected: 5,
      avgTimeSpent: 0.9,
      avgRating: 3.8,
      engagementScore: 55,
      consistency: 60,
      longevity: 45,
      mentorshipData: [
        { day: "Mon", sessions: 0 },
        { day: "Tue", sessions: 1 },
        { day: "Wed", sessions: 0 },
        { day: "Thu", sessions: 1 },
        { day: "Fri", sessions: 0 },
        { day: "Sat", sessions: 1 },
        { day: "Sun", sessions: 0 },
      ],
      intensityData: [1, 2, 0, 3, 1, 0, 2, 1, 3, 2, 1, 0],
      replayData: [
        { date: '2023-05-05', attendees: 3, duration: 1.0, feedback: '⭐⭐⭐' }
      ]
    },
    {
      id: 4,
      name: 'Emily Davis',
      department: 'CSE',
      batch: '2018',
      company: 'Google',
      location: 'Pune',
      status: 'Active',
      regNumber: 'CSE2018004',
      college: 'Test University',
      email: 'emily.d@testuniv.edu',
      tags: ['Mentor', 'Donor'],
      age: 28,
      github: 'https://github.com/emilyd',
      linkedin: 'https://linkedin.com/in/emilyd',
      experience: 6.2,
      isVerified: true,
      careerTimeline: [
        { year: 2018, role: 'Software Engineer', company: 'Google' },
        { year: 2020, role: 'Senior Engineer', company: 'Google' },
        { year: 2022, role: 'Staff Engineer', company: 'Google' }
      ],
      mentorshipSessions: 32,
      studentsConnected: 24,
      avgTimeSpent: 2.1,
      avgRating: 4.9,
      engagementScore: 95,
      consistency: 98,
      longevity: 92,
      mentorshipData: [
        { day: "Mon", sessions: 3 },
        { day: "Tue", sessions: 4 },
        { day: "Wed", sessions: 2 },
        { day: "Thu", sessions: 5 },
        { day: "Fri", sessions: 6 },
        { day: "Sat", sessions: 8 },
        { day: "Sun", sessions: 4 },
      ],
      intensityData: [5, 6, 4, 7, 5, 4, 6, 5, 7, 6, 5, 4],
      replayData: [
        { date: '2023-05-01', attendees: 8, duration: 2.0, feedback: '⭐⭐⭐⭐⭐' },
        { date: '2023-05-08', attendees: 9, duration: 2.2, feedback: '⭐⭐⭐⭐⭐' },
        { date: '2023-05-15', attendees: 7, duration: 1.8, feedback: '⭐⭐⭐⭐⭐' },
        { date: '2023-05-22', attendees: 10, duration: 2.5, feedback: '⭐⭐⭐⭐⭐' }
      ]
    },
    {
      id: 5,
      name: 'Robert Wilson',
      department: 'MECH',
      batch: '2022',
      company: 'Tesla',
      location: 'Mumbai',
      status: 'Suspended',
      regNumber: 'MECH2022005',
      college: 'Test University',
      email: 'robert.w@testuniv.edu',
      tags: [],
      age: 24,
      github: 'https://github.com/robertw',
      linkedin: 'https://linkedin.com/in/robertw',
      experience: 2.1,
      isVerified: true,
      careerTimeline: [
        { year: 2022, role: 'Junior Engineer', company: 'Tesla' }
      ],
      mentorshipSessions: 0,
      studentsConnected: 0,
      avgTimeSpent: 0,
      avgRating: 0,
      engagementScore: 20,
      consistency: 15,
      longevity: 30,
      mentorshipData: [
        { day: "Mon", sessions: 0 },
        { day: "Tue", sessions: 0 },
        { day: "Wed", sessions: 0 },
        { day: "Thu", sessions: 0 },
        { day: "Fri", sessions: 0 },
        { day: "Sat", sessions: 0 },
        { day: "Sun", sessions: 0 },
      ],
      intensityData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      replayData: []
    }
  ];

  // Load mock data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setAlumniData(mockAlumniData);
      setLoading(false);
    };
    
    loadData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const openPanel = (alumni) => {
    setSelectedAlumni(alumni);
    setIsPanelOpen(true);
    setActiveTab('profile'); // Default to profile tab
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setSelectedAlumni(null);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'Suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTagClass = (tag) => {
    switch (tag) {
      case 'Mentor':
        return 'bg-blue-100 text-blue-800';
      case 'Speaker':
        return 'bg-purple-100 text-purple-800';
      case 'Donor':
        return 'bg-pink-100 text-pink-800';
      case 'Recruiter':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter alumni based on search and filters
  const filteredAlumni = alumniData.filter(alumni => {
    const matchesSearch = alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          alumni.regNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alumni.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !departmentFilter || alumni.department === departmentFilter;
    const matchesCompany = !companyFilter || alumni.company === companyFilter;
    const matchesBatch = !batchFilter || alumni.batch === batchFilter;
    const matchesStatus = !statusFilter || alumni.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesCompany && matchesBatch && matchesStatus;
  });

  // Get unique values for filters
  const departments = [...new Set(alumniData.map(a => a.department))];
  const companies = [...new Set(alumniData.map(a => a.company))];
  const batches = [...new Set(alumniData.map(a => a.batch))];
  const statuses = [...new Set(alumniData.map(a => a.status))];

  // Calculate impact score
  const calculateImpactScore = (alumni) => {
    if (!alumni) return 0;
    return (alumni.mentorshipSessions * 4) + 
           (alumni.studentsConnected * 3) + 
           (alumni.avgTimeSpent * 10);
  };

  // Get contribution highlights
  const getContributionHighlights = (alumni) => {
    if (!alumni || !alumni.mentorshipData) return {};
    
    // Find peak day
    const peakDayData = alumni.mentorshipData.reduce((max, day) => 
      day.sessions > max.sessions ? day : max, alumni.mentorshipData[0]);
    
    // Calculate growth (simplified)
    const totalSessions = alumni.mentorshipData.reduce((sum, day) => sum + day.sessions, 0);
    const growth = Math.round((totalSessions / 20) * 100); // Simplified calculation
    
    // Calculate consistency
    const activeDays = alumni.mentorshipData.filter(day => day.sessions > 0).length;
    
    return {
      peakDay: `${peakDayData.day} (${peakDayData.sessions} sessions)`,
      growth: `+${growth}% this week`,
      consistency: `${activeDays} days active`
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Alumni Management</h1>
        <p className="text-gray-600">Manage verified alumni profiles and administrative actions</p>
      </div>

      {/* Top Filters - Professional Design */}
      <div className="alumni-filters bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="search-box flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg flex-1">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search alumni by name, reg no, company..."
              className="border-none outline-none w-full bg-transparent"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div className="filters flex flex-wrap gap-2">
            <select
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            
            <select
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
            >
              <option value="">Company</option>
              {companies.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
            
            <select
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white"
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
            >
              <option value="">Batch</option>
              {batches.map(batch => (
                <option key={batch} value={batch}>{batch}</option>
              ))}
            </select>
            
            <select
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            
            <button className="export-btn px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition">
              Export CSV
            </button>
            <button className="bulk-btn px-3 py-2 rounded-lg bg-indigo-600 text-white border-none hover:bg-indigo-700 transition">
              Bulk Message
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Premium Alumni Table */}
      {!loading && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="alumni-list p-6">
            {/* Column Header */}
            <div className="alumni-header">
              <span></span>
              <span>Name</span>
              <span>Role</span>
              <span>Company</span>
              <span>Dept</span>
              <span>Batch</span>
              <span>Location</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {/* Alumni Rows */}
            {filteredAlumni.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No alumni found matching your criteria
              </div>
            ) : (
              filteredAlumni.map((alumni) => (
                <div 
                  key={alumni.id} 
                  className="alumni-row"
                  onClick={() => openPanel(alumni)}
                >
                  <div className="col avatar">
                    <div className="avatar-circle">
                      {alumni.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>

                  <div className="col name">{alumni.name}</div>

                  <div className="col role">
                    {alumni.careerTimeline[alumni.careerTimeline.length - 1]?.role}
                  </div>

                  <div className="col company">{alumni.company}</div>

                  <div className="col dept">{alumni.department}</div>

                  <div className="col batch">{alumni.batch}</div>

                  <div className="col location">{alumni.location}</div>

                  <div className={`col status ${alumni.status.toLowerCase()}`}>
                    {alumni.status}
                  </div>

                  <div className="col action">
                    <button 
                      className="view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openPanel(alumni);
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Full Width Alumni Detail Panel */}
      <AnimatePresence>
        {isPanelOpen && selectedAlumni && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closePanel}></div>
              
              <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="profile-title text-2xl font-bold text-gray-900">
                            {selectedAlumni.name}
                          </h3>
                          <p className="profile-sub text-gray-500 mt-1">
                            {selectedAlumni.department} • Batch {selectedAlumni.batch} • {selectedAlumni.company}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                          onClick={closePanel}
                        >
                          <span className="sr-only">Close</span>
                          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Tab Navigation */}
                      <div className="mt-6 border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                          <button
                            onClick={() => setActiveTab('profile')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                              activeTab === 'profile'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            Profile
                          </button>
                          <button
                            onClick={() => setActiveTab('insights')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                              activeTab === 'insights'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            Insights
                          </button>
                        </nav>
                      </div>
                      
                      {/* Tab Content */}
                      <div className="mt-6">
                        <AnimatePresence mode="wait">
                          {activeTab === 'profile' ? (
                            <motion.div
                              key="profile"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.2 }}
                              className="space-y-6"
                            >
                              {/* PROFILE HEADER (Modern – Not Boxy) */}
                              <div className="flex items-center gap-5 pb-6 border-b">
                                {/* Avatar */}
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 
                                            flex items-center justify-center text-white text-3xl font-bold shadow-md">
                                  {selectedAlumni.name.split(' ').map(n => n[0]).join('')}
                                </div>

                                {/* Basic Info */}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h2 className="text-2xl font-bold text-gray-800">{selectedAlumni.name}</h2>
                                    {selectedAlumni.isVerified && (
                                      <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                                        ✅ Verified
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-gray-500 font-medium">{selectedAlumni.careerTimeline[selectedAlumni.careerTimeline.length - 1]?.role} @ {selectedAlumni.company}</p>
                                  <p className="text-sm text-gray-400 mt-1">{selectedAlumni.location} • {selectedAlumni.department} • Passed Out {selectedAlumni.batch}</p>
                                </div>
                              </div>

                              {/* PROFILE INFO "CHIPS" ROW */}
                              <div className="flex flex-wrap gap-3">
                                <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
                                  🧠 {selectedAlumni.experience} yrs Experience
                                </span>
                                <span className="px-4 py-1.5 rounded-full bg-purple-50 text-purple-700 text-sm font-semibold">
                                  🎂 {selectedAlumni.age} Years
                                </span>
                                <span className="px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-semibold">
                                  🏢 {selectedAlumni.company}
                                </span>
                                <span className="px-4 py-1.5 rounded-full bg-orange-50 text-orange-700 text-sm font-semibold">
                                  🎓 {selectedAlumni.department}
                                </span>
                              </div>

                              {/* CAREER TIMELINE (HORIZONTAL – Attractive ✅) */}
                              <div className="mt-8">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Career Timeline</h3>

                                <div className="flex gap-8 overflow-x-auto pb-4">
                                  {selectedAlumni.careerTimeline.map((job, index) => (
                                    <div 
                                      key={index} 
                                      className={`min-w-[180px] rounded-xl shadow-sm p-4 border transition ${
                                        index === selectedAlumni.careerTimeline.length - 1 
                                          ? 'bg-indigo-50 border-indigo-200' 
                                          : 'bg-white hover:shadow-md'
                                      }`}
                                    >
                                      <p className={`text-sm ${
                                        index === selectedAlumni.careerTimeline.length - 1 
                                          ? 'text-indigo-500' 
                                          : 'text-gray-400'
                                      }`}>
                                        {job.year}
                                      </p>
                                      <h4 className={`font-bold ${
                                        index === selectedAlumni.careerTimeline.length - 1 
                                          ? 'text-indigo-800' 
                                          : 'text-gray-800'
                                      }`}>
                                        {job.role}
                                      </h4>
                                      <p className={`text-sm ${
                                        index === selectedAlumni.careerTimeline.length - 1 
                                          ? 'text-indigo-600' 
                                          : 'text-gray-500'
                                      }`}>
                                        {job.company}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* SOCIAL ICONS (END OF PROFILE) */}
                              <div className="flex justify-center gap-6 mt-10">
                                {selectedAlumni.github && (
                                  <a 
                                    href={selectedAlumni.github} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-black transition text-2xl"
                                  >
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                  </a>
                                )}
                                {selectedAlumni.linkedin && (
                                  <a 
                                    href={selectedAlumni.linkedin} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-blue-600 transition text-2xl"
                                  >
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                    </svg>
                                  </a>
                                )}
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="insights"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.2 }}
                              className="space-y-6"
                            >
                              {/* Impact Score Card - Enhanced */}
                              <div className="impact-card bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-2xl">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h2 className="text-4xl font-bold text-gray-800">{calculateImpactScore(selectedAlumni)}</h2>
                                    <p className="text-gray-600 mt-1">Impact Score</p>
                                  </div>
                                  <span className="high bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                                    {calculateImpactScore(selectedAlumni) > 100 ? 'High' : calculateImpactScore(selectedAlumni) > 50 ? 'Medium' : 'Low'}
                                  </span>
                                </div>
                              </div>

                              {/* Key Metrics Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-blue-50 rounded-xl p-4 text-center">
                                  <p className="text-2xl font-bold text-blue-600">{selectedAlumni.mentorshipSessions}</p>
                                  <p className="text-gray-700 text-sm">Mentorship Sessions</p>
                                </div>
                                <div className="bg-green-50 rounded-xl p-4 text-center">
                                  <p className="text-2xl font-bold text-green-600">{selectedAlumni.studentsConnected}</p>
                                  <p className="text-gray-700 text-sm">Students Guided</p>
                                </div>
                                <div className="bg-purple-50 rounded-xl p-4 text-center">
                                  <p className="text-2xl font-bold text-purple-600">{selectedAlumni.avgTimeSpent} hrs</p>
                                  <p className="text-gray-700 text-sm">Avg Time Spent</p>
                                </div>
                              </div>

                              {/* Working Activity Graph */}
                              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-4">Mentorship Activity - Last 7 Days</h3>
                                <div className="h-64">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={selectedAlumni.mentorshipData}>
                                      <XAxis dataKey="day" />
                                      <YAxis />
                                      <Tooltip 
                                        contentStyle={{ 
                                          backgroundColor: 'white', 
                                          border: '1px solid #e5e7eb', 
                                          borderRadius: '0.5rem' 
                                        }}
                                      />
                                      <Line
                                        type="monotone"
                                        dataKey="sessions"
                                        stroke="#6366f1"
                                        strokeWidth={3}
                                        dot={{ r: 5, fill: '#6366f1' }}
                                        activeDot={{ r: 8, fill: '#4f46e5' }}
                                      />
                                    </LineChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>

                              {/* Contribution Highlights */}
                              <div className="highlights grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  🏆 Peak Day: <b>{getContributionHighlights(selectedAlumni).peakDay}</b>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  🚀 Growth: <b>{getContributionHighlights(selectedAlumni).growth}</b>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  ⚡ Consistency: <b>{getContributionHighlights(selectedAlumni).consistency}</b>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm transition-transform hover:scale-105"
                    onClick={closePanel}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style jsx>{`
        /* Top Filters Styles */
        .alumni-filters {
          background: #fff;
          padding: 16px;
          border-radius: 14px;
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          box-shadow: 0 8px 24px rgba(0,0,0,0.04);
        }

        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f9fafb;
          padding: 10px 14px;
          border-radius: 10px;
        }

        .search-box input {
          border: none;
          outline: none;
          width: 100%;
          background: transparent;
        }

        .filters select,
        .export-btn,
        .bulk-btn {
          padding: 9px 14px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          background: white;
        }

        .bulk-btn {
          background: #6366f1;
          color: white;
          border: none;
        }

        /* Premium Alumni Table Styles */
        .alumni-list {
          padding: 24px;
        }

        /* Column Header */
        .alumni-header {
          display: grid;
          grid-template-columns: 60px 1.5fr 1.5fr 1.2fr 0.8fr 0.8fr 1.2fr 1fr 0.8fr;
          padding: 10px 20px;
          font-size: 12px;
          font-weight: 700;
          color: #6b7280;
          text-transform: uppercase;
        }

        /* Alumni Row Card */
        .alumni-row {
          display: grid;
          grid-template-columns: 60px 1.5fr 1.5fr 1.2fr 0.8fr 0.8fr 1.2fr 1fr 0.8fr;
          align-items: center;
          background: #ffffff;
          padding: 16px 20px;
          margin-bottom: 14px;
          border-radius: 14px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.06);
          transition: all 0.25s ease;
          cursor: pointer;
        }

        /* Hover Effect (Premium Feel) */
        .alumni-row:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 30px rgba(99,102,241,0.22);
        }

        /* Avatar Upgrade */
        .avatar-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #22c55e);
          color: #fff;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Column Text Styling */
        .col {
          font-size: 14px;
          font-weight: 500;
          color: #111827;
        }

        .col.name {
          font-weight: 700;
        }

        .col.role {
          color: #4b5563;
        }

        .col.company {
          font-weight: 600;
          color: #1f2933;
        }

        .col.dept,
        .col.batch,
        .col.location {
          color: #374151;
          font-weight: 500;
        }

        /* Status Pills (Much Better) */
        .col.status {
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          text-align: center;
          width: fit-content;
        }

        .status.active {
          background: #dcfce7;
          color: #15803d;
        }

        .status.inactive {
          background: #fef9c3;
          color: #854d0e;
        }

        .status.suspended {
          background: #fee2e2;
          color: #b91c1c;
        }

        /* Action Button (Cleaner) */
        .view-btn {
          background: #eef2ff;
          color: #4f46e5;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .view-btn:hover {
          background: #4f46e5;
          color: white;
        }

        /* Profile Modal Styles */
        .profile-title {
          font-size: 22px;
          font-weight: 600;
        }

        .profile-sub {
          color: #6b7280;
          font-size: 14px;
        }

        .profile-badge {
          background: #eef2ff;
          color: #4338ca;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
        }

        /* Insights Page Styles */
        .impact-card {
          background: linear-gradient(135deg,#e0f2fe,#ecfdf5);
          padding: 22px;
          border-radius: 16px;
          margin-bottom: 16px;
        }

        .impact-card h2 {
          font-size: 36px;
        }

        .high {
          background: #22c55e;
          color: white;
        }

        /* Micro-interactions */
        button:hover {
          transform: scale(1.03);
        }

        .highlights {
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          font-size: 14px;
          color: #374151;
        }
      `}</style>
    </div>
  );
};

export default AlumniManagementPage;