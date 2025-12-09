import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Target, BarChart3, TrendingUp, Zap, CheckCircle, XCircle, BookOpen, Code, Database, Shield } from 'lucide-react';

const SkillGapAnalyzer = () => {
  const [targetRole, setTargetRole] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const roles = useMemo(() => [
    { name: 'Frontend Developer', icon: <Code className="text-blue-500" size={20} /> },
    { name: 'Backend Developer', icon: <Database className="text-green-500" size={20} /> },
    { name: 'Full Stack Developer', icon: <Zap className="text-purple-500" size={20} /> },
    { name: 'Data Scientist', icon: <BarChart3 className="text-amber-500" size={20} /> },
    { name: 'Cybersecurity Analyst', icon: <Shield className="text-red-500" size={20} /> },
    { name: 'DevOps Engineer', icon: <TrendingUp className="text-cyan-500" size={20} /> }
  ], []);

  const analyzeSkills = async () => {
    if (!targetRole) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis result based on role
    let mockResult;
    
    switch (targetRole) {
      case 'Frontend Developer':
        mockResult = {
          currentSkills: [
            { name: 'HTML/CSS', level: 90, required: 95 },
            { name: 'JavaScript', level: 85, required: 90 },
            { name: 'React', level: 80, required: 85 },
            { name: 'Vue.js', level: 40, required: 70 },
            { name: 'Angular', level: 30, required: 60 },
            { name: 'TypeScript', level: 60, required: 80 },
            { name: 'Responsive Design', level: 85, required: 85 },
            { name: 'State Management', level: 70, required: 80 }
          ],
          missingSkills: [
            'Advanced React Patterns',
            'Testing Libraries (Jest, Cypress)',
            'Performance Optimization',
            'Accessibility (a11y)',
            'Build Tools (Webpack, Vite)'
          ],
          steps: [
            'Master TypeScript for better type safety',
            'Learn advanced React patterns and hooks',
            'Practice testing with Jest and React Testing Library',
            'Study performance optimization techniques',
            'Implement accessibility best practices'
          ]
        };
        break;
        
      case 'Backend Developer':
        mockResult = {
          currentSkills: [
            { name: 'Node.js', level: 80, required: 85 },
            { name: 'Express.js', level: 75, required: 80 },
            { name: 'MongoDB', level: 70, required: 80 },
            { name: 'SQL', level: 65, required: 80 },
            { name: 'REST APIs', level: 85, required: 85 },
            { name: 'Authentication', level: 75, required: 80 },
            { name: 'Docker', level: 40, required: 70 },
            { name: 'AWS/Azure', level: 35, required: 65 }
          ],
          missingSkills: [
            'Microservices Architecture',
            'GraphQL',
            'Message Queues (RabbitMQ, Kafka)',
            'Caching (Redis)',
            'CI/CD Pipelines'
          ],
          steps: [
            'Learn containerization with Docker',
            'Master cloud platforms (AWS/Azure)',
            'Implement caching with Redis',
            'Study microservices architecture',
            'Practice with message queues'
          ]
        };
        break;
        
      default:
        mockResult = {
          currentSkills: [
            { name: 'JavaScript', level: 75, required: 85 },
            { name: 'HTML/CSS', level: 80, required: 85 },
            { name: 'React', level: 70, required: 80 },
            { name: 'Node.js', level: 65, required: 80 },
            { name: 'Database', level: 60, required: 75 },
            { name: 'Git', level: 80, required: 80 }
          ],
          missingSkills: [
            'Advanced Framework Features',
            'Testing Strategies',
            'Performance Optimization',
            'Security Best Practices',
            'Deployment Processes'
          ],
          steps: [
            'Deepen framework knowledge',
            'Learn testing methodologies',
            'Study performance optimization',
            'Implement security measures',
            'Master deployment workflows'
          ]
        };
    }
    
    setAnalysisResult(mockResult);
    setIsAnalyzing(false);
  };

  if (analysisResult) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50"
        >
          {/* Enhanced Header with gradient background and animated elements */}
          <div className="bg-gradient-to-r from-teal-600 via-green-600 to-teal-700 p-6 text-white relative overflow-hidden">
            {/* Animated Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/15 rounded-full -translate-y-20 translate-x-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/15 rounded-full translate-y-16 -translate-x-16 animate-pulse"></div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center">
                <div className="mr-4 p-3 bg-white/25 rounded-2xl backdrop-blur-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
                  <Target className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold">Skill Gap Analysis</h1>
                  <p className="text-teal-100 text-sm mt-1">For {targetRole} Position</p>
                </div>
              </div>
              <button
                onClick={() => setAnalysisResult(null)}
                className="px-4 py-2.5 bg-white/25 hover:bg-white/35 rounded-xl transition-all text-sm font-bold backdrop-blur-lg shadow-lg transform transition-all duration-300 hover:scale-105"
              >
                Analyze Another Role
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {/* Skills Comparison */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Skills Comparison</h2>
              
              <div className="space-y-4">
                {analysisResult.currentSkills.map((skill, index) => {
                  const gap = skill.required - skill.level;
                  const isProficient = skill.level >= skill.required;
                  
                  return (
                    <div key={index} className="border border-gray-200 rounded-2xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-gray-800">{skill.name}</h3>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 mr-2">
                            {skill.level}% / {skill.required}%
                          </span>
                          {isProficient ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-amber-500" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden mr-3">
                          <div className="flex h-full">
                            <div 
                              className="bg-gradient-to-r from-teal-500 to-green-500"
                              style={{ width: `${skill.level}%` }}
                            ></div>
                            {!isProficient && (
                              <div 
                                className="bg-amber-400"
                                style={{ width: `${gap}%` }}
                              ></div>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                          {isProficient ? 'Proficient' : `${gap}% to go`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Missing Skills */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <XCircle className="mr-2 h-5 w-5 text-amber-500" />
                  Missing Skills
                </h2>
                <ul className="space-y-3">
                  {analysisResult.missingSkills.map((skill, index) => (
                    <li key={index} className="flex items-start p-3 bg-white rounded-xl border border-amber-100">
                      <div className="mr-3 mt-1 text-amber-500">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      </div>
                      <span className="text-gray-700">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Action Steps */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
                  Steps to Bridge the Gap
                </h2>
                <ol className="space-y-4">
                  {analysisResult.steps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-3 mt-1 flex-shrink-0">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-3 border border-blue-100 flex-1">
                        <p className="text-gray-700">{step}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            
            {/* Resources */}
            <div className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recommended Learning Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 border border-purple-100">
                  <h3 className="font-bold text-gray-800 mb-2">Online Courses</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Udemy: Advanced {targetRole} Course</li>
                    <li>• Coursera: {targetRole} Specialization</li>
                    <li>• Pluralsight: {targetRole} Path</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl p-4 border border-purple-100">
                  <h3 className="font-bold text-gray-800 mb-2">Practice Platforms</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• LeetCode for coding challenges</li>
                    <li>• HackerRank for skill tests</li>
                    <li>• Codewars for kata practice</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl p-4 border border-purple-100">
                  <h3 className="font-bold text-gray-800 mb-2">Documentation</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Official {targetRole} docs</li>
                    <li>• MDN Web Docs</li>
                    <li>• GitHub repositories</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-green-600 rounded-2xl mb-4">
            <Target className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Skill Gap Analyzer</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Identify the skills you need to develop to qualify for your target role and get a personalized 
            roadmap to bridge the gap.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              Select Your Target Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map((role) => (
                <motion.button
                  key={role.name}
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTargetRole(role.name)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    targetRole === role.name
                      ? 'border-transparent bg-gradient-to-r from-teal-500 to-green-600 text-white shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`mr-3 p-2 rounded-lg ${
                      targetRole === role.name 
                        ? 'bg-white/20' 
                        : 'bg-gray-100'
                    }`}>
                      {role.icon}
                    </div>
                    <h3 className={`font-semibold ${
                      targetRole === role.name ? 'text-white' : 'text-gray-800'
                    }`}>{role.name}</h3>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={analyzeSkills}
            disabled={isAnalyzing || !targetRole}
            className="w-full py-4 bg-gradient-to-r from-teal-600 to-green-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
          >
            {isAnalyzing ? (
              <>
                <div className="mr-3 h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing Skills Gap...
              </>
            ) : (
              <>
                <Zap className="mr-3 h-6 w-6" />
                Analyze My Skills Gap
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default SkillGapAnalyzer;