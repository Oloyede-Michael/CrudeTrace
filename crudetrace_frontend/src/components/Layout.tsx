import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { useContract } from '../hooks/useContract';
import { Activity, ShieldAlert, BarChart3, Settings, Wallet } from 'lucide-react';

export const Layout = () => {
  const { address, connectWallet, isConnecting } = useWallet();
  const { crudeTrace } = useContract();
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const checkPaused = async () => {
      if (crudeTrace) {
        try {
          const paused = await crudeTrace.paused();
          setIsPaused(paused);
        } catch (err) {
          console.error("Failed to check pause status", err);
        }
      }
    };
    checkPaused();

    if (crudeTrace) {
      crudeTrace.on("Paused", () => setIsPaused(true));
      crudeTrace.on("Unpaused", () => setIsPaused(false));
      return () => {
        crudeTrace.removeAllListeners("Paused");
        crudeTrace.removeAllListeners("Unpaused");
      };
    }
  }, [crudeTrace]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-900 text-slate-200">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-slate-700">
          <Activity className="text-blue-500 h-8 w-8" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            CrudeTrace
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 border border-blue-500 text-white' : 'hover:bg-slate-700 text-slate-300'}`
            }
          >
            <BarChart3 className="h-5 w-5" />
            Dashboard
          </NavLink>
          <NavLink
            to="/dashboard/operations"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 border border-blue-500 text-white' : 'hover:bg-slate-700 text-slate-300'}`
            }
          >
            <Activity className="h-5 w-5" />
            Operations
          </NavLink>
          <NavLink
            to="/dashboard/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 border border-blue-500 text-white' : 'hover:bg-slate-700 text-slate-300'}`
            }
          >
            <Settings className="h-5 w-5" />
            Admin & Treasury
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-700">
          {address ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-lg border border-slate-700 text-sm">
              <Wallet className="h-4 w-4 text-emerald-500" />
              <span className="truncate tabular-nums">{address.slice(0, 6)}...{address.slice(-4)}</span>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
            >
              <Wallet className="h-4 w-4" />
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {isPaused && (
          <div className="bg-red-500 text-white px-6 py-3 flex items-center justify-center gap-2 font-medium shrink-0 animate-pulse">
            <ShieldAlert className="h-5 w-5" />
            SYSTEM PAUSED: Operations Suspended (Kill Switch Active)
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
          <Outlet />
        </div>
      </main>
    </div>
  );
};