# widget-sdk-react

React SDK for integrating with the platform. Provides React hooks and context for easy platform integration.

## Installation

```bash
npm install widget-sdk-react
# Peer dependencies (if not already installed)
npm install react react-dom
```

## Usage

### Basic Setup

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

### Using Platform Data

Use the `usePlatform` hook to access platform data and methods:

```tsx
import React from 'react';
import { usePlatform } from 'widget-sdk-react';

function MyComponent() {
  const { user, settings, community, applyThemeVariables, fetchPlatformData } = usePlatform();

  const handleThemeChange = () => {
    applyThemeVariables({
      '--primary-color': '#ff6b6b',
      '--secondary-color': '#4ecdc4'
    });
  };

  const fetchUserData = async () => {
    const data = await fetchPlatformData('/api/users/me');
    console.log(data);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Role: {user.role}</p>
      <p>Community: {community?.name}</p>
      <button onClick={handleThemeChange}>Change Theme</button>
      <button onClick={fetchUserData}>Fetch Data</button>
    </div>
  );
}
```

### Available Data

The `usePlatform` hook provides:

- `user`: User information `{ id: string, name: string, role: string }`
- `settings`: Platform settings
- `community`: Community information `{ id: string, name: string }`
- `applyThemeVariables(vars)`: Function to apply CSS theme variables
- `fetchPlatformData(endpoint, options)`: Function to make HTTP requests

## API Reference

- `PlatformProvider`: React context provider component
- `usePlatform()`: Hook that returns platform data and methods 