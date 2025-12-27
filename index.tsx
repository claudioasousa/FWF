
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Fix: Import from react-router to resolve missing member error in some environments
import { HashRouter } from 'react-router';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
