import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useContract } from '../hooks/useContract';

import { Card, CardHeader, CardTitle, CardContent, Alert } from '../components/UI';
import { ShieldAlert, DollarSign, Database, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const Dashboard = () => {
  const { crudeTrace, mockUSDC } = useContract();
  
  const [treasuryBalance, setTreasuryBalance] = useState('0');
  const [totalBatches, setTotalBatches] = useState(0);
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

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
      
      // We assume there's a limit or we can try fetching batches 1-5 for the chart
      // In a real app we might track batch count via a counter variable in the contract, 
      // but assuming we guess there are some initial batches created.
      const mockData = [
        { name: 'Batch 1', loaded: 1000, delivered: 990 },
        { name: 'Batch 2', loaded: 2000, delivered: 1950 },
        { name: 'Batch 3', loaded: 1500, delivered: 1500 },
        { name: 'Batch 4', loaded: 3000, delivered: 2800 },
        { name: 'Batch 5', loaded: 1200, delivered: 1200 },
      ];
      setChartData(mockData);
      setTotalBatches(5);
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
                <p className="text-sm font-medium text-slate-400">Total Batches Processed</p>
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
              <p className="text-slate-400 text-sm text-center py-8">No current security alerts.</p>
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
    </div>
  );
};
