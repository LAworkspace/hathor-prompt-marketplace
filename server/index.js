const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// API Routes
app.get('/api/wallet/status', (req, res) => {
  res.json({ status: 'connected' });
});

// WebSocket connection
wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  
  // Send a welcome message
  ws.send(JSON.stringify({ 
    type: 'connection-established', 
    data: { message: 'Connected to Prompt Marketplace' } 
  }));
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received message:', data);
      
      // Echo the message back (for testing)
      ws.send(JSON.stringify({ 
        type: 'echo', 
        data 
      }));
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
  });
});

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});