import { useNavigate } from 'react-router-dom';

export const Footer = () => {
  const navigate = useNavigate();

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#how' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'FAQ', href: '#faq' },
    ],
    company: [
      { label: 'About Us', href: '#' },
      { label: 'Contact', href: 'mailto:contact@crudetrace.io' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  };

  return (
    <footer className="border-t border-slate-800 px-6 py-16 bg-slate-900/40">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
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
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
              Blockchain-powered supply chain security for the petroleum industry. Trace every barrel, detect theft, automate settlements.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-blue-400">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.querySelector(link.href);
                      if (el) {
                        const offset = 80;
                        window.scrollTo({
                          top: (el as HTMLElement).offsetTop - offset,
                          behavior: 'smooth',
                        });
                      }
                    }}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-blue-400">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('mailto:') ? (
                    <a href={link.href} className="text-slate-400 hover:text-white transition-colors text-sm">
                      {link.label}
                    </a>
                  ) : (
                    <span className="text-slate-500 text-sm cursor-default">{link.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-blue-400">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-slate-400 hover:text-white transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-800">
          <p className="text-slate-600 text-xs text-center">
            © {new Date().getFullYear()} CrudeTrace. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
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
        </div>
      </div>
    </footer>
  );
};