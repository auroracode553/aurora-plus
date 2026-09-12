import { computed, inject, provide } from 'vue';

const OVERLAY_LAYER_KEY = Symbol('aurora-overlay-layer');

// Vue 上下文跨 Teleport 保留，让内层浮层始终位于所属浮层之上。
// 每个组件实例独立计算，不依赖全局计数器，也不修改业务组件状态。
export function useOverlayLayer(getBaseLayer) {
  const parentLayer = inject(OVERLAY_LAYER_KEY, null);
  const layer = computed(() => {
    const base = getBaseLayer();
    if (!parentLayer) return base;
    const parent = parentLayer.value;
    return typeof base === 'number' && typeof parent === 'number'
      ? Math.max(base, parent + 1)
      : `max(${base}, calc(${parent} + 1))`;
  });
  provide(OVERLAY_LAYER_KEY, layer);
  return layer;
}
