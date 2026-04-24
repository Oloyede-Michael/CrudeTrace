import { motion } from 'framer-motion';

const logos = [
  { name: 'ExxonMobil', initial: 'E' },
  { name: 'Shell', initial: 'S' },
  { name: 'Chevron', initial: 'C' },
  { name: 'BP', initial: 'B' },
  { name: 'TotalEnergies', initial: 'T' },
  { name: 'Eni', initial: 'E' },
];

export const LogoCloud = () => {
  return (
    <section className="py-20 px-6 border-y border-slate-800/50 bg-slate-900/20">
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-slate-500 text-sm font-semibold tracking-widest uppercase mb-10"
        >
          Trusted by industry leaders worldwide
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {logos.map((logo, idx) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ scale: 1.05, opacity: 1 }}
              className="flex items-center justify-center h-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
              title={logo.name}
            >
              <span className="text-2xl font-bold text-slate-300 tracking-tight">
                {logo.initial}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
