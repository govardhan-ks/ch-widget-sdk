# widget-sdk-core

Core SDK for connecting to the platform via iframe communication or web components.

## Installation

```bash
npm install widget-sdk-core
```

## Platform Integration

The SDK supports two integration methods:

### Iframe Integration
When your widget runs inside an iframe, the SDK automatically uses Penpal for parent-child communication. **No additional setup required.**

### Web Component Integration
When running as a standalone web component, the SDK uses DOM events for communication. **You must provide a DOM element** that will handle the custom events (`widget-request` and `widget-response`).

## Usage

### Iframe Integration

```typescript
import { getContext, getTheme, apiRequest } from 'widget-sdk-core';

// Initialize and get platform data
const context = await getContext();
const theme = await getTheme();

console.log('Context:', context);
console.log('Theme:', theme);

// Make API requests
try {
  const response = await apiRequest({
    url: '/api/users',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: { userId: '123' }
  });
  console.log('API Response:', response);
} catch (error) {
  console.error('API Error:', error);
}
```

### Web Component Integration

```typescript
import { initPlatform, getContext, getTheme, apiRequest } from 'widget-sdk-core';

// Initialize with your web component element
const element = document.querySelector('#my-widget');
await initPlatform({ element });

// Get platform data
const context = await getContext();
const theme = await getTheme();

console.log('Context:', context);
console.log('Theme:', theme);

// Make API requests
try {
  const response = await apiRequest({
    url: '/api/users',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: { userId: '123' }
  });
  console.log('API Response:', response);
} catch (error) {
  console.error('API Error:', error);
}
```

## API Reference

### Core Functions

- **`getContext()`**: Returns platform context data as `Promise<Record<any, any>>`
- **`getTheme()`**: Returns theme configuration as `Promise<Record<string, any>>`
- **`apiRequest(req: ApiRequest)`**: Makes HTTP requests to the platform

### ApiRequest Interface

```typescript
interface ApiRequest {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  data?: any;
  params?: any;
}
```

### Platform Detection

The SDK automatically detects the platform:
- **Iframe**: Uses Penpal for parent-child communication
- **Web Component**: Uses DOM CustomEvents for communication

### Initialization

**Iframe Usage**: No manual initialization required - the SDK automatically detects iframe environment.

**Web Component Usage**: You must manually initialize with a DOM element:
```typescript
import { initPlatform } from 'widget-sdk-core';

// The element will handle DOM events for communication
const element = document.querySelector('#my-widget');
await initPlatform({ element });
```

**Element Requirements**:
- Must be a valid DOM element (HTMLElement)
- Will be used to dispatch and listen for custom events
- Should be the root element of your widget or a dedicated communication element 