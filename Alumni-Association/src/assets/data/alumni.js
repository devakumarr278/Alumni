const alumniData = [
  {
    id: 1,
    name: "Sarah Johnson",
    batch: "Class of 2015",
    profession: "Software Engineer",
    bio: "Specializing in machine learning and AI development. Passionate about mentoring new graduates in tech careers.",
    image: "/assets/images/alumni/sarah.jpg",
    college: "IIT Madras",
    department: "Computer Science",
    degree: "B.Tech",
    degreeLevel: "UG",
    state: "TamilNadu",
    district: "Chennai",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" },
      { platform: "twitter", url: "https://twitter.com" },
      { platform: "github", url: "https://github.com" }
    ]
  },
  {
    id: 2,
    name: "Michael Chen",
    batch: "Class of 2012",
    profession: "Business Analyst",
    bio: "Leading global marketing campaigns with a focus on digital transformation and brand strategy.",
    image: "/assets/images/alumni/michael.jpg",
    college: "Anna University",
    department: "CSE",
    degree: "M.Tech",
    degreeLevel: "PG",
    state: "TamilNadu",
    district: "Chennai",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" },
      { platform: "twitter", url: "https://twitter.com" }
    ]
  },
  {
    id: 3,
    name: "David Rodriguez",
    batch: "Class of 2018",
    profession: "Research Scientist",
    bio: "Focusing on cardiovascular diseases and innovative treatment methods. Published over 20 research papers.",
    image: "/assets/images/alumni/david.jpg",
    college: "IISc Bangalore",
    department: "Physics",
    degree: "PhD Science",
    degreeLevel: "PhD",
    state: "Karnataka",
    district: "Bangalore",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" },
      { platform: "researchgate", url: "https://researchgate.net" }
    ]
  },
  {
    id: 4,
    name: "Emily Wilson",
    batch: "Class of 2010",
    profession: "Consultant",
    bio: "Entrepreneur building sustainable technology solutions for urban environments. Featured in Forbes 30 Under 30.",
    image: "/assets/images/alumni/emily.jpg",
    college: "Punjab Engineering College",
    department: "ECE",
    degree: "M.Tech",
    degreeLevel: "PG",
    state: "Punjab",
    district: "Ludhiana",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" },
      { platform: "twitter", url: "https://twitter.com" }
    ]
  },
  {
    id: 5,
    name: "James Thompson",
    batch: "Class of 2005",
    profession: "Civil Engineer",
    bio: "Designing sustainable urban spaces with a focus on community-driven architecture. Award-winning projects in 3 continents.",
    image: "/assets/images/alumni/james.jpg",
    college: "RV College",
    department: "Civil Engineering",
    degree: "B.E",
    degreeLevel: "UG",
    state: "Karnataka",
    district: "Bangalore",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" },
      { platform: "behance", url: "https://behance.net" }
    ]
  },
  {
    id: 6,
    name: "Priya Patel",
    batch: "Class of 2017",
    profession: "Investment Banker at Goldman Sachs",
    bio: "Specializing in technology IPOs and mergers. Passionate about financial literacy education for students.",
    image: "/assets/images/alumni/priya.jpg",
    college: "IIT Madras",
    department: "Computer Science",
    degree: "B.Tech",
    degreeLevel: "UG",
    state: "TamilNadu",
    district: "Chennai",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" }
    ]
  },
  {
    id: 7,
    name: "Rajesh Kumar",
    batch: "Class of 2020",
    profession: "Data Scientist",
    bio: "AI/ML specialist working on healthcare analytics. Published researcher in medical AI applications.",
    image: "/assets/images/alumni/rajesh.jpg",
    college: "Anna University",
    department: "ECE",
    degree: "M.Tech",
    degreeLevel: "PG",
    state: "TamilNadu",
    district: "Chennai",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" },
      { platform: "github", url: "https://github.com" }
    ]
  },
  {
    id: 8,
    name: "Anitha Reddy",
    batch: "Class of 2019",
    profession: "Software Engineer",
    bio: "Full-stack developer specializing in React and Node.js. Contributing to open-source projects.",
    image: "/assets/images/alumni/anitha.jpg",
    college: "SKCET",
    department: "CSE",
    degree: "B.E",
    degreeLevel: "UG",
    state: "TamilNadu",
    district: "Coimbatore",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" },
      { platform: "github", url: "https://github.com" }
    ]
  },
  {
    id: 9,
    name: "Vikram Singh",
    batch: "Class of 2016",
    profession: "Project Manager",
    bio: "Leading cross-functional teams in fintech product development. Agile and Scrum certified.",
    image: "/assets/images/alumni/vikram.jpg",
    college: "PSG Tech",
    department: "EEE",
    degree: "M.E",
    degreeLevel: "PG",
    state: "TamilNadu",
    district: "Coimbatore",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" }
    ]
  },
  {
    id: 10,
    name: "Kavya Nair",
    batch: "Class of 2021",
    profession: "Data Analyst",
    bio: "Business intelligence specialist with expertise in SQL, Python, and Tableau. Healthcare analytics focus.",
    image: "/assets/images/alumni/kavya.jpg",
    college: "IIT Madras",
    department: "AI & ML",
    degree: "B.Tech",
    degreeLevel: "UG",
    state: "TamilNadu",
    district: "Chennai",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" }
    ]
  },
  {
    id: 11,
    name: "Arjun Sharma",
    batch: "Class of 2018",
    profession: "Civil Engineer",
    bio: "Infrastructure development specialist. Working on smart city projects and sustainable construction.",
    image: "/assets/images/alumni/arjun.jpg",
    college: "Punjab Engineering College",
    department: "Civil Engineering",
    degree: "B.Tech",
    degreeLevel: "UG",
    state: "Punjab",
    district: "Ludhiana",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" }
    ]
  },
  {
    id: 12,
    name: "Sneha Gupta",
    batch: "Class of 2022",
    profession: "Research Scientist",
    bio: "Quantum computing researcher with focus on cryptography applications. PhD candidate.",
    image: "/assets/images/alumni/sneha.jpg",
    college: "IISc Bangalore",
    department: "Physics",
    degree: "M.Sc",
    degreeLevel: "PG",
    state: "Karnataka",
    district: "Bangalore",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" },
      { platform: "researchgate", url: "https://researchgate.net" }
    ]
  },
  {
    id: 13,
    name: "Rohit Mehta",
    batch: "Class of 2015",
    profession: "Mechanical Engineer",
    bio: "Automotive design engineer working on electric vehicle technologies. Patents in battery systems.",
    image: "/assets/images/alumni/rohit.jpg",
    college: "PSG Tech",
    department: "Mechanical Engineering",
    degree: "B.E",
    degreeLevel: "UG",
    state: "TamilNadu",
    district: "Coimbatore",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" }
    ]
  },
  {
    id: 14,
    name: "Deepika Iyer",
    batch: "Class of 2020",
    profession: "Business Analyst",
    bio: "Supply chain optimization specialist. Working with Fortune 500 companies on operational efficiency.",
    image: "/assets/images/alumni/deepika.jpg",
    college: "Anna University",
    department: "Mechanical",
    degree: "M.Tech",
    degreeLevel: "PG",
    state: "TamilNadu",
    district: "Chennai",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" }
    ]
  },
  {
    id: 15,
    name: "Amit Joshi",
    batch: "Class of 2017",
    profession: "Electrical Engineer",
    bio: "Power systems engineer specializing in renewable energy integration. Smart grid technology expert.",
    image: "/assets/images/alumni/amit.jpg",
    college: "SKCET",
    department: "EEE",
    degree: "B.E",
    degreeLevel: "UG",
    state: "TamilNadu",
    district: "Coimbatore",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" }
    ]
  },
  {
    id: 16,
    name: "Neha Agarwal",
    batch: "Class of 2019",
    profession: "Professor",
    bio: "Assistant Professor in Computer Science. Research focus on distributed systems and cloud computing.",
    image: "/assets/images/alumni/neha.jpg",
    college: "IISc Bangalore",
    department: "Computer Science",
    degree: "PhD Engineering",
    degreeLevel: "PhD",
    state: "Karnataka",
    district: "Bangalore",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" },
      { platform: "researchgate", url: "https://researchgate.net" }
    ]
  },
  {
    id: 17,
    name: "Karthik Venkat",
    batch: "Class of 2021",
    profession: "Software Engineer",
    bio: "Mobile app developer specializing in Flutter and React Native. Published apps with 1M+ downloads.",
    image: "/assets/images/alumni/karthik.jpg",
    college: "RV College",
    department: "CSE",
    degree: "B.E",
    degreeLevel: "UG",
    state: "Karnataka",
    district: "Bangalore",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" },
      { platform: "github", url: "https://github.com" }
    ]
  },
  {
    id: 18,
    name: "Pooja Krishnan",
    batch: "Class of 2016",
    profession: "Data Scientist",
    bio: "Machine learning engineer in autonomous vehicles. Computer vision and sensor fusion specialist.",
    image: "/assets/images/alumni/pooja.jpg",
    college: "IIT Madras",
    department: "ECE",
    degree: "M.Tech",
    degreeLevel: "PG",
    state: "TamilNadu",
    district: "Chennai",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" },
      { platform: "github", url: "https://github.com" }
    ]
  },
  {
    id: 19,
    name: "Sanjay Rao",
    batch: "Class of 2018",
    profession: "Consultant",
    bio: "Management consultant specializing in digital transformation for manufacturing industries.",
    image: "/assets/images/alumni/sanjay.jpg",
    college: "Punjab Engineering College",
    department: "Mechanical",
    degree: "M.Tech",
    degreeLevel: "PG",
    state: "Punjab",
    district: "Ludhiana",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" }
    ]
  },
  {
    id: 20,
    name: "Lakshmi Pillai",
    batch: "Class of 2022",
    profession: "Research Scientist",
    bio: "Biotechnology researcher working on gene therapy applications. Multiple publications in Nature.",
    image: "/assets/images/alumni/lakshmi.jpg",
    college: "IISc Bangalore",
    department: "Chemistry",
    degree: "PhD Science",
    degreeLevel: "PhD",
    state: "Karnataka",
    district: "Bangalore",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" },
      { platform: "researchgate", url: "https://researchgate.net" }
    ]
  },
  {
    id: 21,
    name: "Rahul Aggarwal",
    batch: "Class of 2020",
    profession: "Project Manager",
    bio: "Infrastructure project manager overseeing highway and bridge construction projects.",
    image: "/assets/images/alumni/rahul.jpg",
    college: "SKCET",
    department: "Civil Engineering",
    degree: "B.E",
    degreeLevel: "UG",
    state: "TamilNadu",
    district: "Coimbatore",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" }
    ]
  },
  {
    id: 22,
    name: "Divya Raman",
    batch: "Class of 2017",
    profession: "Data Analyst",
    bio: "Financial data analyst specializing in risk assessment and algorithmic trading strategies.",
    image: "/assets/images/alumni/divya.jpg",
    college: "Anna University",
    department: "CSE",
    degree: "B.Tech",
    degreeLevel: "UG",
    state: "TamilNadu",
    district: "Chennai",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" }
    ]
  },
  {
    id: 23,
    name: "Arun Kumar",
    batch: "Class of 2019",
    profession: "Electrical Engineer",
    bio: "Power electronics engineer designing efficient motor drives for industrial automation.",
    image: "/assets/images/alumni/arun.jpg",
    college: "RV College",
    department: "EEE",
    degree: "M.Tech",
    degreeLevel: "PG",
    state: "Karnataka",
    district: "Bangalore",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" }
    ]
  },
  {
    id: 24,
    name: "Meera Shah",
    batch: "Class of 2021",
    profession: "Software Engineer",
    bio: "DevOps engineer specializing in cloud infrastructure and CI/CD pipelines. AWS certified.",
    image: "/assets/images/alumni/meera.jpg",
    college: "PSG Tech",
    department: "IT",
    degree: "B.E",
    degreeLevel: "UG",
    state: "TamilNadu",
    district: "Coimbatore",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" },
      { platform: "github", url: "https://github.com" }
    ]
  },
  {
    id: 25,
    name: "Suresh Babu",
    batch: "Class of 2016",
    profession: "Civil Engineer",
    bio: "Structural engineer specializing in earthquake-resistant building design. Licensed PE.",
    image: "/assets/images/alumni/suresh.jpg",
    college: "Punjab Engineering College",
    department: "Civil Engineering",
    degree: "B.Tech",
    degreeLevel: "UG",
    state: "Punjab",
    district: "Ludhiana",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" }
    ]
  },
  {
    id: 26,
    name: "Gayatri Devi",
    batch: "Class of 2020",
    profession: "Research Scientist",
    bio: "Materials science researcher working on advanced composites for aerospace applications.",
    image: "/assets/images/alumni/gayatri.jpg",
    college: "IISc Bangalore",
    department: "Mathematics",
    degree: "M.Sc",
    degreeLevel: "PG",
    state: "Karnataka",
    district: "Bangalore",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" },
      { platform: "researchgate", url: "https://researchgate.net" }
    ]
  },
  {
    id: 27,
    name: "Naveen Reddy",
    batch: "Class of 2018",
    profession: "Mechanical Engineer",
    bio: "Aerospace engineer working on satellite propulsion systems. Multiple patents in rocket technology.",
    image: "/assets/images/alumni/naveen.jpg",
    college: "IIT Madras",
    department: "Mechanical Engineering",
    degree: "M.Tech",
    degreeLevel: "PG",
    state: "TamilNadu",
    district: "Chennai",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" }
    ]
  },
  {
    id: 28,
    name: "Priyanka Singh",
    batch: "Class of 2022",
    profession: "Data Scientist",
    bio: "AI researcher focusing on natural language processing and conversational AI systems.",
    image: "/assets/images/alumni/priyanka.jpg",
    college: "SKCET",
    department: "AI & ML",
    degree: "B.E",
    degreeLevel: "UG",
    state: "TamilNadu",
    district: "Coimbatore",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" },
      { platform: "github", url: "https://github.com" }
    ]
  },
  {
    id: 29,
    name: "Harish Chandra",
    batch: "Class of 2015",
    profession: "Professor",
    bio: "Associate Professor in Electrical Engineering. Research in renewable energy and smart grids.",
    image: "/assets/images/alumni/harish.jpg",
    college: "RV College",
    department: "ECE",
    degree: "PhD Engineering",
    degreeLevel: "PhD",
    state: "Karnataka",
    district: "Bangalore",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" },
      { platform: "researchgate", url: "https://researchgate.net" }
    ]
  },
  {
    id: 30,
    name: "Vaishali Jain",
    batch: "Class of 2021",
    profession: "Business Analyst",
    bio: "Healthcare analytics specialist working on patient outcome prediction models using ML.",
    image: "/assets/images/alumni/vaishali.jpg",
    college: "Anna University",
    department: "ECE",
    degree: "B.Tech",
    degreeLevel: "UG",
    state: "TamilNadu",
    district: "Chennai",
    socials: [
      { platform: "linkedin", url: "https://linkedin.com" }
    ]
  }
];

export default alumniData;