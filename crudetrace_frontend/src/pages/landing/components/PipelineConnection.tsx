import { motion } from 'framer-motion';

interface PipelineConnectionProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay?: number;
  curveIntensity?: number;
}

export const PipelineConnection = ({
  startX,
  startY,
  endX,
  endY,
  delay = 0,
  curveIntensity = 50,
}: PipelineConnectionProps) => {
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2 - curveIntensity;
  const pathData = `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;

  return (
    <svg
      className="absolute inset-0 pointer-events-auto"
      style={{ left: 0, top: 0, width: '100%', height: '100%', zIndex: -1 }}
    >
      <defs>
        <filter id="pipelineGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.path
        d={pathData}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2.5"
        strokeLinecap="round"
        filter="url(#pipelineGlow)"
        initial={{ pathLength: 0, opacity: 0.2 }}
        animate={{ pathLength: 1, opacity: 0.5 }}
        whileHover={{
          stroke: '#60a5fa',
          strokeWidth: 4,
          opacity: 0.9,
          filter: 'url(#pipelineGlow) brightness(1.3)',
        }}
        transition={{
          pathLength: { duration: 2.5, delay, ease: 'easeOut' },
          opacity: { duration: 0.3 },
          strokeWidth: { duration: 0.2 },
        }}
        style={{
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
      />

      {/* Particle 1 */}
      <motion.circle
        r="4"
        fill="#60a5fa"
        filter="url(#pipelineGlow)"
        animate={{
          offsetDistance: ['0%', '100%'],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay,
          ease: 'linear',
        }}
        style={{
          offsetPath: `path('${pathData}')`,
          opacity: 0.5,
        }}
      />

      {/* Particle 2 (offset) */}
      <motion.circle
        r="3"
        fill="#93c5fd"
        filter="url(#pipelineGlow)"
        animate={{
          offsetDistance: ['0%', '100%'],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: delay + 2,
          ease: 'linear',
        }}
        style={{
          offsetPath: `path('${pathData}')`,
          opacity: 0.4,
        }}
      />
    </svg>
  );
};
