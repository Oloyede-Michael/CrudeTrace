import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useContract } from '../hooks/useContract';

import { Card, CardHeader, CardTitle, CardContent, Alert } from '../components/UI';
import { ShieldAlert, DollarSign, Database, AlertCircle, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const Dashboard = () => {
  const { crudeTrace, mockUSDC } = useContract();
  
  const [treasuryBalance, setTreasuryBalance] = useState('0');
  const [totalBatches, setTotalBatches] = useState(0);
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [allBatches, setAllBatches] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!crudeTrace || !mockUSDC) return;

      try {
        const traceAddress = await crudeTrace.getAddress();
        const bal = await mockUSDC.balanceOf(traceAddress);
        setTreasuryBalance(ethers.formatUnits(bal, 18));
      } catch (err) {
        console.error("Failed to fetch treasury bal:", err);
      }
      
      try {
        setIsLoading(true);
        // Query the blockchain for all BatchExtracted events to get precise Batch IDs
        const filter = crudeTrace.filters.BatchExtracted();
        const events = await crudeTrace.queryFilter(filter);
        
        // Extract unique IDs, converting to number
        const uniqueIds = Array.from(new Set(events.map((e: any) => Number(e.args[0]))));
        
        // Fetch full batch struct data for those specific IDs
        const batchPromises = uniqueIds.map(async (id: number) => {
          const batch = await crudeTrace.batches(id);
          const loaded = Number(batch.volumeLoaded);
          const delivered = Number(batch.volumeDelivered);
          return {
             id,
             name: `Batch ${id}`,
             loaded,
             delivered,
             deficit: loaded - delivered,
             value: ethers.formatUnits(batch.batchValue, 18),
             status: Number(batch.status)
          };
        });

        let validBatches = await Promise.all(batchPromises);
        validBatches = validBatches.filter(b => b.loaded > 0).sort((a, b) => b.id - a.id); // Descending

        setAllBatches(validBatches);
        setTotalBatches(validBatches.length);
        // Chart uses last 10 batches (reverse to chronological left-to-right)
        setChartData([...validBatches].slice(0, 10).reverse());
      } catch (err) {
        console.error("Failed to fetch batches:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();

    if (crudeTrace) {
      crudeTrace.on("TheftAlert", (batchId, volumeLost, message) => {
        setActiveAlerts(prev => [{
          id: Date.now(),
          batchId: Number(batchId),
          volumeLost: Number(volumeLost),
          message
        }, ...prev]);
      });

      return () => {
        crudeTrace.removeAllListeners("TheftAlert");
      };
    }
  }, [crudeTrace, mockUSDC]);

  const filteredBatches = allBatches.filter(b => 
    searchQuery === '' ? true : b.id.toString() === searchQuery
  );

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0: return <span className="px-2 py-1 bg-amber-500/20 text-amber-500 text-xs rounded-full font-medium">In Transit</span>;
      case 1: return <span className="px-2 py-1 bg-blue-500/20 text-blue-500 text-xs rounded-full font-medium">Delivered</span>;
      case 2: return <span className="px-2 py-1 bg-emerald-500/20 text-emerald-500 text-xs rounded-full font-medium">Settled</span>;
      default: return <span className="px-2 py-1 bg-slate-500/20 text-slate-500 text-xs rounded-full font-medium">Unknown</span>;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Platform Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Treasury Balance (USDC)</p>
                <h3 className="text-3xl font-bold mt-2 tabular-nums">
                  ${parseFloat(treasuryBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <DollarSign className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Batches Discovered</p>
                <h3 className="text-3xl font-bold mt-2 tabular-nums">{totalBatches}</h3>
              </div>
              <div className="bg-emerald-500/10 p-3 rounded-lg">
                <Database className="w-8 h-8 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Active Security Alerts</p>
                <h3 className="text-3xl font-bold mt-2 tabular-nums text-amber-500">{activeAlerts.length}</h3>
              </div>
              <div className="bg-amber-500/10 p-3 rounded-lg">
                <ShieldAlert className="w-8 h-8 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Volume Transported (Recent Batches)</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {isLoading ? (
               <div className="h-full flex items-center justify-center text-slate-400">Fetching live data from contract...</div>
            ) : chartData.length === 0 ? (
               <div className="h-full flex items-center justify-center text-slate-400">No batches logged yet. Go to Operations to simulate.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                  <Tooltip 
                    cursor={{ fill: '#334155', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  />
                  <Legend />
                  <Bar dataKey="loaded" name="Loaded (Bbl)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="delivered" name="Delivered (Bbl)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="text-amber-500 w-5 h-5" />
              <CardTitle>Security Stream</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 max-h-80 overflow-y-auto">
            {activeAlerts.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">No live security alerts.</p>
            ) : (
              activeAlerts.map(alert => (
                <Alert key={alert.id} type="warning" className="flex flex-col items-start gap-1">
                  <div className="font-semibold text-amber-500">Batch #{alert.batchId} Alert</div>
                  <div className="text-sm">Lost {alert.volumeLost} barrels. {alert.message}</div>
                </Alert>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-t-4 border-t-emerald-500">
        <CardHeader className="bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>Dynamic Batch Tracking Ledger</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Batch ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4 rounded-tl-lg">Batch ID</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Loaded (Bbl)</th>
                  <th className="px-6 py-4">Delivered (Bbl)</th>
                  <th className="px-6 py-4">Deficit / Missing</th>
                  <th className="px-6 py-4">Declared Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400 border-none">Loading batches from chain...</td>
                  </tr>
                ) : filteredBatches.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center border-none">
                      {searchQuery ? `No batch found for ID ${searchQuery}` : "No batches detected on chain."}
                    </td>
                  </tr>
                ) : (
                  filteredBatches.map(batch => (
                    <tr key={batch.id} className="hover:bg-slate-800/50 transition-colors group">
                      <td className="px-6 py-4 font-mono font-medium text-white break-words">#{batch.id}</td>
                      <td className="px-6 py-4">{getStatusBadge(batch.status)}</td>
                      <td className="px-6 py-4 tabular-nums">{batch.loaded}</td>
                      <td className="px-6 py-4 tabular-nums">
                        {batch.status > 0 ? batch.delivered : <span className="text-slate-500">-</span>}
                      </td>
                      <td className="px-6 py-4 tabular-nums">
                        {batch.status > 0 ? (
                           <div className="flex items-center gap-2">
                             <span className={batch.deficit > 0 ? 'text-amber-500 font-bold' : 'text-emerald-500'}>
                               {batch.deficit} Bbl
                             </span>
                             {batch.deficit > 0 && <span className="text-xs text-slate-500">(Missing)</span>}
                           </div>
                        ) : (
                           <span className="text-slate-500">Pending arrival...</span>
                        )}
                      </td>
                      <td className="px-6 py-4 tabular-nums">${parseFloat(batch.value).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
