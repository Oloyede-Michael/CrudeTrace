import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "CrudeTrace eliminated $2M in theft within the first quarter of deployment. The real-time alerts are a game changer.",
    author: "Sarah Chen",
    role: "VP of Operations",
    company: "Paxon Oil & Gas",
    avatar: "SC",
  },
  {
    quote: "Finally, a solution that unifies logistics, finance, and compliance on a single immutable ledger. The automated settlement alone saves us 40 hours per week.",
    author: "Marcus Johnson",
    role: "Chief Technology Officer",
    company: "Atlantic Refining",
    avatar: "MJ",
  },
  {
    quote: "We reduced reconciliation time from days to minutes. The blockchain audit trail is exactly what regulators have been asking for.",
    author: "Elena Rodriguez",
    role: "Head of Supply Chain",
    company: "Gulfstream Petroleum",
    avatar: "ER",
  },
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-28 px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 space-y-3"
      >
        <p className="text-blue-500 text-sm font-semibold tracking-widest uppercase">Testimonials</p>
        <h2 className="text-4xl font-bold">Trusted by Industry Leaders</h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          Hear from the executives who've transformed their supply chain with CrudeTrace.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, idx) => (
          <motion.blockquote
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: idx * 0.15, duration: 0.6 }}
            whileHover={{ y: -5 }}
            className="relative p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/30 transition-all duration-300 group"
          >
            {/* Quote icon */}
            <div className="absolute top-6 right-6 text-blue-500/20 group-hover:text-blue-500/40 transition-colors">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
              </svg>
            </div>

            <p className="text-slate-300 leading-relaxed mb-6 relative z-10">
              "{t.quote}"
            </p>

            <footer className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold">
                {t.avatar}
              </div>
              <div>
                <cite className="block text-white font-semibold not-italic">{t.author}</cite>
                <span className="text-slate-500 text-sm">
                  {t.role}, {t.company}
                </span>
              </div>
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </section>
  );
};
