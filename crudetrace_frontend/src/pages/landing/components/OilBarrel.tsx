import { motion } from 'framer-motion';

interface OilBarrelProps {
  className?: string;
  delay?: number;
  x?: string | number;
  y?: string | number;
  scale?: number;
  rotate?: number;
  opacity?: number;
  hoverScale?: number;
}

export const OilBarrel = ({
  className = '',
  delay = 0,
  x = 0,
  y = 0,
  scale = 1,
  rotate = 0,
  opacity = 0.15,
  hoverScale = 1.3,
}: OilBarrelProps) => {
  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{ opacity: 0, y: -50, rotate: -15 }}
      animate={{
        opacity: opacity,
        y: [0, -10, 0],
        rotate: rotate,
        x: typeof x === 'number' ? x : 0,
      }}
      whileHover={{
        scale: hoverScale,
        rotate: rotate + 8,
        opacity: Math.min(opacity * 2, 0.35),
        y: -20,
        filter: 'drop-shadow(0 0 24px rgba(59, 130, 246, 0.7))',
      }}
      transition={{
        opacity: { duration: 1, delay },
        y: {
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay,
        },
        rotate: { duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'linear', delay },
        scale: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
        filter: { duration: 0.3 },
      }}
      style={{
        left: typeof x === 'string' ? x : undefined,
        top: typeof y === 'string' ? y : undefined,
        scale: scale,
      }}
    >
      <svg
        width="80"
        height="120"
        viewBox="0 0 80 120"
        fill="none"
        className="drop-shadow-2xl transition-all"
      >
        {/* Barrel body */}
        <motion.ellipse
          cx="40"
          cy="25"
          rx="22"
          ry="6"
          fill="#1e3a5f"
          stroke="#3b82f6"
          strokeWidth="1.5"
          whileHover={{ stroke: '#60a5fa', strokeWidth: 2.5 }}
          transition={{ duration: 0.3 }}
        />
        <rect
          x="18"
          y="25"
          width="44"
          height="70"
          rx="4"
          fill="#1e3a5f"
          stroke="#3b82f6"
          strokeWidth="1.5"
          style={{ transition: 'stroke 0.3s, strokeWidth 0.3s' }}
        />
        <motion.ellipse
          cx="40"
          cy="95"
          rx="22"
          ry="6"
          fill="#0f2847"
          stroke="#3b82f6"
          strokeWidth="1.5"
          whileHover={{ stroke: '#60a5fa', strokeWidth: 2.5 }}
          transition={{ duration: 0.3 }}
        />
        {/* Horizontal ridges */}
        <line x1="18" y1="38" x2="62" y2="38" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" />
        <line x1="18" y1="52" x2="62" y2="52" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" />
        <line x1="18" y1="66" x2="62" y2="66" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" />
        <line x1="18" y1="80" x2="62" y2="80" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" />
        {/* Top cap */}
        <rect
          x="30"
          y="15"
          width="20"
          height="12"
          rx="2"
          fill="#1e3a5f"
          stroke="#3b82f6"
          strokeWidth="1.5"
        />
        {/* Bottom cap */}
        <rect
          x="30"
          y="93"
          width="20"
          height="8"
          rx="2"
          fill="#0f2847"
          stroke="#3b82f6"
          strokeWidth="1.5"
        />
        {/* Highlights */}
        <ellipse cx="30" cy="45" rx="4" ry="8" fill="#3b82f6" opacity="0.3" />
      </svg>
    </motion.div>
  );
};
