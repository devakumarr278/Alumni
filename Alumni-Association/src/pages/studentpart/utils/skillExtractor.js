/**
 * Skill Extraction Utility
 * 
 * Automatically extracts skills from student profile text using keyword-based matching.
 * Used for tagging, recommendations, and matching functionality.
 */

// Predefined list of skills for extraction
const SKILLS = [
  "React", "Node.js", "Python", "SQL", "JavaScript", "Java", "C++", 
  "CSS", "HTML", "Django", "Flutter", "Angular", "Vue.js", "TypeScript",
  "MongoDB", "PostgreSQL", "MySQL", "AWS", "Azure", "Docker", "Kubernetes",
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Pandas",
  "Express.js", "Spring Boot", "C#", ".NET", "PHP", "Ruby", "Go", "Rust",
  "Swift", "Kotlin", "React Native", "Xamarin", "Flutter", "iOS Development",
  "Android Development", "UI/UX Design", "Figma", "Adobe XD", "Sketch",
  "Project Management", "Agile", "Scrum", "DevOps", "CI/CD", "Git",
  "Jenkins", "Terraform", "Ansible", "Chef", "Puppet", "Linux", "Bash",
  "PowerShell", "Networking", "Cybersecurity", "Blockchain", "IoT",
  "Data Analysis", "Business Intelligence", "Tableau", "Power BI",
  "Excel", "R", "MATLAB", "SPSS", "SAS", "Hadoop", "Spark", "Kafka"
];

/**
 * Escapes special regex characters in a string
 * @param {string} string - The string to escape
 * @returns {string} - The escaped string
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Extracts skills from a student's profile text
 * @param {string} profileText - The text to extract skills from
 * @returns {string[]} Array of extracted skills (no duplicates)
 */
export function extractSkills(profileText) {
  // Input validation
  if (!profileText || typeof profileText !== 'string') {
    return [];
  }

  // Normalize the text - convert to lowercase for case-insensitive matching
  const normalizedText = profileText.toLowerCase().trim();
  
  // Set to store unique skills
  const extractedSkills = new Set();

  // Check each skill in our predefined list
  SKILLS.forEach(skill => {
    // Create a regex pattern to match the skill as a whole word
    // This prevents partial matches (e.g., "Script" matching "JavaScript")
    const skillPattern = new RegExp(`\\b${escapeRegExp(skill.toLowerCase())}\\b`, 'i');
    
    // Test if the skill is found in the text
    if (skillPattern.test(normalizedText)) {
      extractedSkills.add(skill); // Add original case version
    }
  });

  // Convert Set to Array and return sorted for consistency
  return Array.from(extractedSkills).sort();
}

// Export the skills list for potential use in other components
export { SKILLS };

/**
 * Extract skills from multiple text sources (bio, experience, projects, etc.)
 * @param {Object} profileData - Object containing multiple text fields
 * @returns {string[]} - Array of extracted skills from all sources
 */
export function extractSkillsFromProfile(profileData) {
  if (!profileData || typeof profileData !== 'object') {
    return [];
  }
  
  const textSources = [
    profileData.bio,
    profileData.experience,
    profileData.projects,
    profileData.description,
    profileData.summary,
    profileData.careerGoals,
    profileData.interests ? profileData.interests.join(' ') : ''
  ].filter(text => text && typeof text === 'string');
  
  // Combine all text sources
  const combinedText = textSources.join(' ');
  
  return extractSkills(combinedText);
}

/**
 * Smart skill extraction with confidence scoring
 * @param {string} profileText - The profile text to analyze
 * @returns {Object[]} - Array of skill objects with confidence scores
 */
