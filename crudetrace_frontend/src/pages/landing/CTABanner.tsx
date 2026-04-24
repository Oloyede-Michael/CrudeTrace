import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const CTABanner = () => {
  const navigate = useNavigate();

  return (
    <section className="py-28 px-6 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-900/60 to-slate-900/80" />
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto text-center relative z-10 space-y-8"
      >
        <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
          Ready to Secure Your
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            Supply Chain?
          </span>
        </h2>

        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Join the forward-thinking petroleum companies using CrudeTrace to eliminate theft, automate settlements, and achieve full traceability.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl transition-all duration-200 shadow-xl shadow-blue-900/50"
          >
            Launch Dashboard
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            href="mailto:contact@crudetrace.io"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white rounded-xl transition-all duration-200"
          >
            Contact Sales
          </motion.a>
        </div>

        {/* Social proof snippet */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-slate-500 text-sm pt-4"
        >
          No credit card required · Free 14-day trial · Cancel anytime
        </motion.p>
      </motion.div>
    </section>
  );
};
