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
  return (
    <section id="how" className="py-28 px-6 bg-slate-900/40 border-y border-slate-800">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <p className="text-blue-500 text-sm font-semibold tracking-widest uppercase">Process</p>
          <h2 className="text-4xl font-bold">How CrudeTrace Works</h2>
        </div>

        <div className="space-y-6">
          {steps.map((s) => (
            <div key={s.step} className="flex gap-6 items-start group">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center font-mono text-blue-400 text-sm font-bold group-hover:bg-blue-600/20 transition-colors">
                {s.step}
              </div>
              <div className="pt-2 pb-6 border-b border-slate-800 flex-1 last:border-0">
                <h3 className="text-lg font-bold mb-1">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};