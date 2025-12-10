import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  Zap,
  Code,
  Palette,
  Smartphone,
  BarChart,
  TrendingUp,
  Star,
  Bookmark,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Search,
  BookOpen,
  Layers,
  Globe,
  Database,
  Shield,
  Brain,
  Gamepad2,
  Cloud,
  Server,
  Lock,
  Cpu,
  Terminal,
  GitBranch,
  Wifi,
  Smartphone as Mobile,
  Users,
  Eye,
  Music,
  Camera,
  Video,
  MessageSquare,
  ShoppingCart,
  CreditCard,
  FileText,
  PieChart,
  LineChart,
  FileCode,
  Workflow,
  Bug,
  Network,
  Key,
  Scan,
  ShieldAlert,
  Clipboard,
  TestTube,
  Code2,
  Bot,
  Sparkles,
  Moon,
  Sun,
  Calendar,
  Bell,
  Map,
  Upload,
  Download,
  Hash,
  Fingerprint,
} from "lucide-react";

/**
 * AI-Enhanced ProjectSuggestions with:
 * - 10 projects per domain (Web, Mobile, Data, Tooling, Security)
 * - Unique light/dark purple theme
 * - Detailed step instructions with "How to do it" sections
 * - Light/Dark mode toggle
 * - AI-powered personalized recommendations
 * - AI-generated project suggestions
 */

const DOMAIN_ICONS = {
  "Web Development": Code,
  "Mobile Development": Mobile,
  "Data Visualization": PieChart,
  "Software Tooling": Terminal,
  "Cybersecurity": Shield,
  "AI/ML": Brain,
  "Game Development": Gamepad2,
  "IoT": Wifi,
  "Cloud/DevOps": Cloud,
  "Blockchain": Hash,
};

const ICONS = {
  ...DOMAIN_ICONS,
  Code, TrendingUp, BarChart, Smartphone, Palette, Zap, Star, BookOpen, Layers, Globe,
  Database, Shield, Brain, Gamepad2, Cloud, Server, Lock, Cpu, Terminal, GitBranch,
  Wifi, Users, Eye, Music, Camera, Video, MessageSquare, ShoppingCart, CreditCard,
  FileText, PieChart, LineChart, FileCode, Workflow, Bug, Network, Key, Scan,
  ShieldAlert, Clipboard, TestTube, Code2, Bot, Sparkles, Calendar, Bell, Map,
  Upload, Download, Hash, Fingerprint
};

// Extended project database with 10 projects per domain
const domains = [
  "Web Development",
  "Mobile Development",
  "Data Visualization",
  "Software Tooling",
  "Cybersecurity"
];

// Helper functions for generating mock projects
const getProjectTitle = (domain, index) => {
  const titles = {
    "Web Development": [
      "E-commerce Platform",
      "Social Media Dashboard",
      "Real-time Chat App",
      "Content Management System",
      "Learning Platform",
      "Booking System",
      "Portfolio Builder",
      "Recipe Sharing App",
      "Fitness Tracker",
      "Event Management System"
    ],
    "Mobile Development": [
      "Expense Tracker",
      "Meditation App",
      "Food Delivery",
      "Language Learning",
      "Travel Planner",
      "Health Monitor",
      "Music Player",
      "Photo Editor",
      "Task Manager Pro",
      "Weather Forecast"
    ],
    "Data Visualization": [
      "Sales Analytics Dashboard",
      "COVID-19 Tracker",
      "Financial Portfolio Visualizer",
      "Social Media Analytics",
      "Climate Change Map",
      "Sports Performance Analyzer",
      "Stock Market Monitor",
      "Population Density Map",
      "Energy Consumption Dashboard",
      "Website Traffic Analyzer"
    ],
    "Software Tooling": [
      "API Testing Tool",
      "Code Formatter",
      "Dependency Manager",
      "Log Analyzer",
      "Performance Profiler",
      "Database Migration Tool",
      "File Organizer",
      "Password Generator",
      "System Monitor",
      "Backup Automation Tool"
    ],
    "Cybersecurity": [
      "Vulnerability Scanner",
      "Password Strength Checker",
      "Network Monitor",
      "Encryption Tool",
      "Malware Detector",
      "Firewall Analyzer",
      "Phishing Detector",
      "Security Audit Tool",
      "Data Anonymizer",
      "Incident Response System"
    ]
  };
  
  return titles[domain]?.[index - 1] || `${domain} Solution`;
};

const getProjectDescription = (domain, index) => {
  const descriptions = {
    "Web Development": [
      "Build a responsive e-commerce platform with modern UI and secure payment integration.",
      "Create a social media analytics dashboard with real-time updates and interactive charts.",
      "Develop a real-time chat application using WebSockets with file sharing and groups.",
      "Build a headless CMS with customizable content types and role-based access.",
      "Create an interactive learning platform with video lessons, quizzes, and progress tracking.",
      "Develop a booking system with calendar integration, reminders, and payment processing.",
      "Build a portfolio generator with multiple templates and hosting capabilities.",
      "Create a recipe sharing community with user ratings, reviews, and meal planning.",
      "Develop a fitness tracker with workout plans, progress charts, and social features.",
      "Build an event management system with ticketing, scheduling, and attendee management."
    ],
    "Mobile Development": [
      "Track expenses with categories, reports, and budget planning features.",
      "Guided meditation app with progress tracking and relaxation techniques.",
      "Food ordering app with restaurant listings, reviews, and real-time tracking.",
      "Interactive language learning with speech recognition and progress tracking.",
      "Travel planning with itinerary, budget, and local recommendations.",
      "Health monitoring with vital signs tracking and doctor appointment scheduling.",
      "Music streaming with playlists, recommendations, and offline playback.",
      "Photo editing with filters, effects, and collage creation tools.",
      "Advanced task management with teams, deadlines, and productivity analytics.",
      "Weather app with forecasts, alerts, and location-based recommendations."
    ]
  };
  
  return descriptions[domain]?.[index - 1] || `A comprehensive ${domain.toLowerCase()} project with modern features.`;
};

