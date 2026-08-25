<template>
  <Teleport :to="appendTo" :disabled="!teleported">
    <Transition name="au-floating-toolbar-fade">
      <div
        v-if="visible"
        ref="toolbarRef"
        class="au-floating-toolbar"
        :class="`is-${activePlacement}`"
        :style="toolbarStyle"
        role="toolbar"
        :aria-label="ariaLabel"
        @pointerdown.stop
        @click.stop
      >
        <slot :hide="hide" :placement="activePlacement"></slot>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, default: null },
  triggerRect: { type: Object, default: null },
  placement: {
    type: String,
    default: 'auto',
    validator: (value) => ['auto', 'top', 'bottom'].includes(value),
  },
  keepVisibleTarget: { type: [String, Object], default: '' },
  keepVisibleSelector: { type: String, default: '' },
  refreshTarget: { type: [String, Object], default: '' },
  refreshSelector: { type: String, default: '' },
  ariaLabel: { type: String, default: '工具条' },
  gap: { type: Number, default: 8 },
  viewportPadding: { type: Number, default: 8 },
  teleported: { type: Boolean, default: true },
  appendTo: { type: [String, Object], default: 'body' },
  zIndex: { type: Number, default: 9000 },
});

const emit = defineEmits(['update:modelValue', 'show', 'hide']);
const toolbarRef = ref(null);
const visible = ref(props.modelValue == null ? Boolean(props.triggerRect) : props.modelValue);
const targetRect = ref(props.triggerRect ? copyRect(props.triggerRect) : null);
const activePlacement = ref('top');
const toolbarStyle = ref({ display: 'none' });

let updateFrame = null;

function copyRect(rect) {
  return {
    top: Number(rect.top) || 0,
    right: Number(rect.right) || 0,
    bottom: Number(rect.bottom) || 0,
    left: Number(rect.left) || 0,
    width: Number(rect.width) || 0,
    height: Number(rect.height) || 0,
  };
}

async function show(rect = targetRect.value) {
  if (rect) targetRect.value = copyRect(rect);
  if (!targetRect.value) return;
  const wasVisible = visible.value;
  visible.value = true;
  if (props.modelValue !== true) emit('update:modelValue', true);
  if (!wasVisible) emit('show');
  await nextTick();
  updatePosition();
}

function hide(reason = 'api') {
  if (!visible.value) return;
  visible.value = false;
  emit('update:modelValue', false);
  emit('hide', reason);
}

function updatePosition() {
  const rect = targetRect.value;
  const toolbar = toolbarRef.value;
  if (!rect || !toolbar || typeof window === 'undefined') {
    toolbarStyle.value = { display: 'none' };
    return;
  }

  const toolbarRect = toolbar.getBoundingClientRect();
  const padding = Math.max(props.viewportPadding, 0);
  const roomAbove = rect.top - props.gap;
  const placement = props.placement === 'auto' ? (roomAbove >= toolbarRect.height + padding ? 'top' : 'bottom') : props.placement;
  const targetCenter = rect.left + rect.width / 2;
  const left = clamp(targetCenter - toolbarRect.width / 2, padding, window.innerWidth - toolbarRect.width - padding);
  const desiredTop = placement === 'top' ? rect.top - props.gap - toolbarRect.height : rect.bottom + props.gap;
  const top = clamp(desiredTop, padding, window.innerHeight - toolbarRect.height - padding);
  const arrowLeft = clamp(targetCenter - left, 12, toolbarRect.width - 12);

  activePlacement.value = placement;
  toolbarStyle.value = {
    left: `${left}px`,
    top: `${top}px`,
    zIndex: props.zIndex,
    '--au-floating-arrow-left': `${arrowLeft}px`,
  };
}

function scheduleUpdate() {
  if (updateFrame != null || typeof window === 'undefined') return;
  updateFrame = window.requestAnimationFrame(() => {
    updateFrame = null;
    refreshPosition();
  });
}

function resolveTarget(target) {
  if (!target || typeof document === 'undefined') return null;
  if (typeof target === 'string') return document.querySelector(target);
  return target;
}

function refreshPosition() {
  if (!visible.value) return;
  const target = resolveTarget(props.refreshTarget || props.refreshSelector);
  if (target && typeof target.getBoundingClientRect === 'function') {
    const rect = target.getBoundingClientRect();
    if (rect.width > 0 || rect.height > 0) {
      targetRect.value = copyRect(rect);
      updatePosition();
      return;
    }
  }
  if (props.refreshTarget || props.refreshSelector) hide('target-missing');
  else hide('scroll');
}

