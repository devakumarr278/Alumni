// Simple mentor matching utilities to resolve import error

/**
 * Calculate a mentor score based on various factors
 * @param {Object} mentor - Mentor data
 * @param {Object} student - Student data
 * @returns {Object} Score details including total and breakdown
 */
export const calculateMentorScore = (mentor, student) => {
  if (!mentor || !student) return { total: 0, domainMatch: 0, skillMatch: 0, experienceMatch: 0, interestsMatch: 0 };
  
  let domainMatch = 0;
  let skillMatch = 0;
  let experienceMatch = 0;
  let interestsMatch = 0;
  
  // Match based on domain/department (40% weight)
  if (mentor.department && student.profile && student.profile.major) {
    if (mentor.department.toLowerCase() === student.profile.major.toLowerCase()) {
      domainMatch = 40;
    }
  }
  
  // Match based on skills (30% weight)
  if (mentor.skills && student.profile && student.profile.skills) {
    const commonSkills = mentor.skills.filter(skill => 
      student.profile.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(s.toLowerCase()))
    );
    skillMatch = (commonSkills.length / Math.max(mentor.skills.length, 1)) * 30;
  }
  
  // Match based on company/industry (20% weight)
  if (mentor.company && student.profile && student.profile.domain) {
    if (mentor.company.toLowerCase().includes(student.profile.domain.toLowerCase()) ||
        student.profile.domain.toLowerCase().includes(mentor.company.toLowerCase())) {
      experienceMatch = 20;
    }
  }
  
  // Years of experience factor (10% weight)
  if (mentor.yearsOfExperience) {
    // More experienced mentors get higher scores, but capped
    experienceMatch += Math.min(mentor.yearsOfExperience, 10) * 1;
  }
  
  // Match based on interests
  if (student.profile && student.profile.interests && mentor.mentorshipAreas) {
    const commonInterests = student.profile.interests.filter(interest => 
      mentor.mentorshipAreas.some(area => area.toLowerCase().includes(interest.toLowerCase()) || 
        interest.toLowerCase().includes(area.toLowerCase()))
    );
    interestsMatch = (commonInterests.length / Math.max(student.profile.interests.length, 1)) * 15;
  }
  
  const total = Math.min(domainMatch + skillMatch + experienceMatch + interestsMatch, 100);
  
  return { total, domainMatch, skillMatch, experienceMatch, interestsMatch };
};

/**
 * Get recommendations with diversity
 * @param {Object} student - Student data
 * @param {Array} alumniList - List of alumni
 * @param {Object} options - Options for recommendation
 * @returns {Array} Sorted and diverse recommendations
 */
export const getRecommendationsWithDiversity = (student, alumniList, options = {}) => {
  if (!alumniList || !student) return [];
  
  const { maxFromSameDomain = 2, prioritizeNewMentors = true, limit = 10 } = options;
  
  // Calculate scores for all alumni
  const scoredAlumni = alumniList.map(alum => ({
    ...alum,
    score: calculateMentorScore(alum, student)
  }));
  
  // Sort by score descending
  scoredAlumni.sort((a, b) => (b.score.total || b.score) - (a.score.total || a.score));
  
  // Apply diversity logic - limit mentors from same domain
  const domainLimited = {};
  const finalRecommendations = [];
  
  for (const alum of scoredAlumni) {
    const domain = alum.department || 'Other';
    if (!domainLimited[domain]) {
      domainLimited[domain] = 0;
    }
    
    // Skip if we already have enough mentors from this domain
    if (domainLimited[domain] >= maxFromSameDomain) {
      continue;
    }
    
    domainLimited[domain]++;
    finalRecommendations.push(alum);
    
    // Stop when we reach the limit
    if (finalRecommendations.length >= limit) {
      break;
    }
  }
  
  return finalRecommendations;
};