const getDifficulty = (index) => {
  const difficulties = ["Beginner", "Intermediate", "Advanced", "Expert"];
  return difficulties[Math.min(index - 1, difficulties.length - 1)];
};

const getSkills = (domain) => {
  const skillSets = {
    "Web Development": ["React", "Node.js", "MongoDB", "Express", "Tailwind", "TypeScript"],
    "Mobile Development": ["React Native", "Firebase", "Redux", "iOS/Android", "APIs"],
    "Data Visualization": ["D3.js", "Python", "Chart.js", "SQL", "Data Analysis"],
    "Software Tooling": ["Node.js", "CLI", "Automation", "Testing", "Documentation"],
    "Cybersecurity": ["Python", "Networking", "Encryption", "Linux", "Security"]
  };
  
  return skillSets[domain] || ["JavaScript", "Problem Solving", "Design"];
};

const getIconColor = (domainIndex, projectIndex) => {
  const colorClasses = [
    "text-purple-600",
    "text-violet-600",
    "text-fuchsia-600",
    "text-indigo-600",
    "text-pink-600",
    "text-rose-600",
    "text-amber-600",
    "text-emerald-600",
    "text-cyan-600",
    "text-blue-600"
  ];
  
  return colorClasses[(domainIndex * 10 + projectIndex) % colorClasses.length];
};

const generateSteps = (domain, projectIndex) => {
  const baseSteps = [
    {
      title: "Project Planning & Requirements",
      detail: "Define project scope, create wireframes, and list technical requirements.",
      instructions: [
        "Brainstorm features and create user stories",
        "Sketch wireframes using Figma or similar tool",
        "Define MVP scope and stretch goals",
        "Create a project timeline and milestones",
        "Set up project management tools (Trello, Jira)"
      ]
    },
    {
      title: "Technology Stack & Setup",
      detail: "Choose appropriate technologies and set up development environment.",
      instructions: [
        "Research and select technology stack",
        "Set up development environment",
        "Initialize version control (Git)",
        "Configure project structure",
        "Set up linting and formatting"
      ]
    },
    {
      title: "Core Architecture Design",
      detail: "Design system architecture, database schema, and API structure.",
      instructions: [
        "Design database schema/relationships",
        "Plan API endpoints and data flow",
        "Set up authentication/authorization",
        "Design component hierarchy",
        "Choose state management solution"
      ]
    },
    {
      title: "Development: Core Features",
      detail: "Implement main features and functionality based on requirements.",
      instructions: [
        "Implement authentication system",
        "Create main database models",
        "Build core API endpoints",
        "Develop main UI components",
        "Connect frontend to backend"
      ]
    },
    {
      title: "Testing & Quality Assurance",
      detail: "Write tests, perform QA, and fix bugs before deployment.",
      instructions: [
        "Write unit and integration tests",
        "Perform manual testing",
        "Fix identified bugs",
        "Optimize performance",
        "Conduct security review"
      ]
    },
    {
      title: "Deployment & Documentation",
      detail: "Deploy application and create comprehensive documentation.",
      instructions: [
        "Set up hosting environment",
        "Configure CI/CD pipeline",
        "Deploy to production",
        "Write user documentation",
        "Create developer guide"
      ]
    }
  ];
  
  // Add domain-specific steps
  const domainSpecific = getDomainSpecificSteps(domain, projectIndex);
  return [...domainSpecific, ...baseSteps];
};

