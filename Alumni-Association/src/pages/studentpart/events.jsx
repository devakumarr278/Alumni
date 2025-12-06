import React, { useState, useMemo } from 'react';
// Removed StudentNavigation import as it's handled by the shared layout
import { useStudent } from './StudentContext';
import { mockEvents } from './data/mockEvents';
import { sortBySkillMatch, filterByMatchThreshold, getMatchLevel } from './utils/skillMatcher';

const StudentEvents = () => {
  const { studentData } = useStudent();
  const [searchTerm, setSearchTerm] = useState('');
  const [eventType, setEventType] = useState('');
  const [showOnlyMatched, setShowOnlyMatched] = useState(false);
  const [minMatchThreshold, setMinMatchThreshold] = useState(25);
  
  const studentSkills = studentData?.profile?.skills || [];
  
  // Process events with skill matching
  const processedEvents = useMemo(() => {
    let events = sortBySkillMatch(mockEvents, studentSkills);
    
    // Apply filters
    if (searchTerm) {
      events = events.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (eventType) {
      events = events.filter(event => event.type.toLowerCase() === eventType.toLowerCase());
    }
    
    if (showOnlyMatched) {
      events = filterByMatchThreshold(events, minMatchThreshold);
    }
    
    return events;
  }, [searchTerm, eventType, showOnlyMatched, minMatchThreshold, studentSkills]);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:flex">
        {/* Removed StudentNavigation as it's handled by the shared layout */}
        
        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="pt-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Events & Workshops</h1>
            </div>
            
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Find Events</h2>
              
              {/* Skill Match Info */}
              {studentSkills.length > 0 && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">
                    🎯 Your Skills: {studentSkills.join(', ')}
                  </h3>
                  <p className="text-xs text-blue-600">
                    Events are ranked by relevance to your skills
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input 
                  type="text" 
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-md p-2"
                />
                <select 
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="border border-gray-300 rounded-md p-2"
                >
                  <option value="">All Event Types</option>
                  <option value="workshop">Workshop</option>
                  <option value="meetup">Meetup</option>
                  <option value="bootcamp">Bootcamp</option>
                  <option value="conference">Conference</option>
                  <option value="seminar">Seminar</option>
                </select>
                <div className="text-sm text-gray-600 flex items-center">
                  Found {processedEvents.length} events
                </div>
              </div>
              
              {/* Skill Matching Filters */}
              {studentSkills.length > 0 && (
                <div className="flex flex-wrap gap-4 items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showOnlyMatched}
                      onChange={(e) => setShowOnlyMatched(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">Show only skill-relevant events</span>
                  </label>
                  
                  {showOnlyMatched && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Min relevance:</span>
                      <select
                        value={minMatchThreshold}
                        onChange={(e) => setMinMatchThreshold(parseInt(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        <option value={25}>25%</option>
                        <option value={50}>50%</option>
                        <option value={75}>75%</option>
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Events */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-6">Upcoming Events</h2>
            
            <div className="space-y-6">
              {processedEvents.length > 0 ? (
                processedEvents.map((event) => {
                  const matchLevel = getMatchLevel(event.skillMatch?.matchPercentage || 0);
                  
                  return (
                    <div key={event.id} className="bg-white rounded-lg shadow p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {event.title}
                            </h3>
                            {studentSkills.length > 0 && event.skillMatch && event.skillMatch.matchPercentage > 0 && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                matchLevel.bgColor
                              } ${matchLevel.textColor}`}>
                                {event.skillMatch.matchPercentage}% Relevant
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{event.organizer}</p>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            {event.date} • {event.time}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-3">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {event.location} • {event.format}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            event.type === 'Workshop' ? 'bg-blue-100 text-blue-800' :
                            event.type === 'Bootcamp' ? 'bg-purple-100 text-purple-800' :
                            event.type === 'Meetup' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {event.type}
                          </span>
                          <p className="text-sm text-gray-600 mt-1">{event.difficulty}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-gray-700 text-sm mb-3">
                          {event.description}
                        </p>
                        
                        {/* Skills Section with Matching */}
                        {(event.requiredSkills?.length > 0 || event.preferredSkills?.length > 0) && (
                          <div className="mb-3">
                            <div className="flex flex-wrap gap-2">
                              {/* Required Skills */}
                              {event.requiredSkills?.map((skill) => {
                                const isMatched = studentSkills.some(studentSkill => 
                                  studentSkill.toLowerCase() === skill.toLowerCase()
                                );
                                return (
                                  <span 
                                    key={skill}
                                    className={`px-2 py-1 rounded text-sm border ${
                                      isMatched 
                                        ? 'bg-green-100 text-green-800 border-green-300' 
                                        : 'bg-orange-100 text-orange-800 border-orange-300'
                                    }`}
                                    title={isMatched ? 'You have this skill!' : 'Recommended skill'}
                                  >
                                    {skill} {isMatched ? '✓' : '→'}
                                  </span>
                                );
                              })}
                              
                              {/* Preferred Skills */}
                              {event.preferredSkills?.map((skill) => {
                                const isMatched = studentSkills.some(studentSkill => 
                                  studentSkill.toLowerCase() === skill.toLowerCase()
                                );
                                return (
                                  <span 
                                    key={skill}
                                    className={`px-2 py-1 rounded text-sm border ${
                                      isMatched 
                                        ? 'bg-blue-100 text-blue-800 border-blue-300' 
                                        : 'bg-gray-100 text-gray-700 border-gray-300'
                                    }`}
                                    title={isMatched ? 'You have this helpful skill!' : 'Helpful skill'}
                                  >
                                    {skill} {isMatched ? '✓' : ''}
                                  </span>
                                );
                              })}
                            </div>
                            
                            {studentSkills.length > 0 && event.skillMatch && (
                              <div className="mt-2 text-xs text-gray-600">
                                → Recommended for event • ✓ You have this skill
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">{event.registered}/{event.capacity}</span> registered • 
                          <span className="ml-1">{event.price}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          Benefits: {event.benefits?.join(' • ')}
                        </div>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                          RSVP
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-gray-600">
                    {studentSkills.length === 0 
                      ? 'Add skills to your profile to see personalized event recommendations!' 
                      : 'No events found matching your criteria. Try adjusting your filters.'}
                  </p>
                  {studentSkills.length === 0 && (
                    <a href="/student/profile" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                      Update Your Profile →
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* My RSVPs and Recent Announcements */}
          <div className="space-y-8">
            {/* My RSVPs */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">My RSVPs</h3>
              
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-3">
                  <h4 className="font-medium text-sm">Alumni Networking Night</h4>
                  <p className="text-xs text-gray-600">Tomorrow at 7:00 PM</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-3">
                  <h4 className="font-medium text-sm">Tech Talk: AI in Industry</h4>
                  <p className="text-xs text-gray-600">Next week</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-3">
                  <h4 className="font-medium text-sm">Graduate School Info Session</h4>
                  <p className="text-xs text-gray-600">Next month</p>
                </div>
              </div>
            </div>
            
            {/* Recent Announcements */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Announcements</h3>
              
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-3">
                  <h4 className="font-medium text-sm mb-1">New Scholarship Program</h4>
                  <p className="text-xs text-gray-600 mb-2">Posted 2 days ago</p>
                  <p className="text-xs text-gray-700">
                    Applications now open for the Alumni Merit Scholarship...
                  </p>
                </div>
                
                <div className="border-b border-gray-200 pb-3">
                  <h4 className="font-medium text-sm mb-1">Campus Updates</h4>
                  <p className="text-xs text-gray-600 mb-2">Posted 1 week ago</p>
                  <p className="text-xs text-gray-700">
                    New study spaces available in the library...
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-1">Alumni Spotlights</h4>
                  <p className="text-xs text-gray-600 mb-2">Posted 2 weeks ago</p>
                  <p className="text-xs text-gray-700">
                    Read about our recent graduates making impact...
                  </p>
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

export default StudentEvents;