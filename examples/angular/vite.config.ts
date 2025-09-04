import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      'widget-sdk-angular': path.resolve(__dirname, '../../packages/angular/src/index.ts'),
      'widget-sdk-core': path.resolve(__dirname, '../../packages/core/src/index.ts')
    }
  },
  server: {
    port: 4200,
    strictPort: true
  }
});


