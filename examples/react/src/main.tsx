import React from 'react';
import { createRoot } from 'react-dom/client';
import { PlatformProvider } from 'widget-sdk-react';
import { App } from './root-app';

const mount = document.getElementById('root')!;

const root = createRoot(mount);
root.render(
  <React.StrictMode>
    <PlatformProvider>
      <App />
    </PlatformProvider>
  </React.StrictMode>
);
