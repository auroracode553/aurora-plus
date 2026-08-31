<template>
  <section
    ref="paneRef"
    class="au-date-picker-pane au-component"
    :class="{
      'has-surface': surface,
      'au-material-surface': surface,
      'au-depth-overlay': surface,
    }"
    :aria-label="ariaLabel"
  >
    <header class="au-date-picker-pane__header">
      <div class="au-date-picker-pane__heading" aria-live="polite">{{ monthLabel }}</div>
      <div class="au-date-picker-pane__navigation" aria-label="月份导航">
        <button
          v-if="showPreviousMonth"
          class="au-date-picker-pane__nav au-focus-ring"
          type="button"
          aria-label="上个月"
          @click="navigateMonth(-1)"
        >
          <AuIcon :icon="IconChevronLeft" />
        </button>
        <button
          v-if="showNextMonth"
          class="au-date-picker-pane__nav au-focus-ring"
          type="button"
          aria-label="下个月"
          @click="navigateMonth(1)"
        >
          <AuIcon :icon="IconChevronRight" />
        </button>
      </div>
    </header>

    <div class="au-date-picker-pane__weekdays" role="row" aria-hidden="true">
      <span v-for="weekday in weekdayLabels" :key="weekday" role="columnheader">
        {{ weekday }}
      </span>
    </div>

    <div class="au-date-picker-pane__grid" role="grid" :aria-label="monthLabel">
      <template v-for="day in calendarDays" :key="day.key">
        <span
          v-if="!showAdjacentDates && !day.isCurrentMonth"
          class="au-date-picker-pane__day-placeholder"
          role="gridcell"
          aria-hidden="true"
        ></span>
        <button
          v-else
          class="au-date-picker-pane__day au-focus-ring"
          :class="{
            'is-adjacent': !day.isCurrentMonth,
            'is-selected': day.isSelected || isRangeEndpoint(day.date),
            'is-range-start': isRangeStart(day.date),
            'is-range-end': isRangeEnd(day.date),
            'is-in-range': isInRange(day.date),
            'is-today': day.isToday,
          }"
          type="button"
          role="gridcell"
          :data-date-key="day.key"
          :disabled="isDisabled(day.date)"
          :tabindex="day.key === focusableDateKey ? 0 : -1"
          :aria-label="formatAccessibleDate(day.date)"
          :aria-selected="day.isSelected || isRangeEndpoint(day.date) ? 'true' : 'false'"
          :aria-current="day.isToday ? 'date' : undefined"
          @focus="setActiveDate(day.date, false)"
          @pointerenter="emit('hover', cloneDate(day.date))"
          @pointerleave="emit('hover', null)"
          @click="selectDate(day.date, $event)"
          @keydown="handleDayKeydown($event, day.date)"
        >
          <span>{{ day.label }}</span>
        </button>
      </template>
    </div>

    <footer v-if="showToday || $slots.footer" class="au-date-picker-pane__footer">
      <slot name="footer" :today="selectToday">
        <button
          v-if="showToday"
          class="au-date-picker-pane__today au-focus-ring"
          type="button"
          :disabled="isDisabled(today)"
          @click="selectToday"
        >
          今天
        </button>
      </slot>
    </footer>
  </section>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-vue';
import { AuIcon } from '../icon/index.js';
import {
  addDays,
  addMonths,
  addYears,
  buildCalendarDays,
  cloneDate,
  dateKey,
  getMonthLabel,
  getWeekdayLabels,
  isDayDisabled,
  isDateInRange,
  isSameDay,
  parseDateValue,
  toPickerValue,
} from '../../utils/date-time.js';

const props = defineProps({
  modelValue: { type: [Date, String, Number], default: '' },
  valueType: {
    type: String,
    default: 'auto',
    validator: (value) => ['auto', 'string', 'date', 'timestamp'].includes(value),
  },
  valueFormat: { type: String, default: 'YYYY-MM-DD' },
  locale: { type: String, default: 'zh-CN' },
  firstDayOfWeek: {
    type: Number,
    default: 1,
    validator: (value) => Number.isInteger(value) && value >= 0 && value <= 6,
  },
  minDate: { type: [Date, String, Number], default: null },
  maxDate: { type: [Date, String, Number], default: null },
  disabledDate: { type: Function, default: null },
  defaultDate: { type: [Date, String, Number], default: null },
  showAdjacentDates: { type: Boolean, default: true },
  showToday: { type: Boolean, default: true },
  showPreviousMonth: { type: Boolean, default: true },
  showNextMonth: { type: Boolean, default: true },
  rangeStart: { type: [Date, String, Number], default: null },
  rangeEnd: { type: [Date, String, Number], default: null },
  hoverDate: { type: [Date, String, Number], default: null },
  rangeSelecting: { type: Boolean, default: false },
  surface: { type: Boolean, default: true },
  ariaLabel: { type: String, default: '选择日期' },
});

