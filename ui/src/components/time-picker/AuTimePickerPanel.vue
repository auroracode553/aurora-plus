<template>
  <section class="au-time-picker-panel au-component" :aria-label="ariaLabel">
    <div class="au-time-picker-panel__field">
      <label :for="`${panelId}-hour`">时</label>
      <AuSelect
        :id="`${panelId}-hour`"
        :model-value="hourValue"
        size="small"
        :teleported="teleported"
        :append-to="appendTo"
        :z-index="zIndex"
        aria-label="小时"
        @update:model-value="updatePart('hour', $event)"
      >
        <option v-for="hour in hours" :key="hour" :value="pad(hour)">{{ pad(hour) }}</option>
      </AuSelect>
    </div>
    <span class="au-time-picker-panel__separator" aria-hidden="true">:</span>
    <div class="au-time-picker-panel__field">
      <label :for="`${panelId}-minute`">分</label>
      <AuSelect
        :id="`${panelId}-minute`"
        :model-value="minuteValue"
        size="small"
        :teleported="teleported"
        :append-to="appendTo"
        :z-index="zIndex"
        aria-label="分钟"
        @update:model-value="updatePart('minute', $event)"
      >
        <option v-for="minute in minutes" :key="minute" :value="pad(minute)">
          {{ pad(minute) }}
        </option>
      </AuSelect>
    </div>
    <template v-if="showSeconds">
      <span class="au-time-picker-panel__separator" aria-hidden="true">:</span>
      <div class="au-time-picker-panel__field">
        <label :for="`${panelId}-second`">秒</label>
        <AuSelect
          :id="`${panelId}-second`"
          :model-value="secondValue"
          size="small"
          :teleported="teleported"
          :append-to="appendTo"
          :z-index="zIndex"
          aria-label="秒"
          @update:model-value="updatePart('second', $event)"
        >
          <option v-for="second in seconds" :key="second" :value="pad(second)">
            {{ pad(second) }}
          </option>
        </AuSelect>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { AuSelect } from '../select/index.js';
import { buildSteppedValues, cloneDate, isValidDate } from '../../utils/date-time.js';

let timePanelSeed = 0;

const props = defineProps({
  modelValue: { type: Date, required: true },
  hourStep: { type: Number, default: 1 },
  minuteStep: { type: Number, default: 1 },
  secondStep: { type: Number, default: 1 },
  showSeconds: { type: Boolean, default: true },
  teleported: { type: Boolean, default: true },
  appendTo: { type: [String, Object], default: 'body' },
  zIndex: { type: Number, default: 1201 },
  ariaLabel: { type: String, default: '选择时间' },
});

const emit = defineEmits(['update:modelValue', 'change']);
const panelId = `au-time-picker-panel-${++timePanelSeed}`;
const currentDate = computed(() => (isValidDate(props.modelValue) ? props.modelValue : new Date()));
const hours = computed(() => buildSteppedValues(23, props.hourStep, currentDate.value.getHours()));
const minutes = computed(() => buildSteppedValues(59, props.minuteStep, currentDate.value.getMinutes()));
const seconds = computed(() => buildSteppedValues(59, props.secondStep, currentDate.value.getSeconds()));
const hourValue = computed(() => pad(currentDate.value.getHours()));
const minuteValue = computed(() => pad(currentDate.value.getMinutes()));
const secondValue = computed(() => pad(currentDate.value.getSeconds()));

function pad(value) {
  return String(value).padStart(2, '0');
}

function updatePart(part, rawValue) {
  const value = Number(rawValue);
  if (!Number.isInteger(value)) return;
  const date = cloneDate(currentDate.value);
  if (part === 'hour') date.setHours(value);
  else if (part === 'minute') date.setMinutes(value);
  else date.setSeconds(value);
  date.setMilliseconds(0);
  emit('update:modelValue', date);
  emit('change', date, part);
}
</script>

<style scoped lang="scss">
.au-time-picker-panel {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 5px;
  width: 100%;
  min-width: 0;
}

.au-time-picker-panel__field {
  display: grid;
  min-width: 0;
  flex: 1;
  gap: 5px;
}

.au-time-picker-panel__field label {
  padding-left: 3px;
  color: var(--au-color-text-secondary);
  font-size: 11px;
  font-weight: var(--au-font-weight-medium);
}

.au-time-picker-panel__separator {
  padding-bottom: 5px;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-base);
  font-weight: var(--au-font-weight-semibold);
}
</style>
