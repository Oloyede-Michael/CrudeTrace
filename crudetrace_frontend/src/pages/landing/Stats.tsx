import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useReducedMotion } from './context/ReducedMotionContext';

const stats = [
  { value: '$90K+', label: 'Treasury Secured' },
  { value: '100%', label: 'On-Chain Auditability' },
  { value: '<1s',  label: 'Alert Latency' },
  { value: '0',    label: 'Trusted Intermediaries' },
];

interface AnimatedNumberProps {
  value: string;
}

const AnimatedNumber = ({ value }: AnimatedNumberProps) => {
  const [displayValue, setDisplayValue] = useState('');
  const shouldReduceMotion = useReducedMotion();
  const numericPart = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
  
  const prefix = value.match(/^[^0-9]*/)?.[0] || '';
  const suffix = value.match(/[^0-9]*$/)?.[0] || '';
  const isPercentage = suffix === '%';
  const isPlus = suffix === '+';

  if (shouldReduceMotion) {
    const formatted = isPercentage
      ? `${Math.round(numericPart)}%`
      : isPlus
      ? `${Math.round(numericPart)}+`
      : Math.round(numericPart).toString();
    return <span>{prefix}{formatted}</span>;
  }

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 100, damping: 20 });

  useTransform(springValue, (latest) => {
    const formatted = isPercentage
      ? `${Math.round(latest)}%`
      : isPlus
      ? `${Math.round(latest)}+`
      : Math.round(latest).toString();
    setDisplayValue(formatted);
  });

  useEffect(() => {
    motionValue.set(numericPart);
  }, [motionValue, numericPart]);

  return <span>{prefix}{displayValue}{suffix.replace('%', '').replace('+', '')}{isPercentage ? '%' : ''}{isPlus ? '+' : ''}</span>;
};

export const Stats = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="stats" className="py-28 px-6 max-w-5xl mx-auto text-center">
      <motion.p
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
        viewport={shouldReduceMotion ? {} : { once: true, margin: '-100px' }}
        transition={shouldReduceMotion ? {} : { duration: 0.6 }}
        className="text-blue-500 text-sm font-semibold tracking-widest uppercase mb-12"
      >
        Network at a Glance
      </motion.p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, idx) => (
          <motion.div
            key={s.label}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={shouldReduceMotion ? {} : { once: true, margin: '-50px' }}
            transition={shouldReduceMotion ? {} : { delay: idx * 0.1, duration: 0.6 }}
            className="space-y-2"
          >
            <div className="text-4xl font-extrabold text-blue-400 tabular-nums">
              <AnimatedNumber value={s.value} />
            </div>
            <div className="text-slate-500 text-sm">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