const emit = defineEmits(['update:modelValue', 'change', 'select', 'panel-change', 'hover']);
const paneRef = ref(null);
const today = new Date();
const initialDate = resolveInitialDate();
const selectedDate = ref(parseDateValue(props.modelValue, props.valueFormat));
const activeDate = ref(cloneDate(selectedDate.value || initialDate));
const viewDate = ref(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));

const minDateValue = computed(() => parseDateValue(props.minDate, props.valueFormat));
const maxDateValue = computed(() => parseDateValue(props.maxDate, props.valueFormat));
const rangeStartValue = computed(() => parseDateValue(props.rangeStart, props.valueFormat));
const committedRangeEndValue = computed(() => parseDateValue(props.rangeEnd, props.valueFormat));
const hoverDateValue = computed(() => parseDateValue(props.hoverDate, props.valueFormat));
const displayRangeEndValue = computed(() => committedRangeEndValue.value
  || (props.rangeSelecting ? hoverDateValue.value : null));
const monthLabel = computed(() => getMonthLabel(viewDate.value, props.locale));
const weekdayLabels = computed(() => getWeekdayLabels(props.locale, props.firstDayOfWeek));
const calendarDays = computed(() => buildCalendarDays(
  viewDate.value,
  selectedDate.value,
  props.firstDayOfWeek,
));
const activeDateKey = computed(() => dateKey(activeDate.value));
const focusableDateKey = computed(() => {
  const activeDay = calendarDays.value.find((day) => day.key === activeDateKey.value);
  if (activeDay && !isDisabled(activeDay.date)) return activeDay.key;
  const fallback = calendarDays.value.find((day) => day.isCurrentMonth && !isDisabled(day.date))
    || calendarDays.value.find((day) => !isDisabled(day.date));
  return fallback?.key || '';
});

function resolveInitialDate() {
  return parseDateValue(props.modelValue, props.valueFormat)
    || parseDateValue(props.defaultDate, props.valueFormat)
    || new Date();
}

function isDisabled(date) {
  return isDayDisabled(date, {
    minDate: minDateValue.value,
    maxDate: maxDateValue.value,
    disabledDate: props.disabledDate,
  });
}

function formatAccessibleDate(date) {
  return new Intl.DateTimeFormat(props.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date);
}

function isRangeStart(date) {
  const start = rangeStartValue.value;
  const end = displayRangeEndValue.value;
  if (!start) return false;
  if (end && end < start) return isSameDay(date, end);
  return isSameDay(date, start);
}

function isRangeEnd(date) {
  const start = rangeStartValue.value;
  const end = displayRangeEndValue.value;
  if (!end) return false;
  if (start && end < start) return isSameDay(date, start);
  return isSameDay(date, end);
}

function isRangeEndpoint(date) {
  return isRangeStart(date) || isRangeEnd(date);
}

function isInRange(date) {
  return isDateInRange(date, rangeStartValue.value, displayRangeEndValue.value)
    && !isRangeEndpoint(date);
}

function selectDate(date, sourceEvent = null) {
  if (isDisabled(date)) return;
  selectedDate.value = cloneDate(date);
  setActiveDate(date);
  const value = toPickerValue(date, props.valueType, props.valueFormat, props.modelValue);
  emit('update:modelValue', value);
  emit('change', value, cloneDate(date), sourceEvent);
  emit('select', value, cloneDate(date), sourceEvent);
}

function selectToday(event) {
  if (isDisabled(today)) return;
  selectDate(today, event);
}

function navigateMonth(amount) {
  const nextView = addMonths(viewDate.value, amount);
  viewDate.value = new Date(nextView.getFullYear(), nextView.getMonth(), 1);
  const nextActive = addMonths(activeDate.value, amount);
  setActiveDate(nextActive, false);
  emit('panel-change', cloneDate(viewDate.value));
}