function handleOutsidePointer(event) {
  if (!visible.value) return;
  if (toolbarRef.value && toolbarRef.value.contains(event.target)) return;
  const keepTarget = props.keepVisibleTarget || props.keepVisibleSelector;
  if (typeof keepTarget === 'string' && event.target instanceof Element && event.target.closest(keepTarget)) return;
  const keepElement = resolveTarget(keepTarget);
  if (keepElement && keepElement.contains(event.target)) return;
  hide('outside');
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, Math.max(min, max)));
}

watch(
  () => props.modelValue,
  (value) => {
    if (value == null) return;
    if (value) {
      if (!visible.value) show();
      else nextTick(updatePosition);
    }
    else hide('model');
  }
);

watch(
  () => props.triggerRect,
  (rect) => {
    if (rect) {
      targetRect.value = copyRect(rect);
      if (props.modelValue !== false) show(rect);
    } else if (props.modelValue == null) {
      hide('trigger');
    }
  },
  { deep: true }
);

onMounted(() => {
  if (typeof document !== 'undefined') {
    document.addEventListener('scroll', scheduleUpdate, true);
    document.addEventListener('pointerdown', handleOutsidePointer, true);
  }
  if (typeof window !== 'undefined') window.addEventListener('resize', scheduleUpdate);
  if (visible.value) nextTick(updatePosition);
});

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('scroll', scheduleUpdate, true);
    document.removeEventListener('pointerdown', handleOutsidePointer, true);
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', scheduleUpdate);
    if (updateFrame != null) window.cancelAnimationFrame(updateFrame);
  }
});

defineExpose({ hide, show, toolbarRef, updatePosition });
</script>

<style scoped>
.au-floating-toolbar {
  position: fixed;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 40px;
  padding: 5px 10px;
  border: 1px solid var(--au-color-border-light);
  border-radius: 10px;
  color: var(--au-color-text-regular);
  background: var(--au-color-bg-overlay);
  box-shadow: var(--au-shadow-light);
  user-select: none;
}

.au-floating-toolbar::before,
.au-floating-toolbar::after {
  position: absolute;
  left: var(--au-floating-arrow-left);
  width: 0;
  height: 0;
  content: '';
  transform: translateX(-50%);
}

.au-floating-toolbar.is-top::before {
  bottom: -8px;
  border-top: 8px solid var(--au-color-border-light);
  border-right: 8px solid transparent;
  border-left: 8px solid transparent;
}

.au-floating-toolbar.is-top::after {
  bottom: -7px;
  border-top: 7px solid var(--au-color-bg-overlay);
  border-right: 7px solid transparent;
  border-left: 7px solid transparent;
}

.au-floating-toolbar.is-bottom::before {
  top: -8px;
  border-right: 8px solid transparent;
  border-bottom: 8px solid var(--au-color-border-light);
  border-left: 8px solid transparent;
}

.au-floating-toolbar.is-bottom::after {
  top: -7px;
  border-right: 7px solid transparent;
  border-bottom: 7px solid var(--au-color-bg-overlay);
  border-left: 7px solid transparent;
}

.au-floating-toolbar :deep(.au-floating-toolbar__group) {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.au-floating-toolbar :deep(.au-floating-toolbar__separator) {
  width: 1px;
  height: 20px;
  margin: 0 4px;
  background: var(--au-color-border-light);
  flex: none;
}

.au-floating-toolbar :deep(.au-floating-toolbar__button) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: var(--au-border-radius-base);
  color: var(--au-color-text-regular);
  background: transparent;
  cursor: pointer;
  transition: background 0.14s ease, color 0.14s ease;
}

.au-floating-toolbar :deep(.au-floating-toolbar__button:hover) {
  color: var(--au-color-text-primary);
  background: var(--au-color-bg-hover);
}

.au-floating-toolbar :deep(.au-floating-toolbar__button:focus-visible) {
  outline: 2px solid var(--au-color-primary);
  outline-offset: 1px;
}

.au-floating-toolbar :deep(.au-floating-toolbar__button.is-primary) {
  color: var(--au-color-primary);
}

.au-floating-toolbar :deep(.au-floating-toolbar__button.is-danger) {
  color: var(--au-color-danger);
}

.au-floating-toolbar-fade-enter-active,
.au-floating-toolbar-fade-leave-active {
  transition: opacity 0.14s ease, transform 0.14s ease;
}

.au-floating-toolbar-fade-enter-from,
.au-floating-toolbar-fade-leave-to {
  opacity: 0;
  transform: translateY(3px) scale(0.98);
}
</style>
