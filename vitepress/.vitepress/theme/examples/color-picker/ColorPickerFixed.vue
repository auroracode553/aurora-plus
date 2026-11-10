<template>
  <div class="color-picker-demo">
    <AuColorPicker v-model="color" type="fixed" :colors="colors" aria-label="固定色板" />
    <p>当前颜色：{{ color }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuColorPicker } from 'aurora-plus';
const color = ref('#3478f6');
const colors = [
  { name: '蓝色', color: '#3478f6' },
  { name: '绿色', color: '#2f9e72' },
  { name: '橙色', color: '#d98a24' },
  { name: '玫红', color: '#df4c62' },
  { name: '紫色', color: '#8b5cf6' },
  { name: '纯白', color: '#ffffff' },
  { name: '墨色', color: '#172033' },
];
</script>

<style scoped>
.color-picker-demo { display: grid; justify-items: start; gap: 14px; }
p { margin: 0; color: var(--au-color-text-secondary); font-size: 12px; }
</style>
