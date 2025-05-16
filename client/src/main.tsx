import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initializeHathor } from './lib/hathorConfig';

// Initialize Hathor library
initializeHathor();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);