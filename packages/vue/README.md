# widget-sdk-vue

Vue 3 SDK for integrating with the platform. Provides Vue plugins and composables for easy platform integration.

## Installation

```bash
npm install widget-sdk-vue
# Peer dependencies (if not already installed)
npm install vue
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

Install the platform plugin in your Vue app:

```typescript
import { createApp } from 'vue';
import { createPlatformPlugin } from 'widget-sdk-vue';
import App from './App.vue';

const app = createApp(App);
app.use(createPlatformPlugin());
app.mount('#app');
```

#### Using Platform Data

Use the `usePlatform` composable in your components:

```vue
<template>
  <div v-if="platform.context && platform.theme">
    <h1>Widget Dashboard</h1>
    <p>Context: {{ platform.context }}</p>
    <p>Theme: {{ platform.theme }}</p>
    <button @click="makeApiCall">Make API Call</button>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup lang="ts">
import { usePlatform } from 'widget-sdk-vue';

const platform = usePlatform();

const makeApiCall = async () => {
  try {
    const response = await platform.apiRequest({
      url: '/api/users',
      method: 'POST',
      data: { userId: '123' }
    });
    console.log('API Response:', response);
  } catch (error) {
    console.error('API Error:', error);
  }
};
</script>
```

### Shadow DOM Integration

#### Basic Setup

Create a `start` function for Shadow DOM initialization:

```typescript
import { createApp } from 'vue';
import { createPlatformPlugin } from 'widget-sdk-vue';
import RootApp from './your-app.vue';

export async function start(shadowRoot: ShadowRoot) {
  const mount = document.createElement('div');
  shadowRoot.appendChild(mount);

  const app = createApp(RootApp);
  app.use(createPlatformPlugin({ element: mount }));
  
  const platform = usePlatform();
  await platform.whenReady();
  
  app.mount(mount);
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

```vue
<template>
  <div v-if="platform.context && platform.theme">
    <h1>Widget Dashboard</h1>
    <p>Context: {{ platform.context }}</p>
    <p>Theme: {{ platform.theme }}</p>
    <button @click="makeApiCall">Make API Call</button>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup lang="ts">
import { usePlatform } from 'widget-sdk-vue';

const platform = usePlatform();

const makeApiCall = async () => {
  try {
    const response = await platform.apiRequest({
      url: '/api/users',
      method: 'POST',
      data: { userId: '123' }
    });
    console.log('API Response:', response);
  } catch (error) {
    console.error('API Error:', error);
  }
};
</script>
```

### Available Data

The `usePlatform` composable provides:

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

See the complete working example in the [`examples/vue`](../../examples/vue) directory:

```bash
cd examples/vue

# Build and serve both iframe and Shadow DOM versions
npm run start

# Or build individually
npm run build:lib      # Shadow DOM library (start.js)
npm run build:iframe   # Iframe application  
npm run build:all      # Both approaches
```

**Live URLs:**
- Iframe: http://localhost:8081/
- Shadow DOM Library: http://localhost:8081/start.js

## API Reference

- `createPlatformPlugin()`: Vue plugin factory function
- `usePlatform()`: Composable that returns platform data and methods 