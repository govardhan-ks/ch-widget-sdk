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
When running as a standalone web component, the SDK uses DOM events for communication. **You must provide a DOM element** that will handle the custom events (`widget-request` and `widget-response`).

**Important**: For web component usage, you need to pass an element to the SDK initialization. This element will be used to:
- Dispatch `widget-request` events to the parent
- Listen for `widget-response` events from the parent
- Handle the communication between your widget and the platform

**Element is Required**: Unlike iframe integration, web component usage **requires** you to provide a DOM element. This element serves as the communication bridge between your widget and the parent application.

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
import React, { useRef } from 'react';
import { PlatformProvider, usePlatform } from 'widget-sdk-react';

function App() {
  const widgetRef = useRef<HTMLDivElement>(null);
  
  return (
    <PlatformProvider element={widgetRef.current}>
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
    <div ref={widgetRef}>
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
    <div #widgetElement>
      <div *ngIf="context && theme">
        <h1>Widget Dashboard</h1>
        <p>Context: {{ context | json }}</p>
        <p>Theme: {{ theme | json }}</p>
        <button (click)="makeApiCall()">Make API Call</button>
      </div>
    </div>
  `
})
export class MyComponent implements OnInit, AfterViewInit {
  @ViewChild('widgetElement', { static: false }) widgetElement!: ElementRef;
  context: any;
  theme: any;

  constructor(private platformService: PlatformService) {}

  async ngAfterViewInit() {
    // Initialize platform with the widget element
    await this.platformService.initPlatform({ element: this.widgetElement.nativeElement });
    
    // Get platform data
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

// For web component usage, you need to pass an element to the plugin
const element = document.querySelector('#my-widget');
app.use(createPlatformPlugin({ element }));
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
