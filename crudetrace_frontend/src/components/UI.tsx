import type { ReactNode } from 'react';

export const Card = ({ children, className = '' }: { children: ReactNode, className?: string }) => {
  return (
    <div className={`bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }: { children: ReactNode, className?: string }) => (
  <div className={`px-6 py-4 border-b border-slate-700 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }: { children: ReactNode, className?: string }) => (
  <h3 className={`text-lg font-medium text-white ${className}`}>
    {children}
  </h3>
);

export const CardContent = ({ children, className = '' }: { children: ReactNode, className?: string }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const Alert = ({ children, type = 'info', className = '' }: { children: ReactNode, type?: 'info' | 'success' | 'warning' | 'error', className?: string }) => {
  const bgColors = {
    info: 'bg-blue-900/50 border-blue-500/50 text-blue-200',
    success: 'bg-emerald-900/50 border-emerald-500/50 text-emerald-200',
    warning: 'bg-amber-900/50 border-amber-500/50 text-amber-200',
    error: 'bg-red-900/50 border-red-500/50 text-red-200'
  };

  return (
    <div className={`border rounded-lg p-4 flex items-center ${bgColors[type]} ${className}`}>
      {children}
    </div>
  );
};