export function extractSkillsWithConfidence(profileText) {
  if (!profileText || typeof profileText !== 'string') {
    return [];
  }
  
  const normalizedText = profileText.toLowerCase();
  const skillsWithConfidence = [];
  
  SKILLS.forEach(skill => {
    const normalizedSkill = skill.toLowerCase();
    let confidence = 0;
    
    // Exact match with word boundaries (high confidence)
    if (new RegExp(`\\b${escapeRegExp(normalizedSkill)}\\b`, 'gi').test(normalizedText)) {
      confidence += 0.8;
    }
    
    // Match with experience/skills context (medium-high confidence)
    if (new RegExp(`(experience|skilled|proficient|familiar|knowledge|expertise).{0,20}\\b${escapeRegExp(normalizedSkill)}\\b`, 'gi').test(normalizedText)) {
      confidence += 0.6;
    }
    
    // Match in lists (comma-separated) (medium confidence)
    if (new RegExp(`[,;]\\s*${escapeRegExp(normalizedSkill)}\\s*[,;]`, 'gi').test(normalizedText)) {
      confidence += 0.5;
    }
    
    // Multiple mentions increase confidence
    const matches = normalizedText.match(new RegExp(`\\b${escapeRegExp(normalizedSkill)}\\b`, 'gi'));
    if (matches && matches.length > 1) {
      confidence += 0.2 * (matches.length - 1);
    }
    
    // Cap confidence at 1.0
    confidence = Math.min(confidence, 1.0);
    
    if (confidence > 0.3) { // Threshold for inclusion
      skillsWithConfidence.push({
        skill,
        confidence: Math.round(confidence * 100) / 100 // Round to 2 decimal places
      });
    }
  });
  
  // Sort by confidence (highest first)
  return skillsWithConfidence.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Suggest skills based on partial matches or related terms
 * @param {string} profileText - The profile text to analyze
 * @param {number} maxSuggestions - Maximum number of suggestions to return
 * @returns {string[]} - Array of suggested skills
 */
export function suggestSkills(profileText, maxSuggestions = 5) {
  if (!profileText || typeof profileText !== 'string') {
    return [];
  }
  
  const normalizedText = profileText.toLowerCase();
  const suggestions = new Set();
  
  // Define skill relationships/synonyms
  const skillRelations = {
    'frontend': ['React', 'Angular', 'Vue.js', 'HTML', 'CSS', 'JavaScript'],
    'backend': ['Node.js', 'Python', 'Java', 'Django', 'Express.js'],
    'fullstack': ['React', 'Node.js', 'JavaScript', 'MongoDB', 'Express.js'],
    'web development': ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
    'mobile': ['React Native', 'Flutter', 'iOS Development', 'Android Development'],
    'data science': ['Python', 'Machine Learning', 'Pandas', 'TensorFlow'],
    'ai': ['Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch'],
    'cloud': ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes'],
    'database': ['SQL', 'MySQL', 'PostgreSQL', 'MongoDB'],
    'devops': ['Docker', 'Kubernetes', 'CI/CD', 'Git', 'Jenkins']
  };
  
  // Check for related terms and suggest relevant skills
  Object.entries(skillRelations).forEach(([term, relatedSkills]) => {
    if (normalizedText.includes(term)) {
      relatedSkills.forEach(skill => suggestions.add(skill));
    }
  });
  
  // Remove already extracted skills
  const extractedSkills = extractSkills(profileText);
  const filteredSuggestions = Array.from(suggestions).filter(
    skill => !extractedSkills.includes(skill)
  );
  
  return filteredSuggestions.slice(0, maxSuggestions);
}

/**
 * Validate and clean extracted skills
 * @param {string[]} skills - Array of skills to validate
 * @returns {string[]} - Array of validated and cleaned skills
 */
export function validateSkills(skills) {
  if (!Array.isArray(skills)) {
    return [];
  }
  
  return skills
    .filter(skill => typeof skill === 'string' && skill.trim().length > 0)
    .map(skill => skill.trim())
    .filter(skill => SKILLS.includes(skill)) // Only include predefined skills
    .filter((skill, index, array) => array.indexOf(skill) === index); // Remove duplicates
}

export default {
  SKILLS,
  extractSkills,
  extractSkillsFromProfile,
  extractSkillsWithConfidence,
  suggestSkills,
  validateSkills
};