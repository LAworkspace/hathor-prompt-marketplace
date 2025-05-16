import React from 'react';
import { useState } from 'react';
import { useWallet } from '../context/WalletContext';

export default function WalletConnect() {
  const { isConnected, address, balance, connectWallet, disconnectWallet } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      await connectWallet();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsDisconnecting(true);
      await disconnectWallet();
      // Clear the address logic should be handled in the WalletContext
      // Reset the balance logic should be handled in the context if needed
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 rounded-lg border border-gray-700 bg-gray-800">
      <h3 className="text-xl font-bold mb-4">Hathor Wallet</h3>

      {isConnected ? (
        <div className="w-full">
          <div className="mb-4">
            <p className="text-sm text-gray-400">Connected Address:</p>
            <p className="text-sm font-mono break-all">{address || 'N/A'}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-400">Balance:</p>
            <p className="text-lg font-bold">{balance ?? 0} HTR</p>
          </div>

          <button
            onClick={handleDisconnect}
            disabled={isDisconnecting}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded-md text-white"
          >
            {isDisconnecting ? 'Disconnecting...' : 'Disconnect Wallet'}
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-md text-white"
        >
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  );
}