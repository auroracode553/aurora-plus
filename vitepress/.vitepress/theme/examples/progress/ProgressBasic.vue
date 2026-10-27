<script setup>
import { ref } from 'vue';
import { AuButton, AuProgress } from 'aurora-plus';

const percentage = ref(36);
function advance() { percentage.value = (percentage.value + 16) % 101; }
</script>

<template>
  <div class="progress-example">
    <AuProgress :percentage="percentage" />
    <AuProgress :percentage="100" status="success" />
    <div class="progress-example__rings">
      <AuProgress type="circle" :percentage="percentage" />
      <AuProgress type="ticks" :percentage="percentage" />
      <AuProgress type="circle" :percentage="72" status="warning" :width="80" :format="value => String(value)" />
    </div>
    <AuButton size="small" @click="advance">更新进度</AuButton>
  </div>
</template>

<style scoped>
.progress-example { display: grid; width: min(480px, 100%); gap: 16px; }
.progress-example__rings { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; }
.progress-example > button { justify-self: start; }
</style>
