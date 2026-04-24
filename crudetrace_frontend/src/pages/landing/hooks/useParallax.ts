import { useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';

export const useParallax = (value: MotionValue<number>, distance: number) => {
  return useTransform(value, [-distance, distance], [distance, -distance]);
};

export const useGlideScroll = () => {
  const { scrollY } = useScroll();
  const smoothY = useSpring(scrollY, { stiffness: 400, damping: 40 });
  return smoothY;
};
