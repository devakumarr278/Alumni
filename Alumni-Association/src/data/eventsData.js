import Event1 from '../assets/images/Event1.png';
import Event2 from '../assets/images/Event2.png';
import Event3 from '../assets/images/Event3.png';
import GalaImage from '../assets/images/gallery/gala.png';
import CampusImage from '../assets/images/gallery/campus.png';
import ReunionImage from '../assets/images/gallery/reunion.png';
import AwardsImage from '../assets/images/gallery/awards.png';
import FootballImage from '../assets/images/gallery/footbal.png';
import LibraryImage from '../assets/images/gallery/library.png';

export const allEvents = [
  // Social Events
  {
    id: 1,
    title: "Annual Alumni Gala 2025",
    date: "November 18, 2025",
    time: "7:00 PM - 11:00 PM",
    location: "Grand Ballroom, University Campus",
    description: "An elegant evening of celebration, networking, and reminiscing with fellow alumni. Join us for an unforgettable night of dancing, dining, and reconnecting.",
    category: "social",
    image: GalaImage,
    price: "$75",
    featured: true
  },
  {
    id: 2,
    title: "Holiday Networking Mixer",
    date: "December 15, 2025",
    time: "6:00 PM - 9:00 PM",
    location: "Downtown Alumni Lounge",
    description: "Celebrate the holiday season with fellow alumni in a relaxed networking environment. Enjoy festive cocktails and appetizers.",
    category: "social",
    image: Event1,
    price: "$35"
  },
  {
    id: 3,
    title: "Spring Garden Party",
    date: "April 20, 2026",
    time: "3:00 PM - 7:00 PM",
    location: "University Botanical Gardens",
    description: "Welcome spring with an outdoor celebration featuring live music, local food vendors, and beautiful garden tours.",
    category: "social",
    image: CampusImage,
    price: "$25"
  },

  // Professional Events
  {
    id: 4,
    title: "Global Career Summit 2026",
    date: "February 15, 2026",
    time: "9:00 AM - 6:00 PM",
    location: "Business School Auditorium",
    description: "Learn from alumni leaders about industry trends, emerging technologies, and global career opportunities. Network with professionals across various fields.",
    category: "professional",
    image: Event2,
    price: "$45",
    featured: true
  },
  {
    id: 5,
    title: "Entrepreneurship Workshop Series",
    date: "March 10, 2026",
    time: "10:00 AM - 4:00 PM",
    location: "Innovation Hub",
    description: "A comprehensive workshop series covering startup fundamentals, funding strategies, and business development with successful alumni entrepreneurs.",
    category: "professional",
    image: AwardsImage,
    price: "$60"
  },
  {
    id: 6,
    title: "Industry Panel: Future of Technology",
    date: "May 25, 2026",
    time: "2:00 PM - 5:00 PM",
    location: "Tech Center Auditorium",
    description: "Join leading alumni working in AI, blockchain, and emerging technologies as they discuss industry trends and career opportunities.",
    category: "professional",
    image: LibraryImage,
    price: "$30"
  },

  // Reunion Events
  {
    id: 7,
    title: "15-Year Reunion: Class of 2011",
    date: "June 22, 2026",
    time: "2:00 PM - 10:00 PM",
    location: "Alumni Gardens & Heritage Hall",
    description: "Special reunion celebration for the Class of 2011. Families welcome for this milestone gathering with campus tours and special dinner.",
    category: "reunion",
    image: ReunionImage,
    price: "$95",
    featured: true
  },
  {
    id: 8,
    title: "Golden Anniversary: Class of 1976",
    date: "September 14, 2026",
    time: "11:00 AM - 8:00 PM",
    location: "Heritage Hall",
    description: "Celebrate 50 years since graduation with the Class of 1976. A day of memories, recognition, and celebration.",
    category: "reunion",
    image: Event3,
    price: "$125"
  },
  {
    id: 9,
    title: "10-Year Reunion: Class of 2016",
    date: "October 18, 2026",
    time: "5:00 PM - 11:00 PM",
    location: "Student Union Ballroom",
    description: "Decade celebration for the Class of 2016 featuring campus tours, dinner, and live entertainment.",
    category: "reunion",
    image: CampusImage,
    price: "$85"
  },

  // Sports Events
  {
    id: 10,
    title: "Alumni Football Championship",
    date: "November 8, 2025",
    time: "2:00 PM - 6:00 PM",
    location: "University Stadium",
    description: "Annual alumni football tournament with teams representing different graduation years. Includes BBQ and prizes for winning teams.",
    category: "sports",
    image: FootballImage,
    price: "$20",
    featured: true
  },
  {
    id: 11,
    title: "Basketball Alumni Tournament",
    date: "January 25, 2026",
    time: "10:00 AM - 4:00 PM",
    location: "Athletic Center",
    description: "Competitive basketball tournament for alumni players. All skill levels welcome with separate divisions.",
    category: "sports",
    image: Event1,
    price: "$15"
  },
  {
    id: 12,
    title: "Golf Tournament & Charity Drive",
    date: "August 12, 2026",
    time: "8:00 AM - 6:00 PM",
    location: "University Golf Course",
    description: "Annual charity golf tournament with prizes, dinner reception, and fundraising for student scholarships.",
    category: "sports",
    image: CampusImage,
    price: "$120"
  },

  // Cultural Events (replacing volunteer)
  {
    id: 13,
    title: "International Cultural Festival",
    date: "March 28, 2026",
    time: "12:00 PM - 8:00 PM",
    location: "Campus Cultural Center",
    description: "Celebrate diversity with international food, music, and performances from our global alumni community.",
    category: "cultural",
    image: GalaImage,
    price: "$20"
  },
  {
    id: 14,
    title: "Alumni Art Exhibition",
    date: "May 15, 2026",
    time: "6:00 PM - 9:00 PM",
    location: "University Art Gallery",
    description: "Showcase artwork, photography, and creative projects by talented alumni artists. Wine and appetizers included.",
    category: "cultural",
    image: LibraryImage,
    price: "$25"
  },
  {
    id: 15,
    title: "Music & Poetry Night",
    date: "July 18, 2026",
    time: "7:00 PM - 10:00 PM",
    location: "Alumni Center Auditorium",
    description: "An intimate evening featuring musical performances and poetry readings by alumni artists and writers.",
    category: "cultural",
    image: Event2,
    price: "$18"
  }
];

