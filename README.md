# ch-widget-sdk

Framework-specific SDK packages for integrating with the platform via iframe communication or web components.

## Packages

- **widget-sdk-core**: Core SDK with direct API functions
- **widget-sdk-react**: React hooks and context provider
- **widget-sdk-angular**: Angular service and module
- **widget-sdk-vue**: Vue 3 plugin and composables

## Installation

Choose the package for your framework:

### React
```bash
npm install widget-sdk-react
# Peer dependencies (if not already installed)
npm install react react-dom
```

### Angular
```bash
npm install widget-sdk-angular
# Peer dependencies (if not already installed)
npm install @angular/core
```

### Vue 3
```bash
npm install widget-sdk-vue
# Peer dependencies (if not already installed)
npm install vue
```

### Core (Vanilla JS/TypeScript)
```bash
npm install widget-sdk-core
```

## Platform Integration

The SDK supports two integration methods:

### 1. Iframe Integration
When your widget runs inside an iframe, the SDK automatically uses Penpal for parent-child communication. **No additional setup required.**

### 2. Web Component Integration
When running as a standalone web component, the SDK automatically detects the web component and uses DOM events for communication. **No additional setup required.**

**🎨 Automatic Theme Updates**: Both integration methods support automatic theme updates. When the host application changes themes, all widgets automatically receive the new theme values without any manual subscription or handling required.

**Automatic Detection**: The SDK automatically detects web components by:
- Finding custom elements with hyphenated tag names (e.g., `<my-widget>`)
- Using the current script context to locate the web component
- Generating unique IDs for each widget instance

**Multiple Widgets**: The SDK automatically handles multiple web components on the same page by:
- Generating unique IDs for each widget instance
- Scoping events to specific widget instances
- Preventing event collisions between different widgets

## Usage Examples

### React

#### Iframe Integration
```tsx
import React from 'react';
import { PlatformProvider, usePlatform } from 'widget-sdk-react';

function App() {
  return (
    <PlatformProvider>
      <MyComponent />
    </PlatformProvider>
  );
}

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

#### Web Component Integration
```tsx
import React from 'react';
import { PlatformProvider, usePlatform } from 'widget-sdk-react';

function App() {
  return (
    <PlatformProvider>
      <MyComponent />
    </PlatformProvider>
  );
}

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

### Angular

#### Iframe Integration
```typescript
import { NgModule } from '@angular/core';
import { PlatformModule, PlatformService } from 'widget-sdk-angular';

@NgModule({
  imports: [PlatformModule],
  // ...
})
export class AppModule { }

// In your component:
@Component({
  template: `
    <div *ngIf="context && theme">
      <h1>Widget Dashboard</h1>
      <p>Context: {{ context | json }}</p>
      <p>Theme: {{ theme | json }}</p>
      <button (click)="makeApiCall()">Make API Call</button>
    </div>
  `
})
export class MyComponent implements OnInit {
  context: any;
  theme: any;

  constructor(private platformService: PlatformService) {}

  async ngOnInit() {
    this.context = await this.platformService.getContext();
    this.theme = await this.platformService.getTheme();
  }

  async makeApiCall() {
    try {
      const response = await this.platformService.apiRequest({
        url: '/api/users',
        method: 'POST',
        data: { userId: '123' }
      });
      console.log('API Response:', response);
    } catch (error) {
      console.error('API Error:', error);
    }
  }
}
```

#### Web Component Integration
```typescript
import { NgModule } from '@angular/core';
import { PlatformModule, PlatformService } from 'widget-sdk-angular';

@NgModule({
  imports: [PlatformModule],
  // ...
})
export class AppModule { }

// In your component:
@Component({
  template: `
    <div *ngIf="context && theme">
      <h1>Widget Dashboard</h1>
      <p>Context: {{ context | json }}</p>
      <p>Theme: {{ theme | json }}</p>
      <button (click)="makeApiCall()">Make API Call</button>
    </div>
  `
})
export class MyComponent implements OnInit {
  context: any;
  theme: any;

  constructor(private platformService: PlatformService) {}

  async ngOnInit() {
    // Get platform data (automatic detection)
    this.context = await this.platformService.getContext();
    this.theme = await this.platformService.getTheme();
  }

  async makeApiCall() {
    try {
      const response = await this.platformService.apiRequest({
        url: '/api/users',
        method: 'POST',
        data: { userId: '123' }
      });
      console.log('API Response:', response);
    } catch (error) {
      console.error('API Error:', error);
    }
  }
}
```

### Vue 3

#### Iframe Integration
```typescript
import { createApp } from 'vue';
import { createPlatformPlugin, usePlatform } from 'widget-sdk-vue';

const app = createApp(App);
app.use(createPlatformPlugin());
app.mount('#app');

// In your component:
<template>
  <div v-if="platform.context && platform.theme">
    <h1>Widget Dashboard</h1>
    <p>Context: {{ platform.context }}</p>
    <p>Theme: {{ platform.theme }}</p>
    <button @click="makeApiCall">Make API Call</button>
  </div>
</template>

<script setup>
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

#### Web Component Integration
```typescript
import { createApp } from 'vue';
import { createPlatformPlugin, usePlatform } from 'widget-sdk-vue';

const app = createApp(App);
app.use(createPlatformPlugin());
app.mount('#app');

// In your component:
<template>
  <div v-if="platform.context && platform.theme">
    <h1>Widget Dashboard</h1>
    <p>Context: {{ platform.context }}</p>
    <p>Theme: {{ platform.theme }}</p>
    <button @click="makeApiCall">Make API Call</button>
  </div>
</template>

<script setup>
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

### Core (Vanilla JS/TypeScript)

#### Iframe Integration
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

#### Web Component Integration
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

## Development

### Build
```bash
# Build all packages
npx rollup -c

# Build specific package
PKG=react npx rollup -c
```

### Publish
```bash
# Version and publish
npx lerna version
git push --follow-tags
npx lerna publish from-package
```
