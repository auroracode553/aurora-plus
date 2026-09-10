<template>
  <span
    ref="triggerRef"
    class="au-popover au-component au-inline-trigger"
    :class="{ 'is-disabled': disabled }"
    :aria-haspopup="role"
    :aria-expanded="visible"
    :aria-controls="visible ? popoverId : undefined"
    :aria-disabled="disabled ? 'true' : undefined"
    v-bind="$attrs"
    @click="handleTriggerClick"
    @keydown="handleTriggerKeydown"
  >
    <slot
      name="trigger"
      :open="open"
      :close="close"
      :toggle="toggle"
      :expanded="visible"
      :trigger-props="triggerProps"
    ></slot>
  </span>

  <Teleport :to="appendTo" :disabled="!teleported">
    <Transition name="au-float" @after-enter="emit('opened')" @after-leave="emit('closed')">
      <div
        v-if="visible"
        :id="popoverId"
        ref="contentRef"
        class="au-popover__content au-component au-motion-popover au-floating-viewport"
        :class="[
          `is-${activePlacement}`,
          {
            'has-surface': surface,
            'au-material-surface': surface,
            'au-depth-overlay': surface,
            'au-overlay-surface': surface,
            'au-scroll-region': surface,
          },
        ]"
        :style="contentStyle"
        :role="role"
        :aria-label="ariaLabel || undefined"
        :aria-labelledby="ariaLabelledby || undefined"
        :aria-describedby="ariaDescribedby || undefined"
        tabindex="-1"
        @pointerdown.stop
        @click="handleContentClick"
        @keydown="handleContentKeydown"
      >
        <slot
          :open="open"
          :close="close"
          :toggle="toggle"
          :update-position="updatePosition"
        ></slot>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const BASE_PLACEMENTS = ['top', 'right', 'bottom', 'left'];
const ALIGNMENTS = ['start', 'center', 'end'];

function normalizeFloatingPlacement(value, fallback = 'bottom') {
  const [requestedBase, requestedAlign = 'center'] = String(value || fallback).split('-');
  const base = BASE_PLACEMENTS.includes(requestedBase) ? requestedBase : fallback;
  const align = ALIGNMENTS.includes(requestedAlign) ? requestedAlign : 'center';
  return { base, align };
}

function resolveFloatingPosition({
  placement = 'bottom',
  triggerRect,
  floatingRect,
  offset = 8,
  viewportWidth,
  viewportHeight,
  viewportGap = 8,
}) {
  const preferred = normalizeFloatingPlacement(placement);
  const base = chooseBase({
    preferredBase: preferred.base,
    triggerRect,
    floatingRect,
    offset,
    viewportWidth,
    viewportHeight,
    viewportGap,
  });
  const position = calculatePosition({
    base,
    align: preferred.align,
    triggerRect,
    floatingRect,
    offset,
  });

  return {
    placement: preferred.align === 'center' ? base : `${base}-${preferred.align}`,
    x: clamp(position.x, viewportGap, viewportWidth - floatingRect.width - viewportGap),
    y: clamp(position.y, viewportGap, viewportHeight - floatingRect.height - viewportGap),
  };
}

function chooseBase({
  preferredBase,
  triggerRect,
  floatingRect,
  offset,
  viewportWidth,
  viewportHeight,
  viewportGap,
}) {
  const oppositeBase = getOppositeBase(preferredBase);
  const preferredSpace = getAvailableSpace(
    preferredBase,
    triggerRect,
    viewportWidth,
    viewportHeight,
    viewportGap,
  );
  const oppositeSpace = getAvailableSpace(
    oppositeBase,
    triggerRect,
    viewportWidth,
    viewportHeight,
    viewportGap,
  );
  const floatingSize = ['top', 'bottom'].includes(preferredBase)
    ? floatingRect.height
    : floatingRect.width;

  if (preferredSpace >= floatingSize + offset || preferredSpace >= oppositeSpace) {
    return preferredBase;
  }
  return oppositeBase;
}

function getAvailableSpace(base, triggerRect, viewportWidth, viewportHeight, viewportGap) {
  if (base === 'top') return triggerRect.top - viewportGap;
  if (base === 'bottom') return viewportHeight - triggerRect.bottom - viewportGap;
  if (base === 'left') return triggerRect.left - viewportGap;
  return viewportWidth - triggerRect.right - viewportGap;
}

function getOppositeBase(base) {
  if (base === 'top') return 'bottom';
  if (base === 'bottom') return 'top';
  if (base === 'left') return 'right';
  return 'left';
}

