import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

const libraryEntries = {
  'aurora-plus': fileURLToPath(new URL('./src/index.js', import.meta.url)),
  icons: fileURLToPath(new URL('./src/icons.js', import.meta.url)),
  electron: fileURLToPath(new URL('./src/electron/index.js', import.meta.url)),
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
      fileName: (format, entryName) => {
        // npm 会排除嵌套 node_modules，内联依赖统一输出到 vendor。
        const moduleName = entryName.replace(/(^|\/)node_modules(?=\/)/g, '$1vendor');
        return `${moduleName}.${format === 'es' ? 'js' : 'cjs'}`;
      },
      cssFileName: 'aurora-plus',
    },
    cssCodeSplit: false,
    rolldownOptions: {
      // Vue 由业务项目提供；Tabler 图标则内联到 Aurora Plus 的发布产物。
      external: ['vue', 'electron'],
      output: {
        exports: 'named',
        preserveModules: true,
      },
    },
  },
});
