import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Point to local source for instant rebuilds
      'widget-sdk-react': path.resolve(__dirname, '../../packages/react/src/index.tsx'),
      'widget-sdk-core': path.resolve(__dirname, '../../packages/core/src/index.ts')
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    }
  },
  server: {
    port: 5173,
    strictPort: true
  }
});


