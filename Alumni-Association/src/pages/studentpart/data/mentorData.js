/**
 * Sample Alumni/Mentor Data for AI Matching System
 * 
 * This file contains realistic alumni profiles for testing
 * the AI mentor matching algorithm.
 */

export const sampleAlumniData = [
  {
    id: 'alum001',
    name: 'Priya Sharma',
    email: 'priya.sharma@techcorp.com',
    skills: ['React', 'Node.js', 'JavaScript', 'AWS', 'System Design'],
    graduationYear: 2020,
    domain: 'Software',
    company: 'TechCorp Solutions',
    position: 'Senior Software Engineer',
    availability: true,
    timeZone: 'Asia/Kolkata',
    menteeCount: 2,
    bio: 'Full-stack developer with expertise in modern web technologies. Passionate about mentoring students in software development.',
    experience: 4,
    location: 'Bangalore, India',
    linkedIn: 'https://linkedin.com/in/priyasharma',
    specializations: ['Web Development', 'Cloud Architecture', 'Team Leadership'],
    mentorshipAreas: ['Technical Skills', 'Career Guidance', 'Interview Preparation']
  },
  {
    id: 'alum002',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@fintech.com',
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Data Analysis'],
    graduationYear: 2018,
    domain: 'Data Science',
    company: 'FinTech Innovations',
    position: 'Data Science Manager',
    availability: true,
    timeZone: 'Asia/Kolkata',
    menteeCount: 1,
    bio: 'Data scientist with strong background in ML and analytics. Love helping students break into data science.',
    experience: 6,
    location: 'Mumbai, India',
    linkedIn: 'https://linkedin.com/in/rajeshkumar',
    specializations: ['Machine Learning', 'Data Analytics', 'Business Intelligence'],
    mentorshipAreas: ['Technical Skills', 'Industry Insights', 'Project Guidance']
  },
  {
    id: 'alum003',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@globalconsult.com',
    skills: ['Strategy', 'Business Analysis', 'Project Management', 'Excel', 'PowerBI'],
    graduationYear: 2019,
    domain: 'Consulting',
    company: 'Global Consulting Partners',
    position: 'Senior Consultant',
    availability: true,
    timeZone: 'America/New_York',
    menteeCount: 3,
    bio: 'Management consultant specializing in digital transformation. Experienced in guiding career transitions.',
    experience: 5,
    location: 'New York, USA',
    linkedIn: 'https://linkedin.com/in/sarahjohnson',
    specializations: ['Strategy Consulting', 'Digital Transformation', 'Client Management'],
    mentorshipAreas: ['Career Transition', 'Business Skills', 'Leadership Development']
  },
  {
    id: 'alum004',
    name: 'Amit Patel',
    email: 'amit.patel@healthtech.com',
    skills: ['Java', 'Spring Boot', 'Microservices', 'Docker', 'Kubernetes'],
    graduationYear: 2021,
    domain: 'Software',
    company: 'HealthTech Solutions',
    position: 'Backend Developer',
    availability: true,
    timeZone: 'Asia/Kolkata',
    menteeCount: 0,
    bio: 'Backend developer focused on scalable healthcare solutions. New to mentoring but eager to help.',
    experience: 3,
    location: 'Pune, India',
    linkedIn: 'https://linkedin.com/in/amitpatel',
    specializations: ['Backend Development', 'Healthcare Tech', 'Microservices Architecture'],
    mentorshipAreas: ['Technical Skills', 'Industry Knowledge', 'New Grad Guidance']
  },
  {
    id: 'alum005',
    name: 'Lisa Chen',
    email: 'lisa.chen@uxdesign.com',
    skills: ['UI/UX Design', 'Figma', 'User Research', 'Prototyping', 'Design Systems'],
    graduationYear: 2022,
    domain: 'Design',
    company: 'Design Studio Pro',
    position: 'UX Designer',
    availability: false, // Currently unavailable
    timeZone: 'America/Los_Angeles',
    menteeCount: 1,
    bio: 'UX designer passionate about creating user-centered experiences. Currently on sabbatical.',
    experience: 2,
    location: 'San Francisco, USA',
    linkedIn: 'https://linkedin.com/in/lisachen',
    specializations: ['User Experience', 'Design Research', 'Product Design'],
    mentorshipAreas: ['Design Skills', 'Portfolio Review', 'Career Growth']
  },
  {
    id: 'alum006',
    name: 'Mohammed Ali',
    email: 'mohammed.ali@cybersec.com',
    skills: ['Cybersecurity', 'Ethical Hacking', 'Python', 'Network Security', 'Risk Assessment'],
    graduationYear: 2017,
    domain: 'Security',
    company: 'CyberSec Corp',
    position: 'Security Architect',
    availability: true,
    timeZone: 'Europe/London',
    menteeCount: 2,
    bio: 'Cybersecurity expert with extensive experience in threat analysis and security architecture.',
    experience: 7,
    location: 'London, UK',
    linkedIn: 'https://linkedin.com/in/mohammedali',
    specializations: ['Cybersecurity', 'Risk Management', 'Security Architecture'],
    mentorshipAreas: ['Technical Skills', 'Security Best Practices', 'Certification Guidance']
  },
  {
    id: 'alum007',
    name: 'Jennifer Davis',
    email: 'jennifer.davis@marketingpro.com',
    skills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Google Analytics', 'Social Media'],
    graduationYear: 2020,
    domain: 'Marketing',
    company: 'Marketing Pro Agency',
    position: 'Digital Marketing Manager',
    availability: true,
    timeZone: 'America/New_York',
    menteeCount: 4, // Over limit - will get fairness penalty
    bio: 'Digital marketing specialist with expertise in growth strategies and brand building.',
    experience: 4,
    location: 'Boston, USA',
    linkedIn: 'https://linkedin.com/in/jenniferdavis',
    specializations: ['Digital Marketing', 'Growth Hacking', 'Brand Strategy'],
    mentorshipAreas: ['Marketing Strategy', 'Brand Building', 'Digital Skills']
  },
  {
    id: 'alum008',
    name: 'Arun Krishnan',
    email: 'arun.krishnan@aitech.com',
    skills: ['React', 'Python', 'Machine Learning', 'TensorFlow', 'JavaScript'],
    graduationYear: 2019,
    domain: 'Software',
    company: 'AI Tech Solutions',
    position: 'AI Engineer',
    availability: true,
    timeZone: 'Asia/Kolkata',
    menteeCount: 1,
    bio: 'AI engineer combining software development with machine learning. Love teaching AI concepts.',
    experience: 5,
    location: 'Chennai, India',
    linkedIn: 'https://linkedin.com/in/arunkrishnan',
    specializations: ['Artificial Intelligence', 'Full Stack Development', 'ML Engineering'],
    mentorshipAreas: ['AI/ML', 'Software Development', 'Technical Innovation']
  },
  {
    id: 'alum009',
    name: 'David Wilson',
    email: 'david.wilson@finbank.com',
    skills: ['Finance', 'Risk Analysis', 'Excel', 'SQL', 'Financial Modeling'],
    graduationYear: 2016,
    domain: 'Finance',
    company: 'FinBank International',
    position: 'Risk Manager',
    availability: true,
    timeZone: 'America/New_York',
    menteeCount: 2,
    bio: 'Finance professional specializing in risk management and quantitative analysis.',
    experience: 8,
    location: 'New York, USA',
    linkedIn: 'https://linkedin.com/in/davidwilson',
    specializations: ['Risk Management', 'Financial Analysis', 'Quantitative Finance'],
    mentorshipAreas: ['Finance Career', 'Risk Analysis', 'Professional Development']
  },
  {
    id: 'alum010',
    name: 'Neha Gupta',
    email: 'neha.gupta@prodmanager.com',
    skills: ['Product Management', 'Agile', 'User Research', 'SQL', 'A/B Testing'],
    graduationYear: 2021,
    domain: 'Product',
    company: 'Product Innovations Inc',
    position: 'Product Manager',
    availability: true,
    timeZone: 'Asia/Kolkata',
    menteeCount: 1,
    bio: 'Product manager passionate about building user-centric products and mentoring aspiring PMs.',
    experience: 3,
    location: 'Delhi, India',
    linkedIn: 'https://linkedin.com/in/nehagupta',
    specializations: ['Product Strategy', 'User Experience', 'Data-Driven Decisions'],
    mentorshipAreas: ['Product Management', 'Career Transition', 'Strategic Thinking']
  }
];

