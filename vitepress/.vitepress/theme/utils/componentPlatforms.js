export const platformLabels = { browser: '浏览器', electron: 'Electron' };

/** 未声明的平台默认支持浏览器和 Electron；未知平台不显示为有效能力。 */
export function getComponentPlatforms(frontmatter) {
  const platforms = frontmatter.platforms || ['browser', 'electron'];
  return platforms.filter((platform) => Object.hasOwn(platformLabels, platform));
}
