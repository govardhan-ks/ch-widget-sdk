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
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    minify: false, // Keep readable for debugging
  },
  server: {
    port: 4200,
    strictPort: true,
  },
});
