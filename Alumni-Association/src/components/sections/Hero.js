import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import ScrollIndicator from '../ui/ScrollIndicator';
import AnimatedText from '../ui/AnimatedText';
import heroBg from '../../assets/images/hero-bg2.png';

const FloatingParticle = ({ delay = 0 }) => (
  <motion.div
    className="absolute rounded-full bg-white/20"
    style={{
      width: Math.random() * 20 + 5,
      height: Math.random() * 20 + 5,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    }}
    animate={{
      y: [0, -30, 0],
      x: [0, Math.random() * 20 - 10, 0],
      opacity: [0.3, 0.7, 0.3],
    }}
    transition={{
      duration: Math.random() * 3 + 2,
      repeat: Infinity,
      delay,
    }}
  />
);

const Hero = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  const handleJoinNow = () => {
    navigate('/login');
    // Show celebration effects
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const emojis = ['😄', '🎉', '🎊', '🥳', '👏', '🙌', '👍', '💯', '🔥', '✨'];

  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0">
        {/* Animated Background Image */}
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
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.2} />
        ))}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70"></div>
      </div>
      
      {/* Celebration Effects */}
      {showConfetti && (
        <>
          {/* Enhanced Confetti */}
          {[...Array(300)].map((_, i) => (
            <motion.div
              key={`confetti-${i}`}
              className="absolute w-2 h-2 rounded-sm"
              style={{
                backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                left: `${Math.random() * 100}%`,
                top: '-10px',
              }}
              initial={{ y: -10, x: Math.random() * 100 }}
              animate={{
                y: window.innerHeight + 20,
                x: `+=${Math.random() * 100 - 50}`,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                ease: "easeOut"
              }}
            />
          ))}
          
          {/* Dancing Emojis */}
          {emojis.map((emoji, i) => (
            <motion.div
              key={`emoji-${i}`}
              className="absolute text-3xl"
              style={{
                left: `${10 + i * 8}%`,
                top: '20%',
              }}
              initial={{ 
                y: 0, 
                x: 0,
                scale: 0,
                rotate: 0
              }}
              animate={{
                y: [0, -100, -200, -300],
                x: [0, Math.sin(i) * 100, Math.cos(i) * 150, Math.sin(i) * 200],
                scale: [0, 1.5, 1, 0.8],
                rotate: [0, 360, 720, 1080],
              }}
              transition={{
                duration: 5,
                times: [0, 0.3, 0.6, 1],
                ease: "easeOut"
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </>
      )}
      
      {/* Content */}
      <div className="container mx-auto px-4 z-10 relative">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <AnimatedText 
              text="Welcome to Our Alumni Network"
              className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg"
              delay={0.2}
            />
          </motion.div>
          
          <motion.p 
            className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto"
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
            <Button 
              size="lg" 
              className="shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300" 
              onClick={handleJoinNow}
            >
              Join Now
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white/20 backdrop-blur-sm"
            >
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