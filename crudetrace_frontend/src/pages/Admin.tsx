import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useContract } from '../hooks/useContract';
import { Card, CardHeader, CardTitle, CardContent } from '../components/UI';
import { Shield, Key, PowerOff, Power, DollarSign } from 'lucide-react';

export const Admin = () => {
  const { crudeTrace, mockUSDC } = useContract();
  
  const [addressToFund, setAddressToFund] = useState('');
  const [fundAmount, setFundAmount] = useState('');
  const [fundLoading, setFundLoading] = useState(false);

  const [roleAddress, setRoleAddress] = useState('');
  const [selectedRole, setSelectedRole] = useState('WELLHEAD_ORACLE');
  const [roleLoading, setRoleLoading] = useState(false);

  const [isPaused, setIsPaused] = useState(false);
  const [pauseLoading, setPauseLoading] = useState(false);

  useEffect(() => {
    const fetchPause = async () => {
      if (crudeTrace) {
        setIsPaused(await crudeTrace.paused());
        // Auto-fetch Crudetrace address for funding default
        setAddressToFund(await crudeTrace.getAddress());
      }
    };
    fetchPause();
  }, [crudeTrace]);

  const handleFund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mockUSDC) return;
    try {
      setFundLoading(true);
      const amountWei = ethers.parseUnits(fundAmount, 18);
      const tx = await mockUSDC.transfer(addressToFund, amountWei);
      await tx.wait();
      alert(`Successfully sent ${fundAmount} USDC to ${addressToFund}`);
      setFundAmount('');
    } catch (err: any) {
      console.error(err);
      alert(err.reason || "Funding failed. Do you have USDC?");
    } finally {
      setFundLoading(false);
    }
  };

  const handleRoleAction = async (action: 'grant' | 'revoke') => {
    if (!crudeTrace || !roleAddress) return;
    try {
      setRoleLoading(true);
      
      const roleBytes = await crudeTrace[selectedRole]();
      const tx = action === 'grant' 
        ? await crudeTrace.grantRole(roleBytes, roleAddress)
        : await crudeTrace.revokeRole(roleBytes, roleAddress);
        
      await tx.wait();
      alert(`Role ${selectedRole} successfully ${action}ed for ${roleAddress}`);
      setRoleAddress('');
    } catch (err: any) {
      console.error(err);
      alert(err.reason || `Failed to ${action} role. Are you ADMIN?`);
    } finally {
      setRoleLoading(false);
    }
  };

  const togglePause = async () => {
    if (!crudeTrace) return;
    try {
      setPauseLoading(true);
      const tx = isPaused ? await crudeTrace.unpause() : await crudeTrace.pause();
      await tx.wait();
      setIsPaused(!isPaused);
      alert(isPaused ? "Contract Unpaused." : "Contract Paused.");
    } catch (err: any) {
      console.error(err);
      alert(err.reason || "Failed to toggle pause. Are you ADMIN?");
    } finally {
      setPauseLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="text-slate-400" /> Admin & Treasury Control
        </h2>
        <p className="text-slate-400 max-w-2xl mt-1">Manage system access, fund the smart contract, and control emergency protocols.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Key className="text-blue-500 w-6 h-6" />
              <CardTitle>Access Control Panel</CardTitle>
            </div>
            <p className="text-sm text-slate-400 mt-1">Requires DEFAULT_ADMIN_ROLE</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Ethereum Address</label>
                <input type="text" value={roleAddress} onChange={e => setRoleAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0x..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="WELLHEAD_ORACLE">WELLHEAD_ORACLE</option>
                  <option value="TERMINAL_ORACLE">TERMINAL_ORACLE</option>
                  <option value="AUTOMATION_ROLE">AUTOMATION_ROLE</option>
                </select>
              </div>
              <div className="flex gap-4 mt-4">
                <button disabled={roleLoading || !roleAddress} onClick={() => handleRoleAction('grant')}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg transition disabled:opacity-50">
                  Grant Role
                </button>
                <button disabled={roleLoading || !roleAddress} onClick={() => handleRoleAction('revoke')}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 rounded-lg transition disabled:opacity-50">
                  Revoke Role
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className={isPaused ? "border border-red-500" : ""}>
            <CardHeader>
              <div className="flex items-center gap-3">
                {isPaused ? <PowerOff className="text-red-500 w-6 h-6" /> : <Power className="text-emerald-500 w-6 h-6" />}
                <CardTitle>Emergency Kill Switch</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Status: {isPaused ? <span className="text-red-500">PAUSED</span> : <span className="text-emerald-500">ACTIVE</span>}</p>
                  <p className="text-sm text-slate-400 mt-1">Freezes/Unfreezes all operations.</p>
                </div>
                <button 
                  disabled={pauseLoading}
                  onClick={togglePause}
                  className={`px-6 py-2 rounded-lg font-medium transition disabled:opacity-50 ${isPaused ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}
                >
                  {isPaused ? 'Resume Operations' : 'Trigger Kill Switch'}
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <DollarSign className="text-emerald-500 w-6 h-6" />
                <CardTitle>Fund Contract Treasury</CardTitle>
              </div>
              <p className="text-sm text-slate-400 mt-1">Send MockUSDC to the CrudeTrace contract.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFund} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Destination</label>
                  <input readOnly type="text" value={addressToFund}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-500 rounded-lg px-4 py-2 outline-none font-mono text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Amount (USDC)</label>
                  <input required type="number" value={fundAmount} onChange={e => setFundAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-emerald-500" placeholder="50000" />
                </div>
                <button disabled={fundLoading} type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 rounded-lg transition disabled:opacity-50">
                  {fundLoading ? 'Funding...' : 'Send USDC'}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};