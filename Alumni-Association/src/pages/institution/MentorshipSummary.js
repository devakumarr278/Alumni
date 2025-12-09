import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import api from '../../utils/api';

const MentorshipSummary = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [mentorshipData, setMentorshipData] = useState({
    totalSessions: 0,
    activeMentors: 0,
    avgSessionDuration: 0,
    departmentData: [],
    batchData: [],
    monthlyTrend: []
  });


  const fetchMentorshipData = useCallback(async () => {
    try {
      const response = await api.getMentorshipSummary(timeRange);
      
      if (response.success) {
        setMentorshipData(response.data);
      }
    } catch (error) {
      console.error('Error fetching mentorship data:', error);
      // Fallback to mock data if API fails
      const mockData = {
        totalSessions: 245,
        activeMentors: 32,
        avgSessionDuration: 45, // minutes
        departmentData: [
          { name: 'Computer Science', sessions: 85, mentors: 12 },
          { name: 'Business', sessions: 62, mentors: 8 },
          { name: 'Engineering', sessions: 58, mentors: 7 },
          { name: 'Arts', sessions: 25, mentors: 3 },
          { name: 'Medicine', sessions: 15, mentors: 2 }
        ],
        batchData: [
          { batch: 2020, sessions: 78, mentors: 10 },
          { batch: 2019, sessions: 65, mentors: 9 },
          { batch: 2018, sessions: 52, mentors: 8 },
          { batch: 2017, sessions: 35, mentors: 5 },
          { batch: 2016, sessions: 15, mentors: 0 }
        ],
        monthlyTrend: [
          { month: 'Jan', sessions: 15, mentors: 8 },
          { month: 'Feb', sessions: 22, mentors: 10 },
          { month: 'Mar', sessions: 25, mentors: 12 },
          { month: 'Apr', sessions: 22, mentors: 11 },
          { month: 'May', sessions: 30, mentors: 15 },
          { month: 'Jun', sessions: 28, mentors: 14 }
        ]
      };
      
      setMentorshipData(mockData);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchMentorshipData();
  }, [fetchMentorshipData]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-purple-50 to-indigo-50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-purple-100"
      >
        <h1 className="text-2xl font-bold text-gray-800">Mentorship Summary</h1>
        <p className="text-gray-700 mt-1">Overview of alumni mentorship activities and engagement</p>
      </motion.div>

      {/* Time Range Filter */}
      <div className="flex justify-end">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <Button
            variant="outline"
            onClick={() => setTimeRange('weekly')}
            className={`${
              timeRange === 'weekly'
                ? 'bg-purple-100 text-purple-800 border-purple-200'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            } rounded-r-none`}
          >
            Weekly
          </Button>
          <Button
            variant="outline"
            onClick={() => setTimeRange('monthly')}
            className={`${
              timeRange === 'monthly'
                ? 'bg-purple-100 text-purple-800 border-purple-200'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            } rounded-none`}
          >
            Monthly
          </Button>
          <Button
            variant="outline"
            onClick={() => setTimeRange('yearly')}
            className={`${
              timeRange === 'yearly'
                ? 'bg-purple-100 text-purple-800 border-purple-200'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            } rounded-l-none`}
          >
            Yearly
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-lg border border-blue-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <i className="fas fa-handshake text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-700">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-800">{mentorshipData.totalSessions}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-teal-50 backdrop-blur-lg border border-green-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <i className="fas fa-chalkboard-teacher text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-700">Active Mentors</p>
              <p className="text-2xl font-bold text-gray-800">{mentorshipData.activeMentors}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 backdrop-blur-lg border border-purple-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
              <i className="fas fa-clock text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-700">Avg. Duration</p>
              <p className="text-2xl font-bold text-gray-800">{mentorshipData.avgSessionDuration} min</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sessions by Department - Bar Chart */}
        <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Mentorship Sessions by Department</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mentorshipData.departmentData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(10px)',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.5)'
                  }} 
                />
                <Legend />
                <Bar 
                  dataKey="sessions" 
                  fill="#8b5cf6" 
                  name="Sessions"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Active Mentors by Batch - Line Chart */}
        <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Mentors by Graduation Batch</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mentorshipData.batchData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="batch" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(10px)',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.5)'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="mentors" 
                  stroke="#3b82f6" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                  name="Active Mentors"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Session Distribution - Pie Chart */}
        <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Session Distribution by Department</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mentorshipData.departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="sessions"
                  nameKey="name"
                >
                  {mentorshipData.departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(10px)',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.5)'
                  }} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Monthly Trend - Area Chart */}
        <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Mentorship Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mentorshipData.monthlyTrend}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(10px)',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.5)'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sessions" 
                  stroke="#8b5cf6" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                  name="Sessions"
                  fillOpacity={1}
                  fill="url(#colorSessions)"
                />
                <defs>
                  <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 backdrop-blur-lg border border-indigo-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Mentorship Details</h3>
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            <i className="fas fa-download mr-2"></i>Export Report
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Sessions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Active Mentors</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Avg. Sessions/Mentor</th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-200">
              {mentorshipData.departmentData.map((dept, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{dept.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{dept.sessions}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{dept.mentors}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {dept.mentors > 0 ? (dept.sessions / dept.mentors).toFixed(1) : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default MentorshipSummary;