const getDomainSpecificSteps = (domain, projectIndex) => {
  const domainSteps = {
    "Web Development": [
      {
        title: "Responsive UI Development",
        detail: "Create mobile-first responsive layouts with modern CSS.",
        instructions: [
          "Design mobile-first responsive layouts",
          "Implement CSS Grid/Flexbox",
          "Add responsive typography",
          "Test on multiple devices",
          "Optimize images and assets"
        ]
      },
      {
        title: "Backend API Development",
        detail: "Build RESTful API with proper error handling and validation.",
        instructions: [
          "Set up Express/Fastify server",
          "Implement CRUD operations",
          "Add input validation",
          "Set up error handling middleware",
          "Implement rate limiting"
        ]
      }
    ],
    "Mobile Development": [
      {
        title: "Cross-platform UI Development",
        detail: "Build responsive mobile interfaces for iOS and Android.",
        instructions: [
          "Design platform-specific UI",
          "Implement navigation flows",
          "Add gesture support",
          "Optimize for different screen sizes",
          "Test on emulators and devices"
        ]
      },
      {
        title: "Native Feature Integration",
        detail: "Integrate device features like camera, GPS, and notifications.",
        instructions: [
          "Request necessary permissions",
          "Implement camera/GPS features",
          "Add push notifications",
          "Handle offline functionality",
          "Optimize battery usage"
        ]
      }
    ],
    "Data Visualization": [
      {
        title: "Data Processing Pipeline",
        detail: "Set up data collection, cleaning, and transformation processes.",
        instructions: [
          "Collect data from sources",
          "Clean and preprocess data",
          "Transform data formats",
          "Handle missing values",
          "Prepare for visualization"
        ]
      },
      {
        title: "Interactive Chart Implementation",
        detail: "Create interactive visualizations with tooltips and filters.",
        instructions: [
          "Choose charting library",
          "Implement basic charts",
          "Add interactivity (tooltips, zoom)",
          "Implement filtering controls",
          "Add animation transitions"
        ]
      }
    ],
    "Software Tooling": [
      {
        title: "Command Line Interface",
        detail: "Design and implement intuitive CLI with helpful commands.",
        instructions: [
          "Design command structure",
          "Implement argument parsing",
          "Add help documentation",
          "Implement progress indicators",
          "Add color and formatting"
        ]
      },
      {
        title: "Tool Configuration System",
        detail: "Create flexible configuration system with defaults and overrides.",
        instructions: [
          "Design config file format",
          "Implement config loading",
          "Add validation rules",
          "Support environment variables",
          "Create config generator"
        ]
      }
    ],
    "Cybersecurity": [
      {
        title: "Security Assessment",
        detail: "Perform security analysis and identify potential vulnerabilities.",
        instructions: [
          "Conduct threat modeling",
          "Identify attack vectors",
          "Analyze security requirements",
          "Review existing security measures",
          "Document security findings"
        ]
      },
      {
        title: "Security Implementation",
        detail: "Implement security measures and protective mechanisms.",
        instructions: [
          "Implement encryption",
          "Add authentication/authorization",
          "Set up logging/monitoring",
          "Implement input validation",
          "Add security headers"
        ]
      }
    ]
  };
  
  return domainSteps[domain] || [];
};

// Generate mock projects
const generateProjects = () => {
  const allProjects = [];
  
  domains.forEach((domain, domainIndex) => {
    const domainProjects = [];
    
    for (let i = 1; i <= 10; i++) {
      const projectId = `${domainIndex + 1}${i}`;
      const iconKeys = Object.keys(DOMAIN_ICONS);
      const iconKey = iconKeys[domainIndex % iconKeys.length];
      
      const project = {
        id: projectId,
        title: `Project ${i}: ${domain} ${getProjectTitle(domain, i)}`,
        description: getProjectDescription(domain, i),
        category: domain,
        difficulty: getDifficulty(i),
        estimatedTime: `${Math.floor(Math.random() * 4) + 1}-${Math.floor(Math.random() * 6) + 2} weeks`,
        skills: getSkills(domain),
        icon: iconKey,
        iconColor: getIconColor(domainIndex, i),
        xp: Math.floor(Math.random() * 300) + 200,
        steps: generateSteps(domain, i),
      };
      
      domainProjects.push(project);
    }
    
    allProjects.push(...domainProjects);
  });
  
  return allProjects;
};

const mockProjects = generateProjects();

const categories = ["All", ...domains];

const storageKeys = {
  saved: "ps_saved_projects_v3",
  stepProgress: "ps_step_progress_v3",
};

// Theme colors
const lightTheme = {
  bg: "bg-gradient-to-br from-purple-50 to-fuchsia-50",
  card: "bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl border border-purple-100",
  primaryButton: "px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold shadow-lg shadow-purple-500/30 hover:from-purple-700 hover:to-fuchsia-700 transition duration-300",
  secondaryButton: "px-4 py-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition duration-200",
  accentText: "text-purple-700",
  mutedText: "text-slate-600",
  border: "border-purple-200",
  hover: "hover:shadow-purple-200",
};

const darkTheme = {
  bg: "bg-gradient-to-br from-purple-900 to-fuchsia-900",
  card: "bg-purple-800/90 backdrop-blur-sm shadow-lg rounded-2xl border border-purple-700",
  primaryButton: "px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-bold shadow-lg shadow-purple-500/50 hover:from-purple-600 hover:to-fuchsia-600 transition duration-300",
  secondaryButton: "px-4 py-2 rounded-lg bg-purple-700 text-purple-100 hover:bg-purple-600 transition duration-200",
  accentText: "text-purple-200",
  mutedText: "text-purple-300",
  border: "border-purple-600",
  hover: "hover:shadow-purple-800",
};

// AI Service for Gemini API integration
class AIService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    // Using the same configuration as your working curl command
    this.apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  }

  async generateProjectSuggestions(userSkills, interests) {
    try {
      const prompt = `Generate 3 personalized project suggestions for a developer with skills in ${userSkills.join(', ')} and interests in ${interests.join(', ')}. 
      Each project should include:
      1. A catchy title
      2. A brief description (under 100 words)
      3. Estimated difficulty level (Beginner, Intermediate, Advanced)
      4. Estimated time to complete
      5. Key skills that will be used
      6. Potential learning outcomes
      
      Format the response as a JSON array with these fields for each project: title, description, difficulty, time, skills, outcomes`;

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const textResponse = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response
      const jsonMatch = textResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return [];
    } catch (error) {
      console.error('Error generating AI project suggestions:', error);
      return [];
    }
  }

  async getProjectRecommendations(savedProjects, completedSteps) {
    try {
      const prompt = `Based on the user's saved projects: ${savedProjects.join(', ')} and completed steps: ${completedSteps}, 
      recommend 3 new projects that would be a good next step for their learning journey. 
      Each recommendation should include:
      1. A title
      2. A brief description
      3. Why it's a good fit based on their progress
      4. New skills they'll learn
      
      Format the response as a JSON array with these fields for each recommendation: title, description, reason, skills`;

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const textResponse = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response
      const jsonMatch = textResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return [];
    } catch (error) {
      console.error('Error getting AI project recommendations:', error);
      return [];
    }
  }
}

