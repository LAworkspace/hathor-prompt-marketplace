// Service for interacting with the Hathor blockchain
import { HathorWallet } from '@hathor/wallet-lib';
import { walletStorage, HATHOR_CONFIG } from './hathorConfig';

let wallet: any = null;
let isStarted = false;

/**
 * Initialize the Hathor wallet library
 */
export function initHathorWallet(): void {
  // Initialize the library configuration
  HathorWallet.setNetwork(HATHOR_CONFIG.network);
  HathorWallet.setServerUrl(HATHOR_CONFIG.serverUrl);
  HathorWallet.setWebsocketUrl(HATHOR_CONFIG.websocketUrl);
  HathorWallet.storage.setStore(walletStorage);
}

/**
 * Create and start a new wallet
 */
export async function startWallet(seed?: string): Promise<void> {
  try {
    if (isStarted) {
      console.log('Wallet already started');
      return;
    }

    const walletId = seed || HathorWallet.generateWalletId();
    
    // Create a new wallet instance
    wallet = new HathorWallet({
      seed: walletId,
      password: '',
      network: HATHOR_CONFIG.network
    });
    
    // Start the wallet
    await wallet.start();
    isStarted = true;
    console.log('Wallet started successfully');
  } catch (error) {
    console.error('Error starting wallet:', error);
    throw error;
  }
}

/**
 * Get the current wallet's main address
 */
export async function getWalletAddress(): Promise<string> {
  if (!wallet || !isStarted) {
    throw new Error('Wallet not initialized');
  }
  
  return wallet.getAddresses()[0].address;
}

/**
 * Get the current wallet's balance
 */
export async function getWalletBalance(): Promise<{available: number, locked: number}> {
  if (!wallet || !isStarted) {
    throw new Error('Wallet not initialized');
  }
  
  const balance = await wallet.getBalance();
  return {
    available: balance.available,
    locked: balance.locked
  };
}

/**
 * Stop the wallet when not needed
 */
export function stopWallet(): void {
  if (wallet && isStarted) {
    wallet.stop();
    isStarted = false;
    console.log('Wallet stopped');
  }
}