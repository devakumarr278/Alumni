import React from 'react';
import Hero from '../components/sections/Hero';
import Testimonials from '../components/sections/Testimonials';
import GalleryPreview from '../components/sections/GalleryPreview';
import StatsSection from '../components/sections/StatsSection';
import PostDisplay from '../components/common/PostDisplay';

const Home = () => {
  return (
    <div className="overflow-hidden">
      <Hero />
      <StatsSection />
      <Testimonials />
      <GalleryPreview />
      
      {/* Institution Posts Section - Placed after Events (GalleryPreview) */}
      <PostDisplay />
    </div>
  );
};

export default Home;