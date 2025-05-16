// Configuration for Hathor blockchain connection
import { HathorWallet } from '@hathor/wallet-lib';

// Define network type mapping
const networkMap = {
  'mainnet': 'mainnet',
  'testnet': 'testnet',
};

// Hathor server configuration
export const HATHOR_CONFIG = {
  // Network to use: 'mainnet' or 'testnet'
  network: 'testnet', 
  // Server URL to connect to
  serverUrl: 'https://node2.testnet.hathor.network/v1a/',
  // WebSocket URL for real-time updates
  websocketUrl: 'wss://node2.testnet.hathor.network/v1a/ws/',
};

/**
 * Initialize Hathor library
 * This should be called once when the application starts
 */
export function initializeHathor() {
  // Configure the Hathor Wallet library
  HathorWallet.setNetwork(networkMap[HATHOR_CONFIG.network]);
  HathorWallet.setServerUrl(HATHOR_CONFIG.serverUrl);
  HathorWallet.setWebsocketUrl(HATHOR_CONFIG.websocketUrl);
  
  console.log(`Hathor initialized with ${HATHOR_CONFIG.network} network`);
}

/**
 * Storage provider interface for Hathor wallet
 * This simple implementation uses localStorage for storing wallet data
 */
export const walletStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      return false;
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  },
};