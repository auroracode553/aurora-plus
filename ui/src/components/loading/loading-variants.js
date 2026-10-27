// 组件、指令和服务共用一份内置样式定义。
export const LOADING_VARIANTS = Object.freeze(['ring', 'dots', 'bars', 'orbit']);

export function normalizeLoadingVariant(value) {
  return LOADING_VARIANTS.includes(value) ? value : 'ring';
}

export const loadingVariantProp = {
  type: String,
  default: 'ring',
  validator: (value) => LOADING_VARIANTS.includes(value),
};
