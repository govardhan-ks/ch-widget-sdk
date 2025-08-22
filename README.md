# ch-widget-sdk

Framework-specific SDK packages for integrating with the platform via iframe communication.

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

## Usage Examples

### React

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
  const { user, community, applyThemeVariables, fetchPlatformData } = usePlatform();

  const handleThemeChange = () => {
    applyThemeVariables({
      '--primary-color': '#ff6b6b',
      '--secondary-color': '#4ecdc4'
    });
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Role: {user.role}</p>
      <p>Community: {community?.name}</p>
      <button onClick={handleThemeChange}>Change Theme</button>
    </div>
  );
}
```

### Angular

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
    <div *ngIf="user">
      <h1>Welcome, {{ user.name }}!</h1>
      <p>Role: {{ user.role }}</p>
      <button (click)="changeTheme()">Change Theme</button>
    </div>
  `
})
export class MyComponent implements OnInit {
  user: any;

  constructor(private platformService: PlatformService) {}

  async ngOnInit() {
    this.user = await this.platformService.getUser();
  }

  async changeTheme() {
    await this.platformService.applyThemeVariables({
      '--primary-color': '#ff6b6b'
    });
  }
}
```

### Vue 3

```typescript
import { createApp } from 'vue';
import { createPlatformPlugin, usePlatform } from 'widget-sdk-vue';

const app = createApp(App);
app.use(createPlatformPlugin());
app.mount('#app');

// In your component:
<template>
  <div v-if="platform">
    <h1>Welcome, {{ platform.user?.name }}!</h1>
    <p>Role: {{ platform.user?.role }}</p>
    <button @click="changeTheme">Change Theme</button>
  </div>
</template>

<script setup>
import { usePlatform } from 'widget-sdk-vue';

const platform = usePlatform();

const changeTheme = async () => {
  await platform.applyThemeVariables({
    '--primary-color': '#ff6b6b'
  });
};
</script>
```

### Core (Vanilla JS/TypeScript)

```typescript
import { getUser, getSettings, applyThemeVariables, fetchPlatformData } from 'widget-sdk-core';

// Get user information
const user = await getUser();
console.log(user); // { id: string, name: string, role: string }

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

All packages provide access to:

- **User Data**: `getUser()` - Returns `{ id: string, name: string, role: string }`
- **Settings**: `getSettings()` - Returns platform configuration
- **Community**: `getCommunity()` - Returns `{ id: string, name: string }`
- **Theme**: `applyThemeVariables(vars)` - Applies CSS custom properties
- **HTTP**: `fetchPlatformData(endpoint, options)` - Makes requests to platform

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
