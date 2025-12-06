// Mock alumni data for the student directory
export const mockAlumniData = [
  {
    id: 'alum_1',
    name: 'Sarah Johnson',
    graduationYear: 2018,
    major: 'Computer Science',
    currentRole: 'Senior Software Engineer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
    profileImage: null,
    isVerified: true,
    yearsOfExperience: 5,
    domain: 'Software Development',
    linkedin: 'https://linkedin.com/in/sarahjohnson',
    email: 'sarah.johnson@gmail.com'
  },
  {
    id: 'alum_2',
    name: 'Michael Chen',
    graduationYear: 2020,
    major: 'Data Science',
    currentRole: 'Data Scientist',
    company: 'Analytics Pro',
    location: 'New York, NY',
    skills: ['Python', 'Machine Learning', 'SQL', 'Tableau', 'R'],
    profileImage: null,
    isVerified: true,
    yearsOfExperience: 3,
    domain: 'Data Science',
    linkedin: 'https://linkedin.com/in/michaelchen',
    email: 'michael.chen@gmail.com'
  },
  {
    id: 'alum_3',
    name: 'Priya Sharma',
    graduationYear: 2019,
    major: 'Business Administration',
    currentRole: 'Product Manager',
    company: 'StartupXYZ',
    location: 'Austin, TX',
    skills: ['Product Management', 'Agile', 'User Research', 'Analytics', 'Strategic Planning'],
    profileImage: null,
    isVerified: true,
    yearsOfExperience: 4,
    domain: 'Product Management',
    linkedin: 'https://linkedin.com/in/priyasharma',
    email: 'priya.sharma@gmail.com'
  },
  {
    id: 'alum_4',
    name: 'David Wilson',
    graduationYear: 2017,
    major: 'Electrical Engineering',
    currentRole: 'Hardware Engineer',
    company: 'ElectroTech Solutions',
    location: 'Boston, MA',
    skills: ['Circuit Design', 'Embedded Systems', 'IoT', 'MATLAB', 'PCB Design'],
    profileImage: null,
    isVerified: true,
    yearsOfExperience: 6,
    domain: 'Hardware Engineering',
    linkedin: 'https://linkedin.com/in/davidwilson',
    email: 'david.wilson@gmail.com'
  },
  {
    id: 'alum_5',
    name: 'Emma Rodriguez',
    graduationYear: 2021,
    major: 'Marketing',
    currentRole: 'Digital Marketing Specialist',
    company: 'BrandBoost Agency',
    location: 'Miami, FL',
    skills: ['SEO', 'Social Media', 'Content Strategy', 'Google Analytics', 'Email Marketing'],
    profileImage: null,
    isVerified: true,
    yearsOfExperience: 2,
    domain: 'Marketing',
    linkedin: 'https://linkedin.com/in/emmarodriguez',
    email: 'emma.rodriguez@gmail.com'
  },
  {
    id: 'alum_6',
    name: 'James Kim',
    graduationYear: 2016,
    major: 'Finance',
    currentRole: 'Financial Analyst',
    company: 'Global Investments',
    location: 'Chicago, IL',
    skills: ['Financial Modeling', 'Excel', 'Risk Analysis', 'Investment Research', 'Portfolio Management'],
    profileImage: null,
    isVerified: true,
    yearsOfExperience: 7,
    domain: 'Finance',
    linkedin: 'https://linkedin.com/in/jameskim',
    email: 'james.kim@gmail.com'
  },
  {
    id: 'alum_7',
    name: 'Lisa Thompson',
    graduationYear: 2022,
    major: 'Graphic Design',
    currentRole: 'UI/UX Designer',
    company: 'Creative Minds',
    location: 'Seattle, WA',
    skills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping', 'Visual Design'],
    profileImage: null,
    isVerified: true,
    yearsOfExperience: 1,
    domain: 'Design',
    linkedin: 'https://linkedin.com/in/lisathompson',
    email: 'lisa.thompson@gmail.com'
  },
  {
    id: 'alum_8',
    name: 'Robert Davis',
    graduationYear: 2015,
    major: 'Mechanical Engineering',
    currentRole: 'Senior Mechanical Engineer',
    company: 'Innovate Engineering',
    location: 'Denver, CO',
    skills: ['CAD', 'SolidWorks', 'Thermodynamics', 'Manufacturing', 'Project Management'],
    profileImage: null,
    isVerified: true,
    yearsOfExperience: 8,
    domain: 'Mechanical Engineering',
    linkedin: 'https://linkedin.com/in/robertdavis',
    email: 'robert.davis@gmail.com'
  }
];

// Helper functions for filtering and searching
export const getUniqueGraduationYears = () => {
  const years = [...new Set(mockAlumniData.map(alum => alum.graduationYear))];
  return years.sort((a, b) => b - a); // Sort in descending order
};

export const getUniqueCompanies = () => {
  const companies = [...new Set(mockAlumniData.map(alum => alum.company))];
  return companies.sort();
};

export const getUniqueDomains = () => {
  const domains = [...new Set(mockAlumniData.map(alum => alum.domain))];
  return domains.sort();
};

// Search and filter function
export const searchAndFilterAlumni = (searchTerm, filters) => {
  let result = [...mockAlumniData];
  
  // Apply search term
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter(alum => 
      alum.name.toLowerCase().includes(term) ||
      alum.major.toLowerCase().includes(term) ||
      alum.currentRole.toLowerCase().includes(term) ||
      alum.company.toLowerCase().includes(term) ||
      alum.domain.toLowerCase().includes(term) ||
      alum.skills.some(skill => skill.toLowerCase().includes(term))
    );
  }
  
  // Apply filters
  if (filters.graduationYear) {
    result = result.filter(alum => alum.graduationYear.toString() === filters.graduationYear);
  }
  
  if (filters.company) {
    result = result.filter(alum => alum.company === filters.company);
  }
  
  if (filters.domain) {
    result = result.filter(alum => alum.domain === filters.domain);
  }
  
  return result;
};

export default mockAlumniData;