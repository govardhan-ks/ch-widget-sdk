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
    lib: {
      entry: resolve(__dirname, 'src/start.ts'), // Shadow DOM entry with start() function
      name: 'AngularWidget',
      fileName: 'start', // Will generate start.js
      formats: ['es'], // ES modules for dynamic import support
    },
    rollupOptions: {
      external: [
        // Externalize dependencies if host app provides them (uncomment to reduce bundle size)
      ],
    },
    minify: false, // Keep exports readable
  },
  server: {
    port: 4200,
    strictPort: true,
  },
});
