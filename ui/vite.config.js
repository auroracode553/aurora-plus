import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.js', import.meta.url)),
      name: 'AuroraUI',
      formats: ['es', 'umd'],
      fileName: (format) => (format === 'es' ? 'aurora-ui.js' : 'aurora-ui.umd.cjs'),
      cssFileName: 'aurora-ui',
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: ['vue', '@tabler/icons-vue'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          '@tabler/icons-vue': 'TablerIconsVue',
        },
      },
    },
  },
});
