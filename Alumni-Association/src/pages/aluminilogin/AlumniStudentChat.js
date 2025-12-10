import React, { useState } from 'react';

const AlumniStudentChat = () => {
  // Mock student data
  const [students] = useState([
    {
      id: 1,
      name: 'Alex Johnson',
      department: 'Computer Science',
      batch: '2024',
      avatar: 'AJ',
      online: true,
      lastMessage: 'Thanks for the advice!',
      time: '10:30 AM',
      unread: 2
    },
    {
      id: 2,
      name: 'Maria Garcia',
      department: 'Data Science',
      batch: '2025',
      avatar: 'MG',
      online: true,
      lastMessage: 'Can we schedule a meeting?',
      time: '9:15 AM',
      unread: 0
    },
    {
      id: 3,
      name: 'Thomas Reed',
      department: 'Mechanical Eng.',
      batch: '2023',
      avatar: 'TR',
      online: false,
      lastMessage: 'I\'ll send the documents',
      time: 'Yesterday',
      unread: 0
    },
    {
      id: 4,
      name: 'Sophia Lee',
      department: 'Business Admin',
      batch: '2024',
      avatar: 'SL',
      online: true,
      lastMessage: 'Looking forward to it',
      time: 'Yesterday',
      unread: 5
    },
    {
      id: 5,
      name: 'Kwame Patel',
      department: 'Electrical Eng.',
      batch: '2025',
      avatar: 'KP',
      online: false,
      lastMessage: 'Thank you for your help',
      time: 'Dec 8',
      unread: 0
    }
  ]);

  // Mock chat messages
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'student',
      content: 'Hi! I wanted to ask about career opportunities in AI research.',
      time: '10:15 AM',
      avatar: 'AJ'
    },
    {
      id: 2,
      sender: 'alumni',
      content: 'Hello Alex! That\'s a great field to explore. I\'ve been working in AI for the past 3 years.',
      time: '10:17 AM'
    },
    {
      id: 3,
      sender: 'student',
      content: 'That sounds amazing! What skills would you recommend focusing on?',
      time: '10:18 AM',
      avatar: 'AJ'
    },
    {
      id: 4,
      sender: 'alumni',
      content: 'Definitely focus on machine learning frameworks like TensorFlow and PyTorch. Also, having a strong foundation in mathematics and statistics is crucial.',
      time: '10:20 AM'
    },
    {
      id: 5,
      sender: 'student',
      content: 'Thanks for the advice! Are there any specific projects you\'d recommend working on?',
      time: '10:22 AM',
      avatar: 'AJ'
    },
    {
      id: 6,
      sender: 'alumni',
      content: 'I\'d suggest starting with Kaggle competitions. They offer real-world datasets and problems. Also, try building your own projects like a recommendation system or chatbot.',
      time: '10:25 AM'
    },
    {
      id: 7,
      sender: 'student',
      content: 'That\'s really helpful! Thanks so much for taking the time to guide me.',
      time: '10:30 AM',
      avatar: 'AJ'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(students[0]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    const message = {
      id: messages.length + 1,
      sender: 'alumni',
      content: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB]">
      {/* Left Sidebar - Student List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800 mb-4">Student Chats</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Student List */}
        <div className="flex-1 overflow-y-auto">
          {students.map((student) => (
            <div 
              key={student.id}
              className={`flex items-center p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-purple-50 ${
                selectedStudent.id === student.id ? 'bg-purple-50 border-l-4 border-l-purple-500' : ''
              }`}
              onClick={() => setSelectedStudent(student)}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                  {student.avatar}
                </div>
                {student.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between">
                  <h3 className="font-semibold text-gray-900 truncate">{student.name}</h3>
                  <span className="text-xs text-gray-500">{student.time}</span>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600 truncate">{student.department}, {student.batch}</p>
                  {student.unread > 0 && (
                    <span className="bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {student.unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">{student.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Section - Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                {selectedStudent.avatar}
              </div>
              {selectedStudent.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="ml-3">
              <h2 className="font-semibold text-gray-900">{selectedStudent.name}</h2>
              <p className="text-sm text-gray-600">{selectedStudent.department}, {selectedStudent.batch} {selectedStudent.online ? '• Online' : ''}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#F5F6FA]">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.sender === 'alumni' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'student' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm mr-2 mt-1 flex-shrink-0">
                    {message.avatar}
                  </div>
                )}
                <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-2 ${
                  message.sender === 'alumni' 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
                }`}>
                  <p>{message.content}</p>
                  <div className={`text-xs mt-1 ${message.sender === 'alumni' ? 'text-purple-100' : 'text-gray-500'} text-right`}>
                    {message.time}
                  </div>
                </div>
                {message.sender === 'alumni' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm ml-2 mt-1 flex-shrink-0">
                    JA
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Message Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex items-center">
            <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 mx-2 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button 
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full p-2 hover:shadow-md transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AlumniStudentChat;