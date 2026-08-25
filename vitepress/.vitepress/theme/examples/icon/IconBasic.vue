<template>
  <div class="icon-demo">
    <div v-for="icon in icons" :key="icon.name" class="icon-demo__item">
      <AuIcon :name="icon.name" :color="icon.color" :size="icon.size" />
      <code>{{ icon.name }}</code>
    </div>
    <div class="icon-demo__item">
      <AuIcon :source="customIconSource" color="#8b5cf6" :size="24" aria-label="自定义菱形" />
      <code>source</code>
    </div>
  </div>
</template>

<script setup>
import { AuIcon } from 'aurora-ui';

const icons = [
  { name: 'close', color: '#f56c6c', size: 20 },
  { name: 'loading', color: '#409eff', size: 22 },
  { name: 'chevron-right', color: '#67c23a', size: 24 },
];

// source 只应使用项目内可信 SVG，不能直接接收用户输入。
const customIconSource = `
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2 22 12 12 22 2 12Z" />
  </svg>
`;
</script>

<style scoped>
.icon-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 12px;
}

.icon-demo__item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 88px;
  border: 1px solid var(--au-color-border-lighter);
  border-radius: 8px;
  flex-direction: column;
  gap: 12px;
}

.icon-demo__item code {
  color: var(--au-color-text-secondary);
  font-size: 12px;
}
</style>
