import React from 'react';
import ReactDOM from 'react-dom/client';
import EshopApp from './EshopApp';

declare global {
  interface Window { gtag?: (...args: any[]) => void; }
}
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <EshopApp />
  </React.StrictMode>
);