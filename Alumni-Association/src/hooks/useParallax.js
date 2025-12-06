import { useEffect, useState,useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

/**
 * Hook for creating parallax scroll effects
 * @param {Object} options - Configuration options
 * @param {number} [options.offsetStart=0] - Start offset (0-1)
 * @param {number} [options.offsetEnd=1] - End offset (0-1)
 * @param {number} [options.speed=0.1] - Parallax speed multiplier
 * @param {React.RefObject} [options.targetRef] - Optional target ref for container-based parallax
 * @returns {Object} - Motion value and ref to attach to element
 */
export const useParallax = ({
  offsetStart = 0,
  offsetEnd = 1,
  speed = 0.1,
  targetRef = null
} = {}) => {
  const [elementTop, setElementTop] = useState(0);
  const [elementHeight, setElementHeight] = useState(0);
  const ref = useRef(null);

  const { scrollY } = useScroll({
    target: targetRef || undefined,
    offset: [`${offsetStart} end`, `${offsetEnd} start`]
  });

  // Get element dimensions
  useEffect(() => {
    if (!ref.current) return;
    
    const setValues = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setElementTop(rect.top + window.scrollY);
        setElementHeight(rect.height);
      }
    };

    setValues();
    window.addEventListener('resize', setValues);
    return () => window.removeEventListener('resize', setValues);
  }, [ref]);

  // Calculate parallax transform
  const y = useTransform(
    scrollY,
    [elementTop - window.innerHeight, elementTop + elementHeight],
    [-(elementHeight * speed), elementHeight * speed]
  );

  // Calculate progress (0-1)
  const progress = useTransform(
    scrollY,
    [elementTop - window.innerHeight, elementTop + elementHeight],
    [0, 1]
  );

  return { ref, y, progress };
};

/**
 * Component wrapper for parallax effect
 */
export const ParallaxElement = ({ children, speed = 0.1, ...props }) => {
  const { ref, y } = useParallax({ speed });
  
  return (
    <motion.div ref={ref} style={{ y }} {...props}>
      {children}
    </motion.div>
  );
};

// Usage Examples:
// 1. Basic usage:
// const { ref, y } = useParallax({ speed: 0.2 });
// <motion.div ref={ref} style={{ y }}>Content</motion.div>

// 2. With container:
// const containerRef = useRef();
// const { ref, y } = useParallax({ targetRef: containerRef, speed: 0.3 });
// <div ref={containerRef}>
//   <motion.div ref={ref} style={{ y }}>Content</motion.div>
// </div>

// 3. Using component wrapper:
// <ParallaxElement speed={0.15}>
//   <img src="image.jpg" alt="Parallax" />
// </ParallaxElement>