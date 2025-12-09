import React, { useState } from 'react';
import { motion } from 'framer-motion';

const StarIcon = ({ filled }) => (
  <svg
    className={`w-5 h-5 ${filled ? 'text-yellow-400 fill-current' : 'text-gray-300 stroke-current fill-none'}`}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
);

const TestimonialCard = ({ testimonial, index, isActive }) => {
  return (
    <motion.div
      key={testimonial.id || index}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className={`rounded-2xl shadow-xl h-full flex flex-col transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-br from-white to-gray-50 border-2 border-blue-200 scale-105' 
          : 'bg-white'
      }`}
    >
      <div className="p-8 flex-grow">
        <div className="flex items-center mb-6">
          <div className="relative">
            <img 
              src={testimonial.avatar} 
              alt={testimonial.name}
              className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-white shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-lg">{testimonial.name}</h4>
            <p className="text-sm text-gray-600">{testimonial.batch} • {testimonial.profession}</p>
          </div>
        </div>
        <p className="text-gray-700 italic mb-6 flex-grow">"{testimonial.quote}"</p>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} filled={i < testimonial.rating} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Testimonials = ({ testimonials = [] }) => {
  const defaultTestimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      batch: 'Class of 2015',
      profession: 'Software Engineer',
      quote: 'The alumni network helped me land my dream job at a top tech company.',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: 2,
      name: 'Michael Chen',
      batch: 'Class of 2018',
      profession: 'Marketing Director',
      quote: 'The connections I made through the alumni community have been invaluable.',
      rating: 4,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 3,
      name: 'David Wilson',
      batch: 'Class of 2012',
      profession: 'Entrepreneur',
      quote: 'The mentorship program connected me with industry leaders who guided my startup journey.',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg'
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate testimonials
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % displayTestimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [displayTestimonials.length]);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-blue-500 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-purple-500 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Alumni Stories</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hear from our alumni about their experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayTestimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={testimonial.id || index} 
              testimonial={testimonial} 
              index={index}
              isActive={index === activeIndex}
            />
          ))}
        </div>

        {/* Testimonial indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {displayTestimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'bg-blue-600 w-8' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;