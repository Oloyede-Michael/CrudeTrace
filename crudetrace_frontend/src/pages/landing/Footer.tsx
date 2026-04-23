import { useNavigate } from 'react-router-dom';

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-slate-800 px-8 py-10">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
            <polyline
              points="2,20 8,10 14,15 20,6 24,9"
              stroke="#3b82f6"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-bold text-white tracking-tight">
            Crude<span className="text-blue-500">Trace</span>
          </span>
        </div>

        <p className="text-slate-600 text-xs text-center">
          © {new Date().getFullYear()} CrudeTrace. All rights reserved. Powered by Ethereum smart contracts.
        </p>

        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center gap-1.5"
        >
          Open Dashboard
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </footer>
  );
};