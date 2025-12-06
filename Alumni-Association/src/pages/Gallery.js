import React, { useState } from 'react';
import GalleryCategories from '../components/sections/GalleryCategories';
import GalleryGrid from '../components/sections/GalleryGrid';
import { useLocation } from 'react-router-dom';

const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const location = useLocation();
  
  // Check if we're in a dashboard context
  const isInDashboard = location.pathname.includes('/institution/');

  return (
    <div className={`container mx-auto px-4 ${isInDashboard ? 'py-6' : 'py-12'}`}>
      {!isInDashboard && (
        <>
          <h1 className="text-3xl font-bold text-center mb-6">Photo Gallery</h1>
          <GalleryCategories onCategoryChange={setActiveCategory} />
        </>
      )}
      <GalleryGrid activeCategory={activeCategory} />
    </div>
  );
};

export default GalleryPage;