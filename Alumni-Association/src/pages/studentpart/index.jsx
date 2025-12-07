import React, { useState } from 'react';
import { useStudent } from './StudentContext';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { studentData } = useStudent();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Safe defaults for student data
  const safeStudentData = studentData || {};
  const safeProfile = safeStudentData.profile || {};
  const safeConnections = safeStudentData.connections || {};
  const safeMentorship = safeStudentData.mentorship || {};
  const safeJobs = safeStudentData.jobs || {};
  const safeEvents = safeStudentData.events || {};
  const safeBadges = safeStudentData.badges || {};
  
  // Dashboard stats data with enhanced colors
  const dashboardStats = [
    {
      title: "Profile Completeness",
      value: `${safeProfile.completeness || 0}%`,
      icon: "👤",
      color: "from-teal-500 to-cyan-600",
      bgColor: "bg-gradient-to-r from-teal-50 to-cyan-50",
      progress: safeProfile.completeness || 0,
      link: "/studentpart/profile"
    },
    {
      title: "Connected Alumni",
      value: safeConnections.alumni || 0,
      icon: "👥",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-gradient-to-r from-amber-50 to-orange-50",
      link: "/studentpart/directory"
    },
    {
      title: "Active Mentors",
      value: safeMentorship.activeMentors || 0,
      icon: "🤝",
      color: "from-violet-500 to-purple-600",
      bgColor: "bg-gradient-to-r from-violet-50 to-purple-50",
      link: "/studentpart/mentorship"
    },
    {
      title: "Job Applications",
      value: safeJobs.applications || 0,
      icon: "💼",
      color: "from-rose-500 to-red-600",
      bgColor: "bg-gradient-to-r from-rose-50 to-red-50",
      link: "/studentpart/jobs"
    },
    {
      title: "Upcoming Events",
      value: safeEvents.upcoming || 0,
      icon: "📅",
      color: "from-sky-500 to-blue-600",
      bgColor: "bg-gradient-to-r from-sky-50 to-blue-50",
      link: "/studentpart/events"
    },
    {
      title: "Earned Badges",
      value: safeBadges.earned || 0,
      icon: "🏆",
      color: "from-emerald-500 to-green-600",
      bgColor: "bg-gradient-to-r from-emerald-50 to-green-50",
      link: "/studentpart/badges"
    }
  ];

  // Recent activity data
  const recentActivity = [
    { id: 1, action: "Updated profile", time: "2 hours ago", icon: "📝", color: "from-cyan-500 to-teal-500" },
    { id: 2, action: "Connected with John Doe", time: "1 day ago", icon: "🔗", color: "from-purple-500 to-pink-500" },
    { id: 3, action: "Applied to Software Engineer position", time: "2 days ago", icon: "📄", color: "from-amber-500 to-orange-500" },
    { id: 4, action: "Joined Alumni Networking Event", time: "3 days ago", icon: "🎉", color: "from-emerald-500 to-green-500" }
  ];

  // Quick actions data with enhanced colors
  const quickActions = [
    { 
      title: "Career Roadmap", 
      icon: "🛣️", 
      color: "from-blue-500 to-indigo-600", 
      bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
      link: "/studentpart/roadmap" 
    },
    { 
      title: "Find a Mentor", 
      icon: "🤝", 
      color: "from-purple-500 to-pink-600", 
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
      link: "/studentpart/mentorship" 
    },
    { 
      title: "Job Board", 
      icon: "💼", 
      color: "from-rose-500 to-red-600", 
      bgColor: "bg-gradient-to-br from-rose-50 to-red-50",
      borderColor: "border-rose-200",
      link: "/studentpart/jobs" 
    },
    { 
      title: "Upcoming Events", 
      icon: "📅", 
      color: "from-cyan-500 to-blue-600", 
      bgColor: "bg-gradient-to-br from-cyan-50 to-blue-50",
      borderColor: "border-cyan-200",
      link: "/studentpart/events" 
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-6" style={{ backgroundColor: 'rgba(173, 216, 230, 0.2)' }}>
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-0.5 shadow-lg">
        <div className="bg-white rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-slate-800 mb-1">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">{safeProfile.name || 'Student'}</span>
              </h1>
              <p className="text-slate-600 text-sm">
                Ready to advance your career today?
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-cyan-500 to-teal-500 p-0.5 rounded-full">
                <div className="bg-white rounded-full p-0.5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 flex items-center justify-center text-white font-semibold">
                    {safeProfile.name ? safeProfile.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-sm rounded-lg transition-all ${
            activeTab === 'overview' 
              ? 'bg-white shadow-sm text-slate-800 font-medium' 
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-2 text-sm rounded-lg transition-all ${
            activeTab === 'activity' 
              ? 'bg-white shadow-sm text-slate-800 font-medium' 
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Activity
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {dashboardStats.map((stat, index) => (
          <Link 
            to={stat.link} 
            key={index}
            className="group block"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white mb-3`}>
                    {stat.icon}
                  </div>
                  <h3 className="text-slate-500 text-xs font-medium mb-1">{stat.title}</h3>
                  <p className="text-2xl font-semibold text-slate-800">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <svg className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              
              {stat.progress !== undefined && (
                <div className="mt-4">
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div 
                      className={`bg-gradient-to-r ${stat.color} h-1.5 rounded-full transition-all duration-700 ease-out`} 
                      style={{ width: `${stat.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Activity */}
        <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl p-0.5">
          <div className="bg-white rounded-2xl p-5 h-full">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
              <div className="p-2 rounded-lg bg-slate-100">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${activity.color} flex items-center justify-center text-white text-sm`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 text-sm">{activity.action}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 py-2.5 text-center bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium rounded-xl hover:from-cyan-600 hover:to-teal-600 transition-all text-sm shadow-sm">
              View All Activity
            </button>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl p-0.5">
          <div className="bg-white rounded-2xl p-5 h-full">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-800">Quick Actions</h2>
              <div className="p-2 rounded-lg bg-slate-100">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <Link 
                  to={action.link} 
                  key={index}
                  className="group"
                >
                  <div className={`${action.bgColor} rounded-xl p-4 border ${action.borderColor} group-hover:shadow-sm transition-all duration-300 transform group-hover:-translate-y-0.5`}>
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center text-white text-sm mb-2`}>
                      {action.icon}
                    </div>
                    <h3 className="font-medium text-slate-800 text-sm">{action.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-0.5 shadow-lg">
        <div className="bg-white rounded-2xl p-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center text-white text-lg">
                🏆
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">New Achievement Unlocked!</h3>
                <p className="text-slate-600 text-sm">You've connected with 5 alumni this month</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all shadow-sm text-sm">
              View Badges
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;