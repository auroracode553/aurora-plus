<template>
  <AuDateRangePicker
    v-if="type === 'daterange'"
    ref="rangePickerRef"
    v-bind="$attrs"
    :model-value="Array.isArray(modelValue) ? modelValue : []"
    :value-type="valueType"
    :value-format="valueFormat"
    :display-format="displayFormat"
    :size="size"
    :start-placeholder="startPlaceholder"
    :end-placeholder="endPlaceholder"
    :range-separator="rangeSeparator"
    :disabled="disabled"
    :readonly="readonly"
    :editable="editable"
    :clearable="clearable"
    :invalid="invalid"
    :locale="locale"
    :first-day-of-week="firstDayOfWeek"
    :min-date="minDate"
    :max-date="maxDate"
    :disabled-date="disabledDate"
    :default-value="defaultValue"
    :show-adjacent-dates="showAdjacentDates"
    :show-today="showToday"
    :unlink-panels="unlinkPanels"
    :placement="placement"
    :teleported="teleported"
    :append-to="appendTo"
    :z-index="zIndex"
    :aria-label="ariaLabel === '选择日期' ? '选择日期范围' : ariaLabel"
    :start-aria-label="startAriaLabel"
    :end-aria-label="endAriaLabel"
    @update:model-value="emit('update:modelValue', $event)"
    @change="forwardChange"
    @clear="emit('clear', $event)"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
    @visible-change="emit('visible-change', $event)"
    @invalid-input="forwardInvalidInput"
    @panel-change="emit('panel-change', $event)"
    @calendar-change="emit('calendar-change', $event)"
  >
    <template v-if="$slots.footer" #footer="slotProps">
      <slot name="footer" v-bind="slotProps"></slot>
    </template>
  </AuDateRangePicker>
  <AuPopover
    v-else
    ref="popoverRef"
    v-model="visible"
    class="au-date-picker"
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
        :suffix-icon="IconCalendar"
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

    <AuDatePickerPane
      ref="paneRef"
      :model-value="selectedDate"
      value-type="date"
      :value-format="valueFormat"
      :locale="locale"
      :first-day-of-week="firstDayOfWeek"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled-date="disabledDate"
      :default-date="Array.isArray(defaultValue) ? defaultValue[0] : defaultValue"
      :show-adjacent-dates="showAdjacentDates"
      :show-today="showToday"
      surface
      :aria-label="ariaLabel"
      @select="handleDateSelect"
      @panel-change="emit('panel-change', $event)"
    />
  </AuPopover>
</template>

<script setup>
import { computed, nextTick, ref, useAttrs, watch } from 'vue';
import { IconCalendar } from '@tabler/icons-vue';
import { AuInput } from '../input/index.js';
import { AuPopover } from '../popover/index.js';
import AuDatePickerPane from './AuDatePickerPane.vue';
import AuDateRangePicker from './AuDateRangePicker.vue';
import {
  cloneDate,
  emptyPickerValue,
  formatDate,
  isDayDisabled,
  parseDateValue,
  toPickerValue,
} from '../../utils/date-time.js';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  modelValue: { type: [Date, String, Number, Array], default: '' },
  type: {
    type: String,
    default: 'date',
    validator: (value) => ['date', 'daterange'].includes(value),
  },
  valueType: {
    type: String,
    default: 'auto',
    validator: (value) => ['auto', 'string', 'date', 'timestamp'].includes(value),
  },
  valueFormat: { type: String, default: 'YYYY-MM-DD' },
  displayFormat: { type: String, default: 'YYYY-MM-DD' },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value),
  },
  placeholder: { type: String, default: '选择日期' },
  startPlaceholder: { type: String, default: '开始日期' },
  endPlaceholder: { type: String, default: '结束日期' },
  rangeSeparator: { type: String, default: '至' },
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
  minDate: { type: [Date, String, Number], default: null },
  maxDate: { type: [Date, String, Number], default: null },
  disabledDate: { type: Function, default: null },
  defaultValue: { type: [Array, Date, String, Number], default: null },
  showAdjacentDates: { type: Boolean, default: true },
  showToday: { type: Boolean, default: true },
  unlinkPanels: { type: Boolean, default: false },
  placement: { type: String, default: 'bottom-start' },
  teleported: { type: Boolean, default: true },
  appendTo: { type: [String, Object], default: 'body' },
  zIndex: { type: Number, default: 1200 },
  ariaLabel: { type: String, default: '选择日期' },
  startAriaLabel: { type: String, default: '开始日期' },
  endAriaLabel: { type: String, default: '结束日期' },
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
  'calendar-change',
]);
const attrs = useAttrs();
const popoverRef = ref(null);
const rangePickerRef = ref(null);
const inputRef = ref(null);
const paneRef = ref(null);
const visible = ref(false);
const selectedDate = ref(parseDateValue(props.modelValue, props.valueFormat));
const inputText = ref(formatDate(selectedDate.value, props.displayFormat));
const inputInvalid = ref(false);
let closeCommittedInput = false;
let inputDirty = false;

const inputAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([name]) => !['class', 'style', 'name'].includes(name)),
));
const formValue = computed(() => {
  if (!selectedDate.value) return '';
  const output = toPickerValue(
    selectedDate.value,
    props.valueType,
    props.valueFormat,
    props.modelValue,
  );
  return output instanceof Date ? formatDate(output, props.valueFormat) : String(output ?? '');
});
const minDateValue = computed(() => parseDateValue(props.minDate, props.valueFormat));
const maxDateValue = computed(() => parseDateValue(props.maxDate, props.valueFormat));

function open() {
  if (props.type === 'daterange') {
    rangePickerRef.value?.open();
    return;
  }
  if (props.disabled || props.readonly) return;
  popoverRef.value?.open();
}

function close(reason = 'api') {
  if (props.type === 'daterange') {
    rangePickerRef.value?.close(reason);
    return;
  }
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
    nextTick(() => paneRef.value?.focus());
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

function commitTypedValue(emitChange = true, sourceEvent = null) {
  const text = inputText.value.trim();
  if (!text) {
    if (selectedDate.value) clear(sourceEvent);
    else resetInputText();
    return true;
  }
  const date = parseDateValue(text, props.displayFormat);
  if (!date || isDayDisabled(date, {
    minDate: minDateValue.value,
    maxDate: maxDateValue.value,
    disabledDate: props.disabledDate,
  })) {
    inputInvalid.value = true;
    emit('invalid-input', text, sourceEvent);
    return false;
  }
  commitDate(date, emitChange, sourceEvent);
  return true;
}

function handleDateSelect(value, date, sourceEvent) {
  commitDate(date || value, true, sourceEvent);
  close('select');
  nextTick(() => inputRef.value?.focus({ preventScroll: true }));
}

function commitDate(value, emitChange = true, sourceEvent = null) {
  const date = value instanceof Date ? cloneDate(value) : parseDateValue(value, props.valueFormat);
  if (!date) return;
  selectedDate.value = date;
  inputText.value = formatDate(date, props.displayFormat);
  inputInvalid.value = false;
  inputDirty = false;
  const output = toPickerValue(date, props.valueType, props.valueFormat, props.modelValue);
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
  inputText.value = formatDate(selectedDate.value, props.displayFormat);
  inputInvalid.value = false;
  inputDirty = false;
}

function focus(options) {
  if (props.type === 'daterange') rangePickerRef.value?.focus(options);
  else inputRef.value?.focus(options);
}

function blur() {
  if (props.type === 'daterange') rangePickerRef.value?.blur();
  else inputRef.value?.blur();
}

function forwardChange(...args) {
  emit('change', ...args);
}

function forwardInvalidInput(...args) {
  emit('invalid-input', ...args);
}

watch(
  () => [props.modelValue, props.valueFormat, props.displayFormat],
  () => {
    selectedDate.value = parseDateValue(props.modelValue, props.valueFormat);
    resetInputText();
  },
);

watch(visible, (value) => emit('visible-change', value));

defineExpose({ focus, blur, open, close, inputRef, paneRef, popoverRef, rangePickerRef });
</script>

<style scoped lang="scss">
.au-date-picker {
  width: 100%;
}
</style>
