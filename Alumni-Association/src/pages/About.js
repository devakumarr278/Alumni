import React from 'react';
import { motion } from 'framer-motion';
import HistoryTimeline from '../components/sections/HistoryTimeline';
import MissionVision from '../components/sections/MissionVision';
import LeadershipTeam from '../components/sections/LeadershipTeam';

const About = () => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="py-12"
      >
        <div className="container mx-auto px-4 mt-[50px]">
          <motion.h1 
            className="text-4xl font-bold text-center mb-12 text-gray-800"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            About Our Alumni Association
          </motion.h1>
          <MissionVision />
          <HistoryTimeline />
          <LeadershipTeam />
        </div>
      </motion.div>
    </>
  );
};

export default About;