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
When running as a standalone web component, the SDK automatically detects the web component and uses DOM events for communication. **No additional setup required.**

**Automatic Detection**: The SDK automatically detects web components by:
- Finding custom elements with hyphenated tag names (e.g., `<my-widget>`)
- Using the current script context to locate the web component
- Generating unique IDs for each widget instance

## Usage

### Iframe Integration

```typescript
import { getContext, getTheme, apiRequest } from 'widget-sdk-core';

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

### Web Component Integration

```typescript
import { getContext, getTheme, apiRequest } from 'widget-sdk-core';

// Get platform data (automatic detection)
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
- **`apiRequest(req: ApiRequestOptions)`**: Makes HTTP requests to the platform

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

### Platform Detection

The SDK automatically detects the platform:
- **Iframe**: Uses Penpal for parent-child communication
- **Web Component**: Uses DOM CustomEvents for communication

### Initialization

**Automatic Detection**: The SDK automatically detects the platform environment:
- **Iframe**: Uses Penpal for parent-child communication
- **Web Component**: Uses DOM CustomEvents for communication

**No Manual Initialization Required**: Simply call the API functions directly:
```typescript
import { getContext, getTheme, apiRequest } from 'widget-sdk-core';

// The SDK automatically detects the platform and initializes
const context = await getContext();
const theme = await getTheme();
``` 