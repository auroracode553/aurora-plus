import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, parse } from 'node:path';

const VIRTUAL_MODULE_ID = 'virtual:aurora-plus-icon-metadata';
const RESOLVED_MODULE_ID = '\0aurora-plus-docs:icon-metadata';

/**
 * 在文档构建阶段读取 Aurora Plus 构建所用版本的 Tabler 官方分类元数据。
 * 元数据通过虚拟模块提供给图标目录，不进入 Aurora Plus 的运行时产物。
 */
export function iconMetadataPlugin() {
  return {
    name: 'aurora-plus-docs:icon-metadata',

    resolveId(id) {
      return id === VIRTUAL_MODULE_ID ? RESOLVED_MODULE_ID : null;
    },

    load(id) {
      if (id !== RESOLVED_MODULE_ID) return null;

      const metadataPath = resolveTablerMetadataPath();
      this.addWatchFile(metadataPath);

      const metadata = JSON.parse(readFileSync(metadataPath, 'utf8'));
      const componentMetadata = createComponentMetadata(metadata);

      return `export default ${JSON.stringify(componentMetadata)};`;
    },
  };
}

function resolveTablerMetadataPath() {
  const docsRequire = createRequire(import.meta.url);
  const auroraPlusPackagePath = docsRequire.resolve('aurora-plus/package.json');
  const auroraPlusRequire = createRequire(auroraPlusPackagePath);
  const iconsVuePackagePath = auroraPlusRequire.resolve('@tabler/icons-vue/package.json');

  let currentDirectory = dirname(iconsVuePackagePath);
  const rootDirectory = parse(currentDirectory).root;

  while (currentDirectory !== rootDirectory) {
    const candidate = join(
      currentDirectory,
      'node_modules',
      '@tabler',
      'icons',
      'icons.json',
    );
    if (existsSync(candidate)) return candidate;
    currentDirectory = dirname(currentDirectory);
  }

  throw new Error('无法读取 Aurora Plus 构建所用的 Tabler Icons 分类元数据。');
}

function createComponentMetadata(metadata) {
  const componentMetadata = {};

  Object.values(metadata).forEach((icon) => {
    const componentName = `Icon${toPascalCase(icon.name)}`;

    if (icon.styles.outline) {
      componentMetadata[componentName] = [icon.category, 'outline'];
    }
    if (icon.styles.filled) {
      componentMetadata[`${componentName}Filled`] = [icon.category, 'filled'];
    }
  });

  return componentMetadata;
}

function toPascalCase(value) {
  return value
    .split('-')
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join('');
}
