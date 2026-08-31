<template>
  <li
    class="au-menu-item au-component au-list-reset"
    :class="[`is-${menuMode}`, { 'is-collapsed': collapsed }]"
    role="none"
  >
    <button
      ref="buttonRef"
      class="au-menu-item__content au-control-reset au-focus-ring au-contrast-current"
      :class="{ 'is-active': active, 'au-disabled': itemDisabled }"
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
      <span v-if="$slots.icon || icon" class="au-menu-item__icon au-inline-center" aria-hidden="true">
        <slot name="icon" :active="active" :disabled="itemDisabled">
          <AuIcon :icon="icon" :color="iconColor" />
        </slot>
      </span>
      <span
        class="au-menu-item__label au-flex-truncate"
        :class="{ 'au-visually-hidden': collapsed }"
      ><slot>{{ label }}</slot></span>
      <span v-if="hasMeta" class="au-menu-item__meta au-inline-center au-meta-muted">
        <slot name="suffix" :active="active" :disabled="itemDisabled">
          <span v-if="hasBadge" class="au-menu-item__badge au-inline-center">{{ badge }}</span>
          <span v-if="indicator" class="au-menu-item__indicator" aria-hidden="true"></span>
        </slot>
      </span>
    </button>
  </li>
</template>

<script setup>
import { computed, getCurrentInstance, inject, onBeforeUnmount, onMounted, ref, useSlots } from 'vue';
import { AuIcon } from '../icon/index.js';
import { AU_MENU_CONTEXT_KEY } from './menu-context.js';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  index: { type: [String, Number], required: true },
  label: { type: String, default: '' },
  icon: { type: [Object, Function], default: null },
  iconColor: { type: String, default: '' },
  badge: { type: [String, Number], default: '' },
  indicator: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  title: { type: String, default: '' },
  ariaCurrent: { type: String, default: 'page' },
});

const menu = inject(AU_MENU_CONTEXT_KEY, null);
const instance = getCurrentInstance();
const slots = useSlots();
const buttonRef = ref(null);
const indexRef = computed(() => props.index);
const ownDisabled = computed(() => props.disabled);
const menuMode = computed(() => menu?.mode.value || 'vertical');
const collapsed = computed(() => Boolean(menu?.collapsed.value));
const itemDisabled = computed(() => props.disabled || Boolean(menu?.disabled.value));
const active = computed(() => Boolean(menu?.isActive(props.index)));
const hasBadge = computed(() => props.badge !== '');
const hasMeta = computed(() => hasBadge.value || props.indicator || Boolean(slots.suffix));
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
}

.au-menu-item.is-horizontal {
  flex: none;
}

.au-menu-item__content {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 42px;
  padding: 0 12px;
  gap: 11px;
  overflow: visible;
  border: 1px solid transparent;
  border-radius: var(--au-radius-control);
  color: var(--au-color-text-secondary);
  background: transparent;
  font-size: var(--au-font-size-base);
  font-weight: var(--au-font-weight-medium);
  line-height: 1.35;
  letter-spacing: 0;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  transition:
    transform 0.14s var(--au-transition-timing),
    color var(--au-transition-duration) var(--au-transition-timing),
    background var(--au-transition-duration) var(--au-transition-timing),
    border-color var(--au-transition-duration) var(--au-transition-timing);
}

.au-menu-item__content:hover:not(:disabled),
.au-menu-item__content:focus-visible {
  color: var(--au-color-text-default);
  background: color-mix(in srgb, var(--au-color-primary) 6%, transparent);
}

.au-menu-item__content.is-active,
.au-menu-item__content.is-active:hover,
.au-menu-item__content.is-active:focus-visible {
  color: var(--au-color-primary);
  border-color: color-mix(in srgb, var(--au-color-primary) 24%, transparent);
  background: color-mix(in srgb, var(--au-color-primary) 12%, transparent);
}

.au-menu-item__content.is-active::before {
  position: absolute;
  top: 50%;
  left: -14px;
  width: 3px;
  height: 24px;
  border-radius: 0 var(--au-radius-compact) var(--au-radius-compact) 0;
  background: var(--au-color-primary);
  content: "";
  transform: translateY(-50%);
}

.au-menu-item__content:active:not(:disabled) {
  transform: scale(0.98);
}

.au-menu-item__content:focus-visible {
  outline-offset: -2px;
}

.au-menu-item__icon {
  width: auto;
  height: 20px;
  aspect-ratio: 1;
  flex: none;
  color: currentColor;
  font-size: 20px;
  transition: color var(--au-transition-duration) var(--au-transition-timing);
}

.au-menu-item__icon :deep(svg) {
  display: block;
  width: 1em;
  height: 1em;
}

.au-menu-item__meta {
  gap: 6px;
  font-size: var(--au-font-size-small);
}

.au-menu-item__badge {
  min-width: 28px;
  height: 20px;
  padding: 0 8px;
  border: 1px solid color-mix(in srgb, var(--au-color-primary) 18%, var(--au-color-border-muted));
  border-radius: var(--au-radius-pill);
  background: color-mix(in srgb, var(--au-color-primary) 8%, var(--au-material-background-subtle));
  color: var(--au-color-text-secondary);
  font-size: 11px;
  font-weight: var(--au-font-weight-semibold);
  line-height: 1;
}

.au-menu-item__indicator {
  width: auto;
  height: 8px;
  aspect-ratio: 1;
  border-radius: var(--au-radius-pill);
  background: var(--au-color-text-secondary);
}

.au-menu-item__content.is-active .au-menu-item__badge {
  color: var(--au-color-primary);
  background: color-mix(in srgb, var(--au-color-primary) 12%, var(--au-material-background-subtle));
}

.au-menu-item.is-collapsed .au-menu-item__content {
  width: 44px;
  min-height: 44px;
  justify-content: center;
  padding-inline: 0;
}

.au-menu-item.is-collapsed .au-menu-item__meta {
  display: none;
}

.au-menu-item.is-collapsed .au-menu-item__content.is-active::before {
  left: -4px;
}

.au-menu-item.is-horizontal .au-menu-item__content {
  width: auto;
  min-height: 34px;
  padding: 0 12px;
  border-radius: var(--au-radius-control);
}

.au-menu-item.is-horizontal .au-menu-item__content.is-active::before {
  top: auto;
  right: 12px;
  bottom: -4px;
  left: 12px;
  width: auto;
  height: 2px;
  border-radius: var(--au-radius-pill);
  transform: none;
}

</style>
