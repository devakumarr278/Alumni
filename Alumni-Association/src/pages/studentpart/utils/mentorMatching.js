/**
 * AI-Powered Mentor Matching Algorithm
 * 
 * This algorithm scores and ranks alumni mentors based on compatibility
 * with student profiles using multiple criteria and fairness guardrails.
 */

/**
 * Main function to match mentors with students
 * @param {Object} student - Student object with profile information
 * @param {Array} alumniList - Array of alumni mentor objects
 * @returns {Array} Top 3 ranked mentors with scores and explanations
 */
export function matchMentors(student, alumniList) {
  // Filter out unavailable alumni first
  const availableAlumni = alumniList.filter(alumni => alumni.availability === true);
  
  // Score each available alumni
  const scoredMentors = availableAlumni.map(alumni => {
    const score = calculateMentorScore(student, alumni);
    const whyMatched = generateMatchExplanation(student, alumni, score);
    
    return {
      ...alumni,
      score: score.total,
      whyMatched,
      scoreBreakdown: score.breakdown
    };
  });
  
  // Sort by score (highest first) and return top 3
  return scoredMentors
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

/**
 * Calculate compatibility score between student and alumni
 * @param {Object} student - Student profile
 * @param {Object} alumni - Alumni profile
 * @returns {Object} Score object with total and breakdown
 */
export function calculateMentorScore(student, alumni) {
  const breakdown = {
    skillMatch: 0,
    domainMatch: 0,
    graduationYear: 0,
    timeZone: 0,
    fairnessAdjustment: 0
  };
  
  // +10 points for each matching skill
  const studentSkills = (student.skills || []).map(skill => skill.toLowerCase());
  const alumniSkills = (alumni.skills || []).map(skill => skill.toLowerCase());
  const matchingSkills = studentSkills.filter(skill => 
    alumniSkills.some(alumniSkill => alumniSkill.includes(skill) || skill.includes(alumniSkill))
  );
  breakdown.skillMatch = matchingSkills.length * 10;
  
  // +5 points if domain matches
  if (student.domain && alumni.domain && 
      student.domain.toLowerCase() === alumni.domain.toLowerCase()) {
    breakdown.domainMatch = 5;
  }
  
  // +3 points if graduation year difference <= 5
  if (student.graduationYear && alumni.graduationYear) {
    const yearDiff = Math.abs(student.graduationYear - alumni.graduationYear);
    if (yearDiff <= 5) {
      breakdown.graduationYear = 3;
    }
  }
  
  // +2 points if same time zone
  if (student.timeZone && alumni.timeZone && 
      student.timeZone === alumni.timeZone) {
    breakdown.timeZone = 2;
  }
  
  // -5 points if alumni already has 3 or more mentees (fairness guardrail)
  if (alumni.menteeCount >= 3) {
    breakdown.fairnessAdjustment = -5;
  }
  
  const total = Object.values(breakdown).reduce((sum, score) => sum + score, 0);
  
  return {
    total: Math.max(0, total), // Ensure score is never negative
    breakdown
  };
}

/**
 * Generate human-readable explanation for why this mentor was matched
 * @param {Object} student - Student profile
 * @param {Object} alumni - Alumni profile
 * @param {Object} score - Score object with breakdown
 * @returns {String} Explanation text
 */
function generateMatchExplanation(student, alumni, score) {
  const reasons = [];
  
  // Skill matches
  if (score.breakdown.skillMatch > 0) {
    const studentSkills = (student.skills || []).map(skill => skill.toLowerCase());
    const alumniSkills = (alumni.skills || []).map(skill => skill.toLowerCase());
    const matchingSkills = studentSkills.filter(skill => 
      alumniSkills.some(alumniSkill => alumniSkill.includes(skill) || skill.includes(alumniSkill))
    );
    
    if (matchingSkills.length === 1) {
      reasons.push(`Matched on ${matchingSkills[0]}`);
    } else if (matchingSkills.length > 1) {
      const skillList = matchingSkills.slice(0, 2).join(', ');
      const remaining = matchingSkills.length - 2;
      if (remaining > 0) {
        reasons.push(`Matched on ${skillList} and ${remaining} other skill${remaining > 1 ? 's' : ''}`);
      } else {
        reasons.push(`Matched on ${skillList}`);
      }
    }
  }
  
  // Domain match
  if (score.breakdown.domainMatch > 0) {
    reasons.push(`Same domain (${alumni.domain})`);
  }
  
  // Graduation year proximity - REMOVED as per user request
  // if (score.breakdown.graduationYear > 0) {
  //   const yearDiff = Math.abs(student.graduationYear - alumni.graduationYear);
  //   reasons.push(`Within ${yearDiff} year${yearDiff !== 1 ? 's' : ''} of graduation`);
  // }
  
  // Time zone match - REMOVED as per user request
  // if (score.breakdown.timeZone > 0) {
  //   reasons.push(`Same time zone`);
  // }
  
  // Fairness adjustment warning
  if (score.breakdown.fairnessAdjustment < 0) {
    reasons.push(`(Note: This mentor has many mentees already)`);
  }
  
  return reasons.length > 0 ? reasons.join(', ') : 'General compatibility';
}

/**
 * Additional utility functions for mentor matching
 */

/**
 * Get mentor recommendations with diversity boost
 * @param {Object} student - Student profile
 * @param {Array} alumniList - Array of alumni
 * @param {Object} options - Additional options
 * @returns {Array} Diversified mentor recommendations
 */
export function getRecommendationsWithDiversity(student, alumniList, options = {}) {
  const { maxFromSameDomain = 2, prioritizeNewMentors = true } = options;
  
  const allMatches = matchMentors(student, alumniList);
  const diversified = [];
  const domainCount = {};
  
  for (const mentor of allMatches) {
    const domain = mentor.domain || 'Other';
    
    // Apply diversity rules
    if (domainCount[domain] < maxFromSameDomain) {
      diversified.push(mentor);
      domainCount[domain] = (domainCount[domain] || 0) + 1;
    }
    
    if (diversified.length >= 3) break;
  }
  
  // If we don't have enough diverse matches, fill with best remaining
  if (diversified.length < 3) {
    const remaining = allMatches.filter(m => !diversified.includes(m));
    diversified.push(...remaining.slice(0, 3 - diversified.length));
  }
  
  return diversified;
}

/**
 * Calculate compatibility matrix for analytics
 * @param {Array} students - Array of student profiles
 * @param {Array} alumni - Array of alumni profiles
 * @returns {Object} Compatibility analytics
 */
export function calculateCompatibilityMatrix(students, alumni) {
  const matrix = {};
  const stats = {
    totalMatches: 0,
    averageScore: 0,
    skillMatchRate: 0,
    domainMatchRate: 0
  };
  
  students.forEach(student => {
    matrix[student.id] = matchMentors(student, alumni);
    stats.totalMatches += matrix[student.id].length;
  });
  
  return { matrix, stats };
}

export default {
  matchMentors,
  getRecommendationsWithDiversity,
  calculateCompatibilityMatrix,
  calculateMentorScore
};