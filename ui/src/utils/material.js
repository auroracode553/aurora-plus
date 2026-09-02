/**
 * Aurora Plus 的全局材质配置。
 * 材质通过根节点的 data-au-material 继承到所有组件，也支持局部容器覆盖。
 */
export const AURORA_MATERIALS = Object.freeze(['soft', 'clear', 'solid']);
export const DEFAULT_AURORA_MATERIAL = 'solid';

export function isAuroraMaterial(value) {
  return AURORA_MATERIALS.includes(value);
}

export function setAuroraMaterial(material, target) {
  if (!isAuroraMaterial(material)) return false;

  const element = target || getDefaultTarget();
  if (!element || !element.dataset) return false;

  element.dataset.auMaterial = material;
  return true;
}

export function getAuroraMaterial(target) {
  const element = target || getDefaultTarget();
  const material = element?.dataset?.auMaterial;
  return isAuroraMaterial(material) ? material : DEFAULT_AURORA_MATERIAL;
}

function getDefaultTarget() {
  if (typeof document === 'undefined') return null;
  return document.documentElement;
}
