# Host Application Integration Guide

This guide explains how host applications can notify widgets about theme and context changes in both iframe and shadow DOM scenarios.

## 🎯 Overview

The widget SDK supports two communication methods:

1. **Iframe + Penpal**: Uses postMessage for parent-child communication
2. **Shadow DOM + CustomEvents**: Uses DOM events for direct element communication

## 🖼️ Iframe Integration (Penpal)

### Host Application Setup

```typescript
import * as Penpal from 'penpal';

class WidgetHost {
  private iframe: HTMLIFrameElement;
  private connection: any;
  private currentTheme: any;
  private currentContext: any;
  private themeChangeCallbacks = new Set<(theme: any) => void>();

  constructor() {
    this.setupIframe();
  }

  private async setupIframe() {
    // Create iframe
    this.iframe = document.createElement('iframe');
    this.iframe.src = 'https://your-widget-domain.com/widget.html';
    document.body.appendChild(this.iframe);

    // Initialize Penpal connection
    this.connection = Penpal.connectToChild({
      iframe: this.iframe,
      methods: {
        // Widget will call these methods
        getContext: () => this.getCurrentContext(),
        getTheme: () => this.getCurrentTheme(),
        apiRequest: (req: any) => this.handleApiRequest(req),

        // ✅ Key method: Allow widgets to subscribe to theme changes
        onThemeChange: (callback: (theme: any) => void) => {
          this.themeChangeCallbacks.add(callback);

          // Return unsubscribe function
          return () => {
            this.themeChangeCallbacks.delete(callback);
          };
        },
      },
    });

    await this.connection.promise;
    console.log('Widget iframe connected!');
  }

  // ✅ Call this when your theme changes
  public updateTheme(newTheme: any) {
    this.currentTheme = newTheme;

    // Notify all subscribed widgets
    this.themeChangeCallbacks.forEach(callback => {
      try {
        callback(newTheme);
      } catch (error) {
        console.error('Error notifying widget of theme change:', error);
      }
    });

    console.log('🎨 Theme updated and widgets notified:', newTheme);
  }

  // ✅ Call this when your context changes
  public updateContext(newContext: any) {
    this.currentContext = newContext;
    // Context changes are typically handled through getContext() calls
    // But you could implement onContextChange similar to onThemeChange if needed
  }

  private getCurrentTheme() {
    return (
      this.currentTheme || {
        colorPrimary: '#3b82f6',
        colorSurface: '#ffffff',
        colorText: '#111827',
        // ... your theme properties
      }
    );
  }

  private getCurrentContext() {
    return (
      this.currentContext || {
        user: { name: 'John Doe', email: 'john@example.com' },
        org: { name: 'Acme Corp' },
        // ... your context properties
      }
    );
  }

  private async handleApiRequest(req: any) {
    // Handle API requests from widget
    const response = await fetch(req.url, {
      method: req.method || 'GET',
      headers: req.headers,
      body: req.data ? JSON.stringify(req.data) : undefined,
    });
    return response.json();
  }
}

// Usage
const widgetHost = new WidgetHost();

// When your app's theme changes (e.g., dark mode toggle)
document.getElementById('theme-toggle')?.addEventListener('click', () => {
  const newTheme = {
    colorPrimary: isDarkMode ? '#10b981' : '#3b82f6',
    colorSurface: isDarkMode ? '#1f2937' : '#ffffff',
    colorText: isDarkMode ? '#f9fafb' : '#111827',
    // ... other theme properties
  };

  widgetHost.updateTheme(newTheme);
});
```

## 🕸️ Shadow DOM Integration (CustomEvents)

### Host Application Setup

