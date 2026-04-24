import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface ReducedMotionContextType {
  shouldReduceMotion: boolean;
}

export const ReducedMotionContext = createContext<ReducedMotionContextType>({
  shouldReduceMotion: false,
});

export const useReducedMotion = () => useContext(ReducedMotionContext);

export const ReducedMotionProvider = ({ children }: { children: ReactNode }) => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ReducedMotionContext.Provider value={{ shouldReduceMotion }}>
      {children}
    </ReducedMotionContext.Provider>
  );
};
