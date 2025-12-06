import React from 'react';
import Hero from '../components/sections/Hero';
import Testimonials from '../components/sections/Testimonials';
import GalleryPreview from '../components/sections/GalleryPreview';
import StatsSection from '../components/sections/StatsSection';

const Home = () => {
  return (
    <div className="overflow-hidden">
      <Hero />
      <StatsSection />
      <Testimonials />
      <GalleryPreview />
    </div>
  );
};

export default Home;