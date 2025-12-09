import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  Target, 
  CheckCircle, 
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
  Crown,
  Medal,
  Trophy,
  Check,
  Brain,
  Sparkles,
  Compass,
  Bot,
  Cpu,
  Cloud,
  Globe,
  HardDrive,
  Network,
  Layers,
  Eye,
  Gem,
  Infinity
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

  // Enhanced glass morphism effect
  const glassClasses = "bg-white/90 backdrop-blur-xl border border-white/50 shadow-xl rounded-3xl";

  const careerOptions = useMemo(() => [
    { name: 'Full Stack Developer', icon: <Code size={20} />, category: 'Development', color: 'from-blue-500 to-purple-600' },
    { name: 'Frontend Developer', icon: <Palette size={20} />, category: 'Development', color: 'from-cyan-500 to-blue-500' },
    { name: 'Backend Developer', icon: <Database size={20} />, category: 'Development', color: 'from-green-500 to-teal-500' },
    { name: 'Mobile App Developer', icon: <Smartphone size={20} />, category: 'Development', color: 'from-purple-500 to-pink-500' },
    { name: 'Data Analyst', icon: <BarChart size={20} />, category: 'Data & AI', color: 'from-amber-500 to-orange-500' },
    { name: 'Data Scientist', icon: <BarChart size={20} />, category: 'Data & AI', color: 'from-rose-500 to-red-500' },
    { name: 'Machine Learning Engineer', icon: <BarChart size={20} />, category: 'Data & AI', color: 'from-indigo-500 to-purple-500' },
    { name: 'AI Engineer', icon: <BarChart size={20} />, category: 'Data & AI', color: 'from-violet-500 to-fuchsia-500' },
    { name: 'DevOps Engineer', icon: <Database size={20} />, category: 'Cloud & DevOps', color: 'from-emerald-500 to-green-500' },
    { name: 'Cloud Engineer', icon: <Database size={20} />, category: 'Cloud & DevOps', color: 'from-sky-500 to-cyan-500' },
    { name: 'Cybersecurity Analyst', icon: <Shield size={20} />, category: 'Security', color: 'from-red-500 to-orange-500' },
    { name: 'Ethical Hacker', icon: <Shield size={20} />, category: 'Security', color: 'from-gray-700 to-gray-900' },
    { name: 'UI/UX Designer', icon: <Palette size={20} />, category: 'Design & Product', color: 'from-pink-500 to-rose-500' },
    { name: 'Product Manager', icon: <User size={20} />, category: 'Design & Product', color: 'from-teal-500 to-green-500' },
    { name: 'QA Tester', icon: <CheckCircle size={20} />, category: 'Testing & Automation', color: 'from-yellow-500 to-amber-500' }
  ], []);

  const careerDetails = useMemo(() => ({
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
          icon: <Globe className="text-blue-500" size={20} />,
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
          icon: <Zap className="text-yellow-500" size={20} />,
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
          icon: <Layers className="text-cyan-500" size={20} />,
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
          icon: <HardDrive className="text-green-500" size={20} />,
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
    },
    'Frontend Developer': {
      description: 'Specialize in creating beautiful and interactive user interfaces',
      icon: <Eye className="text-cyan-500" size={24} />,
      skills: ['HTML, CSS, JavaScript', 'React / Vue / Angular', 'State Management', 'Responsive Design', 'Performance Optimization'],
      roadmap: [
        {
          id: '1',
          title: 'HTML & CSS Fundamentals',
          duration: '2 weeks',
          description: 'Master the building blocks of web development',
          icon: <Globe className="text-blue-500" size={20} />,
          skills: ['Semantic HTML', 'CSS Layouts', 'Flexbox', 'Grid', 'Animations'],
          resources: [
            { title: 'W3Schools HTML Tutorial', url: 'https://www.w3schools.com/html/' },
            { title: 'CSS Tricks', url: 'https://css-tricks.com/' },
            { title: 'Kevin Powell - CSS YouTube', url: 'https://youtube.com' }
          ],
          projects: [
            { title: 'Recipe Website', description: 'Beautiful recipe site with images and ingredients' },
            { title: 'Photography Portfolio', description: 'Image gallery with lightbox effect' }
          ],
          milestones: ['Create 3 responsive layouts', 'Master CSS Grid', 'Implement smooth animations']
        },
        {
          id: '2',
          title: 'JavaScript Essentials',
          duration: '3 weeks',
          description: 'Bring interactivity to your websites with JavaScript',
          icon: <Zap className="text-yellow-500" size={20} />,
          skills: ['DOM Manipulation', 'Event Handling', 'ES6+ Features', 'AJAX', 'Error Handling'],
          resources: [
            { title: 'JavaScript.info', url: 'https://javascript.info/' },
            { title: 'Traversy Media - JS', url: 'https://youtube.com' },
            { title: 'Namaste JavaScript', url: 'https://youtube.com' }
          ],
          projects: [
            { title: 'Quiz Application', description: 'Interactive quiz with timer and scoring' },
            { title: 'Weather Dashboard', description: 'Real-time weather with location detection' }
          ],
          milestones: ['Build 2 interactive applications', 'Handle asynchronous operations', 'Debug efficiently']
        },
        {
          id: '3',
          title: 'Modern Framework (React)',
          duration: '1 month',
          description: 'Learn component-based development with React',
          icon: <Layers className="text-cyan-500" size={20} />,
          skills: ['Components', 'Props & State', 'Hooks', 'Context API', 'React Router'],
          resources: [
            { title: 'React Official Docs', url: 'https://react.dev/' },
            { title: 'Codevolution - React', url: 'https://youtube.com' },
            { title: 'React Hooks Course', url: 'https://youtube.com' }
          ],
          projects: [
            { title: 'Task Manager', description: 'Drag-and-drop task manager with categories' },
            { title: 'Social Media Feed', description: 'Infinite scroll feed with likes/comments' }
          ],
          milestones: ['Create reusable components', 'Manage complex state', 'Implement routing']
        },
        {
          id: '4',
          title: 'Styling & UI Libraries',
          duration: '2 weeks',
          description: 'Enhance your designs with modern styling techniques',
          icon: <Palette className="text-pink-500" size={20} />,
          skills: ['Tailwind CSS', 'Styled Components', 'CSS-in-JS', 'Material UI', 'Responsive Design'],
          resources: [
            { title: 'Tailwind CSS Docs', url: 'https://tailwindcss.com/' },
            { title: 'Styled Components', url: 'https://styled-components.com/' },
            { title: 'Kevin Powell - Tailwind', url: 'https://youtube.com' }
          ],
          projects: [
            { title: 'Dashboard UI', description: 'Admin dashboard with charts and tables' },
            { title: 'E-commerce UI Kit', description: 'Reusable components for shopping sites' }
          ],
          milestones: ['Master utility-first CSS', 'Create design systems', 'Implement dark mode']
        },
        {
          id: '5',
          title: 'Performance & Testing',
          duration: '2 weeks',
          description: 'Optimize and test your frontend applications',
          icon: <TrendingUp className="text-green-500" size={20} />,
          skills: ['Lighthouse Audits', 'Webpack', 'Jest', 'React Testing Library', 'Accessibility'],
          resources: [
            { title: 'Google Web Vitals', url: 'https://web.dev/vitals/' },
            { title: 'Webpack Academy', url: 'https://webpack.js.org/' },
            { title: 'Testing Library', url: 'https://testing-library.com/' }
          ],
          projects: [
            { title: 'Performance Audit', description: 'Optimize a slow website to meet Core Web Vitals' },
            { title: 'Test Suite', description: 'Write tests for a React application' }
          ],
          milestones: ['Achieve 90+ Lighthouse scores', 'Write unit and integration tests', 'Implement accessibility features']
        },
        {
          id: '6',
          title: 'Advanced Topics & Portfolio',
          duration: '2 weeks',
          description: 'Polish your skills and showcase your expertise',
          icon: <Gem className="text-purple-500" size={20} />,
          skills: ['TypeScript', 'Next.js', 'State Management', 'CI/CD', 'Portfolio Development'],
          resources: [
            { title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/' },
            { title: 'Next.js Docs', url: 'https://nextjs.org/docs' },
            { title: 'Redux Toolkit', url: 'https://redux-toolkit.js.org/' }
          ],
          projects: [
            { title: 'Personal Portfolio', description: 'Showcase your skills with Next.js and TypeScript' },
            { title: 'Open Source Contribution', description: 'Contribute to a popular frontend library' }
          ],
          milestones: ['Build a professional portfolio', 'Contribute to open source', 'Prepare for interviews']
        }
      ],
      tips: [
        "Focus on mastering one framework deeply rather than learning many superficially",
        "Build projects that solve real problems to showcase in your portfolio",
        "Stay updated with modern CSS features and best practices",
        "Learn accessibility early to create inclusive applications",
        "Practice performance optimization techniques regularly"
      ],
      stats: {
        duration: '4 Months',
        projects: '8-12 Real Projects',
        skills: 'HTML, CSS, JavaScript, React, Tailwind CSS, Performance Optimization'
      }
    },
    'Backend Developer': {
      description: 'Build robust server-side applications and APIs',
      icon: <HardDrive className="text-green-500" size={24} />,
      skills: ['Node.js / Python', 'Databases', 'APIs', 'Authentication', 'Cloud Services'],
      roadmap: [
        {
          id: '1',
          title: 'Programming Language & Fundamentals',
          duration: '1 month',
          description: 'Choose and master a backend language',
          icon: <Code className="text-blue-500" size={20} />,
          skills: ['Python or Node.js', 'Data Structures', 'Algorithms', 'OOP Concepts', 'Error Handling'],
          resources: [
            { title: 'Python.org', url: 'https://docs.python.org/' },
            { title: 'Node.js Docs', url: 'https://nodejs.org/en/docs/' },
            { title: 'CS50 - Harvard', url: 'https://cs50.harvard.edu/' }
          ],
          projects: [
            { title: 'CLI Tool', description: 'Command-line utility for file manipulation' },
            { title: 'Data Processor', description: 'Process and analyze CSV data' }
          ],
          milestones: ['Write clean, readable code', 'Understand OOP principles', 'Handle exceptions properly']
        },
        {
          id: '2',
          title: 'Databases & ORM',
          duration: '1 month',
          description: 'Learn to store and manage data effectively',
          icon: <Database className="text-emerald-500" size={20} />,
          skills: ['SQL', 'PostgreSQL/MySQL', 'MongoDB', 'Prisma/Sequelize', 'Transactions'],
          resources: [
            { title: 'SQLBolt', url: 'https://sqlbolt.com/' },
            { title: 'MongoDB University', url: 'https://university.mongodb.com/' },
            { title: 'Prisma Docs', url: 'https://www.prisma.io/docs/' }
          ],
          projects: [
            { title: 'Blog Database', description: 'Design and implement a blog database schema' },
            { title: 'Inventory System', description: 'CRUD operations with complex relationships' }
          ],
          milestones: ['Design normalized schemas', 'Write complex queries', 'Implement transactions']
        },
        {
          id: '3',
          title: 'RESTful APIs & Authentication',
          duration: '1 month',
          description: 'Build secure and scalable APIs',
          icon: <Network className="text-purple-500" size={20} />,
          skills: ['HTTP Methods', 'JWT/OAuth', 'Rate Limiting', 'Validation', 'Documentation'],
          resources: [
            { title: 'REST API Tutorial', url: 'https://restfulapi.net/' },
            { title: 'JWT.io', url: 'https://jwt.io/' },
            { title: 'Swagger Docs', url: 'https://swagger.io/docs/' }
          ],
          projects: [
            { title: 'Task API', description: 'RESTful API with full CRUD operations' },
            { title: 'Auth Service', description: 'User registration and JWT authentication' }
          ],
          milestones: ['Implement secure authentication', 'Validate all inputs', 'Document APIs properly']
        },
        {
          id: '4',
          title: 'Testing & Deployment',
          duration: '2 weeks',
          description: 'Ensure quality and deploy your applications',
          icon: <Rocket className="text-orange-500" size={20} />,
          skills: ['Unit Testing', 'Integration Testing', 'Docker', 'CI/CD', 'Monitoring'],
          resources: [
            { title: 'Jest Docs', url: 'https://jestjs.io/docs/' },
            { title: 'Docker Tutorial', url: 'https://docker-curriculum.com/' },
            { title: 'GitHub Actions', url: 'https://docs.github.com/en/actions' }
          ],
          projects: [
            { title: 'Test Suite', description: 'Comprehensive tests for an API' },
            { title: 'Docker Deployment', description: 'Containerize and deploy an application' }
          ],
          milestones: ['Write comprehensive test suites', 'Containerize applications', 'Set up CI/CD pipelines']
        },
        {
          id: '5',
          title: 'Advanced Backend Concepts',
          duration: '2 weeks',
          description: 'Learn advanced patterns and techniques',
          icon: <Cpu className="text-red-500" size={20} />,
          skills: ['Caching', 'Message Queues', 'Microservices', 'Load Balancing', 'Security'],
          resources: [
            { title: 'Redis Docs', url: 'https://redis.io/documentation' },
            { title: 'RabbitMQ Tutorials', url: 'https://www.rabbitmq.com/getstarted.html' },
            { title: 'Microservices.io', url: 'https://microservices.io/' }
          ],
          projects: [
            { title: 'Caching Layer', description: 'Implement Redis caching for an API' },
            { title: 'Background Jobs', description: 'Process emails with message queues' }
          ],
          milestones: ['Implement caching strategies', 'Use message queues', 'Apply security best practices']
        },
        {
          id: '6',
          title: 'Cloud & Scaling',
          duration: '2 weeks',
          description: 'Deploy and scale applications in the cloud',
          icon: <Cloud className="text-sky-500" size={20} />,
          skills: ['AWS/Azure/GCP', 'Serverless', 'Load Balancers', 'Auto-scaling', 'Monitoring'],
          resources: [
            { title: 'AWS Free Tier', url: 'https://aws.amazon.com/free/' },
            { title: 'Azure Fundamentals', url: 'https://learn.microsoft.com/en-us/training/paths/azure-fundamentals/' },
            { title: 'Google Cloud', url: 'https://cloud.google.com/' }
          ],
          projects: [
            { title: 'Cloud Deployment', description: 'Deploy application to cloud provider' },
            { title: 'Serverless Function', description: 'Create a serverless API endpoint' }
          ],
          milestones: ['Deploy to cloud platforms', 'Implement auto-scaling', 'Set up monitoring']
        }
      ],
      tips: [
        "Focus on understanding how things work under the hood, not just using frameworks",
        "Learn to write efficient database queries early in your journey",
        "Security should be a priority from day one, not an afterthought",
        "Practice writing clean, maintainable code with proper error handling",
        "Understand distributed systems concepts as you advance"
      ],
      stats: {
        duration: '4 Months',
        projects: '8-12 Real Projects',
        skills: 'Node.js/Python, PostgreSQL, MongoDB, REST APIs, Docker, AWS'
      }
    },
    'Data Scientist': {
      description: 'Extract insights and build predictive models from data',
      icon: <BarChart className="text-rose-500" size={24} />,
      skills: ['Python/R', 'Statistics', 'Machine Learning', 'Data Visualization', 'Big Data'],
      roadmap: [
        {
          id: '1',
          title: 'Mathematics & Statistics',
          duration: '1 month',
          description: 'Build a strong foundation in quantitative methods',
          icon: <BarChart className="text-blue-500" size={20} />,
          skills: ['Linear Algebra', 'Calculus', 'Probability', 'Statistics', 'Hypothesis Testing'],
          resources: [
            { title: 'Khan Academy Stats', url: 'https://www.khanacademy.org/math/statistics-probability' },
            { title: '3Blue1Brown - Linear Algebra', url: 'https://youtube.com' },
            { title: 'Statistical Learning Book', url: 'https://www.statlearning.com/' }
          ],
          projects: [
            { title: 'Descriptive Analysis', description: 'Analyze a dataset and summarize findings' },
            { title: 'A/B Testing Simulation', description: 'Simulate and analyze A/B tests' }
          ],
          milestones: ['Understand probability distributions', 'Perform hypothesis testing', 'Interpret statistical results']
        },
        {
          id: '2',
          title: 'Programming for Data Science',
          duration: '1 month',
          description: 'Learn Python/R for data manipulation and analysis',
          icon: <Code className="text-green-500" size={20} />,
          skills: ['Python/R Basics', 'Pandas/Numpy', 'Data Cleaning', 'Exploratory Analysis', 'Visualization'],
          resources: [
            { title: 'Python for Data Analysis', url: 'https://wesmckinney.com/book/' },
            { title: 'R for Data Science', url: 'https://r4ds.had.co.nz/' },
            { title: 'Kaggle Learn', url: 'https://www.kaggle.com/learn' }
          ],
          projects: [
            { title: 'Data Cleaning Pipeline', description: 'Clean and preprocess a messy dataset' },
            { title: 'Exploratory Dashboard', description: 'Create visualizations to explore data patterns' }
          ],
          milestones: ['Manipulate datasets efficiently', 'Create insightful visualizations', 'Identify data patterns']
        },
        {
          id: '3',
          title: 'Machine Learning Fundamentals',
          duration: '1 month',
          description: 'Implement core ML algorithms and techniques',
          icon: <Bot className="text-purple-500" size={20} />,
          skills: ['Supervised Learning', 'Unsupervised Learning', 'Model Evaluation', 'Feature Engineering', 'Cross-validation'],
          resources: [
            { title: 'Hands-On ML Book', url: 'https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/' },
            { title: 'Andrew Ng ML Course', url: 'https://www.coursera.org/learn/machine-learning' },
            { title: 'Scikit-learn Docs', url: 'https://scikit-learn.org/stable/' }
          ],
          projects: [
            { title: 'Predictive Model', description: 'Build a regression model to predict house prices' },
            { title: 'Classification System', description: 'Create a classifier to identify spam emails' }
          ],
          milestones: ['Train and evaluate models', 'Apply feature engineering', 'Avoid overfitting']
        },
        {
          id: '4',
          title: 'Advanced Machine Learning',
          duration: '1 month',
          description: 'Deepen your knowledge with advanced techniques',
          icon: <Brain className="text-orange-500" size={20} />,
          skills: ['Deep Learning', 'Neural Networks', 'Natural Language Processing', 'Computer Vision', 'Ensemble Methods'],
          resources: [
            { title: 'Deep Learning Book', url: 'https://www.deeplearningbook.org/' },
            { title: 'Fast.ai Courses', url: 'https://course.fast.ai/' },
            { title: 'TensorFlow/Keras Docs', url: 'https://www.tensorflow.org/' }
          ],
          projects: [
            { title: 'Image Classifier', description: 'Classify images using convolutional neural networks' },
            { title: 'Text Sentiment Analysis', description: 'Analyze sentiment in social media posts' }
          ],
          milestones: ['Build neural networks', 'Process unstructured data', 'Fine-tune hyperparameters']
        },
        {
          id: '5',
          title: 'Big Data & Tools',
          duration: '2 weeks',
          description: 'Work with large datasets and specialized tools',
          icon: <Infinity className="text-red-500" size={20} />,
          skills: ['SQL', 'Spark', 'Hadoop', 'Cloud Platforms', 'Data Warehousing'],
          resources: [
            { title: 'Apache Spark Docs', url: 'https://spark.apache.org/docs/latest/' },
            { title: 'Google BigQuery', url: 'https://cloud.google.com/bigquery' },
            { title: 'AWS Data Analytics', url: 'https://aws.amazon.com/big-data/' }
          ],
          projects: [
            { title: 'Big Data Analysis', description: 'Analyze large datasets with Spark' },
            { title: 'Data Pipeline', description: 'Create an automated data processing pipeline' }
          ],
          milestones: ['Process large datasets efficiently', 'Design data pipelines', 'Use cloud analytics services']
        },
        {
          id: '6',
          title: 'Communication & Deployment',
          duration: '2 weeks',
          description: 'Share insights and deploy models',
          icon: <Globe className="text-teal-500" size={20} />,
          skills: ['Storytelling', 'Dashboards', 'Model Deployment', 'API Creation', 'Business Impact'],
          resources: [
            { title: 'Tableau Tutorial', url: 'https://www.tableau.com/learn' },
            { title: 'Streamlit Docs', url: 'https://streamlit.io/' },
            { title: 'Flask for ML', url: 'https://flask.palletsprojects.com/' }
          ],
          projects: [
            { title: 'Interactive Dashboard', description: 'Create a dashboard to visualize insights' },
            { title: 'Model API', description: 'Deploy a machine learning model as an API' }
          ],
          milestones: ['Communicate findings effectively', 'Deploy models to production', 'Measure business impact']
        }
      ],
      tips: [
        "Practice on real datasets from Kaggle and UCI Machine Learning Repository",
        "Focus on understanding the business problem, not just the technical solution",
        "Learn to explain complex models to non-technical stakeholders",
        "Keep up with the latest research papers and techniques",
        "Build a portfolio showcasing diverse projects and methodologies"
      ],
      stats: {
        duration: '5 Months',
        projects: '10-15 Real Projects',
        skills: 'Python, Pandas, Scikit-learn, TensorFlow, SQL, Statistics'
      }
    }
    // Additional career paths would follow the same structure
  }), []);

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
              <Compass className="text-white" size={32} />
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
                  <Sparkles className="mr-3 h-6 w-6" />
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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 relative">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50 via-purple-50 to-cyan-50"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-100/40 to-transparent rounded-bl-full animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-gradient-to-t from-purple-100/50 to-transparent rounded-tr-full animate-pulse"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50"
      >
        {/* Enhanced Header with Glass Effect */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-7 text-white relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24 animate-pulse"></div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between relative z-10">
            <div className="flex items-center mb-5 md:mb-0">
              <div className="mr-5 p-4 bg-white/25 rounded-2xl backdrop-blur-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
                {roadmap.icon}
              </div>
              <div>
                <h1 className="text-3xl font-extrabold">{roadmap.careerGoal}</h1>
                <p className="text-blue-100 text-base mt-1">{roadmap.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={resetRoadmap}
                className="px-5 py-3 bg-white/25 hover:bg-white/35 rounded-xl transition-all flex items-center backdrop-blur-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
              >
                <RefreshCw className="mr-2.5 h-5 w-5" />
                New Roadmap
              </button>
            </div>
          </div>
          
          {/* Enhanced Stats */}
          {roadmap.stats && (
            <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white/15 p-5 rounded-2xl backdrop-blur-sm shadow-lg transform transition-transform duration-300 hover:scale-[1.02]">
                <div className="flex items-center">
                  <Calendar className="mr-4 text-blue-200" size={24} />
                  <div>
                    <p className="text-sm text-blue-100 font-medium">Duration</p>
                    <p className="font-extrabold text-xl">{roadmap.stats.duration}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/15 p-5 rounded-2xl backdrop-blur-sm shadow-lg transform transition-transform duration-300 hover:scale-[1.02]">
                <div className="flex items-center">
                  <FolderOpen className="mr-4 text-green-200" size={24} />
                  <div>
                    <p className="text-sm text-green-100 font-medium">Projects</p>
                    <p className="font-extrabold text-xl">{roadmap.stats.projects}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/15 p-5 rounded-2xl backdrop-blur-sm shadow-lg transform transition-transform duration-300 hover:scale-[1.02]">
                <div className="flex items-center">
                  <Code className="mr-4 text-purple-200" size={24} />
                  <div>
                    <p className="text-sm text-purple-100 font-medium">Key Skills</p>
                    <p className="font-extrabold text-xl">Multiple Technologies</p>
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
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
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
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5 ${
                    isCompleted 
                      ? 'border-green-300 bg-gradient-to-r from-green-50/70 to-emerald-50/70 shadow-md' 
                      : 'border-gray-200 hover:border-gray-400 bg-white shadow-sm'
                  }`}
                >
                  {/* Enhanced Step Header */}
                  <div 
                    className={`p-6 cursor-pointer flex items-start ${
                      isCompleted ? 'bg-gradient-to-r from-green-50/70 to-emerald-50/70' : 'bg-white'
                    }`}
                    onClick={() => toggleStepExpansion(step.id)}
                  >
                    <div className="mr-5 mt-1">
                      {isCompleted ? (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg ring-2 ring-white/50 transform transition-transform duration-300 hover:scale-105">
                          <Check className="h-6 w-6 text-white" />
                        </div>
                      ) : (
                        <div 
                          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 shadow-md transform transition-transform duration-300 hover:scale-105"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStepCompletion(step.id);
                          }}
                        >
                          <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center">
                          <div className="mr-4 p-3 bg-gray-100 rounded-xl shadow-sm transform transition-transform duration-300 hover:scale-105">
                            {step.icon}
                          </div>
                          <div>
                            <h3 className={`font-extrabold text-xl ${
                              isCompleted ? 'text-green-700 line-through' : 'text-gray-800'
                            }`}>
                              Month {index + 1}: {step.title}
                            </h3>
                            <p className="text-gray-600 mt-1">{step.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="inline-flex items-center text-sm font-medium text-gray-700 bg-gray-100/90 px-3 py-1.5 rounded-full shadow-sm transform transition-all duration-300 hover:scale-105">
                            <Clock className="mr-1.5 h-4 w-4" />
                            {step.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-5">
                      {isExpanded ? (
                        <ChevronUp className="h-7 w-7 text-gray-600 transform transition-transform duration-300 hover:scale-110" />
                      ) : (
                        <ChevronDown className="h-7 w-7 text-gray-600 transform transition-transform duration-300 hover:scale-110" />
                      )}
                    </div>
                  </div>
                  
                  {/* Enhanced Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-200 bg-gradient-to-r from-gray-50/50 to-slate-50/50 rounded-b-2xl"
                      >
                        <div className="p-6 space-y-7">
                          {/* Enhanced Skills */}
                          <div>
                            <h4 className="font-extrabold text-gray-800 mb-4 flex items-center text-xl bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                              <Award className="mr-2.5 h-6 w-6 text-blue-600" />
                              Skills You'll Master
                            </h4>
                            <div className="flex flex-wrap gap-3">
                              {step.skills.map((skill, skillIndex) => (
                                <span
                                  key={skillIndex}
                                  className="px-4 py-2.5 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 rounded-full text-sm font-bold shadow-sm transform transition-all duration-300 hover:scale-105"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {/* Enhanced Resources */}
                          <div>
                            <h4 className="font-extrabold text-gray-800 mb-4 flex items-center text-xl bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
                              <BookOpen className="mr-2.5 h-6 w-6 text-purple-600" />
                              Best Learning Resources
                            </h4>
                            {step.resources.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {step.resources.map((resource, resourceIndex) => (
                                  <a
                                    key={resourceIndex}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-5 border border-gray-200 rounded-2xl hover:border-purple-300 hover:bg-purple-50 transition-all flex items-start shadow-sm hover:shadow-md transform transition-transform duration-300 hover:-translate-y-0.5"
                                  >
                                    <div className="mr-4 mt-1 text-purple-600">
                                      <BookOpen size={18} />
                                    </div>
                                    <div>
                                      <h5 className="font-bold text-gray-800 text-lg">{resource.title}</h5>
                                      <p className="text-sm text-gray-600 mt-1">Click to access resource</p>
                                    </div>
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 italic">Resources will be personalized based on your learning style</p>
                            )}
                          </div>
                          
                          {/* Enhanced Projects */}
                          <div>
                            <h4 className="font-extrabold text-gray-800 mb-4 flex items-center text-xl bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent">
                              <TrendingUp className="mr-2.5 h-6 w-6 text-green-600" />
                              Hands-on Projects
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              {step.projects.map((project, projectIndex) => (
                                <div key={projectIndex} className="p-5 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transform transition-transform duration-300 hover:-translate-y-0.5">
                                  <div className="flex items-start">
                                    <div className="mr-4 mt-1 text-green-600">
                                      <FolderOpen size={18} />
                                    </div>
                                    <div>
                                      <h5 className="font-extrabold text-gray-800 text-lg">{project.title}</h5>
                                      <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Enhanced Milestones */}
                          <div>
                            <h4 className="font-extrabold text-gray-800 mb-4 flex items-center text-xl bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
                              <Medal className="mr-2.5 h-6 w-6 text-amber-600" />
                              Milestones to Achieve
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {step.milestones.map((milestone, milestoneIndex) => (
                                <div key={milestoneIndex} className="flex items-start p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 shadow-sm hover:shadow-md transform transition-transform duration-300 hover:-translate-y-0.5">
                                  <div className="mr-4 mt-1 text-amber-600">
                                    <Trophy size={18} />
                                  </div>
                                  <span className="text-gray-700 font-medium">{milestone}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Enhanced Complete Button */}
                          <div className="pt-5">
                            {!isCompleted ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markStepAsComplete(step.id);
                                }}
                                className="px-7 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-extrabold rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all flex items-center shadow-lg hover:shadow-xl transform transition-transform duration-300 hover:scale-105"
                              >
                                <CheckCircle className="mr-3 h-6 w-6" />
                                Mark as Complete
                              </button>
                            ) : (
                              <div className="flex items-center text-green-700 font-bold bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-200">
                                <CheckCircle className="mr-3 h-6 w-6" />
                                <span className="font-extrabold text-lg">Completed! Great job!</span>
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
          
          {/* Enhanced Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: roadmap.roadmap.length * 0.1 }}
            className="mt-9 p-7 bg-gradient-to-r from-amber-50/90 to-orange-50/90 rounded-3xl border border-amber-200/70 backdrop-blur-lg shadow-lg"
          >
            <h3 className="font-extrabold text-gray-800 mb-5 flex items-center text-xl bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
              <Lightbulb className="mr-2.5 h-6 w-6 text-amber-600" />
              Pro Tips for Success
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {roadmap.tips.map((tip, index) => (
                <div key={index} className="flex items-start p-4 bg-white rounded-xl border border-amber-100 shadow-sm hover:shadow-md transform transition-transform duration-300 hover:-translate-y-0.5">
                  <div className="mr-4 mt-1 text-amber-600">
                    <Crown size={18} />
                  </div>
                  <span className="text-gray-700 font-medium">{tip}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Enhanced Completion Message */}
          {roadmap.progress === 100 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-9 p-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl text-white text-center shadow-2xl animate-pulse"
            >
              <div className="flex justify-center mb-5">
                <Trophy size={56} />
              </div>
              <h3 className="text-3xl font-extrabold mb-3">Congratulations! 🎉</h3>
              <p className="text-xl">You've completed your journey to becoming a {roadmap.careerGoal}!</p>
              <p className="mt-3 opacity-90 text-lg">Now it's time to showcase your skills and start applying for jobs.</p>
              <button 
                onClick={resetRoadmap}
                className="mt-5 px-7 py-4 bg-white text-emerald-600 font-extrabold rounded-2xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform transition-transform duration-300 hover:scale-105"
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