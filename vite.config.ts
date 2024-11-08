import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs'

export default defineConfig({
  server: {
    open: true,
  },
  build: {
    outDir: 'dist',
  },
  plugins: [react()],
});
