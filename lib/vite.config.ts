import { defineConfig } from 'vite';

import { resolve } from 'path';

const globals = {
  vue: 'Vue',
};

export default defineConfig({
  define: {
    __DEV__: "(process.env.NODE_ENV !== 'production')",
  },
  build: {
    minify: 'terser',
    rollupOptions: {
      external: ['vue'],
      input: {
        index: resolve(__dirname, 'src/index.ts'),
        utils: resolve(__dirname, 'src/utils/index.ts'),
      },
      output: [
        {
          entryFileNames: ({ name: fileName }) => {
            return `${fileName}.js`;
          },
          format: 'cjs',
          exports: 'named',
          globals,
          preserveModules: true,
        },
        {
          entryFileNames: ({ name: fileName }) => {
            return `${fileName}.mjs`;
          },
          format: 'esm',
          globals,
          preserveModules: true,
        },
      ],
    },
    lib: {
      entry: 'src/index.ts',
      formats: ['cjs', 'es'],
    },
  },
});
