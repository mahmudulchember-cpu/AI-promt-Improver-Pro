
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * World-class initialization logic.
 * Ensures the DOM is ready before mounting and handles missing root gracefully.
 */
const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Fatal Error: Could not find the #root element in index.html.");
}
