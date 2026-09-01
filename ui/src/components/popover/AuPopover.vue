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
import { resolveFloatingPosition } from '../../utils/floating-position.js';

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

<style scoped lang="scss">
.au-popover.is-disabled {
  cursor: not-allowed;
}

.au-popover__content {
  position: fixed;
  color: var(--au-color-text-primary);
  outline: none;
  transform-origin: top center;
}

.au-popover__content.has-surface {
  min-width: min(180px, calc(100vw - 16px));
  padding: 12px;
}

.au-popover__content.is-bottom-start {
  transform-origin: top left;
}

.au-popover__content.is-bottom {
  transform-origin: top center;
}

.au-popover__content.is-bottom-end {
  transform-origin: top right;
}

.au-popover__content.is-top-start {
  transform-origin: bottom left;
}

.au-popover__content.is-top {
  transform-origin: bottom center;
}

.au-popover__content.is-top-end {
  transform-origin: bottom right;
}

.au-popover__content.is-left-start {
  transform-origin: right top;
}

.au-popover__content.is-left {
  transform-origin: right center;
}

.au-popover__content.is-left-end {
  transform-origin: right bottom;
}

.au-popover__content.is-right-start {
  transform-origin: left top;
}

.au-popover__content.is-right {
  transform-origin: left center;
}

.au-popover__content.is-right-end {
  transform-origin: left bottom;
}

</style>
