import React, { createContext, useContext, useState } from 'react';
import { WalletConnection } from '../types';

interface Web3ContextType {
  wallet: WalletConnection;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  makePayment: (amount: number, recipient: string) => Promise<string | null>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletConnection>({
    isConnected: false,
  });

  const connectWallet = async (): Promise<boolean> => {
    // Simulate MetaMask connection
    try {
      // In a real app, this would use: await window.ethereum.request({ method: 'eth_requestAccounts' })
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockWallet: WalletConnection = {
        isConnected: true,
        address: '0x742d35cc6bf8532c4ea4b23e5dd6b6b50c00e9cd',
        balance: 0.5,
        network: 'Ethereum Mainnet',
      };
      
      setWallet(mockWallet);
      return true;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return false;
    }
  };

  const disconnectWallet = () => {
    setWallet({ isConnected: false });
  };

  const makePayment = async (amount: number, recipient: string): Promise<string | null> => {
    if (!wallet.isConnected) {
      throw new Error('Wallet not connected');
    }

    // Simulate blockchain transaction
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock transaction hash
      const txHash = '0x' + Math.random().toString(16).substring(2, 66);
      
      // Update wallet balance
      setWallet(prev => ({
        ...prev,
        balance: (prev.balance || 0) - amount,
      }));
      
      return txHash;
    } catch (error) {
      console.error('Payment failed:', error);
      return null;
    }
  };

  return (
    <Web3Context.Provider value={{
      wallet,
      connectWallet,
      disconnectWallet,
      makePayment,
    }}>
      {children}
    </Web3Context.Provider>
  );
};