function calculatePosition({ base, align, triggerRect, floatingRect, offset }) {
  if (base === 'top' || base === 'bottom') {
    return {
      x: alignCrossAxis(align, triggerRect.left, triggerRect.width, floatingRect.width),
      y: base === 'top'
        ? triggerRect.top - floatingRect.height - offset
        : triggerRect.bottom + offset,
    };
  }

  return {
    x: base === 'left'
      ? triggerRect.left - floatingRect.width - offset
      : triggerRect.right + offset,
    y: alignCrossAxis(align, triggerRect.top, triggerRect.height, floatingRect.height),
  };
}

function alignCrossAxis(align, start, triggerSize, floatingSize) {
  if (align === 'start') return start;
  if (align === 'end') return start + triggerSize - floatingSize;
  return start + (triggerSize - floatingSize) / 2;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

defineOptions({ inheritAttrs: false });

const VIEWPORT_GAP = 8;
const FOCUSABLE_SELECTOR = [
  'button:not(:disabled)',
  'a[href]',
  'input:not(:disabled)',
  'select:not(:disabled)',
  'textarea:not(:disabled)',
  '[tabindex]:not([tabindex="-1"])',
].join(',');
let popoverSeed = 0;

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  placement: {
    type: String,
    default: 'bottom',
    validator: (value) => [
      'top-start', 'top', 'top-end',
      'right-start', 'right', 'right-end',
      'bottom-start', 'bottom', 'bottom-end',
      'left-start', 'left', 'left-end',
    ].includes(value),
  },
  offset: { type: Number, default: 8 },
  trigger: {
    type: String,
    default: 'click',
    validator: (value) => ['click', 'manual'].includes(value),
  },
  disabled: { type: Boolean, default: false },
  closeOnClickOutside: { type: Boolean, default: true },
  closeOnPressEscape: { type: Boolean, default: true },
  closeOnContentClick: { type: Boolean, default: false },
  matchTriggerWidth: { type: Boolean, default: false },
  surface: { type: Boolean, default: true },
  teleported: { type: Boolean, default: true },
  appendTo: { type: [String, Object], default: 'body' },
  role: { type: String, default: 'dialog' },
  ariaLabel: { type: String, default: '' },
  ariaLabelledby: { type: String, default: '' },
  ariaDescribedby: { type: String, default: '' },
  zIndex: { type: Number, default: 1200 },
});

const emit = defineEmits(['update:modelValue', 'open', 'opened', 'close', 'closed']);
const triggerRef = ref(null);
const contentRef = ref(null);
const visible = ref(Boolean(props.modelValue));
const activePlacement = ref(props.placement);
const triggerWidth = ref(0);
const contentPosition = ref({ x: 0, y: 0 });
const popoverId = `au-popover-${++popoverSeed}`;
let updateFrame = null;
let resizeObserver = null;

const triggerProps = computed(() => ({
  'aria-haspopup': props.role,
  'aria-expanded': String(visible.value),
  'aria-controls': visible.value ? popoverId : undefined,
}));

const contentStyle = computed(() => ({
  left: `${contentPosition.value.x}px`,
  top: `${contentPosition.value.y}px`,
  zIndex: props.zIndex,
  ...(props.matchTriggerWidth && triggerWidth.value > 0
    ? { minWidth: `${triggerWidth.value}px` }
    : {}),
}));

function getTriggerElement() {
  if (!triggerRef.value) return null;
  return triggerRef.value.firstElementChild || triggerRef.value;
}

async function open(focusContent = false) {
  if (props.disabled || visible.value) {
    if (visible.value && focusContent) focusFirstContent();
    return;
  }
  visible.value = true;
  emit('update:modelValue', true);
  emit('open');
  await nextTick();
  updatePosition();
  observeGeometry();
  if (focusContent) focusFirstContent();
}

function close(reason = 'api', restoreFocus = false) {
  if (!visible.value) return;
  visible.value = false;
  emit('update:modelValue', false);
  emit('close', reason);
  stopObservingGeometry();
  if (restoreFocus) nextTick(() => getTriggerElement()?.focus?.({ preventScroll: true }));
}

function toggle() {
  if (props.disabled) return;
  if (visible.value) close('toggle');
  else open();
}

function handleTriggerClick() {
  if (props.trigger === 'click') toggle();
}

