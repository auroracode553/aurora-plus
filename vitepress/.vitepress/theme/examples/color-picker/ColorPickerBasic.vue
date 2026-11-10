<template>
  <div class="color-picker-demo">
    <div class="color-picker-demo__row">
      <AuColorPicker v-model="color" size="small" aria-label="小号自定义颜色" />
      <AuColorPicker v-model="color" aria-label="默认自定义颜色" />
      <AuColorPicker v-model="color" type="" size="large" aria-label="大号自定义颜色" />
      <AuColorPicker model-value="#a8b0bd" disabled aria-label="禁用自定义颜色" />
    </div>
    <p>当前颜色：{{ color }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuColorPicker } from 'aurora-plus';
const color = ref('#3478f6');
</script>

<style scoped>
.color-picker-demo { display: grid; gap: 14px; }
.color-picker-demo__row { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
p { margin: 0; color: var(--au-color-text-secondary); font-size: 12px; }
</style>
