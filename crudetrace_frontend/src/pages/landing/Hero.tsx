import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useReducedMotion } from './context/ReducedMotionContext';
import { OilBarrel } from './components/OilBarrel';

export const Hero = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const NODE_COUNT = 25;
    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 2.5 + 1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        const margin = 50;
        if (n.x < -margin) n.x = canvas.width + margin;
        if (n.x > canvas.width + margin) n.x = -margin;
        if (n.y < -margin) n.y = canvas.height + margin;
        if (n.y > canvas.height + margin) n.y = -margin;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.25;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(59,130,246,${alpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59,130,246,0.6)';
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <motion.section
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Canvas particle background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />

      {/* Gradient overlays for depth and contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-[#0b1120]/95 to-slate-900/90 -z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-transparent to-slate-900/60 -z-10" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-slate-900/20 to-slate-900/90 -z-10" />

      {/* Large decorative gradient blobs */}
      <motion.div
        className="absolute -top-[30%] -right-[20%] w-[800px] h-[800px] rounded-full bg-blue-600/8 blur-[140px] -z-10"
        animate={shouldReduceMotion ? {} : { scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute -bottom-[30%] -left-[20%] w-[700px] h-[700px] rounded-full bg-blue-500/5 blur-[120px] -z-10"
        animate={shouldReduceMotion ? {} : { scale: [1, 1.15, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />

      {/* Animated oil barrels */}
      <motion.div
        className="absolute inset-0 pointer-events-auto -z-0"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Barrels */}
        <OilBarrel delay={0} x="5%" y="15%" scale={0.7} rotate={8} opacity={0.12} hoverScale={1.3} />
        <OilBarrel delay={0.5} x="85%" y="20%" scale={0.8} rotate={-5} opacity={0.1} hoverScale={1.25} />
        <OilBarrel delay={1} x="10%" y="60%" scale={0.9} rotate={12} opacity={0.08} hoverScale={1.2} />
        <OilBarrel delay={1.5} x="88%" y="65%" scale={0.75} rotate={-10} opacity={0.11} hoverScale={1.25} />
        <OilBarrel delay={2} x="3%" y="80%" scale={0.65} rotate={6} opacity={0.09} hoverScale={1.3} />
        <OilBarrel delay={2.5} x="92%" y="75%" scale={0.85} rotate={-8} opacity={0.1} hoverScale={1.2} />
        <OilBarrel delay={3} x="20%" y="65%" scale={0.75} rotate={-5} opacity={0.1} hoverScale={1.25} />
        <OilBarrel delay={3.5} x="50%" y="25%" scale={1.1} rotate={3} opacity={0.15} hoverScale={1.4} />
        <OilBarrel delay={4} x="0%" y="40%" scale={0.6} rotate={10} opacity={0.08} hoverScale={1.35} />
        <OilBarrel delay={4.5} x="100%" y="35%" scale={0.65} rotate={-7} opacity={0.09} hoverScale={1.3} />
      </motion.div>

      {/* Main content wrapper */}
      <div className="max-w-7xl mx-auto px-6 py-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text content - Enhanced for legibility */}
          <motion.div
            className="relative z-10 space-y-8"
            initial={shouldReduceMotion ? false : { opacity: 0, x: -60 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
            transition={shouldReduceMotion ? {} : { duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Glass pill badge */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.8, y: 20 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1, y: 0 }}
              transition={shouldReduceMotion ? {} : { duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2.5 px-4.5 py-2 bg-blue-500/8 backdrop-blur-xl border border-blue-500/25 rounded-full text-blue-300 text-sm font-semibold tracking-[0.15em] uppercase shadow-lg shadow-blue-900/20"
            >
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              Blockchain-Powered Supply Chain Security
            </motion.div>

            {/* Main headline with enhanced contrast */}
            <div className="space-y-5">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
                <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  Every Barrel.
                  <br />
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 drop-shadow-[0_4px_20px_rgba(59,130,246,0.4)]">
                  Fully Accounted.
                </span>
              </h1>

              {/* Subtext with improved readability */}
              <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/60 rounded-2xl p-6 shadow-2xl shadow-black/40">
                <p className="text-lg sm:text-xl text-slate-200 leading-relaxed font-medium">
                  CrudeTrace brings{' '}
                  <span className="text-blue-300 font-semibold">immutable, real-time transparency</span>{' '}
                  to crude oil transportation — detecting theft, reconciling volumes, and settling
                  payments <span className="text-emerald-300 font-semibold">on-chain, automatically</span>.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? {} : { duration: 0.7, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center gap-5 pt-4"
            >
              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -3 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-9 py-5 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-500 hover:via-blue-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-200 shadow-2xl shadow-blue-900/50 hover:shadow-blue-900/70 text-lg relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center gap-2">
                  Launch Dashboard
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-1">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </motion.button>

              <motion.a
                whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                href="#how"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-9 py-5 border-2 border-slate-700 hover:border-slate-500 bg-slate-900/40 backdrop-blur-sm text-slate-200 hover:text-white font-semibold rounded-xl transition-all duration-200 hover:bg-slate-800/60"
              >
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="text-blue-400">
                  <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span>How It Works</span>
              </motion.a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={shouldReduceMotion ? {} : { opacity: 1 }}
              transition={shouldReduceMotion ? {} : { duration: 0.7, delay: 0.7 }}
              className="flex flex-wrap items-center gap-6 pt-4 text-sm text-slate-400"
            >
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-emerald-400">
                  <path d="M8 0L3 6l2 2 5-5 5 5 2-2-5-5L8 0z" fill="currentColor" />
                  <path d="M3 8l2 2 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="font-medium">Audited Smart Contracts</span>
              </div>
              <div className="w-px h-4 bg-slate-700" />
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-blue-400">
                  <rect x="2" y="6" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M2 9h12" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="5" cy="7.5" r="0.5" fill="currentColor" />
                </svg>
                <span className="font-medium">On-Chain Audit Trail</span>
              </div>
              <div className="w-px h-4 bg-slate-700" />
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-amber-400">
                  <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 4v8M4 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="font-medium">&lt;1s Alert Latency</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Hero illustration area (barrels will be displayed) */}
          <motion.div
            className="relative hidden lg:flex items-center justify-center h-full min-h-[500px]"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
            transition={shouldReduceMotion ? {} : { duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Central glowing core */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-[300px] h-[300px] rounded-full bg-blue-500/15 blur-[80px]"
                animate={shouldReduceMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            {/* ( Stacked/overlapping barrels collage)
             */}
            <motion.div
              className="relative w-[400px] h-[500px]"
              animate={shouldReduceMotion ? {} : { rotateY: [0, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Barrel 1 - back left */}
              <motion.div
                className="absolute left-[10%] top-[20%]"
                animate={shouldReduceMotion ? {} : { y: [0, -15, 0], rotate: [-2, 2, -2] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
                style={{ transformOrigin: 'center bottom' }}
              >
                <OilBarrel x={0} y={0} scale={0.9} rotate={-3} opacity={0.18} />
              </motion.div>

              {/* Barrel 2 - back right */}
              <motion.div
                className="absolute right-[5%] top-[10%]"
                animate={shouldReduceMotion ? {} : { y: [0, 15, 0], rotate: [5, -5, 5] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                style={{ transformOrigin: 'center bottom' }}
              >
                <OilBarrel x={0} y={0} scale={1} rotate={6} opacity={0.2} />
              </motion.div>

              {/* Barrel 3 - center main */}
              <motion.div
                className="absolute left-[30%] top-[5%]"
                animate={shouldReduceMotion ? {} : { y: [0, -20, 0], x: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                style={{ transformOrigin: 'center bottom' }}
              >
                <OilBarrel x={0} y={0} scale={1.3} rotate={0} opacity={0.28} />
              </motion.div>

              {/* Barrel 4 - center front */}
              <motion.div
                className="absolute left-[50%] top-[25%]"
                animate={shouldReduceMotion ? {} : { y: [0, 10, 0], rotate: [-3, 3, -3] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
                style={{ transformOrigin: 'center bottom' }}
              >
                <OilBarrel x={0} y={0} scale={1.1} rotate={2} opacity={0.22} />
              </motion.div>

              {/* Barrel 5 - left side */}
              <motion.div
                className="absolute left-[0%] top-[40%]"
                animate={shouldReduceMotion ? {} : { y: [0, 12, 0], x: [0, 20, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                style={{ transformOrigin: 'center bottom' }}
              >
                <OilBarrel x={0} y={0} scale={0.95} rotate={-4} opacity={0.16} />
              </motion.div>

              {/* Barrel 6 - right side */}
              <motion.div
                className="absolute right-[15%] top-[35%]"
                animate={shouldReduceMotion ? {} : { y: [0, -12, 0], x: [0, -15, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                style={{ transformOrigin: 'center bottom' }}
              >
                <OilBarrel x={0} y={0} scale={0.85} rotate={5} opacity={0.14} />
              </motion.div>

              {/* Barrel 7 - bottom left (falling effect) */}
              <motion.div
                className="absolute left-[20%] top-[65%]"
                animate={shouldReduceMotion ? {} : { y: [0, 25, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
              >
                <OilBarrel x={0} y={0} scale={0.75} rotate={-8} opacity={0.12} />
              </motion.div>

              {/* Barrel 8 - bottom right */}
              <motion.div
                className="absolute right-[25%] top-[70%]"
                animate={shouldReduceMotion ? {} : { y: [0, -20, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 2.1 }}
              >
                <OilBarrel x={0} y={0} scale={0.7} rotate={12} opacity={0.1} />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -20 }}
        animate={shouldReduceMotion ? {} : { opacity: 0.6, y: 0 }}
        transition={shouldReduceMotion ? {} : { duration: 0.8, delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
      >
        <span className="text-xs uppercase tracking-wider">Scroll</span>
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5l7 7M12 5l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};