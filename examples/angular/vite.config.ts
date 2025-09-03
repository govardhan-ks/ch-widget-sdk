import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import path from 'path';

export default defineConfig({
  plugins: [angular()],
  resolve: {
    alias: {
      'widget-sdk-angular': path.resolve(__dirname, '../../packages/angular/src/index.ts'),
      'widget-sdk-core': path.resolve(__dirname, '../../packages/core/src/index.ts')
    }
  },
  server: {
    port: 5175
  }
});


