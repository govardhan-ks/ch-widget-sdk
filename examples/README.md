# Widget SDK Examples

This directory contains example implementations for different frontend frameworks showing how to use the Widget SDK.

## 📁 Directory Structure

```
examples/
├── shared/           # Shared utilities and mocks
│   └── dev-mock.ts  # Development platform API mock
├── react/           # React Widget Examples
├── angular/         # Angular Widget Examples
├── vue/             # Vue Widget Examples
└── README.md        # This file
```

## 🚀 Framework Examples

Each framework provides **two integration approaches**:

### React (`react/`)

**📦 Build Outputs:**

- `dist/start.js` - Shadow DOM library (1.25 MB, clean exports)
- `dist/index.html` + `dist/assets/` - Iframe application (240 KB)

**🔧 Source Files:**

- `src/start.tsx` - Shadow DOM entry point with `export { start }`
- `src/main.tsx` - Iframe entry point
- `src/root-app.tsx` - Shared React widget component
- `server.js` - Express server with CORS support
- Port: `8080`

### Vue (`vue/`)

**📦 Build Outputs:**

- `dist/start.js` - Shadow DOM library (257 KB, clean exports)
- `dist/index.html` + `dist/assets/` - Iframe application (196 KB)

**🔧 Source Files:**

- `src/start.ts` - Shadow DOM entry point with `export { start }`
- `src/main.ts` - Iframe entry point
- `src/root-app.vue` - Shared Vue widget component
- `server.js` - Express server with CORS support
- Port: `8081`

### Angular (`angular/`)

**📦 Build Outputs:**

- `dist/start.js` - Shadow DOM library (2.79 MB, clean exports)
- `dist/index.html` + `dist/assets/` - Iframe application (2.79 MB)

**🔧 Source Files:**

- `src/start.ts` - Shadow DOM entry point with `export { start }`
- `src/main.ts` - Iframe entry point
- `src/root-app.component.ts` - Shared Angular widget component
- `server.js` - Express server with CORS support
- Port: `8082`

## 🛠️ Development Commands

### Universal Scripts (All Frameworks)

Each framework example supports the same npm scripts:

```bash
# Build and serve (complete workflow - both iframe and Shadow DOM)
npm run start

# Build only Shadow DOM library
npm run build:lib

# Build only iframe application
npm run build:iframe

# Build both approaches
npm run build:all

# Just serve (if already built)
npm run serve

# Development mode (hot reload)
npm run dev

# Default build (same as build:lib)
npm run build
```

### Quick Start - All Examples

```bash
# React (Port 8080)
cd examples/react
npm run start

# Vue (Port 8081)
cd examples/vue
npm run start

# Angular (Port 8082)
cd examples/angular
npm run start
```

## 🌐 Server Ports

| Framework | Port | URL                   |
| --------- | ---- | --------------------- |
| React     | 8080 | http://localhost:8080 |
| Vue       | 8081 | http://localhost:8081 |
| Angular   | 8082 | http://localhost:8082 |

## 🎯 Integration Patterns

### 🖼️ Iframe Integration

All examples provide iframe applications:

```html
<!-- Host application -->
<iframe src="http://localhost:8080/" width="100%" height="400"></iframe>
<iframe src="http://localhost:8081/" width="100%" height="400"></iframe>
<iframe src="http://localhost:8082/" width="100%" height="400"></iframe>
```

Communication uses Penpal for parent-child messaging:

```typescript
// Widget SDK automatically handles:
const context = await getContext();
const theme = await getTheme();
const result = await apiRequest({ url: '/api/data' });
```

### 🎭 Shadow DOM Integration

All examples provide clean JavaScript libraries for Shadow DOM embedding:

```javascript
// Dynamic import with predictable filename (no hashing)
const { start } = await import('./start.js');

// Create shadow DOM and initialize widget
const element = document.querySelector('#my-widget');
const shadowRoot = element.attachShadow({ mode: 'open' });
await start(shadowRoot);
```

**Library URLs:**

- React: http://localhost:8080/start.js
- Vue: http://localhost:8081/start.js
- Angular: http://localhost:8082/start.js

Communication uses custom DOM events with proper bubbling:

```typescript
// Events automatically bubble from Shadow DOM to main DOM
shadowRoot.addEventListener('widget-request', handleRequest);
shadowRoot.addEventListener('widget-response', handleResponse);
```

## 🔧 Server Features

