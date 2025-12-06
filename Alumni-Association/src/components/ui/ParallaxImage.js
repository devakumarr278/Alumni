import React, { useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, useTransform, useScroll } from 'framer-motion';

const ParallaxImage = ({ src, alt, className = '', speed = 0.2 }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 100 * speed]);

  return (
    <div ref={scrollRef} className="overflow-hidden h-full">
      <motion.img
        ref={ref}
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
        style={{ y }}
        initial={{ scale: 1.1 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </div>
  );
};

export default ParallaxImage;