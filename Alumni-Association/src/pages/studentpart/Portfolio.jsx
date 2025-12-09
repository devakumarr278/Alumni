import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit3, Link, Globe, Award, Code, BookOpen, Users, 
  Share2, Eye, Copy, Check, Camera, Mail, MapPin, ExternalLink,
  GitBranch, Star, Download, Upload, X, Trash2, Sparkles,
  Briefcase, Calendar, Zap, TrendingUp, ChevronRight, Phone,
  Linkedin, Github, Instagram, Twitter, FileText, Layout
} from 'lucide-react';

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  
  const [portfolioData, setPortfolioData] = useState({
    personalInfo: {
      name: 'Alex Johnson',
      title: 'Full Stack Developer & AI Enthusiast',
      bio: 'Passionate developer with 2+ years of experience building modern web applications. Specialized in React, Node.js, and cloud technologies. Currently focused on AI/ML integration in web apps.',
      email: 'alex.johnson@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      website: 'https://alexjohnson.dev',
      linkedin: 'https://linkedin.com/in/alexjohnson',
      github: 'https://github.com/alexjohnson',
      twitter: 'https://twitter.com/alexjohnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
    },
    projects: [
      {
        id: 1,
        title: 'E-commerce AI Platform',
        description: 'Full-stack e-commerce solution with AI-powered recommendations and dynamic pricing.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'TensorFlow.js'],
        imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600',
        demoUrl: 'https://ecommerce-demo.com',
        githubUrl: 'https://github.com/alexjohnson/ecommerce',
        stars: 124,
        forks: 32,
        featured: true
      },
      {
        id: 2,
        title: 'TaskFlow - Team Management',
        description: 'Collaborative task management with real-time updates, analytics, and team productivity insights.',
        technologies: ['React', 'Firebase', 'Material UI', 'Socket.io'],
        imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w-600',
        demoUrl: 'https://taskflow-demo.com',
        githubUrl: 'https://github.com/alexjohnson/taskflow',
        stars: 89,
        forks: 21,
        featured: true
      },
      {
        id: 3,
        title: 'HealthTrack Pro',
        description: 'Health monitoring dashboard with real-time analytics and predictive insights.',
        technologies: ['Next.js', 'Python', 'FastAPI', 'PostgreSQL', 'D3.js'],
        imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600',
        demoUrl: 'https://healthtrack-demo.com',
        githubUrl: 'https://github.com/alexjohnson/healthtrack',
        stars: 67,
        forks: 18,
        featured: false
      }
    ],
    skills: [
      { name: 'JavaScript/TypeScript', level: 95, category: 'Language' },
      { name: 'React/Next.js', level: 90, category: 'Frontend' },
      { name: 'Node.js/Express', level: 88, category: 'Backend' },
      { name: 'Python/Django', level: 82, category: 'Backend' },
      { name: 'MongoDB/PostgreSQL', level: 85, category: 'Database' },
      { name: 'AWS/GCP', level: 80, category: 'Cloud' },
      { name: 'Docker/Kubernetes', level: 78, category: 'DevOps' },
      { name: 'TensorFlow/PyTorch', level: 75, category: 'AI/ML' }
    ],
    achievements: [
      {
        id: 1,
        title: 'Google Developer Scholarship',
        description: 'Selected among top 1% of applicants for advanced web development program',
        date: 'March 2024',
        issuer: 'Google Developers',
        icon: '🎖️'
      },
      {
        id: 2,
        title: 'Hackathon Grand Prize',
        description: 'First place in TechCrunch Disrupt Hackathon 2023',
        date: 'September 2023',
        issuer: 'TechCrunch',
        icon: '🏆'
      },
      {
        id: 3,
        title: 'AWS Builders Award',
        description: 'Recognized for innovative use of AWS services in production applications',
        date: 'December 2023',
        issuer: 'Amazon Web Services',
        icon: '⚡'
      }
    ],
    education: [
      {
        id: 1,
        degree: 'B.S. Computer Science',
        institution: 'Stanford University',
        year: '2020-2024',
        gpa: '3.9/4.0',
        honors: ['Summa Cum Laude', 'Dean\'s List']
      }
    ],
    experience: [
      {
        id: 1,
        role: 'Frontend Developer Intern',
        company: 'Google',
        period: 'Summer 2023',
        description: 'Worked on Google Drive interface optimization and performance improvements'
      },
      {
        id: 2,
        role: 'Full Stack Developer',
        company: 'Tech Startup Inc.',
        period: '2022-Present',
        description: 'Building and maintaining client projects using modern web technologies'
      }
    ],
    certificates: [
      {
        id: 1,
        title: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        date: 'January 2024',
        credentialId: 'AWS-SAA-456789',
        badge: '🛡️'
      },
      {
        id: 2,
        title: 'Google Cloud Professional',
        issuer: 'Google Cloud',
        date: 'November 2023',
        credentialId: 'GCP-PRO-123456',
        badge: '☁️'
      },
      {
        id: 3,
        title: 'React Advanced Certification',
        issuer: 'Meta',
        date: 'October 2023',
        credentialId: 'REACT-ADV-789012',
        badge: '⚛️'
      }
    ]
  });

  const portfolioUrl = 'https://alumni-network.com/portfolio/alexjohnson';
  const views = 1245;
  const connections = 89;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ProjectCard = ({ project }) => (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {project.imageUrl && (
        <div className="h-40 overflow-hidden">
          <img 
            src={project.imageUrl} 
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">{project.title}</h3>
            <div className="flex items-center text-sm text-gray-600 space-x-4">
              <span className="flex items-center">
                <Star className="h-3 w-3 mr-1 text-amber-500" />
                {project.stars}
              </span>
              <span className="flex items-center">
                <GitBranch className="h-3 w-3 mr-1 text-gray-500" />
                {project.forks}
              </span>
            </div>
          </div>
          {project.featured && (
            <span className="px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs rounded-full">
              Featured
            </span>
          )}
        </div>
        
        <p className="text-gray-700 mb-4 text-sm">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, index) => (
            <span 
              key={index}
              className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100"
            >
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex space-x-3">
          <a 
            href={project.demoUrl}
            className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center group-hover:scale-105 duration-300"
          >
            <Globe className="h-4 w-4 mr-2" />
            Live Demo
          </a>
          <a 
            href={project.githubUrl}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <Code className="h-4 w-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );

  const SkillBadge = ({ skill }) => (
    <div className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-bold text-gray-900">{skill.name}</h4>
          <p className="text-xs text-gray-600">{skill.category}</p>
        </div>
        <span className="text-sm font-bold text-blue-600">{skill.level}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
          style={{ width: `${skill.level}%` }}
        />
      </div>
    </div>
  );

  const ShareModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Share Portfolio</h3>
          <button 
            onClick={() => setShowShareModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-xl flex items-center">
            <Link className="h-5 w-5 text-gray-600 mr-3" />
            <input 
              type="text" 
              value={portfolioUrl}
              readOnly
              className="flex-1 bg-transparent text-gray-800 text-sm"
            />
            <button 
              onClick={copyToClipboard}
              className="ml-2 p-2 hover:bg-gray-200 rounded-lg"
            >
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-600" />}
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: <Twitter className="h-5 w-5" />, color: 'bg-blue-100 text-blue-600' },
              { icon: <Linkedin className="h-5 w-5" />, color: 'bg-blue-100 text-blue-700' },
              { icon: <Github className="h-5 w-5" />, color: 'bg-gray-100 text-gray-800' },
              { icon: <Mail className="h-5 w-5" />, color: 'bg-red-100 text-red-600' }
            ].map((platform, index) => (
              <button 
                key={index}
                className={`p-4 rounded-xl ${platform.color} hover:opacity-90 transition-opacity`}
              >
                {platform.icon}
              </button>
            ))}
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-600">
              <Eye className="h-4 w-4 mr-2" />
              <span>{views.toLocaleString()} portfolio views</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Digital Portfolio
              </h1>
              <p className="text-gray-600 mt-2">Showcase your skills, projects, and achievements</p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                {isEditing ? 'Preview' : 'Edit'}
              </button>
              <button 
                onClick={() => setShowShareModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
              <button className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <Eye className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{views}</div>
                  <div className="text-sm text-gray-600">Portfolio Views</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{connections}</div>
                  <div className="text-sm text-gray-600">Connections</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-amber-100 rounded-lg mr-3">
                  <Award className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{portfolioData.achievements.length}</div>
                  <div className="text-sm text-gray-600">Achievements</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <Code className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{portfolioData.projects.length}</div>
                  <div className="text-sm text-gray-600">Projects</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50">
          {/* Profile Header */}
          <div className="relative">
            {/* Cover Photo */}
            <div className="h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              {/* Edit Cover Button */}
              {isEditing && (
                <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Profile Info */}
            <div className="relative px-8 pb-6">
              <div className="flex flex-col md:flex-row md:items-end -mt-16">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl border-4 border-white bg-gradient-to-br from-blue-500 to-cyan-500 shadow-xl overflow-hidden">
                    <img 
                      src={portfolioData.personalInfo.avatar} 
                      alt={portfolioData.personalInfo.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {isEditing && (
                    <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg">
                      <Camera className="h-4 w-4 text-gray-700" />
                    </button>
                  )}
                </div>
                
                <div className="md:ml-6 mt-4 md:mt-0 md:flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">{portfolioData.personalInfo.name}</h2>
                      <p className="text-lg text-blue-600 font-medium mt-1">{portfolioData.personalInfo.title}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {portfolioData.personalInfo.location}
                        </span>
                        <span className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {portfolioData.personalInfo.email}
                        </span>
                        <span className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          Open to work
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4 md:mt-0">
                      <a href={portfolioData.personalInfo.github} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
                        <Github className="h-5 w-5" />
                      </a>
                      <a href={portfolioData.personalInfo.linkedin} className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg">
                        <Linkedin className="h-5 w-5 text-blue-700" />
                      </a>
                      <a href={portfolioData.personalInfo.twitter} className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg">
                        <Twitter className="h-5 w-5 text-blue-500" />
                      </a>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-gray-700 max-w-2xl">{portfolioData.personalInfo.bio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200">
            <div className="flex overflow-x-auto px-8">
              {['overview', 'projects', 'skills', 'experience', 'achievements'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-medium whitespace-nowrap relative ${
                    activeTab === tab
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  {/* About Me */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                      About Me
                    </h3>
                    <p className="text-gray-700 mb-4">{portfolioData.personalInfo.bio}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Experience', value: '2+ Years' },
                        { label: 'Projects', value: portfolioData.projects.length },
                        { label: 'Certifications', value: portfolioData.certificates.length },
                        { label: 'Availability', value: 'Immediate' }
                      ].map((item, index) => (
                        <div key={index} className="bg-white/80 p-3 rounded-xl">
                          <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                          <div className="text-sm text-gray-600">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Featured Projects */}
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900">Featured Projects</h3>
                      <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                        View All
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {portfolioData.projects
                        .filter(p => p.featured)
                        .map(project => (
                          <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                  </div>

                  {/* Skills & Achievements */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Skills */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Top Skills</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {portfolioData.skills
                          .sort((a, b) => b.level - a.level)
                          .slice(0, 4)
                          .map((skill, index) => (
                            <SkillBadge key={index} skill={skill} />
                          ))}
                      </div>
                    </div>

                    {/* Recent Achievements */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Achievements</h3>
                      <div className="space-y-4">
                        {portfolioData.achievements.map((achievement) => (
                          <div key={achievement.id} className="flex items-start p-3 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 rounded-xl">
                            <div className="text-2xl mr-3">{achievement.icon}</div>
                            <div>
                              <h4 className="font-bold text-gray-900">{achievement.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                              <div className="flex items-center text-xs text-gray-500 mt-2">
                                <Calendar className="h-3 w-3 mr-1" />
                                {achievement.date}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Projects Tab */}
              {activeTab === 'projects' && (
                <motion.div
                  key="projects"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">My Projects</h3>
                      <p className="text-gray-600">Showcasing innovative solutions and real-world applications</p>
                    </div>
                    {isEditing && (
                      <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Project
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolioData.projects.map(project => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                    
                    {/* Add New Project Card */}
                    {isEditing && (
                      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                          <Plus className="h-6 w-6 text-blue-600" />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">Add New Project</h4>
                        <p className="text-sm text-gray-600 text-center">Showcase your latest work and achievements</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Skills Tab */}
              {activeTab === 'skills' && (
                <motion.div
                  key="skills"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Technical Skills</h3>
                      <p className="text-gray-600">Expertise across modern web technologies and tools</p>
                    </div>
                    {isEditing && (
                      <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Skill
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {portfolioData.skills.map((skill, index) => (
                      <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-md transition-all">
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <h4 className="font-bold text-gray-900">{skill.name}</h4>
                            <p className="text-xs text-gray-600">{skill.category}</p>
                          </div>
                          <span className="text-sm font-bold text-blue-600">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Skill Categories */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Skill Categories</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { category: 'Frontend', skills: 4, level: 92 },
                        { category: 'Backend', skills: 3, level: 88 },
                        { category: 'Database', skills: 2, level: 85 },
                        { category: 'DevOps', skills: 2, level: 79 }
                      ].map((cat, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl">
                          <div className="text-sm text-gray-600 mb-1">{cat.category}</div>
                          <div className="text-xl font-bold text-gray-900 mb-2">{cat.level}%</div>
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1 rounded-full"
                              style={{ width: `${cat.level}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Experience Tab */}
              {activeTab === 'experience' && (
                <motion.div
                  key="experience"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Work Experience</h3>
                      <div className="space-y-6">
                        {portfolioData.experience.map((exp, index) => (
                          <div key={exp.id} className="relative">
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-cyan-500" />
                            <div className="ml-8">
                              <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h4 className="font-bold text-gray-900 text-lg">{exp.role}</h4>
                                    <p className="text-blue-600 font-medium">{exp.company}</p>
                                  </div>
                                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                    {exp.period}
                                  </span>
                                </div>
                                <p className="text-gray-700">{exp.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Education */}
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Education</h3>
                        {portfolioData.education.map((edu) => (
                          <div key={edu.id} className="bg-white/80 p-4 rounded-xl mb-3">
                            <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                            <p className="text-gray-600 text-sm">{edu.institution}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-sm text-gray-500">{edu.year}</span>
                              <span className="text-sm font-bold text-purple-600">GPA: {edu.gpa}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {edu.honors.map((honor, i) => (
                                <span key={i} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                                  {honor}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Certificates */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Certifications</h3>
                        <div className="space-y-3">
                          {portfolioData.certificates.map((cert) => (
                            <div key={cert.id} className="bg-white/80 p-3 rounded-xl">
                              <div className="flex items-start">
                                <div className="text-xl mr-3">{cert.badge}</div>
                                <div>
                                  <h4 className="font-medium text-gray-900">{cert.title}</h4>
                                  <p className="text-sm text-gray-600">{cert.issuer}</p>
                                  <div className="flex items-center text-xs text-gray-500 mt-1">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {cert.date}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Achievements Tab */}
              {activeTab === 'achievements' && (
                <motion.div
                  key="achievements"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Achievements & Awards</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {portfolioData.achievements.map((achievement) => (
                          <div 
                            key={achievement.id} 
                            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-5 hover:shadow-lg transition-all"
                          >
                            <div className="flex items-start">
                              <div className="text-3xl mr-4">{achievement.icon}</div>
                              <div>
                                <h4 className="font-bold text-gray-900 text-lg mb-2">{achievement.title}</h4>
                                <p className="text-gray-700 text-sm mb-3">{achievement.description}</p>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-600">{achievement.issuer}</span>
                                  <span className="text-sm text-gray-500">{achievement.date}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Stats */}
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Recognition</h3>
                        <div className="space-y-4">
                          {[
                            { label: 'Hackathons Won', value: 3 },
                            { label: 'Scholarships', value: 2 },
                            { label: 'Certifications', value: portfolioData.certificates.length },
                            { label: 'Publications', value: 1 }
                          ].map((stat, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-gray-700">{stat.label}</span>
                              <span className="font-bold text-gray-900">{stat.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Portfolio Stats */}
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Portfolio Stats</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-white/80 rounded-xl">
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 text-blue-600 mr-2" />
                              <span>Views This Month</span>
                            </div>
                            <span className="font-bold text-blue-600">+42%</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white/80 rounded-xl">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 text-green-600 mr-2" />
                              <span>New Connections</span>
                            </div>
                            <span className="font-bold text-green-600">+28%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Portfolio last updated: Today, 2:30 PM</p>
          <div className="flex items-center justify-center mt-4 space-x-4">
            <button className="flex items-center text-blue-600 hover:text-blue-700">
              <Layout className="h-4 w-4 mr-2" />
              Change Theme
            </button>
            <button className="flex items-center text-blue-600 hover:text-blue-700">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </button>
          </div>
        </div>
      </motion.div>

      {/* Share Modal */}
      {showShareModal && <ShareModal />}
    </div>
  );
};

export default Portfolio;