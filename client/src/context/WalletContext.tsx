import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { initHathorWallet, startWallet, getWalletAddress, getWalletBalance, stopWallet } from '../lib/hathorService';

// Define the context type
type WalletContextType = {
  isConnected: boolean;
  address: string | null;
  balance: number;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshBalance: () => Promise<void>;
};

// Create the context with default values
const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  address: null,
  balance: 0,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  refreshBalance: async () => {},
});

// WebSocket message type
type WebSocketMessage = {
  type: string;
  data?: any;
};

// Provider component for the wallet context
export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Initialize wallet on component mount
  useEffect(() => {
    const initializeWallet = async () => {
      try {
        initHathorWallet();

        // Check if wallet was previously connected
        const savedAddress = localStorage.getItem('walletAddress');
        if (savedAddress) {
          await connectWallet();
        }

        // WebSocket for real-time updates
        const webSocket = new WebSocket('ws://' + window.location.host + '/ws');
        setWs(webSocket);

        webSocket.onmessage = (event) => {
          const message = JSON.parse(event.data) as WebSocketMessage;
          handleWebSocketMessage(message);
        };

        webSocket.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        webSocket.onclose = () => {
          console.log('WebSocket connection closed.');
        };
      } catch (error) {
        console.error('Error initializing wallet:', error);
      }
    };

    initializeWallet();

    return () => {
      // Clean up on unmount
      if (ws) {
        ws.close();
      }
      disconnectWallet();
    };
  }, [ws]);

  // Handle WebSocket messages
  const handleWebSocketMessage = (message: WebSocketMessage) => {
    if (message.type === 'balance_update' && isConnected) {
      refreshBalance();
    }
  };

  // Connect wallet and get address
  const connectWallet = async () => {
    try {
      await startWallet();
      const addr = await getWalletAddress();
      setAddress(addr);
      setIsConnected(true);
      localStorage.setItem('walletAddress', addr);

      // Get initial balance
      await refreshBalance();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setIsConnected(false);
      setAddress(null);
      setBalance(0); // Reset balance on failure
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    try {
      stopWallet();
      setIsConnected(false);
      setAddress(null);
      setBalance(0);
      localStorage.removeItem('walletAddress');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  // Refresh wallet balance
  const refreshBalance = async () => {
    if (!isConnected) return;

    try {
      const balanceInfo = await getWalletBalance();
      setBalance(balanceInfo.available);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        balance,
        connectWallet,
        disconnectWallet,
        refreshBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

// Hook for using the wallet context
export function useWallet() {
  return useContext(WalletContext);
}