<template>
  <span
    ref="triggerRef"
    class="au-tooltip__trigger"
    :aria-describedby="visible ? tooltipId : undefined"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot></slot>
  </span>

  <Teleport :to="appendTo" :disabled="!teleported">
    <Transition name="au-tooltip-fade">
      <div
        v-if="visible && hasContent"
        :id="tooltipId"
        ref="tooltipRef"
        class="au-tooltip__popper au-component au-material-surface au-depth-overlay au-motion-popover au-wrap-anywhere"
        :class="`is-${activePlacement}`"
        :style="popperStyle"
        role="tooltip"
      >
        <span class="au-tooltip__content"><slot name="content">{{ tooltipText }}</slot></span>
        <span class="au-tooltip__arrow" :style="arrowStyle"></span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, useSlots } from 'vue';

const VIEWPORT_GAP = 8;
const ARROW_SAFE_GAP = 10;
let tooltipSeed = 0;

const props = defineProps({
  content: { type: [String, Number], default: '' },
  placement: { type: String, default: 'top' },
  offset: { type: Number, default: 10 },
  showAfter: { type: Number, default: 220 },
  hideAfter: { type: Number, default: 80 },
  disabled: { type: Boolean, default: false },
  maxWidth: { type: [String, Number], default: 280 },
  teleported: { type: Boolean, default: true },
  appendTo: { type: [String, Object], default: 'body' },
});

const slots = useSlots();
const triggerRef = ref(null);
const tooltipRef = ref(null);
const visible = ref(false);
const activePlacement = ref('top');
const popperPosition = ref({ x: 0, y: 0 });
const arrowPosition = ref({});
const tooltipId = `au-tooltip-${++tooltipSeed}`;

let showTimer = null;
let hideTimer = null;
let updateFrame = null;
let eventsBound = false;

const tooltipText = computed(() => String(props.content ?? '').trim());
const hasContent = computed(() => Boolean(tooltipText.value || slots.content));
const maxWidthValue = computed(() => (typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth));
const popperStyle = computed(() => ({
  left: `${popperPosition.value.x}px`,
  top: `${popperPosition.value.y}px`,
  maxWidth: `min(${maxWidthValue.value}, calc(100vw - ${VIEWPORT_GAP * 2}px))`,
}));
const arrowStyle = computed(() => arrowPosition.value);

function show() {
  clearTimeout(showTimer);
  clearTimeout(hideTimer);
  if (props.disabled || !hasContent.value) return;

  showTimer = globalThis.setTimeout(async () => {
    visible.value = true;
    await nextTick();
    updatePosition();
    bindWindowEvents();
  }, Math.max(props.showAfter, 0));
}

function hide() {
  clearTimeout(showTimer);
  hideTimer = globalThis.setTimeout(() => {
    visible.value = false;
    unbindWindowEvents();
  }, Math.max(props.hideAfter, 0));
}

function getTriggerElement() {
  const trigger = triggerRef.value;
  if (!trigger) return null;
  return trigger.firstElementChild || trigger;
}

function parsePlacement() {
  const [base, align = 'center'] = props.placement.split('-');
  return {
    base: ['top', 'bottom', 'left', 'right'].includes(base) ? base : 'top',
    align: ['start', 'end', 'center'].includes(align) ? align : 'center',
  };
}

function updatePosition() {
  const trigger = getTriggerElement();
  const tooltip = tooltipRef.value;
  if (!trigger || !tooltip || typeof window === 'undefined') return;

  const triggerRect = trigger.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const preferred = parsePlacement();
  const placement = choosePlacement(preferred.base, triggerRect, tooltipRect);
  const position = calculatePosition(placement, preferred.align, triggerRect, tooltipRect);

  activePlacement.value = placement;
  popperPosition.value = {
    x: clamp(position.x, VIEWPORT_GAP, window.innerWidth - tooltipRect.width - VIEWPORT_GAP),
    y: clamp(position.y, VIEWPORT_GAP, window.innerHeight - tooltipRect.height - VIEWPORT_GAP),
  };
  arrowPosition.value = calculateArrowPosition(placement, triggerRect, tooltipRect, popperPosition.value);
}

function choosePlacement(base, triggerRect, tooltipRect) {
  if (base === 'top' && triggerRect.top - tooltipRect.height - props.offset < VIEWPORT_GAP) return 'bottom';
  if (base === 'bottom' && triggerRect.bottom + tooltipRect.height + props.offset > window.innerHeight - VIEWPORT_GAP) return 'top';
  if (base === 'left' && triggerRect.left - tooltipRect.width - props.offset < VIEWPORT_GAP) return 'right';
  if (base === 'right' && triggerRect.right + tooltipRect.width + props.offset > window.innerWidth - VIEWPORT_GAP) return 'left';
  return base;
}

