import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

/**
 * VetFlow Build Configuration
 * Resolves: React 18/19 conflicts, Shared Folder pathing, and Vercel Deployment
 */
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Allows imports like "@/components/..."
      "@": path.resolve(__dirname, "./src"),
      // Allows imports like "@shared/schema" from the shared folder
      "@shared": path.resolve(__dirname, "./shared"), 
    },
  },
  build: {
    // Standard Vercel output directory
    outDir: 'dist',
    // Cleans the folder before every build to prevent old error files from sticking
    emptyOutDir: true,
    // Ensures large files don't crash the free-tier build
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true
  }
});