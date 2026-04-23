const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    colorClass: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'hover:border-blue-500/40',
    },
    title: 'Theft Detection',
    desc: 'Real-time volume reconciliation emits on-chain TheftAlert events the moment a deficit is detected between loaded and delivered barrels.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    colorClass: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'hover:border-emerald-500/40',
    },
    title: 'Live Dashboard',
    desc: 'Query the blockchain directly for BatchExtracted events. Every batch, volume, and status lives permanently on-chain — no middlemen.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
    colorClass: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'hover:border-amber-500/40',
    },
    title: 'Automated Settlement',
    desc: 'USDC payments are held in a smart contract treasury and released automatically once delivery is verified — no disputes, no delays.',
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-28 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16 space-y-3">
        <p className="text-blue-500 text-sm font-semibold tracking-widest uppercase">Core Capabilities</p>
        <h2 className="text-4xl font-bold">Built for the Petroleum Supply Chain</h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          End-to-end traceability from extraction to delivery — with automatic anomaly detection and trustless settlement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className={`group p-6 rounded-2xl bg-slate-900/60 border border-slate-800 ${f.colorClass.border} transition-all duration-300 hover:-translate-y-1`}
          >
            <div className={`w-12 h-12 rounded-xl ${f.colorClass.bg} flex items-center justify-center ${f.colorClass.text} mb-5`}>
              {f.icon}
            </div>
            <h3 className="text-lg font-bold mb-2">{f.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};