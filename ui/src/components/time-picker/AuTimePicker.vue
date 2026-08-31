<template>
  <AuPopover
    ref="popoverRef"
    v-model="visible"
    class="au-time-picker"
    :class="$attrs.class"
    :style="$attrs.style"
    :placement="placement"
    :offset="6"
    trigger="manual"
    :disabled="disabled || readonly"
    :surface="false"
    :teleported="teleported"
    :append-to="appendTo"
    :z-index="zIndex"
    role="dialog"
    :aria-label="ariaLabel"
    @click="handleTriggerClick"
    @close="handlePopoverClose"
  >
    <template #trigger="{ triggerProps }">
      <AuInput
        ref="inputRef"
        :model-value="inputText"
        :size="size"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly || !editable"
        :clearable="clearable"
        :clearable-when-readonly="!readonly"
        replace-suffix-on-clear
        :invalid="invalid || inputInvalid"
        :suffix-icon="IconClock"
        v-bind="inputAttrs"
        role="combobox"
        aria-haspopup="dialog"
        :aria-expanded="triggerProps['aria-expanded']"
        :aria-controls="triggerProps['aria-controls']"
        :aria-label="ariaLabel"
        @update:model-value="handleInput"
        @clear="clear"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleInputKeydown"
      />
      <input
        v-if="$attrs.name"
        type="hidden"
        :name="$attrs.name"
        :form="$attrs.form"
        :value="formValue"
        :disabled="disabled"
      />
    </template>

    <section class="au-time-picker__popover au-component au-material-surface au-depth-overlay">
      <AuTimePickerPanel
        :model-value="draftDate"
        :hour-step="hourStep"
        :minute-step="minuteStep"
        :second-step="secondStep"
        :show-seconds="showSeconds"
        :append-to="appendTo"
        :z-index="zIndex + 1"
        :aria-label="ariaLabel"
        @update:model-value="updateDraftDate"
      />
      <div v-if="draftInvalid" class="au-time-picker__status" role="status">
        该时间不可用
      </div>
      <footer class="au-time-picker__footer">
        <button class="au-time-picker__action au-focus-ring" type="button" @click="selectNow">
          现在
        </button>
        <span class="au-time-picker__spacer"></span>
        <button class="au-time-picker__action au-focus-ring" type="button" @click="cancel">
          取消
        </button>
        <button
          class="au-time-picker__action is-primary au-focus-ring"
          type="button"
          :disabled="draftInvalid"
          @click="confirm"
        >
          确定
        </button>
      </footer>
    </section>
  </AuPopover>
</template>

<script setup>
import { computed, ref, useAttrs, watch } from 'vue';
import { IconClock } from '@tabler/icons-vue';
import { AuInput } from '../input/index.js';
import { AuPopover } from '../popover/index.js';
import AuTimePickerPanel from './AuTimePickerPanel.vue';
import {
  clampTime,
  cloneDate,
  emptyPickerValue,
  formatDate,
  isTimeDisabled,
  parseDateValue,
  toPickerValue,
} from '../../utils/date-time.js';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  modelValue: { type: [Date, String, Number], default: '' },
  valueType: {
    type: String,
    default: 'auto',
    validator: (value) => ['auto', 'string', 'date', 'timestamp'].includes(value),
  },
  valueFormat: { type: String, default: '' },
  displayFormat: { type: String, default: '' },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value),
  },
  placeholder: { type: String, default: '选择时间' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  editable: { type: Boolean, default: true },
  clearable: { type: Boolean, default: true },
  invalid: { type: Boolean, default: false },
  showSeconds: { type: Boolean, default: true },
  hourStep: { type: Number, default: 1 },
  minuteStep: { type: Number, default: 1 },
  secondStep: { type: Number, default: 1 },
  minTime: { type: [Date, String, Number], default: null },
  maxTime: { type: [Date, String, Number], default: null },
  disabledTime: { type: Function, default: null },
  placement: { type: String, default: 'bottom-start' },
  teleported: { type: Boolean, default: true },
  appendTo: { type: [String, Object], default: 'body' },
  zIndex: { type: Number, default: 1200 },
  ariaLabel: { type: String, default: '选择时间' },
});

