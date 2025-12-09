import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Github, Linkedin, Brain, BarChart3, Target, TrendingUp, Award, Zap } from 'lucide-react';

const SkillAnalyzer = () => {
  const [resume, setResume] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [githubLink, setGithubLink] = useState('');
  const [linkedinLink, setLinkedinLink] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
    }
  };

  const handleCertificateUpload = (e) => {
    const files = Array.from(e.target.files);
    setCertificates(prev => [...prev, ...files]);
  };

  const analyzeSkills = async () => {
    setIsAnalyzing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis result
    const mockResult = {
      skillScore: 75,
      strengths: [
        'Strong in JavaScript and React',
        'Good problem-solving skills',
        'Experience with REST APIs',
        'Version control with Git'
      ],
      weaknesses: [
        'Limited backend experience',
        'Needs improvement in database design',
        'Lacks DevOps knowledge',
        'Minimal testing experience'
      ],
      recommendedRoles: [
        { role: 'Frontend Developer', match: 85 },
        { role: 'Full Stack Developer', match: 70 },
        { role: 'React Developer', match: 90 },
        { role: 'UI Developer', match: 80 }
      ],
      roadmap: [
        { month: 1, focus: 'Backend Basics', skills: ['Node.js', 'Express.js'] },
        { month: 2, focus: 'Database Fundamentals', skills: ['MongoDB', 'SQL'] },
        { month: 3, focus: 'API Development', skills: ['RESTful APIs', 'Authentication'] },
        { month: 4, focus: 'Testing & Deployment', skills: ['Jest', 'CI/CD'] }
      ],
      projectSuggestions: [
        'Build a full-stack blog application',
        'Create a task management system',
        'Develop a social media dashboard'
      ]
    };
    
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
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 p-6 text-white relative overflow-hidden">
            {/* Animated Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/15 rounded-full -translate-y-20 translate-x-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/15 rounded-full translate-y-16 -translate-x-16 animate-pulse"></div>
            
            <div className="flex items-center mb-4 relative z-10">
              <div className="mr-4 p-3 bg-white/25 rounded-2xl backdrop-blur-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
                <Brain className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold">AI Skill Analysis Report</h1>
                <p className="text-purple-100 text-sm mt-1">Personalized insights to boost your career</p>
              </div>
            </div>
            
            {/* Overall Score */}
            <div className="mt-6 bg-white/10 rounded-2xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-purple-100">Overall Skill Score</p>
                  <p className="text-3xl font-bold">{analysisResult.skillScore}/100</p>
                </div>
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#eee"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      strokeDasharray={`${analysisResult.skillScore}, 100`}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                  Your Strengths
                </h2>
                <ul className="space-y-3">
                  {analysisResult.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mt-1 mr-3 text-green-500">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      </div>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Weaknesses */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Target className="mr-2 h-5 w-5 text-amber-500" />
                  Areas to Improve
                </h2>
                <ul className="space-y-3">
                  {analysisResult.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mt-1 mr-3 text-amber-500">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      </div>
                      <span className="text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Recommended Roles */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Award className="mr-2 h-5 w-5 text-blue-500" />
                  Recommended Career Paths
                </h2>
                <div className="space-y-3">
                  {analysisResult.recommendedRoles.map((role, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100">
                      <span className="font-medium text-gray-800">{role.role}</span>
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm rounded-full">
                        {role.match}% Match
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Project Suggestions */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-purple-500" />
                  Project Ideas
                </h2>
                <ul className="space-y-3">
                  {analysisResult.projectSuggestions.map((project, index) => (
                    <li key={index} className="flex items-start p-3 bg-white rounded-xl border border-purple-100">
                      <div className="mr-3 mt-1 text-purple-500">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      </div>
                      <span className="text-gray-700">{project}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Learning Roadmap */}
            <div className="mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-indigo-500" />
                Personalized Learning Roadmap
              </h2>
              <div className="space-y-4">
                {analysisResult.roadmap.map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mr-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {step.month}
                      </div>
                    </div>
                    <div className="flex-1 pb-4 border-l-2 border-indigo-200 pl-4">
                      <h3 className="font-bold text-gray-800">{step.focus}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {step.skills.map((skill, skillIndex) => (
                          <span key={skillIndex} className="px-2 py-1 bg-white text-indigo-700 text-sm rounded-full border border-indigo-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setAnalysisResult(null)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all"
              >
                Analyze Again
              </button>
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl mb-4">
            <Brain className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Skill Analyzer</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload your resume, certificates, and links to get a comprehensive analysis of your skills, strengths, 
            weaknesses, and personalized career recommendations.
          </p>
        </div>

        <div className="space-y-8">
          {/* Resume Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-purple-400 transition-colors">
            <div className="flex items-center mb-4">
              <div className="mr-3 p-2 bg-purple-100 rounded-lg">
                <FileText className="text-purple-600" size={20} />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Upload Resume</h2>
            </div>
            
            <div className="flex flex-col items-center justify-center py-8">
              <Upload className="text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 mb-4 text-center">
                {resume ? (
                  <span className="text-green-600 font-medium">{resume.name}</span>
                ) : (
                  "Drag & drop your resume here or click to browse"
                )}
              </p>
              <label className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all cursor-pointer">
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                />
                Choose File
              </label>
              <p className="text-gray-500 text-sm mt-3">Supports PDF, DOC, DOCX formats</p>
            </div>
          </div>
          
          {/* Certificates Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-purple-400 transition-colors">
            <div className="flex items-center mb-4">
              <div className="mr-3 p-2 bg-purple-100 rounded-lg">
                <Award className="text-purple-600" size={20} />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Upload Certificates</h2>
            </div>
            
            <div className="flex flex-col items-center justify-center py-8">
              <Upload className="text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 mb-4 text-center">
                {certificates.length > 0 ? (
                  <span className="text-green-600 font-medium">{certificates.length} certificate(s) selected</span>
                ) : (
                  "Drag & drop your certificates here or click to browse"
                )}
              </p>
              <label className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all cursor-pointer">
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={handleCertificateUpload}
                />
                Choose Files
              </label>
              <p className="text-gray-500 text-sm mt-3">Supports PDF, JPG, PNG formats</p>
            </div>
          </div>
          
          {/* GitHub Link */}
          <div className="border-2 border-gray-200 rounded-2xl p-6 hover:border-purple-400 transition-colors">
            <div className="flex items-center mb-4">
              <div className="mr-3 p-2 bg-purple-100 rounded-lg">
                <Github className="text-purple-600" size={20} />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">GitHub Profile</h2>
            </div>
            
            <div className="flex">
              <input
                type="url"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                placeholder="https://github.com/yourusername"
                className="flex-1 p-4 border border-gray-300 rounded-l-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
              />
              <button className="px-6 bg-gray-200 text-gray-700 font-medium rounded-r-xl hover:bg-gray-300 transition-colors">
                Fetch
              </button>
            </div>
          </div>
          
          {/* LinkedIn Link */}
          <div className="border-2 border-gray-200 rounded-2xl p-6 hover:border-purple-400 transition-colors">
            <div className="flex items-center mb-4">
              <div className="mr-3 p-2 bg-purple-100 rounded-lg">
                <Linkedin className="text-purple-600" size={20} />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">LinkedIn Profile</h2>
            </div>
            
            <div className="flex">
              <input
                type="url"
                value={linkedinLink}
                onChange={(e) => setLinkedinLink(e.target.value)}
                placeholder="https://linkedin.com/in/yourname"
                className="flex-1 p-4 border border-gray-300 rounded-l-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
              />
              <button className="px-6 bg-gray-200 text-gray-700 font-medium rounded-r-xl hover:bg-gray-300 transition-colors">
                Fetch
              </button>
            </div>
          </div>
          
          {/* Analyze Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={analyzeSkills}
            disabled={isAnalyzing || (!resume && !githubLink && !linkedinLink && certificates.length === 0)}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
          >
            {isAnalyzing ? (
              <>
                <div className="mr-3 h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing Your Skills...
              </>
            ) : (
              <>
                <Zap className="mr-3 h-6 w-6" />
                Analyze My Skills
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default SkillAnalyzer;