import React from 'react';
import { motion } from 'framer-motion';
import Photo1 from '../../assets/images/gallery/awards.png';
import Photo2 from '../../assets/images/gallery/gala.png';
import Photo3 from '../../assets/images/gallery/campus.png';
import Photo4 from '../../assets/images/gallery/library.png';
import Photo5 from '../../assets/images/gallery/reunion.png';
import Photo6 from '../../assets/images/gallery/footbal.png';


const GalleryGrid = ({ activeCategory = 'all' }) => {
  // Sample gallery data - replace with your actual data
  const galleryData = [
    {
      id: 1,
      title: "Annual Gala 2023",
      category: "events",
      image: `${Photo2}`,
      date: "May 15, 2023",
      likes: 124
    },
    {
      id: 2,
      title: "Campus Sunset",
      category: "campus", 
      image: `${Photo3}`,
      date: "April 2, 2023",
      likes: 89
    },
    {
      id: 3,
      title: "Class of 2013 Reunion",
      category: "reunions",
      image: `${Photo4}`,
      date: "July 22, 2023",
      likes: 156
    },
    {
      id: 4,
      title: "Football Championship",
      category: "sports",
      image:`${Photo6}`,
      date: "November 5, 2023",
      likes: 210
    },
    {
      id: 5,
      title: "Awards Night",
      category: "awards",
      image: `${Photo1}`,
      date: "March 10, 2023",
      likes: 98
    },
    {
      id: 6,
      title: "Library Opening",
      category: "campus",
      image: `${Photo5}`,
      date: "September 8, 2023",
      likes: 76
    }
  ];

  // Filter images based on active category
  const filteredImages = activeCategory === 'all' 
    ? galleryData 
    : galleryData.filter(img => img.category === activeCategory);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredImages.map((image, index) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative group overflow-hidden rounded-xl shadow-lg"
        >
          <img
            src={image.image}
            alt={image.title}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Image overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
            <h3 className="text-white text-xl font-bold mb-1">{image.title}</h3>
            <div className="flex items-center justify-between text-white text-sm">
              <span><i className="far fa-calendar mr-1"></i> {image.date}</span>
              <span><i className="far fa-heart mr-1"></i> {image.likes}</span>
            </div>
          </div>
          
          {/* Quick view button */}
          <button className="absolute top-4 right-4 bg-white/90 text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <i className="fas fa-expand"></i>
          </button>
        </motion.div>
      ))}
    </div>
  );
};

export default GalleryGrid;