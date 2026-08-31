<template>
  <AuPopover
    ref="popoverRef"
    v-model="visible"
    class="au-popconfirm"
    :placement="placement"
    :offset="offset"
    :trigger="trigger"
    :disabled="disabled"
    :close-on-click-outside="closeOnClickOutside"
    :close-on-press-escape="closeOnPressEscape"
    :teleported="teleported"
    :append-to="appendTo"
    :z-index="zIndex"
    role="alertdialog"
    :aria-label="ariaLabel || title"
    @open="emit('open')"
    @opened="emit('opened')"
    @close="handleClose"
    @closed="emit('closed')"
  >
    <template #trigger="slotProps">
      <slot name="reference" v-bind="slotProps"></slot>
    </template>

    <div class="au-popconfirm__content" :style="contentStyle">
      <div class="au-popconfirm__message">
        <slot name="icon">
          <AuIcon
            v-if="!hideIcon && icon"
            class="au-popconfirm__icon"
            :icon="icon"
            :color="iconColor || undefined"
          />
        </slot>
        <div class="au-popconfirm__title">
          <slot>{{ title }}</slot>
        </div>
      </div>

      <div class="au-popconfirm__actions">
        <AuButton
          :type="cancelButtonType"
          size="small"
          :disabled="cancelButtonDisabled || confirmButtonLoading"
          @click="cancel"
        >
          {{ cancelButtonText }}
        </AuButton>
        <AuButton
          :type="confirmButtonType"
          size="small"
          :loading="confirmButtonLoading"
          :disabled="confirmButtonDisabled"
          @click="confirm"
        >
          {{ confirmButtonText }}
        </AuButton>
      </div>
    </div>
  </AuPopover>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { IconAlertCircle } from '@tabler/icons-vue';
import { AuButton } from '../button/index.js';
import { AuIcon } from '../icon/index.js';
import { AuPopover } from '../popover/index.js';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '确定执行此操作吗？' },
  confirmButtonText: { type: String, default: '确定' },
  cancelButtonText: { type: String, default: '取消' },
  confirmButtonType: { type: String, default: 'primary' },
  cancelButtonType: { type: String, default: 'default' },
  confirmButtonLoading: { type: Boolean, default: false },
  confirmButtonDisabled: { type: Boolean, default: false },
  cancelButtonDisabled: { type: Boolean, default: false },
  icon: { type: [Object, Function], default: IconAlertCircle },
  iconColor: { type: String, default: '' },
  hideIcon: { type: Boolean, default: false },
  width: { type: [String, Number], default: 220 },
  placement: { type: String, default: 'top' },
  offset: { type: Number, default: 8 },
  trigger: {
    type: String,
    default: 'click',
    validator: (value) => ['click', 'manual'].includes(value),
  },
  disabled: { type: Boolean, default: false },
  closeOnClickOutside: { type: Boolean, default: true },
  closeOnPressEscape: { type: Boolean, default: true },
  teleported: { type: Boolean, default: true },
  appendTo: { type: [String, Object], default: 'body' },
  zIndex: { type: Number, default: 1300 },
  ariaLabel: { type: String, default: '' },
});

const emit = defineEmits([
  'update:modelValue',
  'confirm',
  'cancel',
  'open',
  'opened',
  'close',
  'closed',
]);

const popoverRef = ref(null);
const visible = ref(props.modelValue);
const contentStyle = computed(() => ({ width: formatSize(props.width) }));

function formatSize(value) {
  return typeof value === 'number' ? `${value}px` : value;
}

function open(focusContent = false) {
  popoverRef.value?.open(focusContent);
}

function close(reason = 'api', restoreFocus = true) {
  popoverRef.value?.close(reason, restoreFocus);
}

function confirm(event) {
  if (props.confirmButtonDisabled || props.confirmButtonLoading) return;
  emit('confirm', event);
  close('confirm');
}

function cancel(event) {
  if (props.cancelButtonDisabled || props.confirmButtonLoading) return;
  emit('cancel', event);
  close('cancel');
}

function handleClose(reason) {
  emit('close', reason);
  if (reason !== 'confirm' && reason !== 'cancel') emit('cancel', reason);
}

watch(
  visible,
  (value) => emit('update:modelValue', value),
);

watch(
  () => props.modelValue,
  (value) => { visible.value = value; },
);

defineExpose({ open, close, popoverRef });
</script>

<style scoped>
.au-popconfirm__content {
  max-width: calc(100vw - 40px);
}

.au-popconfirm__message {
  display: flex;
  align-items: flex-start;
  min-width: 0;
  gap: 8px;
}

.au-popconfirm__icon {
  margin-top: 1px;
  color: var(--au-color-warning);
  font-size: 17px;
}

.au-popconfirm__title {
  min-width: 0;
  color: var(--au-color-text-primary);
  font-size: 13px;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.au-popconfirm__actions {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 12px;
}

@media (prefers-contrast: more) {
  .au-popconfirm__icon {
    color: var(--au-color-text-primary);
  }
}
</style>
