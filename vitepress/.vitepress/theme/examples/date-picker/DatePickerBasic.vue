<template>
  <div class="date-picker-demo">
    <div class="date-picker-demo__fields">
      <label>
        <span>日期</span>
        <AuDatePicker
          v-model="date"
          :min-date="minimumDate"
          :disabled-date="disableWeekends"
        />
      </label>
      <label>
        <span>日期时间</span>
        <AuDateTimePicker v-model="dateTime" :minute-step="5" :min-date="minimumDateTime" />
      </label>
      <label class="date-picker-demo__range">
        <span>日期范围</span>
        <AuDatePicker
          v-model="dateRange"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :min-date="minimumDate"
        />
      </label>
    </div>

    <p>日期：{{ date || '未选择' }}</p>
    <p>日期时间：{{ dateTime || '未选择' }}</p>
    <p>日期范围：{{ dateRange.length ? dateRange.join(' 至 ') : '未选择' }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuDatePicker, AuDateTimePicker } from 'aurora-plus';

const date = ref('2026-08-28');
const dateTime = ref('2026-08-30 14:30:00');
const dateRange = ref(['2026-08-18', '2026-08-26']);
const minimumDate = '2026-08-01';
const minimumDateTime = '2026-08-01 09:00:00';

function disableWeekends(dateValue) {
  return dateValue.getDay() === 0 || dateValue.getDay() === 6;
}
</script>

<style scoped>
.date-picker-demo {
  display: grid;
  width: min(100%, 640px);
  gap: 12px;
}

.date-picker-demo__fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 12px;
}

.date-picker-demo__fields label {
  display: grid;
  gap: 6px;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
}

.date-picker-demo__range {
  grid-column: 1 / -1;
}

.date-picker-demo p {
  margin: 0;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
}
</style>
