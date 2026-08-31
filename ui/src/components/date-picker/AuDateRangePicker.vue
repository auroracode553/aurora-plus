<template>
  <AuPopover
    ref="popoverRef"
    v-model="visible"
    class="au-date-range-picker"
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
      <div
        ref="triggerRef"
        class="au-date-range-picker__trigger au-depth-control au-focus-ring"
        :class="[
          `is-${size}`,
          {
            'is-disabled': disabled,
            'is-readonly': readonly,
            'is-invalid': invalid || inputInvalid,
            'is-focused': focusWithin,
          },
        ]"
        v-bind="triggerAttrs"
        role="group"
        :aria-label="ariaLabel"
        :aria-disabled="disabled ? 'true' : undefined"
        @focusout="handleFocusout"
      >
        <input
          ref="startInputRef"
          class="au-date-range-picker__input"
          type="text"
          :value="startText"
          :placeholder="startPlaceholder"
          :disabled="disabled"
          :readonly="readonly || !editable"
          role="combobox"
          aria-haspopup="dialog"
          :aria-expanded="triggerProps['aria-expanded']"
          :aria-controls="triggerProps['aria-controls']"
          :aria-label="startAriaLabel"
          :aria-invalid="invalid || inputInvalid ? 'true' : undefined"
          @input="handleInput('start', $event)"
          @focus="handleInputFocus('start', $event)"
          @keydown="handleInputKeydown"
        />
        <span class="au-date-range-picker__separator" aria-hidden="true">{{ rangeSeparator }}</span>
        <input
          ref="endInputRef"
          class="au-date-range-picker__input"
          type="text"
          :value="endText"
          :placeholder="endPlaceholder"
          :disabled="disabled"
          :readonly="readonly || !editable"
          role="combobox"
          aria-haspopup="dialog"
          :aria-expanded="triggerProps['aria-expanded']"
          :aria-controls="triggerProps['aria-controls']"
          :aria-label="endAriaLabel"
          :aria-invalid="invalid || inputInvalid ? 'true' : undefined"
          @input="handleInput('end', $event)"
          @focus="handleInputFocus('end', $event)"
          @keydown="handleInputKeydown"
        />
        <button
          v-if="clearable && hasValue && !disabled && !readonly"
          class="au-date-range-picker__clear au-focus-ring"
          type="button"
          aria-label="清空日期范围"
          @pointerdown.prevent
          @click.stop="clear"
        >
          <AuIcon :icon="IconX" />
        </button>
        <AuIcon v-else class="au-date-range-picker__calendar" :icon="IconCalendar" />
        <template v-if="fieldName">
          <input type="hidden" :name="`${fieldName}[0]`" :form="formId" :value="hiddenValues[0]" :disabled="disabled" />
          <input type="hidden" :name="`${fieldName}[1]`" :form="formId" :value="hiddenValues[1]" :disabled="disabled" />
        </template>
      </div>
    </template>

    <div class="au-date-range-picker__panel au-material-surface au-depth-overlay">
      <div class="au-date-range-picker__calendars">
        <AuDatePickerPane
          ref="leftPaneRef"
          class="au-date-range-picker__pane"
          model-value=""
          value-type="date"
          :value-format="valueFormat"
          :default-date="leftViewDate"
          :locale="locale"
          :first-day-of-week="firstDayOfWeek"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled-date="disabledDate"
          :show-adjacent-dates="showAdjacentDates"
          :show-today="false"
          :range-start="draftStart"
          :range-end="draftEnd"
          :hover-date="hoverDate"
          :range-selecting="selectingEnd"
          :aria-label="`${ariaLabel}，起始月份`"
          @select="handleDateSelect"
          @hover="hoverDate = $event"
          @panel-change="handleLeftPanelChange"
        />
        <AuDatePickerPane
          ref="rightPaneRef"
          class="au-date-range-picker__pane"
          model-value=""
          value-type="date"
          :value-format="valueFormat"
          :default-date="rightViewDate"
          :locale="locale"
          :first-day-of-week="firstDayOfWeek"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled-date="disabledDate"
          :show-adjacent-dates="showAdjacentDates"
          :show-today="false"
          :range-start="draftStart"
          :range-end="draftEnd"
          :hover-date="hoverDate"
          :range-selecting="selectingEnd"
          :aria-label="`${ariaLabel}，结束月份`"
          @select="handleDateSelect"
          @hover="hoverDate = $event"
          @panel-change="handleRightPanelChange"
        />
      </div>
      <div v-if="showToday || $slots.footer" class="au-date-range-picker__footer">
        <slot name="footer" :select-today="selectToday" :clear="clear">
          <AuButton v-if="showToday" type="menu" size="small" @click="selectToday">今天</AuButton>
        </slot>
      </div>
    </div>
  </AuPopover>