function calculatePosition(base, align, triggerRect, tooltipRect) {
  if (base === 'top' || base === 'bottom') {
    return {
      x: crossAxisPosition(align, triggerRect.left, triggerRect.width, tooltipRect.width),
      y: base === 'top' ? triggerRect.top - tooltipRect.height - props.offset : triggerRect.bottom + props.offset,
    };
  }

  return {
    x: base === 'left' ? triggerRect.left - tooltipRect.width - props.offset : triggerRect.right + props.offset,
    y: crossAxisPosition(align, triggerRect.top, triggerRect.height, tooltipRect.height),
  };
}

function crossAxisPosition(align, start, triggerSize, tooltipSize) {
  if (align === 'start') return start;
  if (align === 'end') return start + triggerSize - tooltipSize;
  return start + (triggerSize - tooltipSize) / 2;
}

function calculateArrowPosition(base, triggerRect, tooltipRect, popper) {
  if (base === 'top' || base === 'bottom') {
    const left = triggerRect.left + triggerRect.width / 2 - popper.x;
    return { left: `${clamp(left, ARROW_SAFE_GAP, tooltipRect.width - ARROW_SAFE_GAP)}px` };
  }
  const top = triggerRect.top + triggerRect.height / 2 - popper.y;
  return { top: `${clamp(top, ARROW_SAFE_GAP, tooltipRect.height - ARROW_SAFE_GAP)}px` };
}

function scheduleUpdatePosition() {
  if (updateFrame || typeof window === 'undefined') return;
  updateFrame = window.requestAnimationFrame(() => {
    updateFrame = null;
    updatePosition();
  });
}

function bindWindowEvents() {
  if (eventsBound || typeof window === 'undefined') return;
  eventsBound = true;
  window.addEventListener('resize', hide, { passive: true });
  window.addEventListener('scroll', scheduleUpdatePosition, true);
}

function unbindWindowEvents() {
  if (!eventsBound || typeof window === 'undefined') return;
  eventsBound = false;
  window.removeEventListener('resize', hide);
  window.removeEventListener('scroll', scheduleUpdatePosition, true);
}

function clamp(value, min, max) {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

onBeforeUnmount(() => {
  clearTimeout(showTimer);
  clearTimeout(hideTimer);
  if (updateFrame && typeof window !== 'undefined') window.cancelAnimationFrame(updateFrame);
  unbindWindowEvents();
});

defineExpose({ hide, show, updatePosition });
</script>

<style scoped>
.au-tooltip__trigger {
  display: inline-flex;
  min-width: 0;
  max-width: 100%;
  vertical-align: middle;
}

.au-tooltip__popper {
  position: fixed;
  z-index: var(--au-z-index-tooltip);
  min-height: 24px;
  padding: 5px 8px;
  border: 1px solid var(--au-material-border-strong);
  border-radius: var(--au-radius-control);
  color: var(--au-color-text-primary);
  font-size: var(--au-font-size-small);
  font-weight: var(--au-font-weight-medium);
  line-height: 1.35;
  letter-spacing: 0.005em;
  pointer-events: none;
}

.au-tooltip__content {
  position: relative;
  z-index: 1;
  min-width: 0;
  max-width: 100%;
}

.au-tooltip__arrow {
  position: absolute;
  width: auto;
  height: 8px;
  aspect-ratio: 1;
  border: 1px solid var(--au-material-border-strong);
  background: var(--au-material-bg-strong);
  transform: rotate(45deg);
}

.au-tooltip__popper.is-top .au-tooltip__arrow {
  bottom: -5px;
  border-top-color: transparent;
  border-left-color: transparent;
  transform: translateX(-50%) rotate(45deg);
}

.au-tooltip__popper.is-bottom .au-tooltip__arrow {
  top: -5px;
  border-right-color: transparent;
  border-bottom-color: transparent;
  transform: translateX(-50%) rotate(45deg);
}

.au-tooltip__popper.is-left .au-tooltip__arrow {
  right: -5px;
  border-bottom-color: transparent;
  border-left-color: transparent;
  transform: translateY(-50%) rotate(45deg);
}

.au-tooltip__popper.is-right .au-tooltip__arrow {
  left: -5px;
  border-top-color: transparent;
  border-right-color: transparent;
  transform: translateY(-50%) rotate(45deg);
}

@media (prefers-reduced-transparency: reduce) {
  .au-tooltip__arrow {
    background: var(--au-color-bg-overlay);
  }
}

.au-tooltip-fade-enter-from,
.au-tooltip-fade-leave-to {
  opacity: 0;
  transform: translateY(4px) scale(0.98);
}

.au-tooltip__popper.is-bottom.au-tooltip-fade-enter-from,
.au-tooltip__popper.is-bottom.au-tooltip-fade-leave-to {
  transform: translateY(-4px) scale(0.98);
}

</style>
