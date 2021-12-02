import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    __DEV__: "(process.env.NODE_ENV !== 'production')",
  },
  build: {
    rollupOptions: {
      external: ['vue'],
    },
    lib: {
      entry: 'src/index.ts',
      formats: ['cjs', 'es'],
    },
    minify: 'terser',
  },
});
