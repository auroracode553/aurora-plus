<template>
  <Teleport :to="appendTo" :disabled="!teleported">
    <Transition name="au-image-preview-fade" @after-enter="emit('opened')" @after-leave="emit('closed')">
      <section
        v-if="visible"
        ref="viewerRef"
        class="au-image-preview au-component"
        :style="viewerStyle"
        role="dialog"
        aria-modal="true"
        :aria-label="ariaLabel"
        tabindex="-1"
        @keydown="handleKeydown"
        @wheel.prevent="handleWheel"
      >
        <div
          ref="stageRef"
          class="au-image-preview__stage"
          :class="{
            'is-draggable': scale > 1,
            'is-interacting': interacting,
          }"
          @click.self="handleStageClick"
          @dblclick.self="toggleZoom"
          @pointerdown="handlePointerDown"
          @pointermove="handlePointerMove"
          @pointerup="handlePointerEnd"
          @pointercancel="handlePointerEnd"
        >
          <img
            v-if="currentImage"
            :key="currentImage.src"
            class="au-image-preview__image"
            :src="currentImage.src"
            :alt="currentImage.alt"
            :style="imageStyle"
            :draggable="false"
            @click.stop
            @dblclick.stop="toggleZoom"
            @dragstart.prevent
            @load="handleLoad"
            @error="handleError"
          />
          <div v-else class="au-image-preview__empty">
            <slot name="empty">暂无可预览图片</slot>
          </div>
          <div v-if="loadFailed" class="au-image-preview__error" role="status">
            <slot name="error" :image="currentImage" :index="activeIndex">
              <AuIcon :icon="IconPhotoOff" />
              <span>图片加载失败</span>
            </slot>
          </div>
        </div>

        <div class="au-image-preview__close au-material-surface au-depth-overlay">
          <AuTooltip :content="closeLabel" placement="left">
            <AuButton
              type="menu"
              size="small"
              :icon="IconX"
              circle
              :aria-label="closeLabel"
              @click="close('close-button')"
            />
          </AuTooltip>
        </div>

        <template v-if="hasMultiple">
          <div class="au-image-preview__navigation is-previous au-material-surface au-depth-overlay">
            <AuTooltip :content="previousLabel" placement="right">
              <AuButton
                type="menu"
                :icon="IconChevronLeft"
                circle
                :disabled="!canShowPrevious"
                :aria-label="previousLabel"
                @click="showPrevious"
              />
            </AuTooltip>
          </div>
          <div class="au-image-preview__navigation is-next au-material-surface au-depth-overlay">
            <AuTooltip :content="nextLabel" placement="left">
              <AuButton
                type="menu"
                :icon="IconChevronRight"
                circle
                :disabled="!canShowNext"
                :aria-label="nextLabel"
                @click="showNext"
              />
            </AuTooltip>
          </div>
        </template>

        <div
          v-if="showProgress && normalizedImages.length"
          class="au-image-preview__progress au-material-surface au-depth-overlay"
          aria-live="polite"
        >
          <slot
            name="progress"
            :current="activeIndex + 1"
            :total="normalizedImages.length"
            :image="currentImage"
          >
            {{ activeIndex + 1 }} / {{ normalizedImages.length }}
          </slot>
        </div>

        <div
          v-if="showToolbar"
          class="au-image-preview__toolbar au-material-surface au-depth-overlay"
          role="toolbar"
          :aria-label="toolbarLabel"
        >
          <slot
            name="toolbar"
            :zoom-in="zoomIn"
            :zoom-out="zoomOut"
            :reset="resetTransform"
            :rotate-left="rotateLeft"
            :rotate-right="rotateRight"
            :scale="scale"
            :rotation="rotation"
          >
            <AuTooltip content="缩小">
              <AuButton type="menu" size="small" :icon="IconZoomOut" circle aria-label="缩小" @click="zoomOut" />
            </AuTooltip>
            <AuTooltip content="放大">
              <AuButton type="menu" size="small" :icon="IconZoomIn" circle aria-label="放大" @click="zoomIn" />
            </AuTooltip>
            <AuTooltip content="还原">
              <AuButton type="menu" size="small" :icon="IconArrowsMaximize" circle aria-label="还原" @click="resetTransform" />
            </AuTooltip>
            <AuTooltip content="逆时针旋转">
              <AuButton type="menu" size="small" :icon="IconRotate2" circle aria-label="逆时针旋转" @click="rotateLeft" />
            </AuTooltip>
            <AuTooltip content="顺时针旋转">
              <AuButton type="menu" size="small" :icon="IconRotateClockwise2" circle aria-label="顺时针旋转" @click="rotateRight" />
            </AuTooltip>
          </slot>
        </div>
      </section>
    </Transition>
  </Teleport>
