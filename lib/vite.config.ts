import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    __DEV__: "(process.env.NODE_ENV !== 'production')",
  },
  build: {
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
    lib: {
      entry: 'src/index.ts',
      formats: ['cjs', 'es', 'iife'],
    },
    minify: 'terser',
  },
});
