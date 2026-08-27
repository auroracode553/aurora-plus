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
  --au-menu-list-radius: 14px;
  --au-menu-list-border: var(--au-material-border);
  --au-menu-list-divider: var(--au-color-border-lighter);
  --au-menu-list-divider-inset: 16px;
  --au-menu-list-row-min-height: 52px;
  --au-menu-list-row-padding-block: 12px;
  --au-menu-list-row-padding-inline: 16px;
  --au-menu-list-row-gap: 12px;
  --au-menu-list-title-size: var(--au-font-size-base);
  --au-menu-list-description-size: var(--au-font-size-small);
  --au-menu-list-interactive-bg: color-mix(in srgb, var(--au-color-primary) 7%, transparent);
  --au-menu-list-pressed-bg: color-mix(in srgb, var(--au-color-primary) 12%, transparent);

  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--au-menu-list-border);
  border-radius: var(--au-menu-list-radius);
  color: var(--au-color-text-primary);
  list-style: none;
}

.au-menu-list.is-compact {
  --au-menu-list-row-min-height: 44px;
  --au-menu-list-row-padding-block: 10px;
}

.au-menu-list.is-relaxed {
  --au-menu-list-row-min-height: 64px;
  --au-menu-list-row-padding-block: 14px;
  --au-menu-list-row-padding-inline: 18px;
  --au-menu-list-title-size: var(--au-font-size-large);
  --au-menu-list-description-size: var(--au-font-size-base);
}

@media (prefers-contrast: more) {
  .au-menu-list {
    border-color: var(--au-color-text-secondary);
  }
}
</style>
