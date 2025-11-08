import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../oneflow-shared/src'),
    },
  },
  server: {
    port: 5173,
    // Proxy is disabled - using direct API calls with CORS
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3001',
    //     changeOrigin: true,
    //   },
    // },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
});