</template>

<script setup>
import { computed, nextTick, ref, useAttrs, watch } from 'vue';
import { IconCalendar, IconX } from '@tabler/icons-vue';
import { AuButton } from '../button/index.js';
import { AuIcon } from '../icon/index.js';
import { AuPopover } from '../popover/index.js';
import AuDatePickerPane from './AuDatePickerPane.vue';
import {
  addMonths,
  cloneDate,
  formatDate,
  isDayDisabled,
  orderDateRange,
  parseDateRange,
  parseDateValue,
  toPickerRange,
  toPickerValue,
} from '../../utils/date-time.js';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
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
  ariaLabel: { type: String, default: '选择日期范围' },
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
const triggerRef = ref(null);
const startInputRef = ref(null);
const endInputRef = ref(null);
const leftPaneRef = ref(null);
const rightPaneRef = ref(null);
const visible = ref(false);
const focusWithin = ref(false);
const activeInput = ref('start');
const inputInvalid = ref(false);
const inputDirty = ref(false);
const selectedRange = ref(parseDateRange(props.modelValue, props.valueFormat));
const draftStart = ref(cloneDate(selectedRange.value[0]));
const draftEnd = ref(cloneDate(selectedRange.value[1]));
const hoverDate = ref(null);
const selectingEnd = ref(false);
const startText = ref(formatDate(selectedRange.value[0], props.displayFormat));
const endText = ref(formatDate(selectedRange.value[1], props.displayFormat));
const initialViewDate = resolveInitialViewDate();
const leftViewDate = ref(initialViewDate);
const rightViewDate = ref(addMonths(initialViewDate, 1));

const triggerAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([name]) => !['class', 'style', 'name', 'form'].includes(name)),
));
const fieldName = computed(() => String(attrs.name || ''));
const formId = computed(() => attrs.form);
const hasValue = computed(() => Boolean(selectedRange.value[0] || selectedRange.value[1]));
const hiddenValues = computed(() => selectedRange.value.map((date, index) => {
  if (!date) return '';
  const currentValue = Array.isArray(props.modelValue) ? props.modelValue[index] : undefined;
  const output = toPickerValue(date, props.valueType, props.valueFormat, currentValue);
  return output instanceof Date ? formatDate(output, props.valueFormat) : String(output ?? '');
}));
const minDateValue = computed(() => parseDateValue(props.minDate, props.valueFormat));
const maxDateValue = computed(() => parseDateValue(props.maxDate, props.valueFormat));

function resolveInitialViewDate() {
  const defaults = Array.isArray(props.defaultValue) ? props.defaultValue : [props.defaultValue];
  return selectedRange.value[0]
    || parseDateValue(defaults[0], props.valueFormat)
    || new Date();
}

function open() {
  if (props.disabled || props.readonly) return;
  popoverRef.value?.open();
  nextTick(syncPanels);
}

function close(reason = 'api') {
  popoverRef.value?.close(reason);
}

function handleTriggerClick(event) {
  if (event.target?.closest?.('.au-date-range-picker__clear')) return;
  open();
}

function handleInputFocus(part, event) {
  activeInput.value = part;
  if (!focusWithin.value) emit('focus', event);
  focusWithin.value = true;
}

function handleFocusout(event) {
  if (triggerRef.value?.contains(event.relatedTarget)) return;
  focusWithin.value = false;
  if (props.editable && inputDirty.value) commitTypedRange(false, event);
  emit('blur', event);
}

function handleInput(part, event) {
  if (part === 'start') startText.value = event.target.value;
  else endText.value = event.target.value;
  inputDirty.value = true;
  inputInvalid.value = false;
}

function handleInputKeydown(event) {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    open();
    nextTick(() => leftPaneRef.value?.focus());
  } else if (event.key === 'Enter' && props.editable) {
    event.preventDefault();
    if (commitTypedRange(true, event)) close('input');
  } else if (event.key === 'Escape' && visible.value) {
    event.preventDefault();
    close('escape');
  } else if (event.key === 'Tab') {
    close('tab');
  }
}

function commitTypedRange(emitChange = true, event = null) {
  const startValue = startText.value.trim();
  const endValue = endText.value.trim();
  if (!startValue && !endValue) {
    if (hasValue.value) clear(event);
    else resetInputText();
    return true;
  }

  const start = parseDateValue(startValue, props.displayFormat);
  const end = parseDateValue(endValue, props.displayFormat);
  if (!start || !end || isDisabled(start) || isDisabled(end)) {
    inputInvalid.value = true;
    emit('invalid-input', [startText.value, endText.value], event);
    return false;
  }
  commitRange(orderDateRange(start, end), emitChange, event);
  return true;
}

