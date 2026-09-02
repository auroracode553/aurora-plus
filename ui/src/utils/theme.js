/**
 * Aurora Plus 的全局主题模式配置。
 * 主题通过根节点的 data-au-theme 继承到所有组件，也支持局部容器覆盖。
 */
export const AURORA_THEMES = Object.freeze(['light', 'dark']);
export const DEFAULT_AURORA_THEME = 'light';

export function isAuroraTheme(value) {
  return AURORA_THEMES.includes(value);
}

export function setAuroraTheme(theme, target) {
  if (!isAuroraTheme(theme)) return false;

  const element = target || getDefaultTarget();
  if (!element || !element.dataset) return false;

  if (!target && theme === DEFAULT_AURORA_THEME) {
    delete element.dataset.auTheme;
  } else {
    element.dataset.auTheme = theme;
  }

  return true;
}

export function getAuroraTheme(target) {
  const element = target || getDefaultTarget();
  const theme = element?.dataset?.auTheme;
  return isAuroraTheme(theme) ? theme : DEFAULT_AURORA_THEME;
}

function getDefaultTarget() {
  if (typeof document === 'undefined') return null;
  return document.documentElement;
}
