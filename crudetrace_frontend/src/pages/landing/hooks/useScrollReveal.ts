import { useInView, type UseInViewOptions } from 'framer-motion';
import { useRef } from 'react';

export const useScrollReveal = (options?: UseInViewOptions) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: '-100px',
    ...options 
  });
  
  return { ref, isInView };
};
