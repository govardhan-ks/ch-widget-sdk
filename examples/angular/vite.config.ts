import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      'widget-sdk-angular': resolve(
        __dirname,
        '../../packages/angular/src/index.ts'
      ),
      'widget-sdk-core': resolve(__dirname, '../../packages/core/src/index.ts'),
    },
  },
  define: {
    'process.env': {},
    'process.env.NODE_ENV': JSON.stringify('development'),
    global: 'globalThis',
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
    minify: false,
  },
  server: {
    port: 4200,
    strictPort: true,
    cors: {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: true,
    },
  },
});
