import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'widget-sdk-vue': path.resolve(__dirname, '../../packages/vue/src/index.ts'),
      'widget-sdk-core': path.resolve(__dirname, '../../packages/core/src/index.ts')
    }
  },
  server: {
    port: 5174
  }
});


