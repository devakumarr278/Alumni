import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('monthly');

  // Mock analytics data
  const analyticsData = {
    totalAlumni: 2842,
    activeUsers: 1204,
    eventsThisYear: 42,
    jobPlacements: 327,
    engagementRate: 85,
    monthlyGrowth: 12
  };

  // Chart data for alumni registration trend
  const alumniRegistrationData = [
    { month: 'Jan', count: 120 },
    { month: 'Feb', count: 180 },
    { month: 'Mar', count: 150 },
    { month: 'Apr', count: 220 },
    { month: 'May', count: 190 },
    { month: 'Jun', count: 250 },
    { month: 'Jul', count: 210 },
    { month: 'Aug', count: 280 },
    { month: 'Sep', count: 240 },
    { month: 'Oct', count: 310 },
    { month: 'Nov', count: 270 },
    { month: 'Dec', count: 350 }
  ];

  // Chart data for events
  const eventsData = [
    { month: 'Jan', count: 3 },
    { month: 'Feb', count: 4 },
    { month: 'Mar', count: 2 },
    { month: 'Apr', count: 5 },
    { month: 'May', count: 3 },
    { month: 'Jun', count: 6 },
    { month: 'Jul', count: 4 },
    { month: 'Aug', count: 7 },
    { month: 'Sep', count: 5 },
    { month: 'Oct', count: 8 },
    { month: 'Nov', count: 6 },
    { month: 'Dec', count: 9 }
  ];

  // Department distribution data
  const departmentData = [
    { name: 'Computer Science', value: 420 },
    { name: 'Business', value: 380 },
    { name: 'Engineering', value: 350 },
    { name: 'Arts', value: 280 },
    { name: 'Medicine', value: 220 },
    { name: 'Law', value: 180 },
    { name: 'Science', value: 310 },
    { name: 'Education', value: 160 }
  ];

  // Job placement by sector data
  const jobPlacementData = [
    { name: 'Technology', value: 120 },
    { name: 'Finance', value: 85 },
    { name: 'Healthcare', value: 65 },
    { name: 'Education', value: 45 },
    { name: 'Government', value: 35 },
    { name: 'Entrepreneurship', value: 50 },
    { name: 'Other', value: 27 }
  ];

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4'];
  const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-green-50 to-teal-50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-green-100"
      >
        <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
        <p className="text-gray-700 mt-1">Detailed insights and metrics for your alumni network</p>
      </motion.div>

      {/* Time Range Filter */}
      <div className="flex justify-end">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <Button
            variant="outline"
            onClick={() => setTimeRange('weekly')}
            className={`${
              timeRange === 'weekly'
                ? 'bg-green-100 text-green-800 border-green-200'
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
                ? 'bg-green-100 text-green-800 border-green-200'
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
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            } rounded-l-none`}
          >
            Yearly
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-lg border border-blue-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <i className="fas fa-users text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-700">Total Alumni</p>
              <p className="text-2xl font-bold text-gray-800">{analyticsData.totalAlumni.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-teal-50 backdrop-blur-lg border border-green-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <i className="fas fa-user-check text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-700">Active Users</p>
              <p className="text-2xl font-bold text-gray-800">{analyticsData.activeUsers.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 backdrop-blur-lg border border-purple-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
              <i className="fas fa-calendar-alt text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-700">Events This Year</p>
              <p className="text-2xl font-bold text-gray-800">{analyticsData.eventsThisYear}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 backdrop-blur-lg border border-yellow-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
              <i className="fas fa-briefcase text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-700">Job Placements</p>
              <p className="text-2xl font-bold text-gray-800">{analyticsData.jobPlacements}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 backdrop-blur-lg border border-indigo-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600">
              <i className="fas fa-chart-line text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-700">Engagement Rate</p>
              <p className="text-2xl font-bold text-gray-800">{analyticsData.engagementRate}%</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 backdrop-blur-lg border border-teal-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-teal-100 text-teal-600">
              <i className="fas fa-arrow-up text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-700">Monthly Growth</p>
              <p className="text-2xl font-bold text-gray-800">+{analyticsData.monthlyGrowth}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alumni Registration Trend - Line Chart */}
        <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Alumni Registration Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={alumniRegistrationData}
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
                  dataKey="count" 
                  stroke="#3b82f6" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                  name="Registrations"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Events Organized - Bar Chart */}
        <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Events Organized</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={eventsData}
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
                <Bar 
                  dataKey="count" 
                  fill="#8b5cf6" 
                  name="Events"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Department Distribution - Pie Chart */}
        <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Alumni by Department</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {departmentData.map((entry, index) => (
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

        {/* Job Placements by Sector - Pie Chart */}
        <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border border-white/50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Job Placements by Sector</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={jobPlacementData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {jobPlacementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
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
      </div>

      {/* Detailed Reports */}
      <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 backdrop-blur-lg border border-indigo-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Detailed Reports</h3>
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            <i className="fas fa-download mr-2"></i>Export Report
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Metric</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Current</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Previous</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Change</th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">Total Alumni</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2,842</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2,510</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+13.2%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">Active Users</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">1,204</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">1,032</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+16.7%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">Events</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">42</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">36</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+16.7%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">Engagement Rate</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">85%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">78%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+7%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;