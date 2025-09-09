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

### React (`react/`)

**Iframe Entry Point:**
- `index.html` - Iframe widget entry point
- `src/main.tsx` - Iframe widget bootstrapping

**Shadow DOM Entry Point:**
- `shadow.html` - Shadow DOM development page
- `src/start.tsx` - Shadow DOM widget bootstrapping

**Shared:**
- `src/root-app.tsx` - Main React widget component
- `server.js` - Express server with CORS support
- Port: `8080`

### Angular (`angular/`)

**Iframe Entry Point:**
- `index.html` - Iframe widget entry point
- `src/main.ts` - Iframe widget bootstrapping

**Shadow DOM Entry Point:**
- `shadow.html` - Shadow DOM development page
- `src/start.ts` - Shadow DOM widget bootstrapping

**Shared:**
- `src/root-app.component.ts` - Main Angular widget component
- `server.js` - Express server with CORS support
- Port: `8082`

### Vue (`vue/`)

**Iframe Entry Point:**
- `index.html` - Iframe widget entry point
- `src/main.ts` - Iframe widget bootstrapping

**Shadow DOM Entry Point:**
- `shadow.html` - Shadow DOM development page
- `src/start.ts` - Shadow DOM widget bootstrapping

**Shared:**
- `src/root-app.vue` - Main Vue widget component
- `server.js` - Express server with CORS support
- Port: `8081`

## 🛠️ Development Commands

### Universal Scripts (All Frameworks)

Each framework example supports the same npm scripts:

```bash
# Build and serve (complete workflow)
npm run start

# Just serve (if already built)
npm run serve

# Development mode (hot reload)
npm run dev

# Build only
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

| Framework | Port | URL |
|-----------|------|-----|
| React     | 8080 | http://localhost:8080 |
| Vue       | 8081 | http://localhost:8081 |
| Angular   | 8082 | http://localhost:8082 |

## 🎯 Integration Patterns

### Iframe Integration

All examples are designed for iframe embedding:

```html
<!-- Host application -->
<iframe src="http://localhost:8080/" width="100%" height="400"></iframe>
<iframe src="http://localhost:8081/" width="100%" height="400"></iframe>
<iframe src="http://localhost:8082/" width="100%" height="400"></iframe>
```

### Communication

Each widget uses Penpal for parent-child communication:

```typescript
// Widget SDK automatically handles:
const context = await getContext();
const theme = await getTheme();
const result = await apiRequest({ url: '/api/data' });
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

Create a simple HTML file to test iframe embedding:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Widget Host Test</title>
</head>
<body>
    <h1>Testing Widget Integration</h1>
    
    <h2>React Widget</h2>
    <iframe src="http://localhost:8080/" width="100%" height="400"></iframe>
    
    <h2>Vue Widget</h2>
    <iframe src="http://localhost:8081/" width="100%" height="400"></iframe>
    
    <h2>Angular Widget</h2>
    <iframe src="http://localhost:8082/" width="100%" height="400"></iframe>
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
