
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { detectApiBaseUrl } from './api';
import './src/index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

const start = async () => {
  await detectApiBaseUrl();
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

start();
