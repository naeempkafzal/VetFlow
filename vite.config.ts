import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Standard src alias
      "@": path.resolve(__dirname, "./src"),
      // Critical: Points to your shared folder for schema imports
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // TypeScript builds can be heavy; this prevents memory crashes on Vercel's free tier
    sourcemap: false,
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true
  }
});