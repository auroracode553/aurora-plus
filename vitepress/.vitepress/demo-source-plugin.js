import { readFile } from 'node:fs/promises';
import { createHighlighter } from 'shiki';

const DEMO_SOURCE_QUERY = 'demo-source';
const VIRTUAL_MODULE_PREFIX = '\0aurora-docs:demo-source:';
const VIRTUAL_MODULE_SUFFIX = '.js';
const CODE_THEMES = {
  light: 'github-light',
  dark: 'github-dark',
};

/**
 * 在 Vite 构建阶段把真实示例文件转换为源码文本与 Shiki 高亮 HTML。
 * 浏览器只接收转换结果，不需要加载 Shiki 或重复解析代码。
 */
export function demoSourcePlugin() {
  let highlighterPromise = null;

  return {
    name: 'aurora-docs:demo-source',
    enforce: 'pre',

    async resolveId(id, importer) {
      const [requestPath, query = ''] = id.split('?', 2);
      if (!new URLSearchParams(query).has(DEMO_SOURCE_QUERY)) return null;

      const resolved = await this.resolve(requestPath, importer, { skipSelf: true });
      if (!resolved) return null;

      // 使用不以 .vue 结尾的虚拟模块 ID，避免 @vitejs/plugin-vue 二次解析高亮模块。
      return `${VIRTUAL_MODULE_PREFIX}${resolved.id}${VIRTUAL_MODULE_SUFFIX}`;
    },

    async load(id) {
      if (!id.startsWith(VIRTUAL_MODULE_PREFIX) || !id.endsWith(VIRTUAL_MODULE_SUFFIX)) return null;

      const filePath = id.slice(VIRTUAL_MODULE_PREFIX.length, -VIRTUAL_MODULE_SUFFIX.length);

      const source = compactSource(await readFile(filePath, 'utf8'));
      const highlighter = await getHighlighter();
      const highlighted = highlighter.codeToHtml(source, {
        lang: 'vue',
        themes: CODE_THEMES,
        defaultColor: false,
        transformers: [
          {
            name: 'aurora-docs:code-class',
            pre(node) {
              this.addClassToHast(node, 'vp-code');
              delete node.properties.style;
            },
          },
        ],
      });

      return [
        `export const source = ${JSON.stringify(source)};`,
        `export const highlighted = ${JSON.stringify(highlighted)};`,
        'export default { source, highlighted };',
      ].join('\n');
    },
  };

  function getHighlighter() {
    if (!highlighterPromise) {
      highlighterPromise = createHighlighter({
        langs: ['vue'],
        themes: Object.values(CODE_THEMES),
      });
    }
    return highlighterPromise;
  }
}

function compactSource(source) {
  return source
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '')
    .join('\n')
    .trim();
}
