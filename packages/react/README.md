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

### Iframe Integration
When your widget runs inside an iframe, the SDK automatically uses Penpal for parent-child communication. **No additional setup required.**

### Web Component Integration
When running as a standalone web component, the SDK automatically detects the web component and uses DOM events for communication. **No additional setup required.**

**Automatic Detection**: The SDK automatically detects web components by:
- Finding custom elements with hyphenated tag names (e.g., `<my-widget>`)
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

### Web Component Integration

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

## API Reference

- `PlatformProvider`: React context provider component
- `usePlatform()`: Hook that returns platform data and methods 