const AIProjectSuggestions = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [savedProjects, setSavedProjects] = useState(new Set());
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [stepState, setStepState] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [activeDomain, setActiveDomain] = useState("All");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [userSkills, setUserSkills] = useState(["React", "JavaScript"]);
  const [userInterests, setUserInterests] = useState(["Web Development", "AI/ML"]);

  // Initialize AI service with the provided API key
  const aiService = new AIService("AIzaSyCV3DcNTPm5i3pg1QppuhrH395v50yCLjg");  useEffect(() => {
    setProjects(mockProjects);
    const s = localStorage.getItem(storageKeys.saved);
    if (s) setSavedProjects(new Set(JSON.parse(s)));
    const sp = localStorage.getItem(storageKeys.stepProgress);
    if (sp) {
      try {
        setStepState(JSON.parse(sp));
      } catch {
        setStepState({});
      }
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKeys.saved, JSON.stringify([...savedProjects]));
  }, [savedProjects]);

  useEffect(() => {
    localStorage.setItem(storageKeys.stepProgress, JSON.stringify(stepState));
  }, [stepState]);

  const theme = darkMode ? darkTheme : lightTheme;

  const toggleSaveProject = (projectId) => {
    setSavedProjects((prev) => {
      const copy = new Set(prev);
      if (copy.has(projectId)) copy.delete(projectId);
      else copy.add(projectId);
      return copy;
    });
  };

  const openStartFlow = (project) => {
    setActiveProject(project);
    setStepState((prev) => {
      if (prev[project.id]) return prev;
      return {
        ...prev,
        [project.id]: { completedSteps: [], currentIndex: 0 }
      };
    });
  };

  const closeStartFlow = () => setActiveProject(null);

  const markStepDone = (projectId, stepIndex) => {
    setStepState((prev) => {
      const proj = prev[projectId] || { completedSteps: [], currentIndex: 0 };
      const already = new Set(proj.completedSteps);
      if (already.has(stepIndex)) already.delete(stepIndex);
      else already.add(stepIndex);
      return {
        ...prev,
        [projectId]: { ...proj, completedSteps: [...already] }
      };
    });
  };

  const goToIndex = (projectId, idx) => {
    setStepState((prev) => {
      const proj = prev[projectId] || { completedSteps: [], currentIndex: 0 };
      return { ...prev, [projectId]: { ...proj, currentIndex: idx } };
    });
  };

  // Generate AI project suggestions
  const generateAISuggestions = async () => {
    setLoadingAI(true);
    try {
      const suggestions = await aiService.generateProjectSuggestions(userSkills, userInterests);
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error("Error generating AI suggestions:", error);
    } finally {
      setLoadingAI(false);
    }
  };

  // Get AI project recommendations
  const getAIRecommendations = async () => {
    setLoadingAI(true);
    try {
      const savedProjectIds = Array.from(savedProjects);
      const completedStepsCount = Object.values(stepState).reduce((total, project) => 
        total + (project.completedSteps?.length || 0), 0);
      
      const recommendations = await aiService.getProjectRecommendations(
        savedProjectIds, 
        completedStepsCount
      );
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error("Error getting AI recommendations:", error);
    } finally {
      setLoadingAI(false);
    }
  };

  const filteredProjects = useMemo(() => {
    let result = projects;

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(lowerSearch) ||
          p.description.toLowerCase().includes(lowerSearch) ||
          p.skills.some((s) => s.toLowerCase().includes(lowerSearch))
      );
    }

    return result;
  }, [projects, selectedCategory, searchTerm]);

  const domainStats = useMemo(() => {
    const stats = {};
    domains.forEach(domain => {
      stats[domain] = projects.filter(p => p.category === domain).length;
    });
    return stats;
  }, [projects]);

  return (
    <div className={`min-h-screen p-4 md:p-6 transition-colors duration-300 ${theme.bg}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`p-6 md:p-8 rounded-2xl ${darkMode ? 'bg-purple-800/50' : 'bg-white/50'} mb-6 md:mb-8 backdrop-blur-sm border ${theme.border}`}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start md:items-center gap-4 md:gap-6">
              <div className={`p-3 rounded-xl ${darkMode ? 'bg-purple-700' : 'bg-white'} shadow-lg`}>
                <Lightbulb className={darkMode ? "text-purple-200" : "text-purple-600"} size={28} />
              </div>
              <div>
                <h1 className={`text-2xl md:text-4xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  AI-Powered Project Roadmap Hub
                </h1>
                <p className={`mt-2 ${darkMode ? 'text-purple-200' : 'text-slate-700'}`}>
                  {projects.length} detailed projects with step-by-step guidance + AI recommendations
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${darkMode ? 'bg-purple-700' : 'bg-white'} shadow-md flex flex-col items-center`}>
                <span className={`text-sm font-semibold ${darkMode ? 'text-purple-200' : 'text-slate-700'}`}>Saved</span>
                <strong className={`text-xl ${darkMode ? 'text-purple-100' : 'text-purple-600'}`}>{savedProjects.size}</strong>
              </div>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-xl ${darkMode ? 'bg-purple-700 hover:bg-purple-600' : 'bg-white hover:bg-slate-50'} shadow-md transition duration-200`}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <Sun className="text-amber-300" size={24} /> : <Moon className="text-purple-600" size={24} />}
              </button>
            </div>
          </div>

          {/* Domain Quick Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
            {domains.map(domain => (
              <button
                key={domain}
                onClick={() => {
                  setSelectedCategory(domain);
                  setActiveDomain(domain);
                }}
                className={`p-3 rounded-lg text-center transition duration-200 ${
                  activeDomain === domain 
                    ? (darkMode 
                        ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg' 
                        : 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-lg')
                    : (darkMode 
                        ? 'bg-purple-800/50 text-purple-200 hover:bg-purple-700' 
                        : 'bg-white/80 text-slate-700 hover:bg-white')
                }`}
              >
                <div className="font-bold">{domainStats[domain] || 0}</div>
                <div className="text-xs opacity-90">{domain.split(' ')[0]}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* AI Features Section */}
        <div className={`mb-8 p-6 rounded-2xl border ${theme.border} backdrop-blur-sm ${
          darkMode ? 'bg-purple-800/30' : 'bg-white/70'
        }`}>
          <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            <Bot className={darkMode ? "text-purple-300" : "text-purple-600"} size={24} />
            AI-Powered Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personalized Suggestions */}
            <div className={`p-4 rounded-xl border ${theme.border} ${
              darkMode ? 'bg-purple-800/20' : 'bg-purple-50/50'
            }`}>
              <h3 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Personalized Project Suggestions
              </h3>
              <p className={`text-sm mb-4 ${darkMode ? 'text-purple-300' : 'text-slate-700'}`}>
                Get AI-generated project ideas based on your skills and interests.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <input
                  type="text"
                  value={userSkills.join(', ')}
                  onChange={(e) => setUserSkills(e.target.value.split(',').map(s => s.trim()))}
                  placeholder="Your skills (comma separated)"
                  className={`flex-1 p-2 text-sm rounded-lg border ${
                    darkMode 
                      ? 'bg-purple-900/50 border-purple-600 text-white' 
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
                <input
                  type="text"
                  value={userInterests.join(', ')}
                  onChange={(e) => setUserInterests(e.target.value.split(',').map(i => i.trim()))}
                  placeholder="Your interests (comma separated)"
                  className={`flex-1 p-2 text-sm rounded-lg border ${
                    darkMode 
                      ? 'bg-purple-900/50 border-purple-600 text-white' 
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>
              
              <button
                onClick={generateAISuggestions}
                disabled={loadingAI}
                className={`w-full py-2 rounded-lg font-medium transition duration-200 flex items-center justify-center gap-2 ${
                  loadingAI
                    ? (darkMode 
                        ? 'bg-purple-800 text-purple-400 cursor-not-allowed' 
                        : 'bg-purple-100 text-purple-400 cursor-not-allowed')
                    : (darkMode 
                        ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white hover:from-purple-700 hover:to-fuchsia-700' 
                        : 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white hover:from-purple-600 hover:to-fuchsia-600')
                }`}
              >
                {loadingAI ? (
                  <>
                    <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Generate Suggestions
                  </>
                )}
              </button>
            </div>
            
            {/* Smart Recommendations */}
            <div className={`p-4 rounded-xl border ${theme.border} ${
              darkMode ? 'bg-purple-800/20' : 'bg-purple-50/50'
            }`}>
              <h3 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Smart Project Recommendations
              </h3>
              <p className={`text-sm mb-4 ${darkMode ? 'text-purple-300' : 'text-slate-700'}`}>
                Get AI-recommended projects based on your progress and saved items.
              </p>
              
              <div className="mb-4">
                <div className={`text-sm p-3 rounded-lg ${
                  darkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700'
                }`}>
                  Based on {savedProjects.size} saved projects and {Object.values(stepState).reduce((total, project) => total + (project.completedSteps?.length || 0), 0)} completed steps
                </div>
              </div>
              
              <button
                onClick={getAIRecommendations}
                disabled={loadingAI || savedProjects.size === 0}
                className={`w-full py-2 rounded-lg font-medium transition duration-200 flex items-center justify-center gap-2 ${
                  loadingAI || savedProjects.size === 0
                    ? (darkMode 
                        ? 'bg-purple-800 text-purple-400 cursor-not-allowed' 
                        : 'bg-purple-100 text-purple-400 cursor-not-allowed')
                    : (darkMode 
                        ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white hover:from-purple-700 hover:to-fuchsia-700' 
                        : 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white hover:from-purple-600 hover:to-fuchsia-600')
                }`}
              >
                {loadingAI ? (
                  <>
                    <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain size={16} />
                    Get Recommendations
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* AI Results */}
          {(aiSuggestions.length > 0 || aiRecommendations.length > 0) && (
            <div className="mt-6">
              <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                AI Results
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {aiSuggestions.length > 0 && (
                  <div>
                    <h4 className={`font-semibold mb-3 flex items-center gap-2 ${
                      darkMode ? 'text-purple-300' : 'text-purple-700'
                    }`}>
                      <Sparkles size={16} />
                      Personalized Suggestions
                    </h4>
                    <div className="space-y-4">
                      {aiSuggestions.map((suggestion, index) => (
                        <div 
                          key={index} 
                          className={`p-4 rounded-xl border ${theme.border} ${
                            darkMode ? 'bg-purple-900/30' : 'bg-white'
                          }`}
                        >
                          <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            {suggestion.title}
                          </h5>
                          <p className={`text-sm mt-2 ${darkMode ? 'text-purple-200' : 'text-slate-700'}`}>
                            {suggestion.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className={`px-2 py-1 text-xs rounded ${
                              darkMode 
                                ? 'bg-purple-800 text-purple-300' 
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {suggestion.difficulty}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded ${
                              darkMode 
                                ? 'bg-purple-800 text-purple-300' 
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {suggestion.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {aiRecommendations.length > 0 && (
                  <div>
                    <h4 className={`font-semibold mb-3 flex items-center gap-2 ${
                      darkMode ? 'text-purple-300' : 'text-purple-700'
                    }`}>
                      <Brain size={16} />
                      Smart Recommendations
                    </h4>
                    <div className="space-y-4">
                      {aiRecommendations.map((recommendation, index) => (
                        <div 
                          key={index} 
                          className={`p-4 rounded-xl border ${theme.border} ${
                            darkMode ? 'bg-purple-900/30' : 'bg-white'
                          }`}
                        >
                          <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            {recommendation.title}
                          </h5>
                          <p className={`text-sm mt-2 ${darkMode ? 'text-purple-200' : 'text-slate-700'}`}>
                            {recommendation.description}
                          </p>
                          <div className={`text-xs mt-2 italic ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                            {recommendation.reason}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex-1 relative"
          >
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-purple-400' : 'text-slate-400'}`} size={20} />
            <input
              type="text"
              placeholder="Search projects by title, description, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full p-3 pl-10 rounded-xl border ${darkMode ? 'bg-purple-800/50 border-purple-600 text-white placeholder-purple-400 focus:ring-purple-500 focus:border-purple-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-purple-500 focus:border-purple-500'} shadow-sm focus:ring-2 transition`}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex gap-2 overflow-x-auto pb-2 md:pb-0"
          >
            <Filter className={darkMode ? "text-purple-300" : "text-slate-700"} />
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setSelectedCategory(c);
                  setActiveDomain(c);
                }}
                className={`min-w-max px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
                  selectedCategory === c
                    ? (darkMode 
                        ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg" 
                        : "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-lg")
                    : (darkMode 
                        ? "bg-purple-800/50 text-purple-200 border border-purple-600 hover:bg-purple-700" 
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-purple-50 hover:border-purple-300")
                }`}
              >
                {c}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredProjects.map((project, idx) => {
              const isSaved = savedProjects.has(project.id);
              const Icon = ICONS[project.icon] || Code;
              const progress = stepState[project.id] ? new Set(stepState[project.id].completedSteps).size : 0;
              const totalSteps = project.steps.length;
              const progressPercent = totalSteps > 0 ? Math.round((progress / totalSteps) * 100) : 0;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.03, duration: 0.3 }}
                  layout
                  className={`${theme.card} p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 ${theme.hover}`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-700' : 'bg-white'} shadow-md border ${theme.border}`}>
                        <Icon className={`${project.iconColor}`} size={20} />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          darkMode 
                            ? project.difficulty === 'Beginner' ? 'bg-emerald-900/30 text-emerald-300' :
                              project.difficulty === 'Intermediate' ? 'bg-amber-900/30 text-amber-300' :
                              project.difficulty === 'Advanced' ? 'bg-orange-900/30 text-orange-300' :
                              'bg-rose-900/30 text-rose-300'
                            : project.difficulty === 'Beginner' ? 'bg-emerald-100 text-emerald-800' :
                              project.difficulty === 'Intermediate' ? 'bg-amber-100 text-amber-800' :
                              project.difficulty === 'Advanced' ? 'bg-orange-100 text-orange-800' :
                              'bg-rose-100 text-rose-800'
                        }`}>
                          {project.difficulty}
                        </span>
                        
                        <button
                          onClick={() => toggleSaveProject(project.id)}
                          className={`p-2 rounded-full transition duration-200 ${
                            isSaved 
                              ? (darkMode ? "bg-purple-600 text-purple-100" : "bg-purple-100 text-purple-600")
                              : (darkMode ? "text-purple-400 hover:text-purple-200 hover:bg-purple-700" : "text-slate-400 hover:text-purple-600 hover:bg-purple-50")
                          }`}
                          aria-label={isSaved ? "Unsave" : "Save"}
                        >
                          <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                        </button>
                      </div>
                    </div>

                    <h3 className={`text-lg font-bold mt-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {project.title}
                    </h3>
                    
                    <p className={`text-xs ${darkMode ? 'text-purple-300' : 'text-slate-600'} mt-1`}>
                      {project.category} • {project.estimatedTime}
                    </p>

                    <p className={`text-sm ${darkMode ? 'text-purple-200' : 'text-slate-700'} mt-3 line-clamp-2`}>
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.skills.slice(0, 3).map((s, i) => (
                        <span
                          key={i}
                          className={`px-2 py-1 text-xs rounded-lg ${
                            darkMode 
                              ? 'bg-purple-900/50 text-purple-300 border border-purple-700'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}
                        >
                          {s}
                        </span>
                      ))}
                      {project.skills.length > 3 && (
                        <span className={`px-2 py-1 text-xs rounded-lg ${
                          darkMode 
                            ? 'bg-purple-900/30 text-purple-400'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          +{project.skills.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className={darkMode ? "text-purple-300" : "text-slate-600"}>
                          Progress: {progressPercent}%
                        </span>
                        <span className={`flex items-center gap-1 ${darkMode ? "text-amber-300" : "text-amber-600"}`}>
                          <Star size={10} className="fill-current" />
                          {project.xp} XP
                        </span>
                      </div>
                      <div className={`h-2 ${darkMode ? 'bg-purple-700' : 'bg-slate-100'} rounded-full overflow-hidden`}>
                        <motion.div
                          className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <button
                      onClick={() => openStartFlow(project)}
                      className={`w-full py-3 rounded-xl font-bold transition duration-300 ${
                        darkMode
                          ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white shadow-lg shadow-purple-500/30"
                          : "bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white shadow-lg shadow-purple-500/20"
                      }`}
                    >
                      View Roadmap ({project.steps.length} steps)
                    </button>
                  </div>
                </motion.div>
              );
            })}
            
            {filteredProjects.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full p-8 text-center rounded-2xl shadow-inner border border-purple-200"
                style={{
                  background: darkMode 
                    ? 'linear-gradient(135deg, rgba(88, 28, 135, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(216, 180, 254, 0.2) 0%, rgba(232, 121, 249, 0.1) 100%)'
                }}
              >
                <Search size={40} className={`mx-auto mb-4 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  No projects found
                </h3>
                <p className={darkMode ? 'text-purple-300' : 'text-slate-600'}>
                  Try a different search term or category
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tips Section */}
        <div className={`mt-8 p-6 rounded-2xl border ${theme.border} backdrop-blur-sm ${
          darkMode ? 'bg-purple-800/30' : 'bg-white/70'
        }`}>
          <h4 className={`font-bold text-xl mb-4 flex items-center gap-2 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            <Sparkles className={darkMode ? "text-purple-300" : "text-purple-600"} size={24} />
            Pro Tips for Success
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: GitBranch,
                title: "Version Control",
                tip: "Commit early, commit often. Use feature branches for new functionality."
              },
              {
                icon: Clipboard,
                title: "Documentation",
                tip: "Write clear README files and comment your code as you build."
              },
              {
                icon: TestTube,
                title: "Testing",
                tip: "Write tests alongside features. Aim for high test coverage."
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 rounded-xl border ${theme.border} flex gap-3 ${
                  darkMode ? 'bg-purple-800/20' : 'bg-purple-50/50'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  darkMode ? 'bg-purple-700' : 'bg-white'
                }`}>
                  <item.icon className={darkMode ? "text-purple-300" : "text-purple-600"} size={18} />
                </div>
                <div>
                  <div className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {item.title}
                  </div>
                  <div className={`text-sm mt-1 ${darkMode ? 'text-purple-300' : 'text-slate-700'}`}>
                    {item.tip}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Step Modal */}
        <AnimatePresence>
          {activeProject && (
            <StepModal
              project={activeProject}
              stepState={stepState[activeProject.id] || { completedSteps: [], currentIndex: 0 }}
              onClose={closeStartFlow}
              onToggleStep={(stepIdx) => markStepDone(activeProject.id, stepIdx)}
              onNavigate={(newIdx) => goToIndex(activeProject.id, newIdx)}
              darkMode={darkMode}
              theme={theme}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* -------------------- Enhanced Step Modal -------------------- */
const StepModal = ({ project, stepState, onClose, onToggleStep, onNavigate, darkMode, theme }) => {
  const total = project.steps.length;
  const current = Math.min(Math.max(0, stepState.currentIndex || 0), total - 1);
  const completedSet = new Set(stepState.completedSteps || []);
  const Icon = ICONS[project.icon] || Code;
  const progressPercent = Math.round((completedSet.size / total) * 100);
  const currentStep = project.steps[current];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`absolute inset-0 ${darkMode ? 'bg-purple-950' : 'bg-slate-900'}`}
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ duration: 0.4, type: "spring", damping: 25 }}
        className="relative z-50 w-full max-w-6xl max-h-[90vh] overflow-y-auto"
      >
        <div className={`rounded-2xl shadow-2xl p-4 md:p-6 ${darkMode ? 'bg-gradient-to-br from-purple-900 to-fuchsia-900' : 'bg-gradient-to-br from-white to-purple-50'}`}>
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 mb-4 border-b border-purple-200/30">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${darkMode ? 'bg-purple-800' : 'bg-white'} shadow-inner`}>
                <Icon className={project.iconColor} size={28} />
              </div>
              <div>
                <h3 className={`text-xl md:text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {project.title}
                </h3>
                <div className={`text-sm ${darkMode ? 'text-purple-300' : 'text-slate-600'} mt-1`}>
                  {project.category} • {project.difficulty} • {project.estimatedTime}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className={`text-sm font-semibold ${darkMode ? 'text-purple-300' : 'text-slate-600'}`}>
                  Progress: {progressPercent}%
                </div>
                <div className={`w-32 h-2 ${darkMode ? 'bg-purple-700' : 'bg-slate-200'} rounded-full overflow-hidden mt-1`}>
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }} 
                  />
                </div>
              </div>

              <button 
                onClick={onClose} 
                className={`p-2 rounded-full hover:bg-purple-500/20 transition ${
                  darkMode ? 'text-purple-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content: Steps List & Current Step Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Steps List */}
            <div className={`lg:col-span-2 p-4 rounded-xl border ${darkMode ? 'border-purple-600 bg-purple-800/30' : 'border-purple-300 bg-white'} max-h-[60vh] overflow-y-auto`}>
              <h4 className={`font-bold mb-4 flex justify-between items-center ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Project Steps ({completedSet.size}/{total})
                <span className={`text-xs font-normal ${darkMode ? 'text-purple-400' : 'text-slate-500'}`}>
                  Click a step for details
                </span>
              </h4>
              <div className="space-y-3">
                {project.steps.map((step, i) => {
                  const done = completedSet.has(i);
                  const isActive = i === current;

                  return (
                    <motion.div
                      key={i}
                      className={`p-4 rounded-lg cursor-pointer transition duration-200 flex items-start gap-3 ${
                        isActive 
                          ? (darkMode 
                              ? 'bg-gradient-to-r from-purple-700/50 to-fuchsia-700/50 border-2 border-purple-500 shadow-md' 
                              : 'bg-gradient-to-r from-purple-100 to-fuchsia-100 border-2 border-purple-300 shadow-md')
                          : done 
                            ? (darkMode 
                                ? 'bg-emerald-900/20 border border-emerald-700' 
                                : 'bg-emerald-50 border border-emerald-200')
                            : (darkMode 
                                ? 'bg-purple-800/50 border border-purple-600 hover:bg-purple-700/50' 
                                : 'bg-white border border-slate-200 hover:bg-slate-50')
                      }`}
                      onClick={() => onNavigate(i)}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${
                        done 
                          ? (darkMode ? 'bg-emerald-700' : 'bg-emerald-500') 
                          : (darkMode ? 'bg-purple-700' : 'bg-purple-500')
                      }`}>
                        {done ? (
                          <Check size={16} className="text-white" />
                        ) : (
                          <span className={`text-xs font-bold ${darkMode ? 'text-purple-200' : 'text-white'}`}>
                            {i + 1}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold text-sm ${done ? (darkMode ? 'text-emerald-300' : 'text-emerald-700') : (darkMode ? 'text-white' : 'text-slate-900')} ${done ? 'line-through' : ''}`}>
                          {step.title}
                        </div>
                        <div className={`text-xs mt-1 ${darkMode ? 'text-purple-300' : 'text-slate-600'} line-clamp-2`}>
                          {step.detail}
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          onToggleStep(i); 
                        }}
                        className={`min-w-max px-3 py-1 rounded-full text-xs font-semibold transition ${
                          done 
                            ? (darkMode 
                                ? 'bg-emerald-700 text-white hover:bg-emerald-600' 
                                : 'bg-emerald-500 text-white hover:bg-emerald-600')
                            : (darkMode 
                                ? 'bg-purple-700 text-purple-100 hover:bg-purple-600' 
                                : 'bg-purple-100 text-purple-700 hover:bg-purple-200')
                        }`}
                      >
                        {done ? "Completed" : "Mark Done"}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Current Step Detail */}
            <div className={`lg:col-span-1 p-5 rounded-xl border ${darkMode ? 'border-purple-600 bg-purple-900/30' : 'border-purple-300 bg-white'} shadow-inner sticky top-0`}>
              <div className="flex items-center justify-between mb-4">
                <h4 className={`font-extrabold text-xl ${darkMode ? 'text-white' : 'text-purple-700'}`}>
                  Step {current + 1}
                </h4>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  darkMode 
                    ? completedSet.has(current) ? 'bg-emerald-900/50 text-emerald-300' : 'bg-purple-700 text-purple-300'
                    : completedSet.has(current) ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-700'
                }`}>
                  {completedSet.has(current) ? 'Completed' : 'In Progress'}
                </span>
              </div>
              
              <h5 className={`font-bold text-lg mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {currentStep.title}
              </h5>
              
              <p className={`mb-6 ${darkMode ? 'text-purple-200' : 'text-slate-700'}`}>
                {currentStep.detail}
              </p>

              {/* How-to Instructions */}
              <div className="mb-6">
                <h6 className={`font-bold text-sm mb-3 flex items-center gap-2 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                  <Clipboard size={16} />
                  How to do it:
                </h6>
                <ul className="space-y-2">
                  {currentStep.instructions?.map((instruction, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                        darkMode ? 'bg-purple-700' : 'bg-purple-100'
                      }`}>
                        <span className={`text-xs font-bold ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                          {idx + 1}
                        </span>
                      </div>
                      <span className={`text-sm ${darkMode ? 'text-purple-200' : 'text-slate-700'}`}>
                        {instruction}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Navigation */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => onNavigate(current - 1)}
                    disabled={current === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition flex-1 justify-center ${
                      current === 0
                        ? (darkMode 
                            ? 'bg-purple-800/50 text-purple-500 cursor-not-allowed' 
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed')
                        : (darkMode 
                            ? 'bg-purple-700 text-purple-100 hover:bg-purple-600' 
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200')
                    }`}
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </button>

                  <button
                    onClick={() => onNavigate(current + 1)}
                    disabled={current === total - 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition flex-1 justify-center ${
                      current === total - 1
                        ? (darkMode 
                            ? 'bg-purple-800/50 text-purple-500 cursor-not-allowed' 
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed')
                        : (darkMode 
                            ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white hover:from-purple-700 hover:to-fuchsia-700' 
                            : 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white hover:from-purple-600 hover:to-fuchsia-600')
                    }`}
                  >
                    {current === total - 1 ? "Finish" : "Next"}
                    {current !== total - 1 && <ChevronRight size={18} />}
                  </button>
                </div>

                <div className={`text-center text-sm ${darkMode ? 'text-purple-400' : 'text-slate-500'}`}>
                  Step {current + 1} of {total} • {completedSet.size}/{total} completed
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AIProjectSuggestions;