function handleDateSelect(value, date, event) {
  const selectedDate = cloneDate(date || value);
  if (!selectedDate || isDisabled(selectedDate)) return;

  if (!selectingEnd.value || !draftStart.value || draftEnd.value) {
    draftStart.value = selectedDate;
    draftEnd.value = null;
    hoverDate.value = null;
    selectingEnd.value = true;
    emit('calendar-change', toPartialRange([selectedDate, null]));
    return;
  }

  const range = orderDateRange(draftStart.value, selectedDate);
  draftStart.value = range[0];
  draftEnd.value = range[1];
  selectingEnd.value = false;
  hoverDate.value = null;
  emit('calendar-change', toPartialRange(range));
  commitRange(range, true, event);
  close('select');
  nextTick(() => (activeInput.value === 'end' ? endInputRef.value : startInputRef.value)?.focus?.());
}

function commitRange(range, emitChange = true, event = null) {
  selectedRange.value = range.map(cloneDate);
  draftStart.value = cloneDate(range[0]);
  draftEnd.value = cloneDate(range[1]);
  selectingEnd.value = false;
  inputInvalid.value = false;
  inputDirty.value = false;
  resetInputText();
  const output = toPickerRange(range, props.valueType, props.valueFormat, props.modelValue);
  emit('update:modelValue', output);
  if (emitChange) emit('change', output, range.map(cloneDate), event);
}

function toPartialRange(range) {
  const currentRange = Array.isArray(props.modelValue) ? props.modelValue : [];
  return range.map((date, index) => (
    date ? toPickerValue(date, props.valueType, props.valueFormat, currentRange[index]) : null
  ));
}

function clear(event = null) {
  selectedRange.value = [null, null];
  draftStart.value = null;
  draftEnd.value = null;
  selectingEnd.value = false;
  hoverDate.value = null;
  inputInvalid.value = false;
  inputDirty.value = false;
  startText.value = '';
  endText.value = '';
  emit('update:modelValue', []);
  emit('change', [], [null, null], event);
  emit('clear', event);
}

function selectToday(event) {
  const today = new Date();
  if (isDisabled(today)) return;
  commitRange([today, today], true, event);
  close('today');
}

function isDisabled(date) {
  return isDayDisabled(date, {
    minDate: minDateValue.value,
    maxDate: maxDateValue.value,
    disabledDate: props.disabledDate,
  });
}

function handlePopoverClose() {
  if (selectingEnd.value) resetDraftRange();
  if (inputDirty.value) resetInputText();
}

function resetDraftRange() {
  draftStart.value = cloneDate(selectedRange.value[0]);
  draftEnd.value = cloneDate(selectedRange.value[1]);
  selectingEnd.value = false;
  hoverDate.value = null;
}

function resetInputText() {
  startText.value = formatDate(selectedRange.value[0], props.displayFormat);
  endText.value = formatDate(selectedRange.value[1], props.displayFormat);
  inputInvalid.value = false;
  inputDirty.value = false;
}

function handleLeftPanelChange(date) {
  leftViewDate.value = cloneDate(date);
  if (!props.unlinkPanels) {
    rightViewDate.value = addMonths(date, 1);
    rightPaneRef.value?.showDate(rightViewDate.value);
  }
  emitPanelChange();
}

function handleRightPanelChange(date) {
  rightViewDate.value = cloneDate(date);
  if (!props.unlinkPanels) {
    leftViewDate.value = addMonths(date, -1);
    leftPaneRef.value?.showDate(leftViewDate.value);
  }
  emitPanelChange();
}

function emitPanelChange() {
  emit('panel-change', [cloneDate(leftViewDate.value), cloneDate(rightViewDate.value)]);
}

function syncPanels() {
  const start = selectedRange.value[0] || resolveInitialViewDate();
  const defaultValues = Array.isArray(props.defaultValue) ? props.defaultValue : [];
  const preferredRightDate = selectedRange.value[1]
    || parseDateValue(defaultValues[1], props.valueFormat)
    || addMonths(start, 1);
  leftViewDate.value = cloneDate(start);
  rightViewDate.value = props.unlinkPanels ? cloneDate(preferredRightDate) : addMonths(start, 1);
  leftPaneRef.value?.showDate(leftViewDate.value);
  rightPaneRef.value?.showDate(rightViewDate.value);
}

