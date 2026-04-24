import { MessageCircle, Webhook, Radio } from 'lucide-react';

export const Web2Integration = () => {
  return (
    <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-slate-900/50 to-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Web2 API Engine</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Real-time notifications bridge Web3 smart contracts with Web2 communication channels
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Telegram Bot */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 hover:border-blue-500/50 transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <MessageCircle className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold">Telegram Notifications</h3>
            </div>
            <p className="text-slate-400 mb-6">
              Instant alerts on supply chain events without visiting the dashboard
            </p>
            <div className="space-y-3">
              <p className="text-sm text-slate-300">
                <span className="font-mono bg-slate-900 px-2 py-1 rounded">🚨 Theft Detection</span>
              </p>
              <p className="text-sm text-slate-300">
                <span className="font-mono bg-slate-900 px-2 py-1 rounded">📦 Batch Extraction</span>
              </p>
              <p className="text-sm text-slate-300">
                <span className="font-mono bg-slate-900 px-2 py-1 rounded">✅ Delivery Confirmed</span>
              </p>
            </div>
          </div>

          {/* Webhooks */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 hover:border-emerald-500/50 transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-500/20 p-3 rounded-lg">
                <Webhook className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold">Webhook API</h3>
            </div>
            <p className="text-slate-400 mb-6">
              Enterprise system integration for ERP and monitoring tools
            </p>
            <div className="space-y-3">
              <p className="text-sm text-slate-300">
                <span className="font-mono bg-slate-900 px-2 py-1 rounded">POST /webhook/alert</span>
              </p>
              <p className="text-sm text-slate-300">
                <span className="font-mono bg-slate-900 px-2 py-1 rounded">Custom payloads</span>
              </p>
              <p className="text-sm text-slate-300">
                <span className="font-mono bg-slate-900 px-2 py-1 rounded">GET /health</span>
              </p>
            </div>
          </div>

          {/* WebSocket */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 hover:border-purple-500/50 transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <Radio className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold">WebSocket Streaming</h3>
            </div>
            <p className="text-slate-400 mb-6">
              Real-time event broadcasting to connected clients
            </p>
            <div className="space-y-3">
              <p className="text-sm text-slate-300">
                <span className="font-mono bg-slate-900 px-2 py-1 rounded">ws://localhost:8080</span>
              </p>
              <p className="text-sm text-slate-300">
                <span className="font-mono bg-slate-900 px-2 py-1 rounded">Live alerts</span>
              </p>
              <p className="text-sm text-slate-300">
                <span className="font-mono bg-slate-900 px-2 py-1 rounded">Sub-second latency</span>
              </p>
            </div>
          </div>
        </div>

        {/* How to Access */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-6">Access the Telegram Bot</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-blue-400 mb-3">For Testing:</h4>
              <ol className="space-y-2 text-slate-300">
                <li className="flex gap-3">
                  <span className="text-blue-400">1.</span>
                  <span>Start the notifier service locally</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400">2.</span>
                  <span>Find <span className="font-mono">@crudetrace_alert_bot</span> on Telegram</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400">3.</span>
                  <span>Send <span className="font-mono">/start</span> to begin</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400">4.</span>
                  <span>Create batches and receive alerts</span>
                </li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold text-emerald-400 mb-3">Available Commands:</h4>
              <div className="space-y-2 font-mono text-sm">
                <p className="text-slate-300"><span className="text-emerald-400">/start</span> - Welcome & feature list</p>
                <p className="text-slate-300"><span className="text-emerald-400">/status</span> - Service status check</p>
                <p className="text-slate-300"><span className="text-emerald-400">/subscribe</span> - Receive alerts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 mb-4">Built with proven Web2 technologies</p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 bg-slate-800 rounded-full text-sm text-slate-300">Node.js</span>
            <span className="px-4 py-2 bg-slate-800 rounded-full text-sm text-slate-300">Express</span>
            <span className="px-4 py-2 bg-slate-800 rounded-full text-sm text-slate-300">Telegram Bot API</span>
            <span className="px-4 py-2 bg-slate-800 rounded-full text-sm text-slate-300">WebSocket</span>
            <span className="px-4 py-2 bg-slate-800 rounded-full text-sm text-slate-300">REST API</span>
          </div>
        </div>
      </div>
    </section>
  );
};
