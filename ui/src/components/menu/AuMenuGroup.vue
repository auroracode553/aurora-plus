<template>
  <li
    class="au-menu-group"
    :class="[`is-${menuMode}`, { 'is-collapsed': collapsed, 'is-spaced': spaced }]"
    role="presentation"
  >
    <span class="au-menu-group__label"><slot>{{ label }}</slot></span>
  </li>
</template>

<script setup>
import { computed, inject } from 'vue';
import { AU_MENU_CONTEXT_KEY } from './menu-context.js';

const props = defineProps({
  label: { type: String, default: '' },
  spaced: { type: Boolean, default: false },
});

const menu = inject(AU_MENU_CONTEXT_KEY, null);
const menuMode = computed(() => menu?.mode.value || 'vertical');
const collapsed = computed(() => Boolean(menu?.collapsed.value));
</script>

<style scoped>
.au-menu-group {
  box-sizing: border-box;
  display: block;
  min-width: 0;
  margin: 0;
  padding: 0 12px 8px;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
  font-weight: var(--au-font-weight-semibold);
  line-height: 1.25;
  list-style: none;
}

.au-menu-group.is-spaced {
  margin-top: 20px;
}

.au-menu-group.is-horizontal,
.au-menu-group.is-collapsed {
  display: none;
}

.au-menu-group__label {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
