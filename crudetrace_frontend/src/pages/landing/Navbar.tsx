import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-[#0b1120]/80 backdrop-blur-md border-b border-slate-800/60">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <polyline
            points="2,20 8,10 14,15 20,6 24,9"
            stroke="#3b82f6"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-xl font-bold tracking-tight text-white">
          Crude<span className="text-blue-500">Trace</span>
        </span>
      </div>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
        <a href="#features" className="hover:text-white transition-colors">Features</a>
        <a href="#how" className="hover:text-white transition-colors">How It Works</a>
        <a href="#stats" className="hover:text-white transition-colors">Network</a>
      </div>

      {/* CTA Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-blue-900/40 hover:shadow-blue-700/50 hover:-translate-y-px active:translate-y-0"
      >
        Continue to Dashboard
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </nav>
  );
};