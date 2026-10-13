<template>
  <span
    ref="triggerRef"
    class="au-tooltip__trigger au-inline-trigger"
    :class="{ 'is-fill': fillTrigger }"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
    @pointerdown="close"
  >
    <slot></slot>
  </span>

  <Teleport :to="appendTo" :disabled="!teleported">
    <Transition name="au-float" @after-leave="notifyClosed">
      <div
        v-if="visible && hasContent"
        ref="tooltipRef"
        class="au-tooltip__popper au-component au-material-surface au-depth-overlay au-motion-popover au-wrap-anywhere au-motion-state"
        :class="`is-${activePlacement}`"
        :style="popperStyle"
      >
        <span class="au-tooltip__content"><slot name="content">{{ tooltipText }}</slot></span>
        <span class="au-tooltip__arrow" :style="arrowStyle"></span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, useSlots, watch } from 'vue';
import { useOverlayLayer } from '../../utils/overlay-layer.js';

const VIEWPORT_GAP = 8;
const ARROW_SAFE_GAP = 10;

const props = defineProps({
  content: { type: [String, Number], default: '' },
  placement: { type: String, default: 'top' },
  offset: { type: Number, default: 10 },
  showAfter: { type: Number, default: 220 },
  hideAfter: { type: Number, default: 80 },
  disabled: { type: Boolean, default: false },
  fillTrigger: { type: Boolean, default: false },
  maxWidth: { type: [String, Number], default: 280 },
  teleported: { type: Boolean, default: true },
  appendTo: { type: [String, Object], default: 'body' },
});

const emit = defineEmits(['open', 'closed']);
const slots = useSlots();
const triggerRef = ref(null);
const tooltipRef = ref(null);
const visible = ref(false);
const positioned = ref(false);
const activePlacement = ref('top');
const popperPosition = ref({ x: 0, y: 0 });
const arrowPosition = ref({});

let showTimer = null;
let hideTimer = null;
let updateFrame = null;
let eventsBound = false;
let openReported = false;

const tooltipText = computed(() => String(props.content ?? '').trim());
const hasContent = computed(() => Boolean(tooltipText.value || slots.content));
const maxWidthValue = computed(() => (typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth));
const overlayLayer = useOverlayLayer(() => 'var(--au-z-index-hint)');
const popperStyle = computed(() => ({
  visibility: positioned.value ? 'visible' : 'hidden',
  zIndex: overlayLayer.value,
  left: `${popperPosition.value.x}px`,
  top: `${popperPosition.value.y}px`,
  maxWidth: `min(${maxWidthValue.value}, calc(100vw - ${VIEWPORT_GAP * 2}px))`,
}));
const arrowStyle = computed(() => arrowPosition.value);

function show() {
  clearTimeout(showTimer);
  clearTimeout(hideTimer);
  if (props.disabled || !hasContent.value) return;
  if (visible.value) return;
  // 等待显示期间也监听失焦，防止切换窗口后延迟任务仍弹出提示。
  bindWindowEvents();

  showTimer = globalThis.setTimeout(async () => {
    showTimer = null;
    if (props.disabled || !hasContent.value) return;
    positioned.value = false;
    // 先通知宿主扩展视图，再挂载气泡；视口尚未扩展时保持不可见，等 resize 重新定位。
    if (!openReported) {
      openReported = true;
      emit('open');
    }
    visible.value = true;
    await nextTick();
    if (!visible.value) return;
    updatePosition();
  }, Math.max(props.showAfter, 0));
}

function hide() {
  clearTimeout(showTimer);
  clearTimeout(hideTimer);
  hideTimer = globalThis.setTimeout(close, Math.max(props.hideAfter, 0));
}

/** 点击、失焦或禁用立即取消提示，避免窗口操作后留下旧气泡。 */
function close() {
  clearTimeout(showTimer);
  clearTimeout(hideTimer);
  showTimer = null;
  hideTimer = null;
  const closedBeforeMount = visible.value && !tooltipRef.value;
  visible.value = false;
  if (updateFrame !== null && typeof window !== 'undefined') window.cancelAnimationFrame(updateFrame);
  updateFrame = null;
  unbindWindowEvents();
  if (closedBeforeMount) notifyClosed();
}

function notifyClosed() {
  if (!openReported) return;
  openReported = false;
  emit('closed');
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
  // 布局尺寸不受进入动画的 scale 影响，避免用缩小后的气泡尺寸计算边界。
  const tooltipRect = { width: tooltip.offsetWidth, height: tooltip.offsetHeight };
  const preferred = parsePlacement();
  const placement = choosePlacement(preferred.base, triggerRect, tooltipRect);
  if (!placement || tooltipRect.width > window.innerWidth - VIEWPORT_GAP * 2
      || tooltipRect.height > window.innerHeight - VIEWPORT_GAP * 2) {
    positioned.value = false;
    return;
  }
  const position = calculatePosition(placement, preferred.align, triggerRect, tooltipRect);

  activePlacement.value = placement;
  popperPosition.value = {
    x: clamp(position.x, VIEWPORT_GAP, window.innerWidth - tooltipRect.width - VIEWPORT_GAP),
    y: clamp(position.y, VIEWPORT_GAP, window.innerHeight - tooltipRect.height - VIEWPORT_GAP),
  };
  arrowPosition.value = calculateArrowPosition(placement, triggerRect, tooltipRect, popperPosition.value);
  positioned.value = true;
}

function choosePlacement(base, triggerRect, tooltipRect) {
  const space = {
    top: triggerRect.top - VIEWPORT_GAP,
    bottom: window.innerHeight - triggerRect.bottom - VIEWPORT_GAP,
    left: triggerRect.left - VIEWPORT_GAP,
    right: window.innerWidth - triggerRect.right - VIEWPORT_GAP,
  };
  const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[base];
  const size = ['top', 'bottom'].includes(base) ? tooltipRect.height : tooltipRect.width;
  if (space[base] >= size + props.offset) return base;
  if (space[opposite] >= size + props.offset) return opposite;
  // 两侧都不足时先等待宿主视口变化，不能夹紧坐标把气泡压回触发按钮。
  return null;
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
  if (!visible.value || updateFrame !== null || typeof window === 'undefined') return;
  updateFrame = window.requestAnimationFrame(() => {
    updateFrame = null;
    updatePosition();
  });
}

function bindWindowEvents() {
  if (eventsBound || typeof window === 'undefined') return;
  eventsBound = true;
  window.addEventListener('resize', scheduleUpdatePosition, { passive: true });
  window.addEventListener('scroll', scheduleUpdatePosition, true);
  window.addEventListener('blur', close);
}

function unbindWindowEvents() {
  if (!eventsBound || typeof window === 'undefined') return;
  eventsBound = false;
  window.removeEventListener('resize', scheduleUpdatePosition);
  window.removeEventListener('scroll', scheduleUpdatePosition, true);
  window.removeEventListener('blur', close);
}

function clamp(value, min, max) {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

watch([() => props.disabled, hasContent], ([disabled, contentAvailable]) => {
  if (disabled || !contentAvailable) close();
});

watch(
  () => [props.content, props.placement, props.offset, props.maxWidth, props.teleported, props.appendTo],
  scheduleUpdatePosition,
  { flush: 'post' },
);

onBeforeUnmount(() => {
  close();
  // 组件卸载没有退场回调，也必须释放宿主浮层状态。
  notifyClosed();
});

defineExpose({ hide, show, updatePosition });
</script>

<style scoped lang="scss" src="./AuTooltip.scss"></style>
