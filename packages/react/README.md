# widget-sdk-react

React SDK for integrating with the platform. Provides React hooks and context for easy platform integration.

## Installation

```bash
npm install widget-sdk-react
# Peer dependencies (if not already installed)
npm install react react-dom
```

## Platform Integration

The SDK supports two integration methods:

### 🖼️ Iframe Integration
When your widget runs inside an iframe, the SDK automatically uses Penpal for parent-child communication. **No additional setup required.**

### 🎭 Shadow DOM Integration  
When running as a Shadow DOM web component, the SDK automatically detects the shadow root and uses DOM events for communication. **No additional setup required.**

**Automatic Detection**: The SDK automatically detects integration context by:
- Checking for iframe parent window communication
- Finding Shadow DOM boundaries and custom elements
- Using the current script context to locate the web component
- Generating unique IDs for each widget instance

## Usage

### Iframe Integration

#### Basic Setup

Wrap your app with the `PlatformProvider`:

```tsx
import React from 'react';
import { PlatformProvider } from 'widget-sdk-react';

function App() {
  return (
    <PlatformProvider>
      <YourApp />
    </PlatformProvider>
  );
}
```

#### Using Platform Data

Use the `usePlatform` hook to access platform data and methods:

```tsx
import React from 'react';
import { usePlatform } from 'widget-sdk-react';

function MyComponent() {
  const { context, theme, apiRequest } = usePlatform();

  const handleApiCall = async () => {
    try {
      const response = await apiRequest({
        url: '/api/users',
        method: 'POST',
        data: { userId: '123' }
      });
      console.log('API Response:', response);
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  if (!context || !theme) return <div>Loading...</div>;

  return (
    <div>
      <h1>Widget Dashboard</h1>
      <p>Context: {JSON.stringify(context)}</p>
      <p>Theme: {JSON.stringify(theme)}</p>
      <button onClick={handleApiCall}>Make API Call</button>
    </div>
  );
}
```

### Shadow DOM Integration

#### Basic Setup

Create a `start` function for Shadow DOM initialization:

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { PlatformProvider } from 'widget-sdk-react';
import { App } from './your-app';

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
```

#### Host Integration

```javascript
// Host application dynamically loads the widget
const { start } = await import('./start.js');

// Create shadow DOM and initialize widget
const element = document.querySelector('#my-widget');
const shadowRoot = element.attachShadow({ mode: 'open' });
await start(shadowRoot);
```

#### Using Platform Data

```tsx
import React from 'react';
import { usePlatform } from 'widget-sdk-react';

function MyComponent() {
  const { context, theme, apiRequest } = usePlatform();

  const handleApiCall = async () => {
    try {
      const response = await apiRequest({
        url: '/api/users',
        method: 'POST',
        data: { userId: '123' }
      });
      console.log('API Response:', response);
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  if (!context || !theme) return <div>Loading...</div>;

  return (
    <div>
      <h1>Widget Dashboard</h1>
      <p>Context: {JSON.stringify(context)}</p>
      <p>Theme: {JSON.stringify(theme)}</p>
      <button onClick={handleApiCall}>Make API Call</button>
    </div>
  );
}
```

### Available Data

The `usePlatform` hook provides:

- `context`: Platform context data
- `theme`: Theme configuration
- `apiRequest(req)`: Function to make HTTP requests to the platform

### ApiRequestOptions Interface

```typescript
interface ApiRequestOptions {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  data?: any;
  params?: any;
}
```

## Examples

See the complete working example in the [`examples/react`](../../examples/react) directory:

```bash
cd examples/react

# Build and serve both iframe and Shadow DOM versions
npm run start

# Or build individually
npm run build:lib      # Shadow DOM library (start.js)
npm run build:iframe   # Iframe application  
npm run build:all      # Both approaches
```

**Live URLs:**
- Iframe: http://localhost:8080/
- Shadow DOM Library: http://localhost:8080/start.js

## API Reference

- `PlatformProvider`: React context provider component
- `usePlatform()`: Hook that returns platform data and methods 