<template>
  <Teleport :to="appendTo" :disabled="!teleported">
    <Transition
      name="au-drawer"
      @after-enter="handleAfterEnter"
      @after-leave="handleAfterLeave"
    >
      <div
        v-if="rendered"
        v-show="visible"
        class="au-drawer__overlay au-component au-overscroll-contain"
        :class="{ 'is-modal': modal }"
        :style="overlayStyle"
        @mousedown.self="handleOverlayClick"
      >
        <aside
          ref="drawerRef"
          v-bind="$attrs"
          class="au-drawer au-component au-material-surface au-depth-overlay au-overlay-surface"
          :class="['is-' + direction, { 'is-full-width': fullWidth && (direction === 'ltr' || direction === 'rtl') }]"
          :style="drawerStyle"
          tabindex="-1"
          @mousedown.stop
        >
          <template v-if="!destroyOnClose || contentRendered">
            <header v-if="hasHeader" class="au-drawer__header">
              <slot name="header" :close="close">
                <h2 v-if="title" class="au-drawer__title au-wrap-anywhere">{{ title }}</h2>
              </slot>
              <AuTooltip v-if="showClose" :content="closeLabel" :disabled="!closeLabel">
                <AuButton
                  class="au-drawer__close"
                  size="small"
                  :icon="IconX"
                  circle
                  :disabled="closingPending"
                  @click="close('close-button')"
                />
              </AuTooltip>
            </header>

            <div class="au-drawer__body au-scroll-region au-thin-scrollbar">
              <slot :close="close"></slot>
            </div>

            <footer v-if="$slots.footer" class="au-drawer__footer">
              <slot name="footer" :close="close"></slot>
            </footer>
          </template>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue';
import { IconX } from '../../icons/internal.js';
import { lockBodyScroll, unlockBodyScroll } from '../../utils/scroll-lock.js';
import { useOverlayLayer } from '../../utils/overlay-layer.js';
import { AuButton } from '../button/index.js';
import { AuTooltip } from '../tooltip/index.js';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  direction: {
    type: String,
    default: 'rtl',
    validator: (value) => ['ltr', 'rtl', 'ttb', 'btt'].includes(value),
  },
  size: { type: [String, Number], default: 'min(420px, calc(100vw - 16px))' },
  fullWidth: { type: Boolean, default: false },
  modal: { type: Boolean, default: true },
  lockScroll: { type: Boolean, default: true },
  teleported: { type: Boolean, default: true },
  appendTo: { type: [String, Object], default: 'body' },
  viewportPadding: { type: [String, Number], default: 0 },
  closeOnClickModal: { type: Boolean, default: true },
  closeOnPressEscape: { type: Boolean, default: true },
  showClose: { type: Boolean, default: true },
  withHeader: { type: Boolean, default: true },
  closeLabel: { type: String, default: '关闭抽屉' },
  destroyOnClose: { type: Boolean, default: false },
  beforeClose: { type: Function, default: null },
  zIndex: { type: Number, default: 10000 },
});

const emit = defineEmits([
  'update:modelValue',
  'open',
  'opened',
  'close',
  'closed',
  'before-close-error',
]);
const slots = useSlots();
const overlayLayer = useOverlayLayer(() => props.zIndex);
const drawerRef = ref(null);
const visible = ref(Boolean(props.modelValue));
const rendered = ref(Boolean(props.modelValue));
const contentRendered = ref(Boolean(props.modelValue));
const closingPending = ref(false);

let scrollLocked = false;
let previouslyFocusedElement = null;
let closeRequestId = 0;

