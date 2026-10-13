<script setup>
import { AuTrend } from 'aurora-plus';
</script>

<template>
  <div class="trend-example">
    <AuTrend :value="12.5" label="上升 12.5%" />
    <AuTrend :value="-8.2" />
    <AuTrend :value="0" />
    <AuTrend fresh />
    <AuTrend :value="-5.6" reverse label="下降为正向变化" />
    <AuTrend :value="null" />
  </div>
</template>

<style scoped>
.trend-example { display: flex; flex-wrap: wrap; gap: 8px; }
</style>
