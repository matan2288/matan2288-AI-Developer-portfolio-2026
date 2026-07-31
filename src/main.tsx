import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import BlogApp from './blog';
import { Providers } from './app/providers';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const isBlogApp = 
  window.location.search.includes('app=blog') || 
  window.location.search.includes('view=blog') || 
  window.location.pathname.startsWith('/blog');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Providers>
      {isBlogApp ? <BlogApp /> : <App />}
    </Providers>
  </React.StrictMode>
);