```typescript
class ShadowDOMWidgetHost {
  private widgetElement: HTMLElement;
  private currentTheme: any;
  private currentContext: any;

  constructor() {
    this.setupWidget();
  }

  private async setupWidget() {
    // Create widget container
    this.widgetElement = document.createElement('div');
    this.widgetElement.id = 'my-widget-instance';
    document.body.appendChild(this.widgetElement);

    // Listen for widget requests
    this.widgetElement.addEventListener(
      'widget-request',
      this.handleWidgetRequest.bind(this)
    );

    // Load widget script into shadow DOM
    await this.loadWidget();
  }

  private async loadWidget() {
    // Create shadow root
    const shadowRoot = this.widgetElement.attachShadow({ mode: 'open' });

    // Load widget script
    const { start } = await import('https://your-widget-domain.com/widget.js');
    await start(shadowRoot);
  }

  private handleWidgetRequest = (event: Event) => {
    const customEvent = event as CustomEvent;
    const { type, payload, widgetId } = customEvent.detail;

    let response: any;

    switch (type) {
      case 'getContext':
        response = this.getCurrentContext();
        break;

      case 'getTheme':
        response = this.getCurrentTheme();
        break;

      case 'apiRequest':
        this.handleApiRequest(payload).then(result => {
          this.sendResponse(widgetId, result);
        });
        return; // Async response

      default:
        console.warn('Unknown widget request type:', type);
        return;
    }

    this.sendResponse(widgetId, response);
  };

  private sendResponse(widgetId: string, data: any) {
    this.widgetElement.dispatchEvent(
      new CustomEvent('widget-response', {
        detail: { widgetId, data },
      })
    );
  }

  // ✅ Call this when your theme changes
  public updateTheme(newTheme: any) {
    this.currentTheme = newTheme;

    // Notify widget via custom event
    this.widgetElement.dispatchEvent(
      new CustomEvent('widget-theme-change', {
        detail: {
          type: 'themeChange',
          theme: newTheme,
          widgetId: this.widgetElement.id,
        },
      })
    );

    console.log('🎨 Theme updated and widget notified:', newTheme);
  }

  // ✅ Call this when your context changes
  public updateContext(newContext: any) {
    this.currentContext = newContext;

    // Notify widget via custom event
    this.widgetElement.dispatchEvent(
      new CustomEvent('widget-context-change', {
        detail: {
          type: 'contextChange',
          context: newContext,
          widgetId: this.widgetElement.id,
        },
      })
    );

    console.log('📝 Context updated and widget notified:', newContext);
  }

  private getCurrentTheme() {
    return (
      this.currentTheme || {
        colorPrimary: '#3b82f6',
        colorSurface: '#ffffff',
        colorText: '#111827',
        // ... your theme properties
      }
    );
  }

  private getCurrentContext() {
    return (
      this.currentContext || {
        user: { name: 'John Doe', email: 'john@example.com' },
        org: { name: 'Acme Corp' },
        // ... your context properties
      }
    );
  }

  private async handleApiRequest(req: any) {
    // Handle API requests from widget
    const response = await fetch(req.url, {
      method: req.method || 'GET',
      headers: req.headers,
      body: req.data ? JSON.stringify(req.data) : undefined,
    });
    return response.json();
  }
}

// Usage
const widgetHost = new ShadowDOMWidgetHost();

// When your app's theme changes
document.getElementById('theme-toggle')?.addEventListener('click', () => {
  const newTheme = {
    colorPrimary: isDarkMode ? '#10b981' : '#3b82f6',
    colorSurface: isDarkMode ? '#1f2937' : '#ffffff',
    colorText: isDarkMode ? '#f9fafb' : '#111827',
  };

  widgetHost.updateTheme(newTheme);
});

// When your app's context changes (e.g., user switches accounts)
function onUserChange(newUser: any) {
  const newContext = {
    user: newUser,
    org: newUser.organization,
    permissions: newUser.permissions,
  };

  widgetHost.updateContext(newContext);
}
```

## 🔄 Widget SDK Internal Flow

Here's how the widget SDK handles these notifications internally:

### 1. Initialization

```typescript
// Core SDK detects environment and sets up appropriate communication
await initPlatform({ element }); // For shadow DOM
// or
await initPlatform(); // For iframe (auto-detected)
```

### 2. Observable Setup

```typescript
// Core creates observables that all frameworks subscribe to
const themeObservable = new PlatformObservable(() => connection.getTheme());

// Sets up listeners based on platform type
if (connection.onThemeChange) {
  // Iframe: Subscribe to Penpal method
  connection.onThemeChange(newTheme => {
    themeObservable.next(newTheme); // ✅ All frameworks get updated
  });
} else if (element && widgetId) {
  // Shadow DOM: Listen for custom events
  element.addEventListener('widget-theme-change', e => {
    if (e.detail.widgetId === widgetId) {
      themeObservable.next(e.detail.theme); // ✅ All frameworks get updated
    }
  });
}
```

### 3. Framework Integration

```typescript
// React
const [contextObs, themeObs] = await Promise.all([
  getContextObservable(),
  getThemeObservable(),
]);

themeObs.subscribe(theme => setState(prev => ({ ...prev, theme })));

// Vue
themeObs.subscribe(theme => {
  state.theme = theme;
});

// Angular
themeObs.subscribe(theme => this._theme$.next(theme));
```

## 🎯 Key Points

1. **Iframe**: Use Penpal's `onThemeChange` method for subscriptions
2. **Shadow DOM**: Use `widget-theme-change` CustomEvents for notifications
3. **Widget ID**: Shadow DOM events are scoped to specific widget instances
4. **Automatic**: Once set up, all framework packages receive updates automatically
5. **Type Safety**: Both methods support full TypeScript integration

## 🚀 Benefits

- **🔄 Reactive**: Instant updates across all widget instances
- **🎯 Targeted**: Shadow DOM notifications can target specific widgets
- **🛡️ Safe**: Proper error handling and event scoping
- **⚡ Fast**: Direct communication without polling
- **🎨 Flexible**: Works with any theme structure or context format

The widget SDK handles all the complexity internally - host applications just need to call `updateTheme()` or `updateContext()` when their data changes!
