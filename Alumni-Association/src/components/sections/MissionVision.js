import React from 'react';
import { motion } from 'framer-motion';

const MissionVision = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Mission Card */}
          <motion.div
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg overflow-hidden"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Our Mission</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To connect, engage, and empower our alumni community through meaningful relationships, 
                professional development opportunities, and lifelong learning experiences that strengthen 
                ties to our institution and each other.
              </p>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg overflow-hidden"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Our Vision</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To be the premier alumni network that fosters a vibrant, global community where members 
                find value, purpose, and connection throughout their lives, while supporting the continued 
                excellence and growth of our alma mater.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionVision;