// Server-side Hathor blockchain integration
import { HathorWallet } from '@hathor/wallet-lib';
import fs from 'fs';
import path from 'path';

// Define configuration
const NETWORK = 'testnet';
const SERVER_URL = 'https://node2.testnet.hathor.network/v1a/';
const WS_URL = 'wss://node2.testnet.hathor.network/v1a/ws/';
const WALLET_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(WALLET_DIR)) {
  fs.mkdirSync(WALLET_DIR, { recursive: true });
}

// File system storage for server-side wallet
const fileSystemStore = {
  getItem: (key: string) => {
    try {
      const filePath = path.join(WALLET_DIR, `${key}.json`);
      return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
    } catch (err) {
      console.error('Error reading wallet data:', err);
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      const filePath = path.join(WALLET_DIR, `${key}.json`);
      fs.writeFileSync(filePath, value, 'utf8');
      return true;
    } catch (err) {
      console.error('Error saving wallet data:', err);
      return false;
    }
  },
  removeItem: (key: string) => {
    try {
      const filePath = path.join(WALLET_DIR, `${key}.json`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return true;
    } catch (err) {
      console.error('Error removing wallet data:', err);
      return false;
    }
  }
};

let wallet: any = null;
let isInitialized = false;
let walletSeed = '';

/**
 * Initialize the Hathor service
 */
export async function initializeHathorService(): Promise<void> {
  try {
    // Configure Hathor wallet
    HathorWallet.setNetwork(NETWORK);
    HathorWallet.setServerUrl(SERVER_URL);
    HathorWallet.setWebsocketUrl(WS_URL);
    HathorWallet.storage.setStore(fileSystemStore);
    
    console.log('Hathor service initialized');
    isInitialized = true;
    
    // Check if we have a wallet seed stored
    const seedPath = path.join(WALLET_DIR, 'seed.txt');
    if (fs.existsSync(seedPath)) {
      walletSeed = fs.readFileSync(seedPath, 'utf8').trim();
      await startWallet(walletSeed);
    } else {
      // Generate a new wallet seed
      walletSeed = HathorWallet.generateWalletId();
      fs.writeFileSync(seedPath, walletSeed, 'utf8');
      await startWallet(walletSeed);
    }
  } catch (error) {
    console.error('Error initializing Hathor service:', error);
    throw error;
  }
}

/**
 * Start the wallet with the given seed
 */
async function startWallet(seed: string): Promise<void> {
  try {
    // Create a new wallet instance
    wallet = new HathorWallet({
      seed,
      password: '',
      network: NETWORK,
    });
    
    // Start the wallet
    await wallet.start();
    console.log('Hathor wallet started successfully');
  } catch (error) {
    console.error('Error starting wallet:', error);
    throw error;
  }
}