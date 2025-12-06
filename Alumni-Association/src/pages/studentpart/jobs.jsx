import React, { useState, useEffect, useMemo } from 'react';
// Removed StudentNavigation import as it's handled by the shared layout
import { useStudent } from './StudentContext';
import { mockJobs } from './data/mockJobs';
import { sortBySkillMatch, filterByMatchThreshold, getMatchLevel } from './utils/skillMatcher';

const StudentJobs = () => {
  const { studentData } = useStudent();
  const [searchTerm, setSearchTerm] = useState('');
  const [jobType, setJobType] = useState('');
  const [location, setLocation] = useState('');
  const [showOnlyMatched, setShowOnlyMatched] = useState(false);
  const [minMatchThreshold, setMinMatchThreshold] = useState(25);
  
  const studentSkills = studentData?.profile?.skills || [];
  
  // Process jobs with skill matching
  const processedJobs = useMemo(() => {
    let jobs = sortBySkillMatch(mockJobs, studentSkills);
    
    // Apply filters
    if (searchTerm) {
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (jobType) {
      jobs = jobs.filter(job => job.type.toLowerCase() === jobType.toLowerCase());
    }
    
    if (location) {
      jobs = jobs.filter(job => 
        job.location.toLowerCase().includes(location.toLowerCase()) ||
        (location === 'remote' && job.remote)
      );
    }
    
    if (showOnlyMatched) {
      jobs = filterByMatchThreshold(jobs, minMatchThreshold);
    }
    
    return jobs;
  }, [searchTerm, jobType, location, showOnlyMatched, minMatchThreshold, studentSkills]);
  
  const handleSearch = () => {
    // Search is handled by useMemo automatically
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:flex">
        {/* Removed StudentNavigation as it's handled by the shared layout */}
        
        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="pt-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Jobs & Internships</h1>
            </div>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Search Opportunities</h2>
          
          {/* Skill Match Info */}
          {studentSkills.length > 0 && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                🎯 Your Skills: {studentSkills.join(', ')}
              </h3>
              <p className="text-xs text-blue-600">
                Jobs are automatically ranked by skill match relevance
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input 
              type="text" 
              placeholder="Job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md p-2"
            />
            <select 
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="">All Job Types</option>
              <option value="full-time">Full-time</option>
              <option value="internship">Internship</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
            </select>
            <select 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="">All Locations</option>
              <option value="remote">Remote</option>
              <option value="new york">New York</option>
              <option value="san francisco">San Francisco</option>
              <option value="boston">Boston</option>
              <option value="austin">Austin</option>
              <option value="seattle">Seattle</option>
            </select>
            <button 
              onClick={handleSearch}
              className="bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Search
            </button>
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
                <span className="text-sm">Show only skill-matched jobs</span>
              </label>
              
              {showOnlyMatched && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Min match:</span>
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
              
              <div className="text-sm text-gray-600">
                Found {processedJobs.length} jobs
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {/* Job Listings */}
          {processedJobs.length > 0 ? (
            processedJobs.map((job) => {
              const matchLevel = getMatchLevel(job.skillMatch?.matchPercentage || 0);
              
              return (
                <div key={job.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        {studentSkills.length > 0 && job.skillMatch && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            matchLevel.bgColor
                          } ${matchLevel.textColor}`}>
                            {job.skillMatch.matchPercentage}% Match - {matchLevel.level}
                          </span>
                        )}
                      </div>
                      <p className="text-lg text-blue-600 font-medium">{job.company}</p>
                      <p className="text-sm text-gray-600">
                        {job.location} {job.remote && '• Remote Option'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        job.type === 'Internship' ? 'bg-green-100 text-green-800' :
                        job.type === 'Full-time' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.type}
                      </span>
                      <p className="text-sm text-gray-600 mt-1">{job.experience}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-700 mb-3">
                      {job.description}
                    </p>
                    
                    {/* Skills Section with Matching */}
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-2">
                        {/* Required Skills */}
                        {job.requiredSkills?.map((skill) => {
                          const isMatched = studentSkills.some(studentSkill => 
                            studentSkill.toLowerCase() === skill.toLowerCase()
                          );
                          return (
                            <span 
                              key={skill}
                              className={`px-2 py-1 rounded text-sm border ${
                                isMatched 
                                  ? 'bg-green-100 text-green-800 border-green-300' 
                                  : 'bg-red-100 text-red-800 border-red-300'
                              }`}
                              title={isMatched ? 'You have this skill!' : 'Required skill'}
                            >
                              {skill} {isMatched ? '✓' : '*'}
                            </span>
                          );
                        })}
                        
                        {/* Preferred Skills */}
                        {job.preferredSkills?.map((skill) => {
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
                              title={isMatched ? 'You have this preferred skill!' : 'Preferred skill'}
                            >
                              {skill} {isMatched ? '✓' : ''}
                            </span>
                          );
                        })}
                      </div>
                      
                      {studentSkills.length > 0 && job.skillMatch && (
                        <div className="mt-2 text-xs text-gray-600">
                          * Required • Preferred • ✓ You have this skill
                          {job.skillMatch.missingRequired.length > 0 && (
                            <span className="ml-2 text-red-600">
                              Missing required: {job.skillMatch.missingRequired.join(', ')}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Benefits */}
                    <div className="text-sm text-gray-600">
                      Benefits: {job.benefits?.join(' • ')}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {job.salary}
                    </div>
                    <div className="space-x-3">
                      <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50">
                        Save
                      </button>
                      <button className={`px-4 py-2 rounded-md ${
                        job.skillMatch?.isQualified
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-400 text-white cursor-not-allowed'
                      }`}>
                        {job.skillMatch?.isQualified ? 'Apply Now' : 'Skills Gap'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-600">
                {studentSkills.length === 0 
                  ? 'Add skills to your profile to see personalized job matches!' 
                  : 'No jobs found matching your criteria. Try adjusting your filters.'}
              </p>
              {studentSkills.length === 0 && (
                <a href="/student/profile" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                  Update Your Profile →
                </a>
              )}
            </div>
          )}
        </div>
        
        {/* My Applications Section */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-6">My Applications</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-semibold">Frontend Developer Intern</h3>
                <p className="text-sm text-gray-600">StartupXYZ • Applied 1 week ago</p>
              </div>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Under Review
              </span>
            </div>
            
            <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-semibold">Data Science Intern</h3>
                <p className="text-sm text-gray-600">BigCorp • Applied 3 days ago</p>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Interview Scheduled
              </span>
            </div>
          </div>
        </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default StudentJobs;