import React, { useState } from 'react';
import { Route, Switch } from 'wouter';
import { WalletProvider } from './context/WalletContext';
import WalletConnect from './components/WalletConnect';

function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Hathor Prompt Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <p className="mb-4">
            This is a decentralized marketplace for AI prompts built on Hathor blockchain.
            Connect your wallet to start buying and selling prompts as NFTs with automatic royalty distribution.
          </p>
        </div>
        <div>
          <WalletConnect />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <Switch>
          <Route path="/" component={Home} />
        </Switch>
      </div>
    </WalletProvider>
  );
}