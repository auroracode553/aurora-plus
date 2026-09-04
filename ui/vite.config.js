import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

const libraryEntries = {
  'aurora-plus': fileURLToPath(new URL('./src/index.js', import.meta.url)),
  icons: fileURLToPath(new URL('./src/icons.js', import.meta.url)),
};

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: libraryEntries,
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => (
        format === 'es' ? `${entryName}.js` : `${entryName}.cjs`
      ),
      cssFileName: 'aurora-plus',
    },
    cssCodeSplit: false,
    rollupOptions: {
      // Vue 由业务项目提供；Tabler 图标则内联到 Aurora Plus 的发布产物。
      external: ['vue'],
      output: {
        exports: 'named',
      },
    },
  },
});