All examples include Express.js servers with:

- **CORS Support**: `Access-Control-Allow-Origin: *`
- **Static File Serving**: From `dist/` directory
- **SPA Routing**: Fallback to `index.html`
- **Error Handling**: Graceful error responses
- **Graceful Shutdown**: Ctrl+C support

## 📋 Building and Deployment

### Development Workflow

```bash
# 1. Start development server
npm run dev

# 2. Build for production
npm run build

# 3. Serve built files
npm run serve

# 4. Or do both in one command
npm run start
```

### Production Deployment

1. Run `npm run build` to create production assets
2. Deploy the `dist/` folder to your CDN/hosting
3. Ensure CORS headers are configured on your server
4. Update iframe URLs to point to your production domain

## 🧪 Testing Your Widgets

### Local Testing

1. Start any example server
2. Open the URL in your browser
3. Test widget functionality directly

### Host Integration Testing

#### Iframe Integration Test

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Widget Iframe Test</title>
  </head>
  <body>
    <h1>Testing Iframe Widget Integration</h1>

    <h2>React Widget</h2>
    <iframe src="http://localhost:8080/" width="100%" height="400"></iframe>

    <h2>Vue Widget</h2>
    <iframe src="http://localhost:8081/" width="100%" height="400"></iframe>

    <h2>Angular Widget</h2>
    <iframe src="http://localhost:8082/" width="100%" height="400"></iframe>
  </body>
</html>
```

#### Shadow DOM Integration Test

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Widget Shadow DOM Test</title>
    <style>
      .widget-container {
        border: 2px solid #ccc;
        margin: 20px 0;
        padding: 20px;
        border-radius: 8px;
      }
    </style>
  </head>
  <body>
    <h1>Testing Shadow DOM Widget Integration</h1>

    <div class="widget-container">
      <h2>React Widget</h2>
      <div id="react-widget"></div>
    </div>

    <div class="widget-container">
      <h2>Vue Widget</h2>
      <div id="vue-widget"></div>
    </div>

    <div class="widget-container">
      <h2>Angular Widget</h2>
      <div id="angular-widget"></div>
    </div>

    <script>
      async function loadWidgets() {
        // Load React Widget
        try {
          const { start: startReact } = await import(
            'http://localhost:8080/start.js'
          );
          const reactElement = document.querySelector('#react-widget');
          const reactShadow = reactElement.attachShadow({ mode: 'open' });
          await startReact(reactShadow);
          console.log('React widget loaded successfully');
        } catch (error) {
          console.error('Failed to load React widget:', error);
        }

        // Load Vue Widget
        try {
          const { start: startVue } = await import(
            'http://localhost:8081/start.js'
          );
          const vueElement = document.querySelector('#vue-widget');
          const vueShadow = vueElement.attachShadow({ mode: 'open' });
          await startVue(vueShadow);
          console.log('Vue widget loaded successfully');
        } catch (error) {
          console.error('Failed to load Vue widget:', error);
        }

        // Load Angular Widget
        try {
          const { start: startAngular } = await import(
            'http://localhost:8082/start.js'
          );
          const angularElement = document.querySelector('#angular-widget');
          const angularShadow = angularElement.attachShadow({ mode: 'open' });
          await startAngular(angularShadow);
          console.log('Angular widget loaded successfully');
        } catch (error) {
          console.error('Failed to load Angular widget:', error);
        }
      }

      // Load widgets when page is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadWidgets);
      } else {
        loadWidgets();
      }
    </script>
  </body>
</html>
```

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Kill process using specific port
lsof -ti:8080 | xargs kill -9  # React
lsof -ti:8081 | xargs kill -9  # Vue
lsof -ti:8082 | xargs kill -9  # Angular
```

### Build Errors

```bash
# Clean build
rm -rf dist node_modules
npm install
npm run build
```

### CORS Issues

- Ensure servers are running with CORS enabled
- Check browser console for cross-origin errors
- Verify iframe src URLs are correct

### Widget Communication

- Check browser DevTools console for Penpal connection logs
- Verify parent window has proper message handling
- Test widget SDK functions (`getContext`, `getTheme`, `apiRequest`)

## 📦 Dependencies

All examples share similar dependencies:

- **Express**: HTTP server with CORS
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety
- **Framework-specific packages**: React, Vue, or Angular
- **Widget SDK packages**: Framework-specific SDK wrappers