const emit = defineEmits([
  'update:modelValue',
  'change',
  'clear',
  'focus',
  'blur',
  'visible-change',
  'invalid-input',
]);
const attrs = useAttrs();
const popoverRef = ref(null);
const inputRef = ref(null);
const visible = ref(false);
const resolvedValueFormat = computed(() => props.valueFormat || (props.showSeconds ? 'HH:mm:ss' : 'HH:mm'));
const resolvedDisplayFormat = computed(() => props.displayFormat || (props.showSeconds ? 'HH:mm:ss' : 'HH:mm'));
const selectedDate = ref(parseDateValue(props.modelValue, resolvedValueFormat.value));
const draftDate = ref(cloneDate(selectedDate.value || new Date()));
const inputText = ref(formatDate(selectedDate.value, resolvedDisplayFormat.value));
const inputInvalid = ref(false);
let closeCommittedInput = false;
let inputDirty = false;

const inputAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([name]) => !['class', 'style', 'name'].includes(name)),
));
const minTimeValue = computed(() => parseDateValue(
  props.minTime,
  resolvedValueFormat.value,
  draftDate.value,
));
const maxTimeValue = computed(() => parseDateValue(
  props.maxTime,
  resolvedValueFormat.value,
  draftDate.value,
));
const draftInvalid = computed(() => isTimeDisabled(draftDate.value, {
  minTime: minTimeValue.value,
  maxTime: maxTimeValue.value,
  disabledTime: props.disabledTime,
}));
const formValue = computed(() => {
  if (!selectedDate.value) return '';
  const output = toPickerValue(
    selectedDate.value,
    props.valueType,
    resolvedValueFormat.value,
    props.modelValue,
  );
  return output instanceof Date ? formatDate(output, resolvedValueFormat.value) : String(output ?? '');
});

function open() {
  if (props.disabled || props.readonly) return;
  draftDate.value = cloneDate(selectedDate.value || new Date());
  popoverRef.value?.open();
}

function close(reason = 'api') {
  popoverRef.value?.close(reason);
}

function handlePopoverClose(reason) {
  if (props.editable && inputDirty && ['outside', 'tab'].includes(reason)) {
    closeCommittedInput = true;
    commitTypedValue(true);
    globalThis.setTimeout(() => { closeCommittedInput = false; }, 0);
    return;
  }
  resetInputText();
}

function handleFocus(event) {
  emit('focus', event);
}

function handleTriggerClick(event) {
  if (event.target?.closest?.('.au-input__clear')) return;
  open();
}

function handleBlur(event) {
  if (closeCommittedInput) closeCommittedInput = false;
  else if (props.editable && inputDirty) commitTypedValue(false, event);
  emit('blur', event);
}

function handleInput(value) {
  inputText.value = value;
  inputInvalid.value = false;
  inputDirty = true;
}

function handleInputKeydown(event) {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    open();
  } else if (event.key === 'Enter' && props.editable) {
    event.preventDefault();
    if (commitTypedValue(true, event)) close('input');
  } else if (event.key === 'Escape' && visible.value) {
    event.preventDefault();
    close('escape');
  } else if (event.key === 'Tab') {
    close('tab');
  }
}

function updateDraftDate(date) {
  draftDate.value = date;
}

function commitTypedValue(emitChange = true, sourceEvent = null) {
  const text = inputText.value.trim();
  if (!text) {
    if (selectedDate.value) clear(sourceEvent);
    else resetInputText();
    return true;
  }
  const date = parseDateValue(text, resolvedDisplayFormat.value, selectedDate.value || new Date());
  if (!date || isTimeDisabled(date, {
    minTime: minTimeValue.value,
    maxTime: maxTimeValue.value,
    disabledTime: props.disabledTime,
  })) {
    inputInvalid.value = true;
    emit('invalid-input', text, sourceEvent);
    return false;
  }
  commitDate(date, emitChange, sourceEvent);
  return true;
}

