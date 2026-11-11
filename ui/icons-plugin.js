import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const iconsEntry = fileURLToPath(new URL('./src/icons.js', import.meta.url)).replaceAll('\\', '/');
const tablerEntry = new URL(import.meta.resolve('@tabler/icons-vue/dist/esm/tabler-icons-vue.mjs'));

// 库构建与文档源码模式共用：只转换真实图标入口，不创建虚拟模块或图标构建入口。
export function asyncIcons() {
  return {
    name: 'aurora-async-icons',
    enforce: 'pre',
    load(id) {
      if (id !== iconsEntry) return null;
      this.addWatchFile(fileURLToPath(tablerEntry));
      const exports = readFileSync(tablerEntry, 'utf8')
        .matchAll(/export\s*\{([^}]+)\}\s*from\s*['"](\.\/icons\/[^'"]+)['"]/g);
      return [
        'import { defineAsyncComponent } from "vue";',
        ...Array.from(exports, ([, names, path]) => {
          const name = path.slice(path.lastIndexOf('/') + 1, -4);
          const filename = fileURLToPath(new URL(path, tablerEntry)).replaceAll('\\', '/');
          return `const ${name} = /*#__PURE__*/ defineAsyncComponent({ loader: () => import(${JSON.stringify(filename)}).then(module => module.default), delay: 0, suspensible: false });\nexport { ${names.replaceAll('default', name)} };`;
        }),
      ].join('\n');
    },
  };
}
