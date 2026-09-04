<template>
  <AuPopover
    ref="popoverRef"
    v-model="visible"
    class="au-date-time-picker"
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
        :suffix-icon="IconCalendarTime"
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

    <section class="au-date-time-picker__popover au-component au-material-surface au-depth-overlay au-overlay-surface au-floating-viewport au-scroll-region au-thin-scrollbar">
      <AuDatePickerPane
        ref="datePaneRef"
        class="au-date-time-picker__date-pane"
        :model-value="draftDate"
        value-type="date"
        :value-format="resolvedValueFormat"
        :locale="locale"
        :first-day-of-week="firstDayOfWeek"
        :min-date="minDate"
        :max-date="maxDate"
        :disabled-date="disabledDate"
        :show-adjacent-dates="showAdjacentDates"
        :show-today="false"
        :surface="false"
        aria-label="选择日期"
        @select="handleDraftDateSelect"
        @panel-change="emit('panel-change', $event)"
      />

      <div class="au-date-time-picker__time-section">
        <div class="au-date-time-picker__time-heading">时间</div>
        <AuTimePickerPanel
          :model-value="draftDate"
          :hour-step="hourStep"
          :minute-step="minuteStep"
          :second-step="secondStep"
          :show-seconds="showSeconds"
          :append-to="appendTo"
          :z-index="zIndex + 1"
          @update:model-value="updateDraftDate"
        />
        <div v-if="draftInvalid" class="au-date-time-picker__status au-field-feedback" role="status">
          该日期时间不可用
        </div>
      </div>

      <footer class="au-date-time-picker__footer au-picker-footer">
        <button class="au-date-time-picker__action au-action-control au-focus-ring" type="button" @click="selectNow">
          现在
        </button>
        <span class="au-date-time-picker__spacer au-flex-spacer"></span>
        <button class="au-date-time-picker__action au-action-control au-focus-ring" type="button" @click="cancel">
          取消
        </button>
        <button
          class="au-date-time-picker__action au-action-control is-primary au-focus-ring"
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
import { computed, nextTick, ref, useAttrs, watch } from 'vue';
import { IconCalendarTime } from '../../icons/internal.js';
import { AuDatePickerPane } from '../date-picker/index.js';
import { AuInput } from '../input/index.js';
import { AuPopover } from '../popover/index.js';
import AuTimePickerPanel from '../time-picker/AuTimePickerPanel.vue';
import {
  clampDateTime,
  cloneDate,
  emptyPickerValue,
  formatDate,
  isDayDisabled,
  isTimeDisabled,
  mergeDateAndTime,
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
  placeholder: { type: String, default: '选择日期和时间' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  editable: { type: Boolean, default: true },
  clearable: { type: Boolean, default: true },
  invalid: { type: Boolean, default: false },
  locale: { type: String, default: 'zh-CN' },
  firstDayOfWeek: {
    type: Number,
    default: 1,
    validator: (value) => Number.isInteger(value) && value >= 0 && value <= 6,
  },
  showAdjacentDates: { type: Boolean, default: true },
  showSeconds: { type: Boolean, default: true },
  hourStep: { type: Number, default: 1 },
  minuteStep: { type: Number, default: 1 },
  secondStep: { type: Number, default: 1 },
  minDate: { type: [Date, String, Number], default: null },
  maxDate: { type: [Date, String, Number], default: null },
  disabledDate: { type: Function, default: null },
  disabledTime: { type: Function, default: null },
  placement: { type: String, default: 'bottom-start' },
  teleported: { type: Boolean, default: true },
  appendTo: { type: [String, Object], default: 'body' },
  zIndex: { type: Number, default: 1200 },
  ariaLabel: { type: String, default: '选择日期和时间' },
});

const emit = defineEmits([
  'update:modelValue',
  'change',
  'clear',
  'focus',
  'blur',
  'visible-change',
  'invalid-input',
  'panel-change',
]);
const attrs = useAttrs();
const popoverRef = ref(null);
const inputRef = ref(null);
const datePaneRef = ref(null);
const visible = ref(false);
const resolvedValueFormat = computed(() => (
  props.valueFormat || (props.showSeconds ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD HH:mm')
));
const resolvedDisplayFormat = computed(() => (
  props.displayFormat || (props.showSeconds ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD HH:mm')
));
const selectedDate = ref(parseDateValue(props.modelValue, resolvedValueFormat.value));
const draftDate = ref(cloneDate(selectedDate.value || new Date()));
const inputText = ref(formatDate(selectedDate.value, resolvedDisplayFormat.value));
const inputInvalid = ref(false);
let closeCommittedInput = false;
let inputDirty = false;

const inputAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([name]) => !['class', 'style', 'name'].includes(name)),
));
const minDateValue = computed(() => parseDateValue(props.minDate, resolvedValueFormat.value));
const maxDateValue = computed(() => parseDateValue(props.maxDate, resolvedValueFormat.value));
const draftInvalid = computed(() => {
  if (!draftDate.value) return true;
  if (minDateValue.value && draftDate.value < minDateValue.value) return true;
  if (maxDateValue.value && draftDate.value > maxDateValue.value) return true;
  if (isDayDisabled(draftDate.value, { disabledDate: props.disabledDate })) return true;
  return isTimeDisabled(draftDate.value, { disabledTime: props.disabledTime });
});
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
    nextTick(() => datePaneRef.value?.focus());
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

function handleDraftDateSelect(value, date) {
  const merged = mergeDateAndTime(date || value, draftDate.value);
  draftDate.value = clampDateTime(merged, minDateValue.value, maxDateValue.value);
}

function commitTypedValue(emitChange = true, sourceEvent = null) {
  const text = inputText.value.trim();
  if (!text) {
    if (selectedDate.value) clear(sourceEvent);
    else resetInputText();
    return true;
  }
  const date = parseDateValue(text, resolvedDisplayFormat.value);
  if (!date || isUnavailable(date)) {
    inputInvalid.value = true;
    emit('invalid-input', text, sourceEvent);
    return false;
  }
  commitDate(date, emitChange, sourceEvent);
  return true;
}

function isUnavailable(date) {
  if (minDateValue.value && date < minDateValue.value) return true;
  if (maxDateValue.value && date > maxDateValue.value) return true;
  if (isDayDisabled(date, { disabledDate: props.disabledDate })) return true;
  return isTimeDisabled(date, { disabledTime: props.disabledTime });
}

function selectNow() {
  draftDate.value = clampDateTime(new Date(), minDateValue.value, maxDateValue.value);
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

defineExpose({ focus, blur, open, close, inputRef, datePaneRef, popoverRef });
</script>

<style scoped lang="scss">
.au-date-time-picker {
  width: 100%;
}

.au-date-time-picker__popover {
  width: 300px;
  overflow-x: hidden;
  overflow-y: auto;
}

.au-date-time-picker__date-pane {
  width: 100%;
}

.au-date-time-picker__time-section {
  padding: 10px 12px;
  border-top: 1px solid var(--au-material-border);
}

.au-date-time-picker__time-heading {
  margin-bottom: 7px;
  color: var(--au-color-text-primary);
  font-size: var(--au-font-size-small);
  font-weight: var(--au-font-weight-semibold);
}

.au-date-time-picker__status {
  margin-top: 7px;
}

.au-date-time-picker__footer {
  min-height: 38px;
  padding: 5px 9px;
}
</style>
