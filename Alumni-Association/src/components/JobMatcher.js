import React from 'react';

// Enhanced AI Job Matching Algorithm
export const calculateMatchScore = (studentProfile, job) => {
  // Extract student data
  const studentSkills = studentProfile.skills || [];
  const studentBadges = studentProfile.badges || [];
  const studentProjects = studentProfile.projects || 0;
  const studentCollege = studentProfile.college || '';
  const studentLocation = studentProfile.location || '';
  const studentExperience = studentProfile.experience || 0; // in years
  
  // Extract job requirements
  const requiredSkills = job.requiredSkills || [];
  const preferredSkills = job.preferredSkills || [];
  const requiredBadges = job.requiredBadges || [];
  const jobLocation = job.location || '';
  const jobCollegePreference = job.collegePreference || '';
  const minExperience = job.minExperience || 0;
  
  // Calculate skill match score (0-40 points)
  let skillScore = 0;
  const totalRequiredSkills = requiredSkills.length;
  
  if (totalRequiredSkills > 0) {
    const matchedRequiredSkills = requiredSkills.filter(skill => 
      studentSkills.some(studentSkill => 
        studentSkill.toLowerCase() === skill.toLowerCase()
      )
    ).length;
    
    skillScore = (matchedRequiredSkills / totalRequiredSkills) * 30;
    
    // Add bonus for preferred skills (0-10 points)
    const matchedPreferredSkills = preferredSkills.filter(skill => 
      studentSkills.some(studentSkill => 
        studentSkill.toLowerCase() === skill.toLowerCase()
      )
    ).length;
    
    const preferredSkillBonus = (matchedPreferredSkills / Math.max(preferredSkills.length, 1)) * 10;
    skillScore += preferredSkillBonus;
  }
  
  // Calculate badge match score (0-20 points)
  let badgeScore = 0;
  const totalRequiredBadges = requiredBadges.length;
  
  if (totalRequiredBadges > 0) {
    const matchedBadges = requiredBadges.filter(badge => 
      studentBadges.some(studentBadge => 
        studentBadge.name.toLowerCase() === badge.toLowerCase()
      )
    ).length;
    
    badgeScore = (matchedBadges / totalRequiredBadges) * 20;
  }
  
  // Calculate project experience score (0-15 points)
  const projectScore = Math.min((studentProjects / Math.max(job.minProjects || 1, 1)) * 15, 15);
  
  // Calculate experience score (0-10 points)
  const experienceScore = Math.min((studentExperience / Math.max(minExperience || 1, 1)) * 10, 10);
  
  // Calculate location match score (0-10 points)
  let locationScore = 0;
  if (jobLocation && studentLocation) {
    // Exact match
    if (jobLocation.toLowerCase() === studentLocation.toLowerCase()) {
      locationScore = 10;
    } 
    // Partial match (same city/region)
    else if (jobLocation.toLowerCase().includes(studentLocation.toLowerCase()) || 
             studentLocation.toLowerCase().includes(jobLocation.toLowerCase())) {
      locationScore = 5;
    }
  }
  
  // Calculate college match score (0-5 points)
  let collegeScore = 0;
  if (jobCollegePreference && studentCollege) {
    // Exact match
    if (jobCollegePreference.toLowerCase() === studentCollege.toLowerCase()) {
      collegeScore = 5;
    } 
    // Same university system
    else if (jobCollegePreference.toLowerCase().includes(studentCollege.toLowerCase()) || 
             studentCollege.toLowerCase().includes(jobCollegePreference.toLowerCase())) {
      collegeScore = 3;
    }
  }
  
  // Calculate total match score
  const totalScore = skillScore + badgeScore + projectScore + experienceScore + locationScore + collegeScore;
  
  // Normalize to 0-100 scale
  const normalizedScore = Math.min(Math.round(totalScore), 100);
  
  return {
    score: normalizedScore,
    details: {
      skills: Math.round(skillScore),
      badges: Math.round(badgeScore),
      projects: Math.round(projectScore),
      experience: Math.round(experienceScore),
      location: Math.round(locationScore),
      college: Math.round(collegeScore)
    }
  };
};

