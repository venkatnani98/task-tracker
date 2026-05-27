import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // In development (npm run dev), proxy /api requests to the backend.
  // In production (Docker), nginx handles this proxying instead.
  server: {
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});