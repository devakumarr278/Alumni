import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const StudentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    academic: true,
    contact: true,
    engagement: true,
    tags: true
  });

  // State for active tab in student detail panel
  const [activeTab, setActiveTab] = useState('profile');

  // Mock data - in a real app, this would come from an API
  const mockStudentsData = [
    {
      id: 1,
      name: 'Arun Kumar',
      registerNumber: '22CSE045',
      email: 'arun.kumar@student.college.edu',
      college: 'SSN College of Engineering',
      department: 'CSE',
      currentYear: 3,
      batch: '2022-2026',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      status: 'Active',
      mentorshipRequested: true,
      mentorAssigned: 'Dr. Smith',
      eventsParticipated: 5,
      lastActive: '2025-12-05',
      tags: ['Class Representative', 'Placement Ready']
    },
    {
      id: 2,
      name: 'Priya Sharma',
      registerNumber: '23ECE012',
      email: 'priya.sharma@student.college.edu',
      college: 'SSN College of Engineering',
      department: 'ECE',
      currentYear: 2,
      batch: '2023-2027',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      status: 'Active',
      mentorshipRequested: false,
      mentorAssigned: '',
      eventsParticipated: 3,
      lastActive: '2025-12-01',
      tags: ['Volunteer']
    },
    {
      id: 3,
      name: 'Rahul Menon',
      registerNumber: '21ME078',
      email: 'rahul.menon@student.college.edu',
      college: 'SSN College of Engineering',
      department: 'ME',
      currentYear: 4,
      batch: '2021-2025',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      country: 'India',
      status: 'Graduating',
      mentorshipRequested: true,
      mentorAssigned: 'Prof. Johnson',
      eventsParticipated: 8,
      lastActive: '2025-12-06',
      tags: ['Class Representative']
    },
    {
      id: 4,
      name: 'Anjali Patel',
      registerNumber: '23CSE033',
      email: 'anjali.patel@student.college.edu',
      college: 'SSN College of Engineering',
      department: 'CSE',
      currentYear: 1,
      batch: '2023-2027',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      status: 'Active',
      mentorshipRequested: false,
      mentorAssigned: '',
      eventsParticipated: 1,
      lastActive: '2025-11-28',
      tags: []
    }
  ];

  // Load mock data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setStudentsData(mockStudentsData);
      setLoading(false);
    };
    
    loadData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleStudentSelection = (id) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter(studentId => studentId !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };

  const selectAllStudents = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map(student => student.id));
    }
  };

  const openPanel = (student) => {
    setSelectedStudent(student);
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setSelectedStudent(null);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Graduating':
        return 'bg-amber-100 text-amber-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTagClass = (tag) => {
    switch (tag) {
      case 'Class Representative':
        return 'bg-blue-100 text-blue-800';
      case 'Placement Ready':
        return 'bg-purple-100 text-purple-800';
      case 'Volunteer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleConvertToAlumni = () => {
    if (selectedStudent && selectedStudent.currentYear === 4) {
      alert(`Converting ${selectedStudent.name} to alumni...\nThis would prefilled alumni registration data and move to Alumni Verification.`);
    }
  };

  // Filter students based on search and filters
  const filteredStudents = studentsData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.registerNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !departmentFilter || student.department === departmentFilter;
    const matchesYear = !yearFilter || student.currentYear.toString() === yearFilter;
    const matchesStatus = !statusFilter || student.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesYear && matchesStatus;
  });

  // Get unique values for filters
  const departments = [...new Set(studentsData.map(s => s.department))];
  const years = [...new Set(studentsData.map(s => s.currentYear))];
  const statuses = [...new Set(studentsData.map(s => s.status))];

  // Get initials for avatar
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
        <p className="text-gray-600">Manage student profiles and administrative actions</p>
      </div>

      {/* Top Controls - Aligned properly */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search by name or register number..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="">Department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="">Year</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          
          <div className="flex gap-2 ml-auto">
            <button className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
              Export CSV
            </button>
            <button className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Bulk Message
            </button>
          </div>
        </div>
        
        {/* View Toggle */}
        <div className="flex justify-end mt-4">
          <div className="inline-flex rounded-lg border border-gray-300">
            <button
              className={`px-4 py-2 text-sm rounded-l-lg transition-colors ${
                viewMode === 'table' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setViewMode('table')}
            >
              Table View
            </button>
            <button
              className={`px-4 py-2 text-sm rounded-r-lg transition-colors ${
                viewMode === 'cards' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setViewMode('cards')}
            >
              Card View
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

      {/* Table View - Updated to match Alumni Management styling */}
      {!loading && viewMode === 'table' && (
        <div className="alumni-list">
          <div className="overflow-x-auto">
            <table className="alumni-table min-w-full">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>College</th>
                  <th>Batch</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-12 text-gray-500">
                      No students found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr 
                      key={student.id} 
                      className="cursor-pointer"
                      onClick={() => openPanel(student)}
                    >
                      <td>
                        <div className="avatar">
                          {getInitials(student.name)}
                        </div>
                      </td>
                      <td className="alumni-name">
                        {student.name}
                      </td>
                      <td>{student.department}</td>
                      <td>{student.college}</td>
                      <td>{student.batch}</td>
                      <td>{student.city}, {student.state}</td>
                      <td>
                        <span className={`status ${student.status.toLowerCase()}`}>
                          {student.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="view-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            openPanel(student);
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Card View */}
      {!loading && viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500">No students found matching your criteria</div>
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div 
                key={student.id} 
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => openPanel(student)}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {getInitials(student.name)}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-500">{student.department} • {student.currentYear}rd Year</p>
                        <p className="text-sm text-gray-500">Reg: {student.registerNumber}</p>
                      </div>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(student.status)}`}>
                        {student.status}
                      </span>
                    </div>
                    {student.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {student.tags.map(tag => (
                          <span key={tag} className={`px-2 py-1 text-xs rounded-full ${getTagClass(tag)}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button 
                    className="text-blue-600 hover:text-blue-900 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      openPanel(student);
                    }}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Student Detail Panel - NEW ATTRACTIVE PROFILE PAGE UI */}
      {isPanelOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closePanel}></div>
            
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    {/* NEW ATTRACTIVE PROFILE PAGE UI */}
                    <div className="p-6">
                      {/* Top Section */}
                      <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 p-6 shadow-sm mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white 
                                          flex items-center justify-center text-2xl font-bold shadow-md">
                            {getInitials(selectedStudent.name)}
                          </div>

                          <div>
                            <h2 className="text-xl font-bold text-gray-800">{selectedStudent.name}</h2>
                            <p className="text-gray-600">
                              {selectedStudent.department} • {selectedStudent.currentYear}{selectedStudent.currentYear === 1 ? 'st' : selectedStudent.currentYear === 2 ? 'nd' : selectedStudent.currentYear === 3 ? 'rd' : 'th'} Year • {selectedStudent.college}
                            </p>
                          </div>
                        </div>

                        <span className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm ${
                          selectedStudent.status === "Active" 
                            ? "bg-green-100 text-green-700"
                            : selectedStudent.status === "Graduating"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                        }`}>
                          {selectedStudent.status}
                        </span>
                      </div>

                      {/* Tabs */}
                      <div className="border-b flex gap-6 text-sm mb-6">
                        <button 
                          className={`pb-2 border-b-2 font-medium ${
                            activeTab === 'profile'
                              ? 'border-indigo-500 text-indigo-600'
                              : 'border-transparent text-gray-500 hover:text-indigo-600 transition'
                          }`}
                          onClick={() => setActiveTab('profile')}
                        >
                          Profile
                        </button>
                        <button 
                          className={`pb-2 font-medium ${
                            activeTab === 'insights'
                              ? 'border-indigo-500 text-indigo-600'
                              : 'border-transparent text-gray-500 hover:text-indigo-600 transition'
                          }`}
                          onClick={() => setActiveTab('insights')}
                        >
                          Insights
                        </button>
                      </div>

                      {/* Academic Details */}
                      <div className="rounded-2xl bg-white p-6 shadow-sm mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Information</h3>

                        <div className="grid grid-cols-2 gap-y-4">
                          <div>
                            <p className="text-gray-500 text-sm">Department</p>
                            <p className="font-medium text-gray-800">{selectedStudent.department}</p>
                          </div>

                          <div>
                            <p className="text-gray-500 text-sm">Year of Study</p>
                            <p className="font-medium text-gray-800">{selectedStudent.currentYear}{selectedStudent.currentYear === 1 ? 'st' : selectedStudent.currentYear === 2 ? 'nd' : selectedStudent.currentYear === 3 ? 'rd' : 'th'} Year</p>
                          </div>

                          <div>
                            <p className="text-gray-500 text-sm">Register Number</p>
                            <p className="font-medium text-gray-800">{selectedStudent.registerNumber}</p>
                          </div>

                          <div>
                            <p className="text-gray-500 text-sm">College</p>
                            <p className="font-medium text-gray-800">{selectedStudent.college}</p>
                          </div>
                        </div>
                      </div>

                      {/* Skills Section */}
                      <div className="rounded-2xl bg-white p-6 shadow-sm mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills & Mentorship</h3>

                        <div className="mb-4">
                          <p className="text-gray-500 text-sm mb-2">Skills</p>
                          <div className="flex flex-wrap gap-3">
                            {["React", "Node.js", "Java", "Cloud Computing", "DevOps"].map((skill, idx) => (
                              <span 
                                key={idx} 
                                className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm shadow-sm hover:bg-indigo-100 transition"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mt-4">
                          <div>
                            <p className="text-gray-500 text-sm">Total Mentorship</p>
                            <p className="text-gray-800 font-medium">
                              {selectedStudent.mentorshipRequested ? '18 Sessions' : '0 Sessions'}
                            </p>
                          </div>

                          <div>
                            <p className="text-gray-500 text-sm">Avg Time Spent</p>
                            <p className="text-gray-800 font-medium">
                              {selectedStudent.mentorshipRequested ? '1.6 hrs / week' : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Footer Icons */}
                      <div className="flex justify-end gap-4 mt-4">
                        <a href="#" target="_blank" className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-blue-600">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                        </a>

                        <a href="#" target="_blank" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-gray-800">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                        </a>
                      </div>

                      {/* Close Button */}
                      <button 
                        onClick={closePanel} 
                        className="mt-6 w-full py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add CSS styles for alumni-like table structure
const alumniTableStyles = `
  /* ===== TABLE WRAPPER ===== */
  .alumni-list {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    padding: 16px 0;
  }
  
  .alumni-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 14px; /* space between rows */
  }

  /* ===== TABLE HEADER ===== */
  .alumni-table thead th {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    color: #6b7280;
    padding: 12px 16px;
    text-align: left;
  }

  /* ===== ROW CARD STYLE ===== */
  .alumni-table tbody tr {
    background: #ffffff;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
    border-radius: 14px;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    cursor: pointer;
  }

  /* Hover lift */
  .alumni-table tbody tr:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 26px rgba(99, 102, 241, 0.18);
  }

  /* ===== CELLS ===== */
  .alumni-table tbody td {
    padding: 16px 18px;
    font-size: 14px;
    color: #1f2937;
  }

  /* Rounded row corners */
  .alumni-table tbody tr td:first-child {
    border-top-left-radius: 14px;
    border-bottom-left-radius: 14px;
  }

  .alumni-table tbody tr td:last-child {
    border-top-right-radius: 14px;
    border-bottom-right-radius: 14px;
  }

  /* ===== AVATAR ===== */
  .avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #22c55e);
    color: white;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  }

  /* ===== NAME ===== */
  .alumni-name {
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* ===== STATUS PILLS ===== */
  .status {
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 600;
    border-radius: 999px;
    display: inline-block;
  }

  .status.active {
    background: #dcfce7;
    color: #15803d;
  }

  .status.graduating {
    background: #fef9c3;
    color: #92400e;
  }

  .status.inactive {
    background: #fee2e2;
    color: #b91c1c;
  }

  /* ===== VIEW BUTTON ===== */
  .view-btn {
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: white;
    border: none;
    padding: 8px 16px;
    font-size: 13px;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.25s ease, transform 0.2s ease;
  }

  .view-btn:hover {
    transform: translateY(-1px);
    background: linear-gradient(135deg, #4f46e5, #4338ca);
  }
`;

// Inject styles into the document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = alumniTableStyles;
  document.head.appendChild(styleElement);
}

export default StudentManagement;