import React, { useState } from 'react';
import { useStudent } from './StudentContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Users, Briefcase, Calendar, Trophy, TrendingUp,
  Target, MessageSquare, FileText, Bell, ChevronRight,
  CheckCircle, Clock, Star, Award, BookOpen, Zap
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import StudentProfile from './StudentProfile'; // Import the profile component
import { 
  User, Users, Briefcase, Calendar, Trophy, TrendingUp,
  Target, MessageSquare, FileText, Bell, ChevronRight,
  CheckCircle, Clock, Star, Award, BookOpen, Zap, Home
} from 'lucide-react';

const StudentDashboard = () => {
  const { studentData } = useStudent();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfile, setShowProfile] = useState(false); // New state to control profile display
  
  // Safe defaults with enhanced structure
  const safeStudentData = studentData || {};
  const safeProfile = safeStudentData.profile || {
    name: 'Student',
    name: 'Deva',
    major: 'Computer Science',
    graduationYear: '2024',
    completeness: 65
  };
  const safeConnections = safeStudentData.connections || { alumni: 12, peers: 45, total: 57 };
  const safeMentorship = safeStudentData.mentorship || { activeMentors: 3, meetings: 8, goals: 5 };
  const safeJobs = safeStudentData.jobs || { applications: 12, interviews: 3, saved: 8 };
  const safeEvents = safeStudentData.events || { upcoming: 5, attended: 12, registered: 3 };
  const safeBadges = safeStudentData.badges || { earned: 8, inProgress: 3 };
  const safeSkills = safeStudentData.skills || { completed: 12, inProgress: 4 };

  // Main dashboard stats with enhanced data
  const dashboardStats = [
    {
      title: "Profile Strength",
      value: `${safeProfile.completeness}%`,
      icon: <User size={20} />,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      borderColor: "border-blue-100",
      progress: safeProfile.completeness,
      description: `${100 - safeProfile.completeness}% remaining`,
      link: "/studentpart/profile",
      link: "#",
      onClick: () => setShowProfile(true),
      trend: "+5% this month"
    },
    {
      title: "Network Growth",
      value: safeConnections.total,
      icon: <Users size={20} />,
      color: "from-emerald-500 to-green-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-green-50",
      borderColor: "border-emerald-100",
      link: "/studentpart/directory",
      description: `${safeConnections.alumni} alumni connected`,
      trend: "+12% this month"
    },
    {
      title: "Job Applications",
      value: safeJobs.applications,
      icon: <Briefcase size={20} />,
      color: "from-violet-500 to-purple-600",
      bgColor: "bg-gradient-to-br from-violet-50 to-purple-50",
      borderColor: "border-violet-100",
      link: "/studentpart/jobs",
      description: `${safeJobs.interviews} interviews scheduled`,
      trend: "3 pending reviews"
    },
    {
      title: "Skill Progress",
      value: safeSkills.completed,
      icon: <TrendingUp size={20} />,
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
      borderColor: "border-amber-100",
      link: "/studentpart/skills",
      description: `${safeSkills.inProgress} in progress`,
      trend: "On track"
    },
    {
      title: "Mentor Sessions",
      value: safeMentorship.meetings,
      icon: <MessageSquare size={20} />,
      color: "from-rose-500 to-pink-600",
      bgColor: "bg-gradient-to-br from-rose-50 to-pink-50",
      borderColor: "border-rose-100",
      link: "/studentpart/mentorship",
      description: `${safeMentorship.activeMentors} active mentors`,
      trend: "Next: Tomorrow"
    },
    {
      title: "Achievements",
      value: safeBadges.earned,
      icon: <Trophy size={20} />,
      color: "from-indigo-500 to-blue-600",
      bgColor: "bg-gradient-to-br from-indigo-50 to-blue-50",
      borderColor: "border-indigo-100",
      link: "/studentpart/badges",
      description: `${safeBadges.inProgress} in progress`,
      trend: "2 new available"
    }
  ];

  // Recent activity with real data
  const recentActivity = [
    { 
      id: 1, 
      action: "Profile updated successfully", 
      time: "2 hours ago", 
      icon: <CheckCircle size={16} />,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      type: "profile"
    },
    { 
      id: 2, 
      action: "Connected with Sarah Johnson (Alumni)", 
      time: "1 day ago", 
      icon: <Users size={16} />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      type: "network"
    },
    { 
      id: 3, 
      action: "Application submitted: Software Engineer at TechCorp", 
      time: "2 days ago", 
      icon: <Briefcase size={16} />,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
      type: "job"
    },
    { 
      id: 4, 
      action: "Completed 'React Advanced Patterns' course", 
      time: "3 days ago", 
      icon: <Award size={16} />,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      type: "learning"
    },
    { 
      id: 5, 
      action: "Mentor session scheduled with Alex Chen", 
      time: "4 days ago", 
      icon: <MessageSquare size={16} />,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      type: "mentorship"
    }
  ];

  // Upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: "Alumni Networking Mixer",
      date: "Tomorrow, 6:00 PM",
      location: "Virtual",
      type: "networking",
      attendees: 45
    },
    {
      id: 2,
      title: "Tech Interview Workshop",
      date: "Oct 25, 3:00 PM",
      location: "Career Center",
      type: "workshop",
      attendees: 28
    },
    {
      id: 3,
      title: "Company Info Session: Google",
      date: "Oct 28, 2:00 PM",
      location: "Engineering Building",
      type: "info-session",
      attendees: 120
    }
  ];

  // Recommended mentors
  const recommendedMentors = [
    {
      id: 1,
      name: "Michael Rodriguez",
      role: "Senior Engineer @ Microsoft",
      experience: "8 years",
      match: 95,
      expertise: ["React", "System Design", "Career Growth"]
    },
    {
      id: 2,
      name: "Jessica Wang",
      role: "Product Manager @ Airbnb",
      experience: "6 years",
      match: 88,
      expertise: ["Product Strategy", "UX Research", "Leadership"]
    },
    {
      id: 3,
      name: "David Kim",
      role: "Engineering Manager @ Slack",
      experience: "10 years",
      match: 92,
      expertise: ["Team Leadership", "Scalability", "Interview Prep"]
    }
  ];

  ];

  // Upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: "Alumni Networking Mixer",
      date: "Tomorrow, 6:00 PM",
      location: "Virtual",
      type: "networking",
      attendees: 45
    },
    {
      id: 2,
      title: "Tech Interview Workshop",
      date: "Oct 25, 3:00 PM",
      location: "Career Center",
      type: "workshop",
      attendees: 28
    },
    {
      id: 3,
      title: "Company Info Session: Google",
      date: "Oct 28, 2:00 PM",
      location: "Engineering Building",
      type: "info-session",
      attendees: 120
    }
  ];

  // Recommended mentors
  const recommendedMentors = [
    {
      id: 1,
      name: "Michael Rodriguez",
      role: "Senior Engineer @ Microsoft",
      experience: "8 years",
      match: 95,
      expertise: ["React", "System Design", "Career Growth"]
    },
    {
      id: 2,
      name: "Jessica Wang",
      role: "Product Manager @ Airbnb",
      experience: "6 years",
      match: 88,
      expertise: ["Product Strategy", "UX Research", "Leadership"]
    },
    {
      id: 3,
      name: "David Kim",
      role: "Engineering Manager @ Slack",
      experience: "10 years",
      match: 92,
      expertise: ["Team Leadership", "Scalability", "Interview Prep"]
    }
  ];

  // Quick actions
  const quickActions = [
    { 
      title: "Update Resume", 
      icon: <FileText size={20} />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      link: "/studentpart/resume",
      description: "Last updated 30 days ago"
    },
    { 
      title: "Find Mentor", 
      icon: <Users size={20} />,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50",
      link: "/studentpart/mentorship",
      description: "Based on your interests"
    },
    { 
      title: "Career Roadmap", 
      icon: <Target size={20} />,
      color: "from-violet-500 to-purple-500",
      bgColor: "bg-gradient-to-br from-violet-50 to-purple-50",
      link: "/studentpart/roadmap",
      description: "View your progress"
    },
    { 
      title: "Skill Assessment", 
      icon: <TrendingUp size={20} />,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
      link: "/studentpart/skills",
      description: "Test your skills"
    },
    { 
      title: "Career Roadmap", 
      icon: <Target size={20} />,
      color: "from-violet-500 to-purple-500",
      bgColor: "bg-gradient-to-br from-violet-50 to-purple-50",
      link: "/studentpart/roadmap",
      description: "View your progress"
    },
    { 
      title: "Skill Assessment", 
      icon: <TrendingUp size={20} />,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
      link: "/studentpart/skills",
      description: "Test your skills"
    },
    { 
      title: "AI Project Ideas", 
      icon: <Zap size={20} />,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
      link: "/studentpart/ai-project-suggestions",
      description: "Get personalized suggestions"
    }
  ];
  
  // Progress metrics
  const progressMetrics = [
    { label: "Profile", value: safeProfile.completeness, target: 100 },
    { label: "Network", value: (safeConnections.total / 100) * 100, target: 100 },
    { label: "Skills", value: (safeSkills.completed / 20) * 100, target: 100 },
    { label: "Applications", value: (safeJobs.applications / 20) * 100, target: 100 }
  ];

  // Progress metrics
  const progressMetrics = [
    { label: "Profile", value: safeProfile.completeness, target: 100 },
    { label: "Network", value: (safeConnections.total / 100) * 100, target: 100 },
    { label: "Skills", value: (safeSkills.completed / 20) * 100, target: 100 },
    { label: "Applications", value: (safeJobs.applications / 20) * 100, target: 100 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, <span className="text-blue-600">{safeProfile.name}</span>
                </h1>
                <p className="text-gray-600 mt-2">
                  {safeProfile.major} • Class of {safeProfile.graduationYear}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Bell size={16} />
                  Notifications
                </button>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {safeProfile.name.charAt(0)}
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                <span className="text-sm font-semibold text-blue-600">{safeProfile.completeness}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${safeProfile.completeness}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Link to={stat.link}>
                <div className={`${stat.bgColor} border ${stat.borderColor} rounded-xl p-6 hover:shadow-lg transition-all duration-300 h-full`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} text-white`}>
                      {stat.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-500">{stat.trend}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-lg font-semibold text-gray-800 mb-2">{stat.title}</p>
                  <p className="text-sm text-gray-600 mb-4">{stat.description}</p>
                  {stat.progress && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${stat.color} h-2 rounded-full`}
                        style={{ width: `${stat.progress}%` }}
                      />
                    </div>
  // Handle profile icon click
  const handleProfileClick = () => {
    setShowProfile(true);
  };

  // Handle back to dashboard click
  const handleBackToDashboard = () => {
    setShowProfile(false);
    setActiveTab('overview');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section - Always visible */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                {showProfile && (
                  <button
                    onClick={handleBackToDashboard}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Home size={16} />
                    Back to Dashboard
                  </button>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {showProfile ? (
                      <span className="text-blue-600">Profile Settings</span>
                    ) : (
                      <>
                        Welcome back, <span className="text-blue-600">{safeProfile.name}</span>
                      </>
                    )}
                  </h1>
                  {!showProfile && (
                    <p className="text-gray-600 mt-2">
                      {safeProfile.major} • Class of {safeProfile.graduationYear}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Activity & Quick Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'overview'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'activity'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Recent Activity
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'analytics'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Analytics
                  </button>
                </nav>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6"
                  >
                    {/* Progress Metrics */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
                      <div className="space-y-4">
                        {progressMetrics.map((metric, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">{metric.label}</span>
                              <span className="text-sm font-medium text-gray-900">{Math.min(metric.value, 100).toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div
                                className={`h-2 rounded-full ${
                                  metric.value >= 75 ? 'bg-emerald-500' :
                                  metric.value >= 50 ? 'bg-blue-500' :
                                  metric.value >= 25 ? 'bg-amber-500' : 'bg-rose-500'
                                }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(metric.value, 100)}%` }}
                                transition={{ delay: index * 0.1 }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {quickActions.map((action, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Link to={action.link}>
                              <div className={`${action.bgColor} border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow`}>
                                <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} text-white w-fit mb-3`}>
                                  {action.icon}
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-1">{action.title}</h4>
                                <p className="text-sm text-gray-600">{action.description}</p>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'activity' && (
                  <motion.div
                    key="activity"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6"
                  >
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className={`p-2 rounded-lg ${activity.bgColor} ${activity.color}`}>
                            {activity.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900">{activity.action}</p>
                            <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'analytics' && (
                  <motion.div
                    key="analytics"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6"
                  >
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Engagement Score</h4>
                        <div className="text-3xl font-bold text-gray-900 mb-2">78/100</div>
                        <p className="text-sm text-gray-600">Higher than 85% of students</p>
                      </div>
                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Response Rate</h4>
                        <div className="text-3xl font-bold text-gray-900 mb-2">92%</div>
                        <p className="text-sm text-gray-600">From mentors & recruiters</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
                <Link to="/studentpart/events" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                  View all
                  <ChevronRight size={16} />
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <Calendar size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <Clock size={14} />
                            {event.date}
                          </span>
                          <span className="text-sm text-gray-600">{event.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">{event.attendees} attending</span>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        Join
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Recommendations & Achievements */}
          <div className="space-y-8">
            {/* Recommended Mentors */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recommended Mentors</h3>
                <Link to="/studentpart/mentorship" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  See all
                </Link>
              </div>
              <div className="space-y-4">
                {recommendedMentors.map((mentor) => (
                  <div
                    key={mentor.id}
                    className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{mentor.name}</h4>
                        <p className="text-sm text-gray-600">{mentor.role}</p>
                      </div>
                      <div className="text-sm font-semibold text-emerald-600">
                        {mentor.match}% match
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {mentor.expertise.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <button className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                  <Trophy size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Recent Achievements</h3>
                  <p className="text-sm text-gray-600">Keep up the great work!</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                  <div className="p-2 bg-emerald-100 rounded">
                    <Award size={16} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Profile Star</p>
                    <p className="text-sm text-gray-600">Completed 80% of profile</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded">
                    <Users size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Network Builder</p>
                    <p className="text-sm text-gray-600">Connected with 10+ alumni</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                  <div className="p-2 bg-amber-100 rounded">
                    <BookOpen size={16} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Quick Learner</p>
                    <p className="text-sm text-gray-600">Completed 5+ courses</p>
                  </div>
                </div>
              </div>
              <Link
                to="/studentpart/badges"
                className="mt-6 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <Trophy size={16} />
                View All Achievements
              </Link>
            </div>

            {/* Performance Tips */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-blue-100 rounded mt-0.5">
                    <Zap size={14} className="text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-700">Complete your profile to increase visibility by 40%</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-green-100 rounded mt-0.5">
                    <Zap size={14} className="text-green-600" />
                  </div>
                  <p className="text-sm text-gray-700">Connect with 3+ mentors to accelerate career growth</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-purple-100 rounded mt-0.5">
                    <Zap size={14} className="text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-700">Apply to 5+ jobs weekly for better opportunities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Bell size={16} />
                  Notifications
                </button>
                <div 
                  className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={handleProfileClick}
                  title="View Profile"
                >
                  {safeProfile.name.charAt(0)}
                </div>
              </div>
            </div>
            
            {/* Progress Bar - Only show when on dashboard */}
            {!showProfile && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                  <span className="text-sm font-semibold text-blue-600">{safeProfile.completeness}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${safeProfile.completeness}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Conditionally render Profile or Dashboard */}
        {showProfile ? (
          <StudentProfile onBack={handleBackToDashboard} />
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {dashboardStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  {stat.onClick ? (
                    <div 
                      onClick={stat.onClick}
                      className={`${stat.bgColor} border ${stat.borderColor} rounded-xl p-6 hover:shadow-lg transition-all duration-300 h-full cursor-pointer`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} text-white`}>
                          {stat.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-500">{stat.trend}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                      <p className="text-lg font-semibold text-gray-800 mb-2">{stat.title}</p>
                      <p className="text-sm text-gray-600 mb-4">{stat.description}</p>
                      {stat.progress && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`bg-gradient-to-r ${stat.color} h-2 rounded-full`}
                            style={{ width: `${stat.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link to={stat.link}>
                      <div className={`${stat.bgColor} border ${stat.borderColor} rounded-xl p-6 hover:shadow-lg transition-all duration-300 h-full`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} text-white`}>
                            {stat.icon}
                          </div>
                          <span className="text-sm font-medium text-gray-500">{stat.trend}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                        <p className="text-lg font-semibold text-gray-800 mb-2">{stat.title}</p>
                        <p className="text-sm text-gray-600 mb-4">{stat.description}</p>
                        {stat.progress && (
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`bg-gradient-to-r ${stat.color} h-2 rounded-full`}
                              style={{ width: `${stat.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Activity & Quick Actions */}
              <div className="lg:col-span-2 space-y-8">
                {/* Tabs */}
                <div className="bg-white rounded-xl border border-gray-200">
                  <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                      <button
                        onClick={() => setActiveTab('overview')}
                        className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === 'overview'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Overview
                      </button>
                      <button
                        onClick={() => setActiveTab('activity')}
                        className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === 'activity'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Recent Activity
                      </button>
                      <button
                        onClick={() => setActiveTab('analytics')}
                        className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === 'analytics'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Analytics
                      </button>
                    </nav>
                  </div>

                  <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                      <motion.div
                        key="overview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-6"
                      >
                        {/* Progress Metrics */}
                        <div className="mb-8">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
                          <div className="space-y-4">
                            {progressMetrics.map((metric, index) => (
                              <div key={index} className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">{metric.label}</span>
                                  <span className="text-sm font-medium text-gray-900">{Math.min(metric.value, 100).toFixed(0)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <motion.div
                                    className={`h-2 rounded-full ${
                                      metric.value >= 75 ? 'bg-emerald-500' :
                                      metric.value >= 50 ? 'bg-blue-500' :
                                      metric.value >= 25 ? 'bg-amber-500' : 'bg-rose-500'
                                    }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(metric.value, 100)}%` }}
                                    transition={{ delay: index * 0.1 }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                          <div className="grid grid-cols-2 gap-4">
                            {quickActions.map((action, index) => (
                              <motion.div
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Link to={action.link}>
                                  <div className={`${action.bgColor} border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow`}>
                                    <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} text-white w-fit mb-3`}>
                                      {action.icon}
                                    </div>
                                    <h4 className="font-semibold text-gray-900 mb-1">{action.title}</h4>
                                    <p className="text-sm text-gray-600">{action.description}</p>
                                  </div>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'activity' && (
                      <motion.div
                        key="activity"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-6"
                      >
                        <div className="space-y-4">
                          {recentActivity.map((activity) => (
                            <div
                              key={activity.id}
                              className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className={`p-2 rounded-lg ${activity.bgColor} ${activity.color}`}>
                                {activity.icon}
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-900">{activity.action}</p>
                                <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'analytics' && (
                      <motion.div
                        key="analytics"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-6"
                      >
                        <div className="grid grid-cols-2 gap-6">
                          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
                            <h4 className="font-semibold text-gray-900 mb-2">Engagement Score</h4>
                            <div className="text-3xl font-bold text-gray-900 mb-2">78/100</div>
                            <p className="text-sm text-gray-600">Higher than 85% of students</p>
                          </div>
                          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6">
                            <h4 className="font-semibold text-gray-900 mb-2">Response Rate</h4>
                            <div className="text-3xl font-bold text-gray-900 mb-2">92%</div>
                            <p className="text-sm text-gray-600">From mentors & recruiters</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
                    <Link to="/studentpart/events" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                      View all
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <Calendar size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{event.title}</h4>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-gray-600 flex items-center gap-1">
                                <Clock size={14} />
                                {event.date}
                              </span>
                              <span className="text-sm text-gray-600">{event.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">{event.attendees} attending</span>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                            Join
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Recommendations & Achievements */}
              <div className="space-y-8">
                {/* Recommended Mentors */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Recommended Mentors</h3>
                    <Link to="/studentpart/mentorship" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      See all
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {recommendedMentors.map((mentor) => (
                      <div
                        key={mentor.id}
                        className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{mentor.name}</h4>
                            <p className="text-sm text-gray-600">{mentor.role}</p>
                          </div>
                          <div className="text-sm font-semibold text-emerald-600">
                            {mentor.match}% match
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {mentor.expertise.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        <button className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
                          Connect
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Achievements */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                      <Trophy size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Recent Achievements</h3>
                      <p className="text-sm text-gray-600">Keep up the great work!</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                      <div className="p-2 bg-emerald-100 rounded">
                        <Award size={16} className="text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Profile Star</p>
                        <p className="text-sm text-gray-600">Completed 80% of profile</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded">
                        <Users size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Network Builder</p>
                        <p className="text-sm text-gray-600">Connected with 10+ alumni</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                      <div className="p-2 bg-amber-100 rounded">
                        <BookOpen size={16} className="text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Quick Learner</p>
                        <p className="text-sm text-gray-600">Completed 5+ courses</p>
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/studentpart/badges"
                    className="mt-6 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 font-medium"
                  >
                    <Trophy size={16} />
                    View All Achievements
                  </Link>
                </div>

                {/* Performance Tips */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Tips</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-blue-100 rounded mt-0.5">
                        <Zap size={14} className="text-blue-600" />
                      </div>
                      <p className="text-sm text-gray-700">Complete your profile to increase visibility by 40%</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-green-100 rounded mt-0.5">
                        <Zap size={14} className="text-green-600" />
                      </div>
                      <p className="text-sm text-gray-700">Connect with 3+ mentors to accelerate career growth</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-purple-100 rounded mt-0.5">
                        <Zap size={14} className="text-purple-600" />
                      </div>
                      <p className="text-sm text-gray-700">Apply to 5+ jobs weekly for better opportunities</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;