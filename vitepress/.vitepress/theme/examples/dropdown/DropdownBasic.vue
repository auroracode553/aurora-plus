<template>
  <div class="dropdown-demo">
    <AuDropdown v-model="visible" :items="items" aria-label="项目操作" @select="handleSelect">
      <template #trigger>
        <AuButton icon="menu" :aria-expanded="visible">项目操作</AuButton>
      </template>
    </AuDropdown>

    <p class="dropdown-demo__result">最近操作：{{ lastAction || '暂无' }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuButton, AuDropdown } from 'aurora-ui';

const visible = ref(false);
const lastAction = ref('');
const items = [
  { id: 'open', label: '打开项目', icon: 'panel', shortcut: '⌘O', command: 'open' },
  { id: 'duplicate', label: '复制项目', icon: 'copy', command: 'duplicate' },
  { id: 'divider', type: 'divider' },
  { id: 'archive', label: '归档项目', disabled: true },
  { id: 'remove', label: '移除项目', danger: true, command: 'remove' },
];

function handleSelect(item) {
  lastAction.value = item.label;
}
</script>

<style scoped>
.dropdown-demo__result {
  margin: 16px 0 0;
  color: var(--au-color-text-secondary);
  font-size: 13px;
}
</style>
