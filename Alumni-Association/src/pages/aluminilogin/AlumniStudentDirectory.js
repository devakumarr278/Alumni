import React, { useState, useContext } from 'react';
import { useAuth } from '../../context/AuthContext';
import { connectWithStudent } from '../../services/connectionService';

const AlumniStudentDirectory = () => {
  const { user } = useAuth();
  // Mock student data with connection status
  const [students, setStudents] = useState([
    {
      id: 1,
      initials: 'AJ',
      name: 'Alex Johnson',
      major: 'Computer Science',
      graduationYear: '2024',
      skills: ['Machine Learning', 'Python', 'Data Analysis'],
      careerGoal: 'AI Research',
      avatarColor: 'from-blue-500 to-indigo-500',
      connected: false,
      connectionRequested: false
    },
    {
      id: 2,
      initials: 'MG',
      name: 'Maria Garcia',
      major: 'Data Science',
      graduationYear: '2025',
      skills: ['R', 'Statistics', 'Data Visualization'],
      careerGoal: 'Data Scientist',
      avatarColor: 'from-green-500 to-teal-500',
      connected: true,
      connectionRequested: false
    },
    {
      id: 3,
      initials: 'TR',
      name: 'Thomas Reed',
      major: 'Mechanical Engineering',
      graduationYear: '2023',
      skills: ['CAD', 'Manufacturing', 'Project Management'],
      careerGoal: 'Product Development',
      avatarColor: 'from-orange-500 to-amber-500',
      connected: false,
      connectionRequested: true
    },
    {
      id: 4,
      initials: 'SL',
      name: 'Sophia Lee',
      major: 'Business Administration',
      graduationYear: '2024',
      skills: ['Marketing', 'Finance', 'Leadership'],
      careerGoal: 'Entrepreneur',
      avatarColor: 'from-purple-500 to-pink-500',
      connected: false,
      connectionRequested: false
    },
    {
      id: 5,
      initials: 'KP',
      name: 'Kwame Patel',
      major: 'Electrical Engineering',
      graduationYear: '2025',
      skills: ['Circuits', 'Embedded Systems', 'IoT'],
      careerGoal: 'Hardware Engineer',
      avatarColor: 'from-cyan-500 to-blue-500',
      connected: false,
      connectionRequested: false
    },
    {
      id: 6,
      initials: 'EW',
      name: 'Emma Wilson',
      major: 'Psychology',
      graduationYear: '2023',
      skills: ['Research', 'Statistics', 'User Experience'],
      careerGoal: 'UX Researcher',
      avatarColor: 'from-pink-500 to-rose-500',
      connected: false,
      connectionRequested: false
    }
  ]);

  // Function to handle connecting with a student
  const handleConnect = async (studentId) => {
    try {
      // Call the connection service
      const result = await connectWithStudent(studentId);
      
      if (result.success) {
        // Update the student's connection status
        setStudents(prevStudents => 
          prevStudents.map(student => 
            student.id === studentId 
              ? { ...student, connectionRequested: true } 
              : student
          )
        );
        
        // Show success message (in a real app, you might use a toast notification)
        console.log('Connection request sent successfully');
      } else {
        // Handle error (in a real app, you might show an error message to the user)
        console.error('Error connecting with student:', result.error);
      }
    } catch (error) {
      console.error('Error connecting with student:', error);
      // In a real implementation, you would show an error message to the user
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Directory</h1>
          <p className="text-gray-600">Connect with talented students in your field of interest</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search students by name, major, or skills..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <select className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>All Majors</option>
                <option>Computer Science</option>
                <option>Data Science</option>
                <option>Engineering</option>
                <option>Business</option>
              </select>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:shadow-md transition-all">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div 
              key={student.id}
              className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1"
            >
              {/* Student Header */}
              <div className="flex items-start mb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${student.avatarColor} flex items-center justify-center text-white font-bold text-xl shadow-md`}>
                  {student.initials}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-bold text-lg text-gray-900">{student.name}</h3>
                  <p className="text-gray-600">{student.major}, {student.graduationYear}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      Active
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Open to Mentorship
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="mb-5">
                <h4 className="font-semibold text-gray-800 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {student.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Career Goal */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">Career Goal</h4>
                <p className="text-gray-700 bg-purple-50 p-3 rounded-lg">
                  {student.careerGoal}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {student.connected ? (
                  <button className="flex-1 bg-green-500 text-white py-3 rounded-xl hover:shadow-md transition-all font-medium">
                    Connected
                  </button>
                ) : student.connectionRequested ? (
                  <button className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-medium cursor-not-allowed">
                    Request Sent
                  </button>
                ) : (
                  <button 
                    className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-xl hover:shadow-md transition-all font-medium"
                    onClick={() => handleConnect(student.id)}
                  >
                    Connect
                  </button>
                )}
                <button className="flex-1 border-2 border-purple-500 text-purple-600 py-3 rounded-xl hover:bg-purple-50 transition-all font-medium">
                  Message
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-500">
                <span>Last active: 2 hours ago</span>
                <span>Matches: 85%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-4 py-2 rounded-lg bg-purple-500 text-white">1</button>
            <button className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">2</button>
            <button className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">3</button>
            <button className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniStudentDirectory;