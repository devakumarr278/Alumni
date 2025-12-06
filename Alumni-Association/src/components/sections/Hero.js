import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import ScrollIndicator from '../ui/ScrollIndicator';
import AnimatedText from '../ui/AnimatedText';
import heroBg from '../../assets/images/hero-bg2.png';


const Hero = () => {
  const navigate = useNavigate();

  const handleJoinNow = () => {
    navigate('/login');
  };

  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-800 overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
        initial={{ scale: 1 }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Content */}
      <div className="container mx-auto px-4 z-10">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <AnimatedText 
            text="Welcome to Our Alumni Network"
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            delay={0.2}
          />
          
          <motion.p 
            className="text-xl text-gray-200 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Reconnect with old friends, discover career opportunities, and stay engaged with your alma mater.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Button size="lg" className="shadow-lg" onClick={handleJoinNow}>
              Join Now
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      <ScrollIndicator />
    </section>
  );
};

export default Hero;