function setActiveDate(date, syncView = true) {
  if (!date) return;
  activeDate.value = cloneDate(date);
  if (syncView && (
    date.getFullYear() !== viewDate.value.getFullYear()
    || date.getMonth() !== viewDate.value.getMonth()
  )) {
    viewDate.value = new Date(date.getFullYear(), date.getMonth(), 1);
    emit('panel-change', cloneDate(viewDate.value));
  }
}

function findEnabledDate(startDate, direction) {
  let candidate = cloneDate(startDate);
  for (let index = 0; index < 370; index += 1) {
    if (!isDisabled(candidate)) return candidate;
    candidate = addDays(candidate, direction);
  }
  return startDate;
}

async function moveActive(date, direction = 1) {
  const enabledDate = findEnabledDate(date, direction);
  setActiveDate(enabledDate);
  await focusActiveDate();
}

function handleDayKeydown(event, date) {
  let target = null;
  let direction = 1;
  if (event.key === 'ArrowLeft') {
    target = addDays(date, -1);
    direction = -1;
  } else if (event.key === 'ArrowRight') {
    target = addDays(date, 1);
  } else if (event.key === 'ArrowUp') {
    target = addDays(date, -7);
    direction = -1;
  } else if (event.key === 'ArrowDown') {
    target = addDays(date, 7);
  } else if (event.key === 'Home') {
    target = addDays(date, -((date.getDay() - props.firstDayOfWeek + 7) % 7));
    direction = -1;
  } else if (event.key === 'End') {
    target = addDays(date, 6 - ((date.getDay() - props.firstDayOfWeek + 7) % 7));
  } else if (event.key === 'PageUp') {
    target = event.shiftKey ? addYears(date, -1) : addMonths(date, -1);
    direction = -1;
  } else if (event.key === 'PageDown') {
    target = event.shiftKey ? addYears(date, 1) : addMonths(date, 1);
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    selectDate(date, event);
    return;
  } else return;

  event.preventDefault();
  moveActive(target, direction);
}

async function focusActiveDate() {
  await nextTick();
  paneRef.value
    ?.querySelector(`[data-date-key="${focusableDateKey.value}"]`)
    ?.focus?.({ preventScroll: true });
}

function focus() {
  focusActiveDate();
}

function showDate(value) {
  const date = parseDateValue(value, props.valueFormat);
  if (!date) return;
  activeDate.value = cloneDate(date);
  viewDate.value = new Date(date.getFullYear(), date.getMonth(), 1);
}

watch(
  () => [props.modelValue, props.valueFormat],
  () => {
    const date = parseDateValue(props.modelValue, props.valueFormat);
    selectedDate.value = date;
    if (date && !isSameDay(date, activeDate.value)) setActiveDate(date);
  },
);

defineExpose({ focus, showDate, paneRef });
</script>

<style scoped>
.au-date-picker-pane {
  width: 278px;
  max-width: calc(100vw - 16px);
  padding: 10px;
  border-radius: var(--au-radius-overlay);
  color: var(--au-color-text-primary);
  user-select: none;
}

.au-date-picker-pane.has-surface {
  max-height: calc(100vh - 16px);
  overflow: auto;
  border: 1px solid var(--au-material-border);
  overscroll-behavior: contain;
}

.au-date-picker-pane__header {
  display: flex;
  align-items: center;
  min-height: 30px;
  margin-bottom: 6px;
  padding-left: 6px;
}

.au-date-picker-pane__heading {
  min-width: 0;
  flex: 1;
  font-size: var(--au-font-size-base);
  font-weight: var(--au-font-weight-semibold);
  letter-spacing: -0.01em;
}

.au-date-picker-pane__navigation {
  display: flex;
  gap: 2px;
}

.au-date-picker-pane__nav,
.au-date-picker-pane__today {
  display: inline-grid;
  place-items: center;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: var(--au-radius-control);
  color: var(--au-color-text-secondary);
  background: transparent;
  font: inherit;
  cursor: pointer;
  appearance: none;
  transition:
    color var(--au-transition-duration) var(--au-transition-timing),
    background var(--au-transition-duration) var(--au-transition-timing),
    transform var(--au-transition-duration) var(--au-transition-timing);
}

