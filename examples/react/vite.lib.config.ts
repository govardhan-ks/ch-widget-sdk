import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'widget-sdk-react': resolve(
        __dirname,
        '../../packages/react/src/index.tsx'
      ),
      'widget-sdk-core': resolve(__dirname, '../../packages/core/src/index.ts'),
    },
  },
  define: {
    // Define process.env for browser compatibility
    'process.env': {},
    'process.env.NODE_ENV': JSON.stringify('production'),
    global: 'globalThis',
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/start.tsx'), // Shadow DOM entry with start() function
      name: 'ReactWidget',
      fileName: 'start', // Will generate start.js
      formats: ['es'], // ES modules for dynamic import support
    },
    rollupOptions: {
      external: [
        // Externalize dependencies if host app provides them (uncomment to reduce bundle size)
        // 'react',
        // 'react-dom',
      ],
    },
    minify: false, // Keep exports readable
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
