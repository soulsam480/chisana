/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  define: {
    __DEV__: "(process.env.NODE_ENV !== 'production')",
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'lib/src'),
    },
  },
  test: {
    testTimeout: 2000,
    // threads: false,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      reporter: ['text', 'html'],
    },
    environment: 'happy-dom',
  },
});
