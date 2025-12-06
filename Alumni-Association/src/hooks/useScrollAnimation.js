import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, useAnimation } from 'framer-motion';

/**
 * Hook for scroll-triggered animations
 * @param {Object} options - Configuration options
 * @param {number} [options.threshold=0.2] - Intersection threshold (0-1)
 * @param {boolean} [options.triggerOnce=true] - Only trigger animation once
 * @param {Object} [options.initial] - Initial animation state
 * @param {Object} [options.animate] - Animation state when in view
 * @param {Object} [options.transition] - Animation transition config
 * @returns {Array} [ref, controls] - Ref to attach to element and animation controls
 */
export const useScrollAnimation = ({
  threshold = 0.2,
  triggerOnce = true,
  initial = { opacity: 0, y: 20 },
  animate = { opacity: 1, y: 0 },
  transition = { duration: 0.6, ease: 'easeOut' }
} = {}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold,
    triggerOnce,
  });

  useEffect(() => {
    if (inView) {
      controls.start(animate);
    } else if (!triggerOnce) {
      controls.start(initial);
    }
  }, [controls, inView, initial, animate, triggerOnce]);

  return [ref, controls];
};

/**
 * Predefined animation variants for common use cases
 */
export const scrollAnimations = {
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 }
  },
  slideLeft: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 }
  }
};

// Usage Example:
// const [ref, controls] = useScrollAnimation();
// <motion.div ref={ref} initial={initial} animate={controls} transition={transition}>