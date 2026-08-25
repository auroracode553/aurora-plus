import { shallowReactive } from 'vue';

const iconStore = shallowReactive(Object.create(null));

const builtInIcons = {
  close: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M208.49 191.51a12 12 0 0 1-17 17L128 145l-63.51 63.49a12 12 0 0 1-17-17L111 128 47.51 64.49a12 12 0 0 1 17-17L128 111l63.51-63.52a12 12 0 0 1 17 17L145 128Z"/></svg>',
  loading: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M232 128a104 104 0 0 1-208 0c0-41 23.81-78.36 60.66-95.27a8 8 0 0 1 6.68 14.54C60.15 61.59 40 93.27 40 128a88 88 0 0 0 176 0c0-34.73-20.15-66.41-51.34-80.73a8 8 0 0 1 6.68-14.54C208.19 49.64 232 87 232 128Z"/></svg>',
  'chevron-right': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="m181.66 133.66-80 80a8 8 0 0 1-11.32-11.32L164.69 128 90.34 53.66a8 8 0 0 1 11.32-11.32l80 80a8 8 0 0 1 0 11.32Z"/></svg>',
};

function normalizeName(name) {
  const value = String(name || '').trim();
  return value.includes(':') ? value.slice(value.lastIndexOf(':') + 1) : value;
}

/**
 * 注册可信 SVG 字符串。SVG 会通过 v-html 渲染，请勿传入未经校验的用户内容。
 */
export function registerIcons(icons, options = {}) {
  const overwrite = options.overwrite !== false;
  Object.entries(icons || {}).forEach(([name, source]) => {
    const normalizedName = normalizeName(name);
    if (!normalizedName || typeof source !== 'string') return;
    if (!overwrite && iconStore[normalizedName]) return;
    iconStore[normalizedName] = source;
  });
}

export function unregisterIcon(name) {
  delete iconStore[normalizeName(name)];
}

export function getIconSource(name) {
  return iconStore[normalizeName(name)] || '';
}

registerIcons({
  ...builtInIcons,
  'x-bold': builtInIcons.close,
  'circle-notch': builtInIcons.loading,
  'caret-right': builtInIcons['chevron-right'],
});