.au-date-picker-pane__nav {
  width: 28px;
  font-size: 16px;
}

.au-date-picker-pane__nav:hover,
.au-date-picker-pane__today:hover:not(:disabled) {
  color: var(--au-color-text-primary);
  background: var(--au-color-background-hover);
}

.au-date-picker-pane__nav:active,
.au-date-picker-pane__today:active:not(:disabled),
.au-date-picker-pane__day:active:not(:disabled) {
  transform: scale(0.94);
  transition-duration: 0s;
}

.au-date-picker-pane__weekdays,
.au-date-picker-pane__grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.au-date-picker-pane__weekdays {
  margin-bottom: 2px;
}

.au-date-picker-pane__weekdays span {
  display: grid;
  place-items: center;
  height: 24px;
  color: var(--au-color-text-secondary);
  font-size: 11px;
  font-weight: var(--au-font-weight-medium);
}

.au-date-picker-pane__grid {
  gap: 2px 0;
}

.au-date-picker-pane__day,
.au-date-picker-pane__day-placeholder {
  height: 32px;
}

.au-date-picker-pane__day {
  position: relative;
  display: grid;
  place-items: center;
  width: 32px;
  justify-self: center;
  padding: 0;
  border: 0;
  border-radius: var(--au-radius-pill);
  color: var(--au-color-text-default);
  background: transparent;
  font: inherit;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  appearance: none;
  transition:
    color var(--au-transition-duration) var(--au-transition-timing),
    background var(--au-transition-duration) var(--au-transition-timing),
    transform var(--au-transition-duration) var(--au-transition-timing);
}

.au-date-picker-pane__day:hover:not(:disabled),
.au-date-picker-pane__day:focus-visible:not(.is-selected) {
  color: var(--au-color-text-primary);
  background: var(--au-color-background-hover);
}

.au-date-picker-pane__day.is-adjacent {
  color: var(--au-color-text-placeholder);
}

.au-date-picker-pane__day.is-today:not(.is-selected) {
  color: var(--au-color-primary);
  font-weight: var(--au-font-weight-semibold);
}

.au-date-picker-pane__day.is-in-range {
  border-radius: var(--au-radius-compact);
  color: var(--au-color-primary);
  background: color-mix(in srgb, var(--au-color-primary) 10%, transparent);
}

.au-date-picker-pane__day.is-range-start,
.au-date-picker-pane__day.is-range-end {
  color: #ffffff;
  background: var(--au-color-primary);
}

.au-date-picker-pane__day.is-today:not(.is-selected)::after {
  position: absolute;
  bottom: 3px;
  width: 3px;
  height: 3px;
  border-radius: var(--au-radius-pill);
  background: currentColor;
  content: '';
}

.au-date-picker-pane__day.is-selected {
  color: #ffffff;
  background: var(--au-color-primary);
  font-weight: var(--au-font-weight-semibold);
}

.au-date-picker-pane__day:disabled {
  color: var(--au-color-text-disabled);
  cursor: not-allowed;
  opacity: 0.5;
}

.au-date-picker-pane__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: 34px;
  margin-top: 7px;
  padding: 7px 3px 0;
  border-top: 1px solid var(--au-material-border);
}

.au-date-picker-pane__today {
  padding: 0 8px;
  color: var(--au-color-primary);
  font-size: var(--au-font-size-small);
  font-weight: var(--au-font-weight-medium);
}

.au-date-picker-pane__today:disabled {
  color: var(--au-color-text-disabled);
  cursor: not-allowed;
}

@media (prefers-reduced-motion: reduce) {
  .au-date-picker-pane__nav,
  .au-date-picker-pane__today,
  .au-date-picker-pane__day {
    transition: none;
  }
}

@media (prefers-contrast: more) {
  .au-date-picker-pane.has-surface {
    border-color: var(--au-color-text-secondary);
  }

  .au-date-picker-pane__day.is-selected {
    outline: 1px solid currentColor;
    outline-offset: -3px;
  }
}

@media (forced-colors: active) {
  .au-date-picker-pane.has-surface {
    border-color: CanvasText;
    background: Canvas;
  }

  .au-date-picker-pane__day.is-selected {
    color: HighlightText;
    background: Highlight;
  }
}
</style>
