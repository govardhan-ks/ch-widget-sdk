# widget-sdk-core

Core SDK for connecting to the platform via iframe communication.

## Installation

```bash
npm install widget-sdk-core
```

## Usage

```typescript
import { getUser, getSettings, getCommunity, applyThemeVariables, fetchPlatformData } from 'widget-sdk-core';

// Get user information
const user = await getUser();
console.log(user); // { id: string, name: string, role: string }

// Get platform settings
const settings = await getSettings();
console.log(settings); // Record<string, any>

// Get community information
const community = await getCommunity();
console.log(community); // { id: string, name: string }

// Apply theme variables
await applyThemeVariables({
  '--primary-color': '#007bff',
  '--secondary-color': '#6c757d'
});

// Fetch platform data
const data = await fetchPlatformData('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: '123' })
});
```

## API Reference

- `getUser()`: Returns user information
- `getSettings()`: Returns platform settings
- `getCommunity()`: Returns community information
- `applyThemeVariables(vars)`: Applies CSS theme variables
- `fetchPlatformData(endpoint, options)`: Makes HTTP requests to the platform 