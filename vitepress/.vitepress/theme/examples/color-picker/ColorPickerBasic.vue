<template>
  <div class="color-picker-demo">
    <span class="color-picker-demo__label">系统取色</span>
    <div class="color-picker-demo__row">
      <AuColorPicker v-model="color" size="small" aria-label="小号颜色选择器" />
      <AuColorPicker v-model="color" aria-label="默认颜色选择器" />
      <AuColorPicker v-model="color" size="large" aria-label="大号颜色选择器" />
      <AuColorPicker model-value="#a8b0bd" disabled aria-label="禁用颜色选择器" />
    </div>
    <span class="color-picker-demo__label">预设颜色</span>
    <div class="color-picker-demo__row">
      <AuColorSwatch
        v-for="preset in presets"
        :key="preset.color"
        :color="preset.color"
        :selected="color === preset.color"
        :aria-label="preset.label"
        @select="color = $event"
      />
    </div>
    <p class="color-picker-demo__result">当前颜色：{{ color }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuColorPicker, AuColorSwatch } from 'aurora-plus';

const color = ref('#3478f6');
const presets = [
  { color: '#3478f6', label: '蓝色' },
  { color: '#2f9e72', label: '绿色' },
  { color: '#d98a24', label: '橙色' },
  { color: '#df4c62', label: '红色' },
  { color: '#8b5cf6', label: '紫色' },
  { color: '#ffffff', label: '白色' },
  { color: '#172033', label: '黑色' },
];
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

.color-picker-demo__label {
  margin-bottom: -8px;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
}

.color-picker-demo__result {
  margin: 0;
  color: var(--au-color-text-secondary);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: var(--au-font-size-small);
}
</style>
