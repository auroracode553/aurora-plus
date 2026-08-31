<template>
  <div class="au-dropdown au-component" :class="{ 'is-disabled': disabled }" v-bind="$attrs">
    <span
      ref="triggerRef"
      class="au-dropdown__trigger"
      :aria-haspopup="'menu'"
      :aria-expanded="visible"
      :aria-controls="visible ? menuId : undefined"
      :aria-disabled="disabled ? 'true' : undefined"
      @click="handleTriggerClick"
      @keydown="handleTriggerKeydown"
    >
      <slot name="trigger">
        <slot>
          <AuButton :disabled="disabled">打开菜单</AuButton>
        </slot>
      </slot>
    </span>

    <Teleport :to="appendTo" :disabled="!teleported">
      <Transition name="au-dropdown-fade">
        <div
          v-if="visible"
          ref="menuRef"
          :id="menuId"
          class="au-dropdown__menu au-component au-material-surface au-depth-surface au-motion-popover au-menu-surface"
          :class="`is-${activePlacement}`"
          :style="menuStyle"
          role="menu"
          :aria-label="ariaLabel"
          tabindex="-1"
          @pointerdown.stop
          @keydown="handleMenuKeydown"
        >
          <slot name="menu" :close="close" :select="selectItem">
            <template v-for="(item, index) in items" :key="resolveItemKey(item, index)">
              <div
                v-if="isDivider(item)"
                class="au-dropdown__divider"
                role="separator"
              ></div>
              <button
                v-else
                :id="itemId(index)"
                class="au-dropdown__item au-menu-item"
                :class="{ 'is-danger': item.danger, 'is-active': item.active }"
                type="button"
                role="menuitem"
                :aria-current="item.active ? 'true' : undefined"
                :disabled="item.disabled || selecting"
                @click="selectItem(item)"
              >
                <AuIcon v-if="item.icon" class="au-dropdown__item-icon" :icon="item.icon" />
                <span class="au-dropdown__item-label">{{ resolveItemLabel(item) }}</span>
                <span v-if="item.shortcut" class="au-dropdown__shortcut">{{ item.shortcut }}</span>
              </button>
            </template>
            <div v-if="items.length === 0" class="au-dropdown__empty">暂无选项</div>
          </slot>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { AuButton } from '../button/index.js';
import { AuIcon } from '../icon/index.js';

defineOptions({ inheritAttrs: false });

const VIEWPORT_GAP = 8;
const DROPDOWN_ID_PREFIX = 'au-dropdown-';
let dropdownSeed = 0;

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  items: { type: Array, default: () => [] },
  placement: {
    type: String,
    default: 'bottom-start',
    validator: (value) => ['top-start', 'top', 'top-end', 'bottom-start', 'bottom', 'bottom-end'].includes(value),
  },
  offset: { type: Number, default: 6 },
  matchTriggerWidth: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  closeOnSelect: { type: Boolean, default: true },
  closeOnClickOutside: { type: Boolean, default: true },
  beforeSelect: { type: Function, default: null },
  itemKey: { type: Function, default: null },
  teleported: { type: Boolean, default: true },
  appendTo: { type: [String, Object], default: 'body' },
  ariaLabel: { type: String, default: '下拉菜单' },
  zIndex: { type: Number, default: 1200 },
});

const emit = defineEmits(['update:modelValue', 'open', 'close', 'select', 'command', 'cancel']);
const triggerRef = ref(null);
const menuRef = ref(null);
const visible = ref(Boolean(props.modelValue));
const selecting = ref(false);
const activePlacement = ref(props.placement);
const triggerWidth = ref(0);
const menuPosition = ref({ x: 0, y: 0 });
const dropdownId = `${DROPDOWN_ID_PREFIX}${++dropdownSeed}`;
const menuId = `${dropdownId}-menu`;
let updateFrame = null;

const menuStyle = computed(() => ({
  left: `${menuPosition.value.x}px`,
  top: `${menuPosition.value.y}px`,
  zIndex: props.zIndex,
  ...(props.matchTriggerWidth && triggerWidth.value > 0 ? { minWidth: `${triggerWidth.value}px` } : {}),
}));

function getTriggerElement() {
  if (!triggerRef.value) return null;
  return triggerRef.value.firstElementChild || triggerRef.value;
}

function open(focusDirection = 0) {
  if (props.disabled || visible.value) {
    if (visible.value && focusDirection) focusMenu(focusDirection);
    return;
  }
  visible.value = true;
  emit('update:modelValue', true);
  emit('open');
  nextTick(async () => {
    await updatePosition();
    if (focusDirection) focusMenu(focusDirection);
  });
}

