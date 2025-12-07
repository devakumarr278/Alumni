import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  Target, 
  CheckCircle, 
  Circle, 
  ChevronDown, 
  ChevronUp,
  RefreshCw,
  Lightbulb,
  Award,
  TrendingUp,
  User,
  Zap,
  Code,
  Database,
  Shield,
  Palette,
  Smartphone,
  BarChart,
  Rocket,
  Calendar,
  FolderOpen,
  Play,
  Star,
  Crown,
  Medal,
  Trophy,
  Check
} from 'lucide-react';

const CareerRoadmap = () => {
  const [careerGoal, setCareerGoal] = useState('');
  const [customGoal, setCustomGoal] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');
  const [roadmap, setRoadmap] = useState(null);
  const [expandedStep, setExpandedStep] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const careerOptions = [
    { name: 'Full Stack Developer', icon: <Code size={20} />, category: 'Development', color: 'from-blue-600 to-indigo-700' },
    { name: 'Frontend Developer', icon: <Palette size={20} />, category: 'Development', color: 'from-cyan-500 to-blue-600' },
    { name: 'Backend Developer', icon: <Database size={20} />, category: 'Development', color: 'from-green-600 to-teal-700' },
    { name: 'Mobile App Developer', icon: <Smartphone size={20} />, category: 'Development', color: 'from-purple-600 to-pink-700' },
    { name: 'Data Analyst', icon: <BarChart size={20} />, category: 'Data & AI', color: 'from-amber-500 to-orange-600' },
    { name: 'Data Scientist', icon: <BarChart size={20} />, category: 'Data & AI', color: 'from-rose-500 to-red-600' },
    { name: 'Machine Learning Engineer', icon: <BarChart size={20} />, category: 'Data & AI', color: 'from-indigo-600 to-purple-700' },
    { name: 'AI Engineer', icon: <BarChart size={20} />, category: 'Data & AI', color: 'from-violet-600 to-fuchsia-700' },
    { name: 'DevOps Engineer', icon: <Database size={20} />, category: 'Cloud & DevOps', color: 'from-emerald-600 to-green-700' },
    { name: 'Cloud Engineer', icon: <Database size={20} />, category: 'Cloud & DevOps', color: 'from-sky-500 to-cyan-600' },
    { name: 'Cybersecurity Analyst', icon: <Shield size={20} />, category: 'Security', color: 'from-red-600 to-orange-700' },
    { name: 'Ethical Hacker', icon: <Shield size={20} />, category: 'Security', color: 'from-gray-700 to-gray-900' },
    { name: 'UI/UX Designer', icon: <Palette size={20} />, category: 'Design & Product', color: 'from-pink-500 to-rose-600' },
    { name: 'Product Manager', icon: <User size={20} />, category: 'Design & Product', color: 'from-teal-600 to-green-700' },
    { name: 'QA Tester', icon: <CheckCircle size={20} />, category: 'Testing & Automation', color: 'from-yellow-500 to-amber-600' }
  ];

  const careerDetails = {
    'Full Stack Developer': {
      description: 'Build complete applications (frontend + backend + database)',
      icon: <Code className="text-blue-500" size={24} />,
      skills: ['HTML, CSS, JavaScript', 'React / Angular', 'Node.js', 'Express.js', 'MongoDB / SQL', 'Git & GitHub', 'APIs'],
      roadmap: [
        {
          id: '1',
          title: 'HTML, CSS & Web Basics',
          duration: '1 month',
          description: 'Learn how websites work, build static responsive layouts, master Flexbox/Grid',
          icon: <FolderOpen className="text-blue-500" size={20} />,
          skills: ['HTML5', 'CSS3', 'Responsive Design', 'Flexbox', 'Grid'],
          resources: [
            { title: 'FreeCodeCamp - Responsive Web Design', url: 'https://www.freecodecamp.org/' },
            { title: 'MDN Web Docs', url: 'https://developer.mozilla.org/' },
            { title: 'CodeWithHarry - HTML/CSS', url: 'https://youtube.com' }
          ],
          projects: [
            { title: 'Personal Portfolio', description: 'HTML/CSS only portfolio showcasing your skills' },
            { title: 'Product Landing Page', description: 'Responsive landing page for a fictional product' },
            { title: 'Restaurant Website', description: 'Multi-page restaurant website with menu' }
          ],
          milestones: ['Build 3 static websites', 'Master responsive design', 'Understand semantic HTML']
        },
        {
          id: '2',
          title: 'JavaScript Mastery',
          duration: '1 month',
          description: 'From fundamentals to async programming with APIs',
          icon: <Play className="text-yellow-500" size={20} />,
          skills: ['Variables & Datatypes', 'Functions', 'DOM Manipulation', 'Async/Await', 'APIs'],
          resources: [
            { title: 'FreeCodeCamp - JavaScript', url: 'https://www.freecodecamp.org/' },
            { title: 'JavaScript.info', url: 'https://javascript.info/' },
            { title: 'Hitesh Choudhary - JS Playlist', url: 'https://youtube.com' }
          ],
          projects: [
            { title: 'To-Do App', description: 'Interactive to-do list with local storage' },
            { title: 'Weather App', description: 'Real-time weather app using public API' },
            { title: 'Movie Search App', description: 'Search movies using OMDB API' }
          ],
          milestones: ['Build 3 interactive web apps', 'Handle asynchronous operations', 'Work with APIs']
        },
        {
          id: '3',
          title: 'React.js Framework',
          duration: '1 month',
          description: 'Components, hooks, routing, and modern UI libraries',
          icon: <Star className="text-cyan-500" size={20} />,
          skills: ['Components', 'Props & State', 'Hooks', 'React Router', 'Tailwind CSS'],
          resources: [
            { title: 'React Official Docs', url: 'https://react.dev/' },
            { title: 'CodeWithHarry - React', url: 'https://youtube.com' },
            { title: 'Traversy Media - React', url: 'https://youtube.com' }
          ],
          projects: [
            { title: 'Blog UI', description: 'Blog interface with API data fetching' },
            { title: 'Dashboard', description: 'Analytics dashboard with charts' },
            { title: 'E-commerce Frontend', description: 'Products, filters, and cart UI' }
          ],
          milestones: ['Create reusable components', 'Manage complex state', 'Build dynamic UIs']
        },
        {
          id: '4',
          title: 'Backend with Node.js & Express',
          duration: '1 month',
          description: 'Server logic, APIs, authentication, and best practices',
          icon: <Database className="text-green-500" size={20} />,
          skills: ['Node.js Modules', 'Express Routes', 'JWT Auth', 'API Best Practices'],
          resources: [
            { title: 'Node.js Official Docs', url: 'https://nodejs.org/en/docs/' },
            { title: 'Hitesh Choudhary - Backend', url: 'https://youtube.com' },
            { title: 'Traversy Media - Express', url: 'https://youtube.com' }
          ],
          projects: [
            { title: 'User Auth System', description: 'Signup/login with JWT authentication' },
            { title: 'E-commerce API', description: 'CRUD operations with filters and auth' }
          ],
          milestones: ['Build RESTful APIs', 'Implement secure authentication', 'Structure scalable projects']
        },
        {
          id: '5',
          title: 'Database & Full Integration',
          duration: '1 month',
          description: 'MongoDB, Mongoose, connecting frontend/backend, deployment',
          icon: <Database className="text-emerald-500" size={20} />,
          skills: ['MongoDB CRUD', 'Mongoose Models', 'API Integration', 'Deployment'],
          resources: [
            { title: 'MongoDB University', url: 'https://university.mongodb.com/' },
            { title: 'Hitesh Choudhary - MongoDB', url: 'https://youtube.com' },
            { title: 'Traversy Media - MERN', url: 'https://youtube.com' }
          ],
          projects: [
            { title: 'Auth + Dashboard', description: 'Full-stack app with React, Node, MongoDB' },
            { title: 'Full E-commerce App', description: 'Complete shopping experience' },
            { title: 'User Management', description: 'Admin panel for user management' }
          ],
          milestones: ['Integrate frontend with backend', 'Deploy full applications', 'Work with databases']
        },
        {
          id: '6',
          title: 'Advanced Topics & Job Prep',
          duration: '1 month',
          description: 'Caching, WebSockets, system design, portfolio, interview prep',
          icon: <Rocket className="text-purple-500" size={20} />,
          skills: ['Redis Caching', 'WebSockets', 'System Design', 'Interview Prep'],
          resources: [
            { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' },
            { title: 'Hussein Nasser - System Design', url: 'https://youtube.com' },
            { title: 'Tech with Nana - DevOps', url: 'https://youtube.com' }
          ],
          projects: [
            { title: 'Major Project', description: 'E-commerce with admin or Social Media App' },
            { title: 'Advanced Project', description: 'AI search or Realtime collaboration app' },
            { title: 'Portfolio Website', description: 'Professional portfolio with React/Next.js' }
          ],
          milestones: ['Build 2 advanced projects', 'Prepare for technical interviews', 'Create professional portfolio']
        }
      ],
      tips: [
        "Start with one technology and master it before moving to the next",
        "Build projects that interest you to stay motivated",
        "Contribute to open-source projects to gain real-world experience",
        "Practice coding daily, even if it's just for 30 minutes",
        "Join developer communities for support and networking"
      ],
      stats: {
        duration: '6 Months',
        projects: '10-15 Real Projects',
        skills: 'HTML, CSS, JavaScript, React, Node.js, Express, MongoDB'
      }
    }
    // Additional career paths would follow the same structure
  };

  const toggleStepExpansion = (stepId) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const toggleStepCompletion = (stepId) => {
    const newCompletedSteps = new Set(completedSteps);
    if (newCompletedSteps.has(stepId)) {
      newCompletedSteps.delete(stepId);
    } else {
      newCompletedSteps.add(stepId);
    }
    setCompletedSteps(newCompletedSteps);
    
    // Update progress
    if (roadmap) {
      const newProgress = Math.round((newCompletedSteps.size / roadmap.roadmap.length) * 100);
      setRoadmap({
        ...roadmap,
        progress: newProgress
      });
    }
  };

  const markStepAsComplete = (stepId) => {
    const newCompletedSteps = new Set(completedSteps);
    newCompletedSteps.add(stepId);
    setCompletedSteps(newCompletedSteps);
    
    // Update progress
    if (roadmap) {
      const newProgress = Math.round((newCompletedSteps.size / roadmap.roadmap.length) * 100);
      setRoadmap({
        ...roadmap,
        progress: newProgress
      });
    }
  };

  const generateRoadmap = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Determine the final career goal
      const finalGoal = careerGoal === 'Other' ? customGoal : careerGoal;
      
      if (!finalGoal) {
        throw new Error('Please select or enter a career goal');
      }
      
      // Get detailed roadmap for the selected career
      const careerDetail = careerDetails[finalGoal] || {
        description: 'Custom career path',
        icon: <User className="text-purple-500" size={24} />,
        skills: currentSkills.split(',').map(skill => skill.trim()).filter(skill => skill),
        roadmap: [
          {
            id: '1',
            title: 'Getting Started',
            duration: '1-2 months',
            description: 'Begin your journey in your chosen field',
            icon: <Target className="text-blue-500" size={20} />,
            skills: ['Foundational Knowledge'],
            resources: [],
            projects: [{ title: 'Initial Project', description: 'Start with a simple project' }],
            milestones: ['Complete introductory material', 'Build first project']
          }
        ],
        tips: [
          "Set clear goals and milestones",
          "Seek mentorship and guidance",
          "Join relevant communities",
          "Practice consistently",
          "Track your progress"
        ]
      };
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRoadmap = {
        careerGoal: finalGoal,
        description: careerDetail.description,
        icon: careerDetail.icon,
        skills: careerDetail.skills,
        roadmap: careerDetail.roadmap,
        tips: careerDetail.tips,
        stats: careerDetail.stats,
        progress: 0
      };
      
      setRoadmap(newRoadmap);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetRoadmap = () => {
    setRoadmap(null);
    setCareerGoal('');
    setCustomGoal('');
    setCurrentSkills('');
    setCompletedSteps(new Set());
    setExpandedStep(null);
  };

  if (!roadmap) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
              <Rocket className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Career Roadmap Generator</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get a personalized learning path to achieve your dream IT career with detailed steps, resources, and projects
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-8">
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                Select Your Dream Career
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {careerOptions.map((option) => (
                  <motion.button
                    key={option.name}
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCareerGoal(option.name)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      careerGoal === option.name
                        ? 'border-transparent bg-gradient-to-r ' + option.color + ' text-white shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`mb-3 p-3 rounded-xl ${
                        careerGoal === option.name 
                          ? 'bg-white/20' 
                          : 'bg-gray-100'
                      }`}>
                        {option.icon}
                      </div>
                      <h3 className={`font-semibold ${
                        careerGoal === option.name ? 'text-white' : 'text-gray-800'
                      }`}>{option.name}</h3>
                      <p className={`text-xs mt-1 ${
                        careerGoal === option.name ? 'text-white/80' : 'text-gray-500'
                      }`}>{option.category}</p>
                    </div>
                  </motion.button>
                ))}
                
                <motion.button
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCareerGoal('Other')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    careerGoal === 'Other'
                      ? 'border-transparent bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`mb-3 p-3 rounded-xl ${
                      careerGoal === 'Other' 
                        ? 'bg-white/20' 
                        : 'bg-gray-100'
                    }`}>
                      <User className={
                        careerGoal === 'Other' ? 'text-white' : 'text-gray-600'
                      } size={20} />
                    </div>
                    <h3 className={`font-semibold ${
                      careerGoal === 'Other' ? 'text-white' : 'text-gray-800'
                    }`}>Other</h3>
                    <p className={`text-xs mt-1 ${
                      careerGoal === 'Other' ? 'text-white/80' : 'text-gray-500'
                    }`}>Custom Path</p>
                  </div>
                </motion.button>
              </div>
              
              {careerGoal === 'Other' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Your Custom Career Goal
                  </label>
                  <input
                    type="text"
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    placeholder="e.g., Game Developer, Blockchain Engineer, IoT Specialist..."
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  />
                </motion.div>
              )}
            </div>
            
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                Current Skills (Optional)
              </label>
              <textarea
                value={currentSkills}
                onChange={(e) => setCurrentSkills(e.target.value)}
                placeholder="List your current skills, separated by commas (e.g., HTML, CSS, JavaScript)..."
                rows={3}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateRoadmap}
              disabled={isLoading || (!careerGoal || (careerGoal === 'Other' && !customGoal))}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-3 h-6 w-6 animate-spin" />
                  Generating Your Personalized Roadmap...
                </>
              ) : (
                <>
                  <Zap className="mr-3 h-6 w-6" />
                  Generate My Career Roadmap
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-purple-800 p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="mr-4 p-3 bg-white/20 rounded-2xl">
                {roadmap.icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{roadmap.careerGoal}</h1>
                <p className="text-blue-100">{roadmap.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={resetRoadmap}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all flex items-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                New Roadmap
              </button>
            </div>
          </div>
          
          {/* Stats */}
          {roadmap.stats && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 p-4 rounded-xl">
                <div className="flex items-center">
                  <Calendar className="mr-3 text-blue-200" size={20} />
                  <div>
                    <p className="text-sm text-blue-100">Duration</p>
                    <p className="font-bold">{roadmap.stats.duration}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <div className="flex items-center">
                  <FolderOpen className="mr-3 text-green-200" size={20} />
                  <div>
                    <p className="text-sm text-green-100">Projects</p>
                    <p className="font-bold">{roadmap.stats.projects}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <div className="flex items-center">
                  <Code className="mr-3 text-purple-200" size={20} />
                  <div>
                    <p className="text-sm text-purple-100">Key Skills</p>
                    <p className="font-bold text-sm">MERN Stack</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Skills Tags */}
          <div className="mt-6">
            <p className="text-sm text-blue-100 mb-2">Key Skills You'll Master:</p>
            <div className="flex flex-wrap gap-2">
              {roadmap.skills.slice(0, 6).map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {skill}
                </span>
              ))}
              {roadmap.skills.length > 6 && (
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  +{roadmap.skills.length - 6} more
                </span>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Your Progress</span>
              <span>{roadmap.progress}%</span>
            </div>
            <div className="h-4 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${roadmap.progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
        
        {/* Steps */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Learning Journey</h2>
          
          <div className="space-y-6">
            {roadmap.roadmap.map((step, index) => {
              const isExpanded = expandedStep === step.id;
              const isCompleted = completedSteps.has(step.id);
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-2xl overflow-hidden transition-all ${
                    isCompleted 
                      ? 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Step Header */}
                  <div 
                    className={`p-5 cursor-pointer flex items-start ${
                      isCompleted ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 'bg-white'
                    }`}
                    onClick={() => toggleStepExpansion(step.id)}
                  >
                    <div className="mr-4 mt-1">
                      {isCompleted ? (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                      ) : (
                        <div 
                          className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStepCompletion(step.id);
                          }}
                        >
                          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center">
                          <div className="mr-3 p-2 bg-gray-100 rounded-lg">
                            {step.icon}
                          </div>
                          <div>
                            <h3 className={`font-bold text-lg ${
                              isCompleted ? 'text-green-800 line-through' : 'text-gray-800'
                            }`}>
                              Month {index + 1}: {step.title}
                            </h3>
                            <p className="text-gray-600">{step.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="inline-flex items-center text-sm text-gray-600 bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-1 rounded-full">
                            <Clock className="mr-1 h-4 w-4" />
                            {step.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      {isExpanded ? (
                        <ChevronUp className="h-6 w-6 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-6 w-6 text-gray-500" />
                      )}
                    </div>
                  </div>
                  
                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-200"
                      >
                        <div className="p-5 space-y-6">
                          {/* Skills */}
                          <div>
                            <h4 className="font-bold text-gray-800 mb-3 flex items-center text-lg">
                              <Award className="mr-2 h-5 w-5 text-blue-600" />
                              Skills You'll Master
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {step.skills.map((skill, skillIndex) => (
                                <span
                                  key={skillIndex}
                                  className="px-3 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 rounded-full text-sm font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {/* Resources */}
                          <div>
                            <h4 className="font-bold text-gray-800 mb-3 flex items-center text-lg">
                              <BookOpen className="mr-2 h-5 w-5 text-purple-600" />
                              Best Learning Resources
                            </h4>
                            {step.resources.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {step.resources.map((resource, resourceIndex) => (
                                  <a
                                    key={resourceIndex}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-gradient-to-r from-blue-50 to-cyan-50 transition-all flex items-start"
                                  >
                                    <div className="mr-3 mt-1 text-blue-600">
                                      <BookOpen size={16} />
                                    </div>
                                    <div>
                                      <h5 className="font-medium text-gray-800">{resource.title}</h5>
                                      <p className="text-sm text-gray-600 mt-1">Click to access resource</p>
                                    </div>
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 italic">Resources will be personalized based on your learning style</p>
                            )}
                          </div>
                          
                          {/* Projects */}
                          <div>
                            <h4 className="font-bold text-gray-800 mb-3 flex items-center text-lg">
                              <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                              Hands-on Projects
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {step.projects.map((project, projectIndex) => (
                                <div key={projectIndex} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                                  <div className="flex items-start">
                                    <div className="mr-3 mt-1 text-green-600">
                                      <FolderOpen size={16} />
                                    </div>
                                    <div>
                                      <h5 className="font-bold text-gray-800">{project.title}</h5>
                                      <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Milestones */}
                          <div>
                            <h4 className="font-bold text-gray-800 mb-3 flex items-center text-lg">
                              <Medal className="mr-2 h-5 w-5 text-amber-600" />
                              Milestones to Achieve
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {step.milestones.map((milestone, milestoneIndex) => (
                                <div key={milestoneIndex} className="flex items-start p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                                  <div className="mr-3 mt-1 text-amber-600">
                                    <Trophy size={16} />
                                  </div>
                                  <span className="text-gray-700">{milestone}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Complete Button */}
                          <div className="pt-4">
                            {!isCompleted ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markStepAsComplete(step.id);
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all flex items-center shadow-md"
                              >
                                <CheckCircle className="mr-2 h-5 w-5" />
                                Mark as Complete
                              </button>
                            ) : (
                              <div className="flex items-center text-green-700 bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-xl">
                                <CheckCircle className="mr-2 h-5 w-5" />
                                <span className="font-medium">Completed! Great job!</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
          
          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: roadmap.roadmap.length * 0.1 }}
            className="mt-8 p-6 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl border border-amber-200"
          >
            <h3 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
              <Lightbulb className="mr-2 h-5 w-5 text-amber-600" />
              Pro Tips for Success
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roadmap.tips.map((tip, index) => (
                <div key={index} className="flex items-start p-3 bg-white rounded-lg border border-amber-100 shadow-sm">
                  <div className="mr-3 mt-1 text-amber-600">
                    <Crown size={16} />
                  </div>
                  <span className="text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Completion Message */}
          {roadmap.progress === 100 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-8 p-6 bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl text-white text-center shadow-xl"
            >
              <div className="flex justify-center mb-4">
                <Trophy size={48} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Congratulations! 🎉</h3>
              <p className="text-lg">You've completed your journey to becoming a {roadmap.careerGoal}!</p>
              <p className="mt-2 opacity-90">Now it's time to showcase your skills and start applying for jobs.</p>
              <button 
                onClick={resetRoadmap}
                className="mt-4 px-6 py-3 bg-white text-emerald-700 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-md"
              >
                Create Another Roadmap
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CareerRoadmap;