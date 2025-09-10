import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Point to local source for instant rebuilds
      'widget-sdk-react': resolve(__dirname, '../../packages/react/src/index.tsx'),
      'widget-sdk-core': resolve(__dirname, '../../packages/core/src/index.ts')
    }
  },
  define: {
    // Define process.env for browser compatibility
    'process.env': {},
    'process.env.NODE_ENV': JSON.stringify('development'),
    global: 'globalThis',
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
    port: 5173,
    strictPort: true,
    cors: {
      origin: true, // Allow all origins
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: true
    }
  }
});


