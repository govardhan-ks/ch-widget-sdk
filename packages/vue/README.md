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

### Iframe Integration
When your widget runs inside an iframe, the SDK automatically uses Penpal for parent-child communication. **No additional setup required.**

### Web Component Integration
When running as a standalone web component, the SDK uses DOM events for communication. **You must provide a DOM element** that will handle the custom events (`widget-request` and `widget-response`).

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

### Web Component Integration

#### Basic Setup

Install the platform plugin with an element in your Vue app:

```typescript
import { createApp } from 'vue';
import { createPlatformPlugin } from 'widget-sdk-vue';
import App from './App.vue';

const app = createApp(App);

// For web component usage, you need to pass an element to the plugin
const element = document.querySelector('#my-widget');
app.use(createPlatformPlugin({ element }));
app.mount('#app');
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

## API Reference

- `createPlatformPlugin(options?)`: Vue plugin factory function
  - Options: `{ element?: HTMLElement }` (required for web component usage)
- `usePlatform()`: Composable that returns platform data and methods 