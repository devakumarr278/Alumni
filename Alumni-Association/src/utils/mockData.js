// Mock data file to resolve webpack module resolution issue
const getMockAlumniData = () => {
  return {
    success: true,
    data: {
      alumni: [
        {
          id: 'mock_1',
          firstName: 'John',
          lastName: 'Doe',
          name: 'John Doe',
          graduationYear: '2020',
          department: 'Computer Science',
          currentPosition: 'Software Engineer',
          company: 'Tech Corp',
          location: 'San Francisco, CA',
          skills: ['JavaScript', 'React', 'Node.js'],
          profilePicture: null,
          isVerified: true,
          yearsOfExperience: 3,
          isMock: true
        },
        {
          id: 'mock_2',
          firstName: 'Jane',
          lastName: 'Smith',
          name: 'Jane Smith',
          graduationYear: '2019',
          department: 'Business Administration',
          currentPosition: 'Product Manager',
          company: 'Innovate Inc',
          location: 'New York, NY',
          skills: ['Product Management', 'Strategy', 'Leadership'],
          profilePicture: null,
          isVerified: true,
          yearsOfExperience: 4,
          isMock: true
        },
        {
          id: 'mock_3',
          firstName: 'Robert',
          lastName: 'Johnson',
          name: 'Robert Johnson',
          graduationYear: '2018',
          department: 'Electrical Engineering',
          currentPosition: 'Senior Engineer',
          company: 'PowerGrid Solutions',
          location: 'Austin, TX',
          skills: ['Electrical Design', 'Project Management', 'CAD'],
          profilePicture: null,
          isVerified: true,
          yearsOfExperience: 5,
          isMock: true
        }
      ]
    }
  };
};

export { getMockAlumniData };