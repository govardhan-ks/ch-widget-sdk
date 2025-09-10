import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      'widget-sdk-angular': resolve(__dirname, '../../packages/angular/src/index.ts'),
      'widget-sdk-core': resolve(__dirname, '../../packages/core/src/index.ts')
    }
  },
  define: {
    // Define process.env for browser compatibility
    'process.env': {},
    'process.env.NODE_ENV': JSON.stringify('development'),
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['rxjs', 'rxjs/operators'],
    force: true
  },
  // DEV MODE: Simple app build - no library mode
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
    minify: false
  },
  server: {
    port: 4200,
    strictPort: true,
    cors: {
      origin: true, // Allow all origins
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: true
    }
  }
});