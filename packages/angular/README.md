# widget-sdk-angular

Angular SDK for integrating with the platform. Provides Angular services and modules for easy platform integration.

## Installation

```bash
npm install widget-sdk-angular
# Peer dependencies (if not already installed)
npm install @angular/core
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

#### Basic Setup

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

#### Using Platform Service

Inject the `PlatformService` in your components:

```typescript
import { Component, OnInit } from '@angular/core';
import { PlatformService } from 'widget-sdk-angular';

@Component({
  selector: 'app-my-component',
  template: `
    <div *ngIf="context && theme">
      <h1>Widget Dashboard</h1>
      <p>Context: {{ context | json }}</p>
      <p>Theme: {{ theme | json }}</p>
      <button (click)="makeApiCall()">Make API Call</button>
    </div>
    <div *ngIf="!context || !theme">Loading...</div>
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

### Web Component Integration

#### Basic Setup

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

#### Using Platform Service

```typescript
import { Component, OnInit } from '@angular/core';
import { PlatformService } from 'widget-sdk-angular';

@Component({
  selector: 'app-my-component',
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

### Available Methods

The `PlatformService` provides:

- `getContext()`: Returns platform context data
- `getTheme()`: Returns theme configuration
- `apiRequest(req)`: Makes HTTP requests to the platform

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

## API Reference

- `PlatformModule`: Angular module that provides the platform service
- `PlatformService`: Injectable service for platform integration 