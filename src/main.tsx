
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Force refresh to ensure latest version of the app is loaded
if (window.location.hash === '#refresh') {
  window.location.hash = '';
  window.location.reload(true); // Force a complete reload, bypassing the cache
}

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
