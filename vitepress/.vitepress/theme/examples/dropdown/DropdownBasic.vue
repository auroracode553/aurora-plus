<template>
  <div class="dropdown-demo">
    <AuDropdown v-model="visible" :items="items" aria-label="项目操作">
      <template #trigger>
        <AuButton :icon="IconMenu2" :aria-expanded="visible">项目操作</AuButton>
      </template>
    </AuDropdown>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuButton, AuDropdown, IconCopy, IconLayoutSidebar, IconMenu2 } from 'aurora-plus';

const visible = ref(false);
const items = [
  { id: 'open', label: '打开项目', icon: IconLayoutSidebar, shortcut: '⌘O', command: 'open' },
  { id: 'duplicate', label: '复制项目', icon: IconCopy, command: 'duplicate' },
  { id: 'divider', type: 'divider' },
  { id: 'archive', label: '归档项目', disabled: true },
  { id: 'remove', label: '移除项目', danger: true, command: 'remove' },
];

</script>
