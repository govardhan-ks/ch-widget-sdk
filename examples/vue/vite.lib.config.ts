import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'widget-sdk-vue': resolve(__dirname, '../../packages/vue/src/index.ts'),
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
    lib: {
      entry: resolve(__dirname, 'src/start.ts'), // Shadow DOM entry with start() function
      name: 'VueWidget',
      fileName: 'start', // Will generate start.js
      formats: ['es'], // ES modules for dynamic import support
    },
    rollupOptions: {
      external: [
        // Externalize dependencies if host app provides them (uncomment to reduce bundle size)
        // 'vue',
      ],
    },
    minify: false // Keep exports readable
  },
  server: {
    port: 5174,
    strictPort: true
  }
});
