# widget-sdk-vue

Vue 3 SDK for integrating with the platform. Provides Vue plugins and composables for easy platform integration.

## Installation

```bash
npm install widget-sdk-vue
# Peer dependencies (if not already installed)
npm install vue
```

## Usage

### Basic Setup

Install the platform plugin in your Vue app:

```typescript
import { createApp } from 'vue';
import { createPlatformPlugin } from 'widget-sdk-vue';
import App from './App.vue';

const app = createApp(App);
app.use(createPlatformPlugin());
app.mount('#app');
```

### Using Platform Data

Use the `usePlatform` composable in your components:

```vue
<template>
  <div v-if="platform">
    <h1>Welcome, {{ platform.user?.name }}!</h1>
    <p>Role: {{ platform.user?.role }}</p>
    <p>Community: {{ platform.community?.name }}</p>
    <button @click="changeTheme">Change Theme</button>
    <button @click="fetchData">Fetch Data</button>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup lang="ts">
import { usePlatform } from 'widget-sdk-vue';

const platform = usePlatform();

const changeTheme = async () => {
  await platform.applyThemeVariables({
    '--primary-color': '#ff6b6b',
    '--secondary-color': '#4ecdc4'
  });
};

const fetchData = async () => {
  const data = await platform.fetchPlatformData('/api/users/me');
  console.log(data);
};
</script>
```

### Available Data

The `usePlatform` composable provides:

- `user`: User information `{ id: string, name: string, role: string }`
- `settings`: Platform settings
- `community`: Community information `{ id: string, name: string }`
- `applyThemeVariables(vars)`: Function to apply CSS theme variables
- `fetchPlatformData(endpoint, options)`: Function to make HTTP requests

## API Reference

- `createPlatformPlugin()`: Vue plugin factory function
- `usePlatform()`: Composable that returns platform data and methods 