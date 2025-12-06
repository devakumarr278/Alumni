// Skill-based matching utility for jobs and events

/**
 * Calculate skill match percentage between student skills and required/preferred skills
 * @param {string[]} studentSkills - Array of student's skills
 * @param {string[]} requiredSkills - Array of required skills for job/event
 * @param {string[]} preferredSkills - Array of preferred skills (optional)
 * @returns {object} Match details with percentage and breakdown
 */
export function calculateSkillMatch(studentSkills = [], requiredSkills = [], preferredSkills = []) {
  if (!studentSkills.length) {
    return {
      matchPercentage: 0,
      matchedRequired: [],
      matchedPreferred: [],
      missingRequired: requiredSkills,
      missingPreferred: preferredSkills,
      isQualified: false
    };
  }

  // Normalize skills for case-insensitive comparison
  const normalizeSkills = (skills) => skills.map(skill => skill.toLowerCase().trim());
  
  const normalizedStudentSkills = normalizeSkills(studentSkills);
  const normalizedRequired = normalizeSkills(requiredSkills);
  const normalizedPreferred = normalizeSkills(preferredSkills);

  // Find matches
  const matchedRequired = requiredSkills.filter(skill => 
    normalizedStudentSkills.includes(skill.toLowerCase().trim())
  );
  
  const matchedPreferred = preferredSkills.filter(skill => 
    normalizedStudentSkills.includes(skill.toLowerCase().trim())
  );

  // Find missing skills
  const missingRequired = requiredSkills.filter(skill => 
    !normalizedStudentSkills.includes(skill.toLowerCase().trim())
  );
  
  const missingPreferred = preferredSkills.filter(skill => 
    !normalizedStudentSkills.includes(skill.toLowerCase().trim())
  );

  // Calculate match percentage
  const totalSkills = requiredSkills.length + preferredSkills.length;
  const totalMatched = matchedRequired.length + matchedPreferred.length;
  
  let matchPercentage = 0;
  if (totalSkills > 0) {
    // Weight required skills more heavily (70%) than preferred skills (30%)
    const requiredWeight = 0.7;
    const preferredWeight = 0.3;
    
    const requiredScore = requiredSkills.length > 0 ? 
      (matchedRequired.length / requiredSkills.length) * requiredWeight : requiredWeight;
    
    const preferredScore = preferredSkills.length > 0 ? 
      (matchedPreferred.length / preferredSkills.length) * preferredWeight : preferredWeight;
    
    matchPercentage = Math.round((requiredScore + preferredScore) * 100);
  }

  // Determine if qualified (has at least 50% of required skills)
  const isQualified = requiredSkills.length === 0 || 
    (matchedRequired.length / requiredSkills.length) >= 0.5;

  return {
    matchPercentage,
    matchedRequired,
    matchedPreferred,
    missingRequired,
    missingPreferred,
    isQualified,
    totalMatched,
    totalSkills
  };
}

/**
 * Sort jobs/events by skill match relevance
 * @param {array} items - Array of jobs or events
 * @param {string[]} studentSkills - Student's skills
 * @returns {array} Sorted array with match scores
 */
export function sortBySkillMatch(items, studentSkills) {
  return items
    .map(item => {
      const match = calculateSkillMatch(
        studentSkills,
        item.requiredSkills || [],
        item.preferredSkills || []
      );
      return {
        ...item,
        skillMatch: match
      };
    })
    .sort((a, b) => {
      // Sort by match percentage (descending), then by qualification status
      if (a.skillMatch.matchPercentage !== b.skillMatch.matchPercentage) {
        return b.skillMatch.matchPercentage - a.skillMatch.matchPercentage;
      }
      return b.skillMatch.isQualified - a.skillMatch.isQualified;
    });
}

/**
 * Filter items by minimum match threshold
 * @param {array} items - Array of jobs or events with skill matches
 * @param {number} minThreshold - Minimum match percentage (0-100)
 * @returns {array} Filtered array
 */
export function filterByMatchThreshold(items, minThreshold = 25) {
  return items.filter(item => 
    item.skillMatch && item.skillMatch.matchPercentage >= minThreshold
  );
}

/**
 * Get match level description
 * @param {number} matchPercentage - Match percentage
 * @returns {object} Match level info
 */
export function getMatchLevel(matchPercentage) {
  if (matchPercentage >= 90) {
    return { level: 'Excellent', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' };
  } else if (matchPercentage >= 75) {
    return { level: 'Great', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-800' };
  } else if (matchPercentage >= 50) {
    return { level: 'Good', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
  } else if (matchPercentage >= 25) {
    return { level: 'Fair', color: 'orange', bgColor: 'bg-orange-100', textColor: 'text-orange-800' };
  } else {
    return { level: 'Low', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800' };
  }
}