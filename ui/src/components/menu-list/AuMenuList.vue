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

const AU_MENU_LIST_CONTEXT_KEY = Symbol.for('aurora-plus.menu-list-context');

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

<style scoped lang="scss" src="./AuMenuList.scss"></style>
