<template>
  <li
    class="au-menu-item"
    :class="[`is-${menuMode}`, { 'is-collapsed': collapsed }]"
    role="none"
  >
    <button
      ref="buttonRef"
      class="au-menu-item__content au-focus-ring"
      :class="{ 'is-active': active, 'is-disabled': itemDisabled }"
      type="button"
      role="menuitem"
      data-au-menu-item
      :disabled="itemDisabled"
      :tabindex="tabIndex"
      :aria-current="active ? ariaCurrent : undefined"
      :aria-disabled="itemDisabled ? 'true' : undefined"
      :aria-label="collapsed && label ? label : undefined"
      :title="resolvedTitle"
      v-bind="$attrs"
      @click="handleClick"
    >
      <span v-if="$slots.icon || icon" class="au-menu-item__icon" aria-hidden="true">
        <slot name="icon" :active="active" :disabled="itemDisabled">
          <AuIcon :icon="icon" :color="iconColor" />
        </slot>
      </span>
      <span class="au-menu-item__label"><slot>{{ label }}</slot></span>
      <span v-if="$slots.suffix" class="au-menu-item__suffix">
        <slot name="suffix" :active="active" :disabled="itemDisabled"></slot>
      </span>
    </button>
  </li>
</template>

<script setup>
import { computed, getCurrentInstance, inject, onBeforeUnmount, onMounted, ref } from 'vue';
import { AuIcon } from '../icon/index.js';
import { AU_MENU_CONTEXT_KEY } from './menu-context.js';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  index: { type: [String, Number], required: true },
  label: { type: String, default: '' },
  icon: { type: [Object, Function], default: null },
  iconColor: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  title: { type: String, default: '' },
  ariaCurrent: { type: String, default: 'page' },
});

const menu = inject(AU_MENU_CONTEXT_KEY, null);
const instance = getCurrentInstance();
const buttonRef = ref(null);
const indexRef = computed(() => props.index);
const ownDisabled = computed(() => props.disabled);
const menuMode = computed(() => menu?.mode.value || 'vertical');
const collapsed = computed(() => Boolean(menu?.collapsed.value));
const itemDisabled = computed(() => props.disabled || Boolean(menu?.disabled.value));
const active = computed(() => Boolean(menu?.isActive(props.index)));
const tabIndex = computed(() => {
  if (itemDisabled.value) return -1;
  return menu ? menu.getItemTabIndex(instance.uid) : 0;
});
const resolvedTitle = computed(() => props.title || (collapsed.value ? props.label : '') || undefined);

function handleClick(event) {
  if (itemDisabled.value || !menu) return;
  menu.selectItem(props.index, event);
}

onMounted(() => {
  if (!menu) return;
  menu.registerItem({
    uid: instance.uid,
    index: indexRef,
    disabled: ownDisabled,
    element: buttonRef,
  });
});

onBeforeUnmount(() => {
  if (menu) menu.unregisterItem(instance.uid);
});
</script>

<style scoped>
.au-menu-item {
  display: block;
  min-width: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.au-menu-item.is-horizontal {
  flex: none;
}

.au-menu-item__content {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--au-menu-item-min-height);
  margin: 0;
  padding: var(--au-menu-item-padding-block) var(--au-menu-item-padding-inline);
  gap: var(--au-menu-item-gap);
  overflow: hidden;
  border: 0;
  border-radius: var(--au-menu-item-radius);
  color: var(--au-menu-item-color);
  background: transparent;
  font: inherit;
  font-size: var(--au-menu-item-font-size);
  font-weight: var(--au-menu-item-font-weight);
  line-height: 1.35;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  appearance: none;
  transition:
    color var(--au-transition-duration) var(--au-transition-ease),
    background var(--au-transition-duration) var(--au-transition-ease);
}

.au-menu-item__content:hover:not(:disabled),
.au-menu-item__content:focus-visible {
  color: var(--au-menu-item-hover-color);
  background: var(--au-menu-item-hover-bg);
}

.au-menu-item__content.is-active,
.au-menu-item__content.is-active:hover,
.au-menu-item__content.is-active:focus-visible {
  color: var(--au-menu-item-active-color);
  background: var(--au-menu-item-active-bg);
}

.au-menu-item__content:active:not(:disabled) {
  background: var(--au-menu-item-pressed-bg);
}

.au-menu-item__content:focus-visible {
  outline-offset: -2px;
}

.au-menu-item__content:disabled {
  cursor: not-allowed;
  opacity: var(--au-menu-item-disabled-opacity);
}

.au-menu-item__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  flex: none;
  color: currentColor;
  font-size: var(--au-menu-item-icon-size);
}

.au-menu-item__icon :deep(svg) {
  display: block;
  width: 1em;
  height: 1em;
}

.au-menu-item__label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.au-menu-item__suffix {
  display: inline-flex;
  align-items: center;
  margin-left: auto;
  flex: none;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
}

.au-menu-item.is-collapsed .au-menu-item__content {
  justify-content: center;
  padding-inline: 0;
}

.au-menu-item.is-collapsed .au-menu-item__label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
}

.au-menu-item.is-collapsed .au-menu-item__suffix {
  display: none;
}

@media (prefers-contrast: more) {
  .au-menu-item__content.is-active {
    outline: 1px solid currentColor;
    outline-offset: -1px;
  }
}
</style>