export const eventCategories = [
  { 
    id: 'all', 
    name: 'All Events', 
    icon: 'fas fa-calendar', 
    emoji: '📅',
    color: 'from-blue-500 to-purple-500'
  },
  { 
    id: 'social', 
    name: 'Social', 
    icon: 'fas fa-glass-cheers', 
    emoji: '🎉',
    color: 'from-pink-500 to-rose-500'
  },
  { 
    id: 'professional', 
    name: 'Professional', 
    icon: 'fas fa-briefcase', 
    emoji: '💼',
    color: 'from-green-500 to-emerald-500'
  },
  { 
    id: 'reunion', 
    name: 'Reunions', 
    icon: 'fas fa-users', 
    emoji: '👥',
    color: 'from-yellow-500 to-orange-500'
  },
  { 
    id: 'sports', 
    name: 'Sports', 
    icon: 'fas fa-running', 
    emoji: '⚽',
    color: 'from-red-500 to-pink-500'
  },
  { 
    id: 'cultural', 
    name: 'Cultural', 
    icon: 'fas fa-palette', 
    emoji: '🎨',
    color: 'from-purple-500 to-indigo-500'
  }
];

export const getFeaturedEvents = () => allEvents.filter(event => event.featured);
export const getEventsByCategory = (category) => 
  category === 'all' ? allEvents : allEvents.filter(event => event.category === category);