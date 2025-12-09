import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Target, Calendar, MessageCircle, TrendingUp, Clock, BookOpen, Zap } from 'lucide-react';

const MentorshipTracker = () => {
  const activeMentorship = useMemo(() => ({
    id: 1,
    mentor: {
      name: 'Dr. Sarah Johnson',
      title: 'Senior Software Engineer at Google',
      avatar: 'SJ'
    },
    startDate: '2024-01-15',
    endDate: '2024-07-15',
    goals: [
      { id: 1, title: 'Master React Hooks', completed: true, dueDate: '2024-02-15' },
      { id: 2, title: 'Build a full-stack project', completed: true, dueDate: '2024-03-20' },
      { id: 3, title: 'Prepare for technical interviews', completed: false, dueDate: '2024-04-30' },
      { id: 4, title: 'Contribute to open source', completed: false, dueDate: '2024-05-15' },
      { id: 5, title: 'Create a professional portfolio', completed: false, dueDate: '2024-06-01' }
    ],
    roadmap: [
      { 
        month: 'January', 
        focus: 'Foundation Building', 
        tasks: [
          { id: 1, title: 'JavaScript fundamentals review', completed: true },
          { id: 2, title: 'CSS Grid and Flexbox mastery', completed: true },
          { id: 3, title: 'Introduction to React components', completed: true }
        ]
      },
      { 
        month: 'February', 
        focus: 'Advanced React', 
        tasks: [
          { id: 4, title: 'React Hooks deep dive', completed: true },
          { id: 5, title: 'State management with Context API', completed: true },
          { id: 6, title: 'Building reusable components', completed: false }
        ]
      },
      { 
        month: 'March', 
        focus: 'Full-Stack Development', 
        tasks: [
          { id: 7, title: 'Node.js and Express basics', completed: true },
          { id: 8, title: 'Database design with MongoDB', completed: true },
          { id: 9, title: 'Authentication and authorization', completed: false }
        ]
      },
      { 
        month: 'April', 
        focus: 'Project Implementation', 
        tasks: [
          { id: 10, title: 'Planning e-commerce project', completed: false },
          { id: 11, title: 'Frontend development', completed: false },
          { id: 12, title: 'Backend API development', completed: false }
        ]
      }
    ],
    feedback: [
      {
        id: 1,
        from: 'Dr. Sarah Johnson',
        date: '2024-03-10',
        content: 'Great progress on the React fundamentals! Your component structure is clean and well-organized.',
        rating: 5
      },
      {
        id: 2,
        from: 'Dr. Sarah Johnson',
        date: '2024-02-15',
        content: 'Excellent work on the CSS Grid assignment. I can see significant improvement in your layout skills.',
        rating: 5
      }
    ]
  }), []);

  const [completedTasks, setCompletedTasks] = useState(new Set([1, 2, 3, 4, 5, 6, 7, 8]));

  const toggleTaskCompletion = (taskId) => {
    const newCompletedTasks = new Set(completedTasks);
    if (newCompletedTasks.has(taskId)) {
      newCompletedTasks.delete(taskId);
    } else {
      newCompletedTasks.add(taskId);
    }
    setCompletedTasks(newCompletedTasks);
  };

  const getProgressPercentage = () => {
    const totalTasks = activeMentorship.roadmap.reduce((acc, month) => acc + month.tasks.length, 0);
    return Math.round((completedTasks.size / totalTasks) * 100);
  };

  const getCompletedGoals = () => {
    return activeMentorship.goals.filter(goal => goal.completed).length;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50"
      >
        {/* Enhanced Header with gradient background and animated elements */}
        <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 p-6 text-white relative overflow-hidden">
          {/* Animated Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/15 rounded-full -translate-y-20 translate-x-20 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/15 rounded-full translate-y-16 -translate-x-16 animate-pulse"></div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between relative z-10">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="mr-4 p-3 bg-white/25 rounded-2xl backdrop-blur-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold">Mentorship Progress Tracker</h1>
                <p className="text-cyan-100 text-sm mt-1">Tracking your journey with {activeMentorship.mentor.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white/25 rounded-xl p-3 text-center backdrop-blur-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
                <p className="text-sm text-cyan-100">Progress</p>
                <p className="text-2xl font-extrabold">{getProgressPercentage()}%</p>
              </div>
              
              <div className="bg-white/25 rounded-xl p-3 text-center backdrop-blur-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
                <p className="text-sm text-cyan-100">Goals Met</p>
                <p className="text-2xl font-extrabold">{getCompletedGoals()}/{activeMentorship.goals.length}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {/* Enhanced Mentor Info with Glass Effect */}
          <div className="bg-gradient-to-br from-cyan-50/90 to-blue-50/90 rounded-2xl p-5 border border-cyan-200/70 mb-6 backdrop-blur-lg shadow-lg transform transition-all duration-300 hover:shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="mr-4 w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-white/50 transform transition-transform duration-300 hover:scale-105">
                  {activeMentorship.mentor.avatar}
                </div>
                <div>
                  <h2 className="font-extrabold text-gray-800 text-xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{activeMentorship.mentor.name}</h2>
                  <p className="text-gray-700 text-base font-medium">{activeMentorship.mentor.title}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-cyan-100/70 shadow-sm transform transition-all duration-300 hover:scale-[1.02]">
                  <p className="text-gray-600 font-medium">Start Date</p>
                  <p className="font-bold text-gray-800">{new Date(activeMentorship.startDate).toLocaleDateString()}</p>
                </div>
                <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-cyan-100/70 shadow-sm transform transition-all duration-300 hover:scale-[1.02]">
                  <p className="text-gray-600 font-medium">End Date</p>
                  <p className="font-bold text-gray-800">{new Date(activeMentorship.endDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Goals */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Target className="mr-2 h-5 w-5 text-blue-500" />
                  Mentorship Goals
                </h2>
                
                <div className="space-y-4">
                  {activeMentorship.goals.map((goal) => (
                    <div key={goal.id} className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="mr-4">
                        {goal.completed ? (
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-white" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className={`font-medium ${goal.completed ? 'text-green-700 line-through' : 'text-gray-800'}`}>
                          {goal.title}
                        </h3>
                        <p className="text-sm text-gray-600">Due: {new Date(goal.dueDate).toLocaleDateString()}</p>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        {goal.completed ? 'Completed' : 'In Progress'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Roadmap */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-purple-500" />
                  Learning Roadmap
                </h2>
                
                <div className="space-y-6">
                  {activeMentorship.roadmap.map((month, index) => {
                    const completedTasksCount = month.tasks.filter(task => completedTasks.has(task.id)).length;
                    const progressPercentage = Math.round((completedTasksCount / month.tasks.length) * 100);
                    
                    return (
                      <div key={index} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-bold text-gray-800">{month.month}</h3>
                          <span className="text-sm font-medium text-purple-600">{month.focus}</span>
                        </div>
                        
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{progressPercentage}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {month.tasks.map((task) => (
                            <div key={task.id} className="flex items-center p-2 rounded-lg hover:bg-gray-50">
                              <div 
                                className="mr-3 cursor-pointer"
                                onClick={() => toggleTaskCompletion(task.id)}
                              >
                                {completedTasks.has(task.id) ? (
                                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                    <CheckCircle className="h-3 w-3 text-white" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                  </div>
                                )}
                              </div>
                              
                              <span className={`text-sm ${completedTasks.has(task.id) ? 'text-green-700 line-through' : 'text-gray-700'}`}>
                                {task.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Feedback & Upcoming */}
            <div>
              {/* Feedback */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5 text-green-500" />
                  Mentor Feedback
                </h2>
                
                <div className="space-y-4">
                  {activeMentorship.feedback.map((feedback) => (
                    <div key={feedback.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center mb-2">
                        <div className="mr-2 w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                          {feedback.from.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800 text-sm">{feedback.from}</h3>
                          <p className="text-xs text-gray-500">{new Date(feedback.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm">{feedback.content}</p>
                      
                      <div className="flex mt-2">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-4 h-4 ${i < feedback.rating ? 'text-amber-400' : 'text-gray-300'}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <button className="w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all text-sm flex items-center justify-center">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Send Message to Mentor
                  </button>
                </div>
              </div>
              
              {/* Upcoming Sessions */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-amber-500" />
                  Upcoming Sessions
                </h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                    <div className="flex items-center mb-2">
                      <Calendar className="mr-2 h-4 w-4 text-amber-600" />
                      <span className="font-medium text-gray-800">Bi-weekly Check-in</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Review progress on React project</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="mr-1 h-3 w-3" />
                      <span>Apr 15, 2024 • 2:00 PM PST</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <div className="flex items-center mb-2">
                      <Zap className="mr-2 h-4 w-4 text-blue-600" />
                      <span className="font-medium text-gray-800">Technical Workshop</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Advanced React patterns and performance</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="mr-1 h-3 w-3" />
                      <span>Apr 22, 2024 • 3:00 PM PST</span>
                    </div>
                  </div>
                  
                  <button className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all text-sm">
                    Schedule New Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MentorshipTracker;