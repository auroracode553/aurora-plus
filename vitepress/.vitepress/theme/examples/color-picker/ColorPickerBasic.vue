<template>
  <div class="color-picker-demo">
    <div class="color-picker-demo__row">
      <AuColorPicker v-model="color" size="small" aria-label="小号颜色选择器" />
      <AuColorPicker v-model="color" aria-label="默认颜色选择器" />
      <AuColorPicker v-model="color" size="large" aria-label="大号颜色选择器" />
      <AuColorPicker model-value="#a8b0bd" disabled aria-label="禁用颜色选择器" />
    </div>
    <p class="color-picker-demo__result">当前颜色：{{ color }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuColorPicker } from 'aurora-ui';

const color = ref('#3478f6');
</script>

<style scoped>
.color-picker-demo {
  display: grid;
  gap: 14px;
}

.color-picker-demo__row {
  display: flex;
  align-items: center;
  min-height: 44px;
  gap: 14px;
  flex-wrap: wrap;
}

.color-picker-demo__result {
  margin: 0;
  color: var(--au-color-text-secondary);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: var(--au-font-size-small);
}
</style>
