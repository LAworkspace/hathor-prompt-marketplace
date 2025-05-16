import express from 'express';
import { initializeHathorService } from './hathorService';
import path from 'path';

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// Routes
app.get('/api/wallet/address', async (req, res) => {
  try {
    // Implementation would go here
    res.json({ address: "hathorAddressSimulated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to get wallet address" });
  }
});

app.get('/api/wallet/balance', async (req, res) => {
  try {
    // Implementation would go here
    res.json({ available: 100, locked: 0 });
  } catch (error) {
    res.status(500).json({ error: "Failed to get wallet balance" });
  }
});

// Initialize Hathor service and start server
async function startServer() {
  try {
    await initializeHathorService();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();