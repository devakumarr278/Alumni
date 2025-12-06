// College and Department data for registration

export const colleges = [
  {
    id: 'skcet',
    name: 'Sri Krishna College of Engineering and Technology',
    domain: 'skcet.ac.in',
    type: 'Engineering College',
    departments: [
      'Computer Science and Engineering',
      'Information Technology',
      'Electronics and Communication Engineering',
      'Electrical and Electronics Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Automobile Engineering',
      'Biotechnology',
      'Chemical Engineering'
    ]
  },
  {
    id: 'anna_university',
    name: 'Anna University',
    domain: 'annauniv.edu',
    type: 'University',
    departments: [
      'Computer Science and Engineering',
      'Information Technology',
      'Electronics and Communication Engineering',
      'Electrical and Electronics Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Chemical Engineering',
      'Aerospace Engineering',
      'Biomedical Engineering',
      'Marine Engineering'
    ]
  },
  {
    id: 'iit_madras',
    name: 'Indian Institute of Technology Madras',
    domain: 'iitm.ac.in',
    type: 'Institute of Technology',
    departments: [
      'Computer Science and Engineering',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Chemical Engineering',
      'Civil Engineering',
      'Aerospace Engineering',
      'Biotechnology',
      'Engineering Design',
      'Materials Science and Engineering',
      'Ocean Engineering'
    ]
  },
  {
    id: 'psg_tech',
    name: 'PSG College of Technology',
    domain: 'psgtech.edu',
    type: 'Engineering College',
    departments: [
      'Computer Science and Engineering',
      'Information Technology',
      'Electronics and Communication Engineering',
      'Electrical and Electronics Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Chemical Engineering',
      'Textile Technology',
      'Fashion Technology'
    ]
  }
];

// Valid institutional email domains
export const validDomains = [
  '.edu',
  '.ac.in',
  '.university.edu',
  '.edu.in',
  '.iisc.ac.in',
  '.iit.ac.in',
  '.nit.ac.in'
];

// Years for passed out (graduation years)
export const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  
  // From 2000 to current year + 4 (for future graduates)
  for (let year = 2000; year <= currentYear + 4; year++) {
    years.push(year);
  }
  
  return years.reverse(); // Most recent first
};

// Common departments (for colleges not in the main list)
export const commonDepartments = [
  'Computer Science and Engineering',
  'Information Technology',
  'Electronics and Communication Engineering',
  'Electrical and Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Biotechnology',
  'Automobile Engineering',
  'Aerospace Engineering',
  'Biomedical Engineering',
  'Industrial Engineering',
  'Instrumentation Engineering',
  'Marine Engineering',
  'Mining Engineering',
  'Petroleum Engineering',
  'Textile Engineering',
  'Food Technology',
  'Agricultural Engineering',
  'Architecture',
  'Planning',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Business Administration',
  'Management Studies',
  'Commerce',
  'Economics',
  'English Literature',
  'Tamil Literature',
  'History',
  'Geography',
  'Political Science',
  'Psychology',
  'Sociology'
];

export default { colleges, validDomains, generateYears, commonDepartments };