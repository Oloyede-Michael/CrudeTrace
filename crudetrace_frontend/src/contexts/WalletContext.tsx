import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

declare global {
  interface Window {
    ethereum?: any;
  }
}
import { ethers } from 'ethers';

// Sepolia Chain ID is 11155111
const TARGET_CHAIN_ID = 11155111n;

interface WalletContextType {
  address: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask to use this application.');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      
      const accounts = await browserProvider.send('eth_requestAccounts', []);
      if (accounts.length > 0) {
        const network = await browserProvider.getNetwork();
        
        if (network.chainId !== TARGET_CHAIN_ID) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0xaa36a7' }], // Hex for 11155111
            });
          } catch (switchError: any) {
            setError('Please switch to the Sepolia testnet to continue.');
            setIsConnecting(false);
            return;
          }
        }
        
        const newSigner = await browserProvider.getSigner();
        setAddress(accounts[0]);
        setProvider(browserProvider);
        setSigner(newSigner);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          // Re-instantiate provider and signer
          const browserProvider = new ethers.BrowserProvider(window.ethereum);
          browserProvider.getSigner().then(setSigner);
          setProvider(browserProvider);
        } else {
          setAddress(null);
          setSigner(null);
          setProvider(null);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
    
    // Auto-connect if allowed
    const checkConnection = async () => {
      if (window.ethereum) {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        try {
          const accounts = await browserProvider.send('eth_accounts', []);
          if (accounts.length > 0) {
            await connectWallet();
          }
        } catch (e) {
          // Ignore
        }
      }
    };
    checkConnection();
  }, []);

  return (
    <WalletContext.Provider value={{ address, provider, signer, isConnecting, error, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
