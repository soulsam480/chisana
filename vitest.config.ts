/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    __DEV__: "(process.env.NODE_ENV !== 'production')",
  },
  test: {
    testTimeout: 2000,
    // threads: false,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});
