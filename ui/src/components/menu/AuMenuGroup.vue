<template>
  <li
    class="au-menu-group au-component au-list-reset"
    :class="[`is-${menuMode}`, { 'is-collapsed': collapsed, 'is-spaced': spaced }]"
    role="presentation"
  >
    <span class="au-menu-group__label au-truncate"><slot>{{ label }}</slot></span>
  </li>
</template>

<script setup>
import { computed, inject } from 'vue';

const AU_MENU_CONTEXT_KEY = Symbol.for('aurora-plus.menu-context');

const props = defineProps({
  label: { type: String, default: '' },
  spaced: { type: Boolean, default: false },
});

const menu = inject(AU_MENU_CONTEXT_KEY, null);
const menuMode = computed(() => menu?.mode.value || 'vertical');
const collapsed = computed(() => Boolean(menu?.collapsed.value));
</script>

<style scoped lang="scss" src="./AuMenuGroup.scss"></style>