function close(reason = 'api', restoreFocus = true) {
  if (!visible.value) return;
  visible.value = false;
  selecting.value = false;
  emit('update:modelValue', false);
  emit('close', reason);
  if (restoreFocus) nextTick(() => getTriggerElement()?.focus?.());
}

function toggle() {
  if (props.disabled) return;
  if (visible.value) close('toggle');
  else open();
}

function handleTriggerClick() {
  toggle();
}

function handleTriggerKeydown(event) {
  if (props.disabled) return;
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    open(event.key === 'ArrowDown' ? 1 : -1);
    return;
  }
  if ((event.key === 'Enter' || event.key === ' ') && !isInteractiveTarget(event.target)) {
    event.preventDefault();
    toggle();
    return;
  }
  if (event.key === 'Escape' && visible.value) {
    event.preventDefault();
    close('escape');
  }
}

function isInteractiveTarget(target) {
  return Boolean(target?.matches?.('button, a, input, select, textarea, [role="button"]'));
}

function handleMenuKeydown(event) {
  if (event.key === 'Escape') {
    event.preventDefault();
    close('escape');
    return;
  }
  if (event.key === 'Tab') {
    close('tab', false);
    return;
  }
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const buttons = getEnabledItems();
  if (buttons.length === 0) return;
  const currentIndex = buttons.indexOf(document.activeElement);
  let nextIndex = 0;
  if (event.key === 'Home') nextIndex = 0;
  else if (event.key === 'End') nextIndex = buttons.length - 1;
  else if (event.key === 'ArrowDown') nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % buttons.length;
  else nextIndex = currentIndex < 0 ? buttons.length - 1 : (currentIndex - 1 + buttons.length) % buttons.length;
  buttons[nextIndex].focus();
}

function focusMenu(direction = 1) {
  const buttons = getEnabledItems();
  if (buttons.length === 0) return;
  buttons[direction < 0 ? buttons.length - 1 : 0].focus();
}

function getEnabledItems() {
  if (!menuRef.value) return [];
  return Array.from(menuRef.value.querySelectorAll('.au-dropdown__item:not(:disabled)'));
}

async function selectItem(item) {
  if (!item || item.disabled || selecting.value) return;
  selecting.value = true;
  try {
    const allowed = props.beforeSelect ? await props.beforeSelect(item) : true;
    if (allowed === false) {
      emit('cancel', item);
      return;
    }
    emit('select', item);
    emit('command', item.command ?? item.value ?? item);
    if (props.closeOnSelect) close('select');
  } finally {
    selecting.value = false;
  }
}

function resolveItemKey(item, index) {
  if (props.itemKey) return props.itemKey(item, index);
  return item?.id ?? item?.value ?? index;
}

function resolveItemLabel(item) {
  return item?.label ?? item?.text ?? item?.value ?? '';
}

function isDivider(item) {
  return item?.type === 'divider' || item?.type === 'separator' || item?.divider === true;
}

function itemId(index) {
  return `${dropdownId}-${index}`;
}

async function updatePosition() {
  const trigger = getTriggerElement();
  const menu = menuRef.value;
  if (!trigger || !menu || typeof window === 'undefined') return;

  const triggerRect = trigger.getBoundingClientRect();
  triggerWidth.value = Math.min(triggerRect.width, Math.max(window.innerWidth - VIEWPORT_GAP * 2, 0));
  if (props.matchTriggerWidth) await nextTick();
  if (!menuRef.value) return;
  const menuRect = menu.getBoundingClientRect();
  const [requestedBase, requestedAlign] = props.placement.split('-');
  const align = requestedAlign || 'center';
  const base = chooseBase(requestedBase, triggerRect, menuRect);
  const left = alignMenuHorizontal(align, triggerRect, menuRect);
  const desiredTop = base === 'top'
    ? triggerRect.top - props.offset - menuRect.height
    : triggerRect.bottom + props.offset;

  activePlacement.value = align === 'center' ? base : `${base}-${align}`;
  menuPosition.value = {
    x: clamp(left, VIEWPORT_GAP, window.innerWidth - menuRect.width - VIEWPORT_GAP),
    y: clamp(desiredTop, VIEWPORT_GAP, window.innerHeight - menuRect.height - VIEWPORT_GAP),
  };
}

function chooseBase(requestedBase, triggerRect, menuRect) {
  const base = requestedBase === 'top' ? 'top' : 'bottom';
  if (base === 'bottom' && triggerRect.bottom + props.offset + menuRect.height > window.innerHeight - VIEWPORT_GAP) return 'top';
  if (base === 'top' && triggerRect.top - props.offset - menuRect.height < VIEWPORT_GAP) return 'bottom';
  return base;
}

