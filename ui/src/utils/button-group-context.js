import { computed, inject, provide } from 'vue';

// 按钮组与浮动工具条共用尺寸上下文；插槽和 Teleport 不依赖父级 DOM 选择器。
const BUTTON_GROUP_CONTEXT = Symbol('aurora-plus.button-group');

export function provideButtonGroup(options = {}) {
  const defaults = { variant: 'connected', orientation: 'horizontal', size: 'default', iconOnly: false, inverse: false };
  const context = Object.fromEntries(Object.entries(defaults).map(([name, fallback]) => [
    name, computed(() => options[name] ? options[name]() : fallback),
  ]));
  provide(BUTTON_GROUP_CONTEXT, context);
  return context;
}

export function useButtonGroup() {
  return inject(BUTTON_GROUP_CONTEXT, null);
}
