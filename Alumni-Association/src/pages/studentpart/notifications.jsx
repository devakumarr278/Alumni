import React from 'react';
// Removed StudentNavigation import as it's handled by the shared layout

const StudentNotifications = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:flex">
        {/* Removed StudentNavigation as it's handled by the shared layout */}
        
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Notifications & Messages</h1>
              <button className="text-sm text-blue-600 hover:text-blue-700">
                Mark all as read
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Notifications */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">Recent Notifications</h2>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    {[
                      {
                        id: 1,
                        type: 'mentorship',
                        title: 'Mentorship Request Accepted',
                        message: 'Jane Smith has accepted your mentorship request.',
                        time: '2 hours ago',
                        unread: true,
                        icon: '👥'
                      },
                      {
                        id: 2,
                        type: 'event',
                        title: 'Event Reminder',
                        message: 'Career Fair starts tomorrow at 2:00 PM.',
                        time: '1 day ago',
                        unread: true,
                        icon: '📅'
                      },
                      {
                        id: 3,
                        type: 'job',
                        title: 'New Job Opportunity',
                        message: 'Software Engineer Intern position at TechCorp matches your profile.',
                        time: '2 days ago',
                        unread: false,
                        icon: '💼'
                      },
                      {
                        id: 4,
                        type: 'badge',
                        title: 'Badge Earned!',
                        message: 'Congratulations! You earned the "Event Attendee" badge.',
                        time: '3 days ago',
                        unread: false,
                        icon: '🏆'
                      },
                      {
                        id: 5,
                        type: 'connection',
                        title: 'New Connection',
                        message: 'John Doe wants to connect with you.',
                        time: '1 week ago',
                        unread: false,
                        icon: '🤝'
                      },
                      {
                        id: 6,
                        type: 'system',
                        title: 'Profile Update Reminder',
                        message: 'Please update your graduation date and major information.',
                        time: '1 week ago',
                        unread: false,
                        icon: '⚙️'
                      }
                    ].map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-4 hover:bg-gray-50 cursor-pointer ${
                          notification.unread ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                              {notification.icon}
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <h3 className={`font-medium ${
                                notification.unread ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </h3>
                              {notification.unread && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Quick Actions & Settings */}
              <div className="space-y-6">
                {/* Notification Settings */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-sm">Email notifications</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <span className="text-sm">Mentorship updates</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <span className="text-sm">Event reminders</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <span className="text-sm">Job recommendations</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <span className="text-sm">Badge achievements</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <span className="text-sm">System updates</span>
                      <input type="checkbox" className="rounded" />
                    </label>
                  </div>
                </div>
                
                {/* Recent Messages */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Messages</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="w-8 h-8 bg-blue-500 rounded-full mr-3 flex items-center justify-center text-white text-sm font-medium">
                        JS
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium text-sm">Jane Smith</h4>
                        <p className="text-xs text-gray-600">Let's schedule our first mentorship call...</p>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    
                    <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="w-8 h-8 bg-purple-500 rounded-full mr-3 flex items-center justify-center text-white text-sm font-medium">
                        AA
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium text-sm">Alumni Association</h4>
                        <p className="text-xs text-gray-600">Welcome to the student portal!</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="w-8 h-8 bg-green-500 rounded-full mr-3 flex items-center justify-center text-white text-sm font-medium">
                        JD
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium text-sm">John Doe</h4>
                        <p className="text-xs text-gray-600">Thanks for connecting!</p>
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700">
                    View all messages
                  </button>
                </div>
                
                {/* Quick Stats */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Activity Summary</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Unread notifications</span>
                      <span className="font-medium text-blue-600">3</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">New messages</span>
                      <span className="font-medium text-green-600">1</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pending requests</span>
                      <span className="font-medium text-orange-600">2</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">This week's events</span>
                      <span className="font-medium text-purple-600">4</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentNotifications;