import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hoverEffect = true,
  animation = true,
  ...props
}) => {
  return (
    <motion.div
      className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}
      whileHover={hoverEffect ? { y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' } : {}}
      initial={animation ? { opacity: 0, y: 20 } : {}}
      whileInView={animation ? { opacity: 1, y: 0 } : {}}
      viewport={animation ? { once: true } : {}}
      transition={{ duration: 0.4 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 bg-gray-50 ${className}`}>{children}</div>
);