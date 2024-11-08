import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs'



export default defineConfig({
  base: '/iiif-viewer/',
  server: {
    open: true,
  },
  build: {
    outDir: 'dist',
  },
  plugins: [react()],
});
