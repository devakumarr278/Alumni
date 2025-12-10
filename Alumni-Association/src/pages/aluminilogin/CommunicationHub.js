import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiPaperclip, FiSmile, FiMoreVertical, FiSearch, FiUsers, FiMessageSquare, FiBell, FiSettings, FiLogOut, FiX, FiChevronDown, FiUserPlus, FiHash } from 'react-icons/fi';

const CommunicationHub = () => {
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(12);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Mock data for chats
  const [chats, setChats] = useState([
    {
      id: 1,
      name: 'John Smith',
      avatar: 'https://placehold.co/40x40/6366f1/white?text=JS',
      lastMessage: 'Hey, are you coming to the reunion?',
      timestamp: '2 min ago',
      unread: 2,
      online: true,
      isGroup: false
    },
    {
      id: 2,
      name: 'Alumni Networking Group',
      avatar: 'https://placehold.co/40x40/10b981/white?text=AG',
      lastMessage: 'Sarah: The event is moved to next week',
      timestamp: '1 hour ago',
      unread: 0,
      online: false,
      isGroup: true
    },
    {
      id: 3,
      name: 'Emily Johnson',
      avatar: 'https://placehold.co/40x40/ec4899/white?text=EJ',
      lastMessage: 'Thanks for the recommendation!',
      timestamp: '3 hours ago',
      unread: 0,
      online: true,
      isGroup: false
    },
    {
      id: 4,
      name: 'Tech Innovators',
      avatar: 'https://placehold.co/40x40/f97316/white?text=TI',
      lastMessage: 'Mike: New project proposal attached',
      timestamp: '1 day ago',
      unread: 5,
      online: false,
      isGroup: true
    },
    {
      id: 5,
      name: 'Robert Davis',
      avatar: 'https://placehold.co/40x40/8b5cf6/white?text=RD',
      lastMessage: 'See you at the conference!',
      timestamp: '2 days ago',
      unread: 0,
      online: false,
      isGroup: false
    }
  ]);

  // Mock data for messages
  const [messages, setMessages] = useState({
    1: [
      { id: 1, sender: 'John Smith', text: 'Hey there! How have you been?', time: '10:30 AM', isOwn: false },
      { id: 2, sender: 'You', text: 'Hi John! I\'m doing great, thanks for asking. How about you?', time: '10:32 AM', isOwn: true },
      { id: 3, sender: 'John Smith', text: 'Pretty good! Just got back from a trip to Japan. The culture there is amazing.', time: '10:35 AM', isOwn: false },
      { id: 4, sender: 'You', text: 'Wow, that sounds incredible! I\'ve always wanted to visit Japan. Did you take lots of photos?', time: '10:37 AM', isOwn: true },
      { id: 5, sender: 'John Smith', text: 'Yes, tons! I\'ll share them with you. By the way, are you coming to the alumni reunion next month?', time: '10:40 AM', isOwn: false }
    ],
    2: [
      { id: 1, sender: 'Sarah Miller', text: 'Just a reminder that the event has been moved to next week due to venue issues.', time: '9:15 AM', isOwn: false },
      { id: 2, sender: 'You', text: 'Thanks for letting us know, Sarah. I\'ll update my calendar.', time: '9:20 AM', isOwn: true }
    ]
  });

  // Mock contacts
  const contacts = [
    { id: 1, name: 'John Smith', avatar: 'https://placehold.co/40x40/6366f1/white?text=JS', online: true, mutual: 12 },
    { id: 2, name: 'Emily Johnson', avatar: 'https://placehold.co/40x40/ec4899/white?text=EJ', online: true, mutual: 8 },
    { id: 3, name: 'Robert Davis', avatar: 'https://placehold.co/40x40/8b5cf6/white?text=RD', online: false, mutual: 5 },
    { id: 4, name: 'Michael Wilson', avatar: 'https://placehold.co/40x40/f97316/white?text=MW', online: true, mutual: 15 },
    { id: 5, name: 'Sarah Miller', avatar: 'https://placehold.co/40x40/10b981/white?text=SM', online: false, mutual: 3 }
  ];

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (message.trim() === '' || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      sender: 'You',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessage]
    }));

    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const addEmoji = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const emojis = ['😀', '😂', '😍', '😎', '👍', '👏', '🎉', '🔥', '💯', '❤️', '🤔', '🙌'];

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Alumni Communication Hub
          </h1>
          <p className="text-gray-600 mt-2">Connect, collaborate, and stay in touch with your fellow alumni</p>
        </motion.div>

        {/* Main Container */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <motion.div 
            className="w-full lg:w-1/3 xl:w-1/4 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200/70 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Connections</h2>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <FiBell className="text-gray-600 text-xl" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
                  </div>
                  <FiSettings className="text-gray-600 text-xl cursor-pointer hover:text-indigo-600 transition-colors" />
                </div>
              </div>
              
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/70 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200/70">
              <button
                className={`flex-1 py-3 px-4 text-center font-medium transition-all ${
                  activeTab === 'chats'
                    ? 'text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('chats')}
              >
                <FiMessageSquare className="inline mr-2" />
                Chats
              </button>
              <button
                className={`flex-1 py-3 px-4 text-center font-medium transition-all ${
                  activeTab === 'contacts'
                    ? 'text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('contacts')}
              >
                <FiUsers className="inline mr-2" />
                Contacts
              </button>
            </div>
            
            {/* Chat List */}
            {activeTab === 'chats' && (
              <div className="overflow-y-auto h-[calc(100vh-280px)]">
                {filteredChats.map((chat) => (
                  <motion.div
                    key={chat.id}
                    className={`flex items-center p-4 border-b border-gray-200/50 cursor-pointer hover:bg-white/50 transition-all ${
                      selectedChat === chat.id ? 'bg-indigo-50/70 border-l-4 border-l-indigo-500' : ''
                    }`}
                    onClick={() => setSelectedChat(chat.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="relative">
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {chat.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                      {chat.isGroup && (
                        <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white rounded-full p-1">
                          <FiUsers className="text-xs" />
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                        <span className="text-xs text-gray-500">{chat.timestamp}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                        {chat.unread > 0 && (
                          <span className="bg-indigo-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Contacts List */}
            {activeTab === 'contacts' && (
              <div className="overflow-y-auto h-[calc(100vh-280px)]">
                <div className="p-4">
                  <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl mb-4 hover:from-indigo-600 hover:to-purple-600 transition-all">
                    <span className="font-medium">Find Alumni</span>
                    <FiUserPlus className="text-xl" />
                  </button>
                  
                  <div className="space-y-2">
                    {contacts.map((contact) => (
                      <motion.div
                        key={contact.id}
                        className="flex items-center p-3 rounded-xl hover:bg-white/50 cursor-pointer transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="relative">
                          <img
                            src={contact.avatar}
                            alt={contact.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          {contact.online && (
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <h3 className="font-medium text-gray-900">{contact.name}</h3>
                          <p className="text-xs text-gray-500">{contact.mutual} mutual connections</p>
                        </div>
                        <FiChevronDown className="text-gray-400" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Chat Window */}
          <motion.div 
            className="flex-1 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200/70 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative">
                        <img
                          src={chats.find(c => c.id === selectedChat)?.avatar}
                          alt={chats.find(c => c.id === selectedChat)?.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        {chats.find(c => c.id === selectedChat)?.online && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-bold text-gray-900">{chats.find(c => c.id === selectedChat)?.name}</h3>
                        <p className="text-xs text-gray-500">
                          {chats.find(c => c.id === selectedChat)?.online 
                            ? 'Online' 
                            : `Last seen ${chats.find(c => c.id === selectedChat)?.timestamp}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <FiSearch className="text-gray-600 text-xl cursor-pointer hover:text-indigo-600 transition-colors" />
                      <FiMoreVertical className="text-gray-600 text-xl cursor-pointer hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-white/50 to-indigo-50/30">
                  <div className="space-y-4">
                    {(messages[selectedChat] || []).map((msg) => (
                      <motion.div
                        key={msg.id}
                        className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div
                          className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-2 ${
                            msg.isOwn
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-none'
                              : 'bg-white/80 backdrop-blur-sm border border-gray-200/70 text-gray-800 rounded-bl-none'
                          }`}
                        >
                          {!msg.isOwn && (
                            <p className="text-xs font-semibold text-indigo-600 mb-1">{msg.sender}</p>
                          )}
                          <p className={`${msg.isOwn ? 'text-white' : 'text-gray-800'}`}>{msg.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.isOwn ? 'text-indigo-100' : 'text-gray-500'
                            } text-right`}
                          >
                            {msg.time}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                
                {/* Message Input */}
                <div className="p-4 border-t border-gray-200/70 bg-white/70 backdrop-blur-sm">
                  {/* Emoji Picker */}
                  <AnimatePresence>
                    {showEmojiPicker && (
                      <motion.div
                        className="mb-3 p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/70 shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                      >
                        <div className="flex flex-wrap gap-2">
                          {emojis.map((emoji, index) => (
                            <button
                              key={index}
                              className="text-2xl hover:bg-indigo-100 rounded-lg p-1 transition-colors"
                              onClick={() => addEmoji(emoji)}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Attachment Menu */}
                  <AnimatePresence>
                    {showAttachmentMenu && (
                      <motion.div
                        className="mb-3 p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/70 shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                      >
                        <div className="grid grid-cols-3 gap-2">
                          <button className="flex flex-col items-center p-2 rounded-lg hover:bg-indigo-50 transition-colors">
                            <div className="bg-indigo-100 p-2 rounded-lg mb-1">
                              <FiPaperclip className="text-indigo-600" />
                            </div>
                            <span className="text-xs text-gray-700">Document</span>
                          </button>
                          <button className="flex flex-col items-center p-2 rounded-lg hover:bg-indigo-50 transition-colors">
                            <div className="bg-indigo-100 p-2 rounded-lg mb-1">
                              <FiPaperclip className="text-indigo-600" />
                            </div>
                            <span className="text-xs text-gray-700">Image</span>
                          </button>
                          <button className="flex flex-col items-center p-2 rounded-lg hover:bg-indigo-50 transition-colors">
                            <div className="bg-indigo-100 p-2 rounded-lg mb-1">
                              <FiHash className="text-indigo-600" />
                            </div>
                            <span className="text-xs text-gray-700">Poll</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="flex items-center">
                    <div className="relative">
                      <button
                        className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors"
                        onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                      >
                        <FiPaperclip className="text-xl" />
                      </button>
                    </div>
                    
                    <div className="relative mx-2">
                      <button
                        className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      >
                        <FiSmile className="text-xl" />
                      </button>
                    </div>
                    
                    <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200/70">
                      <textarea
                        placeholder="Type a message..."
                        className="w-full px-4 py-3 bg-transparent border-none focus:outline-none resize-none max-h-24"
                        rows="1"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                      />
                    </div>
                    
                    <button
                      className="ml-2 p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg"
                      onClick={sendMessage}
                    >
                      <FiSend className="text-lg" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-6 rounded-full w-24 h-24 flex items-center justify-center mb-6">
                    <FiMessageSquare className="text-indigo-500 text-4xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Alumni Communication Hub</h3>
                  <p className="text-gray-600 max-w-md mb-6">
                    Select a conversation from the sidebar or start a new chat to connect with your fellow alumni.
                  </p>
                  <button
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-medium hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md"
                    onClick={() => setActiveTab('contacts')}
                  >
                    Find Alumni to Connect
                  </button>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
        
        {/* Online Users Indicator */}
        <motion.div 
          className="fixed bottom-6 right-6 bg-white/80 backdrop-blur-xl rounded-full px-4 py-2 shadow-lg border border-white/50 flex items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm font-medium text-gray-700">{onlineUsers} alumni online</span>
        </motion.div>
      </div>
    </div>
  );
};

export default CommunicationHub;