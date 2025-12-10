import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Download, CheckCircle, AlertCircle, Edit3, BarChart, Eye, Zap, Star, Target, TrendingUp, Cpu, User, Briefcase, Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';

// AI Service for Gemini API integration
class AIService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    // Using the same configuration as your working curl command
    this.apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  }

  async analyzeResume(resumeText, jobRole) {
    try {
      const prompt = `Analyze this resume for the job role of "${jobRole}" and provide detailed feedback:
      
      Resume Content:
      ${resumeText}
      
      Please provide:
      1. An ATS compatibility score (0-100)
      2. A quantifiable achievements score (0-100)
      3. 3 specific content rewrite suggestions with before/after examples
      4. 3 formatting issues that need to be fixed
      5. 8 essential keywords for this role
      6. 3 expert structural suggestions
      
      Format the response as a JSON object with these fields:
      atsScore, quantifiableScore, corrections (array with original/improved), 
      formattingIssues (array), keywords (array), suggestions (array)`;

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
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return null;
    } catch (error) {
      console.error('Error analyzing resume with AI:', error);
      return null;
    }
  }
}

const ResumeImprover = () => {
  const [resume, setResume] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [jobRole, setJobRole] = useState('');
  const [showJobRoleInput, setShowJobRoleInput] = useState(false);
  const [resumeText, setResumeText] = useState('');

  // Initialize AI service with the provided API key
  const aiService = new AIService("AIzaSyBcYyqmtoTb_nphQC7-JQSfzv7Wxm8B7Yw");

  // Simulated progress steps for a more realistic analysis feel
  const analysisSteps = [
    "Uploading and parsing document structure...",
    "Evaluating Applicant Tracking System (ATS) compatibility...",
    "Scanning content for quantifiable achievements...",
    "Identifying high-value industry keywords...",
    "Reviewing grammar, tone, and active voice...",
    "Generating personalized improvement suggestions..."
  ];

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
      setAnalysisResult(null); // Reset analysis when a new file is uploaded
      setShowJobRoleInput(true); // Show job role input after upload
      
      // Read the file content as text
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeText(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const improveResume = async () => {
    if (!resume || !jobRole) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // --- REALISM SIMULATION: Step-by-step progress ---
    for (let i = 0; i < analysisSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
      setAnalysisProgress(i + 1);
    }
    
    try {
      // Analyze the resume with AI
      const aiAnalysisResult = await aiService.analyzeResume(resumeText, jobRole);
      
      // If AI analysis fails, show an error message
      if (!aiAnalysisResult) {
        setAnalysisResult({
          error: true,
          message: "Unable to analyze resume with AI at the moment. Please try again later."
        });
        setIsAnalyzing(false);
        return;
      }
      
      setAnalysisResult(aiAnalysisResult);
    } catch (error) {
      setAnalysisResult({
        error: true,
        message: error.message || "Failed to process the resume file. Please try again with a different file."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- Analysis Report View ---
  if (analysisResult) {
    // Handle error case
    if (analysisResult.error) {
      return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
          >
            <div className="bg-gradient-to-r from-red-800 via-red-900 to-red-800 p-6 text-white relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center">
                  <div className="mr-4 p-3 bg-white/20 rounded-2xl backdrop-blur-lg shadow-lg">
                    <AlertCircle className="h-8 w-8 text-red-400" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-extrabold">Analysis Error</h1>
                    <p className="text-red-200 text-sm mt-1">There was an issue analyzing your resume.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Unable to Analyze Resume</h3>
                <p className="text-gray-600 mb-6">{analysisResult.message}</p>
                <button
                  onClick={() => {
                    setAnalysisResult(null);
                    setShowJobRoleInput(false);
                    setJobRole('');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-red-700 to-red-800 text-white font-bold rounded-xl hover:from-red-800 hover:to-red-900 transition-all shadow-md"
                >
                  Try Again
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      );
    }
    
    const scoreColor = analysisResult.atsScore >= 90 ? "text-green-500" : analysisResult.atsScore >= 75 ? "text-amber-500" : "text-red-500";
    
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
        >
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-gray-800 via-blue-900 to-gray-900 p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-60 h-60 bg-cyan-500/10 rounded-full -translate-y-32 translate-x-32 animate-pulse-slow"></div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center">
                <div className="mr-4 p-3 bg-white/20 rounded-2xl backdrop-blur-lg shadow-lg">
                  <TrendingUp className="h-8 w-8 text-cyan-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold">Resume Optimization Complete</h1>
                  <p className="text-gray-400 text-sm mt-1">Review your AI-generated personalized improvement roadmap.</p>
                </div>
              </div>
              <div className="text-right flex items-center bg-white/10 p-3 rounded-xl">
                <BarChart className="h-6 w-6 mr-2 text-cyan-400" />
                <div>
                  <p className="text-sm text-gray-400 font-semibold">ATS Score</p>
                  <p className={`text-4xl font-extrabold ${scoreColor}`}>{analysisResult.atsScore}%</p>
                </div>
              </div>
            </div>
          </div>
        
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Corrections */}
              <div className="lg:col-span-2 bg-gray-50 rounded-2xl p-5 border border-green-200 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                  Content Rewrite Suggestions
                </h2>
                <div className="space-y-4">
                  {analysisResult.corrections && analysisResult.corrections.map((correction, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl p-4 border border-green-100 shadow-sm"
                    >
                      <div className="mb-2 border-b pb-2 border-dashed border-gray-200">
                        <p className="text-xs font-semibold text-gray-500 flex items-center"><Eye className="h-3 w-3 mr-1" /> Original (Passive/Vague):</p>
                        <p className="text-gray-700 mt-1 italic">{correction.original}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 flex items-center"><Zap className="h-3 w-3 mr-1 text-green-500" /> Improved (Active Voice/Quantifiable):</p>
                        <p className="text-green-800 font-medium mt-1" dangerouslySetInnerHTML={{ __html: correction.improved.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Side Panel: Keywords & Scores */}
              <div className="space-y-6">
                {/* Key Scores */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-200 shadow-md"
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center"><Target className="h-5 w-5 mr-2 text-blue-600" /> Key Metric Insights</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-blue-100">
                      <span className="text-gray-600">ATS Formatting Score:</span>
                      <span className="font-bold text-lg text-cyan-600">{analysisResult.atsScore}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Quantifiable Content Score:</span>
                      <span className="font-bold text-lg text-purple-600">{analysisResult.quantifiableScore}%</span>
                    </div>
                  </div>
                </motion.div>
              
                {/* Keywords */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-200 shadow-md"
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center"><Star className="h-5 w-5 mr-2 text-purple-600" /> Essential Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.keywords && analysisResult.keywords.map((keyword, index) => (
                      <span key={index} className="px-3 py-1 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-sm rounded-full shadow-md">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </motion.div>

              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              
              {/* Suggestions */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-purple-200 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Edit3 className="mr-2 h-5 w-5 text-purple-600" />
                  Expert Structural Suggestions
                </h2>
                <ul className="space-y-4">
                  {analysisResult.suggestions && analysisResult.suggestions.map((suggestion, index) => (
                    <motion.li 
                      key={index} 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15 }}
                      className="flex items-start p-3 bg-white rounded-xl border border-purple-100 shadow-sm"
                    >
                      <div className="mr-3 mt-1 text-purple-500 min-w-max">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <span className="text-gray-700">{suggestion}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Formatting Issues */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-amber-200 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5 text-amber-600" />
                  ATS Formatting Issues
                </h2>
                <ul className="space-y-4">
                  {analysisResult.formattingIssues && analysisResult.formattingIssues.map((issue, index) => (
                    <motion.li 
                      key={index} 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15 }}
                      className="flex items-start p-3 bg-white rounded-xl border border-amber-100 shadow-sm"
                    >
                      <div className="mr-3 mt-1 text-amber-600 min-w-max">
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <span className="text-gray-700">{issue}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Download Section */}
            <div className="mt-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 border border-gray-300 text-center">
              <div className="flex flex-col items-center">
                <div className="mb-4 p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-lg">
                  <FileText className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Ready for Action!</h3>
                <p className="text-gray-600 mb-6">Use these insights to update your resume and stand out to recruiters.</p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="px-6 py-3 bg-white text-gray-800 font-bold rounded-xl border border-gray-300 hover:bg-gray-100 transition-all flex items-center">
                    <Eye className="mr-2 h-5 w-5" />
                    View Original
                  </button>
                  
                  <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/50 hover:from-green-700 hover:to-emerald-700 transition-all flex items-center">
                    <Download className="mr-2 h-5 w-5" />
                    Download Suggested Edits
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  setAnalysisResult(null);
                  setShowJobRoleInput(false);
                  setJobRole('');
                }}
                className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all shadow-md"
              >
                Start New Analysis
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- Upload View ---
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl mb-4 shadow-lg">
            <Cpu className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Resume Optimization</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload your resume (PDF/DOCX) for a **deep analysis** on ATS compatibility, language, and keyword density.
          </p>
        </div>

        {/* Upload Area */}
        <div className={`border-4 border-dashed rounded-2xl p-8 transition-colors ${resume ? "border-green-400 bg-green-50/50" : "border-gray-300 hover:border-blue-500"}`}>
          <div className="flex flex-col items-center justify-center py-8">
            <FileText className={`mb-4 transition-colors ${resume ? "text-green-600" : "text-gray-400"}`} size={48} />
            <p className="text-gray-700 mb-4 text-center font-medium">
              {resume ? (
                <span className="text-green-700 font-bold">{resume.name}</span>
              ) : (
                "Drag & drop your resume file here or click the button below"
              )}
            </p>
            <label className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all cursor-pointer shadow-md">
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleResumeUpload}
              />
              <Upload className="inline h-5 w-5 mr-2" />
              {resume ? "Change File" : "Upload Resume File"}
            </label>
            <p className="text-gray-500 text-sm mt-3">Formats: PDF, DOCX, TXT (Max 10MB)</p>
          </div>
        </div>
        
        {/* Job Role Input */}
        {showJobRoleInput && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-6"
          >
            <label className="block text-gray-700 font-medium mb-2">
              Target Job Role
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g., Software Engineer, Data Analyst, Product Manager"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />
            </div>
            <p className="text-gray-500 text-sm mt-2">
              Enter the job role you're targeting for personalized recommendations
            </p>
          </motion.div>
        )}
        
        {/* Analysis Progress / Improve Button */}
        <motion.div className="mt-8">
          {isAnalyzing ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="p-4 bg-gray-800 rounded-2xl shadow-xl text-white"
            >
              <h3 className="font-bold mb-2 flex items-center">
                <div className="mr-3 h-5 w-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                AI Analysis in Progress...
              </h3>
              <p className="text-sm text-gray-400">{analysisSteps[analysisProgress - 1] || analysisSteps[0]}</p>
              <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" 
                  initial={{ width: 0 }}
                  animate={{ width: `${(analysisProgress / analysisSteps.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "linear" }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={improveResume}
              disabled={!resume || !jobRole}
              className="w-full py-4 bg-gradient-to-r from-blue-700 to-cyan-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
            >
              <Zap className="mr-3 h-6 w-6" />
              Start Resume Optimization
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResumeImprover;