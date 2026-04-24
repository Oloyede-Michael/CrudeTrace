import { motion } from 'framer-motion';

const steps = [
  {
    step: '01',
    title: 'Batch Extraction Logged',
    desc: 'An operator records the batch on-chain: volume loaded, declared value, and source location — permanently timestamped.',
  },
  {
    step: '02',
    title: 'In-Transit Monitoring',
    desc: 'The batch status is set to "In Transit". The smart contract holds funds in escrow, awaiting delivery confirmation.',
  },
  {
    step: '03',
    title: 'Delivery & Reconciliation',
    desc: 'On arrival, the delivered volume is recorded. Any discrepancy automatically emits a TheftAlert event to all listeners.',
  },
  {
    step: '04',
    title: 'Trustless Settlement',
    desc: 'If volumes match, USDC is released from the treasury to the transporter. Disputes are handled by the contract, not humans.',
  },
];

export const HowItWorks = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  const numberVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.4 },
    },
  };

  return (
    <section id="how" className="py-28 px-6 bg-slate-900/40 border-y border-slate-800 relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/5 rounded-full blur-[80px]" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-3"
        >
          <p className="text-blue-500 text-sm font-semibold tracking-widest uppercase">Process</p>
          <h2 className="text-4xl font-bold">How CrudeTrace Works</h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="space-y-0 relative"
        >
          {/* Connecting line */}
          <div className="absolute left-7 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-500/60 via-blue-500/30 to-transparent" />

          {steps.map((s) => (
            <motion.div
              key={s.step}
              variants={stepVariants}
              className="flex gap-6 items-start group relative"
            >
              <motion.div
                variants={numberVariants}
                whileHover={{ scale: 1.15 }}
                className="flex-shrink-0 w-14 h-14 rounded-2xl bg-blue-600/10 border-2 border-blue-500/40 flex items-center justify-center font-mono text-blue-400 text-sm font-bold hover:bg-blue-600/20 transition-colors z-10 shadow-lg shadow-blue-900/20"
              >
                {s.step}
              </motion.div>
              <div className="pt-3 pb-8 border-b border-slate-800/50 flex-1 last:border-0 last:pb-0">
                <h3 className="text-lg font-bold mb-2 group-hover:text-blue-300 transition-colors">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
