import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { asyncIcons } from './icons-plugin.js';

const libraryEntries = {
  'aurora-plus': fileURLToPath(new URL('./src/index.js', import.meta.url)),
  icons: fileURLToPath(new URL('./src/icons.js', import.meta.url)),
  electron: fileURLToPath(new URL('./src/electron/index.js', import.meta.url)),
};

export default defineConfig({
  plugins: [vue(), asyncIcons()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: libraryEntries,
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
      cssFileName: 'aurora-plus',
    },
    cssCodeSplit: false,
    rolldownOptions: {
      // Vue由业务项目提供，图标实现保留为按需请求的动态分块。
      external: ['vue', 'electron'],
      output: [
        { format: 'es', exports: 'named', chunkFileNames: 'icons/[name]-[hash].js' },
        { format: 'cjs', exports: 'named', chunkFileNames: 'icons/[name]-[hash].cjs' },
      ],
    },
  },
});
