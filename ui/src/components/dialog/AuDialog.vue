<template>
  <Teleport to="body" :disabled="!appendToBody">
    <Transition name="au-dialog-fade" @after-enter="handleAfterEnter" @after-leave="handleAfterLeave">
      <div
        v-if="visible"
        class="au-dialog__overlay au-motion-popover au-overscroll-contain"
        :class="{ 'is-modal': modal }"
        :style="overlayStyle"
        @mousedown.self="handleOverlayClick"
      >
        <section
          ref="dialogRef"
          class="au-dialog au-component au-material-surface au-depth-overlay au-motion-popover au-overlay-surface"
          :style="dialogStyle"
          role="dialog"
          :aria-modal="modal ? 'true' : undefined"
          :aria-labelledby="hasHeader ? titleId : undefined"
          tabindex="-1"
          @mousedown.stop
        >
          <header v-if="hasHeader" class="au-dialog__header">
            <slot name="header" :close="close">
              <h2 :id="titleId" class="au-dialog__title au-wrap-anywhere">{{ title }}</h2>
            </slot>
            <AuTooltip v-if="showClose" :content="closeLabel" :disabled="!closeLabel">
              <AuButton
                class="au-dialog__close"
                size="small"
                :icon="IconX"
                circle
                :aria-label="closeLabel || '关闭'"
                @click="close('close-button')"
              />
            </AuTooltip>
          </header>

          <div class="au-dialog__body au-scroll-region au-thin-scrollbar"><slot :close="close"></slot></div>

          <footer v-if="$slots.footer" class="au-dialog__footer">
            <slot name="footer" :close="close"></slot>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue';
import { IconX } from '../../icons/internal.js';
import { lockBodyScroll, unlockBodyScroll } from '../../utils/scroll-lock.js';
import { AuButton } from '../button/index.js';
import { AuTooltip } from '../tooltip/index.js';

let dialogSeed = 0;

const props = defineProps({
  modelValue: { type: Boolean, default: true },
  title: { type: String, default: '' },
  width: { type: [String, Number], default: 'min(560px, calc(100vw - 32px))' },
  height: { type: [String, Number], default: '' },
  maxHeight: { type: [String, Number], default: '90vh' },
  top: { type: [String, Number], default: '' },
  modal: { type: Boolean, default: true },
  lockScroll: { type: Boolean, default: true },
  appendToBody: { type: Boolean, default: true },
  closeOnClickModal: { type: Boolean, default: false },
  closeOnOverlay: { type: Boolean, default: false },
  closeOnPressEscape: { type: Boolean, default: true },
  showClose: { type: Boolean, default: true },
  closeLabel: { type: String, default: '关闭' },
  zIndex: { type: Number, default: 10000 },
});

const emit = defineEmits(['update:modelValue', 'open', 'opened', 'close', 'closed']);
const slots = useSlots();
const dialogRef = ref(null);
const visible = ref(props.modelValue);
const titleId = `au-dialog-title-${++dialogSeed}`;

let scrollLocked = false;
let previouslyFocusedElement = null;

const hasHeader = computed(() => Boolean(props.title || slots.header || props.showClose));
const overlayStyle = computed(() => ({ zIndex: props.zIndex }));
const dialogStyle = computed(() => ({
  width: formatSize(props.width),
  height: formatSize(props.height),
  maxHeight: formatSize(props.maxHeight),
  marginTop: formatSize(props.top),
}));

function formatSize(value) {
  if (value === '' || value == null) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

function setVisible(value) {
  if (visible.value === value) return;
  visible.value = value;
  if (value) {
    emit('open');
    activateDialog();
  } else {
    deactivateDialog();
  }
}

function close(reason = 'api') {
  if (!visible.value) return;
  visible.value = false;
  emit('update:modelValue', false);
  emit('close', reason);
  deactivateDialog();
}

function handleOverlayClick() {
  if (props.closeOnClickModal || props.closeOnOverlay) close('overlay');
}

function handleKeydown(event) {
  if (event.key === 'Escape' && props.closeOnPressEscape) {
    event.stopPropagation();
    close('escape');
  }
}

async function activateDialog() {
  if (typeof document === 'undefined') return;
  previouslyFocusedElement = document.activeElement;
  document.addEventListener('keydown', handleKeydown);
  if (props.lockScroll && !scrollLocked) {
    lockBodyScroll();
    scrollLocked = true;
  }
  await nextTick();
  focusInitialElement();
}

function deactivateDialog() {
  if (typeof document === 'undefined') return;
  document.removeEventListener('keydown', handleKeydown);
  if (scrollLocked) {
    unlockBodyScroll();
    scrollLocked = false;
  }
  if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
    previouslyFocusedElement.focus();
  }
  previouslyFocusedElement = null;
}

function focusInitialElement() {
  const dialog = dialogRef.value;
  if (!dialog) return;

  // 只有业务显式声明 autofocus 时才聚焦控件，避免关闭按钮抢占初始焦点并触发 Tooltip。
  const autofocusTarget = dialog.querySelector('[autofocus]:not(:disabled)');
  if (autofocusTarget) {
    autofocusTarget.focus({ preventScroll: true });
    return;
  }

  dialog.focus({ preventScroll: true });
}

function handleAfterEnter() {
  emit('opened');
}

function handleAfterLeave() {
  emit('closed');
}

watch(
  () => props.modelValue,
  (value) => setVisible(value)
);

onMounted(() => {
  if (visible.value) {
    emit('open');
    activateDialog();
  }
});

onBeforeUnmount(deactivateDialog);

defineExpose({ close, dialogRef });
</script>

<style scoped lang="scss">
.au-dialog__overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.au-dialog__overlay.is-modal {
  background: transparent;
}

.au-dialog__overlay:not(.is-modal) {
  pointer-events: none;
}

.au-dialog {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  max-width: calc(100vw - 32px);
  overflow: hidden;
  outline: none;
  pointer-events: auto;
  transform-origin: center;
}

.au-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 56px;
  padding: 12px 18px;
  border-bottom: 1px solid var(--au-material-border-emphasis);
  flex-shrink: 0;
}

.au-dialog__title {
  margin: 0;
  color: var(--au-color-text-primary);
  font-size: 18px;
  font-weight: var(--au-font-weight-semibold);
  letter-spacing: -0.018em;
  line-height: 1.2;
}

.au-dialog__close {
  flex: none;
}

.au-dialog__body {
  flex: 1;
  min-width: 0;
  padding: 16px 18px;
}

.au-dialog__footer {
  display: flex;
  justify-content: flex-end;
  min-width: 0;
  gap: 8px;
  flex-wrap: wrap;
  padding: 12px 18px 14px;
  border-top: 1px solid var(--au-material-border-emphasis);
  background: transparent;
  flex-shrink: 0;
}

.au-dialog-fade-enter-from,
.au-dialog-fade-leave-to,
.au-dialog-fade-enter-from .au-dialog,
.au-dialog-fade-leave-to .au-dialog {
  opacity: 0;
}

.au-dialog-fade-enter-from .au-dialog,
.au-dialog-fade-leave-to .au-dialog {
  transform: translateY(-8px) scale(0.985);
}

@media (prefers-reduced-motion: reduce) {
  .au-dialog-fade-enter-from .au-dialog,
  .au-dialog-fade-leave-to .au-dialog {
    transform: none;
  }
}

</style>
