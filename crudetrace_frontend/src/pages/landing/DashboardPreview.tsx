import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, Shield, Clock } from 'lucide-react';

export const DashboardPreview = () => {
  const navigate = useNavigate();

  return (
    <section id="demo" className="py-28 px-6 bg-slate-900/30 border-y border-slate-800/40">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div>
              <p className="text-blue-500 text-sm font-semibold tracking-widest uppercase mb-3">Product Demo</p>
              <h2 className="text-4xl font-bold leading-tight mb-4">
                See CrudeTrace in Action
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Explore the dashboard that gives you complete visibility into every barrel, every transaction, and every alert — all in real-time.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: BarChart3, label: 'Live Analytics', desc: 'Real-time batch tracking' },
                { icon: Shield, label: 'Secure', desc: 'End-to-end encryption' },
                { icon: Clock, label: 'Instant Alerts', desc: 'Sub-second notifications' },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-blue-500/30 transition-colors"
                >
                  <feature.icon size={20} className="text-blue-400 mb-2" />
                  <h4 className="font-semibold text-sm mb-1">{feature.label}</h4>
                  <p className="text-xs text-slate-400">{feature.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.03, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/40"
            >
              Open Dashboard
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>

          {/* Right: Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl shadow-blue-900/20 bg-slate-800">
              {/* Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/60 bg-slate-800/80">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 text-xs text-slate-500">Dashboard Preview</span>
              </div>

              {/* Content placeholder */}
              <div className="p-6 space-y-6">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4">
                  {['$1.2M', '342', '99%'].map((stat, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/40">
                      <div className="text-2xl font-bold text-blue-400">{stat}</div>
                      <div className="text-xs text-slate-500 mt-1">Total Volume</div>
                    </div>
                  ))}
                </div>

                {/* Chart placeholder */}
                <div className="h-48 rounded-xl bg-slate-900/60 border border-slate-700/40 flex items-center justify-center">
                  <div className="flex items-end gap-1 h-20">
                    {[40, 65, 30, 85, 55, 70, 90].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                        className="w-3 bg-blue-500/60 rounded-t"
                      />
                    ))}
                  </div>
                </div>

                {/* Batch list */}
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-700/40">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <div className="flex-1 h-2 bg-slate-700 rounded" />
                      <div className="w-16 h-2 bg-slate-700 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Glow effect behind mockup */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-blue-500/10 to-transparent rounded-3xl blur-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
