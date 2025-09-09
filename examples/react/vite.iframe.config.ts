import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'widget-sdk-react': resolve(__dirname, '../../packages/react/src/index.tsx'),
      'widget-sdk-core': resolve(__dirname, '../../packages/core/src/index.ts')
    }
  },
  define: {
    // Define process.env for browser compatibility
    'process.env': {},
    'process.env.NODE_ENV': JSON.stringify('production'),
    global: 'globalThis',
  },
  build: {
    outDir: 'dist', // Same output directory
    emptyOutDir: false, // Don't clear the directory (preserve start.js)
    rollupOptions: {
      input: {
        // Build iframe HTML app
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        format: 'es',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    minify: false // Keep readable for debugging
  },
  server: {
    port: 5173,
    strictPort: true
  }
});