function selectNow() {
  draftDate.value = clampTime(new Date(), minTimeValue.value, maxTimeValue.value);
}

function cancel() {
  draftDate.value = cloneDate(selectedDate.value || new Date());
  close('cancel');
  inputRef.value?.focus({ preventScroll: true });
}

function confirm(event) {
  if (draftInvalid.value) return;
  commitDate(draftDate.value, true, event);
  close('confirm');
  inputRef.value?.focus({ preventScroll: true });
}

function commitDate(date, emitChange = true, sourceEvent = null) {
  selectedDate.value = cloneDate(date);
  inputText.value = formatDate(date, resolvedDisplayFormat.value);
  inputInvalid.value = false;
  inputDirty = false;
  const output = toPickerValue(
    date,
    props.valueType,
    resolvedValueFormat.value,
    props.modelValue,
  );
  emit('update:modelValue', output);
  if (emitChange) emit('change', output, cloneDate(date), sourceEvent);
}

function clear(sourceEvent = null) {
  const value = emptyPickerValue(props.valueType, props.modelValue);
  selectedDate.value = null;
  inputText.value = '';
  inputInvalid.value = false;
  inputDirty = false;
  emit('update:modelValue', value);
  emit('change', value, null, sourceEvent);
  emit('clear', sourceEvent);
}

function resetInputText() {
  inputText.value = formatDate(selectedDate.value, resolvedDisplayFormat.value);
  inputInvalid.value = false;
  inputDirty = false;
}

function focus(options) {
  inputRef.value?.focus(options);
}

function blur() {
  inputRef.value?.blur();
}

watch(
  () => [props.modelValue, resolvedValueFormat.value, resolvedDisplayFormat.value],
  () => {
    selectedDate.value = parseDateValue(props.modelValue, resolvedValueFormat.value);
    draftDate.value = cloneDate(selectedDate.value || new Date());
    resetInputText();
  },
);

watch(visible, (value) => emit('visible-change', value));

defineExpose({ focus, blur, open, close, inputRef, popoverRef });
</script>

<style scoped>
.au-time-picker {
  width: 100%;
}

.au-time-picker__popover {
  width: 238px;
  max-width: calc(100vw - 16px);
  padding: 12px;
  border: 1px solid var(--au-material-border);
  border-radius: var(--au-radius-overlay);
  color: var(--au-color-text-primary);
}

.au-time-picker__status {
  margin-top: 8px;
  color: var(--au-color-danger);
  font-size: 11px;
}

.au-time-picker__footer {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--au-material-border);
}

.au-time-picker__spacer {
  flex: 1;
}

.au-time-picker__action {
  min-width: 0;
  height: 28px;
  padding: 0 8px;
  border: 0;
  border-radius: var(--au-radius-control);
  color: var(--au-color-text-secondary);
  background: transparent;
  font: inherit;
  font-size: var(--au-font-size-small);
  font-weight: var(--au-font-weight-medium);
  cursor: pointer;
  appearance: none;
}

.au-time-picker__action:hover:not(:disabled) {
  color: var(--au-color-text-primary);
  background: var(--au-color-background-hover);
}

.au-time-picker__action.is-primary {
  color: var(--au-color-primary);
}

.au-time-picker__action:active:not(:disabled) {
  transform: scale(0.96);
}

.au-time-picker__action:disabled {
  color: var(--au-color-text-disabled);
  cursor: not-allowed;
}

@media (prefers-reduced-motion: reduce) {
  .au-time-picker__action:active:not(:disabled) {
    transform: none;
  }
}

@media (prefers-contrast: more) {
  .au-time-picker__popover {
    border-color: var(--au-color-text-secondary);
  }
}

@media (forced-colors: active) {
  .au-time-picker__popover {
    border-color: CanvasText;
    background: Canvas;
  }
}
</style>