function handleTriggerKeydown(event) {
  if (props.disabled) return;
  if (props.trigger === 'manual' && event.key !== 'Escape') return;
  if (event.key === 'ArrowDown' && !visible.value) {
    event.preventDefault();
    open(true);
    return;
  }
  if (event.key === 'Escape' && visible.value && props.closeOnPressEscape) {
    event.preventDefault();
    close('escape', true);
  }
}

function handleContentClick() {
  if (props.closeOnContentClick) close('content', true);
}

function handleContentKeydown(event) {
  if (event.key !== 'Escape' || !props.closeOnPressEscape) return;
  event.preventDefault();
  event.stopPropagation();
  close('escape', true);
}

function focusFirstContent() {
  const focusTarget = contentRef.value?.querySelector(FOCUSABLE_SELECTOR) || contentRef.value;
  focusTarget?.focus?.({ preventScroll: true });
}

async function updatePosition() {
  const triggerElement = getTriggerElement();
  const contentElement = contentRef.value;
  if (!triggerElement || !contentElement || typeof window === 'undefined') return;

  const triggerRect = triggerElement.getBoundingClientRect();
  triggerWidth.value = Math.min(triggerRect.width, Math.max(window.innerWidth - VIEWPORT_GAP * 2, 0));
  if (props.matchTriggerWidth) await nextTick();
  if (!contentRef.value) return;
  const contentRect = contentElement.getBoundingClientRect();
  const position = resolveFloatingPosition({
    placement: props.placement,
    triggerRect,
    floatingRect: contentRect,
    offset: props.offset,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    viewportGap: VIEWPORT_GAP,
  });

  activePlacement.value = position.placement;
  contentPosition.value = { x: position.x, y: position.y };
}

function scheduleUpdatePosition() {
  if (!visible.value || updateFrame != null || typeof window === 'undefined') return;
  updateFrame = window.requestAnimationFrame(() => {
    updateFrame = null;
    updatePosition();
  });
}

function handleOutsidePointer(event) {
  if (!visible.value || !props.closeOnClickOutside) return;
  const target = event.target;
  if (triggerRef.value?.contains(target) || contentRef.value?.contains(target)) return;
  if (isOwnedFloatingTarget(target)) return;
  close('outside');
}

/** Teleport 到外部的子浮层仍属于当前 Popover，不应触发外部关闭。 */
function isOwnedFloatingTarget(target) {
  const floatingElement = target?.closest?.('[data-au-floating-owner]');
  const ownerId = floatingElement?.getAttribute('data-au-floating-owner');
  if (!ownerId || !contentRef.value) return false;
  return [...contentRef.value.querySelectorAll('[data-au-floating-owner]')]
    .some((element) => element.getAttribute('data-au-floating-owner') === ownerId);
}

function observeGeometry() {
  if (typeof ResizeObserver === 'undefined' || resizeObserver) return;
  resizeObserver = new ResizeObserver(scheduleUpdatePosition);
  const triggerElement = getTriggerElement();
  if (triggerElement) resizeObserver.observe(triggerElement);
  if (contentRef.value) resizeObserver.observe(contentRef.value);
}

function stopObservingGeometry() {
  resizeObserver?.disconnect();
  resizeObserver = null;
}

watch(
  () => props.modelValue,
  (value) => {
    if (value && !visible.value) open();
    else if (!value && visible.value) close('model');
  },
);

watch(
  () => props.disabled,
  (value) => {
    if (value) close('disabled');
  },
);

watch(
  () => [props.placement, props.offset, props.matchTriggerWidth],
  () => nextTick(updatePosition),
);

onMounted(() => {
  if (typeof document !== 'undefined') {
    document.addEventListener('pointerdown', handleOutsidePointer, true);
    document.addEventListener('scroll', scheduleUpdatePosition, true);
  }
  if (typeof window !== 'undefined') window.addEventListener('resize', scheduleUpdatePosition);
  if (visible.value) {
    nextTick(() => {
      updatePosition();
      observeGeometry();
    });
  }
});

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('pointerdown', handleOutsidePointer, true);
    document.removeEventListener('scroll', scheduleUpdatePosition, true);
  }
  if (typeof window !== 'undefined') window.removeEventListener('resize', scheduleUpdatePosition);
  if (updateFrame != null && typeof window !== 'undefined') window.cancelAnimationFrame(updateFrame);
  stopObservingGeometry();
});

defineExpose({ open, close, toggle, updatePosition, triggerRef, contentRef });
</script>

<style scoped lang="scss" src="./AuPopover.scss"></style>
