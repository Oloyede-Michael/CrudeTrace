import { useMemo } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../contexts/WalletContext';
import { CONTRACT_ADDRESSES, CRUDE_TRACE_ABI, MOCK_USDC_ABI } from '../config/contracts';

export const useContract = () => {
  const { provider, signer } = useWallet();

  const crudeTrace = useMemo(() => {
    if (!provider) return null;
    return new ethers.Contract(CONTRACT_ADDRESSES.CRUDE_TRACE, CRUDE_TRACE_ABI, signer || provider);
  }, [provider, signer]);

  const mockUSDC = useMemo(() => {
    if (!provider) return null;
    return new ethers.Contract(CONTRACT_ADDRESSES.MOCK_USDC, MOCK_USDC_ABI, signer || provider);
  }, [provider, signer]);

  return { crudeTrace, mockUSDC };
};
