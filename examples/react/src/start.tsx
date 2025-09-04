import '../../shared/dev-mock';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { PlatformProvider } from 'widget-sdk-react';
import { App } from './root-app';

export async function start(shadowRoot: ShadowRoot) {
  const mount = document.createElement('div');
  shadowRoot.appendChild(mount);

  const root = createRoot(mount);
  root.render(
    <React.StrictMode>
      <PlatformProvider element={mount}>
        <App />
      </PlatformProvider>
    </React.StrictMode>
  );
}


