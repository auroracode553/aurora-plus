<template>
  <Transition
    name="au-loading-fade"
    appear
    @after-enter="emit('opened')"
    @after-leave="handleAfterLeave"
  >
    <div
      v-if="displayLoading"
      class="au-loading au-component"
      :class="[{ 'is-fullscreen': fullscreen }, customClass]"
      :style="overlayStyle"
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

<style scoped lang="scss" src="./AuLoadingOverlay.scss"></style>
