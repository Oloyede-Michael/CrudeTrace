import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'How does the theft detection work?',
    a: 'CrudeTrace continuously reconciles loaded vs delivered volumes using on-chain data. Any discrepancy above a configurable threshold automatically triggers a TheftAlert event, notifying all authorized parties instantly.',
  },
  {
    q: 'Is my data secure on the blockchain?',
    a: 'Yes. All sensitive volume and financial data is stored on Ethereum mainnet with enterprise-grade encryption. Smart contracts are audited by leading firms and immutable once deployed.',
  },
  {
    q: 'How are payments settled?',
    a: 'USDC is held in a secure smart contract treasury upon batch creation. Upon successful delivery verification, funds are automatically released to the transporter—no manual intervention required.',
  },
  {
    q: 'Can CrudeTrace integrate with our existing logistics software?',
    a: 'Absolutely. CrudeTrace provides REST APIs, webhooks, and GraphQL endpoints. We offer SDKs for Node.js, Python, and Go, plus support for custom integrations.',
  },
  {
    q: 'What blockchain does CrudeTrace use?',
    a: 'We operate on Ethereum Mainnet for maximum security and auditability. For high-volume operations, we also support Layer 2 solutions (Arbitrum, Optimism) to reduce gas costs.',
  },
  {
    q: 'Is there a minimum commitment?',
    a: 'No. The Starter plan is free forever. You can upgrade to Professional or Enterprise as your needs grow. Cancel anytime.',
  },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-28 px-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 space-y-3"
      >
        <p className="text-blue-500 text-sm font-semibold tracking-widest uppercase">FAQ</p>
        <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>
      </motion.div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors"
              aria-expanded={openIndex === idx}
            >
              <span className="font-semibold text-white pr-4">{faq.q}</span>
              <motion.div
                animate={{ rotate: openIndex === idx ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                <ChevronDown size={20} className="text-blue-400" />
              </motion.div>
            </button>

            <AnimatePresence>
              {openIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="px-6 pb-5 text-slate-400 leading-relaxed">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
