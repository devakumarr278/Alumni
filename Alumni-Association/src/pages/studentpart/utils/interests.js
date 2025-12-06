/**
 * Common Interests Utility
 * 
 * Provides a predefined list of common interests for students to choose from.
 * Used for tagging, recommendations, and matching functionality.
 */

// Predefined list of common interests
export const COMMON_INTERESTS = [
  "Artificial Intelligence",
  "Machine Learning",
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Cybersecurity",
  "Cloud Computing",
  "DevOps",
  "UI/UX Design",
  "Game Development",
  "Blockchain",
  "Internet of Things (IoT)",
  "Robotics",
  "Augmented Reality",
  "Virtual Reality",
  "Open Source",
  "Startups",
  "Entrepreneurship",
  "Investment",
  "Stock Trading",
  "Digital Marketing",
  "Content Creation",
  "Photography",
  "Videography",
  "Music",
  "Dance",
  "Sports",
  "Travel",
  "Cooking",
  "Reading",
  "Writing",
  "Public Speaking",
  "Volunteering",
  "Mentoring",
  "Languages",
  "History",
  "Philosophy",
  "Psychology",
  "Sustainability",
  "Environmental Science",
  "Biotechnology",
  "Nanotechnology",
  "Space Exploration",
  "Astronomy",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
  "Political Science",
  "Sociology",
  "Anthropology",
  "Literature",
  "Theater",
  "Film",
  "Fashion",
  "Architecture",
  "Design Thinking",
  "Innovation",
  "Research",
  "Academics",
  "Career Development",
  "Leadership",
  "Teamwork",
  "Problem Solving",
  "Critical Thinking",
  "Communication",
  "Negotiation",
  "Time Management",
  "Project Management",
  "Networking",
  "Personal Development",
  "Health & Wellness",
  "Fitness",
  "Meditation",
  "Yoga",
  "Gaming",
  "Esports",
  "Anime",
  "Podcasting",
  "Blogging",
  "Social Media",
  "E-commerce",
  "Cryptocurrency",
  "NFTs",
  "Metaverse",
  "3D Printing",
  "Drones",
  "Electric Vehicles",
  "Renewable Energy",
  "Smart Cities"
];

/**
 * Get a filtered list of interests based on a search term
 * @param {string} searchTerm - The term to search for
 * @param {number} limit - Maximum number of results to return
 * @returns {string[]} - Array of matching interests
 */
export function searchInterests(searchTerm, limit = 10) {
  if (!searchTerm || typeof searchTerm !== 'string') {
    return COMMON_INTERESTS.slice(0, limit);
  }
  
  const normalizedSearch = searchTerm.toLowerCase().trim();
  
  return COMMON_INTERESTS.filter(interest => 
    interest.toLowerCase().includes(normalizedSearch)
  ).slice(0, limit);
}

/**
 * Get random interests for suggestions
 * @param {number} count - Number of interests to return
 * @returns {string[]} - Array of random interests
 */
export function getRandomInterests(count = 5) {
  const shuffled = [...COMMON_INTERESTS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default {
  COMMON_INTERESTS,
  searchInterests,
  getRandomInterests
};