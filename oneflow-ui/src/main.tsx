import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  document.body.innerHTML = '<div style="padding: 2rem; color: red; font-size: 1.5rem;">Error: Root element not found!</div>';
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to render app:', error);
    rootElement.innerHTML = `
      <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; padding: 2rem; text-align: center; background-color: #f8fafc;">
        <h1 style="color: #ef4444; margin-bottom: 1rem;">Failed to Load App</h1>
        <p style="color: #64748b; margin-bottom: 1rem;">${error instanceof Error ? error.message : 'Unknown error'}</p>
        <pre style="background: #f1f5f9; padding: 1rem; border-radius: 8px; text-align: left; max-width: 600px; overflow: auto; font-size: 0.875rem;">
          ${error instanceof Error ? error.stack : String(error)}
        </pre>
        <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background-color: #4a7cff; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
          Reload Page
        </button>
      </div>
    `;
  }
}
