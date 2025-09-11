import React from 'react';
import { createRoot } from 'react-dom/client';
import { PlatformProvider } from 'widget-sdk-react';
import { App } from './root-app';

export async function start(element: HTMLElement) {
  const root = createRoot(element);
  root.render(
    <React.StrictMode>
      <PlatformProvider element={element}>
        <App />
      </PlatformProvider>
    </React.StrictMode>
  );
}