</template>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue';
import {
  IconArrowsMaximize,
  IconChevronLeft,
  IconChevronRight,
  IconPhotoOff,
  IconRotate2,
  IconRotateClockwise2,
  IconX,
  IconZoomIn,
  IconZoomOut,
} from '@tabler/icons-vue';
import { lockBodyScroll, unlockBodyScroll } from '../../utils/scroll-lock.js';
import { AuButton } from '../button/index.js';
import { AuIcon } from '../icon/index.js';
import { AuTooltip } from '../tooltip/index.js';
import {
  clampPreviewIndex,
  clampPreviewValue,
  normalizePreviewImages,
  normalizeRotation,
} from './image-preview-utils.js';

const FOCUSABLE_SELECTOR = [
  'button:not(:disabled)',
  'a[href]',
  'input:not(:disabled)',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const props = defineProps({
  modelValue: { type: Boolean, default: true },
  images: { type: Array, default: () => [] },
  urlList: { type: Array, default: () => [] },
  initialIndex: { type: Number, default: 0 },
  infinite: { type: Boolean, default: true },
  initialScale: { type: Number, default: 1 },
  zoomRate: { type: Number, default: 1.2, validator: (value) => value > 1 },
  minScale: { type: Number, default: 0.2, validator: (value) => value > 0 },
  maxScale: { type: Number, default: 5, validator: (value) => value > 0 },
  rotateStep: { type: Number, default: 90 },
  fit: {
    type: String,
    default: 'contain',
    validator: (value) => ['contain', 'cover', 'fill', 'none', 'scale-down'].includes(value),
  },
  wheelZoom: { type: Boolean, default: true },
  hideOnClickModal: { type: Boolean, default: false },
  closeOnPressEscape: { type: Boolean, default: true },
  lockScroll: { type: Boolean, default: true },
  showToolbar: { type: Boolean, default: true },
  showProgress: { type: Boolean, default: true },
  teleported: { type: Boolean, default: true },
  appendTo: { type: [String, Object], default: 'body' },
  topOffset: { type: [String, Number], default: 0 },
  zIndex: { type: Number, default: 10000 },
  ariaLabel: { type: String, default: '图片预览' },
  toolbarLabel: { type: String, default: '图片预览工具栏' },
  closeLabel: { type: String, default: '关闭预览' },
  previousLabel: { type: String, default: '上一张图片' },
  nextLabel: { type: String, default: '下一张图片' },
});

const emit = defineEmits([
  'update:modelValue',
  'open',
  'opened',
  'close',
  'closed',
  'switch',
  'zoom',
  'rotate',
  'load',
  'error',
]);

const viewerRef = ref(null);
const stageRef = ref(null);
const visible = ref(props.modelValue);
const activeIndex = ref(0);
const scale = ref(1);
const rotation = ref(0);
const offset = reactive({ x: 0, y: 0 });
const interacting = ref(false);
const loadFailed = ref(false);
const pointers = new Map();
const gesture = reactive({
  pointerId: null,
  startX: 0,
  startY: 0,
  originX: 0,
  originY: 0,
  pinchDistance: 0,
  pinchScale: 1,
  moved: false,
});
let scrollLocked = false;
let activated = false;
let previouslyFocusedElement = null;

const normalizedImages = computed(() => normalizePreviewImages(
  props.images.length ? props.images : props.urlList,
));
const currentImage = computed(() => normalizedImages.value[activeIndex.value] || null);
const hasMultiple = computed(() => normalizedImages.value.length > 1);
const canShowPrevious = computed(() => props.infinite || activeIndex.value > 0);
const canShowNext = computed(() => props.infinite || activeIndex.value < normalizedImages.value.length - 1);
const viewerStyle = computed(() => ({
  top: formatSize(props.topOffset),
  zIndex: props.zIndex,
}));
const imageStyle = computed(() => ({
  objectFit: props.fit,
  transform: `translate3d(${offset.x}px, ${offset.y}px, 0) rotate(${rotation.value}deg) scale(${scale.value})`,
}));

function formatSize(value) {
  return typeof value === 'number' ? `${value}px` : value;
}

function open() {
  if (visible.value) return;
  visible.value = true;
  emit('update:modelValue', true);
  emit('open');
  activateViewer();
}

function close(reason = 'api') {
  if (!visible.value) return;
  visible.value = false;
  emit('update:modelValue', false);
  emit('close', reason);
  deactivateViewer();
}

function setActiveItem(index) {
  const nextIndex = clampPreviewIndex(index, normalizedImages.value.length);
  if (nextIndex === activeIndex.value) return;
  activeIndex.value = nextIndex;
  resetTransform();
  loadFailed.value = false;
  emit('switch', nextIndex, currentImage.value);
}

function showPrevious() {
  if (!canShowPrevious.value || !hasMultiple.value) return;
  const nextIndex = activeIndex.value === 0
    ? normalizedImages.value.length - 1
    : activeIndex.value - 1;
  setActiveItem(nextIndex);
}

function showNext() {
  if (!canShowNext.value || !hasMultiple.value) return;
  const nextIndex = activeIndex.value === normalizedImages.value.length - 1
    ? 0
    : activeIndex.value + 1;
  setActiveItem(nextIndex);
}

function setScale(value, source = 'api') {
  const nextScale = Number(clampPreviewValue(
    value,
    Math.min(props.minScale, props.maxScale),
    Math.max(props.minScale, props.maxScale),
  ).toFixed(3));
  if (nextScale === scale.value) return;
  scale.value = nextScale;
  if (nextScale <= 1) {
    offset.x = 0;
    offset.y = 0;
  }
  emit('zoom', nextScale, source);
}

function zoomIn() {
  setScale(scale.value * props.zoomRate, 'zoom-in');
}

function zoomOut() {
  setScale(scale.value / props.zoomRate, 'zoom-out');
}

function toggleZoom() {
  if (scale.value > 1) resetTransform();
  else setScale(Math.max(props.zoomRate * props.zoomRate, 2), 'double-click');
}

function rotateLeft() {
  setRotation(rotation.value - props.rotateStep, 'anticlockwise');
}

function rotateRight() {
  setRotation(rotation.value + props.rotateStep, 'clockwise');
}

function setRotation(value, direction = 'api') {
  rotation.value = normalizeRotation(value);
  emit('rotate', rotation.value, direction);
}

function resetTransform() {
  scale.value = clampPreviewValue(
    props.initialScale,
    Math.min(props.minScale, props.maxScale),
    Math.max(props.minScale, props.maxScale),
  );
  rotation.value = 0;
  offset.x = 0;
  offset.y = 0;
  interacting.value = false;
  pointers.clear();
  gesture.pointerId = null;
  gesture.moved = false;
}

function handleWheel(event) {
  if (!props.wheelZoom) return;
  if (event.deltaY < 0) zoomIn();
  else if (event.deltaY > 0) zoomOut();
}

function handleStageClick() {
  if (gesture.moved) {
    gesture.moved = false;
    return;
  }
  if (props.hideOnClickModal) close('modal');
}

function handlePointerDown(event) {
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  stageRef.value?.setPointerCapture?.(event.pointerId);
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  interacting.value = true;
  gesture.moved = false;

  if (pointers.size >= 2) {
    gesture.pinchDistance = getPointerDistance();
    gesture.pinchScale = scale.value;
    gesture.pointerId = null;
    return;
  }

  if (scale.value > 1) {
    gesture.pointerId = event.pointerId;
    gesture.startX = event.clientX;
    gesture.startY = event.clientY;
    gesture.originX = offset.x;
    gesture.originY = offset.y;
  }
}

function handlePointerMove(event) {
  if (!pointers.has(event.pointerId)) return;
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

  if (pointers.size >= 2 && gesture.pinchDistance > 0) {
    const distance = getPointerDistance();
    if (Math.abs(distance - gesture.pinchDistance) > 2) gesture.moved = true;
    setScale(gesture.pinchScale * distance / gesture.pinchDistance, 'pinch');
    return;
  }

  if (gesture.pointerId !== event.pointerId || scale.value <= 1) return;
  const deltaX = event.clientX - gesture.startX;
  const deltaY = event.clientY - gesture.startY;
  if (Math.hypot(deltaX, deltaY) > 4) gesture.moved = true;
  offset.x = gesture.originX + deltaX;
  offset.y = gesture.originY + deltaY;
}

function handlePointerEnd(event) {
  pointers.delete(event.pointerId);
  if (stageRef.value?.hasPointerCapture?.(event.pointerId)) {
    stageRef.value.releasePointerCapture(event.pointerId);
  }
  if (pointers.size === 1 && scale.value > 1) {
    const [pointerId, point] = pointers.entries().next().value;
    gesture.pointerId = pointerId;
    gesture.startX = point.x;
    gesture.startY = point.y;
    gesture.originX = offset.x;
    gesture.originY = offset.y;
  } else if (pointers.size === 0) {
    interacting.value = false;
    gesture.pointerId = null;
    gesture.pinchDistance = 0;
  }
}

function getPointerDistance() {
  const points = [...pointers.values()];
  if (points.length < 2) return 0;
  return Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
}

function handleKeydown(event) {
  const target = event.target;
  if (event.key === 'Tab') {
    trapFocus(event);
    return;
  }
  if (target?.matches?.('input, textarea, select, [contenteditable="true"]')) return;
  const handlers = {
    Escape: props.closeOnPressEscape ? () => close('escape') : null,
    ArrowLeft: showPrevious,
    ArrowRight: showNext,
    '+': zoomIn,
    '=': zoomIn,
    '-': zoomOut,
    _: zoomOut,
    '0': resetTransform,
  };
  const handler = handlers[event.key];
  if (!handler) return;
  event.preventDefault();
  event.stopPropagation();
  handler();
}

function trapFocus(event) {
  const focusable = [...(viewerRef.value?.querySelectorAll(FOCUSABLE_SELECTOR) || [])];
  if (!focusable.length) {
    event.preventDefault();
    viewerRef.value?.focus?.({ preventScroll: true });
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!focusable.includes(document.activeElement)) {
    event.preventDefault();
    (event.shiftKey ? last : first).focus();
  } else if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

async function activateViewer() {
  if (activated || typeof document === 'undefined') return;
  activated = true;
  previouslyFocusedElement = document.activeElement;
  if (props.lockScroll && !scrollLocked) {
    lockBodyScroll();
    scrollLocked = true;
  }
  await nextTick();
  viewerRef.value?.focus?.({ preventScroll: true });
}

function deactivateViewer() {
  if (!activated || typeof document === 'undefined') return;
  activated = false;
  if (scrollLocked) {
    unlockBodyScroll();
    scrollLocked = false;
  }
  previouslyFocusedElement?.focus?.({ preventScroll: true });
  previouslyFocusedElement = null;
}

function handleLoad(event) {
  loadFailed.value = false;
  emit('load', event, currentImage.value, activeIndex.value);
}

function handleError(event) {
  loadFailed.value = true;
  emit('error', event, currentImage.value, activeIndex.value);
}

watch(
  () => props.modelValue,
  (value) => {
    if (value === visible.value) return;
    visible.value = value;
    if (value) {
      emit('open');
      activateViewer();
    } else deactivateViewer();
  },
);

watch(
  () => [props.initialIndex, normalizedImages.value],
  () => {
    activeIndex.value = clampPreviewIndex(props.initialIndex, normalizedImages.value.length);
    loadFailed.value = false;
    resetTransform();
  },
  { immediate: true },
);

watch(
  () => [props.minScale, props.maxScale, props.initialScale],
  () => setScale(scale.value, 'bounds'),
);

onMounted(() => {
  if (visible.value) {
    emit('open');
    activateViewer();
  }
});
onBeforeUnmount(deactivateViewer);

defineExpose({
  activeIndex,
  close,
  open,
  resetTransform,
  rotateLeft,
  rotateRight,
  scale,
  setActiveItem,
  setScale,
  showNext,
  showPrevious,
  viewerRef,
  zoomIn,
  zoomOut,
});
</script>

<style scoped>
.au-image-preview {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  color: var(--au-color-text-primary);
  background: transparent;
  outline: none;
  user-select: none;
  overscroll-behavior: contain;
}

.au-image-preview__stage {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 72px 76px;
  touch-action: none;
}

.au-image-preview__stage.is-draggable {
  cursor: grab;
}

.au-image-preview__stage.is-interacting {
  cursor: grabbing;
}

.au-image-preview__image {
  display: block;
  max-width: 100%;
  max-height: 100%;
  transform-origin: center;
  will-change: transform;
  -webkit-user-drag: none;
}

.au-image-preview__empty,
.au-image-preview__error {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--au-color-text-secondary);
}

.au-image-preview__error {
  position: absolute;
  inset: 0;
  flex-direction: column;
  pointer-events: none;
}

.au-image-preview__error :deep(.au-icon) {
  font-size: 28px;
}

.au-image-preview__close,
.au-image-preview__navigation,
.au-image-preview__progress,
.au-image-preview__toolbar {
  position: absolute;
  z-index: 2;
  border: 1px solid var(--au-material-border);
  color: var(--au-color-text-primary);
  backdrop-filter: blur(var(--au-material-blur)) saturate(var(--au-material-saturation));
}

.au-image-preview__close {
  top: 16px;
  right: 16px;
  display: flex;
  padding: 2px;
  border-radius: var(--au-radius-round);
}

.au-image-preview__navigation {
  top: 50%;
  display: flex;
  padding: 2px;
  border-radius: var(--au-radius-round);
  transform: translateY(-50%);
}

.au-image-preview__navigation.is-previous {
  left: 16px;
}

.au-image-preview__navigation.is-next {
  right: 16px;
}

.au-image-preview__progress {
  bottom: 58px;
  left: 50%;
  min-width: 48px;
  padding: 3px 9px;
  border-radius: var(--au-radius-round);
  font-size: var(--au-font-size-small);
  font-variant-numeric: tabular-nums;
  text-align: center;
  transform: translateX(-50%);
}

.au-image-preview__toolbar {
  bottom: 14px;
  left: 50%;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  border-radius: var(--au-radius-round);
  transform: translateX(-50%);
}

.au-image-preview-fade-enter-active,
.au-image-preview-fade-leave-active {
  transition: opacity var(--au-transition-duration) var(--au-transition-ease);
}

.au-image-preview-fade-enter-from,
.au-image-preview-fade-leave-to {
  opacity: 0;
}

@media (max-width: 720px) {
  .au-image-preview__stage {
    padding: 56px 18px 76px;
  }

  .au-image-preview__navigation.is-previous {
    left: 8px;
  }

  .au-image-preview__navigation.is-next {
    right: 8px;
  }

  .au-image-preview__close {
    top: 8px;
    right: 8px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .au-image-preview-fade-enter-active,
  .au-image-preview-fade-leave-active {
    transition: none;
  }
}

@media (prefers-reduced-transparency: reduce) {
  .au-image-preview__close,
  .au-image-preview__navigation,
  .au-image-preview__progress,
  .au-image-preview__toolbar {
    background: var(--au-color-bg-overlay);
    backdrop-filter: none;
  }
}

@media (prefers-contrast: more) {
  .au-image-preview__close,
  .au-image-preview__navigation,
  .au-image-preview__progress,
  .au-image-preview__toolbar {
    border-color: var(--au-color-text-secondary);
  }
}

@media (forced-colors: active) {
  .au-image-preview__close,
  .au-image-preview__navigation,
  .au-image-preview__progress,
  .au-image-preview__toolbar {
    color: CanvasText;
    background: Canvas;
  }
}
</style>
