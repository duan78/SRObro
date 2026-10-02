import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@srobro/shared': path.resolve(__dirname, '../shared/src'),
    },
  },
  server: {
    port: 3000,
    // Les assets (GLB/textures) sont RE-PATCHÉS par des scripts pendant le
    // développement: sans revalidation, le navigateur peut conserver une
    // version périmée par cache heuristique (bug pose "bras en l'air",
    // oct. 2026). On force la revalidation (ETag → 304 si identique).
    headers: {
      'Cache-Control': 'no-cache',
    },
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true,
      },
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'babylon-core': ['@babylonjs/core'],
          'babylon-gui': ['@babylonjs/gui'],
          'babylon-loaders': ['@babylonjs/loaders'],
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['@srobro/shared'],
  },
});
