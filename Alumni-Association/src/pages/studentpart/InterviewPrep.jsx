import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, RotateCcw, MessageCircle, User, Bot, Send, BookOpen, Target, Zap, Award } from 'lucide-react';

const InterviewPrep = () => {
  const [activeTab, setActiveTab] = useState('questions');
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! I\'m your AI Interview Coach. What position are you preparing for?', timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [practiceHistory, setPracticeHistory] = useState([]);

  // Mock interview questions
  const technicalQuestions = useMemo(() => [
    {
      id: 1,
      question: "Explain the difference between let, const, and var in JavaScript.",
      category: "JavaScript",
      difficulty: "Beginner"
    },
    {
      id: 2,
      question: "What is the virtual DOM in React and how does it work?",
      category: "React",
      difficulty: "Intermediate"
    },
    {
      id: 3,
      question: "Describe the differences between SQL and NoSQL databases.",
      category: "Databases",
      difficulty: "Intermediate"
    },
    {
      id: 4,
      question: "Explain the concept of closure in JavaScript with an example.",
      category: "JavaScript",
      difficulty: "Advanced"
    }
  ], []);

  const behavioralQuestions = useMemo(() => [
    {
      id: 1,
      question: "Tell me about a time you faced a challenging problem and how you solved it.",
      category: "Problem Solving",
      difficulty: "General"
    },
    {
      id: 2,
      question: "Describe a situation where you had to work with a difficult team member.",
      category: "Teamwork",
      difficulty: "General"
    },
    {
      id: 3,
      question: "How do you handle tight deadlines and pressure?",
      category: "Stress Management",
      difficulty: "General"
    }
  ], []);

  const hrQuestions = useMemo(() => [
    {
      id: 1,
      question: "Why do you want to work for our company?",
      category: "Company Fit",
      difficulty: "General"
    },
    {
      id: 2,
      question: "Where do you see yourself in 5 years?",
      category: "Career Goals",
      difficulty: "General"
    },
    {
      id: 3,
      question: "What are your salary expectations?",
      category: "Compensation",
      difficulty: "General"
    }
  ], []);

  const startPractice = (question) => {
    setCurrentQuestion(question);
    setMessages([
      { id: 1, sender: 'ai', text: `Let's practice this question: "${question.question}"`, timestamp: new Date() },
      { id: 2, sender: 'ai', text: 'Take your time to think, then record your answer when you\'re ready.', timestamp: new Date() }
    ]);
    setActiveTab('chat');
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'user',
        text: '[Recording in progress...]',
        timestamp: new Date()
      }]);
    } else {
      // Stop recording
      setMessages(prev => {
        const updated = [...prev];
        const lastMessage = updated[updated.length - 1];
        if (lastMessage.sender === 'user' && lastMessage.text === '[Recording in progress...]') {
          updated[updated.length - 1] = {
            ...lastMessage,
            text: 'Thank you for your answer. Here\'s my feedback:'
          };
        }
        return updated;
      });
      
      // Add AI feedback
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: 'ai',
          text: 'Great response! You covered the key points well. Consider elaborating more on the practical applications.',
          timestamp: new Date()
        }]);
      }, 1000);
    }
  };

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'user',
        text: inputMessage,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputMessage('');
      
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: 'ai',
          text: 'That\'s a thoughtful question. Based on your profile and the position you\'re targeting, I recommend focusing on...',
          timestamp: new Date()
        }]);
      }, 1000);
    }
  };

  const QuestionCard = ({ question, onStart }) => (
    <div className="border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5 bg-white border-gray-200 hover:border-blue-300">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-sm ${
              question.difficulty === 'Beginner' 
                ? 'bg-green-100/90 text-green-800' 
                : question.difficulty === 'Intermediate' 
                  ? 'bg-amber-100/90 text-amber-800' 
                  : 'bg-red-100/90 text-red-800'
            }`}>
              {question.difficulty}
            </span>
          </div>
          <span className="text-xs font-medium text-gray-700 bg-gray-100/90 px-3 py-1.5 rounded-full shadow-sm">
            {question.category}
          </span>
        </div>
        
        <p className="text-gray-800 mb-4">{question.question}</p>
        
        <button
          onClick={() => onStart(question)}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all text-sm shadow-lg hover:shadow-xl transform transition-transform duration-300 hover:scale-[1.02]"
        >
          Practice This Question
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50"
      >
        {/* Enhanced Header with gradient background and animated elements */}
        <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-6 text-white relative overflow-hidden">
          {/* Animated Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/15 rounded-full -translate-y-20 translate-x-20 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/15 rounded-full translate-y-16 -translate-x-16 animate-pulse"></div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between relative z-10">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="mr-4 p-3 bg-white/25 rounded-2xl backdrop-blur-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
                <MessageCircle className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold">AI Interview Preparation</h1>
                <p className="text-blue-100 text-sm mt-1">Practice with our AI coach for technical, behavioral, and HR interviews</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-xl p-3 text-center">
                <p className="text-sm text-blue-100">Sessions</p>
                <p className="text-xl font-bold">12</p>
              </div>
              
              <div className="bg-white/20 rounded-xl p-3 text-center">
                <p className="text-sm text-blue-100">Success Rate</p>
                <p className="text-xl font-bold">85%</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
            <button 
              onClick={() => setActiveTab('questions')}
              className={`px-4 py-2 text-sm rounded-lg transition-all ${
                activeTab === 'questions' 
                  ? 'bg-white shadow-sm text-gray-800 font-medium' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Practice Questions
            </button>
            <button 
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 text-sm rounded-lg transition-all ${
                activeTab === 'chat' 
                  ? 'bg-white shadow-sm text-gray-800 font-medium' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              AI Interview Coach
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-sm rounded-lg transition-all ${
                activeTab === 'history' 
                  ? 'bg-white shadow-sm text-gray-800 font-medium' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Practice History
            </button>
          </div>
          
          {/* Questions Tab */}
          {activeTab === 'questions' && (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Technical Questions */}
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-blue-500" />
                    Technical Questions
                  </h2>
                  <div className="space-y-4">
                    {technicalQuestions.map(question => (
                      <QuestionCard 
                        key={question.id} 
                        question={question} 
                        onStart={startPractice} 
                      />
                    ))}
                  </div>
                </div>
                
                {/* Behavioral Questions */}
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <User className="mr-2 h-5 w-5 text-green-500" />
                    Behavioral Questions
                  </h2>
                  <div className="space-y-4">
                    {behavioralQuestions.map(question => (
                      <QuestionCard 
                        key={question.id} 
                        question={question} 
                        onStart={startPractice} 
                      />
                    ))}
                  </div>
                </div>
                
                {/* HR Questions */}
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <Target className="mr-2 h-5 w-5 text-purple-500" />
                    HR Questions
                  </h2>
                  <div className="space-y-4">
                    {hrQuestions.map(question => (
                      <QuestionCard 
                        key={question.id} 
                        question={question} 
                        onStart={startPractice} 
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Tips */}
              <div className="mt-8 p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                <h3 className="font-bold text-gray-800 mb-3">Interview Tips</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span>Research the company thoroughly before the interview</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span>Prepare specific examples using the STAR method (Situation, Task, Action, Result)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span>Ask thoughtful questions about the role and team dynamics</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
          
          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-[500px]">
              {currentQuestion && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 mb-4 border border-blue-200">
                  <p className="font-medium text-gray-800">Practicing: "{currentQuestion.question}"</p>
                </div>
              )}
              
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded-xl">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        message.sender === 'user' 
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        {message.sender === 'ai' ? (
                          <Bot className="mr-2 h-4 w-4" />
                        ) : (
                          <User className="mr-2 h-4 w-4" />
                        )}
                        <span className="text-xs font-medium">
                          {message.sender === 'ai' ? 'AI Coach' : 'You'}
                        </span>
                      </div>
                      <p>{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleRecording}
                  className={`flex items-center justify-center w-12 h-12 rounded-full ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                  } text-white transition-all`}
                >
                  {isRecording ? <Square size={20} /> : <Mic size={20} />}
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask a question or type your answer..."
                    className="w-full p-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button
                    onClick={sendMessage}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-blue-500 hover:text-blue-600"
                  >
                    <Send size={20} />
                  </button>
                </div>
                
                <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                  <RotateCcw size={20} className="text-gray-600" />
                </button>
              </div>
            </div>
          )}
          
          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">Your Practice Sessions</h2>
              
              {practiceHistory.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">No practice sessions yet. Start practicing to see your history here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {practiceHistory.map((session, index) => (
                    <div key={index} className="border border-gray-200 rounded-2xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-800">{session.question}</h3>
                        <span className="text-xs text-gray-500">{session.date}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full mr-2">
                          {session.score}/10
                        </span>
                        <span className="text-gray-600">{session.feedback}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-200">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                  <Award className="mr-2 h-5 w-5 text-purple-500" />
                  Performance Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-purple-100">
                    <p className="text-sm text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-purple-600">8.2/10</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-purple-100">
                    <p className="text-sm text-gray-600">Questions Practiced</p>
                    <p className="text-2xl font-bold text-purple-600">24</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-purple-100">
                    <p className="text-sm text-gray-600">Improvement</p>
                    <p className="text-2xl font-bold text-green-600">+15%</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default InterviewPrep;