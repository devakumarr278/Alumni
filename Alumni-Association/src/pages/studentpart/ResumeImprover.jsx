import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Download, CheckCircle, AlertCircle, Edit3, BarChart, Eye, Zap, Star, Target, TrendingUp, Cpu } from 'lucide-react';

const ResumeImprover = () => {
  const [resume, setResume] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

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
    }
  };

  const improveResume = async () => {
    if (!resume) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // --- REALISM SIMULATION: Step-by-step progress ---
    for (let i = 0; i < analysisSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
      setAnalysisProgress(i + 1);
    }
    
    // Simulate final API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock analysis result (Realistic Data)
    const mockResult = {
      atsScore: 92,
      quantifiableScore: 78,
      corrections: [
        { 
          original: "Responsible for managing project tasks and coordinating team efforts.", 
          improved: "Spearheaded **Agile** project management for a team of 5 engineers, resulting in a **15% reduction** in sprint cycle time." 
        },
        { 
          original: "Used React to build the client-side.", 
          improved: "Developed and launched **high-performance** client interfaces using **React** and **TypeScript**, achieving **90+ Lighthouse scores**." 
        },
        { 
          original: "Fixed several bugs in the existing system.", 
          improved: "Resolved **50+ critical production bugs**, enhancing system stability and reducing reported customer issues by **25%**." 
        }
      ],
      formattingIssues: [
        "The date format (MM/YY vs YYYY) is inconsistent across the Experience section.",
        "The use of excessive bold text may confuse older ATS systems.",
        "Margins are too narrow, risking content bleed on print or parse errors."
      ],
      keywords: [
        "JavaScript (ES6+)", "CloudFormation", "Microservices", "CI/CD", "Docker", "RESTful APIs", "SQL", "Unit Testing"
      ],
      suggestions: [
        "Adopt the 'XYZ' method (Achieved X using Y, resulting in Z) for all bullet points to maximize impact.",
        "Move core technical skills to a prominent top section for immediate ATS keyword scanning.",
        "Review and consolidate experience sections to ensure the entire resume fits on one page (recommended for less than 10 years experience)."
      ]
    };
    
    setAnalysisResult(mockResult);
    setIsAnalyzing(false);
  };

  // --- Analysis Report View ---
  if (analysisResult) {
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
                  {analysisResult.corrections.map((correction, index) => (
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
                    {analysisResult.keywords.map((keyword, index) => (
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
                  {analysisResult.suggestions.map((suggestion, index) => (
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
                  {analysisResult.formattingIssues.map((issue, index) => (
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
                onClick={() => setAnalysisResult(null)}
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
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
              />
              <Upload className="inline h-5 w-5 mr-2" />
              {resume ? "Change File" : "Upload Resume File"}
            </label>
            <p className="text-gray-500 text-sm mt-3">Formats: PDF, DOCX (Max 10MB)</p>
          </div>
        </div>
        
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
              disabled={!resume}
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