// Enhanced eligibility checker
export const checkEligibility = (studentProfile, job) => {
  const issues = [];
  let isEligible = true;
  
  // Check minimum project requirement
  if (job.minProjects && studentProfile.projects < job.minProjects) {
    isEligible = false;
    issues.push(`You need at least ${job.minProjects} completed project${job.minProjects > 1 ? 's' : ''}`);
  }
  
  // Check required skills
  if (job.requiredSkills && job.requiredSkills.length > 0) {
    const missingSkills = job.requiredSkills.filter(requiredSkill => 
      !studentProfile.skills.some(studentSkill => 
        studentSkill.toLowerCase() === requiredSkill.toLowerCase()
      )
    );
    
    if (missingSkills.length > 0) {
      isEligible = false;
      issues.push(`Missing required skills: ${missingSkills.join(', ')}`);
    }
  }
  
  // Check required badges
  if (job.requiredBadges && job.requiredBadges.length > 0) {
    const missingBadges = job.requiredBadges.filter(requiredBadge => 
      !studentProfile.badges.some(studentBadge => 
        studentBadge.name.toLowerCase() === requiredBadge.toLowerCase()
      )
    );
    
    if (missingBadges.length > 0) {
      isEligible = false;
      issues.push(`Missing required badges: ${missingBadges.join(', ')}`);
    }
  }
  
  // Check minimum experience
  if (job.minExperience && studentProfile.experience < job.minExperience) {
    isEligible = false;
    issues.push(`You need at least ${job.minExperience} year${job.minExperience > 1 ? 's' : ''} of experience`);
  }
  
  return {
    isEligible,
    issues
  };
};

// Filter jobs based on eligibility criteria
export const filterEligibleJobs = (studentProfile, jobs) => {
  return jobs.filter(job => {
    const eligibility = checkEligibility(studentProfile, job);
    return eligibility.isEligible;
  });
};

// Sort jobs by match score
export const sortJobsByMatch = (studentProfile, jobs) => {
  return jobs.map(job => {
    const matchData = calculateMatchScore(studentProfile, job);
    return {
      ...job,
      matchScore: matchData.score,
      matchDetails: matchData.details
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
};

// Get top job recommendations
export const getTopRecommendations = (studentProfile, jobs, limit = 5) => {
  const eligibleJobs = filterEligibleJobs(studentProfile, jobs);
  const sortedJobs = sortJobsByMatch(studentProfile, eligibleJobs);
  return sortedJobs.slice(0, limit);
};

// Job Matcher Component for UI display
export const JobMatchIndicator = ({ score }) => {
  let colorClass = '';
  let textClass = '';
  
  if (score >= 90) {
    colorClass = 'bg-green-500';
    textClass = 'text-green-800';
  } else if (score >= 80) {
    colorClass = 'bg-green-400';
    textClass = 'text-green-700';
  } else if (score >= 70) {
    colorClass = 'bg-yellow-400';
    textClass = 'text-yellow-700';
  } else if (score >= 60) {
    colorClass = 'bg-yellow-300';
    textClass = 'text-yellow-600';
  } else {
    colorClass = 'bg-red-300';
    textClass = 'text-red-700';
  }
  
  return (
    <span className={`${colorClass} ${textClass} px-2 py-1 rounded-full text-xs font-bold`}>
      {score}% Match
    </span>
  );
};

// Eligibility Status Component
export const EligibilityStatus = ({ studentProfile, job }) => {
  const eligibility = checkEligibility(studentProfile, job);
  const matchData = calculateMatchScore(studentProfile, job);
  
  if (eligibility.isEligible) {
    return (
      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">
            ✓
          </div>
          <div>
            <p className="font-medium text-green-700">You are eligible!</p>
            <p className="text-sm text-green-600">Your skill match: {matchData.score}%</p>
          </div>
        </div>
        <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:opacity-90 font-medium">
          Apply Now
        </button>
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white mr-3">
            !
          </div>
          <div>
            <p className="font-medium text-yellow-700">Additional requirements needed</p>
            <ul className="text-sm text-yellow-600 list-disc list-inside mt-1">
              {eligibility.issues.slice(0, 2).map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
              {eligibility.issues.length > 2 && (
                <li>+{eligibility.issues.length - 2} more requirements</li>
              )}
            </ul>
          </div>
        </div>
        <button className="bg-gray-300 text-gray-500 px-6 py-2 rounded-lg font-medium cursor-not-allowed" disabled>
          Apply
        </button>
      </div>
    );
  }
};

export default {
  calculateMatchScore,
  checkEligibility,
  filterEligibleJobs,
  sortJobsByMatch,
  getTopRecommendations,
  JobMatchIndicator,
  EligibilityStatus
};