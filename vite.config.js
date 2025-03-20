import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3001, // Frontend chạy trên port 3001
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Backend chạy trên port 3000
        changeOrigin: true,
      },
    },
  },
});