function focus(options) {
  startInputRef.value?.focus(options);
}

function blur() {
  startInputRef.value?.blur();
  endInputRef.value?.blur();
}

watch(
  () => [props.modelValue, props.valueFormat, props.displayFormat],
  () => {
    selectedRange.value = parseDateRange(props.modelValue, props.valueFormat);
    resetDraftRange();
    resetInputText();
  },
  { deep: true },
);

watch(visible, (value) => emit('visible-change', value));

defineExpose({
  blur,
  close,
  endInputRef,
  focus,
  leftPaneRef,
  open,
  popoverRef,
  rightPaneRef,
  startInputRef,
});
</script>

<style scoped>
.au-date-range-picker {
  width: 100%;
}

.au-date-range-picker__trigger {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  height: 32px;
  gap: 6px;
  padding: 0 9px;
  border: 1px solid var(--au-material-border-strong);
  border-radius: var(--au-radius-control);
  color: var(--au-color-text-regular);
  background: var(--au-material-bg);
  transition:
    border-color var(--au-transition-duration) var(--au-transition-ease),
    box-shadow var(--au-transition-duration) var(--au-transition-ease);
}

.au-date-range-picker__trigger:hover:not(.is-disabled),
.au-date-range-picker__trigger.is-focused {
  border-color: color-mix(in srgb, var(--au-color-primary) 55%, transparent);
}

.au-date-range-picker__trigger.is-invalid {
  border-color: var(--au-color-danger);
}

.au-date-range-picker__trigger.is-disabled {
  color: var(--au-color-text-disabled);
  background: var(--au-material-bg-subtle);
  cursor: not-allowed;
}

.au-date-range-picker__trigger.is-small {
  height: 28px;
}

.au-date-range-picker__trigger.is-large {
  height: 40px;
}

.au-date-range-picker__input {
  min-width: 0;
  width: 0;
  height: 100%;
  padding: 0;
  border: 0;
  color: inherit;
  background: transparent;
  font: inherit;
  font-size: var(--au-font-size-base);
  text-align: center;
  outline: none;
  flex: 1;
}

.au-date-range-picker__input::placeholder {
  color: var(--au-color-text-placeholder);
}

.au-date-range-picker__separator,
.au-date-range-picker__calendar {
  color: var(--au-color-text-secondary);
  flex: none;
}

.au-date-range-picker__clear {
  display: inline-grid;
  place-items: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  border-radius: var(--au-radius-round);
  color: var(--au-color-text-secondary);
  background: transparent;
  cursor: pointer;
  flex: none;
}

.au-date-range-picker__clear:hover {
  color: var(--au-color-text-primary);
  background: var(--au-color-bg-hover);
}

.au-date-range-picker__panel {
  width: min(576px, calc(100vw - 16px));
  max-height: calc(100vh - 16px);
  overflow: auto;
  border: 1px solid var(--au-material-border);
  border-radius: var(--au-radius-overlay);
  color: var(--au-color-text-primary);
  backdrop-filter: blur(var(--au-material-blur)) saturate(var(--au-material-saturation));
  overscroll-behavior: contain;
}

.au-date-range-picker__calendars {
  display: flex;
  align-items: flex-start;
}

.au-date-range-picker__pane + .au-date-range-picker__pane {
  border-left: 1px solid var(--au-material-border);
}

.au-date-range-picker__footer {
  display: flex;
  justify-content: flex-end;
  padding: 6px 10px;
  border-top: 1px solid var(--au-material-border);
}

@media (max-width: 600px) {
  .au-date-range-picker__panel {
    width: min(294px, calc(100vw - 16px));
  }

  .au-date-range-picker__calendars {
    flex-direction: column;
  }

  .au-date-range-picker__pane + .au-date-range-picker__pane {
    border-top: 1px solid var(--au-material-border);
    border-left: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .au-date-range-picker__trigger {
    transition: none;
  }
}

@media (prefers-reduced-transparency: reduce) {
  .au-date-range-picker__panel {
    background: var(--au-color-bg-overlay);
    backdrop-filter: none;
  }
}

@media (prefers-contrast: more) {
  .au-date-range-picker__trigger,
  .au-date-range-picker__panel,
  .au-date-range-picker__pane + .au-date-range-picker__pane {
    border-color: var(--au-color-text-secondary);
  }
}

@media (forced-colors: active) {
  .au-date-range-picker__trigger,
  .au-date-range-picker__panel {
    border-color: CanvasText;
    color: CanvasText;
    background: Canvas;
  }
}
</style>
