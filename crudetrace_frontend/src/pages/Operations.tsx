import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useContract } from '../hooks/useContract';
import { Card, CardHeader, CardTitle, CardContent } from '../components/UI';
import { Droplet, Truck, Settings2 } from 'lucide-react';

export const Operations = () => {
  const { crudeTrace } = useContract();
  
  // Wellhead Form State
  const [whBatchId, setWhBatchId] = useState('');
  const [whVolume, setWhVolume] = useState('');
  const [whValue, setWhValue] = useState('');
  const [whLoading, setWhLoading] = useState(false);

  // Terminal Form State
  const [termBatchId, setTermBatchId] = useState('');
  const [termVolume, setTermVolume] = useState('');
  const [termLoading, setTermLoading] = useState(false);

  // Automation Override State
  const [autoBatchId, setAutoBatchId] = useState('');
  const [autoLoading, setAutoLoading] = useState(false);

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crudeTrace) return;
    try {
      setWhLoading(true);
      const valueWei = ethers.parseUnits(whValue, 18);
      const tx = await crudeTrace.logExtraction(whBatchId, whVolume, valueWei);
      await tx.wait();
      alert(`Batch ${whBatchId} successfully logged at Wellhead!`);
      setWhBatchId(''); setWhVolume(''); setWhValue('');
    } catch (err: any) {
      console.error(err);
      alert(err.reason || "Extraction failed. Check Oracle Roles.");
    } finally {
      setWhLoading(false);
    }
  };

  const handleDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crudeTrace) return;
    try {
      setTermLoading(true);
      const tx = await crudeTrace.logDelivery(termBatchId, termVolume);
      await tx.wait();
      alert(`Delivery for Batch ${termBatchId} successfully logged!`);
      setTermBatchId(''); setTermVolume('');
    } catch (err: any) {
      console.error(err);
      alert(err.reason || "Delivery failed. Check Oracle Roles.");
    } finally {
      setTermLoading(false);
    }
  };

  const handleSettle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crudeTrace) return;
    try {
      setAutoLoading(true);
      const tx = await crudeTrace.distributeRoyalties(autoBatchId);
      await tx.wait();
      alert(`Royalties manually distributed for Batch ${autoBatchId}!`);
      setAutoBatchId('');
    } catch (err: any) {
      console.error(err);
      alert(err.reason || "Settlement failed.");
    } finally {
      setAutoLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">IoT Operations & Simulator</h2>
      <p className="text-slate-400 max-w-2xl">Use these panels to manually simulate IoT sensor payloads from the field nodes (Wellhead and Receiving Terminals).</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-t-4 border-t-blue-500">
          <CardHeader className="bg-slate-900/50">
            <div className="flex items-center gap-3">
              <Droplet className="text-blue-500 w-6 h-6" />
              <CardTitle>Wellhead Sensor Console</CardTitle>
            </div>
            <p className="text-sm text-slate-400 mt-1">Requires <span className="font-mono text-xs text-blue-400">WELLHEAD_ORACLE</span> role</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleExtract} className="space-y-4 mt-2">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Batch ID</label>
                <input required type="number" value={whBatchId} onChange={e => setWhBatchId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Barrels Loaded</label>
                <input required type="number" value={whVolume} onChange={e => setWhVolume(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 1000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Batch USD Value</label>
                <input required type="number" value={whValue} onChange={e => setWhValue(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 75000" />
              </div>
              <button disabled={whLoading} type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg transition disabled:opacity-50">
                {whLoading ? 'Executing...' : 'Simulate Sensor Payload'}
              </button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-emerald-500">
          <CardHeader className="bg-slate-900/50">
            <div className="flex items-center gap-3">
              <Truck className="text-emerald-500 w-6 h-6" />
              <CardTitle>Terminal Sensor Console</CardTitle>
            </div>
            <p className="text-sm text-slate-400 mt-1">Requires <span className="font-mono text-xs text-emerald-400">TERMINAL_ORACLE</span> role</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDelivery} className="space-y-4 mt-2">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Batch ID</label>
                <input required type="number" value={termBatchId} onChange={e => setTermBatchId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. 1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Barrels Received</label>
                <input required type="number" value={termVolume} onChange={e => setTermVolume(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. 990" />
              </div>
              <button disabled={termLoading} type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 rounded-lg transition disabled:opacity-50 mt-4">
                {termLoading ? 'Executing...' : 'Confirm Delivery'}
              </button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-purple-500 lg:col-span-2">
          <CardHeader className="bg-slate-900/50">
            <div className="flex items-center gap-3">
              <Settings2 className="text-purple-500 w-6 h-6" />
              <CardTitle>Manual Settlement Override</CardTitle>
            </div>
            <p className="text-sm text-slate-400 mt-1">Requires <span className="font-mono text-xs text-purple-400">AUTOMATION_ROLE</span> (Fallback for Kwala timeouts)</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSettle} className="flex items-end gap-4 mt-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-300 mb-1">Batch ID</label>
                <input required type="number" value={autoBatchId} onChange={e => setAutoBatchId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 outline-none" placeholder="e.g. 1" />
              </div>
              <button disabled={autoLoading} type="submit" className="w-48 bg-purple-600 hover:bg-purple-500 text-white font-medium py-2 rounded-lg transition disabled:opacity-50">
                {autoLoading ? 'Executing...' : 'Settle Batch'}
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