function alignMenuHorizontal(align, triggerRect, menuRect) {
  if (align === 'end') return triggerRect.right - menuRect.width;
  if (align === 'center') return triggerRect.left + (triggerRect.width - menuRect.width) / 2;
  return triggerRect.left;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, Math.max(min, max)));
}

function handleOutsidePointer(event) {
  if (!visible.value || !props.closeOnClickOutside) return;
  const target = event.target;
  if (triggerRef.value?.contains(target) || menuRef.value?.contains(target)) return;
  close('outside', false);
}

function scheduleUpdatePosition() {
  if (!visible.value || updateFrame != null || typeof window === 'undefined') return;
  updateFrame = window.requestAnimationFrame(() => {
    updateFrame = null;
    updatePosition();
  });
}

watch(
  () => props.modelValue,
  (value) => {
    if (value && !visible.value) open();
    else if (!value && visible.value) close('model', false);
  },
);

watch(
  () => props.disabled,
  (value) => {
    if (value && visible.value) close('disabled', false);
  },
);

watch(
  () => [props.placement, props.items],
  () => nextTick(updatePosition),
  { deep: true },
);

onMounted(() => {
  if (typeof document !== 'undefined') {
    document.addEventListener('pointerdown', handleOutsidePointer, true);
    document.addEventListener('scroll', scheduleUpdatePosition, true);
  }
  if (visible.value) nextTick(updatePosition);
  if (typeof window !== 'undefined') window.addEventListener('resize', scheduleUpdatePosition);
});

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('pointerdown', handleOutsidePointer, true);
    document.removeEventListener('scroll', scheduleUpdatePosition, true);
  }
  if (typeof window !== 'undefined') window.removeEventListener('resize', scheduleUpdatePosition);
  if (updateFrame != null && typeof window !== 'undefined') window.cancelAnimationFrame(updateFrame);
});

defineExpose({ open, close, toggle, updatePosition, triggerRef, menuRef });
</script>

<style scoped>
.au-dropdown {
  position: relative;
  display: inline-flex;
  min-width: 0;
  max-width: 100%;
  vertical-align: middle;
}

.au-dropdown__trigger {
  display: inline-flex;
  min-width: 0;
  max-width: 100%;
  vertical-align: middle;
}

.au-dropdown__menu {
  position: fixed;
  width: max-content;
  min-width: min(180px, calc(100vw - 16px));
  max-width: calc(100vw - 16px);
  max-height: min(320px, calc(100vh - 16px));
  padding: 5px;
  overflow-x: hidden;
  overflow-y: auto;
  font-size: var(--au-font-size-base);
  font-weight: var(--au-font-weight-medium);
  line-height: 1.3;
  overscroll-behavior: contain;
  transform-origin: top left;
}

.au-dropdown__menu.is-bottom {
  transform-origin: top center;
}

.au-dropdown__menu.is-bottom-end {
  transform-origin: top right;
}

.au-dropdown__menu.is-top-start {
  transform-origin: bottom left;
}

.au-dropdown__menu.is-top {
  transform-origin: bottom center;
}

.au-dropdown__menu.is-top-end {
  transform-origin: bottom right;
}

.au-dropdown__item {
  padding: 0 9px;
}

.au-dropdown__item-icon,
.au-dropdown__shortcut {
  flex: none;
  color: var(--au-color-text-secondary);
}

.au-dropdown__item-icon {
  font-size: 14px;
}

.au-dropdown__item-label {
  min-width: 0;
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
}

.au-dropdown__shortcut {
  margin-left: auto;
  font-size: var(--au-font-size-small);
}

.au-dropdown__item.is-danger:hover:not(:disabled),
.au-dropdown__item.is-danger:focus-visible {
  background: color-mix(in srgb, var(--au-color-danger) 10%, transparent);
}

.au-dropdown__divider {
  height: 1px;
  margin: 4px 5px;
  background: var(--au-material-border-emphasis);
}

.au-dropdown__empty {
  padding: 7px 9px;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
}

.au-dropdown-fade-enter-from,
.au-dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-3px) scale(0.985);
}

.au-dropdown__menu.is-top-start.au-dropdown-fade-enter-from,
.au-dropdown__menu.is-top.au-dropdown-fade-enter-from,
.au-dropdown__menu.is-top-end.au-dropdown-fade-enter-from,
.au-dropdown__menu.is-top-start.au-dropdown-fade-leave-to,
.au-dropdown__menu.is-top.au-dropdown-fade-leave-to,
.au-dropdown__menu.is-top-end.au-dropdown-fade-leave-to {
  transform: translateY(3px) scale(0.985);
}

.au-dropdown.is-disabled {
  cursor: not-allowed;
}

@media (prefers-reduced-motion: reduce) {
  .au-dropdown-fade-enter-from,
  .au-dropdown-fade-leave-to {
    transform: none;
  }
}

</style>