const hasHeader = computed(() => {
  return props.withHeader && Boolean(props.title || slots.header || props.showClose);
});
const overlayStyle = computed(() => ({
  zIndex: overlayLayer.value,
  padding: formatSize(props.viewportPadding),
}));
const drawerStyle = computed(() => {
  const size = formatSize(props.size);
  const horizontal = props.direction === 'ltr' || props.direction === 'rtl';
  return horizontal
    ? { width: props.fullWidth ? '100%' : size, height: '100%', maxWidth: props.fullWidth ? '100%' : 'calc(100% - 16px)' }
    : { width: '100%', height: size, maxHeight: 'calc(100% - 16px)' };
});

function formatSize(value) {
  if (value === '' || value == null) return undefined;
  return typeof value === 'number' ? String(value) + 'px' : value;
}

function setVisible(value) {
  if (visible.value === value) return;
  if (value) {
    rendered.value = true;
    contentRendered.value = true;
    visible.value = true;
    emit('open');
    activateDrawer();
  } else {
    closeRequestId += 1;
    closingPending.value = false;
    visible.value = false;
    deactivateDrawer();
  }
}

function commitClose(reason) {
  if (!visible.value) return;
  visible.value = false;
  emit('update:modelValue', false);
  emit('close', reason);
  deactivateDrawer();
}

function close(reason = 'api') {
  if (!visible.value || closingPending.value) return;
  if (typeof props.beforeClose !== 'function') {
    commitClose(reason);
    return;
  }

  closingPending.value = true;
  const requestId = ++closeRequestId;
  let settled = false;
  const finish = (allowed) => {
    if (settled || requestId !== closeRequestId) return;
    settled = true;
    closingPending.value = false;
    if (allowed !== false) commitClose(reason);
  };
  const done = (allowed = true) => finish(allowed);

  try {
    const result = props.beforeClose(done);
    if (result && typeof result.then === 'function') {
      Promise.resolve(result)
        .then((allowed) => finish(allowed !== false))
        .catch((error) => {
          finish(false);
          if (requestId === closeRequestId) emit('before-close-error', error);
        });
    } else if (result !== undefined) {
      finish(result !== false);
    }
  } catch (error) {
    finish(false);
    emit('before-close-error', error);
  }
}

function handleOverlayClick() {
  if (props.modal && props.closeOnClickModal) close('overlay');
}

function handleKeydown(event) {
  if (!visible.value || !drawerRef.value?.contains(event.target)) return;
  if (event.key === 'Escape' && props.closeOnPressEscape) {
    event.preventDefault();
    event.stopPropagation();
    close('escape');
    return;
  }
}

async function activateDrawer() {
  if (typeof document === 'undefined') return;
  previouslyFocusedElement = document.activeElement;
  document.addEventListener('keydown', handleKeydown);
  if (props.lockScroll && !scrollLocked) {
    lockBodyScroll();
    scrollLocked = true;
  }
  await nextTick();
  if (!visible.value) return;
  focusInitialElement();
}

function deactivateDrawer() {
  if (typeof document === 'undefined') return;
  document.removeEventListener('keydown', handleKeydown);
  if (scrollLocked) {
    unlockBodyScroll();
    scrollLocked = false;
  }
  if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
    previouslyFocusedElement.focus({ preventScroll: true });
  }
  previouslyFocusedElement = null;
}

function focusInitialElement() {
  const drawer = drawerRef.value;
  if (!drawer) return;
  const autofocusTarget = drawer.querySelector('[autofocus]:not(:disabled)');
  (autofocusTarget || drawer).focus({ preventScroll: true });
}

function handleAfterEnter() {
  emit('opened');
}

function handleAfterLeave() {
  if (props.destroyOnClose && !visible.value) contentRendered.value = false;
  emit('closed');
}

watch(
  () => props.modelValue,
  (value) => setVisible(Boolean(value))
);

onMounted(() => {
  if (visible.value) {
    emit('open');
    activateDrawer();
  }
});

onBeforeUnmount(() => {
  closeRequestId += 1;
  closingPending.value = false;
  deactivateDrawer();
});

defineExpose({ close, drawerRef });
</script>

<style scoped lang="scss" src="./AuDrawer.scss"></style>
