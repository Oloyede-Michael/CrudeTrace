const stats = [
  { value: '$90K+', label: 'Treasury Secured' },
  { value: '100%', label: 'On-Chain Auditability' },
  { value: '<1s',  label: 'Alert Latency' },
  { value: '0',    label: 'Trusted Intermediaries' },
];

export const Stats = () => {
  return (
    <section id="stats" className="py-28 px-6 max-w-5xl mx-auto text-center">
      <p className="text-blue-500 text-sm font-semibold tracking-widest uppercase mb-12">
        Network at a Glance
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s) => (
          <div key={s.label} className="space-y-2">
            <div className="text-4xl font-extrabold text-blue-400 tabular-nums">{s.value}</div>
            <div className="text-slate-500 text-sm">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};