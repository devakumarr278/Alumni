import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import api from '../../utils/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [analyticsData, setAnalyticsData] = useState({
    totalAlumni: 0,
    activeUsers: 0,
    eventsThisYear: 0,
    jobPlacements: 0,
    engagementRate: 0,
    monthlyGrowth: 0
  });
  const [departmentData, setDepartmentData] = useState([]);
  const [batchData, setBatchData] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch overall analytics
      const overallResponse = await api.get(`/institution/analytics/overall?timeRange=${timeRange}`);
      
      if (overallResponse.data.success) {
        setAnalyticsData(overallResponse.data.data);
      }
      
      // Fetch mentorship summary for department and batch data
      const mentorshipResponse = await api.get(`/institution/analytics/mentorship-summary?timeRange=${timeRange}`);
      
      if (mentorshipResponse.data.success) {
        setDepartmentData(mentorshipResponse.data.data.departmentData || []);
        setBatchData(mentorshipResponse.data.data.batchData || []);
        setMonthlyTrend(mentorshipResponse.data.data.monthlyTrend || []);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      // Fallback to mock data if API fails
      setAnalyticsData({
        totalAlumni: 1285,
        activeUsers: 420,
        eventsThisYear: 12,
        jobPlacements: 87,
        engagementRate: 72,
        monthlyGrowth: 15
      });
      
      setDepartmentData([
        { _id: 'Computer Science', sessions: 120, mentors: 25 },
        { _id: 'Business Administration', sessions: 95, mentors: 20 },
        { _id: 'Engineering', sessions: 85, mentors: 18 },
        { _id: 'Medicine', sessions: 70, mentors: 15 },
        { _id: 'Law', sessions: 60, mentors: 12 }
      ]);
      
      setBatchData([
        { _id: 2023, sessions: 150, mentors: 30 },
        { _id: 2022, sessions: 135, mentors: 28 },
        { _id: 2021, sessions: 120, mentors: 25 },
        { _id: 2020, sessions: 110, mentors: 22 },
        { _id: 2019, sessions: 95, mentors: 20 }
      ]);
      
      setMonthlyTrend([
        { month: 'Jan', sessions: 45, mentors: 30 },
        { month: 'Feb', sessions: 52, mentors: 32 },
        { month: 'Mar', sessions: 48, mentors: 31 },
        { month: 'Apr', sessions: 60, mentors: 35 },
        { month: 'May', sessions: 55, mentors: 33 },
        { month: 'Jun', sessions: 65, mentors: 38 }
      ]);
    }
  };

  // KPI Cards Data
  const kpiData = [
    {
      title: 'Total Alumni',
      value: analyticsData.totalAlumni,
      change: `+${analyticsData.monthlyGrowth}%`,
      icon: '👥',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Active Users',
      value: analyticsData.activeUsers,
      change: `${analyticsData.engagementRate}%`,
      icon: '📈',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Events This Year',
      value: analyticsData.eventsThisYear,
      change: '+3',
      icon: '📅',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Job Placements',
      value: analyticsData.jobPlacements,
      change: '+12%',
      icon: '💼',
      color: 'bg-amber-100 text-amber-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-indigo-50 to-purple-50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-indigo-100"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
            <p className="text-gray-700 mt-1">Comprehensive insights into your alumni community</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <Button
                variant="outline"
                onClick={() => setTimeRange('weekly')}
                className={`${
                  timeRange === 'weekly'
                    ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
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
                    ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                } rounded-none`}
              >
                Monthly
              </Button>
              <Button
                variant="outline"
                onClick={() => setTimeRange('quarterly')}
                className={`${
                  timeRange === 'quarterly'
                    ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                } rounded-none`}
              >
                Quarterly
              </Button>
              <Button
                variant="outline"
                onClick={() => setTimeRange('yearly')}
                className={`${
                  timeRange === 'yearly'
                    ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                } rounded-l-none`}
              >
                Yearly
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50 h-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{kpi.value.toLocaleString()}</p>
                </div>
                <div className={`p-3 rounded-lg ${kpi.color}`}>
                  <span className="text-xl">{kpi.icon}</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {kpi.change}
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="mentors" name="Mentors" fill="#8884d8" />
                <Bar dataKey="sessions" name="Sessions" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Batch/Graduation Year Distribution */}
        <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Batch Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={batchData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="mentors"
                  nameKey="_id"
                  label={({ _id, mentors }) => `${_id}: ${mentors}`}
                >
                  {batchData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Monthly Trend */}
        <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Activity Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="sessions" name="Sessions" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                <Line type="monotone" dataKey="mentors" name="Active Mentors" stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Additional Insights */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 backdrop-blur-lg border border-indigo-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Community Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <i className="fas fa-user-graduate text-blue-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Avg. Alumni Age</p>
                <p className="text-lg font-bold text-gray-800">32 years</p>
              </div>
            </div>
          </div>
          <div className="bg-white/50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <i className="fas fa-map-marker-alt text-green-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Countries Represented</p>
                <p className="text-lg font-bold text-gray-800">24</p>
              </div>
            </div>
          </div>
          <div className="bg-white/50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <i className="fas fa-building text-purple-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Top Employers</p>
                <p className="text-lg font-bold text-gray-800">15 companies</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;