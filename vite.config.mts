import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/iiif-viewer/',
  server: {
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: 'inline',
  },
  plugins: [react()],
});
