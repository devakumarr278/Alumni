import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GalleryImage } from '../ui';
import Button from '../common/Button';

const Gallery = ({ images }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'reunions', name: 'Reunions' },
    { id: 'events', name: 'Events' },
    { id: 'campus', name: 'Campus Life' },
  ];

  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Gallery</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Relive the memories from our alumni community
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="capitalize"
            >
              {category.name}
            </Button>
          ))}
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="aspect-square"
            >
              <GalleryImage 
                src={image.src} 
                alt={image.alt}
                category={image.category}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;