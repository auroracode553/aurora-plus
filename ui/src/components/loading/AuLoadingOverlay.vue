<template>
  <Transition
    name="au-loading-fade"
    appear
    @after-enter="emit('opened')"
    @after-leave="handleAfterLeave"
  >
    <div
      v-if="displayLoading"
      class="au-loading au-component au-forced-canvas"
      :class="[{ 'is-fullscreen': fullscreen }, customClass]"
      :style="overlayStyle"
      role="status"
      aria-live="polite"
      :aria-label="resolvedAriaLabel"
    >
      <div class="au-loading__content" :class="`is-${size}`">
        <slot name="spinner" :size="size">
          <AuLoadingSpinner
            :size="size"
            :spinner="spinner"
            :svg="svg"
            :svg-view-box="svgViewBox"
            :color="color"
          />
        </slot>
        <span v-if="hasText" class="au-loading__text au-wrap-anywhere">
          <LoadingContent :content="text" />
        </span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import {
  computed,
  defineComponent,
  isVNode,
  nextTick,
  onBeforeUnmount,
  ref,
  watch,
} from 'vue';
import { lockBodyScroll, unlockBodyScroll } from '../../utils/scroll-lock.js';
import AuLoadingSpinner from './AuLoadingSpinner.vue';

const props = defineProps({
  loading: { type: Boolean, default: false },
  text: { type: [String, Number, Array, Object], default: '' },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value),
  },
  spinner: { type: [Object, Function], default: null },
  svg: { type: String, default: '' },
  svgViewBox: { type: String, default: '0 0 24 24' },
  color: { type: String, default: '' },
  fullscreen: { type: Boolean, default: false },
  lock: { type: Boolean, default: false },
  background: { type: String, default: '' },
  customClass: { type: [String, Array, Object], default: '' },
  zIndex: { type: Number, default: 1000 },
  ariaLabel: { type: String, default: '加载中' },
  delay: { type: Number, default: 0, validator: (value) => value >= 0 },
});

const emit = defineEmits(['opened', 'closed']);
const displayLoading = ref(false);
let delayTimer = null;
let closePending = false;
let bodyLocked = false;

const LoadingContent = defineComponent({
  name: 'AuLoadingContent',
  props: {
    content: { type: [String, Number, Array, Object], default: '' },
  },
  setup(contentProps) {
    return () => {
      if (Array.isArray(contentProps.content) || isVNode(contentProps.content)) {
        return contentProps.content;
      }
      return String(contentProps.content ?? '');
    };
  },
});

const hasText = computed(() => {
  if (Array.isArray(props.text)) return props.text.length > 0;
  return props.text !== '' && props.text != null;
});
const resolvedAriaLabel = computed(() => (
  props.ariaLabel || (typeof props.text === 'string' ? props.text : '') || '加载中'
));
const overlayStyle = computed(() => ({
  background: props.background || undefined,
  color: props.color || undefined,
  zIndex: props.zIndex,
}));

function clearDelayTimer() {
  if (delayTimer == null) return;
  globalThis.clearTimeout(delayTimer);
  delayTimer = null;
}

function notifyClosed() {
  if (!closePending) return;
  closePending = false;
  emit('closed');
}

function syncVisibility(value, previousValue) {
  const hadPendingDelay = delayTimer != null;
  clearDelayTimer();

  if (!value) {
    if (displayLoading.value) {
      closePending = true;
      displayLoading.value = false;
    } else if (previousValue === true || hadPendingDelay) {
      closePending = true;
      nextTick(notifyClosed);
    }
    return;
  }

  closePending = false;
  if (props.delay <= 0) {
    displayLoading.value = true;
    return;
  }

  delayTimer = globalThis.setTimeout(() => {
    delayTimer = null;
    if (props.loading) displayLoading.value = true;
  }, props.delay);
}

function syncBodyLock() {
  const shouldLock = Boolean(props.lock && displayLoading.value);
  if (shouldLock && !bodyLocked) {
    lockBodyScroll();
    bodyLocked = true;
  } else if (!shouldLock && bodyLocked) {
    unlockBodyScroll();
    bodyLocked = false;
  }
}

function handleAfterLeave() {
  notifyClosed();
}

watch(() => props.loading, syncVisibility, { immediate: true });
watch([displayLoading, () => props.lock], syncBodyLock, { immediate: true });

onBeforeUnmount(() => {
  clearDelayTimer();
  if (bodyLocked) unlockBodyScroll();
  bodyLocked = false;
});
</script>

<style scoped lang="scss">
.au-loading {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: grid;
  place-items: center;
  min-width: 0;
  min-height: 48px;
  overflow: hidden;
  color: var(--au-color-text-primary);
  background: color-mix(in srgb, var(--au-material-background) 72%, transparent);
  backdrop-filter: blur(2px) saturate(110%);
  -webkit-backdrop-filter: blur(2px) saturate(110%);
  pointer-events: auto;
}

.au-loading.is-fullscreen {
  position: fixed;
  width: 100vw;
  height: 100vh;
}

.au-loading__content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  max-width: min(90vw, 360px);
  flex-direction: column;
  gap: 8px;
  padding: 10px 14px;
  color: inherit;
  text-align: center;
}

.au-loading__text {
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-base);
  line-height: 1.4;
}

.au-loading__content.is-small .au-loading__text {
  font-size: var(--au-font-size-small);
}

.au-loading__content.is-large .au-loading__text {
  font-size: var(--au-font-size-large);
}

.au-loading-fade-enter-active,
.au-loading-fade-leave-active {
  transition: opacity var(--au-transition-duration) var(--au-transition-timing);
}

.au-loading-fade-enter-from,
.au-loading-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
  .au-loading {
    background: var(--au-color-background-overlay) !important;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}

@media (prefers-contrast: more) {
  .au-loading {
    outline: 1px solid var(--au-color-text-secondary);
    outline-offset: -1px;
  }
}

@media (forced-colors: active) {
  .au-loading {
    color: CanvasText !important;
    background: Canvas !important;
  }
}
</style>
