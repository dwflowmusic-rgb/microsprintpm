import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error: any) {
  console.error("Critical: Failed to mount React application", error);
  // Fallback UI if React completely fails to start
  rootElement.innerHTML = `
    <div style="padding: 2rem; color: #ef4444; font-family: sans-serif;">
      <h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Erro Crítico na Inicialização</h1>
      <p>O aplicativo não pôde ser carregado.</p>
      <pre style="background: #fee2e2; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem; overflow: auto;">
${error?.message || String(error)}
${error?.stack || ''}
      </pre>
      <p style="margin-top: 1rem; font-size: 0.875rem; color: #666;">Verifique o console ou o Debug Overlay para mais detalhes.</p>
    </div>
  `;
}