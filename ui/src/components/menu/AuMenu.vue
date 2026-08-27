<template>
  <ul
    ref="menuRef"
    class="au-menu au-component"
    :class="[`is-${mode}`, { 'is-collapsed': collapse && mode === 'vertical', 'is-disabled': disabled }]"
    role="menu"
    :aria-label="ariaLabel"
    :aria-orientation="mode"
    v-bind="$attrs"
    @focusin="handleFocusin"
    @focusout="handleFocusout"
    @keydown="handleKeydown"
  >
    <slot></slot>
  </ul>
</template>

<script setup>
import { computed, provide, shallowReactive, ref } from 'vue';
import { AU_MENU_CONTEXT_KEY } from './menu-context.js';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  mode: {
    type: String,
    default: 'vertical',
    validator: (value) => ['vertical', 'horizontal'].includes(value),
  },
  collapse: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  loop: { type: Boolean, default: true },
  ariaLabel: { type: String, default: '导航菜单' },
});

const emit = defineEmits(['update:modelValue', 'select', 'change']);
const menuRef = ref(null);
const itemStates = shallowReactive([]);
const focusedUid = ref(null);

function registerItem(state) {
  if (itemStates.some((item) => item.uid === state.uid)) return;
  itemStates.push(state);
}

function unregisterItem(uid) {
  const itemIndex = itemStates.findIndex((item) => item.uid === uid);
  if (itemIndex >= 0) itemStates.splice(itemIndex, 1);
  if (focusedUid.value === uid) focusedUid.value = null;
}

function isActive(index) {
  return Object.is(props.modelValue, index);
}

function isItemDisabled(state) {
  return props.disabled || state.disabled.value;
}

function sortItemsByDocumentOrder(items) {
  return [...items].sort((firstItem, secondItem) => {
    const firstElement = firstItem.element.value;
    const secondElement = secondItem.element.value;
    if (!firstElement || !secondElement) return 0;

    const position = firstElement.compareDocumentPosition(secondElement);
    if (position & 4) return -1;
    if (position & 2) return 1;
    return 0;
  });
}

function getFocusableItem() {
  const enabledItems = sortItemsByDocumentOrder(
    itemStates.filter((item) => !isItemDisabled(item)),
  );
  return enabledItems.find((item) => item.uid === focusedUid.value)
    || enabledItems.find((item) => isActive(item.index.value))
    || enabledItems[0]
    || null;
}

function getItemTabIndex(uid) {
  const target = itemStates.find((item) => item.uid === uid);
  if (!target || isItemDisabled(target)) return -1;
  return getFocusableItem()?.uid === uid ? 0 : -1;
}

function selectItem(index, event) {
  if (props.disabled) return;

  const previousValue = props.modelValue;
  emit('select', index, event);
  if (Object.is(previousValue, index)) return;

  emit('update:modelValue', index);
  emit('change', index, previousValue);
}

function getEnabledButtons() {
  if (!menuRef.value) return [];
  return Array.from(menuRef.value.querySelectorAll('[data-au-menu-item]:not(:disabled)'));
}

function handleFocusin(event) {
  const focusedButton = event.target.closest?.('[data-au-menu-item]');
  const focusedItem = itemStates.find((item) => item.element.value === focusedButton);
  focusedUid.value = focusedItem?.uid ?? null;
}

function handleFocusout(event) {
  if (menuRef.value?.contains(event.relatedTarget)) return;
  focusedUid.value = null;
}

function resolveKeyboardDirection(key) {
  if (props.mode === 'vertical') {
    if (key === 'ArrowDown') return 1;
    if (key === 'ArrowUp') return -1;
    return 0;
  }

  if (!['ArrowLeft', 'ArrowRight'].includes(key)) return 0;
  const isRtl = menuRef.value && getComputedStyle(menuRef.value).direction === 'rtl';
  const direction = key === 'ArrowRight' ? 1 : -1;
  return isRtl ? -direction : direction;
}

function moveFocus(buttons, currentIndex, direction) {
  if (currentIndex < 0) {
    buttons[direction > 0 ? 0 : buttons.length - 1].focus();
    return;
  }

  const requestedIndex = currentIndex + direction;
  const nextIndex = props.loop
    ? (requestedIndex + buttons.length) % buttons.length
    : Math.max(0, Math.min(requestedIndex, buttons.length - 1));
  buttons[nextIndex].focus();
}

function handleKeydown(event) {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

  const buttons = getEnabledButtons();
  if (buttons.length === 0) return;

  if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault();
    buttons[event.key === 'Home' ? 0 : buttons.length - 1].focus();
    return;
  }

  const direction = resolveKeyboardDirection(event.key);
  if (direction === 0) return;

  event.preventDefault();
  const currentButton = event.target.closest?.('[data-au-menu-item]');
  moveFocus(buttons, buttons.indexOf(currentButton), direction);
}

function focus(index = props.modelValue) {
  const requestedItem = itemStates.find(
    (item) => Object.is(item.index.value, index) && !isItemDisabled(item),
  );
  const target = requestedItem || getFocusableItem();
  if (!target || !target.element.value) return false;
  target.element.value.focus();
  return true;
}

provide(AU_MENU_CONTEXT_KEY, {
  mode: computed(() => props.mode),
  collapsed: computed(() => props.collapse && props.mode === 'vertical'),
  disabled: computed(() => props.disabled),
  registerItem,
  unregisterItem,
  isActive,
  getItemTabIndex,
  selectItem,
});

defineExpose({ focus, menuRef });
</script>

<style scoped>
.au-menu {
  --au-menu-padding: 4px;
  --au-menu-gap: 2px;
  --au-menu-collapse-width: 48px;
  --au-menu-item-min-height: 36px;
  --au-menu-item-padding-block: 7px;
  --au-menu-item-padding-inline: 12px;
  --au-menu-item-gap: 10px;
  --au-menu-item-radius: var(--au-border-radius-base);
  --au-menu-item-font-size: var(--au-font-size-base);
  --au-menu-item-font-weight: var(--au-font-weight-medium);
  --au-menu-item-icon-size: 18px;
  --au-menu-item-color: var(--au-color-text-regular);
  --au-menu-item-hover-color: var(--au-color-text-primary);
  --au-menu-item-hover-bg: color-mix(in srgb, var(--au-color-primary) 8%, transparent);
  --au-menu-item-active-color: var(--au-color-primary);
  --au-menu-item-active-bg: color-mix(in srgb, var(--au-color-primary) 12%, transparent);
  --au-menu-item-pressed-bg: color-mix(in srgb, var(--au-menu-item-active-bg) 84%, var(--au-menu-item-active-color));
  --au-menu-item-disabled-opacity: 0.48;

  display: flex;
  min-width: 0;
  margin: 0;
  padding: var(--au-menu-padding);
  gap: var(--au-menu-gap);
  color: var(--au-menu-item-color);
  background: transparent;
  font-size: var(--au-menu-item-font-size);
  list-style: none;
}

.au-menu.is-vertical {
  width: 100%;
  flex-direction: column;
}

.au-menu.is-horizontal {
  width: max-content;
  max-width: 100%;
  flex-direction: row;
  overflow-x: auto;
  overflow-y: hidden;
}

.au-menu.is-collapsed.is-vertical {
  width: var(--au-menu-collapse-width);
}

.au-menu.is-disabled {
  cursor: not-allowed;
}
</style>
