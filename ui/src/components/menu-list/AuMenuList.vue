<template>
  <ul
    class="au-menu-list au-component au-material-surface au-material-surface--base"
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

<style scoped>
.au-menu-list {
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--au-material-border);
  border-radius: 14px;
  color: var(--au-color-text-primary);
  list-style: none;
}

@media (prefers-contrast: more) {
  .au-menu-list {
    border-color: var(--au-color-text-secondary);
  }
}
</style>
