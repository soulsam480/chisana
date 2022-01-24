import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    __DEV__: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'lib/src'),
    },
  },
  build: {
    minify: false,
  },
});