/**
 * Sample student profiles for testing
 */
export const sampleStudentProfiles = [
  {
    id: 'stud001',
    name: 'Rahul Verma',
    skills: ['React', 'JavaScript', 'SQL'],
    graduationYear: 2024,
    domain: 'Software',
    timeZone: 'Asia/Kolkata',
    interests: ['Web Development', 'Full Stack Development'],
    careerGoals: 'Become a full-stack developer at a tech company'
  },
  {
    id: 'stud002',
    name: 'Emily Chen',
    skills: ['Python', 'Machine Learning', 'Statistics'],
    graduationYear: 2024,
    domain: 'Data Science',
    timeZone: 'America/Los_Angeles',
    interests: ['AI/ML', 'Data Analytics'],
    careerGoals: 'Work as a data scientist in healthcare or finance'
  },
  {
    id: 'stud003',
    name: 'Alex Rodriguez',
    skills: ['Business Analysis', 'Excel', 'Presentation'],
    graduationYear: 2025,
    domain: 'Consulting',
    timeZone: 'America/New_York',
    interests: ['Strategy Consulting', 'Business Strategy'],
    careerGoals: 'Join a top consulting firm as a business analyst'
  }
];

/**
 * Helper function to get alumni by domain
 */
export function getAlumniByDomain(domain) {
  return sampleAlumniData.filter(alumni => 
    alumni.domain.toLowerCase() === domain.toLowerCase()
  );
}

/**
 * Helper function to get available mentors only
 */
export function getAvailableMentors() {
  return sampleAlumniData.filter(alumni => alumni.availability === true);
}

/**
 * Helper function to get mentors with low mentee count (for fairness)
 */
export function getMentorsWithCapacity(maxMentees = 2) {
  return sampleAlumniData.filter(alumni => 
    alumni.availability === true && alumni.menteeCount < maxMentees
  );
}

export default {
  sampleAlumniData,
  sampleStudentProfiles,
  getAlumniByDomain,
  getAvailableMentors,
  getMentorsWithCapacity
};