import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'widget-sdk-vue': resolve(__dirname, '../../packages/vue/src/index.ts'),
      'widget-sdk-core': resolve(__dirname, '../../packages/core/src/index.ts'),
    },
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
    minify: false,
  },
  server: {
    port: 5174,
    strictPort: true,
    cors: {
      origin: true, // Allow all origins
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: true,
    },
  },
});
