# widget-sdk-angular

Angular SDK for integrating with the platform. Provides Angular services and modules for easy platform integration.

## Installation

```bash
npm install widget-sdk-angular
# Peer dependencies (if not already installed)
npm install @angular/core
```

## Usage

### Basic Setup

Import the `PlatformModule` in your app module:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PlatformModule } from 'widget-sdk-angular';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    PlatformModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Using Platform Service

Inject the `PlatformService` in your components:

```typescript
import { Component, OnInit } from '@angular/core';
import { PlatformService } from 'widget-sdk-angular';

@Component({
  selector: 'app-my-component',
  template: `
    <div *ngIf="user">
      <h1>Welcome, {{ user.name }}!</h1>
      <p>Role: {{ user.role }}</p>
      <p>Community: {{ community?.name }}</p>
      <button (click)="changeTheme()">Change Theme</button>
      <button (click)="fetchData()">Fetch Data</button>
    </div>
    <div *ngIf="!user">Loading...</div>
  `
})
export class MyComponent implements OnInit {
  user: any;
  community: any;

  constructor(private platformService: PlatformService) {}

  async ngOnInit() {
    this.user = await this.platformService.getUser();
    this.community = await this.platformService.getCommunity();
  }

  async changeTheme() {
    await this.platformService.applyThemeVariables({
      '--primary-color': '#ff6b6b',
      '--secondary-color': '#4ecdc4'
    });
  }

  async fetchData() {
    const data = await this.platformService.fetchPlatformData('/api/users/me');
    console.log(data);
  }
}
```

### Available Methods

The `PlatformService` provides:

- `getUser()`: Returns user information `{ id: string, name: string, role: string }`
- `getSettings()`: Returns platform settings
- `getCommunity()`: Returns community information `{ id: string, name: string }`
- `applyThemeVariables(vars)`: Applies CSS theme variables
- `fetchPlatformData(endpoint, options)`: Makes HTTP requests to the platform

## API Reference

- `PlatformModule`: Angular module that provides the platform service
- `PlatformService`: Injectable service for platform integration 