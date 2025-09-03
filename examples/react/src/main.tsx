import React from 'react';
import '../../shared/dev-mock';
import { createRoot } from 'react-dom/client';
import { PlatformProvider } from 'widget-sdk-react';
import { App } from './root-app';

const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);

// Global mount API for host platforms dynamically loading this script
function mount(container?: HTMLElement) {
  root.render(
    <React.StrictMode>
      <PlatformProvider element={container}>
        <App />
      </PlatformProvider>
    </React.StrictMode>
  );
}

function unmount() {
  root.unmount();
}

// Expose on window for dynamic hosts
(window as any).WidgetSDKReact = { mount, unmount };

// Default immediate mount for local dev
mount();


