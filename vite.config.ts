import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Increase chunk size warning limit to avoid noisy warnings on Vercel
    chunkSizeWarningLimit: 1500,
  },
});
