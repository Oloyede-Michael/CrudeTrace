import { useReducedMotion } from '../context/ReducedMotionContext';

export const useMotionConfig = () => {
  const shouldReduceMotion = useReducedMotion();
  
  return {
    shouldReduceMotion,
    fadeInUp: {
      initial: shouldReduceMotion ? false : { opacity: 0, y: 30 },
      whileInView: shouldReduceMotion ? {} : { opacity: 1, y: 0 },
      viewport: shouldReduceMotion ? {} : { once: true, margin: '-100px' },
      transition: shouldReduceMotion ? {} : { duration: 0.6 },
    },
    fadeIn: {
      initial: shouldReduceMotion ? false : { opacity: 0 },
      whileInView: shouldReduceMotion ? {} : { opacity: 1 },
      viewport: shouldReduceMotion ? {} : { once: true },
      transition: shouldReduceMotion ? {} : { duration: 0.5 },
    },
    scaleIn: {
      initial: shouldReduceMotion ? false : { opacity: 0, scale: 0.9 },
      whileInView: shouldReduceMotion ? {} : { opacity: 1, scale: 1 },
      viewport: shouldReduceMotion ? {} : { once: true },
      transition: shouldReduceMotion ? {} : { duration: 0.5 },
    },
  };
};
