<template>
  <div class="time-picker-demo">
    <label>
      <span>提醒时间</span>
      <AuTimePicker
        v-model="time"
        min-time="08:30:00"
        max-time="20:00:00"
        :minute-step="5"
      />
    </label>
    <label>
      <span>不显示秒</span>
      <AuTimePicker v-model="shortTime" :show-seconds="false" :minute-step="15" />
    </label>
    <p>当前时间：{{ time }}；短格式：{{ shortTime }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuTimePicker } from 'aurora-ui';

const time = ref('09:30:00');
const shortTime = ref('14:45');
</script>

<style scoped>
.time-picker-demo {
  display: grid;
  width: min(100%, 460px);
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 12px;
}

.time-picker-demo label {
  display: grid;
  gap: 6px;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
}

.time-picker-demo p {
  grid-column: 1 / -1;
  margin: 0;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
}
</style>
