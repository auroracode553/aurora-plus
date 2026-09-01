<template>
  <ul
    class="au-menu-list au-component au-material-surface au-material-surface--base au-surface-frame au-surface-frame--rounded"
    :class="[`is-${density}`, { 'au-depth-surface': elevated }]"
    role="list"
    :aria-label="ariaLabel || undefined"
  >
    <slot></slot>
  </ul>
</template>

<script setup>
import { computed, provide } from 'vue';
import { AU_MENU_LIST_CONTEXT_KEY } from './menu-list-context.js';

const props = defineProps({
  density: {
    type: String,
    default: 'default',
    validator: (value) => ['compact', 'default', 'relaxed'].includes(value),
  },
  divided: { type: Boolean, default: true },
  elevated: { type: Boolean, default: true },
  ariaLabel: { type: String, default: '' },
});

provide(AU_MENU_LIST_CONTEXT_KEY, {
  density: computed(() => props.density),
  divided: computed(() => props.divided),
});
</script>

<style scoped lang="scss">
/* 在组件边界内重置语义列表，避免宿主页面的 ul 样式缩进交互行。 */
.au-menu-list {
  display: block;
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
  list-style: none;
  color: var(--au-color-text-primary);
}
</style>
